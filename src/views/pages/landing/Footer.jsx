import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                mt: 'auto',
                py: 2,
                // bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
                // boxShadow: 1
            }}
        >
            <Divider sx={{ width: '80%', mb: 2 }} />
            <Typography
                variant="body2"
                sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', lg: '0.9rem' },
                    color: '#757575'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>&copy; {new Date().getFullYear()}, </span>
                <span style={{ color: '#003366', fontWeight: 'bold' }}>Online Voting System </span>
                <span style={{ fontWeight: 'bold' }}>All rights reserved.</span>
            </Typography>
        </Box>
    );
};

export default Footer;
