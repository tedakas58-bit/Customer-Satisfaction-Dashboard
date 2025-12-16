import axios from 'axios';
import { surveyResponseService, questionService } from './supabaseService';

// API base URL (fallback for non-Supabase endpoints)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for fallback
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

// Helper function to calculate dimension scores from responses
const calculateDimensionScores = (responses: any) => {
  const dimensions = {
    tangibility: [responses.q1_facilities, responses.q2_equipment, responses.q3_materials],
    responsiveness: [responses.q4_prompt_service, responses.q5_willingness, responses.q6_availability],
    reliability: [responses.q7_promised_time, responses.q8_problem_solving, responses.q9_dependable],
    assurance: [responses.q10_competence, responses.q11_courtesy, responses.q12_confidence],
    empathy: [responses.q13_individual_attention, responses.q14_understanding, responses.q15_best_interests]
  };

  const dimensionScores: Record<string, number> = {};
  Object.entries(dimensions).forEach(([key, values]) => {
    const validValues = values.filter(v => v !== undefined && v !== null);
    dimensionScores[key] = validValues.length > 0 
      ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
      : 0;
  });

  return dimensionScores;
};

// Helper function to calculate overall score
const calculateOverallScore = (responses: any) => {
  const allValues = Object.values(responses).filter(v => typeof v === 'number');
  return allValues.length > 0 
    ? allValues.reduce((sum: number, val: any) => sum + val, 0) / allValues.length 
    : 0;
};

// API functions using Supabase
export const fetchOverallSummary = async () => {
  try {
    return await surveyResponseService.getOverallSummary();
  } catch (error) {
    console.error('Supabase error, falling back to API:', error);
    const response = await api.get('/data/overall_summary');
    return response.data;
  }
};

export const fetchDimensionScores = async () => {
  try {
    return await surveyResponseService.getDimensionScores();
  } catch (error) {
    console.error('Supabase error, falling back to API:', error);
    const response = await api.get('/data/dimension_scores');
    return response.data;
  }
};

export const fetchQuestionPerformance = async (params?: { sort?: 'asc' | 'desc'; limit?: number }) => {
  try {
    // This would need more complex logic to calculate question performance from Supabase
    // For now, fall back to API
    const response = await api.get('/data/question_performance', { params });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { questions: [], topPerformers: [], bottomPerformers: [], lastUpdated: new Date().toISOString() };
  }
};

export const fetchFilteredAnalysis = async (filters: Record<string, any>) => {
  try {
    const responses = await surveyResponseService.getAll(filters);
    
    if (responses.length === 0) {
      return {
        filters,
        matchingResponses: 0,
        overallCSAT: 0,
        dimensionScores: { tangibility: 0, responsiveness: 0, reliability: 0, assurance: 0, empathy: 0 },
        topQuestions: [],
        bottomQuestions: [],
        demographicBreakdown: { totalInCategory: 0, percentageOfTotal: 0 },
        lastUpdated: new Date().toISOString()
      };
    }

    const overallCSAT = responses.reduce((sum, r) => sum + r.overall_score, 0) / responses.length;
    
    // Calculate average dimension scores
    const dimensionScores = {
      tangibility: 0, responsiveness: 0, reliability: 0, assurance: 0, empathy: 0
    };
    
    responses.forEach(response => {
      Object.keys(dimensionScores).forEach(dim => {
        if (response.dimension_scores[dim]) {
          dimensionScores[dim as keyof typeof dimensionScores] += response.dimension_scores[dim];
        }
      });
    });
    
    Object.keys(dimensionScores).forEach(dim => {
      dimensionScores[dim as keyof typeof dimensionScores] /= responses.length;
    });

    return {
      filters,
      matchingResponses: responses.length,
      overallCSAT,
      dimensionScores,
      topQuestions: [],
      bottomQuestions: [],
      demographicBreakdown: {
        totalInCategory: responses.length,
        percentageOfTotal: 100 // This would need total count to calculate properly
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Supabase error, falling back to API:', error);
    const response = await api.get('/data/filtered_analysis', { params: filters });
    return response.data;
  }
};

export const submitSurveyResponse = async (responseData: any) => {
  try {
    // Transform the data to match Supabase schema
    const flatResponses = {
      // Flatten the nested response structure
      ...responseData.responses.tangibility,
      ...responseData.responses.responsiveness,
      ...responseData.responses.reliability,
      ...responseData.responses.assurance,
      ...responseData.responses.empathy
    };

    const dimensionScores = calculateDimensionScores(flatResponses);
    const overallScore = calculateOverallScore(flatResponses);
    
    const supabaseData = {
      gender: responseData.demographics.gender,
      age: responseData.demographics.age,
      marital_status: responseData.demographics.maritalStatus,
      education_level: responseData.demographics.educationLevel,
      responses: responseData.responses,
      overall_score: overallScore,
      dimension_scores: dimensionScores,
      completion_rate: Object.keys(flatResponses).length / 15, // 15 total questions
      session_id: crypto.randomUUID()
    };

    const result = await surveyResponseService.create(supabaseData);
    
    return {
      success: true,
      responseId: result.id,
      overallScore: result.overall_score,
      message: 'Survey response recorded successfully'
    };
  } catch (error) {
    console.error('Supabase error, falling back to API:', error);
    const response = await api.post('/responses', responseData);
    return response.data;
  }
};

// Question management functions
export const fetchQuestions = async () => {
  try {
    return await questionService.getAll();
  } catch (error) {
    console.error('Supabase error:', error);
    return [];
  }
};

export const createQuestion = async (questionData: any) => {
  try {
    return await questionService.create(questionData);
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};

export const updateQuestion = async (id: string, questionData: any) => {
  try {
    return await questionService.update(id, questionData);
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};

export const deleteQuestion = async (id: string) => {
  try {
    return await questionService.delete(id);
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};

export default api;