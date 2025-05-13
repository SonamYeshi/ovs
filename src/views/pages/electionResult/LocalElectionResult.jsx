import { Box, Chip } from '@mui/material';
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
import voteService from 'services/vote.service';

const LocalElectionResult = () => {
    const [candidates, setCandidates] = useState([]);

    const getVoteResult = async () => {
        try {
            const response = await voteService.getVoteResult();
            if (response.data !== '') {
                setCandidates(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch vote result:', error);
        }
    };

    useEffect(() => {
        getVoteResult();
    }, []);
    return (
        <>
            <Box mt={4}>
                <Typography variant="h2" align="center" fontWeight="bold" sx={{ color: TITLE, mb: 2 }}>
                    Local Government Election Result
                </Typography>
            </Box>
            <Box
                mt={1}
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Paper elevation={3} sx={{ borderRadius: 4, p: 3, width: '90%', maxWidth: 800 }}>
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
                                    <TableRow key={item.id}>
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
        </>
    );
};

export default LocalElectionResult;
