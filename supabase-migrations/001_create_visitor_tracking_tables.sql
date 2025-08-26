-- Create tables for tracking website visitor data
-- Migration: 001_create_visitor_tracking_tables.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to track quiz sessions
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    total_steps INTEGER DEFAULT 4,
    current_step INTEGER DEFAULT 1
);

-- Table to track quiz answers
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'name', 'age', 'location', 'photo'
    answer_data JSONB NOT NULL, -- Store answers as JSON for flexibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track page views and navigation
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    page_path VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    time_spent_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track user interactions (clicks, form submissions, etc.)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'click', 'form_submit', 'button_press', 'file_upload'
    element_id VARCHAR(255),
    element_text TEXT,
    page_path VARCHAR(255),
    interaction_data JSONB, -- Additional data about the interaction
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track payment attempts and conversions
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    payment_method VARCHAR(50), -- 'card', 'bank', 'googlepay', etc.
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- 'attempted', 'successful', 'failed', 'abandoned'
    error_message TEXT,
    payment_data JSONB, -- Store payment form data (without sensitive info)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Table to track loading screen interactions
CREATE TABLE IF NOT EXISTS loading_screen_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'started', 'progress_update', 'completed', 'error'
    progress_percentage INTEGER,
    profiles_analyzed INTEGER,
    loading_message TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track device and browser information
CREATE TABLE IF NOT EXISTS device_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    operating_system VARCHAR(100),
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    screen_resolution VARCHAR(50),
    viewport_size VARCHAR(50),
    language VARCHAR(10),
    timezone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track conversion funnel
CREATE TABLE IF NOT EXISTS conversion_funnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    funnel_step VARCHAR(50) NOT NULL, -- 'quiz_start', 'quiz_complete', 'loading_start', 'loading_complete', 'checkout_view', 'payment_attempt', 'payment_success'
    step_order INTEGER NOT NULL,
    time_spent_seconds INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_session_id ON quiz_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_session_id ON payment_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_loading_screen_events_session_id ON loading_screen_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_session_id ON conversion_funnel(session_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_quiz_sessions_updated_at 
    BEFORE UPDATE ON quiz_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loading_screen_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnel ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for tracking)
CREATE POLICY "Allow anonymous insert on quiz_sessions" ON quiz_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on quiz_answers" ON quiz_answers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on page_views" ON page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on user_interactions" ON user_interactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on payment_attempts" ON payment_attempts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on loading_screen_events" ON loading_screen_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on device_info" ON device_info
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on conversion_funnel" ON conversion_funnel
    FOR INSERT WITH CHECK (true);

-- Create policies for reading data (you can restrict this based on your needs)
CREATE POLICY "Allow read on quiz_sessions" ON quiz_sessions
    FOR SELECT USING (true);

CREATE POLICY "Allow read on quiz_answers" ON quiz_answers
    FOR SELECT USING (true);

CREATE POLICY "Allow read on page_views" ON page_views
    FOR SELECT USING (true);

CREATE POLICY "Allow read on user_interactions" ON user_interactions
    FOR SELECT USING (true);

CREATE POLICY "Allow read on payment_attempts" ON payment_attempts
    FOR SELECT USING (true);

CREATE POLICY "Allow read on loading_screen_events" ON loading_screen_events
    FOR SELECT USING (true);

CREATE POLICY "Allow read on device_info" ON device_info
    FOR SELECT USING (true);

CREATE POLICY "Allow read on conversion_funnel" ON conversion_funnel
    FOR SELECT USING (true);
