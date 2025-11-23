import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import FormWizard from './components/FormWizard';
import { setLanguage } from './store/slices/uiSlice';
import { setCurrentStep, resetForm } from './store/slices/formSlice';

const getTheme = (direction) =>
  createTheme({
    direction,
    palette: {
      primary: {
        main: '#2563eb',
        light: '#3b82f6',
        dark: '#1e40af',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
              },
            },
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            padding: '24px 0',
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontWeight: 600,
            fontSize: '0.95rem',
            '&.Mui-active': {
              color: '#2563eb',
            },
            '&.Mui-completed': {
              color: '#10b981',
            },
          },
        },
      },
    },
  });

function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const isRTL = language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.removeItem('socialSupportFormData');
    dispatch(resetForm());
    dispatch(setCurrentStep(1));
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const handleLanguageChange = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <ThemeProvider theme={getTheme(isRTL ? 'rtl' : 'ltr')}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0e7ff 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
          }}
        >
          <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1.5, sm: 2 } }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                color: '#1e293b',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              <AppTitle />
            </Typography>
            <IconButton
              onClick={handleLanguageChange}
              aria-label="Change language"
              sx={{
                ml: isRTL ? 0 : { xs: 1, sm: 2 },
                mr: isRTL ? { xs: 1, sm: 2 } : 0,
                color: '#2563eb',
                borderRadius: 0,
                padding: { xs: '4px 8px', sm: '6px 12px' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: '#f1f5f9',
                  color: '#1e40af',
                },
              }}
            >
              <LanguageIcon sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0.25, sm: 0.5 } }} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}>
                {language === 'en' ? 'Arabic' : 'English'}
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
          <FormWizard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function AppTitle() {
  const { t } = useTranslation();
  return t('app.title');
}

export default App;

