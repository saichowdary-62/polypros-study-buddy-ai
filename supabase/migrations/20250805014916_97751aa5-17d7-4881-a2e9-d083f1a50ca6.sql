-- Fix storage policies for question-papers bucket to allow public uploads
-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Allow admin upload to question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete from question papers storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to question papers storage" ON storage.objects;

-- Create new policies that allow all operations without authentication
CREATE POLICY "Allow public upload to question papers" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'question-papers');

CREATE POLICY "Allow public update question papers" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'question-papers');

CREATE POLICY "Allow public delete question papers" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'question-papers');

CREATE POLICY "Allow public read question papers" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'question-papers');