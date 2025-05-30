import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CrossImg from 'assets/images/corssImg.png';
import { TITLE } from 'common/color';
import LoadingPage from 'common/LoadingPage';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import globalLib from 'common/global-lib';

import candidateService from 'services/candidate.service';
import NdiService from '../../../services/ndi.service';
import blockchainAuthService from 'services/blockchainAuth.service';
import blockchainService from 'services/blockchain.service';
import { clearDIDs, setDIDs } from '../../../utils/ndi-storage';
import electionSetupService from 'services/electionSetup.service';
import MainCard from 'ui-component/cards/MainCard';
import voteSuccessSound from 'assets/images/successAudio.mp3';
import voteFailureSound from 'assets/images/failureAudio.mp3';
import Processing from 'common/Processing';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LocalElectionScanPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [electionTypes, setElectionTypes] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [dialogState, setDialogState] = useState({
        open: false,
        type: '',
        title: '',
        message: '',
        confirmAction: null
    });
    const [progressNDI, setProgressNDI] = useState(true);
    const [loading, setLoading] = useState(false);
    const [validatingLoad, setValidatingLoad] = useState(false);
    const [dialogQRCodeOpen, setDialogQRCodeOpen] = useState(false);
    const { voterVid, dzongkhag, gewog, village, electionTypeId, electionId, electionName, electionTypeName } = location.state || {};

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const [relationshipDID, setRelationshipDID] = useState(null);
    const [holderDID, setHolderDID] = useState(null);

    const [walletCheckDialogOpen, setWalletCheckDialogOpen] = useState(false);

    useEffect(() => {
        if (!electionId || !electionTypeId) {
            navigate('/vote-ndi-qr');
            return;
        }

        setRelationshipDID(window.localStorage.getItem('relationship_did'));
        setHolderDID(window.localStorage.getItem('holder_did'));

        candidateService
            .getCandidates(electionTypeId, electionId, dzongkhag, gewog, village)
            .then((response) => {
                setCandidates(response.data);
            })
            .catch((error) => {
                // console.error('Error fetching candidates:', error);
                setDialogState({
                    open: true,
                    type: 'result',
                    title: 'Error',
                    message: 'No Candidates found for this election.',
                    confirmAction: null
                });
            });
    }, [electionId, electionTypeId, navigate]);

    const getCandidateById = (id) => candidates.find((c) => c.id === id);

    const handleNDINotificationRequest = async () => {
        setWalletCheckDialogOpen(true);

        NdiService.proofNdiRequest(true, relationshipDID)
            .then((res) => {
                const threadId = res.data.threadId;
                setProgressNDI(false);

                natsListenerForNotification(threadId);
            })
            .catch((err) => {
                console.log(err);
                setProgressNDI(false);
                setWalletCheckDialogOpen(false);
            });
    };

    const natsListenerForNotification = (threadId) => {
        const endPoint = `${BASE_URL}ndi/nats-subscribe?threadId=${threadId}&isBiometric=true&electionTypeId=${electionTypeId}&electionId=${electionId}`;
        const eventSource = new EventSource(endPoint);
        eventSource.addEventListener('NDI_SSI_EVENT', (event) => {
            const data = JSON.parse(event.data);
            setWalletCheckDialogOpen(false);

            // eventSource.close();
            // console.log(data)
            const candidate = getCandidateById(selectedCandidateId);

            if (data.status === 'exists') {
                setDIDs(data.userDTO.relationship_did, data.userDTO.holder_did);
                const voterVID = data.userDTO.vid;
                // console.log(voterVID);
                submitVote(candidate, voterVID);
            } else {
                setErrorDialogOpen(true);
                setDialogMessage(data.userDTO.message || 'Biometric scan failed.');
            }
        });
    };

    const submitVote = async (candidate, voterVID) => {
        setValidatingLoad(true);
        const bc_token = await blockchainAuthService.fetchBlockchainAccessToken();
        if (!bc_token) {
            return globalLib.warningMsg('Could not load access token for blockchain.');
        }

        const payload = {
            voterID: voterVID,
            candidateCid: candidate.candidateCid,
            candidateId: candidate.id,
            electionTypeId: electionTypeId,
            electionId: electionId,
            bcAccessToken: bc_token,
            ndiRelationshipDID: relationshipDID,
            ndiHolderDID: holderDID
        };
        setValidatingLoad(false);

        setLoading(true);
        blockchainService
            .saveVote(payload)
            .then((res) => {
                if (!res.data || !res.data.message) {
                    throw new Error('Response is missing data.message');
                }

                // ✅ Play sound here
                const audio = new Audio(voteSuccessSound);
                audio.play().catch((err) => console.error('Error playing sound:', err));

                return globalLib.successMsg(res.data.message);
            })
            .then(() => {
                navigate('/vote-ndi-qr', {
                    state: { electionTypeId: electionTypeId, electionId: electionId }
                });
                return;
            })
            .catch((err) => {
                const audio = new Audio(voteFailureSound);
                audio.play().catch((err) => console.error('Error playing sound:', err));

                globalLib.warningMsg(err?.response?.data?.error || err.message || 'Something went wrong').then(() => {
                    setLoading(false);
                    navigate('/vote-ndi-qr', {
                        state: { electionTypeId: electionTypeId, electionId: electionId }
                    });
                    return;
                });
            });
    };

    const handleVoteClick = (candidateId) => {
        const candidate = getCandidateById(candidateId);
        setSelectedCandidateId(candidateId);

        setDialogState({
            open: true,
            type: 'confirm',
            title: 'Confirmation',
            message: (
                <>
                    <Box display={'flex'} justifyContent={'center'} mb={2}>
                        <Avatar src={candidate.proPicUrl} alt={candidate.candidateName} sx={{ width: 90, height: 90 }} variant="circular" />
                    </Box>
                    <Typography variant="h5" textAlign={'center'}>
                        Confirmation
                    </Typography>{' '}
                    <br />
                    Are you sure you want to confirm your vote for <strong>{candidate.candidateName}</strong>? This process cannot be
                    undone.
                </>
            ),
            confirmAction: null
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
            navigate('/vote-ndi-qr', {
                state: { electionTypeId: electionTypeId, electionId: electionId }
            });
            return;
        }
        setSelectedCandidateId(null);
        setLoading(false);
    };

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
    return (
        <>
            <MainCard>
                <Box mt={4}>
                    <Typography variant="h3" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 1 }}>
                        <div>{electionTypeName}</div>
                    </Typography>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 4 }}>
                        <div> {electionName} </div>
                    </Typography>
                </Box>
                <Box
                    mt={1}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Paper elevation={3} sx={{ borderRadius: 4, p: 4, width: '80%', maxWidth: 900 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {candidates.map((candidate, index) => (
                                        <TableRow key={candidate.id}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell>{candidate.candidateName}</TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    src={candidate.proPicUrl}
                                                    alt={candidate.candidateName}
                                                    sx={{ width: 70, height: 70 }}
                                                    variant="circular"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <ArrowCircleLeftIcon
                                                    fontSize="large"
                                                    sx={{
                                                        color: getArrowIconColor(candidate.id)
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleVoteClick(candidate.id)}
                                                    sx={{
                                                        backgroundColor: getVoteButtonColor(candidate.id),
                                                        borderRadius: '30px',
                                                        px: 7,
                                                        py: 2.5,
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
                {/* Dialog */}
                <Dialog
                    open={dialogState.open}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            handleDialogClose();
                        }
                    }}
                >
                    <DialogContent>
                        <Box p={2} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                            <Typography variant="caption" fontSize={'13px'} textAlign={'center'}>
                                {dialogState.message}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Button size="small" color="error" variant="outlined" onClick={handleDialogClose}>
                            {dialogState.type === 'confirm' ? 'No' : 'Close'}
                        </Button>

                        {dialogState.type === 'confirm' && (
                            <Button
                                size="small"
                                color="success"
                                variant="outlined"
                                onClick={() => {
                                    // handleQRLoading();
                                    handleNDINotificationRequest();
                                }}
                            >
                                Confirm
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* lodaing page */}
                {validatingLoad && (
                    <>
                        <Processing text="Validating..." />
                    </>
                )}
                {loading && (
                    <>
                        <LoadingPage />
                    </>
                )}

                <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setErrorDialogOpen(false)}
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
                    onClose={() => {}}
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
                    {/* <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={
                                () => {
                                    setWalletCheckDialogOpen(false);
                                    handleDialogClose();
                                }

                                // navigate('/localElectionScanPage')
                            }
                            color="error"
                            variant="contained"
                        >
                            Cancel
                        </Button>
                    </DialogActions> */}
                </Dialog>
            </MainCard>
        </>
    );
};

export default LocalElectionScanPage;
