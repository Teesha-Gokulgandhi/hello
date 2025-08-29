import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Nature as Eco, Group, TrendingUp, Security } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Eco />,
      title: 'Environmental Responsibility',
      description: 'We are committed to reducing waste and promoting sustainable recycling practices.',
    },
    {
      icon: <Group />,
      title: 'Community Focus',
      description: 'Building stronger communities through collaborative waste management solutions.',
    },
    {
      icon: <TrendingUp />,
      title: 'Economic Growth',
      description: 'Creating economic opportunities while protecting our environment.',
    },
    {
      icon: <Security />,
      title: 'Trust & Reliability',
      description: 'Providing secure, transparent, and reliable services to all our customers.',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div {...fadeInUp}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              About TrashToCash
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
              We're on a mission to transform waste management and create a sustainable future
              where everyone benefits from recycling.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              TrashToCash was founded with a simple yet powerful vision: to make recycling profitable
              for everyone while contributing to environmental sustainability. We recognized that many
              people have recyclable materials at home but lack convenient ways to monetize them.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our platform bridges the gap between waste generators and recycling facilities,
              creating a win-win situation for all stakeholders. We ensure fair pricing,
              convenient pickup services, and complete transparency in all transactions.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Today, we serve thousands of customers across multiple cities, helping them
              earn money while contributing to a cleaner, greener planet.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/api/placeholder/600/400"
              alt="Our story"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontWeight: 'bold', mb: 6, color: 'text.primary' }}
          >
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To revolutionize waste management by creating an accessible platform that
                transforms recyclable waste into economic opportunities while promoting
                environmental sustainability and community engagement.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To create a world where waste is viewed as a valuable resource, where every
                individual can contribute to environmental protection while benefiting
                economically, leading to cleaner cities and a sustainable future.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;