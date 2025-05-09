import React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const CandidatesPage = () => {
    const location = useLocation();
    const { cid } = location.state || {};
    const dummyCandidates = [
        { name: 'Candidate A' },
        { name: 'Candidate B' },
        { name: 'Candidate C' },
        { name: 'Candidate D' },
    ];

    return (
        <Box sx={{ padding: 2 }}>
            {dummyCandidates ? (
                <div>
                    <Typography variant="h6">List of Candidates</Typography>
                    <List>
                        {dummyCandidates.map((candidate, index) => (
                            <ListItem key={index}>
                                <Typography>{candidate.name}</Typography> {/* Adjust this based on the structure */}
                            </ListItem>
                        ))}
                    </List>
                </div>
            ) : (
                <Typography variant="h6" color="error">
                    No candidates found or an error occurred.
                </Typography>
            )}
        </Box>
    );
};

export default CandidatesPage;
