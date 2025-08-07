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
  const theme = useTheme();
  const { addTask, projects, addProject } = useTaskStore();

  // ---------------- Form State ----------------
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [newProject, setNewProject] = useState('');

  // ---------------- Handlers ----------------
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
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
    });

    // Clear form
    setInput('');
    setCategory('');
    setProjectId('');
    setDueDate(null);
  };

  // ---------------- UI ----------------
  return (
  <Box
    role="form"
    aria-label="Task submission form"
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
    {/* Promoted heading */}
    <Typography
      component="h2"
      variant="h4"
      gutterBottom
      sx={{ textAlign: 'center' }}
    >
      To Do List
    </Typography>

    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {/* Task input */}
        <TextField
          label="Enter Task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          required
          inputProps={{ 'aria-label': 'Task name input' }}
        />

        {/* Category */}
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            inputProps={{ 'aria-label': 'Select task category' }}
          >
            {['Work', 'Home', 'Health', 'Errands', 'Leisure', 'Other'].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Project selection */}
        <FormControl fullWidth>
          <InputLabel id="project-label">Project</InputLabel>
          <Select
            labelId="project-label"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            label="Project"
            inputProps={{ 'aria-label': 'Select project for task' }}
          >
            <MenuItem value="">None</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} {p.completed ? '✅' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Inline new project creator */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField
            label="New Project"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            size="small"
            fullWidth
            inputProps={{ 'aria-label': 'New project name input' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProject}
            aria-label="Add new project"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add
          </Button>
        </Stack>

        {/* Due Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newVal) => setDueDate(newVal)}
            slotProps={{
              textField: {
                fullWidth: true,
                inputProps: { 'aria-label': 'Select due date for task' },
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

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          aria-label="Submit new task"
        >
          Add Task
        </Button>
      </Stack>
    </form>
  </Box>
);

};
