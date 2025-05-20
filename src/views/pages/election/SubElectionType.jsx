import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    IconButton,
    InputLabel,
    FormControl,
    Box,
    Grid,
    FormHelperText,
    Typography,
    Avatar,
    Stack,
    Tooltip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { cidRegex, cidErrMsg } from 'common/global-lib';
import AppConstant from 'utils/AppConstant';
import MainCard from 'ui-component/cards/MainCard';
import { BUTTON_ADD_COLOR, BUTTON_SAVE_COLOR, BUTTON_VIEW_COLOR, BUTTON_CANCEL_COLOR } from 'common/color';
import { MaterialReactTable } from 'material-react-table';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import globalLib from 'common/global-lib';
import candidateService from 'services/candidate.service';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import voteService from 'services/vote.service';

const dzongkhags = ['Thimphu', 'Paro', 'Punakha', 'Samdrupjongkhar']; // Example values
const gewogs = ['Gewog 1', 'Gewog 2', 'Martshala'];
const villages = ['Village 1', 'Village 2', 'Choidung'];

const SubElectionType = () => {
    const [open, setOpen] = useState(false);
    const [subElectionList, setSubElectionList] = useState([]);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [electionTypes, setElectionTypes] = useState([]);
    const [deleteDialogOpenForSubElection, setDeleteDialogOpenForSubElection] = useState(false);
    const [subElectionToDelete, subEubElectionToDelete] = useState(null);

    const { values, handleSubmit, setFieldValue, touched, errors, resetForm } = useFormik({
        initialValues: {
            id: '',
            subElectionName: '',
            electionTypeId: ''
        },
        validationSchema: Yup.object({
            subElectionName: Yup.string().required(AppConstant().REQUIRED_FIELD),
            electionTypeId: Yup.string().required(AppConstant().REQUIRED_FIELD)
        }),
        onSubmit: (values) => {
            saveSubElectionType(values);
        }
    });



    const saveSubElectionType = (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });
        candidateService
            .saveSubElectionType(formData)
            .then((response) => {
                globalLib.successMsg(response.data);
                getAllSubElectionType();
                resetForm();
                setOpen(false);
            })
            .catch((error) => {
                globalLib.warningMsg(error?.response?.data?.message || 'Failed to save candidate');
            });
    };

    const fetchElectionTypes = async () => {
        try {
            const response = await voteService.getElectionType();
            if (response.status === 200) {
                setElectionTypes(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };

    const getAllSubElectionType = async () => {
        try {
            const response = await candidateService.getAllSubElectionType();
            if (response.status === 200) {
                setSubElectionList(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };
    useEffect(() => {
        fetchElectionTypes();
        getAllSubElectionType();
    }, []);

    const handleEditClick = (row) => {
        resetForm();
        setFieldValue('id', row.id);
        setFieldValue('subElectionName', row.subElectionName);
        setFieldValue('electionTypeId', row.electionType?.id || '');
        setOpen(true);
    };

    const handleDeleteClick = (election) => {
        subEubElectionToDelete(election);
        setDeleteDialogOpenForSubElection(true);
    };
    const confirmDeleteSubElection = async () => {
        if (!subElectionToDelete) return;
        try {
            const response = await candidateService.deleteSubElection(subElectionToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                getAllSubElectionType();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete Candidate.');
        } finally {
            setDeleteDialogOpenForSubElection(false);
            subEubElectionToDelete(null);
        }
    };

    return (
        <MainCard>
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
                    Add Sub Election Type
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
                    { accessorKey: 'subElectionName', header: 'Sub Election Type', size: 10 },

                    {
                        accessorKey: 'electionType.electionName',
                        header: 'Election Type',
                        size: 100
                    }
                ]}
                data={subElectionList ?? []}
                // data={subElectionList}
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

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add Sub Election Type</DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                            <InputLabel>Election Type</InputLabel>
                            <TextField
                                id="electionTypeId"
                                name="electionTypeId"
                                size="small"
                                fullWidth
                                select
                                value={values.electionTypeId}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    setFieldValue('electionTypeId', selected);
                                }}
                                error={touched.electionTypeId && Boolean(errors.electionTypeId)}
                                helperText={touched.electionTypeId && errors.electionTypeId}
                            >
                                {electionTypes.map((e, i) => (
                                    <MenuItem key={i} value={e.id}>
                                        {e.electionName.replace(/"/g, '')}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                            <InputLabel>Sub Election Type</InputLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={values.subElectionName}
                                onChange={(e) => setFieldValue('subElectionName', e.target.value)}
                                error={touched.subElectionName && Boolean(errors.subElectionName)}
                                helperText={touched.subElectionName && errors.subElectionName}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                    <Box display="flex" flexDirection="row" gap={2}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleSubmit();
                            }}
                            sx={{
                                background: BUTTON_ADD_COLOR,
                                '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                            }}
                        >
                            {/* {isEdit ? 'Update' : 'Save'}
                             */}{' '}
                            Save
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => handleClose()}
                            sx={{
                                background: BUTTON_CANCEL_COLOR,
                                '&:hover': { backgroundColor: BUTTON_CANCEL_COLOR }
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogOpenForSubElection} onClose={() => setDeleteDialogOpenForSubElection(false)} keepMounted>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography textAlign={'center'}>Are you sure you want to delete this sub election?</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => setDeleteDialogOpenForSubElection(false)} sx={{ color: '#002B69' }} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => confirmDeleteSubElection()} color="error" variant="outlined">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default SubElectionType;
