import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Task Tracker
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/tasks"
          >
            Tasks
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/tasks/new"
          >
            New Task
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 