import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography
} from '@mui/material';

const accounts = [
  {
    title: 'BRONZE ACCOUNT',
    deposit: 'Minimum Deposit $1,000',
    features: [
      'Spreads from 3.3 pips',
      'Leverage 1:500',
      'Live Chart Support',
      'All Available Platforms'
    ],
    headerBg: '#795548', // Customize header background color
    grid: { xs: 12, sm: 6, md: 4 },
    buttonText: 'OPEN AN ACCOUNT',
    href: '/auth/register'
  },
  {
    title: 'SILVER ACCOUNT',
    deposit: 'Minimum Deposit $5,000',
    features: [
      'Spreads from 2.2 pips',
      'Leverage 1:700',
      'Live Chart Support',
      'All Available Platforms'
    ],
    headerBg: '#607d8b',
    grid: { xs: 12, sm: 6, md: 4 },
    buttonText: 'OPEN AN ACCOUNT',
    href: '/auth/register'
  },
  {
    title: 'GOLD ACCOUNT',
    deposit: 'Minimum Deposit $15,000',
    features: [
      'Spreads from 1.5 pips',
      'Leverage 1:1000',
      'Live Chart Support',
      'All Available Platforms'
    ],
    headerBg: '#3f51b5',
    grid: { xs: 12, sm: 6, md: 4 },
    buttonText: 'OPEN AN ACCOUNT',
    href: '/auth/register'
  },
  {
    title: 'DIAMOND ACCOUNT',
    deposit: 'Minimum Deposit $30,000',
    features: [
      'Spreads from 1.0 pips',
      'Leverage 1:3000',
      'Live Chart Support',
      'All Available Platforms'
    ],
    headerBg: '#ff5722',
    grid: { xs: 12, sm: 6, md: 6 },
    buttonText: 'OPEN AN ACCOUNT',
    href: '/auth/register'
  },
  {
    title: 'PEARL ACCOUNT',
    deposit: 'Minimum Deposit $50,000',
    features: [
      'Spreads from 0.5 pips',
      'Leverage 1:5000',
      'Live Chart Support',
      'All Available Platforms',
      'Access All Education Tools',
      'Technical Analysis Report',
      'Market Update Emails'
    ],
    headerBg: '#9c27b0',
    grid: { xs: 12, sm: 6, md: 6 },
    buttonText: 'OPEN AN ACCOUNT',
    href: '/auth/register'
  }
];

export default function PackagePlans() {
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Section Heading */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          <strong>Trading Accounts</strong>
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom>
          <strong>Choose a package</strong>
        </Typography>
      </Box>

      {/* Accounts Grid */}
      <Grid container spacing={4}>
        {accounts.map((account, index) => (
          <Grid key={index} item xs={account.grid.xs} sm={account.grid.sm} md={account.grid.md}>
            <Card
              // You can add custom animations by using libraries like react-reveal or framer-motion.
              // Here we simply use a box shadow and margin.
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" align="center" sx={{ color: '#fff' }}>
                    {account.title}
                  </Typography>
                }
                sx={{
                  backgroundColor: account.headerBg,
                  py: 1
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#25d06f', mb: 2 }}
                >
                  {account.deposit}
                </Typography>
                {account.features.map((feature, idx) => (
                  <Box key={idx} display="flex" alignItems="center" mb={1}>
                    {/* <CheckCircle /> */}
                    <Typography variant="body1">{feature}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  component="a"
                  href={account.href}
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                >
                  {account.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
