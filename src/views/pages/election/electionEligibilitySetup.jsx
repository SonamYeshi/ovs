import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Autocomplete, Box, Button, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';
import globalLib from 'common/global-lib';
import { useFormik } from 'formik';
import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import commonService from 'services/commonService';
import electionRuleService from 'services/electionRule.service';
import electionSetupService from 'services/electionSetup.service';
import userService from 'services/userService';
import voteService from 'services/vote.service';
import MainCard from 'ui-component/cards/MainCard';
import AppConstant from 'utils/AppConstant';
import * as Yup from 'yup';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionEligibilitySetup = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [parameterList, setParameterList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eligibilitySetup, setEligibilitySetup] = useState([]);
    const [deleteDialogOpenForEligibilitySetup, setDeleteDialogOpenForEligibilitySetup] = useState(false);
    const [eligibilitySetupToDelete, setEligibilitySetupToDelete] = useState(null);
    const [electionNameList, setElectionNameList] = useState([]);
    const [dzongkhags, setDzongkhags] = useState([]);
    const [gewogLists, setGewogLists] = useState([]);
    const [villageLists, setVillageLists] = useState([]);

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
            id: '',
            electionTypeId: '',
            electionId: '',
            dzongkhag: '',
            gewog: '',
            village: '',
            status: ''
        },
        validationSchema: () =>
            Yup.object().shape({
                electionTypeId: Yup.string().required(AppConstant().REQUIRED_FIELD),
                electionId: Yup.string().required(AppConstant().REQUIRED_FIELD),
                dzongkhag: parameterList?.dzongkhags ? Yup.string().required('Dzongkhag is required') : Yup.string().nullable(),
                gewog: parameterList?.gewogs ? Yup.string().required('Gewog is required') : Yup.string().nullable(),
                village: parameterList?.villages ? Yup.string().required('Village is required') : Yup.string().nullable()
            }),
        validateOnChange: true,
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const response = await userService.saveElectionEligibility(values);
                if (response.status === 200) {
                    globalLib.successMsg(response.data);
                    getAllEligibilityCriteria();
                    resetForm();
                    setDialogOpen(false);
                }
            } catch (error) {
                console.log(error.response);
                globalLib.warningMsg(error.response.data);
                setDialogOpen(false);
            }
        }
    });

    const getAllEligibilityCriteria = async () => {
        try {
            const response = await userService.getAllEligibilityCriteria();
            if (response.status === 200) {
                setEligibilitySetup(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch Eligibility Criteria:', error);
        }
    };

    const getAllDzongkhags = async () => {
        try {
            const response = await commonService.getAllDzongkhags();
            setDzongkhags(response.data);
        } catch (error) {
            console.error('Failed to fetch dzongkhag', error);
        }
    };

    const getAllGewogsByDzoId = async (dzongkhag_id) => {
        try {
            const response = await commonService.getAllGewogsByDzoId(dzongkhag_id);
            if (response.data) {
                setGewogLists(response.data);
            }
        } catch (error) {
            console.error('Error fetching gewog list:', error);
        }
    };
    const getAllVillagesByGewogId = async (gewog_id) => {
        try {
            const response = await commonService.getAllVillagesByGewogId(gewog_id);
            if (response.data) {
                setVillageLists(response.data);
            }
        } catch (error) {
            console.error('Error fetching village list:', error);
        }
    };

    const handleEditClick = async (row) => {
        resetForm();
        await getElectionByElectionType(row.electionTypeId);
        await getAllGewogsByDzoId(row.dzongkhag);
        await getAllVillagesByGewogId(row.gewog);
        setFieldValue('id', row.id);
        setFieldValue('electionTypeId', row.electionTypeId);
        setFieldValue('electionId', row.electionId);
        setFieldValue('dzongkhagName', row.dzongkhagName);
        setFieldValue('gewogName', row.gewogName);
        setFieldValue('villageName', row.villageName);
        setFieldValue('dzongkhag', row.dzongkhag);
        setFieldValue('gewog', row.gewog);
        setFieldValue('village', row.village);

        // Important: Fetch parameters to enable conditional fields
        await getElectionRuleByElection(row.electionTypeId, row.electionId);

        setDialogOpen(true);
    };

    const handleDeleteClick = (electionId) => {
        setEligibilitySetupToDelete(electionId);
        setDeleteDialogOpenForEligibilitySetup(true);
    };
    const confirmDeleteEligibilitySetup = async () => {
        if (!eligibilitySetupToDelete) return;
        try {
            const response = await userService.deleteEligibilityCriteria(eligibilitySetupToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                getAllEligibilityCriteria();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete Rule.');
        } finally {
            setDeleteDialogOpenForEligibilitySetup(false);
            setEligibilitySetupToDelete(null);
        }
    };

    const getElectionByElectionType = async (electionTypeId) => {
        try {
            const response = await electionSetupService.getElectionByElectionType(electionTypeId);
            if (Array.isArray(response.data)) {
                setElectionNameList(response.data);
            } else {
                setElectionNameList([]);
            }
        } catch (error) {
            setElectionNameList([]);
        }
    };

    const getElectionRuleByElection = async (electionTypeId, electionId) => {
        try {
            const response = await electionRuleService.getElectionRuleByElection(electionTypeId, electionId);

            if (response.data) {
                setParameterList(response.data);
            }
        } catch (error) {
            console.error('Error fetching election ', error);
        }
    };

    useEffect(() => {
        getAllEligibilityCriteria();
        // getElectionByElectionType();
        // getElectionRuleByElection();
        getAllDzongkhags();
        // getAllGewogsByDzoId();
        // getAllVillagesByGewogId();
    }, []);

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
                                setParameterList([]);
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
                            { accessorKey: 'electionTypeName', header: 'Election Type', size: 10 },
                            { accessorKey: 'electionName', header: 'Election Name', size: 10 },

                            {
                                accessorKey: 'dzongkhagName',
                                header: 'Dzongkhag',
                                size: 10
                            },
                            {
                                accessorKey: 'gewogName',
                                header: 'Gewog',
                                size: 10
                            },
                            {
                                accessorKey: 'villageName',
                                header: 'Village',
                                size: 10
                            }
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

                                {/* <IconButton
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
                                </IconButton> */}
                            </Box>
                        )}
                    />

                    <Dialog
                        open={dialogOpen}
                        onClose={(event, reason) => {
                            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                setDialogOpen(false);
                            }
                        }}
                        fullWidth
                        maxWidth="sm"
                        TransitionComponent={Transition}
                    >
                        <DialogTitle>Add Election Eligibility</DialogTitle>
                        <DialogContent dividers>
                            <form id="election-setup-form" onSubmit={handleSubmit}>
                                <Grid container spacing={1}>
                                    {/* -- Election Type Field -- */}
                                    <Grid item sm={12} xs={12} md={12}>
                                        <InputLabel id="election">Election Type</InputLabel>

                                        <TextField
                                            size="small"
                                            fullWidth
                                            select
                                            value={values.electionTypeId}
                                            onChange={async (e) => {
                                                const selectedId = e.target.value;
                                                setFieldValue('electionTypeId', selectedId);
                                                setFieldValue('electionId', '');
                                                setFieldValue('dzongkhag', '');
                                                setFieldValue('gewog', '');
                                                setFieldValue('village', '');
                                                setElectionNameList([]);
                                                setParameterList([]);
                                                await getElectionByElectionType(selectedId);
                                            }}
                                            error={touched.electionTypeId && Boolean(errors.electionTypeId)}
                                            helperText={touched.electionTypeId && errors.electionTypeId}
                                        >
                                            {electionTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.electionName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    <Grid item sm={12} xs={12} md={12}>
                                        <InputLabel id="electionName">Election Name</InputLabel>

                                        <TextField
                                            size="small"
                                            select
                                            fullWidth
                                            value={values.electionId}
                                            onChange={async (e) => {
                                                const selectedElectionId = e.target.value;
                                                const selectedElectionTypeId = values.electionTypeId; // still current value

                                                setFieldValue('electionId', selectedElectionId);

                                                if (selectedElectionTypeId && selectedElectionId) {
                                                    await getElectionRuleByElection(selectedElectionTypeId, selectedElectionId);
                                                }
                                            }}
                                            error={touched.electionId && Boolean(errors.electionId)}
                                            helperText={touched.electionId && errors.electionId}
                                        >
                                            {Array.isArray(electionNameList) &&
                                                electionNameList.map((type) => (
                                                    <MenuItem key={type.id} value={type.id}>
                                                        {type.electionName}
                                                    </MenuItem>
                                                ))}
                                        </TextField>
                                    </Grid>
                                    <Box p={2}>
                                        <Typography variant="h4">Permanent Address</Typography>
                                    </Box>
                                    <Grid item xs={12}>
                                        {parameterList.dzongkhags && (
                                            <Box>
                                                <InputLabel>Dzongkhag</InputLabel>
                                                <Autocomplete
                                                    size="small"
                                                    fullWidth
                                                    options={dzongkhags}
                                                    getOptionLabel={(option) => option.dzongkhag || ''}
                                                    value={dzongkhags.find((dz) => dz.id === values.dzongkhag) || null}
                                                    onChange={async (event, newValue) => {
                                                        const selectedId = newValue?.id || null;
                                                        setFieldValue('dzongkhag', selectedId);
                                                        setFieldValue('gewog', '');
                                                        setGewogLists([]);
                                                        if (selectedId) {
                                                            await getAllGewogsByDzoId(selectedId);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={touched.dzongkhag && Boolean(errors.dzongkhag)}
                                                            helperText={touched.dzongkhag && errors.dzongkhag}
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {parameterList.gewogs && (
                                            <Box>
                                                <InputLabel>Gewog</InputLabel>

                                                <Autocomplete
                                                    size="small"
                                                    fullWidth
                                                    options={gewogLists}
                                                    getOptionLabel={(option) => option.gewog || ''}
                                                    value={gewogLists.find((g) => g.id === values.gewog) || null}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            setFieldValue('gewog', newValue.id);
                                                            setFieldValue('village', '');
                                                            setVillageLists([]);
                                                            getAllVillagesByGewogId(newValue.id);
                                                        } else {
                                                            setFieldValue('gewog', '');
                                                            setVillageLists([]);
                                                            setFieldValue('village', '');
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={touched.gewog && Boolean(errors.gewog)}
                                                            helperText={touched.gewog && errors.gewog}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {parameterList.villages && (
                                            <Box>
                                                {' '}
                                                <InputLabel>Village</InputLabel>
                                                <Autocomplete
                                                    size="small"
                                                    fullWidth
                                                    options={villageLists}
                                                    getOptionLabel={(option) => option.village || ''}
                                                    value={villageLists.find((v) => v.id === values.village) || null}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            setFieldValue('village', newValue.id);
                                                        } else {
                                                            setFieldValue('village', '');
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={touched.village && Boolean(errors.village)}
                                                            helperText={touched.village && errors.village}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                            <Button
                                type="submit"
                                form="election-setup-form"
                                variant="contained"
                                sx={{ background: BUTTON_ADD_COLOR, '&:hover': { backgroundColor: BUTTON_ADD_COLOR } }}
                                onClick={handleSubmit}
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
                        onClose={(event, reason) => {
                            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                setDeleteDialogOpenForEligibilitySetup(false);
                            }
                        }}
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
