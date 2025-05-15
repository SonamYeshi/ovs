import { useState, useEffect } from 'react';
import { useDispatch } from 'store';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel2 from 'ui-component/extended/Form/InputLabel';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// assets
import LinkIcon from '@mui/icons-material/Link';
import userService from 'services/userService';

import voteService from 'services/vote.service';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
    electionTypeId: yup.string().required('Election Type is required.'),
    dzongkhag: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['1', '2', '3', '4'].includes(electionTypeId)
            ? schema.required('Dzongkhag is required.')
            : schema;
    }),
    gewog: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['1', '3',  '4'].includes(electionTypeId)
            ? schema.required('Gewog is required.')
            : schema;
    }),
    village: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['3', '4'].includes(electionTypeId)
            ? schema.required('Village is required.')
            : schema;
    }),
    minAge: yup.string().required('Minimum age requirement is required.'),
});



// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionEligibilitySetup = () => {
    const dispatch = useDispatch();
    const [electionTypes, setElectionTypes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogType, setDialogType] = useState('success');

    const handleDialogClose = () => setDialogOpen(false);

    useEffect(() => {
        const fetchElectionTypes = async () => {
            try {
                const response = await voteService.getElectionType();
                setElectionTypes(response.data); // assuming response.data is an array
            } catch (error) {
                console.error('Failed to fetch election types', error);
            }
        };
    
        fetchElectionTypes();
    }, []);

    const formik = useFormik({
        initialValues: {
            electionTypeId: '',
            dzongkhag: '',
            gewog: '',
            village: '',
            minAge: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(values)
            try {
                const payload = {
                    ...values,
                    isbuyer: true
                };
                const response = await userService.saveElectionEligibility(payload);
                if (response.status === 200) {
                    setDialogTitle('Success');
                    setDialogMessage(response.data);
                    setDialogType('success');
                    setDialogOpen(true);
                    resetForm();
                }
            } catch (error) {
                setDialogTitle('Error');
                setDialogMessage(error.code === 'ERR_NETWORK'
                    ? 'Please check your internet connection and try again.'
                    : error.response?.data?.message || 'Failed to save election eligibility criteria.'
                );
                setDialogType('error');
                setDialogOpen(true);
            }
        }
    });

    const electionType = formik.values.electionTypeId.toString();

    const showDzongkhag = electionType !== '';
    const showGewog = electionType === '1' || electionType === '3' || electionType === '4'; // National Assembly or LG
    const showVillage = electionType === '3' || electionType === '4'; // LG only
    
    return (
        <>
            <MainCard
                title="Election Eligibility Setup"
                secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://formik.org/docs/examples/with-material-ui" />}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <InputLabel2>Election Type</InputLabel2>
                            <FormControl fullWidth>
                                <InputLabel id="election">Election</InputLabel>
                                {/* <Select
                                    labelId="electionTypeId"
                                    id="electionTypeId"
                                    name="electionTypeId"
                                    value={formik.values.electionTypeId}
                                    onChange={formik.handleChange}
                                    label="Election Type"
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    <MenuItem value='1'>National Assembly Election</MenuItem>
                                    <MenuItem value='2'>National Council Election</MenuItem>
                                    <MenuItem value='3'>Local Government Election</MenuItem>
                                </Select> */}
                                <Select
                                    labelId="electionTypeId"
                                    id="electionTypeId"
                                    name="electionTypeId"
                                    value={formik.values.electionTypeId}
                                    onChange={formik.handleChange}
                                    label="Election Type"
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    {electionTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.electionName}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {formik.errors.electionTypeId && (
                                    <FormHelperText error>{formik.errors.electionTypeId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Age Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Age</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel2>Minimum Age</InputLabel2>
                            <TextField
                                fullWidth
                                id="minAge"
                                name="minAge"
                                label="Minimum Age"
                                value={formik.values.minAge}
                                onChange={formik.handleChange}
                                error={formik.touched.minAge && Boolean(formik.errors.minAge)}
                                helperText={formik.touched.minAge && formik.errors.minAge}
                            />
                        </Grid>

                        {/* Permanent Address Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Permanent Address</Typography>
                        </Grid>

                        {showDzongkhag && (
                            <Grid item xs={6}>
                                <InputLabel2>Dzongkhag</InputLabel2>
                                <FormControl fullWidth>
                                    <InputLabel id="dzongkhag">Dzongkhag</InputLabel>
                                    <Select
                                        labelId="dzongkhag"
                                        id="dzongkhag"
                                        name="dzongkhag"
                                        value={formik.values.dzongkhag}
                                        onChange={formik.handleChange}
                                        label="Dzongkhag"
                                    >
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                        <MenuItem value='Thimphu'>Thimphu</MenuItem>
                                        <MenuItem value='Pemagatshel'>Pemagatshel</MenuItem>
                                        <MenuItem value='Trashigang'>Trashigang</MenuItem>
                                        <MenuItem value='Mongar'>Mongar</MenuItem>
                                        <MenuItem value='Paro'>Paro</MenuItem>
                                    </Select>
                                    {formik.errors.dzongkhag && (
                                        <FormHelperText error>{formik.errors.dzongkhag}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        {showGewog && (
                            <Grid item xs={6}>
                                <InputLabel2>Gewog</InputLabel2>
                                <FormControl fullWidth>
                                    <InputLabel id="gewog">Gewog</InputLabel>
                                    <Select
                                        labelId="gewog"
                                        id="gewog"
                                        name="gewog"
                                        value={formik.values.gewog}
                                        onChange={formik.handleChange}
                                        label="Gewog"
                                    >
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                        <MenuItem value='Nanong'>Nanong</MenuItem>
                                        <MenuItem value='Chang'>Chang</MenuItem>
                                        <MenuItem value='Lingmithang'>Lingmithang</MenuItem>
                                        <MenuItem value='Zobel'>Zobel</MenuItem>
                                    </Select>
                                    {formik.errors.gewog && (
                                        <FormHelperText error>{formik.errors.gewog}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        {showVillage && (
                            <Grid item xs={6}>
                                <InputLabel2>Village</InputLabel2>
                                <TextField
                                    fullWidth
                                    id="village"
                                    name="village"
                                    label="Village"
                                    value={formik.values.village}
                                    onChange={formik.handleChange}
                                    error={formik.touched.village && Boolean(formik.errors.village)}
                                    helperText={formik.touched.village && formik.errors.village}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="flex-end">
                                <AnimateButton>
                                    <Button variant="contained" type="submit">
                                        Save
                                    </Button>
                                </AnimateButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>

            <Dialog
                open={dialogOpen}
                TransitionComponent={Transition}
                onClose={handleDialogClose}
                fullWidth
            >
                {dialogOpen && (
                    <>
                        <DialogTitle>{dialogType === 'success' ? '✅' : '❌'} {dialogTitle}</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">{dialogMessage}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={handleDialogClose}>Cancel</Button>
                            <Button variant="contained" size="small" onClick={handleDialogClose}>Ok</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ElectionEligibilitySetup;


