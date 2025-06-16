import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    useMediaQuery, useTheme, Typography, Grid
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoteIcon from 'assets/images/VoteIcon.png';
import { BUTTON_ADD_COLOR, TITLE } from 'common/color';
import NormalLoadingPage from 'common/NormalLoadingPage';
import MainCard from 'ui-component/cards/MainCard';
import publicService from 'services/public.service';
import AppBar from 'ui-component/extended/AppBar';
import Footer from '../landing/Footer';
import Layout from 'ui-component/Layout';

const Election = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);
    const [countdowns, setCountdowns] = useState({});

    const navigate = useNavigate();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        const fetchElectionTypes = async () => {
            try {
                const response = await publicService.getAllActiveElections();
                if (response.status === 200) {
                    setElectionTypes(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch elections:', error);
            }
        };
        fetchElectionTypes();
    }, []);

    // Countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const updatedCountdowns = {};

            electionTypes.forEach((election) => {
                const deadline = new Date(election.electionDeadline).getTime();
                const distance = deadline - now;

                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    updatedCountdowns[election.electionId] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                } else {
                    updatedCountdowns[election.electionId] = 'Expired';
                }
            });

            setCountdowns(updatedCountdowns);
        }, 1000);

        return () => clearInterval(interval);
    }, [electionTypes]);

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
            navigate('/election/vote-qrCode', {
                state: {
                    electionId: selectedElection.electionId,
                    electionTypeId: selectedElection.electionTypeId,
                    electionTypeName: selectedElection.electionTypeName,
                    electionName: selectedElection.electionName
                }
            });
        }
    };

    if (loading) return <NormalLoadingPage />;

    return (
        <Layout>
            <Box sx={{ background: TITLE, color: '#ffffff' }} p={1}>
                <Typography textAlign="center" variant="h2" sx={{ color: '#ffffff' }}>Elections</Typography>
            </Box>

            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2, px: 5 }}>
                {electionTypes.filter(election => new Date(election.electionDeadline) > new Date()).length === 0 ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="200px"
                    >
                        <Typography
                            variant="h3"
                            color="text.secondary"
                            sx={{ textAlign: 'center', width: '100%', mt: 4 }}
                        >
                        There are currently no active elections.
                        </Typography>
                    </Box>
                ) :
                    (electionTypes.filter(election => new Date(election.electionDeadline) > new Date())
                        .map((election) => (
                            <Grid item xs={12} sm={6} md={3} key={election.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    {countdowns[election.electionId] && countdowns[election.electionId] !== 'Expired' ? (
                                        (() => {
                                            const parts = countdowns[election.electionId].split(' ');
                                            return (
                                                <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 900 }}>
                                                    {parts.map((part, index) => {
                                                        const value = part.slice(0, -1);
                                                        const label = part.slice(-1);
                                                        return (
                                                            <Box key={index} component="span" sx={{ mr: 1 }}>
                                                                <Box component="span" sx={{ color: '#d32f2f', fontWeight: 900, fontSize: '1.25rem' }}>
                                                                    {value}
                                                                </Box>
                                                                <Box component="span" sx={{ color: '#000', fontWeight: 900, fontSize: '1.25rem' }}>
                                                                    {label}
                                                                </Box>
                                                            </Box>
                                                        );
                                                    })}
                                                </Typography>
                                            );
                                        })()
                                    ) : (
                                        <CircularProgress size={20} color="inherit" />
                                    )}
                                </Box>


                                <MainCard
                                    onClick={() => handleCardClick(election)}
                                    sx={{
                                        height: 220,
                                        border: '2px solid #002B69',
                                        cursor: 'pointer',
                                        transition: 'box-shadow 0.5s',
                                        '&:hover': { boxShadow: '0px 10px 20px #002B69' }
                                    }}
                                >
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                        <img src={VoteIcon} alt={election.electionName} height="20%" width="20%" />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#000000' }}
                                        >
                                            {election.electionTypeName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.9rem', color: '#000000' }}>
                                            {election.electionName}
                                        </Typography>

                                    </Box>
                                </MainCard>
                            </Grid>
                        ))
                    )
                }
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') handleDialogClose();
                }}
                maxWidth="sm"
                fullWidth
                sx={{ '& .MuiDialog-paper': { borderRadius: 3, px: 2, py: 2 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Notice</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" fontWeight="bold" fontSize="15px" textAlign="center" gutterBottom>
                        You need to have your Voter VC available in your{' '}
                        <span style={{ color: '#5AC994' }}><strong>Bhutan NDI</strong></span> Wallet to cast your vote.
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" fontSize="13px" textAlign="center">
                        If you don’t have it yet, visit the ‘Generate Voter VC’ page, scan the QR code, and share your details using the{' '}
                        <span style={{ color: '#5AC994' }}><strong>Bhutan NDI</strong></span> Wallet to get it.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={handleDialogClose} color="error" variant="contained">Cancel</Button>
                    <Button
                        onClick={handleProceed}
                        sx={{ background: BUTTON_ADD_COLOR, '&:hover': { backgroundColor: BUTTON_ADD_COLOR } }}
                        variant="contained"
                    >
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default Election;
