import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import VoteIcon from 'assets/images/VoteIcon.png';
import MainCard from 'ui-component/cards/MainCard';
import NormalLoadingPage from 'common/NormalLoadingPage';
import voteService from 'services/vote.service';
import electionSetupService from 'services/electionSetup.service';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';

const Election = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);

    const navigate = useNavigate();
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        const fetchElectionTypes = async () => {
            try {
                const response = await electionSetupService.getAllSubElectionType();
                if (response.status === 200) {
                    setElectionTypes(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch election types:', error);
            }
        };

        fetchElectionTypes();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCardClick = (election) => {
        setSelectedElection(election);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedElection(null);
    };

    const handleProceed = () => {
        if (selectedElection) {
            navigate('/vote-ndi-qr', {
                state: {
                    electionId: selectedElection.id,
                    electionTypeId: selectedElection.electionTypeId
                }
            });
        }
    };

    const getResponsiveFontSize = () => {
        if (isXs) return '0.8rem';
        if (isSm) return '1rem';
        return '1.2rem';
    };

    if (loading) {
        return <NormalLoadingPage />;
    }

    return (
        <>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
                {electionTypes.map((election) => (
                    <Grid item xs={12} sm={6} md={3} key={election.id}>
                        <MainCard
                            onClick={() => handleCardClick(election)}
                            sx={{
                                height: {
                                    xs: 200,
                                    sm: 200,
                                    md: 200,
                                    lg: 200,
                                    xl: 200
                                },
                                cursor: 'pointer',
                                transition: 'box-shadow 0.5s',
                                '&:hover': { boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }
                            }}
                        >
                            <Box sx={{ textDecoration: 'none' }} display={'flex'} flexDirection="column" alignItems="center" gap={2}>
                                <img src={VoteIcon} alt={election.electionName} height="20%" width="20%" />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontSize: {
                                            xs: '13px',
                                            sm: '10px',
                                            md: '17px',
                                            lg: '15px',
                                            xl: '1rem'
                                        },
                                        color: '#000000'
                                    }}
                                >
                                    {election.electionTypeName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: {
                                            xs: '13px',
                                            sm: '10px',
                                            md: '17px',
                                            lg: '15px',
                                            xl: '1rem'
                                        },
                                        color: '#000000'
                                    }}
                                >
                                    {election.electionName}
                                </Typography>
                            </Box>
                        </MainCard>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleDialogClose();
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Notice</DialogTitle>
                <DialogContent>
                    <Typography variant="caption" fontSize={'13px'}>
                        Before you can vote, you must first obtain your Voter VC. To get your Voter VC, please visit the 'Generate Voter VC'
                        page, scan the QR code, and share your details through the Bhutan NDI Wallet.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={handleDialogClose} color="error" variant="contained">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProceed}
                        sx={{
                            background: BUTTON_ADD_COLOR,
                            '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                        }}
                        variant="contained"
                    >
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Election;
