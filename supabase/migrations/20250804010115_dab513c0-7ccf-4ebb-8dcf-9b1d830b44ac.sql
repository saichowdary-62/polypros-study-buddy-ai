-- Fix RLS policies for question_papers table to ensure uploads work
DROP POLICY IF EXISTS "Allow all operations on question papers" ON public.question_papers;
DROP POLICY IF EXISTS "Allow public read access to question papers" ON public.question_papers;

-- Create proper RLS policies that allow all operations without authentication
CREATE POLICY "Enable all operations for question papers" 
ON public.question_papers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;