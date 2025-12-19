import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  Download,
  TrendingUp,
  People,
  Assessment,
  Star,
  BarChart,
  Logout,
  Language,
  DeleteSweep
} from '@mui/icons-material';
import { fetchOverallSummary } from '../services/api';
import { questionService } from '../services/supabaseService';
import DataManagement from '../components/DataManagement';
import EmptyStateMessage from '../components/EmptyStateMessage';
import ReportsSection from '../components/ReportsSection';
import { addSampleData } from '../utils/sampleData';
import { exportToCSV } from '../services/csvExportService';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const { i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Fetch data
  const { data: summaryData } = useQuery({
    queryKey: ['overallSummary'],
    queryFn: () => fetchOverallSummary(),
    refetchInterval: 30000
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionService.getAll(),
    refetchInterval: 30000
  });

  // Add sample data mutation
  const addSampleMutation = useMutation({
    mutationFn: addSampleData,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dimensionScores'] });
      
      alert(i18n.language === 'am' 
        ? `${result.count} የናሙና ምላሾች ተጨመሩ`
        : `${result.count} sample responses added successfully`
      );
    },
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ስህተት: ${error.message}`
        : `Error: ${error.message}`
      );
    }
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: () => exportToCSV(i18n.language as 'en' | 'am'),
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ወደ CSV መላክ ሳይሳካ ቀረ: ${error.message}`
        : `CSV export failed: ${error.message}`
      );
    }
  });



  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditQuestion = (question: any) => {
    setSelectedQuestion(question);
    setQuestionDialog(true);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setQuestionDialog(true);
  };

  const renderAnalytics = () => {
    const hasNoData = !summaryData?.totalResponses || summaryData.totalResponses === 0;
    
    return (
    <Box>
      {/* Key Metrics */}
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
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {summaryData?.overallCSAT?.toFixed(1) || '4.2'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አጠቃላይ እርካታ' : 'Overall CSAT'}
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
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {summaryData?.totalResponses ?? 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አጠቃላይ ምላሾች' : 'Total Responses'}
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
              <TrendingUp />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {summaryData?.totalResponses > 0 ? ((summaryData?.responseRate || 0) * 100).toFixed(0) : 0}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'ምላሽ መጠን' : 'Response Rate'}
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
              <Assessment />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {questions.filter(q => q.is_active).length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'ንቁ ጥያቄዎች' : 'Active Questions'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Dimension Performance */}
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
          {i18n.language === 'am' ? 'የአገልግሎት ጥራት ልኬቶች' : 'Service Quality Dimensions'}
        </Typography>
        
        <Grid container spacing={3}>
          {[
            { key: 'tangibility', label: i18n.language === 'am' ? 'ተጨባጭነት' : 'Tangibility', color: '#3B82F6' },
            { key: 'responsiveness', label: i18n.language === 'am' ? 'ፈጣን አገልግሎት' : 'Responsiveness', color: '#10B981' },
            { key: 'reliability', label: i18n.language === 'am' ? 'ተዓማኒነት' : 'Reliability', color: '#8B5CF6' },
            { key: 'assurance', label: i18n.language === 'am' ? 'የሰራተኞች ብቃት' : 'Assurance', color: '#F59E0B' },
            { key: 'empathy', label: i18n.language === 'am' ? 'ተሳትፎ' : 'Empathy', color: '#EF4444' }
          ].map((dimension) => {
            // Get real score from summaryData, default to 0 if no data
            const realScore = summaryData?.dimensionScores?.[dimension.key] ?? 0;
            
            return (
            <Grid item xs={12} md={6} lg={4} key={dimension.key}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  {dimension.label}
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: dimension.color,
                  mb: 1 
                }}>
                  {realScore.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  / 5.0
                </Typography>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* Recent Responses */}
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            {i18n.language === 'am' ? 'የቅርብ ጊዜ ምላሾች' : 'Recent Responses'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Download />}
              variant="outlined"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending || !summaryData?.totalResponses}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                '&:disabled': {
                  color: 'rgba(255,255,255,0.4)',
                  borderColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              {exportMutation.isPending 
                ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Exporting...')
                : (i18n.language === 'am' ? 'ወደ CSV ላክ' : 'Export to CSV')
              }
            </Button>
            <Button
              startIcon={<DeleteSweep />}
              variant="outlined"
              onClick={() => setTabValue(3)}
              sx={{ 
                color: '#EF4444', 
                borderColor: 'rgba(239, 68, 68, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#EF4444'
                }
              }}
            >
              {i18n.language === 'am' ? 'መረጃ ሰርዝ' : 'Clear Data'}
            </Button>
          </Box>
        </Box>

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
                  {i18n.language === 'am' ? 'ሁኔታ' : 'Status'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!summaryData?.recentResponses || summaryData.recentResponses.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', py: 4 }}>
                    {i18n.language === 'am' ? 'ምንም የቅርብ ጊዜ ምላሽ የለም' : 'No recent responses'}
                  </TableCell>
                </TableRow>
              ) : (
                summaryData.recentResponses.slice(0, 4).map((response: any, index: number) => (
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
                          background: response.overall_score >= 4 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                          color: response.overall_score >= 4 ? '#10B981' : '#F59E0B'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      <Chip 
                        label={i18n.language === 'am' ? 'ተጠናቅቋል' : 'Complete'} 
                        size="small"
                        sx={{ background: 'rgba(16, 185, 129, 0.3)', color: '#10B981' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Empty State Message */}
      {hasNoData && (
        <EmptyStateMessage 
          onAddSampleData={() => addSampleMutation.mutate()}
          isLoading={addSampleMutation.isPending}
        />
      )}
    </Box>
    );
  };

  const renderQuestionManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
          {i18n.language === 'am' ? 'ጥያቄዎች አስተዳደር' : 'Question Management'}
        </Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleAddQuestion}
        >
          {i18n.language === 'am' ? 'አዲስ ጥያቄ ጨምር' : 'Add New Question'}
        </Button>
      </Box>

      <Card sx={{ p: 4 }}>
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ቅደም ተከተል' : 'Order'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ጥያቄ' : 'Question'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ልኬት' : 'Dimension'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'ሁኔታ' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {i18n.language === 'am' ? 'እርምጃዎች' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {question.order_number}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {i18n.language === 'am' ? question.text_amharic : question.text_english}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {i18n.language === 'am' ? question.text_english : question.text_amharic}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Chip 
                      label={question.dimension} 
                      size="small"
                      sx={{ background: 'rgba(139, 92, 246, 0.3)', color: '#8B5CF6' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Chip 
                      label={question.is_active ? (i18n.language === 'am' ? 'ንቁ' : 'Active') : (i18n.language === 'am' ? 'ቦዝ' : 'Inactive')} 
                      size="small"
                      sx={{ 
                        background: question.is_active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                        color: question.is_active ? '#10B981' : '#6B7280'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditQuestion(question)}
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ color: 'rgba(239, 68, 68, 0.8)' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              width: 56,
              height: 56
            }}>
              <BarChart />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                {i18n.language === 'am' ? 'አስተዳዳሪ ዳሽቦርድ' : 'Admin Dashboard'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {i18n.language === 'am' ? 'የደንበኛ እርካታ ግምገማ አስተዳደር' : 'Customer Satisfaction Survey Management'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {i18n.language === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome'}, {user?.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<Language />}
              onClick={toggleLanguage}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                border: '1px solid',
                borderRadius: 2
              }}
            >
              {i18n.language === 'en' ? 'አማ' : 'EN'}
            </Button>
            <Button
              startIcon={<Logout />}
              onClick={handleSignOut}
              sx={{ 
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                }
              }}
            >
              {i18n.language === 'am' ? 'ውጣ' : 'Sign Out'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { 
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600
            },
            '& .Mui-selected': { 
              color: 'white !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#10B981'
            }
          }}
        >
          <Tab label={i18n.language === 'am' ? 'ትንታኔዎች' : 'Analytics'} />
          <Tab label={i18n.language === 'am' ? 'ጥያቄዎች' : 'Questions'} />
          <Tab label={i18n.language === 'am' ? 'ሪፖርቶች' : 'Reports'} />
          <Tab label={i18n.language === 'am' ? 'የመረጃ አስተዳደር' : 'Data Management'} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {renderAnalytics()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderQuestionManagement()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <ReportsSection />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <DataManagement />
      </TabPanel>

      {/* Question Dialog */}
      <Dialog 
        open={questionDialog} 
        onClose={() => setQuestionDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {selectedQuestion 
            ? (i18n.language === 'am' ? 'ጥያቄ አርም' : 'Edit Question')
            : (i18n.language === 'am' ? 'አዲስ ጥያቄ ጨምር' : 'Add New Question')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.language === 'am' ? 'ጥያቄ (አማርኛ)' : 'Question (Amharic)'}
                defaultValue={selectedQuestion?.text_amharic || ''}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.language === 'am' ? 'ጥያቄ (እንግሊዝኛ)' : 'Question (English)'}
                defaultValue={selectedQuestion?.text_english || ''}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'ልኬት' : 'Dimension'}
                </InputLabel>
                <Select
                  defaultValue={selectedQuestion?.dimension || ''}
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  <MenuItem value="tangibility">Tangibility</MenuItem>
                  <MenuItem value="responsiveness">Responsiveness</MenuItem>
                  <MenuItem value="reliability">Reliability</MenuItem>
                  <MenuItem value="assurance">Assurance</MenuItem>
                  <MenuItem value="empathy">Empathy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={i18n.language === 'am' ? 'ቅደም ተከተል' : 'Order'}
                defaultValue={selectedQuestion?.order_number || ''}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {i18n.language === 'am' ? 'ሰርዝ' : 'Cancel'}
          </Button>
          <Button variant="contained">
            {i18n.language === 'am' ? 'አስቀምጥ' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;