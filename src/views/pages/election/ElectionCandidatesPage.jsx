import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AppBar from 'ui-component/extended/AppBar';
import CrossImg from 'assets/images/corssImg.png';
import voteFailureSound from 'assets/images/failureAudio.mp3';
import voteSuccessSound from 'assets/images/successAudio.mp3';
import { TITLE } from 'common/color';
import globalLib from 'common/global-lib';
import LoadingPage from 'common/LoadingPage';
import Processing from 'common/Processing';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import blockchainService from 'services/blockchain.service';
import blockchainAuthService from 'services/blockchainAuth.service';
import publicService from 'services/public.service';
import NdiService from '../../../services/ndi.service';
import { setDIDs } from '../../../utils/ndi-storage';
import Footer from '../landing/Footer';
import { h } from '@fullcalendar/core/preact';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/v1/ndi';

const ElectionCandidatesPage = () => {
    const [loading, setLoading] = useState(false);
    const [validatingLoad, setValidatingLoad] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [relationshipDID, setRelationshipDID] = useState(null);
    const [holderDID, setHolderDID] = useState(null);
    const [walletCheckDialogOpen, setWalletCheckDialogOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [dialogState, setDialogState] = useState({
        open: false,
        type: '',
        title: '',
        message: '',
        confirmAction: null
    });

    const { voterVid, dzongkhag, gewog, village, electionTypeId, electionId, electionName, electionTypeName } = location.state || {};

    useEffect(() => {
        if (!electionId || !electionTypeId) {
            navigate('/election/vote-qrCode');
            return;
        }

        setRelationshipDID(localStorage.getItem('relationship_did'));
        setHolderDID(localStorage.getItem('holder_did'));

        if (electionId && electionTypeId) {
            publicService
                .getCandidates(electionTypeId, electionId, dzongkhag, gewog, village)
                .then((response) => {
                    setCandidates(response.data);
                })
                .catch((error) => {
                    setDialogState({
                        open: true,
                        type: 'result',
                        title: 'Error',
                        message: 'No Candidates found for this election.',
                        confirmAction: null
                    });
                });
        }
    }, [electionId, electionTypeId]);

    const getCandidateById = (id) => candidates.find((c) => c.id === id);

    const handleNDINotificationRequest = () => {
        setWalletCheckDialogOpen(true);
        NdiService.proofNdiRequest(true, relationshipDID)
            .then((res) => {
                const threadId = res.data.threadId;

                // natsListenerForNotification(threadId);
            })
            .catch((err) => {
                console.log(err);
                setWalletCheckDialogOpen(false);
            });
    };

    //commented for now since we are doing away with bio metric for second stage
    const natsListenerForNotification = (threadId) => {
        const endPoint = `${BASE_URL}/nats-subscribe?threadId=${threadId}&isBiometric=true&electionTypeId=${electionTypeId}&electionId=${electionId}`;
        const eventSource = new EventSource(endPoint);

        eventSource.addEventListener('NDI_SSI_EVENT', async (event) => {
            try {
                const data = JSON.parse(event.data);
                setWalletCheckDialogOpen(false);

                if (data.status === 'exists') {
                    const candidate = getCandidateById(selectedCandidateId);
                    setDIDs(data.userDTO.relationship_did, data.userDTO.holder_did);
                    const voterVID = data.userDTO.vid;

                    // submitVote(candidate, voterVID);
                } else {
                    setErrorDialogOpen(true);
                    setDialogMessage(data.userDTO.message || 'Biometric scan failed.');
                }
                // eventSource.close();
            } catch (error) {
                console.error('Error in NDI_SSI_EVENT handler:', error);
                setErrorDialogOpen(true);
                setDialogMessage('An error occurred while processing the vote.');
                setWalletCheckDialogOpen(false);
            }
        });
    };

    const storingVote = () => {
        if (!selectedCandidateId) {
            globalLib.warningMsg('Please select a candidate before submitting your vote.');
            return;
        }

        const candidate = getCandidateById(selectedCandidateId);
        if (!candidate) {
            globalLib.warningMsg('Selected candidate not found.');
            return;
        }

        if (!voterVid) {
            globalLib.warningMsg('Voter ID is missing.');
            return;
        }

        submitVote(candidate, voterVid);

    };

    const submitVote = async (candidate, voterVID) => {
        setLoading(true);
        await blockchainAuthService
            .fetchBlockchainAccessToken()
            .then((bc_token) => {
                if (!bc_token) {
                    throw new Error('Could not load access token for blockchain.');
                }

                const payload = {
                    voterID: voterVID,
                    candidateCid: candidate.candidateCid,
                    candidateId: candidate.id,
                    electionTypeId,
                    electionId,
                    bcAccessToken: bc_token,
                    ndiRelationshipDID: relationshipDID,
                    ndiHolderDID: holderDID
                };

                return blockchainService.saveVote(payload);
            })
            .then((res) => {
                if (!res.data || !res.data.message) {
                    throw new Error('Response is missing data.message');
                }

                const audio = new Audio(voteSuccessSound);
                audio.play().catch((err) => console.error('Error playing success sound:', err));

                return globalLib.successMsg(res.data.message);
            })
            .catch((err) => {
                console.error('Error submitting vote:', err?.response?.data?.error || err.message || err);

                const audio = new Audio(voteFailureSound);
                audio.play().catch((err) => console.error('Error playing failure sound:', err));

                return globalLib.warningMsg(err?.response?.data?.error || err.message || 'Something went wrong');
            })
            .finally(() => {
                setLoading(false);
                navigate('/election/vote-qrCode', {
                    state: { electionTypeId, electionId }
                });
            });
    };

    const getArrowIconColor = (candidateId) => {
        return selectedCandidateId === candidateId ? '#2bc039' : '#003366';
    };

    const getVoteButtonColor = (candidateId) => {
        return selectedCandidateId === candidateId ? '#667FA5' : '#003366';
    };

    const handleDialogClose = () => {
        setDialogState((prev) => ({ ...prev, open: false }));
        if (candidates.length === 0) {
            navigate('/election/vote-qrCode', {
                state: { electionTypeId: electionTypeId, electionId: electionId }
            });
            return;
        }
        setSelectedCandidateId(null);
        setLoading(false);
    };

    const handleVoteClick = (candidateId) => {
        const candidate = getCandidateById(candidateId);
        setSelectedCandidateId(candidateId);

        setDialogState({
            open: true,
            type: 'confirm',
            title: 'Confirmation',
            message: (
                <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Avatar
                            src={candidate.proPicUrl}
                            alt={candidate.candidateName}
                            sx={{
                                width: 170,
                                height: 170
                            }}
                            variant="circular"
                        />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Confirmation
                    </Typography>
                    <Typography>
                        Are you sure you want to confirm your vote for{' '}
                        <strong>{candidate.candidateName}</strong>? This process cannot be undone.
                    </Typography>
                </Box>
            ),
            confirmAction: null
        });

    };

    return (
        <>
            <AppBar />
            <Box>
                <Box sx={{ background: TITLE, color: '#ffffff' }} p={1}>
                    {' '}
                    <Typography textAlign={'center'} variant="h2" sx={{ color: '#ffffff', mb: 1 }}>
                        <div>{electionTypeName}</div>
                    </Typography>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ color: '#ffffff', mb: 1 }}>
                        <div> {electionName} </div>
                    </Typography>
                </Box>

                <MainCard sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Paper elevation={3} sx={{ borderRadius: 1.5, p: 2, width: '100%', maxWidth: 900 }}>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    border: '2px dotted #000',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    p: 0
                                }}
                            >
                                <Table
                                    sx={{
                                        '& td, & th': {
                                            borderBottom: '2px dotted #000',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                        },
                                        '& tbody tr:last-child td': {
                                            borderBottom: 'none'
                                        },
                                        '& thead th': {
                                            fontWeight: 'bold',
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={4}
                                                sx={{ fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#f5f5f5' }}
                                            >
                                                Candidates for {electionName}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {candidates.map((candidate, index) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell align="center">
                                                    <Typography variant="body1" fontWeight="bold" color="text.secondary">
                                                        འོས་མི།
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {candidate.candidateName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Avatar
                                                        src={candidate.proPicUrl}
                                                        alt={candidate.candidateName}
                                                        sx={{ width: 80, height: 80 }}
                                                        variant="circular"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <ArrowCircleLeftIcon
                                                        fontSize="large"
                                                        sx={{ color: getArrowIconColor(candidate.id) }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleVoteClick(candidate.id)}
                                                        sx={{
                                                            backgroundColor: getVoteButtonColor(candidate.id),
                                                            borderRadius: '30px',
                                                            px: 6,
                                                            py: 1.5,
                                                            minWidth: '100px',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                backgroundColor: '#003366'
                                                            }
                                                        }}
                                                    >
                                                        Vote
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </MainCard>

                {loading && <LoadingPage />}

                <Dialog
                    open={dialogState.open}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            handleDialogClose();
                        }
                    }}
                >
                    <DialogContent>
                        <Box p={2}>{dialogState.message}</Box> {/* Directly render the layout */}
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={handleDialogClose}
                            disabled={loading}
                        >
                            {dialogState.type === 'confirm' ? 'No' : 'Close'}
                        </Button>

                        {dialogState.type === 'confirm' && (
                            <Button
                                size="small"
                                color="success"
                                variant="outlined"
                                onClick={() => {
                                    storingVote();
                                    // setDialogState((prev) => ({ ...prev, open: false }));
                                    // handleNDINotificationRequest(); //poping for bio-metric request notify
                                }}
                                disabled={loading}
                            >
                                Confirm
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>


                <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setErrorDialogOpen(false);
                            handleDialogClose();
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                    >
                        <CloseIcon color="error" />
                    </IconButton>
                    <Box display={'flex'} justifyContent={'center'}>
                        <img src={CrossImg} alt="corssImg" width="30%" />
                    </Box>
                    <DialogContent>
                        <Box sx={{ p: 1, minWidth: 300 }} display={'flex'} flexDirection={'column'} gap={2}>
                            <Typography variant="h4" textAlign={'center'}>
                                Error Message
                            </Typography>
                            <Typography variant="h5" color="error" textAlign={'center'}>
                                {dialogMessage}
                            </Typography>
                        </Box>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={walletCheckDialogOpen}
                    onClose={() => { }}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            p: { xs: 2, sm: 4 },
                            maxWidth: 400,
                            textAlign: 'center'
                        }
                    }}
                >
                    <DialogContent>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                            <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                                Waiting for Biometric Verification
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary', fontWeight: 'bold' }}
                            >
                                Open your <span style={{ color: '#5AC994' }}>Bhutan NDI</span> App for Biometric authentication
                            </Typography>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
};

export default ElectionCandidatesPage;
