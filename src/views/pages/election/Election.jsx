// material-ui
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// project imports
import NationalAssemblyImg from 'assets/images/National Assembly.png';
import NationalCouncilImg from 'assets/images/nationa Council.png';
import LocalGovtImg from 'assets/images/Local Oovernment.png';
import VoteIcon from 'assets/images/VoteIcon.png';

import MainCard from 'ui-component/cards/MainCard';
import NormalLoadingPage from 'common/NormalLoadingPage';
import voteService from 'services/vote.service';

const Election = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElectionTypes = async () => {
            try {
                const response = await voteService.getElectionType(); // Make sure this method exists
                if (response.status === 200) {
                    setElectionTypes(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch election types:', error);
            }
        };

        fetchElectionTypes();
    }, []);

    const handleCardClick = (election) => {
        navigate('/vote-ndi-qr', {
            state: { electionId: election.id }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Simulate 500ms loading time

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <NormalLoadingPage />;
    }
    
    return (
        <>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
                {electionTypes.map((election) => (
                    <Grid item xs={12} sm={6} md={3} key={election.id}>
                        <MainCard
                            onClick={() => handleCardClick(election)}
                            sx={{
                                height: 150,
                                transition: 'box-shadow 0.5s',
                                cursor: 'pointer',
                                '&:hover': { boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }
                            }}
                        >
                            <Box display={'flex'} flexDirection="column" alignItems="center" gap={2}>
                                <img src={election.image} alt={election.label} height="20%" width="20%" />
                                <Typography variant="body1" sx={{ fontSize: { md: '15px' }, color: '#000000' }}>
                                    {election.label}
                                    </Typography>
                                <img src={VoteIcon} alt={election.electionName} height="20%" width="20%" />
                                <Typography variant="body1" sx={{ fontSize: { md: '17px' }, color: '#000000' }}>
                                    {election.electionName}
                                </Typography>
                            </Box>
                        </MainCard>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Election;
