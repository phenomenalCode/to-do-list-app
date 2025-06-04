import React, { useState, useMemo } from 'react';
import { useTaskStore } from './store/useTaskStore';
import {
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  Button,
  Checkbox,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';

export const DisplayTasks = () => {
  /* ------------ local UI state ------------ */
  const [show,   setShow]  = useState('all');          // filter
  const [sortBy, setSortBy] = useState('created-desc'); // sort

  /* ------------ data from store ------------ */
  const {
    tasks: rawTasks,
    projects,
    toggleTaskCompletion,
    deleteTask,
    completeAllTasks,
    deleteProject,
  } = useTaskStore();

  const theme      = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  /* ----- filter first ----- */
  const filtered = useMemo(() => {
    switch (show) {
      case 'completed':   return rawTasks.filter(t => t.completed);
      case 'uncompleted': return rawTasks.filter(t => !t.completed);
      default:            return rawTasks;
    }
  }, [rawTasks, show]);

  /* ----- then sort ----- */
  const tasks = useMemo(() => {
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'due-asc':     return (a.dueDate || '').localeCompare(b.dueDate || '');
        case 'due-desc':    return (b.dueDate || '').localeCompare(a.dueDate || '');
        case 'created-asc': return  a.createdAt.localeCompare(b.createdAt);
        case 'created-desc':return  b.createdAt.localeCompare(a.createdAt);
        case 'category':    return (a.category || '').localeCompare(b.category || '');
        default:            return 0;
      }
    });
    return sorted;
  }, [filtered, sortBy]);

  const uncompleted = tasks.filter(t => !t.completed).length;

  /* ----- empty state ----- */
  if (!tasks.length) {
    return (
      <Typography
        sx={{
          color: 'gray',
          mt: 4,
          textAlign: 'center',
          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
        }}
      >
        No tasks to display.
      </Typography>
    );
  }

  /* ----- UI ----- */
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        mx: 'auto',
        mt: { xs: 2, sm: 4 },
        width: { xs: '100%', sm: '95%', md: '90%', lg: 600 },
        bgcolor: 'background.paper',
      }}
    >
      {/* ---------- header controls ---------- */}
      <Box
        className="filter-actions"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Tasks ({tasks.length}) • Uncompleted ({uncompleted})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Select
            size="small"
            value={show}
            onChange={e => setShow(e.target.value)}
            sx={{ minWidth: { xs: 120, sm: 140 } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="uncompleted">Uncompleted</MenuItem>
          </Select>

          <Select
            size="small"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            sx={{ minWidth: { xs: 140, sm: 160 } }}
          >
            <MenuItem value="created-desc">Newest First</MenuItem>
            <MenuItem value="created-asc">Oldest First</MenuItem>
            <MenuItem value="due-asc">Due Soonest</MenuItem>
            <MenuItem value="due-desc">Due Latest</MenuItem>
            <MenuItem value="category">Category A→Z</MenuItem>
          </Select>

          <Button size="small" variant="contained" onClick={completeAllTasks}>
            Complete All
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ---------- tasks ---------- */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          const overdue =
            task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

          const statusLabel  = overdue
            ? 'Overdue'
            : task.completed ? 'Completed' : 'Incomplete';
          const statusColor  = overdue
            ? 'error'
            : task.completed ? 'success' : 'warning';

          return (
            <li key={task.id} style={{ marginBottom: '1rem' }}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  border: `1px solid ${isDarkMode ? theme.palette.divider : '#ccc'}`,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                }}
              >
                {/* top row */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <Typography
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        wordBreak: 'break-word',
                      }}
                    >
                      {task.task}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </Box>

                {/* meta */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Typography variant="body2"><strong>Status:</strong></Typography>
                  <Chip label={statusLabel} color={statusColor} size="small" />
                </Box>

                <Typography variant="body2">
                  <strong>Category:</strong> {task.category || 'None'}
                </Typography>

                <Typography variant="body2">
                  <strong>Project:</strong>{' '}
                  {project
                    ? `${project.name} (${project.completed ? 'Done' : 'Ongoing'})`
                    : 'None'}
                  {project && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteProject(project.id)}
                      sx={{ ml: 1, minWidth: 0, px: 0.5, lineHeight: 1 }}
                    >
                      ✕
                    </Button>
                  )}
                </Typography>

                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Created: {new Date(task.createdAt).toLocaleString()}
                </Typography>

                {task.dueDate && (() => {
                  const due       = new Date(task.dueDate);
                  const hoursLeft = (due.getTime() - Date.now()) / 36e5;
                  const dueSoon   = hoursLeft > 0 && hoursLeft <= 24 && !task.completed;
                  return (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.2,
                        display: 'block',
                        fontStyle: 'italic',
                        color: dueSoon ? 'red' : 'inherit',
                      }}
                    >
                      Due: {due.toLocaleDateString()} {due.toLocaleTimeString()}
                    </Typography>
                  );
                })()}
              </Box>
            </li>
          );
        })}
      </ul>
    </Paper>
  );
};

// This component displays the list of tasks with filtering and sorting options.
// It allows users to mark tasks as completed, delete tasks, and view project details.  
// It also includes functionality to delete projects directly from the task list.
// It uses Material-UI components for styling and layout.
// The tasks are displayed in a responsive layout with options to filter by status and sort by various criteria.