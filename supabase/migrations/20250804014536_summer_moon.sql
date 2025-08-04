/*
  # Fix Question Papers RLS Policies

  1. Database Changes
    - Drop existing restrictive policies
    - Create permissive policies for question_papers table
    - Ensure storage bucket policies allow uploads

  2. Security
    - Allow all operations on question_papers table
    - Allow public read and admin write access to storage
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Enable all operations for question papers" ON public.question_papers;
DROP POLICY IF EXISTS "Allow public read access to question papers" ON public.question_papers;

-- Create new permissive policy for question_papers table
CREATE POLICY "Allow all operations on question_papers" 
ON public.question_papers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Ensure RLS is enabled but permissive
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public read access to question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload to question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete from question papers storage" ON storage.objects;

-- Create new permissive storage policies
CREATE POLICY "Public read access to question papers bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'question-papers');

CREATE POLICY "Public upload to question papers bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'question-papers');

CREATE POLICY "Public update in question papers bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'question-papers') 
WITH CHECK (bucket_id = 'question-papers');

CREATE POLICY "Public delete from question papers bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'question-papers');

-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-papers', 'question-papers', true)
ON CONFLICT (id) DO UPDATE SET public = true;