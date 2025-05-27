import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Box, Button, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';
import { MaterialReactTable } from 'material-react-table';
import voteService from 'services/vote.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useFormik } from 'formik';
import * as yup from 'yup';
import globalLib from 'common/global-lib';
import userService from 'services/userService';
import AppConstant from 'utils/AppConstant';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
    electionName: yup.string().required(AppConstant().REQUIRED_FIELD)
});

// ==============================|| FORM VALIDATION - LOGIN FORMIK ||============================== //

const ElectionTypeSetup = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [electionToDelete, setElectionToDelete] = useState(null);
    const [selectedElection, setSelectedElection] = useState(null);

    const formik = useFormik({
        initialValues: {
            electionName: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await userService.saveElectionType(values);
                if (response.status === 200) {
                    globalLib.successMsg(response.data);
                    fetchElectionTypes();
                    resetForm();
                }
            } catch (error) {
                globalLib.warningMsg(error.response?.data?.message);
            }
        }
    });

    const fetchElectionTypes = async () => {
        try {
            const response = await voteService.getElectionType();
            if (response.status === 200) {
                setSelectedElection(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch election types:', error);
        }
    };
    useEffect(() => {
        fetchElectionTypes();
    }, []);

    const handleViewClick = (election) => {
        formik.setValues({
            id: election.id,
            electionName: election.electionName
        });
    };
    const handleDeleteClick = (election) => {
        setElectionToDelete(election);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteElection = async () => {
        if (!electionToDelete) return;
        try {
            const response = await voteService.deleteElection(electionToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                fetchElectionTypes();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete election type.');
        } finally {
            setDeleteDialogOpen(false);
            setElectionToDelete(null);
        }
    };

    return (
        <>
            <MainCard>
                <Box mb={4}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    id="electionName"
                                    name="electionName"
                                    label="Election Name"
                                    size="small"
                                    value={formik.values.electionName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.electionName && Boolean(formik.errors.electionName)}
                                    helperText={formik.touched.electionName && formik.errors.electionName}
                                />
                            </Grid>

                            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        background: BUTTON_ADD_COLOR,
                                        '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                    }}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                <MaterialReactTable
                    columns={[
                        {
                            accessorKey: 'id',
                            header: 'SL.No.',
                            size: 20,
                            Cell: ({ row }) => row.index + 1
                        },
                        { accessorKey: 'electionName', header: 'Name', size: 10 }
                    ]}
                    data={selectedElection ?? []}
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
                                    borderRadius: 2,
                                    padding: 1,
                                    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
                                }}
                                onClick={() => handleViewClick(row.original)}
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
            </MainCard>

            <Dialog
                open={deleteDialogOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setDeleteDialogOpen(false);
                    }
                }}
                TransitionComponent={Transition}
                keepMounted
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography textAlign={'center'}>Are you sure you want to delete this election type?</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#002B69' }} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => confirmDeleteElection()} color="error" variant="outlined">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ElectionTypeSetup;
