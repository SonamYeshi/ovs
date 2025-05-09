// material-ui
import { Divider, MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthRegister from '../auth-forms/AuthRegister';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppConstant from 'utils/AppConstant';
import {
    mobileOfficialErrMsg,
    mobileOfficialRegex,
    passErrMsg,
    passRegex,
    cidRegex,
    cidErrMsg,
    emailErrMsg,
    emailRegex
} from 'utils/global-lib';

// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { isLoggedIn } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const { register } = useAuth();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    const { values, handleSubmit, setFieldValue, touched, errors, setErrors } = useFormik({
        initialValues: {
            empId: '',
            cid: '',
            email: '',
            gender: '',
            fullName: '',
            company: '',
            mobileNo: '',
            password: '',
            confirmPassword: '',
            status: ''
        },
        onSubmit: () => {
            save(values);
        },
        validationSchema: Yup.object().shape({
            empId: Yup.string().required(AppConstant().REQUIRED_FIELD).max(10, AppConstant().CHARACTER_LENGTH),
            cid: Yup.string().matches(cidRegex, cidErrMsg).required(AppConstant().REQUIRED_FIELD),
            fullName: Yup.string().required(AppConstant().REQUIRED_FIELD),
            email: Yup.string().matches(emailRegex, emailErrMsg).required(AppConstant().REQUIRED_FIELD),
            gender: Yup.string().required(AppConstant().REQUIRED_FIELD),
            company: Yup.string().required(AppConstant().REQUIRED_FIELD),
            mobileNo: Yup.string().matches(mobileOfficialRegex, mobileOfficialErrMsg).required(AppConstant().REQUIRED_FIELD),
            password: Yup.string().matches(passRegex, passErrMsg).required(AppConstant().REQUIRED_FIELD),
            confirmPassword: Yup.string()
                .required(AppConstant().REQUIRED_FIELD)
                .oneOf([Yup.ref('password'), null], 'Confirm password must match with password'),
            status: Yup.string().required(AppConstant().REQUIRED_FIELD)
        })
    });

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#" aria-label="theme logo">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={{ xs: 'column-reverse', md: 'row' }}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                        Sign up
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={{ xs: 'center', md: 'inherit' }}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={{ xs: 0, sm: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label=" Employee ID"
                                                    size="small"
                                                    required
                                                    value={values.empId}
                                                    onChange={(e) => setFieldValue('empId', e.target.value)}
                                                    helperText={touched.empId && errors.empId}
                                                    error={Boolean(errors.empId && touched.empId)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label=" Full Name"
                                                    size="small"
                                                    required
                                                    type="text"
                                                    value={values.fullName}
                                                    onChange={(e) => setFieldValue('fullName', e.target.value)}
                                                    helperText={touched.fullName && errors.fullName}
                                                    error={Boolean(errors.fullName && touched.fullName)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label=" CID"
                                                    size="small"
                                                    required
                                                    type="number"
                                                    value={values.cid}
                                                    onChange={(e) => setFieldValue('cid', e.target.value)}
                                                    helperText={touched.cid && errors.cid}
                                                    error={Boolean(errors.cid && touched.cid)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        select
                                                        label="Gender"
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        value={values.gender}
                                                        onChange={(e) => setFieldValue('gender', e.target.value)}
                                                        helperText={touched.gender && errors.gender}
                                                        error={Boolean(errors.gender && touched.gender)}
                                                    >
                                                        <MenuItem value="F">Female</MenuItem>
                                                        <MenuItem value="M">Male</MenuItem>
                                                    </TextField>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label=" Email"
                                                    size="small"
                                                    required
                                                    type="email"
                                                    value={values.email}
                                                    onChange={(e) => setFieldValue('email', e.target.value)}
                                                    helperText={touched.email && errors.email}
                                                    error={Boolean(errors.email && touched.email)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label=" Mobile No."
                                                    size="small"
                                                    required
                                                    type="number"
                                                    value={values.mobileNo}
                                                    onChange={(e) => setFieldValue('mobileNo', e.target.value)}
                                                    helperText={touched.mobileNo && errors.mobileNo}
                                                    error={Boolean(errors.mobileNo && touched.mobileNo)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        select
                                                        label="Status"
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        value={values.status}
                                                        onChange={(e) => setFieldValue('status', e.target.value)}
                                                        helperText={touched.status && errors.status}
                                                        error={Boolean(errors.status && touched.status)}
                                                    >
                                                        <MenuItem value="A">Active</MenuItem>
                                                        <MenuItem value="I">Inactive</MenuItem>
                                                    </TextField>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        select
                                                        label="Company"
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        value={values.company}
                                                        onChange={(e) => setFieldValue('company', e.target.value)}
                                                        helperText={touched.company && errors.company}
                                                        error={Boolean(errors.company && touched.company)}
                                                    >
                                                        <MenuItem value="A">Company A</MenuItem>
                                                    </TextField>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password-register"
                                                type={showPassword ? 'text' : 'password'}
                                                value={values.password}
                                                name="password"
                                                label="Password"
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
                                            />
                                            {touched.password && errors.password && (
                                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                                    {errors.password}
                                                </FormHelperText>
                                            )}
                                        </FormControl>

                                        {strength !== 0 && (
                                            <FormControl fullWidth>
                                                <Box sx={{ mb: 2 }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <Box
                                                                sx={{
                                                                    width: 85,
                                                                    height: 8,
                                                                    borderRadius: '7px',
                                                                    bgcolor: level?.color
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                                {level?.label}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </FormControl>
                                        )}

                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={(event) => setChecked(event.target.checked)}
                                                            name="checked"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="subtitle1">
                                                            Agree with &nbsp;
                                                            <Typography variant="subtitle1" component={Link} to="#">
                                                                Terms & Condition.
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        {errors.submit && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}

                                        <Box sx={{ mt: 2 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="secondary"
                                                >
                                                    Sign up
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={Link}
                                                to={isLoggedIn ? '/pages/login/login3' : '/login'}
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Already have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid> */}
            </Grid>
        </AuthWrapper1>
    );
};

export default Register;
