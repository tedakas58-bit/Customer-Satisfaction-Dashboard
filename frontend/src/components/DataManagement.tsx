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
  Add
} from '@mui/icons-material';
import { dataManagementService } from '../services/supabaseService';
import { addSampleData } from '../utils/sampleData';

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

  // Clear data mutation
  const clearDataMutation = useMutation({
    mutationFn: async () => {
      switch (clearType) {
        case 'all':
          return await dataManagementService.clearAllResponses();
        case 'dateRange':
          return await dataManagementService.clearResponsesByDateRange(
            filters.dateFrom, 
            filters.dateTo
          );
        case 'filtered':
          return await dataManagementService.clearResponsesByDemographics({
            gender: filters.gender || undefined,
            age: filters.age || undefined,
            educationLevel: filters.educationLevel || undefined,
            maritalStatus: filters.maritalStatus || undefined,
          });
        default:
          throw new Error('Invalid clear type');
      }
    },
    onSuccess: (result) => {
      // Refresh all related queries
      queryClient.invalidateQueries({ queryKey: ['databaseStats'] });
      queryClient.invalidateQueries({ queryKey: ['overallSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dimensionScores'] });
      queryClient.invalidateQueries({ queryKey: ['questionPerformance'] });
      
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
        </Grid>
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