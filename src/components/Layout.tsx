import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '250px',
          maxWidth: 'calc(100% - 250px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 