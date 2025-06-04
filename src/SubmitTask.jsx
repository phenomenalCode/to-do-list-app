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

export const SubmitTask = () => {
  const theme = useTheme();
  const { addTask, projects, addProject } = useTaskStore();

  const [input, setInput] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newProject, setNewProject] = useState('');

  const handleAddProject = () => {
    const name = newProject.trim();
    if (!name) return;
    const id = Date.now();
    addProject({ id, name, completed: false });
    setProjectId(id);
    setNewProject('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter a task');
      return;
    }

    addTask({
      task: input.trim(),
      category,
      projectId: projectId || null,
      dueDate: dueDate || null,
    });

    setInput('');
    setCategory('');
    setProjectId('');
    setDueDate('');
  };

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
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Errands">Errands</MenuItem>
              <MenuItem value="Leisure">Leisure</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} {p.completed ? '✅' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Inline new-project creator */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ sm: 'center' }}
          >
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
              fullWidth={{ xs: true, sm: false }}
              sx={{
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Add
            </Button>
          </Stack>

          {/* Due date */}
          <TextField
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
          />

          {/* Submit */}
          <Button
            variant="contained"
            type="submit"
            size="large"
            fullWidth
          >
            Add Task
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
// This component allows users to submit new tasks with optional categories, projects, and due dates.
// It also includes functionality to create new projects inline.    
// The form is styled to fit well within the app's theme and layout, ensuring a consistent user experience.
// The SubmitTask component is designed to be reusable and adaptable, making it easy to integrate into different parts of the application or modify for future requirements.
// It uses Material-UI components for a clean and modern look, enhancing usability and accessibility.
// The component is responsive, adjusting its layout based on the screen size, ensuring a good user experience on both mobile and desktop devices.
// The SubmitTask component is a key part of the to-do list application, providing a user-friendly interface for adding new tasks.