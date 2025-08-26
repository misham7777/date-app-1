-- Migration: Create Searches Table and Tracking System
-- This migration creates the searches table and all related tracking tables

-- First, create the main searches table
CREATE TABLE IF NOT EXISTS searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    name TEXT,
    email TEXT,
    search_type TEXT DEFAULT 'partner',
    source_page TEXT DEFAULT 'home',
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_searches_session_id ON searches(session_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at);
CREATE INDEX IF NOT EXISTS idx_searches_email ON searches(email);
CREATE INDEX IF NOT EXISTS idx_searches_dropped_off_at ON searches(dropped_off_at);
CREATE INDEX IF NOT EXISTS idx_searches_is_completed ON searches(is_completed);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to searches table
DROP TRIGGER IF EXISTS update_searches_updated_at ON searches;
CREATE TRIGGER update_searches_updated_at 
    BEFORE UPDATE ON searches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create quiz answers table to track individual responses
CREATE TABLE IF NOT EXISTS search_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('name', 'age', 'location', 'photo')),
    answer_data JSONB NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for search_answers
CREATE INDEX IF NOT EXISTS idx_search_answers_search_id ON search_answers(search_id);
CREATE INDEX IF NOT EXISTS idx_search_answers_session_id ON search_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_search_answers_step_number ON search_answers(step_number);

-- Create drop-offs table for detailed tracking
CREATE TABLE IF NOT EXISTS search_drop_offs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    drop_off_reason TEXT,
    time_spent_seconds INTEGER,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for search_drop_offs
CREATE INDEX IF NOT EXISTS idx_search_drop_offs_search_id ON search_drop_offs(search_id);
CREATE INDEX IF NOT EXISTS idx_search_drop_offs_step_number ON search_drop_offs(step_number);
CREATE INDEX IF NOT EXISTS idx_search_drop_offs_created_at ON search_drop_offs(created_at);

-- Create funnel analytics table
CREATE TABLE IF NOT EXISTS search_funnel_analytics (
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

-- Create indexes for funnel analytics
CREATE INDEX IF NOT EXISTS idx_search_funnel_analytics_date ON search_funnel_analytics(date);
CREATE INDEX IF NOT EXISTS idx_search_funnel_analytics_step_number ON search_funnel_analytics(step_number);

-- Add updated_at trigger to funnel analytics
CREATE TRIGGER update_search_funnel_analytics_updated_at 
    BEFORE UPDATE ON search_funnel_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to track search drop-offs
CREATE OR REPLACE FUNCTION track_search_drop_off()
RETURNS TRIGGER AS $$
BEGIN
    -- If search is marked as dropped off, insert into drop_offs table
    IF NEW.dropped_off_at IS NOT NULL AND OLD.dropped_off_at IS NULL THEN
        INSERT INTO search_drop_offs (
            search_id,
            session_id,
            step_number,
            step_name,
            drop_off_reason,
            time_spent_seconds,
            user_agent,
            ip_address
        ) VALUES (
            NEW.id,
            NEW.session_id,
            NEW.drop_off_step,
            CASE 
                WHEN NEW.drop_off_step = 1 THEN 'age_input'
                WHEN NEW.drop_off_step = 2 THEN 'location_input'
                WHEN NEW.drop_off_step = 3 THEN 'photo_upload'
                ELSE 'unknown'
            END,
            NEW.drop_off_reason,
            EXTRACT(EPOCH FROM (NEW.dropped_off_at - NEW.started_at))::INTEGER,
            NEW.user_agent,
            NEW.ip_address
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for search drop-off tracking
DROP TRIGGER IF EXISTS track_search_drop_off_trigger ON searches;
CREATE TRIGGER track_search_drop_off_trigger 
    AFTER UPDATE ON searches 
    FOR EACH ROW 
    EXECUTE FUNCTION track_search_drop_off();

-- Create function to update funnel analytics
CREATE OR REPLACE FUNCTION update_search_funnel_analytics()
RETURNS TRIGGER AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    step_name TEXT;
BEGIN
    -- Determine step name
    step_name := CASE 
        WHEN NEW.current_step = 1 THEN 'age_input'
        WHEN NEW.current_step = 2 THEN 'location_input'
        WHEN NEW.current_step = 3 THEN 'photo_upload'
        ELSE 'unknown'
    END;
    
    -- Insert or update funnel analytics
    INSERT INTO search_funnel_analytics (
        date, step_number, step_name, visitors_count, completions_count, drop_offs_count
    ) VALUES (
        current_date, NEW.current_step, step_name, 1, 0, 0
    )
    ON CONFLICT (date, step_number) 
    DO UPDATE SET 
        visitors_count = search_funnel_analytics.visitors_count + 1,
        updated_at = NOW();
    
    -- If completed, update completion count
    IF NEW.is_completed = TRUE THEN
        UPDATE search_funnel_analytics 
        SET completions_count = completions_count + 1,
            conversion_rate = (completions_count + 1)::DECIMAL / visitors_count * 100,
            updated_at = NOW()
        WHERE date = current_date AND step_number = NEW.current_step;
    END IF;
    
    -- If dropped off, update drop-off count
    IF NEW.dropped_off_at IS NOT NULL THEN
        UPDATE search_funnel_analytics 
        SET drop_offs_count = drop_offs_count + 1,
            updated_at = NOW()
        WHERE date = current_date AND step_number = NEW.drop_off_step;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for funnel analytics
DROP TRIGGER IF EXISTS update_search_funnel_analytics_trigger ON searches;
CREATE TRIGGER update_search_funnel_analytics_trigger 
    AFTER INSERT OR UPDATE ON searches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_search_funnel_analytics();

-- Enable Row Level Security (RLS)
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_drop_offs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_funnel_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access (for tracking)
CREATE POLICY "Allow anonymous insert on searches" ON searches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on search_answers" ON search_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on search_drop_offs" ON search_drop_offs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert on search_funnel_analytics" ON search_funnel_analytics FOR INSERT WITH CHECK (true);

-- Create RLS policies for authenticated users (for viewing analytics)
CREATE POLICY "Allow authenticated select on searches" ON searches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on search_answers" ON search_answers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on search_drop_offs" ON search_drop_offs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated select on search_funnel_analytics" ON search_funnel_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for updates
CREATE POLICY "Allow authenticated update on searches" ON searches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on search_answers" ON search_answers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on search_funnel_analytics" ON search_funnel_analytics FOR UPDATE USING (auth.role() = 'authenticated');

-- Add comments
COMMENT ON TABLE searches IS 'Main table for tracking search leads and quiz progress';
COMMENT ON TABLE search_answers IS 'Tracks individual quiz responses';
COMMENT ON TABLE search_drop_offs IS 'Detailed drop-off tracking';
COMMENT ON TABLE search_funnel_analytics IS 'Aggregated funnel metrics for reporting';
