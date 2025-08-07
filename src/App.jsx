import React, { useState, useMemo, useCallback } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { Header } from './Header';
import { SubmitTask } from './SubmitTask';
import { DisplayTasks } from './DisplayTasks';
import { Footer } from './Footer';
import './index.css';
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

// // Optionally lazy load heavy components:
// const Header = React.lazy(() => import('./Header'));
// const SubmitTask = React.lazy(() => import('./SubmitTask'));
// const DisplayTasks = React.lazy(() => import('./DisplayTasks'));
// const Footer = React.lazy(() => import('./Footer'));

export const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const tasks = useTaskStore((s) => s.tasks);

  // Memoize theme to prevent recreation on every render
  const theme = useMemo(
    () =>
      createTheme({
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
      }),
    [darkMode]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const completeAll = () => {
    const { tasks, toggleTaskCompletion } = useTaskStore.getState();
    tasks.forEach((t) => !t.completed && toggleTaskCompletion(t.id));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: darkMode
            ? 'url(/photos/stars-night-galaxy-4k-3840x2160.jpg)'
            : 'url(/photos/7247856.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pb: { xs: 10, md: 8 },
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
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            className="display-tasks-wrapper"
            sx={{
              flex: { xs: '100%', md: '0 0 280px' },
              display: 'block',
              order: { xs: 2, md: 1 },
            }}
          >
            <DisplayTasks />
          </Box>

          <Box
            sx={(theme) => ({
              order: { xs: 1, md: 2 },
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              width: '100%',
              maxWidth: { md: 900, lg: 1100 },
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

            <SubmitTask />

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
