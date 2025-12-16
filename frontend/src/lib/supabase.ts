import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      survey_responses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          gender: 'male' | 'female';
          age: '18-30' | '31-40' | '41-50' | '50+';
          marital_status: 'married' | 'single' | 'divorced' | 'widowed';
          education_level: 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus';
          responses: Record<string, any>;
          overall_score: number;
          dimension_scores: Record<string, number>;
          completion_rate: number;
          ip_address?: string;
          session_id?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          gender: 'male' | 'female';
          age: '18-30' | '31-40' | '41-50' | '50+';
          marital_status: 'married' | 'single' | 'divorced' | 'widowed';
          education_level: 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus';
          responses: Record<string, any>;
          overall_score: number;
          dimension_scores: Record<string, number>;
          completion_rate: number;
          ip_address?: string;
          session_id?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          gender?: 'male' | 'female';
          age?: '18-30' | '31-40' | '41-50' | '50+';
          marital_status?: 'married' | 'single' | 'divorced' | 'widowed';
          education_level?: 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus';
          responses?: Record<string, any>;
          overall_score?: number;
          dimension_scores?: Record<string, number>;
          completion_rate?: number;
          ip_address?: string;
          session_id?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          question_id: string;
          dimension: string;
          text_amharic: string;
          text_english: string;
          order_number: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          dimension: string;
          text_amharic: string;
          text_english: string;
          order_number: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          dimension?: string;
          text_amharic?: string;
          text_english?: string;
          order_number?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}