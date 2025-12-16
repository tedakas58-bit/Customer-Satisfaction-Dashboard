-- FRESH SUPABASE SCHEMA - Customer Satisfaction Survey
-- Run this AFTER running supabase-reset.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create survey_responses table
CREATE TABLE survey_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Demographics
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    age TEXT NOT NULL CHECK (age IN ('18-30', '31-40', '41-50', '50+')),
    marital_status TEXT NOT NULL CHECK (marital_status IN ('married', 'single', 'divorced', 'widowed')),
    education_level TEXT NOT NULL CHECK (education_level IN ('unfilled', '1-8', '9-12', 'certificate', 'diploma', 'first_degree', 'second_degree_plus')),
    
    -- Survey responses (JSON format)
    responses JSONB NOT NULL,
    
    -- Computed fields
    overall_score DECIMAL(3,2) NOT NULL,
    dimension_scores JSONB NOT NULL,
    completion_rate DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    
    -- Metadata
    ip_address INET,
    session_id TEXT
);

-- Create questions table
CREATE TABLE questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id TEXT UNIQUE NOT NULL,
    dimension TEXT NOT NULL CHECK (dimension IN ('tangibility', 'responsiveness', 'reliability', 'assurance', 'empathy')),
    text_amharic TEXT NOT NULL,
    text_english TEXT NOT NULL,
    order_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_responses_created_at ON survey_responses(created_at);
CREATE INDEX idx_survey_responses_gender ON survey_responses(gender);
CREATE INDEX idx_survey_responses_age ON survey_responses(age);
CREATE INDEX idx_survey_responses_education ON survey_responses(education_level);
CREATE INDEX idx_survey_responses_overall_score ON survey_responses(overall_score);
CREATE INDEX idx_questions_dimension ON questions(dimension);
CREATE INDEX idx_questions_order ON questions(order_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_survey_responses_updated_at 
    BEFORE UPDATE ON survey_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert ALL 15 questions (complete set)
INSERT INTO questions (question_id, dimension, text_amharic, text_english, order_number) VALUES
-- Tangibility (ተጨባጭነት)
('q1_facilities', 'tangibility', 'የቢሮው አካባቢ ንጹህና ደህንነቱ የተጠበቀ ነው', 'The office environment is clean and safe', 1),
('q2_equipment', 'tangibility', 'ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው', 'The office has modern equipment and technology', 2),
('q3_materials', 'tangibility', 'የመረጃ ቁሳቁሶች ግልጽና ተደራሽ ናቸው', 'Information materials are clear and accessible', 3),

-- Responsiveness (ፈጣን አገልግሎት)
('q4_prompt_service', 'responsiveness', 'ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ', 'Staff provide prompt service', 4),
('q5_willingness', 'responsiveness', 'ሰራተኞች ለመርዳት ፈቃደኛ ናቸው', 'Staff are willing to help', 5),
('q6_availability', 'responsiveness', 'ሰራተኞች ሁልጊዜ ይገኛሉ', 'Staff are always available', 6),

-- Reliability (ተዓማኒነት)
('q7_promised_time', 'reliability', 'አገልግሎቱ በተገለጸው ጊዜ ይሰጣል', 'Service is delivered at the promised time', 7),
('q8_problem_solving', 'reliability', 'ችግሮች በተገቢው መንገድ ይፈታሉ', 'Problems are solved appropriately', 8),
('q9_dependable', 'reliability', 'አገልግሎቱ ተዓማኒ ነው', 'The service is dependable', 9),

-- Assurance (የሰራተኞች ብቃት)
('q10_competence', 'assurance', 'ሰራተኞች በቂ እውቀትና ክህሎት አላቸው', 'Staff have adequate knowledge and skills', 10),
('q11_courtesy', 'assurance', 'ሰራተኞች ትሁትና አክባሪ ናቸው', 'Staff are courteous and respectful', 11),
('q12_confidence', 'assurance', 'በአገልግሎቱ ላይ መተማመን አለኝ', 'I have confidence in the service', 12),

-- Empathy (ተሳትፎ)
('q13_individual_attention', 'empathy', 'ሰራተኞች ለእያንዳንዱ ደንበኛ ልዩ ትኩረት ይሰጣሉ', 'Staff give individual attention to each customer', 13),
('q14_understanding', 'empathy', 'ሰራተኞች የደንበኞችን ፍላጎት ይረዳሉ', 'Staff understand customer needs', 14),
('q15_best_interests', 'empathy', 'ሰራተኞች የደንበኞችን ጥቅም ያስቀድማሉ', 'Staff act in customers best interests', 15);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to questions" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to survey_responses" ON survey_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to survey_responses" ON survey_responses
    FOR SELECT USING (true);

-- Create a view for analytics
CREATE VIEW survey_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as daily_responses,
    AVG(overall_score) as avg_score,
    gender,
    age,
    education_level
FROM survey_responses
GROUP BY DATE_TRUNC('day', created_at), gender, age, education_level
ORDER BY date DESC;

-- Verify the setup
SELECT 
    'Setup complete!' as status,
    (SELECT COUNT(*) FROM questions) as total_questions,
    (SELECT COUNT(*) FROM questions WHERE is_active = true) as active_questions,
    (SELECT COUNT(DISTINCT dimension) FROM questions) as dimensions;