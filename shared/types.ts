// Shared TypeScript types for both frontend and backend

export interface Demographics {
  gender: 'male' | 'female';
  age: '18-30' | '31-40' | '41-50' | '50+';
  maritalStatus: 'married' | 'single' | 'divorced' | 'widowed';
  educationLevel: 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus';
}

export interface SurveyResponses {
  tangibility: {
    q1_facilities: number;
    q2_appearance: number;
    q3_materials: number;
  };
  responsiveness: {
    q4_prompt_service: number;
    q5_willingness: number;
    q6_quick_response: number;
  };
  reliability: {
    q7_promised_time: number;
    q8_problem_solving: number;
    q9_dependable: number;
  };
  assurance: {
    q10_competence: number;
    q11_courtesy: number;
    q12_confidence: number;
  };
  empathy: {
    q13_individual_attention: number;
    q14_understanding: number;
    q15_best_interests: number;
  };
}

export interface SurveyResponse {
  _id?: string;
  demographics: Demographics;
  responses: SurveyResponses;
  submittedAt?: Date;
  computed?: {
    overallScore: number;
    dimensionScores: DimensionScores;
    completionRate: number;
  };
}

export interface DimensionScores {
  tangibility: number;
  responsiveness: number;
  reliability: number;
  assurance: number;
  empathy: number;
}

export interface Question {
  questionId: string;
  dimension: keyof DimensionScores;
  textAmharic: string;
  textEnglish: string;
  order: number;
  isActive: boolean;
}

export interface QuestionPerformance {
  questionId: string;
  dimension: keyof DimensionScores;
  score: number;
  responseCount: number;
  textAmharic: string;
  textEnglish: string;
  rank?: number;
}

export interface OverallSummary {
  totalResponses: number;
  overallCSAT: number;
  responseRate: number;
  lastUpdated: string;
  demographicCounts: {
    gender: Record<Demographics['gender'], number>;
    age: Record<Demographics['age'], number>;
    educationLevel: Record<Demographics['educationLevel'], number>;
    maritalStatus: Record<Demographics['maritalStatus'], number>;
  };
  trends: {
    weeklyChange: number;
    monthlyChange: number;
  };
}

export interface DimensionAnalysis {
  dimensions: Record<keyof DimensionScores, {
    score: number;
    responseCount: number;
    questions: QuestionPerformance[];
  }>;
  lastUpdated: string;
}

export interface FilteredAnalysis {
  filters: Partial<Demographics & { dateFrom?: string; dateTo?: string }>;
  matchingResponses: number;
  overallCSAT: number;
  dimensionScores: DimensionScores;
  topQuestions: QuestionPerformance[];
  bottomQuestions: QuestionPerformance[];
  demographicBreakdown: {
    totalInCategory: number;
    percentageOfTotal: number;
  };
  lastUpdated: string;
}

export interface APIResponse<T> {
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
}

// Filter types for API queries
export interface DemographicFilters {
  gender?: Demographics['gender'];
  age?: Demographics['age'];
  educationLevel?: Demographics['educationLevel'];
  maritalStatus?: Demographics['maritalStatus'];
  dateFrom?: string;
  dateTo?: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DimensionChartData {
  dimension: keyof DimensionScores;
  score: number;
  label: string;
  color: string;
}