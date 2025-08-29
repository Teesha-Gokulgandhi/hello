import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminUsers: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Manage Users
        </Typography>
        <Typography variant="h6" color="text.secondary">
          User management page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminUsers;