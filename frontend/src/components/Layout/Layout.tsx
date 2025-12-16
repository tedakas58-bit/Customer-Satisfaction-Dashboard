import React from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button,
  Avatar,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AccountCircle, Language, Logout } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              width: 40,
              height: 40
            }}>
              📊
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Modern Plan and Report
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Gender System
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<AccountCircle />}
              label="Organization Sector"
              variant="outlined"
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
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
              sx={{ 
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, position: 'relative' }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;