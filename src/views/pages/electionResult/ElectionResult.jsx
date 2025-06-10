import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../landing/Footer';
// project imports
import VoteIcon from 'assets/images/VoteIcon.png';
import NormalLoadingPage from 'common/NormalLoadingPage';
import MainCard from 'ui-component/cards/MainCard';

import electionSetupService from 'services/electionSetup.service';

const ElectionResult = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [electionTypes, setElectionTypes] = useState([]);

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
        navigate('/electionResult/result', {
            state: {
                electionTypeId: election.electionTypeId,
                electionId: election.id,
                electionName: election.electionName,
                electionTypeName: election.electionTypeName
            }
        });
    };

    if (loading) {
        return <NormalLoadingPage />;
    }

    return (
        <>
            <MainCard>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
                    {electionTypes.map((election) => (
                        <Grid key={election.id} item xs={12} sm={6} md={3}>
                            <MainCard
                                onClick={() => handleCardClick(election)}
                                sx={{
                                    height: {
                                        xs: 200,
                                        sm: 200,
                                        md: 200,
                                        lg: 200,
                                        xl: 200
                                    },
                                    border: '2px solid #002B69',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.5s',
                                    '&:hover': {
                                        boxShadow: '0px 10px 20px #002B69'
                                    }
                                }}
                            >
                                <Box sx={{ textDecoration: 'none' }} display={'flex'} flexDirection="column" alignItems="center" gap={2}>
                                    <img src={VoteIcon} alt={election.electionName} height="20%" width="20%" />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: {
                                                xs: '13px',
                                                sm: '10px',
                                                md: '17px',
                                                lg: '15px',
                                                xl: '1rem'
                                            },
                                            color: '#000000'
                                        }}
                                    >
                                        {election.electionTypeName}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: {
                                                xs: '13px',
                                                sm: '10px',
                                                md: '17px',
                                                lg: '15px',
                                                xl: '1rem'
                                            },
                                            color: '#000000'
                                        }}
                                    >
                                        {election.electionName}
                                    </Typography>
                                </Box>
                            </MainCard>
                        </Grid>
                    ))}
                </Grid>
                <Footer />
            </MainCard>
        </>
    );
};

export default ElectionResult;
