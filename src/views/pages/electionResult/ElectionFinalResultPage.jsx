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
import Processing from 'common/Processing';
import blockchainAuthService from 'services/blockchainAuth.service';
import blockchainService from 'services/blockchain.service';
import MainCard from 'ui-component/cards/MainCard';

const ElectionFinalResultPage = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [dialogState, setDialogState] = useState({
        open: false,
        type: '',
        title: '',
        message: '',
        confirmAction: null
    });
    const [voteCount, setVoteCount] = useState([]);
    const { electionId, electionTypeId, electionName, electionTypeName } = location.state || {};

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
                setCandidates(response.data.candidates);
                setVoteCount(response.data.totalVotes);
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
                message: 'No voting result found for this election.',
                confirmAction: null
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setDialogState((prev) => ({ ...prev, open: false }));
        navigate('/electionResult');
        return;
    };

    if (loading) {
        return <Processing text='Loading election results, please wait...' />;
    }

    return (
        <>
            <MainCard>
                <Box mt={4}>
                    <Typography
                        variant="h3"
                        align="center"
                        fontWeight="bold"
                        sx={{ color: TITLE, mb: 2 }}
                    >
                        Voting result for {electionName}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 6,
                            mb: 4,
                        }}
                    >
                        <Typography variant="h5" sx={{ color: TITLE }}>
                            Total Voters:{' '}
                            <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                {voteCount}
                            </Box>
                        </Typography>

                        <Typography variant="h5" sx={{ color: TITLE }}>
                            Vote Counts:{' '}
                            <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                {voteCount}
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 1,
                    }}
                >
                    <Paper elevation={3} sx={{ borderRadius: 1, p: 3, width: "90%", maxWidth: 800 }}>
                        <TableContainer
                            sx={{
                                border: "2px dotted #003366",
                                borderRadius: 1,
                                overflow: "hidden",
                                borderCollapse: "separate",
                                borderSpacing: "0 8px",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            borderBottom: "2px dotted #003366",
                                            "& th": {
                                                fontWeight: "bold",
                                                color: "#003366",
                                                paddingY: 1,
                                                paddingX: 2,
                                            },
                                        }}
                                    >
                                        <TableCell align="center">Sl.No</TableCell>
                                        <TableCell align='center'>Candidate</TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center">Vote Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {candidates.map((item, index) => (
                                        <TableRow
                                            key={item.candidateId}
                                            sx={{
                                                borderBottom: "2px dotted #003366",
                                                "&:last-child": {
                                                    borderBottom: "none",
                                                },
                                                "& td": {
                                                    paddingY: 1,
                                                    paddingX: 2,
                                                    verticalAlign: "middle",
                                                },
                                            }}
                                        >
                                            <TableCell align="center">{index + 1}</TableCell>

                                            <TableCell align='center'>
                                                <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                                    འོས་མི།
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {item.candidateName}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Avatar
                                                    src={item.proPicUrl}
                                                    alt={item.candidateName}
                                                    sx={{ width: 90, height: 90 }}
                                                    variant="circular"
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        fontFamily: "'Courier New', monospace", // calculator-style font
                                                        backgroundColor: "#000000",
                                                        color: "#00FF00",
                                                        fontWeight: "bold",
                                                        fontSize: "1.5rem",
                                                        paddingY: 0.5,
                                                        paddingX: 2,
                                                        borderRadius: 1,
                                                        minWidth: 80,
                                                        display: "inline-block",
                                                        textAlign: "center",
                                                        boxShadow: "inset 0 0 5px #00FF00",
                                                    }}
                                                >
                                                    {item.voteCount}
                                                </Box>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </MainCard>



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
        </>
    );
};

export default ElectionFinalResultPage;
