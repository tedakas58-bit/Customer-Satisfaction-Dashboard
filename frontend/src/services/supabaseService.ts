import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type SurveyResponse = Database['public']['Tables']['survey_responses']['Row'];
type SurveyResponseInsert = Database['public']['Tables']['survey_responses']['Insert'];
type Question = Database['public']['Tables']['questions']['Row'];

// Survey Response Services
export const surveyResponseService = {
  // Create a new survey response
  async create(data: SurveyResponseInsert): Promise<SurveyResponse> {
    const { data: response, error } = await supabase
      .from('survey_responses')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return response;
  },

  // Get all survey responses with optional filters
  async getAll(filters?: {
    gender?: string;
    age?: string;
    educationLevel?: string;
    maritalStatus?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<SurveyResponse[]> {
    let query = supabase.from('survey_responses').select('*');

    if (filters) {
      if (filters.gender) query = query.eq('gender', filters.gender);
      if (filters.age) query = query.eq('age', filters.age);
      if (filters.educationLevel) query = query.eq('education_level', filters.educationLevel);
      if (filters.maritalStatus) query = query.eq('marital_status', filters.maritalStatus);
      if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
      if (filters.dateTo) query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get overall summary statistics
  async getOverallSummary() {
    const { data: responses, error } = await supabase
      .from('survey_responses')
      .select('overall_score, gender, age, education_level, marital_status, created_at, dimension_scores');

    if (error) throw error;

    const totalResponses = responses?.length || 0;
    const overallCSAT = totalResponses > 0 
      ? responses.reduce((sum, r) => sum + r.overall_score, 0) / totalResponses 
      : 0;

    // Calculate demographic counts
    const demographicCounts = {
      gender: { male: 0, female: 0 },
      age: { '18-30': 0, '31-40': 0, '41-50': 0, '50+': 0 },
      educationLevel: {
        unfilled: 0, '1-8': 0, '9-12': 0, certificate: 0,
        diploma: 0, first_degree: 0, second_degree_plus: 0
      },
      maritalStatus: { married: 0, single: 0, divorced: 0, widowed: 0 }
    };

    responses?.forEach(response => {
      // Safe key checking with type assertions
      if (response.gender in demographicCounts.gender) {
        demographicCounts.gender[response.gender as keyof typeof demographicCounts.gender]++;
      }
      if (response.age in demographicCounts.age) {
        demographicCounts.age[response.age as keyof typeof demographicCounts.age]++;
      }
      if (response.education_level in demographicCounts.educationLevel) {
        demographicCounts.educationLevel[response.education_level as keyof typeof demographicCounts.educationLevel]++;
      }
      if (response.marital_status in demographicCounts.maritalStatus) {
        demographicCounts.maritalStatus[response.marital_status as keyof typeof demographicCounts.maritalStatus]++;
      }
    });

    // Calculate trends (simplified)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyResponses = responses?.filter(r => new Date(r.created_at) >= weekAgo) || [];
    const monthlyResponses = responses?.filter(r => new Date(r.created_at) >= monthAgo) || [];

    const weeklyCSAT = weeklyResponses.length > 0
      ? weeklyResponses.reduce((sum, r) => sum + r.overall_score, 0) / weeklyResponses.length
      : 0;
    
    const monthlyCSAT = monthlyResponses.length > 0
      ? monthlyResponses.reduce((sum, r) => sum + r.overall_score, 0) / monthlyResponses.length
      : 0;

    // Calculate dimension scores
    const dimensionScores = {
      tangibility: 0,
      responsiveness: 0,
      reliability: 0,
      assurance: 0,
      empathy: 0
    };

    if (responses && responses.length > 0) {
      responses.forEach(response => {
        if (response.dimension_scores) {
          Object.keys(dimensionScores).forEach(dim => {
            if (response.dimension_scores[dim]) {
              dimensionScores[dim as keyof typeof dimensionScores] += response.dimension_scores[dim];
            }
          });
        }
      });

      // Calculate averages
      Object.keys(dimensionScores).forEach(dim => {
        dimensionScores[dim as keyof typeof dimensionScores] /= responses.length;
      });
    }

    // Get recent responses (last 5)
    const recentResponses = responses?.slice(0, 5) || [];

    return {
      totalResponses,
      overallCSAT,
      responseRate: totalResponses > 0 ? 0.89 : 0, // This would need to be calculated based on your metrics
      lastUpdated: new Date().toISOString(),
      demographicCounts,
      dimensionScores,
      recentResponses,
      trends: {
        weeklyChange: weeklyCSAT - overallCSAT,
        monthlyChange: monthlyCSAT - overallCSAT
      }
    };
  },

  // Get dimension scores
  async getDimensionScores() {
    const { data: responses, error } = await supabase
      .from('survey_responses')
      .select('dimension_scores');

    if (error) throw error;

    const dimensions = {
      tangibility: { score: 0, responseCount: 0, questions: [] },
      responsiveness: { score: 0, responseCount: 0, questions: [] },
      reliability: { score: 0, responseCount: 0, questions: [] },
      assurance: { score: 0, responseCount: 0, questions: [] },
      empathy: { score: 0, responseCount: 0, questions: [] }
    };

    if (responses && responses.length > 0) {
      const dimensionTotals = {
        tangibility: 0, responsiveness: 0, reliability: 0, assurance: 0, empathy: 0
      };

      responses.forEach(response => {
        if (response.dimension_scores) {
          Object.keys(dimensionTotals).forEach(dim => {
            if (response.dimension_scores[dim]) {
              dimensionTotals[dim as keyof typeof dimensionTotals] += response.dimension_scores[dim];
            }
          });
        }
      });

      Object.keys(dimensions).forEach(dim => {
        const key = dim as keyof typeof dimensions;
        dimensions[key].score = dimensionTotals[key] / responses.length;
        dimensions[key].responseCount = responses.length;
      });
    }

    return {
      dimensions,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Question Services
export const questionService = {
  // Get all questions
  async getAll(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_number');

    if (error) throw error;
    return data || [];
  },

  // Create a new question
  async create(question: Database['public']['Tables']['questions']['Insert']): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a question
  async update(id: string, updates: Database['public']['Tables']['questions']['Update']): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a question
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Data Management Services
export const dataManagementService = {
  // Clear all survey responses
  async clearAllResponses(): Promise<{ count: number }> {
    // First get all records to count them
    const { data: allRecords, error: selectError } = await supabase
      .from('survey_responses')
      .select('id');

    if (selectError) throw selectError;

    const recordCount = allRecords?.length || 0;

    if (recordCount === 0) {
      return { count: 0 };
    }

    // Delete all records by their IDs
    const ids = allRecords.map(record => record.id);
    const { error } = await supabase
      .from('survey_responses')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { count: recordCount };
  },

  // Clear responses by date range
  async clearResponsesByDateRange(dateFrom: string, dateTo: string): Promise<{ count: number }> {
    const { count, error } = await supabase
      .from('survey_responses')
      .delete()
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo);

    if (error) throw error;
    return { count: count || 0 };
  },

  // Clear responses by demographics
  async clearResponsesByDemographics(filters: {
    gender?: string;
    age?: string;
    educationLevel?: string;
    maritalStatus?: string;
  }): Promise<{ count: number }> {
    let query = supabase.from('survey_responses').delete();

    if (filters.gender) query = query.eq('gender', filters.gender);
    if (filters.age) query = query.eq('age', filters.age);
    if (filters.educationLevel) query = query.eq('education_level', filters.educationLevel);
    if (filters.maritalStatus) query = query.eq('marital_status', filters.maritalStatus);

    const { count, error } = await query;

    if (error) throw error;
    return { count: count || 0 };
  },

  // Get database statistics
  async getDatabaseStats() {
    const [responsesResult, questionsResult] = await Promise.all([
      supabase.from('survey_responses').select('id', { count: 'exact', head: true }),
      supabase.from('questions').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalResponses: responsesResult.count || 0,
      totalQuestions: questionsResult.count || 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to new survey responses
  onNewResponse(callback: (response: SurveyResponse) => void) {
    return supabase
      .channel('survey_responses')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'survey_responses' },
        (payload) => callback(payload.new as SurveyResponse)
      )
      .subscribe();
  },

  // Subscribe to question changes
  onQuestionChange(callback: (question: Question) => void) {
    return supabase
      .channel('questions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        (payload) => callback(payload.new as Question)
      )
      .subscribe();
  }
};