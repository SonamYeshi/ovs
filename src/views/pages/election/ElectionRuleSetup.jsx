import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';
import globalLib from 'common/global-lib';
import { useFormik } from 'formik';
import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import electionRuleService from 'services/electionRule.service';
import electionSetupService from 'services/electionSetup.service';
import voteService from 'services/vote.service';

import MainCard from 'ui-component/cards/MainCard';
import AppConstant from 'utils/AppConstant';
import * as Yup from 'yup';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionRuleSetup = () => {
    const [electionTypes, setElectionTypes] = useState([]);
    const [electionNames, setElectionNames] = useState([]);
    const [selectedElections, setSelectedElections] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [electionRuleSetup, setElectionRuleSetup] = useState([]);
    const [deleteDialogOpenForElectionRuleSetup, setDeleteDialogOpenForElectionRuleSetup] = useState(false);
    const [electionRuleSetupToDelete, setElectionRuleSetupToDelete] = useState(null);
    const [electionNameList, setElectionNameList] = useState([]);
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
            minAge: '18',
            electionId: '',
            dzongkhag: '',
            gewog: '',
            village: ''
        },
        validationSchema: Yup.object({
            electionTypeId: Yup.string().required(AppConstant().REQUIRED_FIELD),
            electionId: Yup.string().required(AppConstant().REQUIRED_FIELD)
        }),
        onSubmit: async (values) => {
            const mappedSelections = {
                dzongkhag: selectedElections['Dzongkhag'] || false,
                gewog: selectedElections['Gewog'] || false,
                village: selectedElections['Village'] || false
            };

            try {
                const payload = {
                    ...values,
                    ...mappedSelections
                };
                const response = await electionRuleService.saveElectionRule(payload);
                if (response.status === 200) {
                    globalLib.successMsg(response.data);
                    getAllElectionRule();
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

    const getAllElectionRule = async () => {
        try {
            const response = await electionRuleService.getAllElectionRule();
            if (response.status === 200) {
                setElectionRuleSetup(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };

    const handleEditClick = async (row) => {
        resetForm();

        // 1. Fetch election name list based on the type so dropdown options are available
        await getElectionByElectionType(row.electionTypeId);

        // 2. Set form field values
        setFieldValue('id', row.id);
        setFieldValue('electionTypeId', row.electionTypeId);
        setFieldValue('electionId', row.electionId);
        setFieldValue('dzongkhag', row.dzongkhag);
        setFieldValue('gewog', row.gewog);
        setFieldValue('village', row.village);

        // 3. Set checkboxes
        const updatedSelections = {
            Dzongkhag: !!row.dzongkhag,
            Gewog: !!row.gewog,
            Village: !!row.village
        };
        setSelectedElections(updatedSelections);

        setDialogOpen(true);
    };

    const handleDeleteClick = (election) => {
        setElectionRuleSetupToDelete(election);
        setDeleteDialogOpenForElectionRuleSetup(true);
    };
    const confirmDeleteElectionRule = async () => {
        if (!electionRuleSetupToDelete) return;
        try {
            const response = await electionRuleService.deleteElectionRule(electionRuleSetupToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                getAllElectionRule();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete Rule.');
        } finally {
            setDeleteDialogOpenForElectionRuleSetup(false);
            setElectionRuleSetupToDelete(null);
        }
    };

    const getAllElectionParameter = async () => {
        try {
            const response = await electionSetupService.getAllElectionParameter();
            if (response.status === 200) {
                const elections = response.data;
                setElectionNames(elections);
                const initialSelections = {};
                elections.forEach((item) => {
                    initialSelections[item.parameterName] = false;
                });
                setSelectedElections(initialSelections);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };

    const getElectionByElectionType = async (electionTypeId) => {
        try {
            const response = await electionSetupService.getElectionByElectionType(electionTypeId);
            if (response.data) {
                setElectionNameList(response.data);
            }
        } catch (error) {
            console.error('Error fetching election list:', error);
        }
    };

    useEffect(() => {
        getAllElectionRule();
        getAllElectionParameter();
        // getElectionByElectionType();
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
                                resetForm(); // reset form fields
                                // reset checkboxes to unchecked
                                const initialSelections = {};
                                electionNames.forEach((item) => {
                                    initialSelections[item.parameterName] = false;
                                });
                                setSelectedElections(initialSelections);

                                handleClickOpen();
                            }}
                        >
                            Add Election Rule
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
                            { accessorKey: 'minAge', header: 'Mininum Age', size: 10 },

                            {
                                accessorKey: 'dzongkhag',
                                header: 'Dzongkhag',
                                size: 10,
                                Cell: ({ cell }) => (cell.getValue() ? '✅ Yes' : '❌ No')
                            },
                            {
                                accessorKey: 'gewog',
                                header: 'Gewog',
                                size: 10,
                                Cell: ({ cell }) => (cell.getValue() ? '✅ Yes' : '❌ No')
                            },
                            {
                                accessorKey: 'village',
                                header: 'Village',
                                size: 10,
                                Cell: ({ cell }) => (cell.getValue() ? '✅ Yes' : '❌ No')
                            }
                        ]}
                        data={electionRuleSetup ?? []}
                        // data={electionRuleSetup}
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
                        <DialogTitle>Add Election Rule</DialogTitle>
                        <DialogContent dividers>
                            <form id="election-setup-form" onSubmit={handleSubmit}>
                                <Grid container spacing={1}>
                                    {/* -- Election Type Field -- */}
                                    <Grid item sm={12} xs={12} md={12}>
                                        <InputLabel id="election">Election Type</InputLabel>

                                        <TextField
                                            size="small"
                                            value={values.electionTypeId}
                                            select
                                            fullWidth
                                            onChange={async (e) => {
                                                const selectedId = e.target.value;
                                                setFieldValue('electionTypeId', selectedId);
                                                setFieldValue('electionId', ''); // Reset election name
                                                setElectionNameList([]); // Clear previous names
                                                await getElectionByElectionType(selectedId);
                                            }}
                                            // onOpen={async () => {
                                            //     if (values.electionTypeId) {
                                            //         await getElectionByElectionType(values.electionTypeId); // Refresh on open
                                            //     }
                                            // }}
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
                                            select
                                            size="small"
                                            fullWidth
                                            value={values.electionId}
                                            onChange={(e) => setFieldValue('electionId', e.target.value)}
                                            error={touched.electionId && Boolean(errors.electionId)}
                                            helperText={touched.electionId && errors.electionId}
                                        >
                                            {electionNameList.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.electionName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    {/* -- Age Field -- */}
                                    <Grid item sm={12} xs={12} md={12}>
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
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <fieldset style={{ border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px', padding: '16px' }}>
                                            <legend style={{ padding: '0 8px' }}>Voter Selection Criteria</legend>
                                            <FormGroup row>
                                                {electionNames.map((item) => (
                                                    <FormControlLabel
                                                        key={item.id || item.name}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedElections[item.parameterName] || false}
                                                                onChange={(e) =>
                                                                    setSelectedElections({
                                                                        ...selectedElections,
                                                                        [item.parameterName]: e.target.checked
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        label={item.parameterName}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </fieldset>
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
                        open={deleteDialogOpenForElectionRuleSetup}
                        onClose={(event, reason) => {
                            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                setDeleteDialogOpenForElectionRuleSetup(false);
                            }
                        }}
                        keepMounted
                    >
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography textAlign={'center'}>Are you sure you want to delete this Election Rule?</Typography>
                        </DialogContent>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setDeleteDialogOpenForElectionRuleSetup(false)}
                                sx={{ color: '#002B69' }}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => confirmDeleteElectionRule()} color="error" variant="outlined">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </MainCard>
        </>
    );
};

export default ElectionRuleSetup;
