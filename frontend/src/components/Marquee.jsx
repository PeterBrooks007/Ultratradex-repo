import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';

const MarqueeWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50px', // Adjust the width of the shadow as needed
    zIndex: 1,
  },
  '&::before': {
    left: 0,
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))' // Light mode gradient
      : 'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))', // Dark mode gradient
  },
  '&::after': {
    right: 0,
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(to left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))' // Light mode gradient
      : 'linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))', // Dark mode gradient
  },
}));

const MarqueeContent = styled(motion.div)({
  display: 'flex',
  whiteSpace: 'nowrap',
  position: 'relative',
  zIndex: 0,
});

const marqueeVariants = {
  animate: {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 60, // Increase duration to slow down the scroll speed
        ease: 'linear',
      },
    },
  },
};

const Marquee = ({ children }) => {
  const theme = useTheme();

  return (
    <MarqueeWrapper theme={theme}>
      <MarqueeContent variants={marqueeVariants} animate="animate">
        {children}
        {children} {/* Duplicate content for seamless scrolling */}
      </MarqueeContent>
    </MarqueeWrapper>
  );
};

Marquee.propTypes = {
    children: PropTypes.node.isRequired,
  };
  

export default Marquee;
