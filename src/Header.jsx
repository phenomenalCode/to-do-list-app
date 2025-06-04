import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export const Header = () => (
  <AppBar position="static" color="primary" elevation={2}>
    <Toolbar>
      <Typography variant="h6">Task Manager</Typography>
    </Toolbar>
  </AppBar>
);
