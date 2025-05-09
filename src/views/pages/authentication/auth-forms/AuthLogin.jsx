import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BUTTON_ADD_COLOR, TITLE } from 'common/color';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import CustomAlert from 'common/widget/custom_alert';
import useAuth from 'hooks/useAuth';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }) => {
    const theme = useTheme();

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
        <Formik
            initialValues={{
                email: '',
                password: '',
                // email: 'info@codedthemes.com',
                // password: '123456',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                // email: Yup.string().email('Must be a valid email').max(255).required('Username is required'),
                email: Yup.string().max(255).required('Username is required'),
                password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                let response = await login(values.email, values.password, navigate);

                if (response.response.status === 403) {
                    setStatus({ success: false });
                    setErrors({ submit: response.message });
                } else if (response.response.data.status === 404) {
                    setStatus({ success: false });
                    setErrors({
                        submit: response.response.data.message
                    });
                } else {
                    setStatus({ success: false });
                    setErrors({ submit: 'Error occurred!.' });
                }
            }}
            // onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            //     try {
            //         const response = await login(values.email, values.password, navigate);

            //         // Assume successful login navigates, or handle it here if needed
            //         setStatus({ success: true });
            //     } catch (error) {
            //         console.error('Login error:', error);

            //         const status = error?.response?.status;
            //         const message = error?.response?.data?.message || 'Error occurred!';

            //         setStatus({ success: false });

            //         if (status === 403) {
            //             setErrors({ submit: message });
            //         } else if (status === 404) {
            //             setErrors({ submit: message });
            //         } else {
            //             setErrors({ submit: message });
            //         }
            //     }
            // }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-login">Username / email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-login"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-login"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            inputProps={{}}
                            label="Password"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <CustomAlert alert={alert} setAlert={setAlert} />

                    <Grid container alignItems="center" justifyContent="flex-end">
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                component={Link}
                                to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/forgot'}
                                color={TITLE}
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography>
                        </Grid>
                    </Grid>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit} </FormHelperText>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                sx={{
                                    background: BUTTON_ADD_COLOR,
                                    '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                }}
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign In
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

JWTLogin.propTypes = {
    loginProp: PropTypes.number
};

export default JWTLogin;
