import { surveyResponseService } from './supabaseService';

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

// Excel-compatible CSV export with UTF-8 BOM
export const exportToExcelCompatibleCSV = async (language: 'en' | 'am' = 'en') => {
  try {
    console.log('🔄 Starting Excel-compatible CSV export...');
    
    // Fetch all data
    const responses = await surveyResponseService.getAll();
    const summaryData = await surveyResponseService.getOverallSummary();
    
    if (!responses || responses.length === 0) {
      alert(language === 'am' ? 'ምንም የሚወጣ መረጃ የለም' : 'No data to export');
      return;
    }

    console.log(`📊 Exporting ${responses.length} responses...`);

    // Create comprehensive CSV content
    let csvContent = '';
    
    // UTF-8 BOM for Excel recognition
    const BOM = '\uFEFF';
    csvContent += BOM;
    
    // Add report sections
    csvContent += createSummarySection(summaryData, responses, language);
    csvContent += '\n\n';
    csvContent += createDimensionSection(responses, language);
    csvContent += '\n\n';
    csvContent += createQuestionSection(responses, language);
    csvContent += '\n\n';
    csvContent += createDemographicsSection(summaryData, language);
    csvContent += '\n\n';
    csvContent += createRawDataSection(responses, language);
    
    if (language === 'am') {
      csvContent += '\n\n';
      csvContent += createFontInstructionsSection();
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = language === 'am' 
      ? `የደንበኛ-እርካታ-ሪፖርት-${timestamp}.csv`
      : `Customer-Satisfaction-Report-${timestamp}.csv`;

    // Create and download file
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Excel-compatible CSV export completed successfully');
    
    const successMessage = language === 'am' 
      ? `ሪፖርት በተሳካ ሁኔታ ወደ ${filename} ተላክ\n\n📋 Excel ውስጥ ለመክፈት:\n1. ፋይሉን በቀጥታ ይክፈቱ\n2. ወይም Excel > Data > Get Data > From Text/CSV\n3. File Origin: "UTF-8" ይምረጡ\n\n🔤 ለአማርኛ ጽሁፍ: Font > Nyala ይምረጡ`
      : `Report successfully exported to ${filename}\n\n📋 To open in Excel:\n1. Open file directly\n2. Or Excel > Data > Get Data > From Text/CSV\n3. Choose File Origin: "UTF-8"\n\n🔤 For Amharic text: Select Font > Nyala`;
    
    alert(successMessage);

  } catch (error: any) {
    console.error('❌ Excel-compatible CSV export error:', error);
    alert(language === 'am' 
      ? `ወደ CSV መላክ ሳይሳካ ቀረ: ${error.message}`
      : `CSV export failed: ${error.message}`
    );
  }
};

// Helper function to escape CSV values
const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Create Executive Summary Section
const createSummarySection = (summaryData: any, responses: any[], language: 'en' | 'am'): string => {
  const title = language === 'am' ? 'የደንበኛ እርካታ ሪፖርት - አጠቃላይ ማጠቃለያ' : 'Customer Satisfaction Report - Executive Summary';
  const office = language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ደህንነት ቢሮ' : 'Lemi Kura Sub-City Peace and Security Office';
  
  let section = `${escapeCSV(title)}\n`;
  section += `${escapeCSV(office)}\n`;
  section += `${escapeCSV(language === 'am' ? 'የሪፖርት ቀን:' : 'Report Date:')},${escapeCSV(new Date().toLocaleDateString())}\n`;
  section += '\n';
  
  // Key Metrics
  section += `${escapeCSV(language === 'am' ? 'ቁልፍ አመላካቾች' : 'Key Metrics')}\n`;
  section += `${escapeCSV(language === 'am' ? 'አጠቃላይ ምላሾች:' : 'Total Responses:')},${escapeCSV(responses.length)}\n`;
  section += `${escapeCSV(language === 'am' ? 'አጠቃላይ እርካታ ነጥብ:' : 'Overall CSAT Score:')},${escapeCSV(summaryData.overallCSAT?.toFixed(2) || '0.00')}\n`;
  section += `${escapeCSV(language === 'am' ? 'ምላሽ መጠን:' : 'Response Rate:')},${escapeCSV(((summaryData.responseRate || 0) * 100).toFixed(1) + '%')}\n`;
  section += '\n';
  
  // Dimension Scores
  section += `${escapeCSV(language === 'am' ? 'የአገልግሎት ጥራት ልኬቶች' : 'Service Quality Dimensions')}\n`;
  section += `${escapeCSV(language === 'am' ? 'ተጨባጭነት:' : 'Tangibility:')},${escapeCSV(summaryData.dimensionScores?.tangibility?.toFixed(2) || '0.00')}\n`;
  section += `${escapeCSV(language === 'am' ? 'ፈጣን አገልግሎት:' : 'Responsiveness:')},${escapeCSV(summaryData.dimensionScores?.responsiveness?.toFixed(2) || '0.00')}\n`;
  section += `${escapeCSV(language === 'am' ? 'ተዓማኒነት:' : 'Reliability:')},${escapeCSV(summaryData.dimensionScores?.reliability?.toFixed(2) || '0.00')}\n`;
  section += `${escapeCSV(language === 'am' ? 'የሰራተኞች ብቃት:' : 'Assurance:')},${escapeCSV(summaryData.dimensionScores?.assurance?.toFixed(2) || '0.00')}\n`;
  section += `${escapeCSV(language === 'am' ? 'ተሳትፎ:' : 'Empathy:')},${escapeCSV(summaryData.dimensionScores?.empathy?.toFixed(2) || '0.00')}\n`;
  
  return section;
};

// Create Dimension Analysis Section
const createDimensionSection = (responses: any[], language: 'en' | 'am'): string => {
  let section = `${escapeCSV(language === 'am' ? 'የልኬት ትንታኔ' : 'Dimension Analysis')}\n`;
  
  const headers = [
    language === 'am' ? 'ልኬት' : 'Dimension',
    language === 'am' ? 'አማካይ ነጥብ' : 'Average Score',
    language === 'am' ? 'ምላሾች ብዛት' : 'Response Count'
  ];
  
  section += headers.map(escapeCSV).join(',') + '\n';
  
  const dimensions = ['tangibility', 'responsiveness', 'reliability', 'assurance', 'empathy'];
  const dimensionLabels = {
    tangibility: language === 'am' ? 'ተጨባጭነት' : 'Tangibility',
    responsiveness: language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness',
    reliability: language === 'am' ? 'ተዓማኒነት' : 'Reliability',
    assurance: language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance',
    empathy: language === 'am' ? 'ተሳትፎ' : 'Empathy'
  };

  dimensions.forEach(dim => {
    const scores = responses.map(r => r.dimension_scores?.[dim] || 0).filter(s => s > 0);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const row = [
      dimensionLabels[dim as keyof typeof dimensionLabels],
      avg.toFixed(2),
      scores.length.toString()
    ];
    
    section += row.map(escapeCSV).join(',') + '\n';
  });
  
  return section;
};

// Create Question Performance Section
const createQuestionSection = (responses: any[], language: 'en' | 'am'): string => {
  let section = `${escapeCSV(language === 'am' ? 'የጥያቄ አፈጻጸም' : 'Question Performance')}\n`;
  
  const headers = [
    language === 'am' ? 'ጥያቄ' : 'Question',
    language === 'am' ? 'አማካይ ነጥብ' : 'Average Score',
    language === 'am' ? 'አፈጻጸም ደረጃ' : 'Performance Level'
  ];
  
  section += headers.map(escapeCSV).join(',') + '\n';

  Object.entries(questionMap).forEach(([questionId, questionInfo]) => {
    const scores: number[] = [];
    
    responses.forEach(response => {
      if (response.responses) {
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
                            (language === 'am' ? 'ደካማ' : 'Poor');

    const row = [
      language === 'am' ? questionInfo.amharic : questionInfo.english,
      avg.toFixed(2),
      performanceLevel
    ];
    
    section += row.map(escapeCSV).join(',') + '\n';
  });
  
  return section;
};

// Create Demographics Section
const createDemographicsSection = (summaryData: any, language: 'en' | 'am'): string => {
  let section = `${escapeCSV(language === 'am' ? 'የሕዝብ ስብስብ ትንታኔ' : 'Demographics Analysis')}\n`;
  
  section += `${escapeCSV(language === 'am' ? 'ወንድ' : 'Male')},${escapeCSV(summaryData.demographicCounts?.gender?.male || 0)}\n`;
  section += `${escapeCSV(language === 'am' ? 'ሴት' : 'Female')},${escapeCSV(summaryData.demographicCounts?.gender?.female || 0)}\n`;
  
  return section;
};

// Create Raw Data Section
const createRawDataSection = (responses: any[], language: 'en' | 'am'): string => {
  let section = `${escapeCSV(language === 'am' ? 'ጥሬ መረጃ' : 'Raw Data')}\n`;
  
  const headers = [
    language === 'am' ? 'ቀን' : 'Date',
    language === 'am' ? 'ፆታ' : 'Gender',
    language === 'am' ? 'ዕድሜ' : 'Age',
    language === 'am' ? 'አጠቃላይ ነጥብ' : 'Overall Score'
  ];
  
  section += headers.map(escapeCSV).join(',') + '\n';

  responses.forEach(response => {
    const row = [
      new Date(response.created_at).toLocaleDateString(),
      language === 'am' ? (response.gender === 'male' ? 'ወንድ' : 'ሴት') : response.gender,
      response.age,
      response.overall_score?.toFixed(2) || '0.00'
    ];
    
    section += row.map(escapeCSV).join(',') + '\n';
  });
  
  return section;
};

// Create Font Instructions Section
const createFontInstructionsSection = (): string => {
  let section = 'የአማርኛ ፊደል መመሪያ - Amharic Font Instructions\n';
  section += 'ይህ ሪፖርት አማርኛ ጽሁፍ ይዟል። ትክክለኛ እይታ ለማግኘት Nyala ወይም Ebrima ፊደል ይምረጡ።\n';
  section += 'This report contains Amharic text. For proper display select Nyala or Ebrima font.\n';
  
  return section;
};