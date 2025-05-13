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
    Typography
} from '@mui/material';
import CandidateImg from 'assets/images/candidatephoto.jpg';
import VoteIcon from 'assets/images/VoteIcon.png';
import { TITLE } from 'common/color';
import globalLib from 'common/global-lib';
import LoadingPage from 'common/LoadingPage';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import voteService from 'services/vote.service';
import VoteNDIQRCode from '../ndi/VoteNDIQRCodePage';


const LocalElectionScanPage = () => {
    const location = useLocation();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [dialogState, setDialogState] = useState({
        open: false,
        type: '', // e.g., "vote", "confirm", etc.
        title: '',
        message: '',
        confirmAction: null
    });
    const [loading, setLoading] = useState(false);
    const [dialogQRCodeOpen, setDialogQRCodeOpen] = useState(false);
    const { voterCid, electionTypeId } = location.state || {};

    const handleQRLoading = () => {
        setDialogQRCodeOpen(true); // Open dialog
    };

    const handleCloseDialogForQRCode = () => {
        setDialogQRCodeOpen(false);
    };
    useEffect(() => {
        // const electionTypeId = 1;
        voteService
            .getCandidates(electionTypeId)
            .then((response) => {
                setCandidates(response.data);
            })
            .catch((error) => {
                console.error('Error fetching candidates:', error);
                setDialogState({
                    open: true,
                    type: 'result',
                    title: 'Error',
                    message: 'No Candidates found.',
                    confirmAction: null
                });
            });
    }, []);

    const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate);

    const handleVoteClick = (candidateId) => {
        setSelectedCandidate(candidateId);
        const candidate = candidates.find((c) => c.id === candidateId);
        setDialogState({
            open: true,
            type: 'confirm',
            title: 'Confirmation',
            message: (
                <>
                    Are you sure you want to confirm your vote for <strong>{candidate.candidateName}</strong>? This process cannot be
                    undone.
                </>
            ),
            confirmAction: () => submitVote(candidate)
        });
    };

    const submitVote = (candidate) => {
        const payload = {
            voterName: 'Voter Name',
            voterCid: voterCid,
            candidateCid: candidate.candidateCid,
            candidateId: candidate.id,
            electionTypeId: 1,
            isVoted: true,
            voteTxnHash: 'vote-txn-hash'
        };
        setLoading(true);
        voteService
            .saveVote(payload)
            .then((res) => {
                console.log(res)
                setDialogQRCodeOpen(true);
                globalLib.successMsg(res.data.message).then(() => {
                    setLoading(true); // Show loading again before reload
                    setTimeout(() => {
                        window.location.reload();
                    }, 100); // Slight delay to ensure loader is visible
                });
            })
            .catch((err) => {
                console.error('Error submitting vote', err.response.data.error);
                globalLib.warningMsg(err.response?.data.error || 'Something went wrong').then(() => {
                    setLoading(true); // Show loading again before reload
                    setTimeout(() => {
                        window.location.reload();
                    }, 100); // Delay to render loading
                });
            });
    };

    const handleDialogClose = () => {
        setDialogState((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <Box mt={4}>
                {' '}
                <Typography variant="h2" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 4 }}>
                    Local Government Elections
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
                                                    color: selectedCandidate === candidate.id ? '#c0392b' : '#003366' // green if selected
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                onClick={() => handleVoteClick(candidate.id)}
                                                sx={{
                                                    backgroundColor: selectedCandidate === candidate.id ? '#667FA5' : '#003366', // green if selected
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
            <Dialog open={dialogState.open} onClose={handleDialogClose}>
                <Box display={'flex'} justifyContent={'center'}>
                    <img src={VoteIcon} alt="VoteIcon" height="25%" width="25%" />
                </Box>

                <DialogContent>
                    <Box p={2} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Typography variant="caption" fontSize={'14px'} textAlign={'center'}>
                            {dialogState.title}
                        </Typography>
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
                                submitVote(selectedCandidateData);
                                // handleQRLoading(); //this is for QR code
                            }}
                        >
                            Confirm
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* lodaing page */}
            {loading && (
                <>
                    <LoadingPage />
                </>
            )}

            {/* page for QR code */}
            <Dialog open={dialogQRCodeOpen} onClose={handleCloseDialogForQRCode} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}> Bhutan NDI Face Recognition </DialogTitle>
                <DialogContent>
                    <VoteNDIQRCode isFacialProof={true}/>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleCloseDialogForQRCode} color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LocalElectionScanPage;
