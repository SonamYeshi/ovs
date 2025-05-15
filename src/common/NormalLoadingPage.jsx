import React from 'react';
import { Box, CircularProgress, keyframes, Typography } from '@mui/material';
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

const NormalLoadingPage = () => {
    return (
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
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    position: 'relative',
                    animation: `${pulse} 2s infinite`
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
                        animation: `${spinAnimation} 1s linear infinite`
                    }}
                />
                <CircularProgress
                    thickness={6}
                    size={60}
                    sx={{
                        color: 'secondary.main',
                        position: 'absolute',
                        zIndex: 3,
                        animation: `${spinAnimation} 1s linear infinite`
                    }}
                />
            </Box>
            <Typography variant="h6" sx={{ mt: 3, color: 'text.primary' }}>
                Please wait...
            </Typography>
        </Box>
    );
};

export default NormalLoadingPage;



