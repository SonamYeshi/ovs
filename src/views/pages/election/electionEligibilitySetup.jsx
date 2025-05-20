import { useState, useEffect } from 'react';
import { useDispatch } from 'store';
import React from 'react';
import { Button, Box, Divider, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel2 from 'ui-component/extended/Form/InputLabel';
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
import globalLib from 'common/global-lib';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';
import AddIcon from '@mui/icons-material/Add';
import voteService from 'services/vote.service';
import { MaterialReactTable } from 'material-react-table';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LinkIcon from '@mui/icons-material/Link';
import userService from 'services/userService';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
    electionTypeId: yup.string().required('Election Type is required.'),
    dzongkhag: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['1', '2', '3', '4'].includes(electionTypeId) ? schema.required('Dzongkhag is required.') : schema;
    }),
    gewog: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['1', '3', '4'].includes(electionTypeId) ? schema.required('Gewog is required.') : schema;
    }),
    village: yup.string().when('electionTypeId', (electionTypeId, schema) => {
        return ['3', '4'].includes(electionTypeId) ? schema.required('Village is required.') : schema;
    }),
    minAge: yup.string().required('Minimum age requirement is required.')
});

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionEligibilitySetup = () => {
    const dispatch = useDispatch();
    const [electionTypes, setElectionTypes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eligibilitySetup, setEligibilitySetup] = useState([]);
    const [deleteDialogOpenForEligibilitySetup, setDeleteDialogOpenForEligibilitySetup] = useState(false);
    const [eligibilitySetupToDelete, setEligibilitySetupToDelete] = useState(null);

    const handleClickOpen = () => setDialogOpen(true);

    useEffect(() => {
        const fetchElectionTypes = async () => {
            try {
                const response = await voteService.getElectionType();
                setElectionTypes(response.data);
            } catch (error) {
                console.error('Failed to fetch election types', error);
            }
        };

        fetchElectionTypes();
    }, []);

    const { values, handleSubmit, setFieldValue, touched, errors, resetForm } = useFormik({
        initialValues: {
            electionTypeId: '',
            dzongkhag: '',
            gewog: '',
            village: '',
            minAge: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    isbuyer: true
                };
                const response = await userService.saveElectionEligibility(payload);
                if (response.status === 200) {
                    globalLib.successMsg(response.data);
                    getAllEligibilityCriteria();
                    resetForm();
                    setDialogOpen(false);
                }
            } catch (error) {
                globalLib.warningMsg(error.response?.data?.message);
            }
        }
    });

    const electionType = values.electionTypeId.toString();

    const showDzongkhag = electionType !== '';
    const showGewog = electionType === '1' || electionType === '3' || electionType === '4'; // NA,NC
    const showVillage = electionType === '3' || electionType === '4'; // NC,LG etc..

    const getAllEligibilityCriteria = async () => {
        try {
            const response = await voteService.getAllEligibilityCriteria();
            if (response.status === 200) {
                setEligibilitySetup(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };
    useEffect(() => {
        getAllEligibilityCriteria();
    }, []);

    const handleEditClick = (row) => {
        resetForm();
        setFieldValue('id', row.id);
        setFieldValue('electionTypeId', row.electionType?.id || '');
        setFieldValue('dzongkhag', row.dzongkhag);
        setFieldValue('gewog', row.gewog);
        setFieldValue('village', row.village);
        setDialogOpen(true);
    };

    const handleDeleteClick = (election) => {
        setEligibilitySetupToDelete(election);
        setDeleteDialogOpenForEligibilitySetup(true);
    };
    const confirmDeleteEligibilitySetup = async () => {
        if (!eligibilitySetupToDelete) return;
        try {
            const response = await voteService.deleteEligibilityCriteria(eligibilitySetupToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                getAllEligibilityCriteria();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete Candidate.');
        } finally {
            setDeleteDialogOpenForEligibilitySetup(false);
            setEligibilitySetupToDelete(null);
        }
    };

    return (
        <>
            <MainCard>
                <Box>
                    <Box display="flex" justifyContent="flex-end" mb={4}>
                        <Button
                            sx={{
                                background: BUTTON_ADD_COLOR,
                                '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                            }}
                            size="large"
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                resetForm();
                                handleClickOpen();
                            }}
                        >
                            Add Election Eligibility Setup
                        </Button>
                    </Box>
                    <MaterialReactTable
                        columns={[
                            {
                                accessorKey: 'id',
                                header: 'SL.No.',
                                size: 20,
                                Cell: ({ row }) => row.index + 1
                            },
                            { accessorKey: 'electionTypeId', header: 'Election Type', size: 10 },

                            { accessorKey: 'dzongkhag', header: 'Dzongkhag', size: 10 },
                            { accessorKey: 'gewog', header: 'Gewog', size: 10 },
                            { accessorKey: 'village', header: 'Village', size: 10 }
                        ]}
                        data={eligibilitySetup ?? []}
                        // data={eligibilitySetup}
                        enableColumnFilter
                        enableRowActions
                        positionActionsColumn="last"
                        enableColumnActions
                        enableSorting
                        renderRowActions={({ row }) => (
                            <Box display="flex" sx={{ gap: 1.5 }}>
                                <IconButton
                                    sx={{
                                        color: BUTTON_VIEW_COLOR,
                                        '&:hover': {
                                            transform: 'scale(0.95)',
                                            transition: 'transform 0.2s ease-in-out'
                                        },
                                        borderRadius: 2,
                                        padding: 1,
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => handleEditClick(row.original)}
                                >
                                    <EditTwoToneIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    sx={{
                                        color: BUTTON_CANCEL_COLOR,
                                        '&:hover': {
                                            transform: 'scale(0.95)',
                                            transition: 'transform 0.2s ease-in-out'
                                        },
                                        borderRadius: 2,
                                        padding: 1,
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => handleDeleteClick(row.original)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    />

                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md" TransitionComponent={Transition}>
                        <DialogTitle>Add Election Eligibility Setup</DialogTitle>
                        <DialogContent dividers>
                            <form id="election-setup-form" onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>
                                    {/* -- Election Type Field -- */}
                                    <Grid item sm={12} xs={12} md={6}>
                                        <InputLabel id="election">Election Type</InputLabel>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="electionTypeId"
                                                id="electionTypeId"
                                                name="electionTypeId"
                                                size="small"
                                                value={values.electionTypeId}
                                                onChange={(e) => setFieldValue('electionTypeId', e.target.value)}
                                            >
                                                <MenuItem value="">
                                                    <em>Select</em>
                                                </MenuItem>
                                                {electionTypes.map((type) => (
                                                    <MenuItem key={type.id} value={type.id}>
                                                        {type.electionName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.electionTypeId && <FormHelperText error>{errors.electionTypeId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* -- Age Field -- */}
                                    <Grid item sm={12} xs={12} md={6}>
                                        <InputLabel>Minimum Age</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="minAge"
                                            name="minAge"
                                            size="small"
                                            value={values.minAge}
                                            onChange={(e) => setFieldValue('minAge', e.target.value)}
                                            error={touched.minAge && Boolean(errors.minAge)}
                                            helperText={touched.minAge && errors.minAge}
                                        />
                                    </Grid>

                                    {showDzongkhag && (
                                        <Grid item xs={12}>
                                            <Divider />
                                            <Typography variant="h4" sx={{ mt: 2 }}>
                                                Permanent Address
                                            </Typography>
                                        </Grid>
                                    )}

                                    {showDzongkhag && (
                                        <Grid item xs={6}>
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                label="Dzongkhag"
                                                value={values.dzongkhag}
                                                onChange={(e) => setFieldValue('dzongkhag', e.target.value)}
                                            >
                                                <MenuItem value="">
                                                    <em>Select</em>
                                                </MenuItem>
                                                <MenuItem value="Thimphu">Thimphu</MenuItem>
                                                <MenuItem value="Pemagatshel">Pemagatshel</MenuItem>
                                                <MenuItem value="Trashigang">Trashigang</MenuItem>
                                                <MenuItem value="Mongar">Mongar</MenuItem>
                                                <MenuItem value="Samdrupjongkhar">Samdrupjongkhar</MenuItem>
                                            </TextField>
                                            {errors.dzongkhag && <FormHelperText error>{errors.dzongkhag}</FormHelperText>}
                                        </Grid>
                                    )}

                                    {showGewog && (
                                        <Grid item xs={6}>
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                label="Gewog"
                                                value={values.gewog}
                                                onChange={(e) => setFieldValue('gewog', e.target.value)}
                                            >
                                                <MenuItem value="">
                                                    <em>Select</em>
                                                </MenuItem>
                                                <MenuItem value="Nanong">Nanong</MenuItem>
                                                <MenuItem value="Chang">Chang</MenuItem>
                                                <MenuItem value="Lingmithang">Lingmithang</MenuItem>
                                                <MenuItem value="Martshala">Martshala</MenuItem>
                                            </TextField>
                                            {errors.gewog && <FormHelperText error>{errors.gewog}</FormHelperText>}
                                        </Grid>
                                    )}

                                    {showVillage && (
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Village"
                                                size="small"
                                                value={values.village}
                                                onChange={(e) => setFieldValue('village', e.target.value)}
                                                error={touched.village && Boolean(errors.village)}
                                                helperText={touched.village && errors.village}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                            <Button
                                type="submit"
                                form="election-setup-form"
                                variant="contained"
                                sx={{ background: BUTTON_ADD_COLOR, '&:hover': { backgroundColor: BUTTON_ADD_COLOR } }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setDialogOpen(false)}
                                sx={{
                                    background: BUTTON_CANCEL_COLOR,
                                    '&:hover': { backgroundColor: BUTTON_CANCEL_COLOR }
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={deleteDialogOpenForEligibilitySetup}
                        onClose={() => setDeleteDialogOpenForEligibilitySetup(false)}
                        keepMounted
                    >
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography textAlign={'center'}>Are you sure you want to delete this Eligibility Setup?</Typography>
                        </DialogContent>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setDeleteDialogOpenForEligibilitySetup(false)}
                                sx={{ color: '#002B69' }}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => confirmDeleteEligibilitySetup()} color="error" variant="outlined">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </MainCard>
        </>
    );
};

export default ElectionEligibilitySetup;
