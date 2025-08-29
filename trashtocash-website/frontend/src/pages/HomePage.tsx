import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Nature as Eco,
  Recycling,
  AttachMoney,
  LocalShipping,
  Star,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Features data
  const features = [
    {
      icon: <Eco />,
      title: 'Eco-Friendly',
      description: 'Contribute to a sustainable environment by recycling your waste responsibly.',
    },
    {
      icon: <AttachMoney />,
      title: 'Earn Money',
      description: 'Turn your trash into cash with our competitive pricing for recyclable materials.',
    },
    {
      icon: <LocalShipping />,
      title: 'Free Pickup',
      description: 'We provide free doorstep pickup services for your convenience.',
    },
    {
      icon: <Recycling />,
      title: 'Complete Recycling',
      description: 'We ensure 100% proper recycling of collected materials.',
    },
  ];

  // Services data
  const services = [
    {
      title: 'Paper & Cardboard',
      image: '/api/placeholder/300/200',
      price: '₹8-12 per kg',
      description: 'Newspapers, magazines, cardboard boxes, and office paper.',
    },
    {
      title: 'Plastic Waste',
      image: '/api/placeholder/300/200',
      price: '₹10-15 per kg',
      description: 'Plastic bottles, containers, and packaging materials.',
    },
    {
      title: 'Metal Scrap',
      image: '/api/placeholder/300/200',
      price: '₹20-40 per kg',
      description: 'Aluminum cans, steel items, and other metal objects.',
    },
    {
      title: 'Electronic Waste',
      image: '/api/placeholder/300/200',
      price: '₹15-25 per kg',
      description: 'Old computers, phones, and electronic components.',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent service! They picked up all my old newspapers and paid me well. Very professional team.',
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'I was amazed by their quick response and fair pricing. Highly recommend TrashToCash!',
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Anita Patel',
      rating: 4,
      comment: 'Great initiative for the environment. The pickup was on time and the process was smooth.',
      avatar: '/api/placeholder/60/60',
    },
  ];

  // Stats data
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000 kg', label: 'Waste Recycled' },
    { number: '25+', label: 'Cities Covered' },
    { number: '₹2L+', label: 'Paid to Customers' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div {...fadeInUp}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 'bold',
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  Turn Your Trash Into Cash
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    mb: 4,
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  Sell your recyclable waste materials and earn money while contributing to a cleaner, greener planet.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    component={Link}
                    to="/services"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/api/placeholder/600/400"
                  alt="Recycling illustration"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div {...fadeInUp}>
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
          >
            Why Choose TrashToCash?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            We make recycling easy, profitable, and environmentally responsible
          </Typography>
        </motion.div>

        <motion.div variants={staggerChildren} initial="initial" whileInView="animate">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      border: 'none',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        transition: 'transform 0.3s ease',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Services Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              We accept a wide range of recyclable materials
            </Typography>
          </motion.div>

          <motion.div variants={staggerChildren} initial="initial" whileInView="animate">
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          transition: 'transform 0.3s ease',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={service.image}
                        alt={service.title}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {service.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          sx={{ mb: 1, fontWeight: 'bold' }}
                        >
                          {service.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/services"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
            >
              View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div variants={staggerChildren} initial="initial" whileInView="animate">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div variants={fadeInUp}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
            >
              What Our Customers Say
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Real feedback from our satisfied customers
            </Typography>
          </motion.div>

          <motion.div variants={staggerChildren} initial="initial" whileInView="animate">
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {testimonial.name}
                          </Typography>
                          <Rating value={testimonial.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        "{testimonial.comment}"
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div {...fadeInUp}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ready to Start Earning?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of customers who are already earning money while helping the environment
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Sign Up Now
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;