import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#8C1D40' : '#E6A3B8', // Deep Burgundy / Rose Gold
      light: '#B23B68',
      dark: '#5E0E27',
      contrastText: '#fff',
    },
    secondary: {
      main: mode === 'light' ? '#C5A059' : '#F1D592', // Antique Gold
      light: '#DCC38F',
      dark: '#937435',
      contrastText: '#1A1A2E',
    },
    background: {
      default: mode === 'light' ? '#FAF8F5' : '#121212', // Warm Ivory / Very Dark Grey
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#2C2C2C' : '#E0E0E0',
      secondary: mode === 'light' ? '#6B6B6B' : '#A0A0A0',
    },
    divider: mode === 'light' ? '#EAE3D2' : '#333333',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0px 4px 20px rgba(140, 29, 64, 0.04)' 
            : '0px 4px 20px rgba(0, 0, 0, 0.3)',
          border: mode === 'light' ? '1px solid #EAE3D2' : '1px solid #2C2C2C',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          backgroundColor: mode === 'light' ? '#C5A059' : '#F1D592', // Antique Gold indicator
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: '"Inter", sans-serif',
          minHeight: 48,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: mode === 'light' ? '#8C1D40' : '#E6A3B8',
          },
          '&:hover': {
            color: mode === 'light' ? '#B23B68' : '#F4B8C8',
            opacity: 1,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: mode === 'light' ? '1px solid #EAE3D2' : '1px solid #333333',
          borderRadius: 8,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '8px 0',
            borderLeft: `4px solid ${mode === 'light' ? '#C5A059' : '#F1D592'}`, // Gold line when expanded
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FAF8F5' : '#1E1E1E',
          minHeight: 48,
          borderRadius: 8,
          '&.Mui-expanded': {
            borderBottom: mode === 'light' ? '1px solid #EAE3D2' : '1px solid #333333',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 16,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
        },
        separator: {
          color: mode === 'light' ? '#C5A059' : '#F1D592',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          borderRadius: 8,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? '#8C1D40' : '#E6A3B8',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#B23B68' : '#F4B8C8',
            },
          },
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(241, 213, 146, 0.2)',
          },
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));

