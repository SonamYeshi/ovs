import { Box, Chip, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TITLE } from 'common/color';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NormalLoadingPage from 'common/NormalLoadingPage';
import blockchainAuthService from 'services/blockchainAuth.service';
import blockchainService from 'services/blockchain.service';
import electionSetupService from 'services/electionSetup.service';
import MainCard from 'ui-component/cards/MainCard';

const LocalElectionResult = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [electionTypes, setElectionTypes] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [dialogState, setDialogState] = useState({
        open: false,
        type: '',
        title: '',
        message: '',
        confirmAction: null
    });

    const { electionId, electionTypeId } = location.state || {};

    useEffect(() => {
        if (!electionId || !electionTypeId) {
            navigate('/electionResult', { replace: true });
        } else {
            getVoteResult();
        }
    }, []);

    const getVoteResult = async () => {
        try {
            const token = await blockchainAuthService.fetchBlockchainAccessToken();

            if (!token) {
                setDialogState({
                    open: true,
                    type: 'Close',
                    title: 'Error',
                    message: 'Could not authenticate with the blockchain.',
                    confirmAction: null
                });
                return;
            }

            const response = await blockchainService.getElectionResult(electionTypeId, electionId, token);
            if (response.data.length !== 0) {
                setCandidates(response.data);
            } else {
                setDialogState({
                    open: true,
                    type: 'Close',
                    title: 'Error',
                    message: 'No Voting result for this election.',
                    confirmAction: null
                });
            }
        } catch (error) {
            console.error('Failed to fetch vote result:', error);
            setDialogState({
                open: true,
                type: 'Close',
                title: 'Error',
                message: 'An error occurred while fetching vote results.',
                confirmAction: null
            });
        } finally {
            setLoading(false);
        }
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
    const handleDialogClose = () => {
        setDialogState((prev) => ({ ...prev, open: false }));
        navigate('/electionResult');
        return;
    };

    if (loading) {
        return <NormalLoadingPage />;
    }

    return (
        <>
            <MainCard>
                <Box mt={4}>
                    <Typography variant="h3" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 1 }}>
                        {electionTypes.map((type) => (
                            <div key={type.id}>{type.electionTypeName}</div>
                        ))}
                    </Typography>
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 1 }}>
                        {electionTypes.map((type) => (
                            <div key={type.id}> [{type.electionName}] </div>
                        ))}
                    </Typography>
                    <Typography variant="h5" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 4 }}>
                        Vote counts
                    </Typography>
                </Box>
                <Box
                    mt={1}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Paper elevation={3} sx={{ borderRadius: 1, p: 3, width: '90%', maxWidth: 800 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#003366' }}>
                                            Sl.No
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Candidate</TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#003366' }}>
                                            Vote Count
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {candidates.map((item, index) => (
                                        <TableRow key={item.candidateId}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell>{item.candidateName}</TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    src={item.proPicUrl}
                                                    alt={item.candidateName}
                                                    sx={{ width: 70, height: 70 }}
                                                    variant="circular"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={item.voteCount}
                                                    variant="contained"
                                                    sx={{ fontWeight: 'bold', backgroundColor: '#003366', color: '#ffffff' }}
                                                />
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
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => {
                                handleDialogClose();
                            }}
                        >
                            {dialogState.type}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MainCard>
        </>
    );
};

export default LocalElectionResult;
