import React from 'react';
import ReactDOM from 'react-dom';
import { Box, CircularProgress, Typography, keyframes } from '@mui/material';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingPage = () => {
  return ReactDOM.createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          zIndex: 2001,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          height: 80,
          position: 'relative',
          animation: `${pulse} 2s infinite`,
          md:1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '6px solid transparent',
            borderTopColor: 'primary.main',
            animation: `${spinAnimation} 1s linear infinite`,
          }}
        />
        <CircularProgress
          thickness={6}
          size={60}
          sx={{
            color: 'secondary.main',
            position: 'absolute',
            zIndex: 2002,
            animation: `${spinAnimation} 1s linear infinite`,
          }}
        />
      </Box>
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mt: -0.5, }}>
        Recording your vote. Please wait...
      </Typography>
    </Box>,
    document.body
  );
};

export default LoadingPage;
