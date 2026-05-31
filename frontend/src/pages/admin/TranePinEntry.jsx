import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Grid,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import HomeIcon from '@mui/icons-material/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6600', // Trane orange color
    },
  },
});

export default function Component() {
  const [pin, setPin] = useState('');
  const [pinLength, setPinLength] = useState(4);

  const handleNumberClick = (number) => {
    if (pin.length < pinLength) {
      const newPin = pin + number;
      setPin(newPin);
      if (newPin.length === pinLength) {
        // console.log('PIN entered:', newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const renderPinDots = () => {
    return Array(pinLength).fill(0).map((_, index) => (
      <Box
        key={index}
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: index < pin.length ? 'primary.main' : 'grey.300',
          display: 'inline-block',
          mx: 0.5,
        }}
      />
    ));
  };

  useEffect(() => {
    if (pin.length === pinLength) {
      // console.log('PIN entered:', pin);
    }
  }, [pin, pinLength]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 300, mx: 'auto', textAlign: 'center', pt: 2 }}>
        <img src="/placeholder.svg?height=50&width=150" alt="Trane Logo" style={{ marginBottom: 16 }} />
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          It's Hard To Stop A Trane.
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Set a {pinLength}-digit PIN
        </Typography>
        <Box sx={{ mb: 2 }}>
          {renderPinDots()}
        </Box>
        <Select
          value={pinLength}
          onChange={(e) => setPinLength(Number(e.target.value))}
          sx={{ mb: 2, minWidth: 120 }}
        >
          <MenuItem value={4}>Pin Length</MenuItem>
          <MenuItem value={5}>5 digits</MenuItem>
          <MenuItem value={6}>6 digits</MenuItem>
        </Select>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Grid item xs={4} key={number}>
              <Button
                onClick={() => handleNumberClick(number)}
                sx={{
                  width: '100%',
                  height: 48,
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {number}
              </Button>
            </Grid>
          ))}
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Button
              onClick={() => handleNumberClick(0)}
              sx={{
                width: '100%',
                height: 48,
                border: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              0
            </Button>
          </Grid>
          <Grid item xs={4}>
            <IconButton onClick={handleBackspace} sx={{ width: '100%', height: 48 }}>
              <BackspaceIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Button
          startIcon={<HomeIcon />}
          variant="contained"
          color="primary"
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Home
        </Button>
        <Typography variant="body2" sx={{ bgcolor: 'grey.200', py: 1 }}>
          Please enter a new PIN.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}