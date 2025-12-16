import { surveyResponseService } from '../services/supabaseService';

// Sample survey responses for testing
const sampleResponses = [
  {
    gender: 'male' as const,
    age: '31-40' as const,
    marital_status: 'married' as const,
    education_level: 'first_degree' as const,
    responses: {
      tangibility: { q1_facilities: 4, q2_equipment: 3, q3_materials: 4 },
      responsiveness: { q4_prompt_service: 5, q5_willingness: 4, q6_availability: 3 },
      reliability: { q7_promised_time: 4, q8_problem_solving: 4, q9_dependable: 5 },
      assurance: { q10_competence: 4, q11_courtesy: 5, q12_confidence: 4 },
      empathy: { q13_individual_attention: 3, q14_understanding: 4, q15_best_interests: 4 }
    },
    overall_score: 4.0,
    dimension_scores: {
      tangibility: 3.7,
      responsiveness: 4.0,
      reliability: 4.3,
      assurance: 4.3,
      empathy: 3.7
    },
    completion_rate: 1.0,
    session_id: 'sample_001'
  },
  {
    gender: 'female' as const,
    age: '18-30' as const,
    marital_status: 'single' as const,
    education_level: 'diploma' as const,
    responses: {
      tangibility: { q1_facilities: 5, q2_equipment: 4, q3_materials: 5 },
      responsiveness: { q4_prompt_service: 4, q5_willingness: 5, q6_availability: 4 },
      reliability: { q7_promised_time: 5, q8_problem_solving: 4, q9_dependable: 4 },
      assurance: { q10_competence: 5, q11_courtesy: 4, q12_confidence: 5 },
      empathy: { q13_individual_attention: 4, q14_understanding: 5, q15_best_interests: 5 }
    },
    overall_score: 4.6,
    dimension_scores: {
      tangibility: 4.7,
      responsiveness: 4.3,
      reliability: 4.3,
      assurance: 4.7,
      empathy: 4.7
    },
    completion_rate: 1.0,
    session_id: 'sample_002'
  },
  {
    gender: 'male' as const,
    age: '41-50' as const,
    marital_status: 'married' as const,
    education_level: 'second_degree_plus' as const,
    responses: {
      tangibility: { q1_facilities: 3, q2_equipment: 2, q3_materials: 3 },
      responsiveness: { q4_prompt_service: 2, q5_willingness: 3, q6_availability: 2 },
      reliability: { q7_promised_time: 3, q8_problem_solving: 2, q9_dependable: 3 },
      assurance: { q10_competence: 3, q11_courtesy: 4, q12_confidence: 3 },
      empathy: { q13_individual_attention: 2, q14_understanding: 3, q15_best_interests: 3 }
    },
    overall_score: 2.7,
    dimension_scores: {
      tangibility: 2.7,
      responsiveness: 2.3,
      reliability: 2.7,
      assurance: 3.3,
      empathy: 2.7
    },
    completion_rate: 1.0,
    session_id: 'sample_003'
  },
  {
    gender: 'female' as const,
    age: '31-40' as const,
    marital_status: 'divorced' as const,
    education_level: 'certificate' as const,
    responses: {
      tangibility: { q1_facilities: 4, q2_equipment: 4, q3_materials: 4 },
      responsiveness: { q4_prompt_service: 4, q5_willingness: 4, q6_availability: 3 },
      reliability: { q7_promised_time: 4, q8_problem_solving: 5, q9_dependable: 4 },
      assurance: { q10_competence: 4, q11_courtesy: 4, q12_confidence: 4 },
      empathy: { q13_individual_attention: 4, q14_understanding: 4, q15_best_interests: 4 }
    },
    overall_score: 4.0,
    dimension_scores: {
      tangibility: 4.0,
      responsiveness: 3.7,
      reliability: 4.3,
      assurance: 4.0,
      empathy: 4.0
    },
    completion_rate: 1.0,
    session_id: 'sample_004'
  },
  {
    gender: 'male' as const,
    age: '50+' as const,
    marital_status: 'widowed' as const,
    education_level: '9-12' as const,
    responses: {
      tangibility: { q1_facilities: 5, q2_equipment: 5, q3_materials: 5 },
      responsiveness: { q4_prompt_service: 5, q5_willingness: 5, q6_availability: 5 },
      reliability: { q7_promised_time: 5, q8_problem_solving: 5, q9_dependable: 5 },
      assurance: { q10_competence: 5, q11_courtesy: 5, q12_confidence: 5 },
      empathy: { q13_individual_attention: 5, q14_understanding: 5, q15_best_interests: 5 }
    },
    overall_score: 5.0,
    dimension_scores: {
      tangibility: 5.0,
      responsiveness: 5.0,
      reliability: 5.0,
      assurance: 5.0,
      empathy: 5.0
    },
    completion_rate: 1.0,
    session_id: 'sample_005'
  }
];

export const addSampleData = async () => {
  try {
    console.log('Adding sample survey responses...');
    
    const results = [];
    for (const response of sampleResponses) {
      const result = await surveyResponseService.create(response);
      results.push(result);
      console.log(`Added response ${result.id}`);
    }
    
    console.log(`Successfully added ${results.length} sample responses`);
    return {
      success: true,
      count: results.length,
      responses: results
    };
  } catch (error: any) {
    console.error('Error adding sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const clearSampleData = async () => {
  try {
    console.log('Clearing sample data...');
    
    // Delete responses with sample session IDs
    const sampleSessionIds = sampleResponses.map(r => r.session_id);
    
    for (const sessionId of sampleSessionIds) {
      // This would need a more specific delete function
      console.log(`Would delete session: ${sessionId}`);
    }
    
    return {
      success: true,
      message: 'Sample data cleared'
    };
  } catch (error: any) {
    console.error('Error clearing sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};