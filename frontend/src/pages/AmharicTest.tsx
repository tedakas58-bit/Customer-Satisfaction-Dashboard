import { Box, Typography, Button, Card, Alert } from '@mui/material';
import { Download, Science } from '@mui/icons-material';
import { testAmharicEncoding, testBrowserAmharicSupport, createTestAmharicCSV } from '../utils/amharicTest';
import { exportToExcelWithBOM } from '../services/exportService';

const AmharicTest = () => {
  const handleTestEncoding = () => {
    testAmharicEncoding();
    alert('Check browser console for encoding test results');
  };

  const handleTestBrowserSupport = () => {
    const isSupported = testBrowserAmharicSupport();
    alert(`Browser Amharic Support: ${isSupported ? '✅ Supported' : '❌ Not Supported'}`);
  };

  const handleTestExport = async () => {
    try {
      await exportToExcelWithBOM('am');
    } catch (error: any) {
      alert(`Export test failed: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
        የአማርኛ ፊደል ሙከራ - Amharic Font Test
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Sample Amharic Text
        </Typography>
        <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1, mb: 2 }}>
          <Typography sx={{ color: 'white', fontSize: '18px', lineHeight: 1.8 }}>
            የደንበኛ እርካታ ሪፖርት - አጠቃላይ ማጠቃለያ<br/>
            ለሚ ኩራ ክፍለ ከተማ ሰላምና ደህንነት ቢሮ<br/>
            ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ<br/>
            የአገልግሎት ጥራት ልኬቶች<br/>
            ተጨባጭነት፣ ፈጣን አገልግሎት፣ ተዓማኒነት፣ የሰራተኞች ብቃት፣ ተሳትፎ
          </Typography>
        </Box>
        <Alert severity="info">
          If the text above displays correctly, your browser supports Amharic fonts.
        </Alert>
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Test Functions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Science />}
            onClick={handleTestEncoding}
            sx={{ color: '#3B82F6', borderColor: '#3B82F6' }}
          >
            Test Encoding
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Science />}
            onClick={handleTestBrowserSupport}
            sx={{ color: '#10B981', borderColor: '#10B981' }}
          >
            Test Browser Support
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={createTestAmharicCSV}
            sx={{ color: '#F59E0B', borderColor: '#F59E0B' }}
          >
            Test CSV Export
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleTestExport}
            sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            Test Excel Export
          </Button>
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Font Instructions
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
          If Amharic text is not displaying correctly:
        </Typography>
        <Box component="ol" sx={{ color: 'rgba(255,255,255,0.8)', pl: 2 }}>
          <li>Install an Amharic font (Nyala, Ebrima, or from docs/fonts/)</li>
          <li>Restart your browser</li>
          <li>Try the test functions above</li>
          <li>For Excel: Use the "Excel (Amharic)" export option</li>
        </Box>
      </Card>
    </Box>
  );
};

export default AmharicTest;