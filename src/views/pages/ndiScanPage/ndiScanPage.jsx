import { useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import NDIlogo from 'assets/images/ndi/NDIlogobg.png';
import VoteNDIQRCode from '../ndi/VoteNDIQRCodePage';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ndiScanPage = ({electionTypeId}) => {
    // const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleQRLoading = () => {
        setDialogOpen(true); // Open dialog
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Button
                    variant="contained"
                    onClick={handleQRLoading}
                    sx={{
                        backgroundColor: '#124143',
                        textTransform: 'none',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#0e3335'
                        }
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <img src={NDIlogo} width="20" height="20" alt="NDI Logo" style={{ marginRight: '10px' }} />
                        <Typography sx={{ color: '#F0F9F4' }}>Login with Bhutan NDI</Typography>
                    </Box>
                </Button>
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}> Bhutan NDI Login </DialogTitle>
                <DialogContent>
                    <VoteNDIQRCode electionTypeId={electionTypeId}/>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleCloseDialog} color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ndiScanPage;
