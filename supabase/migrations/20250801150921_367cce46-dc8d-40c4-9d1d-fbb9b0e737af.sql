-- Create tables for question papers system

-- Regulations table
CREATE TABLE public.regulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- C20, C23
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL, -- 1, 2, 3, 4, 5, 6
  name TEXT NOT NULL, -- "1st & 2nd", "3rd", "4th", "5th", "6th"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- CME, ECE, etc.
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  regulation_id UUID NOT NULL REFERENCES public.regulations(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(regulation_id, semester_id, branch_id, code)
);

-- Question papers table
CREATE TABLE public.question_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER,
  month TEXT,
  exam_type TEXT, -- Mid-term, End-term, Supplementary
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to regulations" 
ON public.regulations FOR SELECT USING (true);

CREATE POLICY "Allow public read access to semesters" 
ON public.semesters FOR SELECT USING (true);

CREATE POLICY "Allow public read access to branches" 
ON public.branches FOR SELECT USING (true);

CREATE POLICY "Allow public read access to subjects" 
ON public.subjects FOR SELECT USING (true);

CREATE POLICY "Allow public read access to question papers" 
ON public.question_papers FOR SELECT USING (true);

-- Admin policies (for authenticated admin users)
CREATE POLICY "Allow admin full access to regulations" 
ON public.regulations FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin full access to semesters" 
ON public.semesters FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin full access to branches" 
ON public.branches FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin full access to subjects" 
ON public.subjects FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin full access to question papers" 
ON public.question_papers FOR ALL USING (auth.uid() IS NOT NULL);

-- Create storage bucket for question papers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-papers', 'question-papers', true);

-- Storage policies
CREATE POLICY "Allow public read access to question papers storage" 
ON storage.objects FOR SELECT USING (bucket_id = 'question-papers');

CREATE POLICY "Allow admin upload to question papers storage" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'question-papers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin update question papers storage" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'question-papers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete from question papers storage" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'question-papers' AND auth.uid() IS NOT NULL);

-- Insert default data
INSERT INTO public.regulations (code, name, description) VALUES 
('C20', 'C20 Regulation', 'Curriculum 2020 Regulation'),
('C23', 'C23 Regulation', 'Curriculum 2023 Regulation');

INSERT INTO public.semesters (number, name) VALUES 
(1, '1st & 2nd Semester'),
(3, '3rd Semester'),
(4, '4th Semester'),
(5, '5th Semester'),
(6, '6th Semester');

INSERT INTO public.branches (code, name, description) VALUES 
('CME', 'Computer Engineering', 'Computer Engineering Branch'),
('ECE', 'Electronics & Communication', 'Electronics & Communication Engineering'),
('EEE', 'Electrical & Electronics', 'Electrical & Electronics Engineering'),
('MECH', 'Mechanical Engineering', 'Mechanical Engineering Branch'),
('CIVIL', 'Civil Engineering', 'Civil Engineering Branch'),
('AUTO', 'Automobile Engineering', 'Automobile Engineering Branch');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_regulations_updated_at
BEFORE UPDATE ON public.regulations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_semesters_updated_at
BEFORE UPDATE ON public.semesters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_branches_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_papers_updated_at
BEFORE UPDATE ON public.question_papers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();