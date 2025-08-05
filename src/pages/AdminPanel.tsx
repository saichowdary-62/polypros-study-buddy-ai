import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface QuestionPaper {
  id: string;
  title: string;
  year: number | null;
  month: string | null;
  exam_type: string | null;
  file_name: string | null;
  file_size: number | null;
  file_url: string | null;
  created_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === 'team') {
      setIsAuthenticated(true);
      fetchQuestionPapers();
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const fetchQuestionPapers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('question_papers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestionPapers(data || []);
    } catch (error) {
      console.error('Error fetching question papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch question papers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setQuestionPapers(prev => prev.filter(paper => paper.id !== id));
      toast({
        title: "Success",
        description: "Question paper deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting question paper:', error);
      toast({
        title: "Error",
        description: "Failed to delete question paper",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Papers Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionPapers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">{paper.title}</TableCell>
                      <TableCell>{paper.year || 'N/A'}</TableCell>
                      <TableCell>{paper.month || 'N/A'}</TableCell>
                      <TableCell>
                        {paper.exam_type ? (
                          <Badge variant="secondary">{paper.exam_type}</Badge>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{paper.file_name || 'N/A'}</TableCell>
                      <TableCell>{formatFileSize(paper.file_size)}</TableCell>
                      <TableCell>
                        {new Date(paper.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {paper.file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(paper.file_url!, '_blank')}
                            >
                              View
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(paper.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {questionPapers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No question papers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;