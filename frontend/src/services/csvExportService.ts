import { surveyResponseService } from './supabaseService';

// Simple CSV export as fallback until xlsx is installed
export const exportToCSV = async (language: 'en' | 'am' = 'en') => {
  try {
    console.log('🔄 Starting CSV export...');
    
    // Fetch all data
    const responses = await surveyResponseService.getAll();
    const summaryData = await surveyResponseService.getOverallSummary();
    
    if (!responses || responses.length === 0) {
      alert(language === 'am' ? 'ምንም የሚወጣ መረጃ የለም' : 'No data to export');
      return;
    }

    console.log(`📊 Exporting ${responses.length} responses...`);

    // Create CSV content
    let csvContent = '';
    
    // Add header
    csvContent += language === 'am' ? 'የደንበኛ እርካታ ሪፖርት\n' : 'Customer Satisfaction Report\n';
    csvContent += language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት\n' : 'Lemi Kura Sub-City Peace and Security Office\n';
    csvContent += `${language === 'am' ? 'የሪፖርት ቀን' : 'Report Date'}: ${new Date().toLocaleDateString()}\n\n`;
    
    // Add summary
    csvContent += language === 'am' ? 'አጠቃላይ ማጠቃለያ\n' : 'Executive Summary\n';
    csvContent += `${language === 'am' ? 'አጠቃላይ ምላሾች' : 'Total Responses'}: ${responses.length}\n`;
    csvContent += `${language === 'am' ? 'አጠቃላይ እርካታ ነጥብ' : 'Overall CSAT Score'}: ${summaryData.overallCSAT?.toFixed(2) || '0.00'}\n`;
    csvContent += `${language === 'am' ? 'ምላሽ መጠን' : 'Response Rate'}: ${((summaryData.responseRate || 0) * 100).toFixed(1)}%\n\n`;
    
    // Add dimension scores
    csvContent += language === 'am' ? 'የአገልግሎት ጥራት ልኬቶች\n' : 'Service Quality Dimensions\n';
    csvContent += `${language === 'am' ? 'ተጨባጭነት' : 'Tangibility'}: ${summaryData.dimensionScores?.tangibility?.toFixed(2) || '0.00'}\n`;
    csvContent += `${language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness'}: ${summaryData.dimensionScores?.responsiveness?.toFixed(2) || '0.00'}\n`;
    csvContent += `${language === 'am' ? 'ተዓማኒነት' : 'Reliability'}: ${summaryData.dimensionScores?.reliability?.toFixed(2) || '0.00'}\n`;
    csvContent += `${language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance'}: ${summaryData.dimensionScores?.assurance?.toFixed(2) || '0.00'}\n`;
    csvContent += `${language === 'am' ? 'ተሳትፎ' : 'Empathy'}: ${summaryData.dimensionScores?.empathy?.toFixed(2) || '0.00'}\n\n`;
    
    // Add raw data header
    csvContent += language === 'am' ? 'ጥሬ መረጃ\n' : 'Raw Data\n';
    csvContent += [
      language === 'am' ? 'ቀን' : 'Date',
      language === 'am' ? 'ፆታ' : 'Gender',
      language === 'am' ? 'ዕድሜ' : 'Age',
      language === 'am' ? 'የጋብቻ ሁኔታ' : 'Marital Status',
      language === 'am' ? 'የትምህርት ደረጃ' : 'Education Level',
      language === 'am' ? 'አጠቃላይ ነጥብ' : 'Overall Score'
    ].join(',') + '\n';
    
    // Add response data
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
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = language === 'am' 
      ? `የደንበኛ-እርካታ-ሪፖርት-${timestamp}.csv`
      : `Customer-Satisfaction-Report-${timestamp}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ CSV export completed successfully');
    alert(language === 'am' 
      ? `ሪፖርት በተሳካ ሁኔታ ወደ ${filename} ተላክ`
      : `Report successfully exported to ${filename}`
    );

  } catch (error: any) {
    console.error('❌ Export error:', error);
    alert(language === 'am' 
      ? `ወደ CSV መላክ ሳይሳካ ቀረ: ${error.message}`
      : `CSV export failed: ${error.message}`
    );
  }
};