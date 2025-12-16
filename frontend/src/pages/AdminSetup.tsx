import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,

} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPanelSettings,
  CheckCircle,
  Error,
  ArrowBack,
  Language
} from '@mui/icons-material';
import { createAdminUser, testSupabaseConnection } from '../utils/adminSetup';

const AdminSetup = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    const result = await testSupabaseConnection();
    
    if (result.success) {
      setConnectionStatus('success');
      setActiveStep(1);
    } else {
      setConnectionStatus('error');
      setError(result.error || 'Connection failed');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(i18n.language === 'am' ? 'የይለፍ ቃሎች አይመሳሰሉም' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(i18n.language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createAdminUser(email, password);
    
    if (result.success) {
      setSuccess(i18n.language === 'am' ? 'አስተዳዳሪ መለያ በተሳካ ሁኔታ ተፈጥሯል!' : 'Admin account created successfully!');
      setActiveStep(2);
      setTimeout(() => {
        navigate('/admin/signin');
      }, 3000);
    } else {
      setError(result.error || 'Failed to create admin account');
    }
    
    setLoading(false);
  };

  const steps = [
    {
      label: i18n.language === 'am' ? 'ግንኙነት ፈትሽ' : 'Test Connection',
      description: i18n.language === 'am' ? 'የSupabase ግንኙነት ይፈትሹ' : 'Test Supabase connection'
    },
    {
      label: i18n.language === 'am' ? 'አስተዳዳሪ ይፍጠሩ' : 'Create Admin',
      description: i18n.language === 'am' ? 'የመጀመሪያ አስተዳዳሪ መለያ ይፍጠሩ' : 'Create the first admin account'
    },
    {
      label: i18n.language === 'am' ? 'ተጠናቅቋል' : 'Complete',
      description: i18n.language === 'am' ? 'ማዋቀር ተጠናቅቋል' : 'Setup completed'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 3,
              '&:hover': { color: 'white' }
            }}
          >
            {i18n.language === 'am' ? 'ወደ ዋናው ገጽ ተመለስ' : 'Back to Home'}
          </Button>

          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3
          }}>
            <AdminPanelSettings sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            {i18n.language === 'am' ? 'አስተዳዳሪ ማዋቀር' : 'Admin Setup'}
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {i18n.language === 'am' 
              ? 'የመጀመሪያ አስተዳዳሪ መለያ ይፍጠሩ'
              : 'Create your first admin account'
            }
          </Typography>

          <Button
            startIcon={<Language />}
            onClick={toggleLanguage}
            sx={{ 
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              border: '1px solid',
              borderRadius: 2,
              mt: 2
            }}
          >
            {i18n.language === 'en' ? 'አማርኛ' : 'English'}
          </Button>
        </Box>

        {/* Setup Steps */}
        <Card sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'white' } }}>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    {step.description}
                  </Typography>

                  {/* Step 0: Test Connection */}
                  {index === 0 && (
                    <Box>
                      {error && connectionStatus === 'error' && (
                        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                          {error}
                        </Alert>
                      )}
                      
                      <Button
                        variant="contained"
                        onClick={testConnection}
                        disabled={connectionStatus === 'testing'}
                        startIcon={
                          connectionStatus === 'success' ? <CheckCircle /> : 
                          connectionStatus === 'error' ? <Error /> : null
                        }
                        sx={{
                          background: connectionStatus === 'success' 
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        }}
                      >
                        {connectionStatus === 'testing' 
                          ? (i18n.language === 'am' ? 'በመፈተሽ ላይ...' : 'Testing...')
                          : connectionStatus === 'success'
                          ? (i18n.language === 'am' ? 'ግንኙነት ተሳክቷል' : 'Connection Successful')
                          : (i18n.language === 'am' ? 'ግንኙነት ፈትሽ' : 'Test Connection')
                        }
                      </Button>
                    </Box>
                  )}

                  {/* Step 1: Create Admin */}
                  {index === 1 && (
                    <form onSubmit={handleCreateAdmin}>
                      {error && (
                        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                          {error}
                        </Alert>
                      )}

                      <TextField
                        fullWidth
                        label={i18n.language === 'am' ? 'አስተዳዳሪ ኢሜይል' : 'Admin Email'}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ 
                          mb: 3,
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label={i18n.language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{ 
                          mb: 3,
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label={i18n.language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{ 
                          mb: 3,
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                          }
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                        }}
                      >
                        {loading 
                          ? (i18n.language === 'am' ? 'በመፍጠር ላይ...' : 'Creating...')
                          : (i18n.language === 'am' ? 'አስተዳዳሪ ይፍጠሩ' : 'Create Admin')
                        }
                      </Button>
                    </form>
                  )}

                  {/* Step 2: Complete */}
                  {index === 2 && (
                    <Box sx={{ textAlign: 'center' }}>
                      {success && (
                        <Alert severity="success" sx={{ mb: 3, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                          {success}
                        </Alert>
                      )}
                      
                      <CheckCircle sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        {i18n.language === 'am' ? 'ማዋቀር ተጠናቅቋል!' : 'Setup Complete!'}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {i18n.language === 'am' 
                          ? 'ወደ መግቢያ ገጽ በቅርቡ ይዛወራሉ...'
                          : 'Redirecting to sign in page...'
                        }
                      </Typography>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {i18n.language === 'am' 
              ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ደህንነት ቢሮ'
              : 'Lemi Kura Sub-City Peace and Security Office'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSetup;