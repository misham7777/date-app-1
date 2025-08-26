-- Migration: Create Lead Tracking Tables
-- This migration creates tables to track form submissions and quiz drop-offs

-- 1. Leads table - tracks all form submissions from home page
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    search_type TEXT DEFAULT 'partner',
    source_page TEXT DEFAULT 'home',
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Quiz Sessions table - tracks quiz progress and drop-offs
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 3,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    dropped_off_at TIMESTAMP WITH TIME ZONE,
    drop_off_step INTEGER,
    drop_off_reason TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Quiz Answers table - tracks individual quiz responses
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    quiz_session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('name', 'age', 'location', 'photo')),
    answer_data JSONB NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Quiz Drop-offs table - detailed drop-off tracking
CREATE TABLE IF NOT EXISTS quiz_drop_offs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    quiz_session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    drop_off_reason TEXT,
    time_spent_seconds INTEGER,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Funnel Analytics table - aggregated funnel metrics
CREATE TABLE IF NOT EXISTS funnel_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    visitors_count INTEGER DEFAULT 0,
    completions_count INTEGER DEFAULT 0,
    drop_offs_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, step_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_session_id ON quiz_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_lead_id ON quiz_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_dropped_off_at ON quiz_sessions(dropped_off_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_is_completed ON quiz_sessions(is_completed);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_quiz_session_id ON quiz_answers(quiz_session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_step_number ON quiz_answers(step_number);

CREATE INDEX IF NOT EXISTS idx_quiz_drop_offs_session_id ON quiz_drop_offs(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_drop_offs_step_number ON quiz_drop_offs(step_number);
CREATE INDEX IF NOT EXISTS idx_quiz_drop_offs_created_at ON quiz_drop_offs(created_at);

CREATE INDEX IF NOT EXISTS idx_funnel_analytics_date ON funnel_analytics(date);
CREATE INDEX IF NOT EXISTS idx_funnel_analytics_step_number ON funnel_analytics(step_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_sessions_updated_at BEFORE UPDATE ON quiz_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funnel_analytics_updated_at BEFORE UPDATE ON funnel_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to track quiz drop-offs
CREATE OR REPLACE FUNCTION track_quiz_drop_off()
RETURNS TRIGGER AS $$
BEGIN
    -- If quiz session is marked as dropped off, insert into drop_offs table
    IF NEW.dropped_off_at IS NOT NULL AND OLD.dropped_off_at IS NULL THEN
        INSERT INTO quiz_drop_offs (
            session_id,
            quiz_session_id,
            step_number,
            step_name,
            drop_off_reason,
            time_spent_seconds,
            user_agent,
            ip_address
        ) VALUES (
            NEW.session_id,
            NEW.id,
            NEW.drop_off_step,
            CASE 
                WHEN NEW.drop_off_step = 1 THEN 'age_input'
                WHEN NEW.drop_off_step = 2 THEN 'location_input'
                WHEN NEW.drop_off_step = 3 THEN 'photo_upload'
                ELSE 'unknown'
            END,
            NEW.drop_off_reason,
            EXTRACT(EPOCH FROM (NEW.dropped_off_at - NEW.started_at))::INTEGER,
            (SELECT user_agent FROM leads WHERE session_id = NEW.session_id LIMIT 1),
            (SELECT ip_address FROM leads WHERE session_id = NEW.session_id LIMIT 1)
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for quiz drop-off tracking
CREATE TRIGGER track_quiz_drop_off_trigger 
    AFTER UPDATE ON quiz_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION track_quiz_drop_off();

-- Create function to update funnel analytics
CREATE OR REPLACE FUNCTION update_funnel_analytics()
RETURNS TRIGGER AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    step_name TEXT;
BEGIN
    -- Determine step name
    step_name := CASE 
        WHEN NEW.step_number = 1 THEN 'age_input'
        WHEN NEW.step_number = 2 THEN 'location_input'
        WHEN NEW.step_number = 3 THEN 'photo_upload'
        ELSE 'unknown'
    END;
    
    -- Insert or update funnel analytics
    INSERT INTO funnel_analytics (
        date, step_number, step_name, visitors_count, completions_count, drop_offs_count
    ) VALUES (
        current_date, NEW.step_number, step_name, 1, 0, 0
    )
    ON CONFLICT (date, step_number) 
    DO UPDATE SET 
        visitors_count = funnel_analytics.visitors_count + 1,
        updated_at = NOW();
    
    -- If completed, update completion count
    IF NEW.is_completed = TRUE THEN
        UPDATE funnel_analytics 
        SET completions_count = completions_count + 1,
            conversion_rate = (completions_count + 1)::DECIMAL / visitors_count * 100,
            updated_at = NOW()
        WHERE date = current_date AND step_number = NEW.step_number;
    END IF;
    
    -- If dropped off, update drop-off count
    IF NEW.dropped_off_at IS NOT NULL THEN
        UPDATE funnel_analytics 
        SET drop_offs_count = drop_offs_count + 1,
            updated_at = NOW()
        WHERE date = current_date AND step_number = NEW.drop_off_step;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for funnel analytics
CREATE TRIGGER update_funnel_analytics_trigger 
    AFTER INSERT OR UPDATE ON quiz_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_funnel_analytics();

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_drop_offs ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access (for tracking)
CREATE POLICY "Allow anonymous insert on leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on quiz_sessions" ON quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on quiz_answers" ON quiz_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on quiz_drop_offs" ON quiz_drop_offs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on funnel_analytics" ON funnel_analytics FOR INSERT WITH CHECK (true);

-- Create RLS policies for authenticated users (for viewing analytics)
CREATE POLICY "Allow authenticated select on leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on quiz_sessions" ON quiz_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on quiz_answers" ON quiz_answers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on quiz_drop_offs" ON quiz_drop_offs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on funnel_analytics" ON funnel_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for updates
CREATE POLICY "Allow authenticated update on leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on quiz_sessions" ON quiz_sessions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on quiz_answers" ON quiz_answers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on funnel_analytics" ON funnel_analytics FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data for testing (optional)
-- INSERT INTO leads (session_id, name, email, search_type) VALUES 
-- ('test_session_1', 'John Doe', 'john@example.com', 'partner'),
-- ('test_session_2', 'Jane Smith', 'jane@example.com', 'partner');

COMMENT ON TABLE leads IS 'Tracks all form submissions from home page';
COMMENT ON TABLE quiz_sessions IS 'Tracks quiz progress and drop-offs';
COMMENT ON TABLE quiz_answers IS 'Tracks individual quiz responses';
COMMENT ON TABLE quiz_drop_offs IS 'Detailed drop-off tracking';
COMMENT ON TABLE funnel_analytics IS 'Aggregated funnel metrics for reporting';
