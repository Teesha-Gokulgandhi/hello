import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ContactPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Contact page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage;