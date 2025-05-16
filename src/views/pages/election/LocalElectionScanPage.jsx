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
import { TITLE } from 'common/color';
import LoadingPage from 'common/LoadingPage';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import voteService from 'services/vote.service';
import NDIBiometricQRCodePage from '../ndi/NDIBiometricQRCodePage';

const LocalElectionScanPage = () => {
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
    const [loading, setLoading] = useState(false);
    const [dialogQRCodeOpen, setDialogQRCodeOpen] = useState(false);
    const { voterCid, electionTypeId } = location.state || {};

    useEffect(() => {
        voteService
            .getCandidates(electionTypeId)
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
    }, []);

    const handleQRLoading = () => {
        setDialogQRCodeOpen(true); // Open dialog
    };

    const handleCloseDialogForQRCode = () => {
        setDialogQRCodeOpen(false);
        setDialogState((prev) => ({ ...prev, open: false }));
        setSelectedCandidateId(null);
    };

    const getCandidateById = (id) => candidates.find((c) => c.id === id);

    const handleVoteClick = (candidateId) => {
        setSelectedCandidateId(candidateId);
        const candidate = getCandidateById(candidateId);
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
        if(candidates.length === 0){
            navigate('/vote-ndi-qr', {
                state: { electionId: electionTypeId }
            });
            return;
        }
        setSelectedCandidateId(null);
        setLoading(false);
        // setTimeout(() => {
        //     window.location.reload();
        // }, 100);
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
            <Dialog open={dialogState.open} onClose={(event, reason) =>{
                if(reason !== "backdropClick"){
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
                                handleQRLoading();
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
            <Dialog open={dialogQRCodeOpen} onClose={(event, reason) =>{
                //not to allow closing the dialog on click outside the dialog
                if (reason !== 'backdropClick') {
                    handleCloseDialogForQRCode();
                  }
            }} 
            fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}> Bhutan NDI Face Recognition </DialogTitle>
                <DialogContent>
                    <NDIBiometricQRCodePage 
                    electionTypeId={electionTypeId} 
                    candidate={getCandidateById(selectedCandidateId)} />
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
