import React from 'react';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';

export const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        top: 'auto',
        bottom: 0,
        bgcolor: isDark ? 'background.default' : 'primary.main',
        color: isDark ? 'text.secondary' : 'primary.contrastText',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Task Manager by Darius Olsson Carter — All rights reserved.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
