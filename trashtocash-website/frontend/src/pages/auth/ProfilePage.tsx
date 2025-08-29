import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Profile page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;