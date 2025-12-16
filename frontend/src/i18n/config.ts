import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Dashboard
      dashboard: 'Customer Satisfaction Dashboard',
      overallScore: 'Overall CSAT Score',
      totalResponses: 'Total Responses',
      demographics: 'Demographics',
      dimensions: 'Service Quality Dimensions',
      
      // Dimensions
      tangibility: 'Tangibility',
      responsiveness: 'Responsiveness',
      reliability: 'Reliability',
      assurance: 'Assurance',
      empathy: 'Empathy',
      
      // Demographics
      gender: 'Gender',
      age: 'Age',
      education: 'Education Level',
      maritalStatus: 'Marital Status',
      
      // Values
      male: 'Male',
      female: 'Female',
      married: 'Married',
      single: 'Single',
      divorced: 'Divorced',
      widowed: 'Widowed',
      
      // UI
      loading: 'Loading...',
      error: 'Error loading data',
      noData: 'No data available',
      filters: 'Filters',
      topQuestions: 'Top Performing Questions',
      bottomQuestions: 'Bottom Performing Questions',
      
      // Survey
      survey: 'Customer Satisfaction Survey',
      takeSurvey: 'Take Survey',
      personalInfo: 'Personal Information',
      serviceAssessment: 'Service Assessment',
      summary: 'Summary',
      submit: 'Submit',
      next: 'Next',
      back: 'Back',
      submitting: 'Submitting...',
      
      // Roles
      customer: 'Customer',
      admin: 'Administrator',
      selectRole: 'Select Your Role',
      startSurvey: 'Start Survey',
      openDashboard: 'Open Dashboard',
      viewReports: 'View reports and manage questions',
      fillSurvey: 'Fill out the service quality survey'
    }
  },
  am: {
    translation: {
      // Dashboard
      dashboard: 'የደንበኞች እርካታ ዳሽቦርድ',
      overallScore: 'አጠቃላይ የእርካታ ነጥብ',
      totalResponses: 'አጠቃላይ ምላሾች',
      demographics: 'የተሳታፊዎች መረጃ',
      dimensions: 'የአገልግሎት ጥራት ልኬቶች',
      
      // Header
      modernPlan: 'ዘመናዊ እቅድ እና ሪፖርት',
      genderSystem: 'የፆታ ስርዓት',
      organizationSector: 'የድርጅት ዘርፍ',
      logout: 'ውጣ',
      
      // Main content
      noPlans: 'ምንም የአማርኛ አቅጣጫ የለም',
      createPlan: 'አዲስ እቅድ ፍጠር',
      firstPlan: 'የመጀመሪያ እቅድ ፍጠር',
      backToMain: 'ወደ ዋናው ገጽ ተመለስ',
      
      // Dimensions
      tangibility: 'ተጨባጭነት',
      responsiveness: 'ፈጣን አገልግሎት',
      reliability: 'ተዓማኒነት',
      assurance: 'የሰራተኞች ብቃት',
      empathy: 'ተሳትፎ',
      
      // Demographics
      gender: 'ፆታ',
      age: 'ዕድሜ',
      education: 'የትምህርት ደረጃ',
      maritalStatus: 'የጋብቻ ሁኔታ',
      
      // Values
      male: 'ወንድ',
      female: 'ሴት',
      married: 'ያገባ',
      single: 'ያላገባ',
      divorced: 'የተፋታ',
      widowed: 'የሞተበት/ባት',
      
      // Education levels
      diploma: 'ዲፕሎማ',
      firstDegree: 'የመጀመሪያ ዲግሪ',
      certificate: 'ሰርተፊኬት',
      
      // UI
      loading: 'በመጫን ላይ...',
      error: 'መረጃ በመጫን ላይ ስህተት',
      noData: 'መረጃ የለም',
      filters: 'ማጣሪያዎች',
      topQuestions: 'ከፍተኛ አፈጻጸም ያላቸው ጥያቄዎች',
      bottomQuestions: 'ዝቅተኛ አፈጻጸም ያላቸው ጥያቄዎች',
      
      // Stats
      overallSatisfaction: 'አጠቃላይ እርካታ ነጥብ',
      responseRate: 'ምላሽ መጠን',
      weeklyChange: 'ሳምንታዊ ለውጥ',
      
      // Survey
      survey: 'የደንበኛ እርካታ ግምገማ',
      takeSurvey: 'ግምገማ ይሙሉ',
      personalInfo: 'የግል መረጃ',
      serviceAssessment: 'የአገልግሎት ግምገማ',
      summary: 'ማጠቃለያ',
      submit: 'ላክ',
      next: 'ቀጣይ',
      back: 'ወደ ኋላ',
      submitting: 'በመላክ ላይ...',
      
      // Roles
      customer: 'ደንበኛ',
      admin: 'አስተዳዳሪ',
      selectRole: 'የእርስዎን ሚና ይምረጡ',
      startSurvey: 'ግምገማ ይጀምሩ',
      openDashboard: 'ዳሽቦርድ ይክፈቱ',
      viewReports: 'ሪፖርቶችን ይመልከቱና ጥያቄዎችን ያስተዳድሩ',
      fillSurvey: 'የአገልግሎት ጥራት ግምገማ ይሙሉ'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;