import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Person, 
  AdminPanelSettings,
  Language,
  Assignment,
  BarChart
} from '@mui/icons-material';

const RoleSelection = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
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
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3
          }}>
            📊
          </Avatar>
          
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
            {i18n.language === 'am' ? 'የደንበኛ እርካታ ስርዓት' : 'Customer Satisfaction System'}
          </Typography>
          
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            {i18n.language === 'am' ? 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት' : 'Lemi Kura Sub-City Peace and Security Office'}
          </Typography>

          <Button
            startIcon={<Language />}
            onClick={toggleLanguage}
            sx={{ 
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              border: '1px solid',
              borderRadius: 2,
              mb: 4
            }}
          >
            {i18n.language === 'en' ? 'አማርኛ' : 'English'}
          </Button>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto' }}>
            {i18n.language === 'am' 
              ? 'እባክዎ የእርስዎን ሚና ይምረጡ። ደንበኛ ከሆኑ ግምገማውን ለመሙላት፣ አስተዳዳሪ ከሆኑ ደግሞ ሪፖርቶችን ለማየት።'
              : 'Please select your role. Choose Customer to fill out the survey, or Admin to view reports and manage questions.'
            }
          </Typography>
        </Box>

        {/* Role Cards */}
        <Grid container spacing={4} justifyContent="center">
          {/* Customer Role */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
              }
            }}
            onClick={() => navigate('/customer')}
            >
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3
              }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                {i18n.language === 'am' ? 'ደንበኛ' : 'Customer'}
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {i18n.language === 'am' 
                  ? 'የአገልግሎት ጥራት ግምገማ ይሙሉ'
                  : 'Fill out the service quality survey'
                }
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment sx={{ color: '#10B981', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {i18n.language === 'am' ? '15 ጥያቄዎች' : '15 Questions'}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                {i18n.language === 'am' ? 'ግምገማ ይጀምሩ' : 'Start Survey'}
              </Button>
            </Card>
          </Grid>

          {/* Admin Role */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
              }
            }}
            onClick={() => navigate('/admin/signin')}
            >
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3
              }}>
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                {i18n.language === 'am' ? 'አስተዳዳሪ' : 'Administrator'}
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {i18n.language === 'am' 
                  ? 'ሪፖርቶችን ይመልከቱና ጥያቄዎችን ያስተዳድሩ'
                  : 'View reports and manage questions'
                }
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart sx={{ color: '#8B5CF6', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {i18n.language === 'am' ? 'ትንታኔዎች' : 'Analytics'}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                {i18n.language === 'am' ? 'ዳሽቦርድ ይክፈቱ' : 'Open Dashboard'}
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {i18n.language === 'am' 
              ? 'የእርስዎ አስተያየት ለአገልግሎታችን መሻሻል በጣም ጠቃሚ ነው'
              : 'Your feedback is very important for improving our services'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RoleSelection;