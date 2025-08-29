import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, Error } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          <Error sx={{ fontSize: 120, color: 'error.main', mb: 2 }} />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Page Not Found
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500 }}
          >
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Typography>
          
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
            sx={{ px: 4, py: 1.5 }}
          >
            Go Back Home
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFoundPage;