import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginLogo from 'ui-component/LoginLogo';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper1 from '../AuthWrapper1';
import AuthLogin from '../auth-forms/AuthLogin';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { TITLE } from 'common/color';

// third party

// project imports
import useAuth from 'hooks/useAuth';

// assets

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { login } = useAuth();
    // const scriptedRef = useScriptRef();
    const navigate = useNavigate();

    const [checked, setChecked] = React.useState(true);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [alert, setAlert] = useState({
        show: false,
        severity: 'info',
        msg: ''
    });

    return (
        <AuthWrapper1>
            <Grid container sx={{ minHeight: '100vh' }}>
                {/* Left Panel with logo and title */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        backgroundColor: '#002D72',
                        display: {
                            xs: 'none',
                            sm: 'none',
                            md: 'flex',
                            lg: 'flex',
                            xl: 'flex'
                        },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff'
                    }}
                >
                    <LoginLogo />
                    <Typography variant="h1" sx={{ mt: 2, color: '#fff' }}>
                        Online Voting System
                    </Typography>
                </Grid>

                {/* Right Panel with login form */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <AuthCardWrapper>
                        <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h2" align="center" sx={{ color: TITLE, fontWeight: 700 }}>
                                Kuzuzangpo!
                            </Typography>
                            <Typography variant="h6" align="center">
                                Login to your Admin Dashboard
                            </Typography>
                        </Stack>

                        <Grid item xs={12}>
                            <AuthLogin />
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
