// SubmitTask.jsx
import React, { useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Stack,
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns }       from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker }           from '@mui/x-date-pickers/DatePicker';

export const SubmitTask = () => {
  const theme                            = useTheme();
  const { addTask, projects, addProject } = useTaskStore();

  /* ------------ form state ------------ */
  const [input,       setInput]       = useState('');
  const [category,    setCategory]    = useState('');
  const [projectId,   setProjectId]   = useState('');
  const [dueDate,     setDueDate]     = useState(null);  // ▶ Date object
  const [newProject,  setNewProject]  = useState('');

  /* ------------ project helpers ------------ */
  const handleAddProject = () => {
    const name = newProject.trim();
    if (!name) return;
    const id = Date.now();
    addProject({ id, name, completed: false });
    setProjectId(id);
    setNewProject('');
  };

  /* ------------ submit ------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter a task');
      return;
    }

    addTask({
      task      : input.trim(),
      category,
      projectId : projectId || null,
      /* save as "yyyy-MM-dd" or null */
      dueDate   : dueDate ? dueDate.toISOString().split('T')[0] : null,
    });

    // clear
    setInput('');
    setCategory('');
    setProjectId('');
    setDueDate(null);
  };

  /* ------------ UI ------------ */
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: { xs: '100%', sm: 500 },
        mx: 'auto',
        bgcolor:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : '#eeeeee',
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: 4,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Task title */}
          <TextField
            label="Enter Task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
          />

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {['Work','Home','Health','Errands','Leisure','Other'].map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Project select */}
          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              label="Project"
            >
              <MenuItem value="">None</MenuItem>
              {projects.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} {p.completed ? '✅' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Inline new-project creator */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              label="New Project"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={handleAddProject}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Add
            </Button>
          </Stack>

          {/* Due date – MUI DatePicker */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newVal) => setDueDate(newVal)}
              /* TextField props */
              slotProps={{
                textField: {
                  fullWidth: true,
                  /* purple calendar icon in dark-mode */
                  sx: {
                    '& .MuiSvgIcon-root': {
                      color:
                        theme.palette.mode === 'dark'
                          ? theme.palette.primary.main
                          : 'inherit',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          {/* Submit */}
          <Button type="submit" variant="contained" size="large" fullWidth>
            Add Task
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
