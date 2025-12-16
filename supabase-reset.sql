-- SUPABASE DATABASE RESET SCRIPT
-- This will completely clear all data and reset the database to a clean state

-- ⚠️ WARNING: This will delete ALL data in your database!
-- Only run this if you want to start completely fresh

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to questions" ON questions;
DROP POLICY IF EXISTS "Allow public insert to survey_responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow public read access to survey_responses" ON survey_responses;

-- 2. Drop all views
DROP VIEW IF EXISTS survey_analytics;

-- 3. Drop all triggers
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;

-- 4. Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 5. Drop all indexes
DROP INDEX IF EXISTS idx_survey_responses_created_at;
DROP INDEX IF EXISTS idx_survey_responses_gender;
DROP INDEX IF EXISTS idx_survey_responses_age;
DROP INDEX IF EXISTS idx_survey_responses_education;
DROP INDEX IF EXISTS idx_survey_responses_overall_score;
DROP INDEX IF EXISTS idx_questions_dimension;
DROP INDEX IF EXISTS idx_questions_order;

-- 6. Drop all tables (CASCADE will remove all dependencies)
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- 7. Clear any authentication data (if you want to reset admin users too)
-- Note: This requires service role key, not anon key
-- DELETE FROM auth.users; -- Uncomment this line if you want to delete all users

-- Success message
SELECT 'Database has been completely reset! You can now run the fresh schema.' as message;