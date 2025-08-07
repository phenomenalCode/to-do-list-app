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
  FormControl,
  InputLabel,
} from '@mui/material';

export const DisplayTasks = () => {
  const [show, setShow] = useState('all');
  const [sortBy, setSortBy] = useState('created-desc');
  const {
    tasks: rawTasks,
    projects,
    toggleTaskCompletion,
    deleteTask,
    completeAllTasks,
    deleteProject,
  } = useTaskStore();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const filteredTasks = useMemo(() => {
    if (show === 'completed') return rawTasks.filter(t => t.completed);
    if (show === 'uncompleted') return rawTasks.filter(t => !t.completed);
    return rawTasks;
  }, [rawTasks, show]);

  const tasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'due-asc': return (a.dueDate || '').localeCompare(b.dueDate || '');
        case 'due-desc': return (b.dueDate || '').localeCompare(a.dueDate || '');
        case 'created-asc': return a.createdAt.localeCompare(b.createdAt);
        case 'created-desc': return b.createdAt.localeCompare(a.createdAt);
        case 'category': return (a.category || '').localeCompare(b.category || '');
        default: return 0;
      }
    });
  }, [filteredTasks, sortBy]);

  const uncompletedCount = tasks.filter(t => !t.completed).length;

  if (!tasks.length) {
    return (
      <Typography
        sx={{
          color: 'gray',
          mt: 4,
          textAlign: 'center',
          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
        }}
        aria-live="polite"
      >
        No tasks to display.
      </Typography>
    );
  }

  const renderDueDate = (task) => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate);
    const hoursLeft = (due.getTime() - Date.now()) / 36e5;
    const dueSoon = hoursLeft > 0 && hoursLeft <= 24 && !task.completed;

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
  };

  return (
    <Paper
      role="region"
      aria-label="Task list"
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        mx: 'auto',
        mt: { xs: 2, sm: 4 },
        width: { xs: '100%', sm: '95%', md: '90%', lg: 600 },
        bgcolor: 'background.paper',
      }}
    >
      {/* Header controls */}
      <Box
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
          Tasks ({tasks.length}) • Uncompleted ({uncompletedCount})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <InputLabel id="filter-tasks-label">Filter</InputLabel>
            <Select
              labelId="filter-tasks-label"
              id="filter-tasks"
              value={show}
              label="Filter"
              onChange={e => setShow(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="uncompleted">Uncompleted</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 160 } }}>
            <InputLabel id="sort-tasks-label">Sort by</InputLabel>
            <Select
              labelId="sort-tasks-label"
              id="sort-tasks"
              value={sortBy}
              label="Sort by"
              onChange={e => setSortBy(e.target.value)}
            >
              <MenuItem value="created-desc">Newest First</MenuItem>
              <MenuItem value="created-asc">Oldest First</MenuItem>
              <MenuItem value="due-asc">Due Soonest</MenuItem>
              <MenuItem value="due-desc">Due Latest</MenuItem>
              <MenuItem value="category">Category A→Z</MenuItem>
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="contained"
            onClick={completeAllTasks}
            aria-label="Mark all tasks as complete"
          >
            Complete All
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Task List */}
      <ul aria-label="Task list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          const overdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
          const statusLabel = overdue
            ? 'Overdue'
            : task.completed ? 'Completed' : 'Incomplete';
          const statusColor = overdue
            ? 'error'
            : task.completed ? 'success' : 'warning';

          return (
            <li key={task.id} role="listitem" style={{ marginBottom: '1rem' }}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  border: `1px solid ${isDarkMode ? theme.palette.divider : '#ccc'}`,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                }}
              >
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
    id={`task-checkbox-${task.id}`}
    checked={task.completed}
    onChange={() => toggleTaskCompletion(task.id)}
    inputProps={{
      'aria-labelledby': `task-label-${task.id}`,
    }}
  />
  <Typography
    id={`task-label-${task.id}`}
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
                    aria-label={`Delete task "${task.task}"`}
                  >
                    Delete
                  </Button>
                </Box>

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
                      aria-label={`Delete project "${project.name}"`}
                      sx={{ ml: 1, minWidth: 0, px: 0.5, lineHeight: 1 }}
                    >
                      ✕
                    </Button>
                  )}
                </Typography>

                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Created: {new Date(task.createdAt).toLocaleString()}
                </Typography>

                {renderDueDate(task)}
              </Box>
            </li>
          );
        })}
      </ul>
    </Paper>
  );
};
