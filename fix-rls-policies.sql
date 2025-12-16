-- Fix RLS Policies to Allow Deletions
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to survey_responses" ON survey_responses;
DROP POLICY IF EXISTS "Allow public insert to survey_responses" ON survey_responses;

-- Create new policies that allow deletions
CREATE POLICY "Allow public read access to survey_responses" ON survey_responses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to survey_responses" ON survey_responses
    FOR INSERT WITH CHECK (true);

-- Add DELETE policy (this was missing!)
CREATE POLICY "Allow public delete access to survey_responses" ON survey_responses
    FOR DELETE USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'survey_responses';