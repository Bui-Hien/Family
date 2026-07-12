import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { vi } from 'date-fns/locale';
import AppRoutes from './AppRoutes';
import { getTheme } from './theme';
import useUiStore from '@/stores/uiStore';

const App = () => {
  const { themeMode } = useUiStore();
  const theme = getTheme(themeMode);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
