import { Box, Typography, Button, Avatar } from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SuccessMessage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Avatar sx={{ 
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        width: 100,
        height: 100,
        mx: 'auto',
        mb: 4
      }}>
        <CheckCircle sx={{ fontSize: 60 }} />
      </Avatar>
      
      <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
        {i18n.language === 'am' ? 'አመሰግናለሁ!' : 'Thank You!'}
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 600, mx: 'auto' }}>
        {i18n.language === 'am' 
          ? 'የእርስዎ ግምገማ በተሳካ ሁኔታ ተላክቷል። የእርስዎ አስተያየት የአገልግሎታችንን ጥራት ለማሻሻል ይረዳናል።'
          : 'Your survey has been submitted successfully. Your feedback helps us improve our service quality.'
        }
      </Typography>

      <Button
        startIcon={<Home />}
        variant="contained"
        size="large"
        onClick={() => navigate('/dashboard')}
        sx={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: 3,
          px: 4,
          py: 2,
          fontWeight: 600,
          fontSize: '1.1rem'
        }}
      >
        {i18n.language === 'am' ? 'ወደ ዳሽቦርድ ተመለስ' : 'Back to Dashboard'}
      </Button>
    </Box>
  );
};

export default SuccessMessage;