import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import VoteIcon from 'assets/images/VoteIcon.png';
import { BUTTON_ADD_COLOR, TITLE } from 'common/color';
import NormalLoadingPage from 'common/NormalLoadingPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import electionSetupService from 'services/electionSetup.service';
import MainCard from 'ui-component/cards/MainCard';
import AppBar from 'ui-component/extended/AppBar';
import Footer from '../landing/Footer';

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
                    electionTypeId: selectedElection.electionTypeId,
                    electionTypeName: selectedElection.electionTypeName,
                    electionName: selectedElection.electionName
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
            <AppBar />
            <Box>
                <Box sx={{ background: TITLE, color: '#ffffff' }} p={1}>
                    {' '}
                    <Typography textAlign={'center'} variant="h2" sx={{ color: '#ffffff' }}>
                        Election Types
                    </Typography>
                </Box>

                <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }} p={5}>
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
                                    border: '2px solid #002B69',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.5s',
                                    '&:hover': {
                                        boxShadow: '0px 10px 20px #002B69'
                                    }
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
                    maxWidth="sm" // Reduces the width
                    fullWidth // Ensures it adapts to smaller screens
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 3,
                            paddingX: 2,
                            paddingY: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Notice</DialogTitle>
                    <DialogContent>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            fontSize={'15px'}
                            textAlign="center"
                            gutterBottom
                            sx={{ marginBottom: 2 }}
                        >
                            You need to have your Voter VC available in your{' '}
                            <span style={{ color: '#5AC994' }}>
                                <strong>Bhutan NDI</strong>
                            </span>{' '}
                            Wallet to cast your vote.
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" fontSize={'13px'} textAlign="center">
                            If you don’t have it yet, visit the ‘Generate Voter VC’ page, scan the QR code, and share your details using the{' '}
                            <span style={{ color: '#5AC994' }}>
                                <strong>Bhutan NDI</strong>
                            </span>{' '}
                            Wallet to get it.
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
            </Box>
            <Footer />
        </>
    );
};

export default Election;
