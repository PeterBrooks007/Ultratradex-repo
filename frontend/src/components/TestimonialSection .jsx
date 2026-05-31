import React, { useState, useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import reviewer1 from "../assets/testimonial/reviewer1.jpeg"
import reviewer2 from "../assets/testimonial/reviewer2.jpg"
import reviewer3 from "../assets/testimonial/reviewer3.jpeg"
import reviewer4 from "../assets/testimonial/reviewer4.jpg"
import reviewer5 from "../assets/testimonial/reviewer5.jpg"
import reviewer6 from "../assets/testimonial/reviewer6.jpg"

const testimonials = [
  {
    name: 'Jamie Stoner',
    country: 'USA',
    image: reviewer1,
    feedback:
      'I had a great experience working with Ultratradex. They were very friendly and easy to work with, I would definitely recommend them to anyone looking for [service provided].',
  },
  {
    name: 'Mùchén Yŭxuān',
    country: 'China',
    image: reviewer2,
    feedback:
      '我最近有幸与 Ultratradex 合作，并对结果非常满意。他们非常专业，确保一切都让我满意。我将来肯定会再次与他们合作。',
  },
  {
    name: 'Charlotte George',
    country: 'Australia',
    image: reviewer4,
    feedback:
      'I was very impressed with the quality of service that I received from Ultratradex. They were very knowledgeable and helped me navigate a complex process with ease. ',
  },
  {
    name: 'Williams Arthur Junior',
    country: 'United Kingdom',
    image: reviewer3,
    feedback:
      'They were very responsive and always available to answer my questions. They made the entire process easy and stress-free, and I really appreciated their hard work.',
  },
  {
    name: 'Thandiwe Lerato',
    country: 'South Africa',
    image: reviewer6,
    feedback:
      'Greetings from South Africa. Guys, I must say this is the best platform I have ever traded with. They are just the best.',
  },
];

const TestimonialItem = ({ testimonial }) => (
  <Box
    sx={{
      backgroundColor: '#1288c9',
      padding: { xs: '100px 40px 30px 40px', md: '30px 32px 30px 90px' },
      margin: { xs: '90px 15px 0', md: '50px 20px 50px 120px' },
      borderRadius: { xs: '40px', md: '0 100px 100px 0' },
      color: '#fff',
      position: 'relative',
      border: '5px solid #e2e3e8',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
    }}
  >
    <Box
      sx={{
        width: 210,
        height: 210,
        borderRadius: '50%',
        border: '14px solid #e2e3e8',
        position: 'absolute',
        top: { xs: '-85px', md: '-15px' },
        left: { xs: '50%', md: '-120px' },
        transform: { xs: 'translateX(-50%)', md: 'none' },
        overflow: 'hidden',
      }}
    >
      <img
        src={testimonial.image}
        alt={testimonial.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
    <Box
      sx={{
        width: { xs: '100%', md: '35%' },
        padding: '28px 25px',
        borderRight: { xs: 'none', md: '1px solid #e2e3e8' },
        textAlign: { xs: 'center', md: 'left' },
        mb: { xs: 2, md: 0 },
      }}
    >
      <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
        {testimonial.name}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '12px', marginTop: '5px' }}>
        {testimonial.country}
      </Typography>
    </Box>
    <Box
      sx={{
        width: { xs: '100%', md: '65%' },
        fontSize: '15px',
        letterSpacing: '0.5px',
        padding: { xs: '0 20px', md: '28px 0 28px 28px' },
        position: 'relative',
      }}
    >
      <Typography variant="body1" sx={{ paddingLeft: { xs: '30px', md: '30px' }, fontStyle: 'italic' }}>
        {testimonial.feedback}
      </Typography>
    </Box>
  </Box>
);

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ textAlign: 'center', py: 5, px: 1 }}>
      <Typography variant="h3" gutterBottom>
        Our Review
      </Typography>
      <Typography variant="h5" gutterBottom>
        More Than 20,000+ Happy Customers Trust Our Service
      </Typography>
      <Box sx={{ position: 'relative', height: { xs: '600px', md: '400px' } }}>
        {testimonials.map((testimonial, index) => (
          <Slide
            direction="left"
            in={activeIndex === index}
            mountOnEnter
            unmountOnExit
            timeout={{ enter: 500, exit: 500 }}
            key={index}
          >
            <Box sx={{ position: 'absolute', width: '100%' }}>
              <TestimonialItem testimonial={testimonial} />
            </Box>
          </Slide>
        ))}
      </Box>
    </Box>
  );
};

export default TestimonialSection;
