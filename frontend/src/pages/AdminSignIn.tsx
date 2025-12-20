import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPanelSettings,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Language
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const AdminSignIn = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Successfully signed in, redirect to admin dashboard
        navigate('/admin');
      }
    } catch (error: any) {
      setError(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(i18n.language === 'am' ? 'እባክዎ ኢሜይልዎን ያስገቡ' : 'Please enter your email first');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      setError('');
      alert(i18n.language === 'am' 
        ? 'የይለፍ ቃል ዳግም ማስተካከያ ሊንክ ወደ ኢሜይልዎ ተልኳል'
        : 'Password reset link sent to your email'
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

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
      <Box sx={{ width: '100%', maxWidth: 450 }}>
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
            {i18n.language === 'am' ? 'አስተዳዳሪ መግቢያ' : 'Administrator Sign In'}
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {i18n.language === 'am' 
              ? 'የአስተዳደር ዳሽቦርድ ለመድረስ ይግቡ'
              : 'Sign in to access the admin dashboard'
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

        {/* Sign In Form */}
        <Card sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <form onSubmit={handleSignIn}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label={i18n.language === 'am' ? 'ኢሜይል አድራሻ' : 'Email Address'}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={i18n.language === 'am' ? 'የይለፍ ቃል' : 'Password'}
              type={showPassword ? 'text' : 'password'}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.1rem',
                mb: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                }
              }}
            >
              {loading 
                ? (i18n.language === 'am' ? 'በመግባት ላይ...' : 'Signing In...')
                : (i18n.language === 'am' ? 'ግባ' : 'Sign In')
              }
            </Button>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

            <Button
              fullWidth
              variant="text"
              onClick={handleForgotPassword}
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                mb: 1
              }}
            >
              {i18n.language === 'am' ? 'የይለፍ ቃልዎን ረሱት?' : 'Forgot Password?'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/admin/setup')}
              sx={{ 
                color: 'rgba(139, 92, 246, 0.9)',
                '&:hover': { color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }
              }}
            >
              {i18n.language === 'am' ? 'የመጀመሪያ አስተዳዳሪ ይፍጠሩ' : 'First Time Setup'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {i18n.language === 'am' 
              ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት'
              : 'Lemi Kura Sub-City Peace and Security Office'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSignIn;