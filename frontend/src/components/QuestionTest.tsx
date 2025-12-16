import { useEffect, useState } from 'react';
import { Box, Typography, Card, CircularProgress, Alert } from '@mui/material';
import { questionService } from '../services/supabaseService';

const QuestionTest = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionService.getAll();
        setQuestions(data);
        console.log('Fetched questions:', data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
        Questions Test ({questions.length} questions found)
      </Typography>
      
      {questions.map((question, index) => (
        <Card key={question.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {index + 1}. {question.text_english}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Amharic: {question.text_amharic}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Dimension: {question.dimension} | Order: {question.order_number} | Active: {question.is_active ? 'Yes' : 'No'}
          </Typography>
        </Card>
      ))}
    </Box>
  );
};

export default QuestionTest;