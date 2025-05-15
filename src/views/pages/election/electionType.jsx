import { useState } from 'react';
import { useDispatch } from 'store';
import React from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

import LinkIcon from '@mui/icons-material/Link';
import userService from 'services/userService';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
    electionName: yup.string().required('Election Name is required.'),
});

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionTypeSetup = () => {
    const dispatch = useDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogType, setDialogType] = useState('success');

    const handleDialogClose = () => setDialogOpen(false);

    const formik = useFormik({
        initialValues: {
            electionName: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await userService.saveElectionType(values);
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
                    : error.response?.data?.message || 'Failed to save election type.'
                );
                setDialogType('error');
                setDialogOpen(true);
            }
        }
    });

    return (
        <>
            <MainCard
                title="Election Type Setup"
                secondary={<SecondaryAction icon={<LinkIcon fontSize="small" />} link="https://formik.org/docs/examples/with-material-ui" />}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="electionName"
                            name="electionName"
                            label="Election Name"
                            value={formik.values.electionName}
                            onChange={formik.handleChange}
                            error={formik.touched.electionName && Boolean(formik.errors.electionName)}
                            helperText={formik.touched.electionName && formik.errors.electionName}
                        />
                    </Grid>

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

export default ElectionTypeSetup;


