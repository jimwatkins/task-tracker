import { Box, Paper, Typography, Grid } from '@mui/material';

const Profile = () => {
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Garden Manager',
    joinDate: 'January 2024',
    completedTasks: 15,
    inProgressTasks: 3,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
        Profile
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                Name
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                Email
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.email}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                Role
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.role}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                Join Date
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.joinDate}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Task Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                Completed Tasks
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.completedTasks}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="text.secondary" fontWeight={500}>
                In Progress
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{userProfile.inProgressTasks}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 