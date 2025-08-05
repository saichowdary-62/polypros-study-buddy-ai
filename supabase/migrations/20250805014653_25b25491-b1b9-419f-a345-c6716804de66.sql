-- Check and fix RLS policies for question_papers table
-- First, ensure RLS is enabled
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable all operations for question papers" ON public.question_papers;
DROP POLICY IF EXISTS "Allow all operations on question papers" ON public.question_papers;
DROP POLICY IF EXISTS "Allow public read access to question papers" ON public.question_papers;

-- Create comprehensive policies that allow all operations without authentication
CREATE POLICY "allow_all_select" ON public.question_papers
  FOR SELECT USING (true);

CREATE POLICY "allow_all_insert" ON public.question_papers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_all_update" ON public.question_papers
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_delete" ON public.question_papers
  FOR DELETE USING (true);