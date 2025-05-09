import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const NotEligible = () => {
    const location = useLocation();
    const { errorMessage } = location.state || {};

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" color="error">
                {errorMessage || 'An unexpected error occurred.'}
            </Typography>
        </Box>
    );
};

export default NotEligible;
