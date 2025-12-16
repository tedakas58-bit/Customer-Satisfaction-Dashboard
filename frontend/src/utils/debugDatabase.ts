import { supabase } from '../lib/supabase';

export const debugDatabase = async () => {
  try {
    console.log('🔍 Debugging database...');
    
    // Check connection
    const { error: connectionError } = await supabase
      .from('questions')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection error:', connectionError);
      return { success: false, error: connectionError.message };
    }
    
    console.log('✅ Database connection successful');
    
    // Count survey responses
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*');
    
    if (responsesError) {
      console.error('❌ Error fetching responses:', responsesError);
      return { success: false, error: responsesError.message };
    }
    
    console.log(`📊 Found ${responses?.length || 0} survey responses`);
    
    if (responses && responses.length > 0) {
      console.log('📋 Sample response:', responses[0]);
    }
    
    // Count questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError);
      return { success: false, error: questionsError.message };
    }
    
    console.log(`❓ Found ${questions?.length || 0} questions`);
    
    return {
      success: true,
      responseCount: responses?.length || 0,
      questionCount: questions?.length || 0,
      sampleResponse: responses?.[0] || null
    };
    
  } catch (error: any) {
    console.error('💥 Debug error:', error);
    return { success: false, error: error.message };
  }
};

export const testClearFunction = async () => {
  try {
    console.log('🧪 Testing clear function...');
    
    // First check what's in the database
    const debugResult = await debugDatabase();
    console.log('Debug result:', debugResult);
    
    if (!debugResult.success) {
      return debugResult;
    }
    
    if (debugResult.responseCount === 0) {
      console.log('⚠️ No responses to clear');
      return { success: true, message: 'No responses to clear', count: 0 };
    }
    
    // Try to clear all responses
    console.log('🗑️ Attempting to clear all responses...');
    
    const { data: allRecords, error: selectError } = await supabase
      .from('survey_responses')
      .select('id');

    if (selectError) {
      console.error('❌ Error selecting records:', selectError);
      return { success: false, error: selectError.message };
    }

    console.log(`📋 Found ${allRecords?.length || 0} records to delete`);

    if (!allRecords || allRecords.length === 0) {
      return { success: true, message: 'No records found to delete', count: 0 };
    }

    // Delete all records by their IDs
    const ids = allRecords.map(record => record.id);
    console.log('🎯 Deleting records with IDs:', ids);
    
    const { error: deleteError } = await supabase
      .from('survey_responses')
      .delete()
      .in('id', ids);

    if (deleteError) {
      console.error('❌ Error deleting records:', deleteError);
      return { success: false, error: deleteError.message };
    }

    console.log('✅ Successfully deleted all records');
    
    // Verify deletion
    const verifyResult = await debugDatabase();
    console.log('Verification result:', verifyResult);
    
    return {
      success: true,
      message: 'All responses cleared successfully',
      count: allRecords.length,
      verification: verifyResult
    };
    
  } catch (error: any) {
    console.error('💥 Test error:', error);
    return { success: false, error: error.message };
  }
};