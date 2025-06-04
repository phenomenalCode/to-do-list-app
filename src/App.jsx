import React, { useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { Header } from './Header';
import { SubmitTask } from './SubmitTask';
import { DisplayTasks } from './DisplayTasks';
import { Footer } from './Footer';
import './index.css'; // Import your CSS styles
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from '@mui/material';

export const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const tasks = useTaskStore((s) => s.tasks);

  /* ---------- THEME ---------- */
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#9c27b0' : '#1976d2',
        contrastText: '#fff',
      },
      background: {
        default: darkMode ? '#000' : '#fff',
        paper: darkMode ? '#1a1a1a' : '#f5f5f5',
      },
    },
  });

  /* ---------- HANDLERS ---------- */
  const toggleDarkMode = () => setDarkMode((p) => !p);
  const completeAll    = () => {
    const { tasks, toggleTaskCompletion } = useTaskStore.getState();
    tasks.forEach((t) => !t.completed && toggleTaskCompletion(t.id));
  };

  /* ---------- RENDER ---------- */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* page background */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: darkMode
            ? 'url(/photos/stars-night-galaxy-4k-3840x2160.jpg)'
            : 'url(/photos/7247856.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pb: { xs: 10, md: 8 },      /* extra space for fixed footer on mobile */
        }}
      >
        <Header />

        <Container
          maxWidth="xl"
          sx={{
            mt: { xs: 2, md: 4 },
            px: { xs: 1, sm: 2, md: 4 },
            display: 'flex',
            gap: { xs: 2, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },   /* stack < 960 px */
          }}
        >
          {/* -------- Sidebar (hidden on phones) -------- */}
         <Box
  className="display-tasks-wrapper"
  sx={{
    flex: { xs: ' 100%', md: '0 0 280px' },
    display: 'block', //  always visible
    order: { xs: 2, md: 1 },
  }}
>
  <DisplayTasks />
</Box>

          {/* -------- Main column -------- */}
          <Box
            sx={(theme) => ({
              order: { xs: 1, md: 2 },
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              width: '100%',
              maxWidth: { md: 900, lg: 1100 },        /* stop stretching */
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              boxShadow: 4,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(33,33,33,0.85)'
                  : 'rgba(255,255,255,0.85)',
              color: theme.palette.text.primary,
            })}
          >
            {/* --- Stats panel --- */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 3 },
                textAlign: 'center',
                width: '100%',
                maxWidth: 400,
              }}
            >
              <Typography variant="h4" gutterBottom>
                To Do List
              </Typography>
              <Typography variant="body1">Total Tasks: {tasks.length}</Typography>
              <Typography variant="body1">
                Uncompleted Tasks: {tasks.filter((t) => !t.completed).length}
              </Typography>
            </Paper>

            {/* --- Task form --- */}
            <SubmitTask />

            {/* --- Buttons --- */}
            <Box sx={{ display: 'flex', gap: 2 }}>
            
              <Button variant="outlined" onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </ThemeProvider>
  );
};
