import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  textDecoration: 'none',
  borderRadius: 8,
  transition: 'all 0.2s ease',
  width: '100%',
  height: 48,
  fontSize: '1.1rem',

  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },

  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const Navigation = () => {
  return (
    <Box
      sx={{
        width: 250,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        p: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4,
          p: 2,
        }}
      >
        Task Tracker
      </Typography>
      <List sx={{ width: '100%' }}>
        <ListItem sx={{ px: 0 }}>
          <StyledNavLink to="/" end>
            Dashboard
          </StyledNavLink>
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <StyledNavLink to="/tasks">
            Tasks
          </StyledNavLink>
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <StyledNavLink to="/profile">
            Profile
          </StyledNavLink>
        </ListItem>
      </List>
    </Box>
  );
};

export default Navigation; 