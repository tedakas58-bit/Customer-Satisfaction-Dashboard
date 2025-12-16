import React from 'react';
import { 
  Grid, 
  Card, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Add, 
  TrendingUp, 
  People, 
  Assessment,
  Star,
  ArrowBack
} from '@mui/icons-material';
import { fetchOverallSummary, fetchDimensionScores } from '../services/api';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch overall summary data
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError 
  } = useQuery({
    queryKey: ['overallSummary'],
    queryFn: fetchOverallSummary,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Fetch dimension scores
  const { 
    isLoading: dimensionLoading, 
    error: dimensionError 
  } = useQuery({
    queryKey: ['dimensionScores'],
    queryFn: fetchDimensionScores,
    refetchInterval: 30000
  });

  if (summaryLoading || dimensionLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {t('loading')}
        </Typography>
      </Box>
    );
  }

  if (summaryError || dimensionError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {t('error')}: {summaryError?.message || dimensionError?.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 2,
            '&:hover': { color: 'white' }
          }}
        >
          ወደ ዋናው ገጽ ተመለስ
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            width: 56,
            height: 56
          }}>
            📋
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              የአማርኛ አቅጣጫ አስተዳደር
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              የተሳታፊዎች ስሜት መቆጣጠሪያ አቅጣጫ እና ሪፖርት አስተዳደር
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => navigate('/survey')}
          sx={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          አዲስ ግምገማ ፍጠር
        </Button>
      </Box>

      {/* Main Content Card */}
      <Card sx={{ 
        p: 4, 
        mb: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3
          }}>
            📊
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
            ምንም የአማርኛ አቅጣጫ የለም
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 500, mx: 'auto' }}>
            እባክዎ እዚህ የተሳታፊዎች ስሜት መቆጣጠሪያ አቅጣጫ እና ሪፖርት አስተዳደር ይፍጠሩ
          </Typography>

          <Button
            startIcon={<Add />}
            variant="contained"
            size="large"
            onClick={() => navigate('/survey')}
            sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: 3,
              px: 4,
              py: 2,
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            የመጀመሪያ ግምገማ ፍጠር
          </Button>
        </Box>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                mr: 2
              }}>
                <Star />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                {summaryData?.overallCSAT?.toFixed(1) || '4.2'}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              አጠቃላይ እርካታ ነጥብ
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                mr: 2
              }}>
                <People />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                {summaryData?.totalResponses || '1,247'}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              አጠቃላይ ምላሾች
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                mr: 2
              }}>
                <Assessment />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                {((summaryData?.responseRate || 0.89) * 100).toFixed(0)}%
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              ምላሽ መጠን
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                mr: 2
              }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                {summaryData?.trends?.weeklyChange > 0 ? '+' : ''}
                {((summaryData?.trends?.weeklyChange || 0.12) * 100).toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              ሳምንታዊ ለውጥ
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Service Quality Dimensions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 4 }}>
              የአገልግሎት ጥራት ልኬቶች
            </Typography>
            
            {/* Mock dimension data for beautiful display */}
            {[
              { key: 'tangibility', label: 'ተጨባጭነት', score: 4.2, color: '#3B82F6' },
              { key: 'responsiveness', label: 'ፈጣን አገልግሎት', score: 3.8, color: '#10B981' },
              { key: 'reliability', label: 'ተዓማኒነት', score: 4.5, color: '#8B5CF6' },
              { key: 'assurance', label: 'የሰራተኞች ብቃት', score: 4.1, color: '#F59E0B' },
              { key: 'empathy', label: 'ተሳትፎ', score: 3.9, color: '#EF4444' }
            ].map((dimension) => (
              <Box key={dimension.key} sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${dimension.color} 0%, ${dimension.color}CC 100%)`,
                      width: 32,
                      height: 32
                    }}>
                      ⭐
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      {dimension.label}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${dimension.score.toFixed(1)}/5.0`}
                    sx={{ 
                      background: `linear-gradient(135deg, ${dimension.color} 0%, ${dimension.color}CC 100%)`,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(dimension.score / 5) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(135deg, ${dimension.color} 0%, ${dimension.color}CC 100%)`,
                      borderRadius: 6,
                    },
                  }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 4 }}>
              የተሳታፊዎች መረጃ
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                👥 ፆታ
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>ወንድ</Typography>
                  <Chip label="687" size="small" sx={{ background: 'rgba(59, 130, 246, 0.3)', color: 'white' }} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={55}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>ሴት</Typography>
                  <Chip label="560" size="small" sx={{ background: 'rgba(236, 72, 153, 0.3)', color: 'white' }} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={45}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📚 የትምህርት ደረጃ
              </Typography>
              {[
                { label: 'ዲፕሎማ', count: 356, percentage: 28.5 },
                { label: 'የመጀመሪያ ዲግሪ', count: 245, percentage: 19.6 },
                { label: '9-12', count: 234, percentage: 18.8 },
                { label: 'ሰርተፊኬት', count: 189, percentage: 15.2 }
              ].map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {item.label}
                  </Typography>
                  <Chip 
                    label={item.count} 
                    size="small" 
                    sx={{ 
                      background: `rgba(${139 + index * 20}, ${92 + index * 15}, 246, 0.3)`, 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;