import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

// project imports
import VoteIcon from 'assets/images/VoteIcon.png';
import NationalAssemblyImg from 'assets/images/National Assembly.png';
import NationalCouncilImg from 'assets/images/nationa Council.png';
import LocalGovtImg from 'assets/images/Local Oovernment.png';
import NormalLoadingPage from 'common/NormalLoadingPage';
import MainCard from 'ui-component/cards/MainCard';

import electionSetupService from 'services/electionSetup.service';

const electionCards = [
    {
        id: 1,
        title: 'Local Government Elections',
        img: LocalGovtImg,
        link: '/localElectionResult'
    },
    {
        id: 2,
        title: 'National Assembly Elections',
        img: NationalCouncilImg,
        link: '/localElectionResult'
    },
    {
        id: 3,
        title: 'National Council Elections',
        img: NationalAssemblyImg,
        link: '/localElectionResult'
    },
    {
        id: 4,
        title: 'Bye-Elections',
        img: VoteIcon,
        link: '/localElectionResult'
    }
];

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
        navigate('/localElectionResult', { 
            state: { electionTypeId: election.electionTypeId
                , electionId: election.id
             } 
        });
    };

    if (loading) {
        return <NormalLoadingPage />;
    }

    return (
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
                            cursor: 'pointer',
                            transition: 'box-shadow 0.5s',
                            '&:hover': { boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }
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
    );
};

export default ElectionResult;


