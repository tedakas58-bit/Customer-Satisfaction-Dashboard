import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward, Send, Person, Assessment } from '@mui/icons-material';
import { submitSurveyResponse } from '../services/api';

interface SurveyData {
  demographics: {
    gender: string;
    age: string;
    maritalStatus: string;
    educationLevel: string;
  };
  responses: {
    [key: string]: number;
  };
}

const SurveyForm = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeStep, setActiveStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    demographics: {
      gender: '',
      age: '',
      maritalStatus: '',
      educationLevel: '',
    },
    responses: {},
  });

  // Survey questions based on the Ethiopian questionnaire
  const serviceQuestions = [
    // Tangibility (ተጨባጭነት)
    {
      id: 'q1_facilities',
      dimension: 'tangibility',
      amharic: 'የቢሮው አካባቢ ንጹህና ደህንነቱ የተጠበቀ ነው',
      english: 'The office environment is clean and safe',
    },
    {
      id: 'q2_equipment',
      dimension: 'tangibility',
      amharic: 'ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው',
      english: 'The office has modern equipment and technology',
    },
    {
      id: 'q3_materials',
      dimension: 'tangibility',
      amharic: 'የመረጃ ቁሳቁሶች ግልጽና ተደራሽ ናቸው',
      english: 'Information materials are clear and accessible',
    },
    
    // Responsiveness (ፈጣን አገልግሎት)
    {
      id: 'q4_prompt_service',
      dimension: 'responsiveness',
      amharic: 'ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ',
      english: 'Staff provide prompt service',
    },
    {
      id: 'q5_willingness',
      dimension: 'responsiveness',
      amharic: 'ሰራተኞች ለመርዳት ፈቃደኛ ናቸው',
      english: 'Staff are willing to help',
    },
    {
      id: 'q6_availability',
      dimension: 'responsiveness',
      amharic: 'ሰራተኞች ሁልጊዜ ይገኛሉ',
      english: 'Staff are always available',
    },
    
    // Reliability (ተዓማኒነት)
    {
      id: 'q7_promised_time',
      dimension: 'reliability',
      amharic: 'አገልግሎቱ በተገለጸው ጊዜ ይሰጣል',
      english: 'Service is delivered at the promised time',
    },
    {
      id: 'q8_problem_solving',
      dimension: 'reliability',
      amharic: 'ችግሮች በተገቢው መንገድ ይፈታሉ',
      english: 'Problems are solved appropriately',
    },
    {
      id: 'q9_dependable',
      dimension: 'reliability',
      amharic: 'አገልግሎቱ ተዓማኒ ነው',
      english: 'The service is dependable',
    },
    
    // Assurance (የሰራተኞች ብቃት)
    {
      id: 'q10_competence',
      dimension: 'assurance',
      amharic: 'ሰራተኞች በቂ እውቀትና ክህሎት አላቸው',
      english: 'Staff have adequate knowledge and skills',
    },
    {
      id: 'q11_courtesy',
      dimension: 'assurance',
      amharic: 'ሰራተኞች ትሁትና አክባሪ ናቸው',
      english: 'Staff are courteous and respectful',
    },
    {
      id: 'q12_confidence',
      dimension: 'assurance',
      amharic: 'በአገልግሎቱ ላይ መተማመን አለኝ',
      english: 'I have confidence in the service',
    },
    
    // Empathy (ተሳትፎ)
    {
      id: 'q13_individual_attention',
      dimension: 'empathy',
      amharic: 'ሰራተኞች ለእያንዳንዱ ደንበኛ ልዩ ትኩረት ይሰጣሉ',
      english: 'Staff give individual attention to each customer',
    },
    {
      id: 'q14_understanding',
      dimension: 'empathy',
      amharic: 'ሰራተኞች የደንበኞችን ፍላጎት ይረዳሉ',
      english: 'Staff understand customer needs',
    },
    {
      id: 'q15_best_interests',
      dimension: 'empathy',
      amharic: 'ሰራተኞች የደንበኞችን ጥቅም ያስቀድማሉ',
      english: 'Staff act in customers\' best interests',
    },
  ];

  const steps = ['የግል መረጃ', 'የአገልግሎት ግምገማ', 'ማጠቃለያ'];

  const submitMutation = useMutation({
    mutationFn: submitSurveyResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dimensionScores'] });
      navigate('/dashboard');
    },
  });

  const handleDemographicChange = (field: string, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value,
      },
    }));
  };

  const handleResponseChange = (questionId: string, value: number) => {
    setSurveyData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Transform data to match API format
    const formattedData = {
      demographics: {
        gender: surveyData.demographics.gender as 'male' | 'female',
        age: surveyData.demographics.age as '18-30' | '31-40' | '41-50' | '50+',
        maritalStatus: surveyData.demographics.maritalStatus as 'married' | 'single' | 'divorced' | 'widowed',
        educationLevel: surveyData.demographics.educationLevel as 'unfilled' | '1-8' | '9-12' | 'certificate' | 'diploma' | 'first_degree' | 'second_degree_plus',
      },
      responses: {
        tangibility: {
          q1_facilities: surveyData.responses.q1_facilities || 3,
          q2_equipment: surveyData.responses.q2_equipment || 3,
          q3_materials: surveyData.responses.q3_materials || 3,
        },
        responsiveness: {
          q4_prompt_service: surveyData.responses.q4_prompt_service || 3,
          q5_willingness: surveyData.responses.q5_willingness || 3,
          q6_availability: surveyData.responses.q6_availability || 3,
        },
        reliability: {
          q7_promised_time: surveyData.responses.q7_promised_time || 3,
          q8_problem_solving: surveyData.responses.q8_problem_solving || 3,
          q9_dependable: surveyData.responses.q9_dependable || 3,
        },
        assurance: {
          q10_competence: surveyData.responses.q10_competence || 3,
          q11_courtesy: surveyData.responses.q11_courtesy || 3,
          q12_confidence: surveyData.responses.q12_confidence || 3,
        },
        empathy: {
          q13_individual_attention: surveyData.responses.q13_individual_attention || 3,
          q14_understanding: surveyData.responses.q14_understanding || 3,
          q15_best_interests: surveyData.responses.q15_best_interests || 3,
        },
      },
    };

    submitMutation.mutate(formattedData);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return Object.values(surveyData.demographics).every(value => value !== '');
      case 1:
        return serviceQuestions.every(q => surveyData.responses[q.id] !== undefined);
      default:
        return true;
    }
  };

  const renderDemographics = () => (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 3, textAlign: 'center' }}>
          {i18n.language === 'am' ? 'የተሳታፊዎች አጠቃላይ መረጃ' : 'Participant General Information'}
        </Typography>
      </Grid>

      {/* Gender */}
      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            {i18n.language === 'am' ? 'ፆታ' : 'Gender'}
          </FormLabel>
          <RadioGroup
            value={surveyData.demographics.gender}
            onChange={(e) => handleDemographicChange('gender', e.target.value)}
          >
            <FormControlLabel 
              value="male" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ወንድ' : 'Male'}</Typography>} 
            />
            <FormControlLabel 
              value="female" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሴት' : 'Female'}</Typography>} 
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Age */}
      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            {i18n.language === 'am' ? 'ዕድሜ' : 'Age'}
          </FormLabel>
          <RadioGroup
            value={surveyData.demographics.age}
            onChange={(e) => handleDemographicChange('age', e.target.value)}
          >
            <FormControlLabel value="18-30" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>18-30</Typography>} />
            <FormControlLabel value="31-40" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>31-40</Typography>} />
            <FormControlLabel value="41-50" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>41-50</Typography>} />
            <FormControlLabel value="50+" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>50+</Typography>} />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Marital Status */}
      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            {i18n.language === 'am' ? 'የጋብቻ ሁኔታ' : 'Marital Status'}
          </FormLabel>
          <RadioGroup
            value={surveyData.demographics.maritalStatus}
            onChange={(e) => handleDemographicChange('maritalStatus', e.target.value)}
          >
            <FormControlLabel 
              value="married" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ያገባ' : 'Married'}</Typography>} 
            />
            <FormControlLabel 
              value="single" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ያላገባ' : 'Single'}</Typography>} 
            />
            <FormControlLabel 
              value="divorced" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'የተፋታ' : 'Divorced'}</Typography>} 
            />
            <FormControlLabel 
              value="widowed" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'የሞተበት/ባት' : 'Widowed'}</Typography>} 
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Education Level */}
      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            {i18n.language === 'am' ? 'የትምህርት ደረጃ' : 'Education Level'}
          </FormLabel>
          <RadioGroup
            value={surveyData.demographics.educationLevel}
            onChange={(e) => handleDemographicChange('educationLevel', e.target.value)}
          >
            <FormControlLabel 
              value="unfilled" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ያልተሞላ' : 'Unfilled'}</Typography>} 
            />
            <FormControlLabel 
              value="1-8" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>1-8</Typography>} 
            />
            <FormControlLabel 
              value="9-12" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>9-12</Typography>} 
            />
            <FormControlLabel 
              value="certificate" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሰርተፊኬት' : 'Certificate'}</Typography>} 
            />
            <FormControlLabel 
              value="diploma" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ዲፕሎማ' : 'Diploma'}</Typography>} 
            />
            <FormControlLabel 
              value="first_degree" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'የመጀመሪያ ዲግሪ' : 'First Degree'}</Typography>} 
            />
            <FormControlLabel 
              value="second_degree_plus" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሁለተኛ ዲግሪና ከዚያ በላይ' : 'Second Degree and Above'}</Typography>} 
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderServiceQuestions = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 4, textAlign: 'center' }}>
        {i18n.language === 'am' ? 'የአገልግሎት ጥራት ግምገማ' : 'Service Quality Assessment'}
      </Typography>
      
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, textAlign: 'center' }}>
        {i18n.language === 'am' 
          ? 'እባክዎ ከ1 (በጣም አልስማማም) እስከ 5 (በጣም እስማማለሁ) ድረስ ይመርጡ'
          : 'Please rate from 1 (Strongly Disagree) to 5 (Strongly Agree)'
        }
      </Typography>

      <Grid container spacing={3}>
        {serviceQuestions.map((question, index) => (
          <Grid item xs={12} key={question.id}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                {index + 1}. {i18n.language === 'am' ? question.amharic : question.english}
              </Typography>
              
              <RadioGroup
                row
                value={surveyData.responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                sx={{ justifyContent: 'center', gap: 2 }}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio sx={{ color: 'white' }} />}
                    label={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {value === 1 && (i18n.language === 'am' ? 'በጣም አልስማማም' : 'Strongly Disagree')}
                          {value === 2 && (i18n.language === 'am' ? 'አልስማማም' : 'Disagree')}
                          {value === 3 && (i18n.language === 'am' ? 'መካከለኛ' : 'Neutral')}
                          {value === 4 && (i18n.language === 'am' ? 'እስማማለሁ' : 'Agree')}
                          {value === 5 && (i18n.language === 'am' ? 'በጣም እስማማለሁ' : 'Strongly Agree')}
                        </Typography>
                      </Box>
                    }
                    labelPlacement="bottom"
                  />
                ))}
              </RadioGroup>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSummary = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar sx={{ 
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        width: 80,
        height: 80,
        mx: 'auto',
        mb: 3
      }}>
        <Assessment sx={{ fontSize: 40 }} />
      </Avatar>
      
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
        {i18n.language === 'am' ? 'ግምገማ ማጠቃለያ' : 'Survey Summary'}
      </Typography>
      
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
        {i18n.language === 'am' 
          ? 'እባክዎ መረጃዎን ይገምግሙና ለመላክ ዝግጁ ከሆኑ "ላክ" ን ይጫኑ'
          : 'Please review your information and click "Submit" when ready to send'
        }
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              {i18n.language === 'am' ? 'የግል መረጃ' : 'Personal Information'}
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {i18n.language === 'am' ? 'ፆታ: ' : 'Gender: '} 
                {surveyData.demographics.gender === 'male' 
                  ? (i18n.language === 'am' ? 'ወንድ' : 'Male')
                  : (i18n.language === 'am' ? 'ሴት' : 'Female')
                }
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {i18n.language === 'am' ? 'ዕድሜ: ' : 'Age: '} {surveyData.demographics.age}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {i18n.language === 'am' ? 'የትምህርት ደረጃ: ' : 'Education: '} {surveyData.demographics.educationLevel}
              </Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              {i18n.language === 'am' ? 'ምላሽ ሁኔታ' : 'Response Status'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'የተመለሱ ጥያቄዎች: ' : 'Answered Questions: '} 
              {Object.keys(surveyData.responses).length}/{serviceQuestions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(Object.keys(surveyData.responses).length / serviceQuestions.length) * 100}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 4,
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>

      {submitMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {i18n.language === 'am' ? 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።' : 'An error occurred. Please try again.'}
        </Alert>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 2,
            '&:hover': { color: 'white' }
          }}
        >
          {i18n.language === 'am' ? 'ወደ ዳሽቦርድ ተመለስ' : 'Back to Dashboard'}
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            width: 56,
            height: 56
          }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {i18n.language === 'am' ? 'የደንበኛ እርካታ ግምገማ' : 'Customer Satisfaction Survey'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ደህንነት ቢሮ' : 'Lemi Kura Sub-City Peace and Security Office'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepComplete(index)}>
              <StepLabel sx={{ 
                '& .MuiStepLabel-label': { color: 'white', fontWeight: 600 },
                '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#10B981' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' },
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* Form Content */}
      <Card sx={{ p: 4, mb: 4 }}>
        {activeStep === 0 && renderDemographics()}
        {activeStep === 1 && renderServiceQuestions()}
        {activeStep === 2 && renderSummary()}
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            border: '1px solid',
          }}
        >
          {i18n.language === 'am' ? 'ወደ ኋላ' : 'Back'}
        </Button>

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepComplete(activeStep)}
            endIcon={<ArrowForward />}
            variant="contained"
          >
            {i18n.language === 'am' ? 'ቀጣይ' : 'Next'}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || !isStepComplete(activeStep)}
            endIcon={<Send />}
            variant="contained"
          >
            {submitMutation.isPending 
              ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Submitting...')
              : (i18n.language === 'am' ? 'ላክ' : 'Submit')
            }
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SurveyForm;