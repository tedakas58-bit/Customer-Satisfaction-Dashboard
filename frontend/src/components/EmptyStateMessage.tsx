import { Box, Typography, Card, Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Assessment, Add, Info } from '@mui/icons-material';

interface EmptyStateMessageProps {
  onAddSampleData?: () => void;
  isLoading?: boolean;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ 
  onAddSampleData, 
  isLoading = false 
}) => {
  const { i18n } = useTranslation();

  return (
    <Card sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
      <Assessment sx={{ fontSize: 60, color: '#3B82F6', mb: 2 }} />
      
      <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
        {i18n.language === 'am' ? 'ምንም የደንበኛ ምላሽ የለም' : 'No Customer Responses Yet'}
      </Typography>
      
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, maxWidth: 500, mx: 'auto' }}>
        {i18n.language === 'am' 
          ? 'ዳሽቦርዱ ከደንበኞች ምላሾች ጋር ይሞላል። የናሙና መረጃ ጨምረው ዳሽቦርዱን ይሞክሩ ወይም ደንበኞች ግምገማውን እንዲሞሉ ያድርጉ።'
          : 'The dashboard will populate with customer responses. Add sample data to test the dashboard or have customers fill out the survey.'
        }
      </Typography>

      <Alert 
        severity="info" 
        sx={{ 
          mb: 3, 
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          '& .MuiAlert-icon': { color: '#3B82F6' },
          '& .MuiAlert-message': { color: 'white' }
        }}
        icon={<Info />}
      >
        <Typography variant="body2">
          {i18n.language === 'am' 
            ? 'የ0.0 ነጥብ ማሳያ ትክክል ነው - ምንም የደንበኛ ምላሽ ስለሌለ። ይህ ስህተት አይደለም።'
            : 'The 0.0 score display is correct - there are no customer responses yet. This is not an error.'
          }
        </Typography>
      </Alert>

      {onAddSampleData && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddSampleData}
            disabled={isLoading}
            sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            {isLoading
              ? (i18n.language === 'am' ? 'በመጨመር ላይ...' : 'Adding...')
              : (i18n.language === 'am' ? 'የናሙና መረጃ ጨምር' : 'Add Sample Data')
            }
          </Button>
          
          <Button
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {i18n.language === 'am' ? 'ግምገማ አጋራ' : 'Share Survey'}
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default EmptyStateMessage;