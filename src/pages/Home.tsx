import { Box, Grid, Paper, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Tasks
            </Typography>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              12
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              5
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              In Progress
            </Typography>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              4
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Not Started
            </Typography>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              3
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Recent Tasks
        </Typography>
        {/* Task list will be added here */}
      </Paper>
    </Box>
  );
};

export default Home; 