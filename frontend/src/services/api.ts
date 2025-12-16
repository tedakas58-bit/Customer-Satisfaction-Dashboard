import axios from 'axios';

// API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API functions
export const fetchOverallSummary = async () => {
  const response = await api.get('/data/overall_summary');
  return response.data;
};

export const fetchDimensionScores = async () => {
  const response = await api.get('/data/dimension_scores');
  return response.data;
};

export const fetchQuestionPerformance = async (params?: { sort?: 'asc' | 'desc'; limit?: number }) => {
  const response = await api.get('/data/question_performance', { params });
  return response.data;
};

export const fetchFilteredAnalysis = async (filters: Record<string, any>) => {
  const response = await api.get('/data/filtered_analysis', { params: filters });
  return response.data;
};

export const submitSurveyResponse = async (responseData: any) => {
  const response = await api.post('/responses', responseData);
  return response.data;
};

export default api;