import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Download, 
  TrendingUp, 
  People, 
  Assessment,
  Star,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';
import { fetchOverallSummary } from '../services/api';
import { surveyResponseService } from '../services/supabaseService';
import { exportToCSV } from '../services/csvExportService';
import { exportToExcelCompatibleCSV } from '../services/excelCompatibleExport';

const ReportsSection = () => {
  const { i18n } = useTranslation();
  const [dateFilter, setDateFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');

  // Fetch overall summary data
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError 
  } = useQuery({
    queryKey: ['overallSummary'],
    queryFn: fetchOverallSummary,
    refetchInterval: 30000
  });

  // Fetch all responses for detailed analysis
  const { 
    data: allResponses, 
    isLoading: responsesLoading 
  } = useQuery({
    queryKey: ['allResponses', dateFilter, genderFilter],
    queryFn: () => {
      const filters: any = {};
      if (genderFilter !== 'all') filters.gender = genderFilter;
      if (dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'week') {
          filters.dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (dateFilter === 'month') {
          filters.dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        }
      }
      return surveyResponseService.getAll(filters);
    },
    refetchInterval: 30000
  });

  const handleExport = async () => {
    if (!allResponses || allResponses.length === 0) {
      alert(i18n.language === 'am' ? 'ምንም መረጃ የለም' : 'No data to export');
      return;
    }

    try {
      if (exportFormat === 'csv') {
        await exportToCSV(i18n.language as 'en' | 'am');
      } else {
        await exportToExcelCompatibleCSV(i18n.language as 'en' | 'am');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(i18n.language === 'am' ? 'ወደ ውጭ መላክ አልተሳካም' : 'Export failed');
    }
  };

  if (summaryLoading || responsesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
          {i18n.language === 'am' ? 'ሪፖርት በመዘጋጀት ላይ...' : 'Loading reports...'}
        </Typography>
      </Box>
    );
  }

  if (summaryError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {i18n.language === 'am' ? 'ሪፖርት ማምጣት አልተሳካም' : 'Failed to load reports'}
      </Alert>
    );
  }

  const responses = allResponses || [];

  return (
    <Box>
      {/* Header with Filters and Export */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
          {i18n.language === 'am' ? 'ዝርዝር ሪፖርቶች' : 'Detailed Reports'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {i18n.language === 'am' ? 'ጊዜ' : 'Period'}
            </InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">{i18n.language === 'am' ? 'ሁሉም' : 'All Time'}</MenuItem>
              <MenuItem value="week">{i18n.language === 'am' ? 'ባለፈው ሳምንት' : 'Last Week'}</MenuItem>
              <MenuItem value="month">{i18n.language === 'am' ? 'ባለፈው ወር' : 'Last Month'}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {i18n.language === 'am' ? 'ፆታ' : 'Gender'}
            </InputLabel>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">{i18n.language === 'am' ? 'ሁሉም' : 'All'}</MenuItem>
              <MenuItem value="male">{i18n.language === 'am' ? 'ወንድ' : 'Male'}</MenuItem>
              <MenuItem value="female">{i18n.language === 'am' ? 'ሴት' : 'Female'}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {i18n.language === 'am' ? 'ፎርማት' : 'Format'}
            </InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<Download />}
            variant="contained"
            onClick={handleExport}
            disabled={!responses || responses.length === 0}
            sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:disabled': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            {i18n.language === 'am' ? 'ወደ ውጭ ላክ' : 'Export'}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              mx: 'auto',
              mb: 2
            }}>
              <Star />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {summaryData?.overallCSAT?.toFixed(1) || '0.0'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አጠቃላይ እርካታ ነጥብ' : 'Overall CSAT Score'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              mx: 'auto',
              mb: 2
            }}>
              <People />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {responses.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'የተመረጡ ምላሾች' : 'Filtered Responses'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              mx: 'auto',
              mb: 2
            }}>
              <Assessment />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {responses.length > 0 
                ? ((responses.reduce((sum, r) => sum + (r.completion_rate || 0), 0) / responses.length) * 100).toFixed(0)
                : '0'
              }%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አማካይ ማጠናቀቂያ መጠን' : 'Avg Completion Rate'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              mx: 'auto',
              mb: 2
            }}>
              <TrendingUp />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {responses.length > 0 
                ? (responses.filter(r => r.overall_score >= 4).length / responses.length * 100).toFixed(0)
                : '0'
              }%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'ከፍተኛ እርካታ (4+)' : 'High Satisfaction (4+)'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Dimension Analysis */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
              {i18n.language === 'am' ? 'የአገልግሎት ጥራት ልኬቶች ትንተና' : 'Service Quality Dimensions Analysis'}
            </Typography>
            
            {responses.length > 0 ? (
              ['tangibility', 'responsiveness', 'reliability', 'assurance', 'empathy'].map((dimension) => {
                const dimensionScores = responses
                  .map(r => r.dimension_scores?.[dimension] || 0)
                  .filter(score => score > 0);
                
                const avgScore = dimensionScores.length > 0 
                  ? dimensionScores.reduce((sum, score) => sum + score, 0) / dimensionScores.length 
                  : 0;

                const dimensionLabels: Record<string, string> = {
                  tangibility: i18n.language === 'am' ? 'ተጨባጭነት' : 'Tangibility',
                  responsiveness: i18n.language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness',
                  reliability: i18n.language === 'am' ? 'ተዓማኒነት' : 'Reliability',
                  assurance: i18n.language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance',
                  empathy: i18n.language === 'am' ? 'ተሳትፎ' : 'Empathy'
                };

                return (
                  <Box key={dimension} sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {dimensionLabels[dimension]}
                      </Typography>
                      <Chip
                        label={`${avgScore.toFixed(1)}/5.0`}
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(avgScore / 5) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', py: 4 }}>
                {i18n.language === 'am' ? 'ምንም መረጃ የለም' : 'No data available'}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
              {i18n.language === 'am' ? 'የተሳታፊዎች ስርጭት' : 'Participant Distribution'}
            </Typography>
            
            {responses.length > 0 ? (
              <Box>
                {/* Gender Distribution */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                    {i18n.language === 'am' ? 'በፆታ' : 'By Gender'}
                  </Typography>
                  {['male', 'female'].map((gender) => {
                    const count = responses.filter(r => r.gender === gender).length;
                    const percentage = responses.length > 0 ? (count / responses.length) * 100 : 0;
                    
                    return (
                      <Box key={gender} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                            {i18n.language === 'am' ? (gender === 'male' ? 'ወንድ' : 'ሴት') : gender}
                          </Typography>
                          <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                            {count} ({percentage.toFixed(0)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: gender === 'male' 
                                ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                                : 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>

                {/* Age Distribution */}
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                    {i18n.language === 'am' ? 'በዕድመ' : 'By Age'}
                  </Typography>
                  {['18-30', '31-40', '41-50', '50+'].map((age) => {
                    const count = responses.filter(r => r.age === age).length;
                    const percentage = responses.length > 0 ? (count / responses.length) * 100 : 0;
                    
                    return (
                      <Box key={age} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                          {age}
                        </Typography>
                        <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                          {count} ({percentage.toFixed(0)}%)
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', py: 4 }}>
                {i18n.language === 'am' ? 'ምንም መረጃ የለም' : 'No data available'}
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Recent Responses Table */}
      <Card sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
          {i18n.language === 'am' ? 'የቅርብ ጊዜ ምላሾች' : 'Recent Responses'}
        </Typography>
        
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ቀን' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ፆታ' : 'Gender'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ዕድሜ' : 'Age'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'እርካታ ነጥብ' : 'CSAT Score'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ማጠናቀቂያ' : 'Completion'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', py: 4 }}>
                    {i18n.language === 'am' ? 'ምንም ምላሽ የለም' : 'No responses found'}
                  </TableCell>
                </TableRow>
              ) : (
                responses.slice(0, 10).map((response, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {new Date(response.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {i18n.language === 'am' ? (response.gender === 'male' ? 'ወንድ' : 'ሴት') : response.gender}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{response.age}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      <Chip 
                        label={response.overall_score.toFixed(1)} 
                        size="small"
                        sx={{ 
                          background: response.overall_score >= 4 
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : response.overall_score >= 3 
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {((response.completion_rate || 0) * 100).toFixed(0)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default ReportsSection;