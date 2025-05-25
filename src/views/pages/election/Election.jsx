import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import VoteIcon from 'assets/images/VoteIcon.png';
import MainCard from 'ui-component/cards/MainCard';
import NormalLoadingPage from 'common/NormalLoadingPage';
import voteService from 'services/vote.service';
import electionSetupService from 'services/electionSetup.service';

const Election = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCardClick = (election) => {
        navigate('/vote-ndi-qr', {
            state: { electionId: election.id
                , electionTypeId: election.electionTypeId
             }
        });
    };

    const getResponsiveFontSize = () => {
        if (isXs) return '0.8rem';
        if (isSm) return '1rem';
        return '1.2rem';
    };

    if (loading) {
        return <NormalLoadingPage />;
    }

    return (
        <>
            <Grid container spacing={3} justifyContent="center" style={{ marginTop: '10px' }}>
                {electionTypes.map((election) => (
                    <Grid item xs={12} sm={6} md={3} key={election.id}>
                        <MainCard
                            onClick={() => handleCardClick(election)}
                            sx={{
                                height: '100%',
                                minHeight: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'box-shadow 0.5s',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box display="flex" flexDirection="column" alignItems="center" gap={1} px={1} py={2}>
                                {/* <img src={election.image} alt={election.label} style={{ height: isXs ? 40 : 50, marginBottom: 8 }} /> */}
                                
                                <img src={VoteIcon} alt="Vote Icon" style={{ height: isXs ? 60 : 70, marginTop: -25 }} />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontSize: getResponsiveFontSize(),
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        color: '#000'
                                    }}
                                >
                                    {election.electionTypeName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: getResponsiveFontSize(),
                                        fontWeight: 400,
                                        textAlign: 'center',
                                        color: '#000',
                                        mt: 1
                                    }}
                                >
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
