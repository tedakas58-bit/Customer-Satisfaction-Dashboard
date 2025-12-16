import XLSX from 'xlsx';
import { surveyResponseService } from './supabaseService';

// Remove unused interface
// interface ExportData {
//   summaryData: any;
//   responses: any[];
//   questions: any[];
// }

// Question mapping for better readability
const questionMap: Record<string, { amharic: string; english: string; dimension: string }> = {
  q1_facilities: {
    amharic: 'የቢሮው አካባቢ ንጹህና ደህንነቱ የተጠበቀ ነው',
    english: 'The office environment is clean and safe',
    dimension: 'Tangibility'
  },
  q2_equipment: {
    amharic: 'ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው',
    english: 'The office has modern equipment and technology',
    dimension: 'Tangibility'
  },
  q3_materials: {
    amharic: 'የመረጃ ቁሳቁሶች ግልጽና ተደራሽ ናቸው',
    english: 'Information materials are clear and accessible',
    dimension: 'Tangibility'
  },
  q4_prompt_service: {
    amharic: 'ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ',
    english: 'Staff provide prompt service',
    dimension: 'Responsiveness'
  },
  q5_willingness: {
    amharic: 'ሰራተኞች ለመርዳት ፈቃደኛ ናቸው',
    english: 'Staff are willing to help',
    dimension: 'Responsiveness'
  },
  q6_availability: {
    amharic: 'ሰራተኞች ሁልጊዜ ይገኛሉ',
    english: 'Staff are always available',
    dimension: 'Responsiveness'
  },
  q7_promised_time: {
    amharic: 'አገልግሎቱ በተገለጸው ጊዜ ይሰጣል',
    english: 'Service is delivered at the promised time',
    dimension: 'Reliability'
  },
  q8_problem_solving: {
    amharic: 'ችግሮች በተገቢው መንገድ ይፈታሉ',
    english: 'Problems are solved appropriately',
    dimension: 'Reliability'
  },
  q9_dependable: {
    amharic: 'አገልግሎቱ ተዓማኒ ነው',
    english: 'The service is dependable',
    dimension: 'Reliability'
  },
  q10_competence: {
    amharic: 'ሰራተኞች በቂ እውቀትና ክህሎት አላቸው',
    english: 'Staff have adequate knowledge and skills',
    dimension: 'Assurance'
  },
  q11_courtesy: {
    amharic: 'ሰራተኞች ትሁትና አክባሪ ናቸው',
    english: 'Staff are courteous and respectful',
    dimension: 'Assurance'
  },
  q12_confidence: {
    amharic: 'በአገልግሎቱ ላይ መተማመን አለኝ',
    english: 'I have confidence in the service',
    dimension: 'Assurance'
  },
  q13_individual_attention: {
    amharic: 'ሰራተኞች ለእያንዳንዱ ደንበኛ ልዩ ትኩረት ይሰጣሉ',
    english: 'Staff give individual attention to each customer',
    dimension: 'Empathy'
  },
  q14_understanding: {
    amharic: 'ሰራተኞች የደንበኞችን ፍላጎት ይረዳሉ',
    english: 'Staff understand customer needs',
    dimension: 'Empathy'
  },
  q15_best_interests: {
    amharic: 'ሰራተኞች የደንበኞችን ጥቅም ያስቀድማሉ',
    english: 'Staff act in customers best interests',
    dimension: 'Empathy'
  }
};

export const exportToExcel = async (language: 'en' | 'am' = 'en') => {
  try {
    console.log('🔄 Starting Excel export...');
    
    // Fetch all data
    const responses = await surveyResponseService.getAll();
    const summaryData = await surveyResponseService.getOverallSummary();
    
    if (!responses || responses.length === 0) {
      alert(language === 'am' ? 'ምንም የሚወጣ መረጃ የለም' : 'No data to export');
      return;
    }

    console.log(`📊 Exporting ${responses.length} responses...`);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // 1. Executive Summary Sheet
    const summarySheet = createSummarySheet(summaryData, responses, language);
    XLSX.utils.book_append_sheet(workbook, summarySheet, language === 'am' ? 'አጠቃላይ ማጠቃለያ' : 'Executive Summary');

    // 2. Dimension Analysis Sheet
    const dimensionSheet = createDimensionAnalysisSheet(summaryData, responses, language);
    XLSX.utils.book_append_sheet(workbook, dimensionSheet, language === 'am' ? 'የልኬት ትንታኔ' : 'Dimension Analysis');

    // 3. Question Performance Sheet
    const questionSheet = createQuestionPerformanceSheet(responses, language);
    XLSX.utils.book_append_sheet(workbook, questionSheet, language === 'am' ? 'የጥያቄ አፈጻጸም' : 'Question Performance');

    // 4. Demographics Analysis Sheet
    const demographicsSheet = createDemographicsSheet(summaryData, language);
    XLSX.utils.book_append_sheet(workbook, demographicsSheet, language === 'am' ? 'የሕዝብ ስብስብ ትንታኔ' : 'Demographics Analysis');

    // 5. Raw Data Sheet
    const rawDataSheet = createRawDataSheet(responses, language);
    XLSX.utils.book_append_sheet(workbook, rawDataSheet, language === 'am' ? 'ጥሬ መረጃ' : 'Raw Data');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = language === 'am' 
      ? `የደንበኛ-እርካታ-ሪፖርት-${timestamp}.xlsx`
      : `Customer-Satisfaction-Report-${timestamp}.xlsx`;

    // Export file
    XLSX.writeFile(workbook, filename);
    
    console.log('✅ Excel export completed successfully');
    alert(language === 'am' 
      ? `ሪፖርት በተሳካ ሁኔታ ወደ ${filename} ተላክ`
      : `Report successfully exported to ${filename}`
    );

  } catch (error: any) {
    console.error('❌ Export error:', error);
    alert(language === 'am' 
      ? `ወደ Excel መላክ ሳይሳካ ቀረ: ${error.message}`
      : `Excel export failed: ${error.message}`
    );
  }
};

// Create Executive Summary Sheet
const createSummarySheet = (summaryData: any, responses: any[], language: 'en' | 'am') => {
  const data = [
    [language === 'am' ? 'የደንበኛ እርካታ ሪፖርት - አጠቃላይ ማጠቃለያ' : 'Customer Satisfaction Report - Executive Summary'],
    [''],
    [language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ደህንነት ቢሮ' : 'Lemi Kura Sub-City Peace and Security Office'],
    [language === 'am' ? 'የሪፖርት ቀን:' : 'Report Date:', new Date().toLocaleDateString()],
    [''],
    
    // Key Metrics
    [language === 'am' ? 'ቁልፍ አመላካቾች' : 'Key Metrics'],
    [language === 'am' ? 'አጠቃላይ ምላሾች:' : 'Total Responses:', responses.length],
    [language === 'am' ? 'አጠቃላይ እርካታ ነጥብ:' : 'Overall CSAT Score:', summaryData.overallCSAT?.toFixed(2) || '0.00'],
    [language === 'am' ? 'ምላሽ መጠን:' : 'Response Rate:', `${((summaryData.responseRate || 0) * 100).toFixed(1)}%`],
    [''],
    
    // Dimension Scores
    [language === 'am' ? 'የአገልግሎት ጥራት ልኬቶች' : 'Service Quality Dimensions'],
    [language === 'am' ? 'ተጨባጭነት:' : 'Tangibility:', summaryData.dimensionScores?.tangibility?.toFixed(2) || '0.00'],
    [language === 'am' ? 'ፈጣን አገልግሎት:' : 'Responsiveness:', summaryData.dimensionScores?.responsiveness?.toFixed(2) || '0.00'],
    [language === 'am' ? 'ተዓማኒነት:' : 'Reliability:', summaryData.dimensionScores?.reliability?.toFixed(2) || '0.00'],
    [language === 'am' ? 'የሰራተኞች ብቃት:' : 'Assurance:', summaryData.dimensionScores?.assurance?.toFixed(2) || '0.00'],
    [language === 'am' ? 'ተሳትፎ:' : 'Empathy:', summaryData.dimensionScores?.empathy?.toFixed(2) || '0.00'],
    [''],
    
    // Demographics Summary
    [language === 'am' ? 'የሕዝብ ስብስብ ማጠቃለያ' : 'Demographics Summary'],
    [language === 'am' ? 'ወንድ:' : 'Male:', summaryData.demographicCounts?.gender?.male || 0],
    [language === 'am' ? 'ሴት:' : 'Female:', summaryData.demographicCounts?.gender?.female || 0],
    [''],
    [language === 'am' ? 'ዕድሜ ክልል:' : 'Age Groups:'],
    ['18-30:', summaryData.demographicCounts?.age?.['18-30'] || 0],
    ['31-40:', summaryData.demographicCounts?.age?.['31-40'] || 0],
    ['41-50:', summaryData.demographicCounts?.age?.['41-50'] || 0],
    ['50+:', summaryData.demographicCounts?.age?.['50+'] || 0],
  ];

  return XLSX.utils.aoa_to_sheet(data);
};

// Create Dimension Analysis Sheet
const createDimensionAnalysisSheet = (_summaryData: any, responses: any[], language: 'en' | 'am') => {
  const headers = [
    language === 'am' ? 'ልኬት' : 'Dimension',
    language === 'am' ? 'አማካይ ነጥብ' : 'Average Score',
    language === 'am' ? 'ምላሾች ብዛት' : 'Response Count',
    language === 'am' ? 'ከፍተኛ ነጥብ' : 'Highest Score',
    language === 'am' ? 'ዝቅተኛ ነጥብ' : 'Lowest Score',
    language === 'am' ? 'መደበኛ ልዩነት' : 'Standard Deviation'
  ];

  const dimensions = ['tangibility', 'responsiveness', 'reliability', 'assurance', 'empathy'];
  const dimensionLabels = {
    tangibility: language === 'am' ? 'ተጨባጭነት' : 'Tangibility',
    responsiveness: language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness',
    reliability: language === 'am' ? 'ተዓማኒነት' : 'Reliability',
    assurance: language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance',
    empathy: language === 'am' ? 'ተሳትፎ' : 'Empathy'
  };

  const data = [headers];

  dimensions.forEach(dim => {
    const scores = responses.map(r => r.dimension_scores?.[dim] || 0).filter(s => s > 0);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const max = scores.length > 0 ? Math.max(...scores) : 0;
    const min = scores.length > 0 ? Math.min(...scores) : 0;
    const stdDev = scores.length > 0 ? Math.sqrt(scores.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / scores.length) : 0;

    data.push([
      dimensionLabels[dim as keyof typeof dimensionLabels],
      avg.toFixed(2),
      scores.length.toString(),
      max.toFixed(2),
      min.toFixed(2),
      stdDev.toFixed(2)
    ]);
  });

  return XLSX.utils.aoa_to_sheet(data);
};

// Create Question Performance Sheet
const createQuestionPerformanceSheet = (responses: any[], language: 'en' | 'am') => {
  const headers = [
    language === 'am' ? 'ጥያቄ ID' : 'Question ID',
    language === 'am' ? 'ጥያቄ' : 'Question',
    language === 'am' ? 'ልኬት' : 'Dimension',
    language === 'am' ? 'አማካይ ነጥብ' : 'Average Score',
    language === 'am' ? 'ምላሾች ብዛት' : 'Response Count',
    language === 'am' ? 'አፈጻጸም ደረጃ' : 'Performance Level'
  ];

  const data = [headers];

  Object.entries(questionMap).forEach(([questionId, questionInfo]) => {
    const scores: number[] = [];
    
    responses.forEach(response => {
      if (response.responses) {
        // Extract score from nested response structure
        Object.values(response.responses).forEach((dimensionResponses: any) => {
          if (dimensionResponses[questionId]) {
            scores.push(dimensionResponses[questionId]);
          }
        });
      }
    });

    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const performanceLevel = avg >= 4.5 ? (language === 'am' ? 'በጣም ጥሩ' : 'Excellent') :
                            avg >= 4.0 ? (language === 'am' ? 'ጥሩ' : 'Good') :
                            avg >= 3.0 ? (language === 'am' ? 'መካከለኛ' : 'Average') :
                            avg >= 2.0 ? (language === 'am' ? 'ደካማ' : 'Poor') :
                            (language === 'am' ? 'በጣም ደካማ' : 'Very Poor');

    data.push([
      questionId,
      language === 'am' ? questionInfo.amharic : questionInfo.english,
      questionInfo.dimension,
      avg.toFixed(2),
      scores.length.toString(),
      performanceLevel
    ]);
  });

  return XLSX.utils.aoa_to_sheet(data);
};

// Create Demographics Sheet
const createDemographicsSheet = (summaryData: any, language: 'en' | 'am') => {
  const data = [
    [language === 'am' ? 'የሕዝብ ስብስብ ትንታኔ' : 'Demographics Analysis'],
    [''],
    
    // Gender Distribution
    [language === 'am' ? 'የፆታ ስርጭት' : 'Gender Distribution'],
    [language === 'am' ? 'ወንድ' : 'Male', summaryData.demographicCounts?.gender?.male || 0],
    [language === 'am' ? 'ሴት' : 'Female', summaryData.demographicCounts?.gender?.female || 0],
    [''],
    
    // Age Distribution
    [language === 'am' ? 'የዕድሜ ስርጭት' : 'Age Distribution'],
    ['18-30', summaryData.demographicCounts?.age?.['18-30'] || 0],
    ['31-40', summaryData.demographicCounts?.age?.['31-40'] || 0],
    ['41-50', summaryData.demographicCounts?.age?.['41-50'] || 0],
    ['50+', summaryData.demographicCounts?.age?.['50+'] || 0],
    [''],
    
    // Education Distribution
    [language === 'am' ? 'የትምህርት ደረጃ ስርጭት' : 'Education Level Distribution'],
    [language === 'am' ? 'ያልተሞላ' : 'Unfilled', summaryData.demographicCounts?.educationLevel?.unfilled || 0],
    ['1-8', summaryData.demographicCounts?.educationLevel?.['1-8'] || 0],
    ['9-12', summaryData.demographicCounts?.educationLevel?.['9-12'] || 0],
    [language === 'am' ? 'ሰርተፊኬት' : 'Certificate', summaryData.demographicCounts?.educationLevel?.certificate || 0],
    [language === 'am' ? 'ዲፕሎማ' : 'Diploma', summaryData.demographicCounts?.educationLevel?.diploma || 0],
    [language === 'am' ? 'የመጀመሪያ ዲግሪ' : 'First Degree', summaryData.demographicCounts?.educationLevel?.first_degree || 0],
    [language === 'am' ? 'ሁለተኛ ዲግሪና ከዚያ በላይ' : 'Second Degree+', summaryData.demographicCounts?.educationLevel?.second_degree_plus || 0],
    [''],
    
    // Marital Status Distribution
    [language === 'am' ? 'የጋብቻ ሁኔታ ስርጭት' : 'Marital Status Distribution'],
    [language === 'am' ? 'ያገባ' : 'Married', summaryData.demographicCounts?.maritalStatus?.married || 0],
    [language === 'am' ? 'ያላገባ' : 'Single', summaryData.demographicCounts?.maritalStatus?.single || 0],
    [language === 'am' ? 'የተፋታ' : 'Divorced', summaryData.demographicCounts?.maritalStatus?.divorced || 0],
    [language === 'am' ? 'የሞተበት/ባት' : 'Widowed', summaryData.demographicCounts?.maritalStatus?.widowed || 0],
  ];

  return XLSX.utils.aoa_to_sheet(data);
};

// Create Raw Data Sheet
const createRawDataSheet = (responses: any[], language: 'en' | 'am') => {
  const headers = [
    language === 'am' ? 'ቀን' : 'Date',
    language === 'am' ? 'ፆታ' : 'Gender',
    language === 'am' ? 'ዕድሜ' : 'Age',
    language === 'am' ? 'የጋብቻ ሁኔታ' : 'Marital Status',
    language === 'am' ? 'የትምህርት ደረጃ' : 'Education Level',
    language === 'am' ? 'አጠቃላይ ነጥብ' : 'Overall Score',
    ...Object.keys(questionMap).map(qId => `${qId}_score`)
  ];

  const data = [headers];

  responses.forEach(response => {
    const row = [
      new Date(response.created_at).toLocaleDateString(),
      language === 'am' ? (response.gender === 'male' ? 'ወንድ' : 'ሴት') : response.gender,
      response.age,
      language === 'am' ? 
        (response.marital_status === 'married' ? 'ያገባ' :
         response.marital_status === 'single' ? 'ያላገባ' :
         response.marital_status === 'divorced' ? 'የተፋታ' : 'የሞተበት/ባት') :
        response.marital_status,
      response.education_level,
      response.overall_score?.toFixed(2) || '0.00'
    ];

    // Add individual question scores
    Object.keys(questionMap).forEach(questionId => {
      let score = 0;
      if (response.responses) {
        Object.values(response.responses).forEach((dimensionResponses: any) => {
          if (dimensionResponses[questionId]) {
            score = dimensionResponses[questionId];
          }
        });
      }
      row.push(score);
    });

    data.push(row);
  });

  return XLSX.utils.aoa_to_sheet(data);
};