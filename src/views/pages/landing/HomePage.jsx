// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ThemeMode } from 'config';
import Login from '../authentication/authentication3/HomeLogin';

// =============================|| LANDING MAIN ||============================= //

const Landing = () => {
    const theme = useTheme();

    return (
        <>
            {/* 1. header and hero section */}
            <Box
                id="home"
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'clip',
                    background:
                        theme.palette.mode === ThemeMode.DARK
                            ? theme.palette.background.default
                            : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`
                }}
            >
                {/* <AppBar /> */}
                {/* <HeaderSection /> */}
                <Login />
            </Box>

         
            {/* <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
                <CardSection />
            </Box> */}

           
        </>
    );
};

export default Landing;
