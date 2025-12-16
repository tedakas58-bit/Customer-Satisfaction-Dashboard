import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  DeleteSweep,
  Warning,
  Assessment,
  CalendarToday,
  People,
  Add,
  BugReport,
  Refresh,
  Download
} from '@mui/icons-material';
import { dataManagementService } from '../services/supabaseService';
import { addSampleData } from '../utils/sampleData';
import { debugDatabase, testClearFunction } from '../utils/debugDatabase';
import { exportToCSV } from '../services/csvExportService';
import { exportToExcelCompatibleCSV } from '../services/excelCompatibleExport';

const DataManagement = () => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  
  const [clearDialog, setClearDialog] = useState(false);
  const [clearType, setClearType] = useState<'all' | 'filtered' | 'dateRange'>('all');
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    educationLevel: '',
    maritalStatus: '',
    dateFrom: '',
    dateTo: ''
  });
  const [confirmText, setConfirmText] = useState('');

  // Get database statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['databaseStats'],
    queryFn: () => dataManagementService.getDatabaseStats(),
    refetchInterval: 30000
  });

  // Add sample data mutation
  const addSampleMutation = useMutation({
    mutationFn: addSampleData,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['databaseStats'] });
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

  // Export mutations
  const exportCSVMutation = useMutation({
    mutationFn: () => exportToCSV(i18n.language as 'en' | 'am'),
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ወደ CSV መላክ ሳይሳካ ቀረ: ${error.message}`
        : `CSV export failed: ${error.message}`
      );
    }
  });

  const exportExcelCompatibleMutation = useMutation({
    mutationFn: () => exportToExcelCompatibleCSV(i18n.language as 'en' | 'am'),
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ወደ Excel መላክ ሳይሳካ ቀረ: ${error.message}`
        : `Excel export failed: ${error.message}`
      );
    }
  });

  // Clear data mutation
  const clearDataMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting clear operation, type:', clearType);
      
      let result;
      switch (clearType) {
        case 'all':
          console.log('Clearing all responses...');
          result = await dataManagementService.clearAllResponses();
          break;
        case 'dateRange':
          console.log('Clearing by date range:', filters.dateFrom, 'to', filters.dateTo);
          result = await dataManagementService.clearResponsesByDateRange(
            filters.dateFrom, 
            filters.dateTo
          );
          break;
        case 'filtered':
          console.log('Clearing by demographics:', filters);
          result = await dataManagementService.clearResponsesByDemographics({
            gender: filters.gender || undefined,
            age: filters.age || undefined,
            educationLevel: filters.educationLevel || undefined,
            maritalStatus: filters.maritalStatus || undefined,
          });
          break;
        default:
          throw new Error('Invalid clear type');
      }
      
      console.log('Clear operation result:', result);
      return result;
    },
    onSuccess: (result) => {
      // Refresh all related queries - be more aggressive with cache clearing
      queryClient.invalidateQueries({ queryKey: ['databaseStats'] });
      queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dimensionScores'] });
      queryClient.invalidateQueries({ queryKey: ['questionPerformance'] });
      
      // Also clear any cached survey response data
      queryClient.removeQueries({ queryKey: ['overallSummary'] });
      queryClient.removeQueries({ queryKey: ['dimensionScores'] });
      queryClient.removeQueries({ queryKey: ['databaseStats'] });
      
      // Force refetch immediately
      queryClient.refetchQueries({ queryKey: ['overallSummary'] });
      queryClient.refetchQueries({ queryKey: ['databaseStats'] });
      
      setClearDialog(false);
      setConfirmText('');
      
      // Show success message
      alert(i18n.language === 'am' 
        ? `${result.count} ምላሾች ተሰርዘዋል`
        : `${result.count} responses cleared successfully`
      );
    },
    onError: (error: any) => {
      alert(i18n.language === 'am' 
        ? `ስህተት: ${error.message}`
        : `Error: ${error.message}`
      );
    }
  });

  const handleClearData = () => {
    const requiredConfirmText = 'DELETE';
    if (confirmText !== requiredConfirmText) {
      alert(i18n.language === 'am' 
        ? `እባክዎ "${requiredConfirmText}" ብለው ይጻፉ`
        : `Please type "${requiredConfirmText}" to confirm`
      );
      return;
    }

    clearDataMutation.mutate();
  };

  const renderClearOptions = () => (
    <Box>
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <FormLabel sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
          {i18n.language === 'am' ? 'የመሰረዝ አይነት ይምረጡ' : 'Select Clear Type'}
        </FormLabel>
        <RadioGroup
          value={clearType}
          onChange={(e) => setClearType(e.target.value as any)}
        >
          <FormControlLabel 
            value="all" 
            control={<Radio sx={{ color: 'white' }} />} 
            label={
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {i18n.language === 'am' ? 'ሁሉንም ምላሾች ሰርዝ' : 'Clear All Responses'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'ሁሉንም የደንበኛ ምላሾች ይሰርዛል' : 'Deletes all customer survey responses'}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel 
            value="dateRange" 
            control={<Radio sx={{ color: 'white' }} />} 
            label={
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {i18n.language === 'am' ? 'በቀን ክልል ሰርዝ' : 'Clear by Date Range'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'በተወሰነ ቀን ክልል ውስጥ ያሉ ምላሾች ይሰርዛል' : 'Deletes responses within a specific date range'}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel 
            value="filtered" 
            control={<Radio sx={{ color: 'white' }} />} 
            label={
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {i18n.language === 'am' ? 'በመረጃ መሰረት ሰርዝ' : 'Clear by Demographics'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {i18n.language === 'am' ? 'በፆታ፣ ዕድሜ፣ ወዘተ መሰረት ምላሾች ይሰርዛል' : 'Deletes responses based on gender, age, etc.'}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {/* Date Range Filters */}
      {clearType === 'dateRange' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label={i18n.language === 'am' ? 'ከ ቀን' : 'From Date'}
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': { 
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label={i18n.language === 'am' ? 'እስከ ቀን' : 'To Date'}
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              InputLabelProps={{ shrink: true }}
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
      )}

      {/* Demographic Filters */}
      {clearType === 'filtered' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                {i18n.language === 'am' ? 'ፆታ' : 'Gender'}
              </FormLabel>
              <RadioGroup
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              >
                <FormControlLabel value="" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሁሉም' : 'All'}</Typography>} />
                <FormControlLabel value="male" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ወንድ' : 'Male'}</Typography>} />
                <FormControlLabel value="female" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሴት' : 'Female'}</Typography>} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                {i18n.language === 'am' ? 'ዕድሜ' : 'Age'}
              </FormLabel>
              <RadioGroup
                value={filters.age}
                onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
              >
                <FormControlLabel value="" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>{i18n.language === 'am' ? 'ሁሉም' : 'All'}</Typography>} />
                <FormControlLabel value="18-30" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>18-30</Typography>} />
                <FormControlLabel value="31-40" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>31-40</Typography>} />
                <FormControlLabel value="41-50" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>41-50</Typography>} />
                <FormControlLabel value="50+" control={<Radio sx={{ color: 'white' }} />} 
                  label={<Typography sx={{ color: 'white' }}>50+</Typography>} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      )}

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Confirmation */}
      <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {i18n.language === 'am' ? '⚠️ ማስጠንቀቂያ' : '⚠️ Warning'}
        </Typography>
        <Typography>
          {i18n.language === 'am' 
            ? 'ይህ ተግባር ሊመለስ አይችልም። የተሰረዙ መረጃዎች ለዘላለም ይጠፋሉ።'
            : 'This action cannot be undone. Deleted data will be permanently lost.'
          }
        </Typography>
      </Alert>

      <TextField
        fullWidth
        label={i18n.language === 'am' ? '"DELETE" ብለው ይጻፉ' : 'Type "DELETE" to confirm'}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        sx={{ 
          mb: 3,
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
          '& .MuiOutlinedInput-root': { 
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
          }
        }}
      />
    </Box>
  );

  return (
    <Box>
      {/* Database Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Assessment sx={{ fontSize: 40, color: '#3B82F6', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {statsLoading ? <CircularProgress size={24} /> : stats?.totalResponses || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አጠቃላይ ምላሾች' : 'Total Responses'}
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <People sx={{ fontSize: 40, color: '#10B981', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {statsLoading ? <CircularProgress size={24} /> : stats?.totalQuestions || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'አጠቃላይ ጥያቄዎች' : 'Total Questions'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CalendarToday sx={{ fontSize: 40, color: '#F59E0B', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {statsLoading ? '...' : new Date(stats?.lastUpdated || '').toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'am' ? 'የመጨረሻ ዝመና' : 'Last Updated'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Data Management Actions */}
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
          {i18n.language === 'am' ? 'የመረጃ አስተዳደር' : 'Data Management'}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, border: '1px solid rgba(244, 67, 54, 0.3)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DeleteSweep sx={{ color: '#EF4444', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {i18n.language === 'am' ? 'ምላሾች ሰርዝ' : 'Clear Responses'}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {i18n.language === 'am' 
                  ? 'የደንበኛ ምላሾችን በተለያዩ መንገዶች ማጽዳት ይችላሉ። ይህ ተግባር ሊመለስ አይችልም።'
                  : 'Clear customer survey responses in various ways. This action cannot be undone.'
                }
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Warning />}
                onClick={() => setClearDialog(true)}
                sx={{ 
                  color: '#EF4444',
                  borderColor: '#EF4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#DC2626'
                  }
                }}
              >
                {i18n.language === 'am' ? 'ምላሾች ሰርዝ' : 'Clear Responses'}
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Add sx={{ color: '#10B981', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {i18n.language === 'am' ? 'የናሙና መረጃ ጨምር' : 'Add Sample Data'}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {i18n.language === 'am' 
                  ? '5 የናሙና የደንበኛ ምላሾችን ጨምር ዳሽቦርዱን ለመሞከር። ይህ የተለያዩ ደረጃዎችን ያሳያል።'
                  : 'Add 5 sample customer responses to test the dashboard. This will show various ratings and demographics.'
                }
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => addSampleMutation.mutate()}
                disabled={addSampleMutation.isPending}
                sx={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  }
                }}
              >
                {addSampleMutation.isPending
                  ? (i18n.language === 'am' ? 'በመጨመር ላይ...' : 'Adding...')
                  : (i18n.language === 'am' ? 'የናሙና መረጃ ጨምር' : 'Add Sample Data')
                }
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Download sx={{ color: '#3B82F6', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {i18n.language === 'am' ? 'ሪፖርት ላክ' : 'Export Reports'}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {i18n.language === 'am' 
                  ? 'ሙሉ የደንበኛ እርካታ ሪፖርት በተለያዩ ቅርጸቶች ላክ። ለአማርኛ ጽሁፍ Excel (UTF-8 BOM) ይመከራል።'
                  : 'Export comprehensive customer satisfaction report in various formats. Excel (UTF-8 BOM) is recommended for Amharic text.'
                }
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => exportCSVMutation.mutate()}
                  disabled={exportCSVMutation.isPending || !stats?.totalResponses}
                  sx={{ 
                    background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(107, 114, 128, 0.3)',
                    }
                  }}
                >
                  {exportCSVMutation.isPending
                    ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Exporting...')
                    : (i18n.language === 'am' ? 'CSV ላክ' : 'Export CSV')
                  }
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => exportExcelCompatibleMutation.mutate()}
                  disabled={exportExcelCompatibleMutation.isPending || !stats?.totalResponses}
                  sx={{ 
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(59, 130, 246, 0.3)',
                    }
                  }}
                >
                  {exportExcelCompatibleMutation.isPending
                    ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Exporting...')
                    : (i18n.language === 'am' ? 'Excel (አማርኛ)' : 'Excel (Amharic)')
                  }
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => exportExcelCompatibleMutation.mutate()}
                  disabled={exportExcelCompatibleMutation.isPending || !stats?.totalResponses}
                  sx={{ 
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(16, 185, 129, 0.3)',
                    }
                  }}
                >
                  {exportExcelCompatibleMutation.isPending
                    ? (i18n.language === 'am' ? 'በመላክ ላይ...' : 'Exporting...')
                    : (i18n.language === 'am' ? 'Excel (አማርኛ) v2' : 'Excel (Amharic) v2')
                  }
                </Button>
              </Box>

              {i18n.language === 'am' && (
                <Alert severity="info" sx={{ mt: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <Typography variant="body2">
                    💡 <strong>ለአማርኛ ጽሁፍ:</strong> "Excel (አማርኛ)" ቁልፍን ይጠቀሙ። ይህ የተሻለ አማርኛ ድጋፍ ይሰጣል።
                  </Typography>
                </Alert>
              )}
              
              {i18n.language === 'en' && (
                <Alert severity="info" sx={{ mt: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <Typography variant="body2">
                    💡 <strong>For Amharic text:</strong> Use "Excel (Amharic)" button. This provides better Amharic text support.
                  </Typography>
                </Alert>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Debug Section */}
        <Card sx={{ p: 3, mt: 3, border: '1px solid rgba(156, 163, 175, 0.3)' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            🔧 Debug Tools
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<BugReport />}
              onClick={async () => {
                const result = await debugDatabase();
                console.log('Debug result:', result);
                alert(`Database Debug:\nResponses: ${result.responseCount || 0}\nQuestions: ${result.questionCount || 0}\nCheck console for details`);
              }}
              sx={{ 
                color: '#6B7280',
                borderColor: 'rgba(107, 114, 128, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  borderColor: '#6B7280'
                }
              }}
            >
              Debug Database
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DeleteSweep />}
              onClick={async () => {
                const result = await testClearFunction();
                console.log('Test clear result:', result);
                alert(`Clear Test Result:\n${result.success ? 'Success' : 'Failed'}\nCount: ${(result as any).count || 0}\nCheck console for details`);
                if (result.success) {
                  queryClient.invalidateQueries({ queryKey: ['databaseStats'] });
                  queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
                }
              }}
              sx={{ 
                color: '#EF4444',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#EF4444'
                }
              }}
            >
              Test Clear Function
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                // Force refresh all data
                queryClient.removeQueries({ queryKey: ['databaseStats'] });
                queryClient.removeQueries({ queryKey: ['overallSummary'] });
                queryClient.removeQueries({ queryKey: ['dimensionScores'] });
                queryClient.refetchQueries({ queryKey: ['databaseStats'] });
                queryClient.refetchQueries({ queryKey: ['overallSummary'] });
                queryClient.refetchQueries({ queryKey: ['dimensionScores'] });
                alert('Data refreshed! Check the Analytics tab.');
              }}
              sx={{ 
                color: '#3B82F6',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderColor: '#3B82F6'
                }
              }}
            >
              Force Refresh
            </Button>
          </Box>
        </Card>
      </Card>

      {/* Clear Data Dialog */}
      <Dialog 
        open={clearDialog} 
        onClose={() => setClearDialog(false)}
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
        <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <DeleteSweep sx={{ mr: 2, color: '#EF4444' }} />
          {i18n.language === 'am' ? 'ምላሾች ሰርዝ' : 'Clear Survey Responses'}
        </DialogTitle>
        
        <DialogContent>
          {renderClearOptions()}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setClearDialog(false)} 
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {i18n.language === 'am' ? 'ሰርዝ' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleClearData}
            disabled={clearDataMutation.isPending || confirmText !== 'DELETE'}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              }
            }}
          >
            {clearDataMutation.isPending 
              ? (i18n.language === 'am' ? 'በመሰረዝ ላይ...' : 'Clearing...')
              : (i18n.language === 'am' ? 'ሰርዝ' : 'Clear Data')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataManagement;