import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR } from 'common/color';
import globalLib, { cidErrMsg, cidRegex } from 'common/global-lib';
import { useFormik } from 'formik';
import { MaterialReactTable } from 'material-react-table';
import { useEffect, useRef, useState } from 'react';
import candidateService from 'services/candidate.service';
import commonService from 'services/commonService';
import electionSetupService from 'services/electionSetup.service';
import voteService from 'services/vote.service';
import MainCard from 'ui-component/cards/MainCard';
import AppConstant from 'utils/AppConstant';
import * as Yup from 'yup';

const AddCandidate = () => {
    const [open, setOpen] = useState(false);
    const [candidateList, setCandidateList] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [electionTypes, setElectionTypes] = useState([]);
    const [dzongkhags, setDzongkhags] = useState([]);
    const [deleteDialogOpenForCandidate, setDeleteDialogOpenForCandidate] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [electionNameList, setElectionNameList] = useState([]);
    const [gewogLists, setGewogLists] = useState([]);
    const [villageLists, setVillageLists] = useState([]);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { values, handleSubmit, setFieldValue, touched, errors, resetForm } = useFormik({
        initialValues: {
            id: '',
            candidateName: '',
            candidateCid: '',
            dzongkhag: '',
            gewog: '',
            village: '',
            electionTypeId: '',
            electionId: '',
            profilePic: null
        },
        validationSchema: Yup.object({
            candidateName: Yup.string().required(AppConstant().REQUIRED_FIELD),
            candidateCid: Yup.string().matches(cidRegex, cidErrMsg).required(AppConstant().REQUIRED_FIELD),
            dzongkhag: Yup.string().required(AppConstant().REQUIRED_FIELD),
            gewog: Yup.string().required(AppConstant().REQUIRED_FIELD),
            village: Yup.string().required(AppConstant().REQUIRED_FIELD),
            electionTypeId: Yup.string().required(AppConstant().REQUIRED_FIELD),
            electionId: Yup.string().required(AppConstant().REQUIRED_FIELD)
            // profilePic: Yup.mixed()
            //     .required(AppConstant().REQUIRED_FIELD)
            //     .test('fileSize', 'File size too large (max 2MB)', (value) => value && value.size <= 2000000)
            //     .test('fileType', 'Unsupported file type', (value) => value && ['image/jpeg', 'image/png'].includes(value.type))
        }),
        onSubmit: (values) => {
            saveCandidate(values);
        }
    });

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        setFieldValue('profilePic', file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleRemoveImage = () => {
        setFieldValue('profilePic', null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input value
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // *******saving candidates******* //

    const saveCandidate = (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });
        candidateService
            .saveCandidate(formData)
            .then((response) => {
                globalLib.successMsg(response.data);
                getAllCandidates();
                resetForm();
                setOpen(false);
            })
            .catch((error) => {
                globalLib.warningMsg(error?.response?.data?.message || 'Failed to save candidate');
            });
    };

    // *******getting lists of candidates******* //
    const getAllCandidates = async () => {
        try {
            const response = await candidateService.getAllCandidates();
            if (response.status === 200) {
                setCandidateList(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    };

    // *******deleting candidates******* //
    const handleDeleteClick = (election) => {
        setCandidateToDelete(election);
        setDeleteDialogOpenForCandidate(true);
    };
    const confirmDeleteCandidate = async () => {
        if (!candidateToDelete) return;
        try {
            const response = await candidateService.deleteCandidate(candidateToDelete.id);
            if (response.status === 200) {
                globalLib.successMsg(response.data);
                getAllCandidates();
            }
        } catch (error) {
            globalLib.warningMsg('Failed to delete Candidate.');
        } finally {
            setDeleteDialogOpenForCandidate(false);
            setCandidateToDelete(null);
        }
    };

    // *******getting lists of election types******* //
    const fetchElectionTypes = async () => {
        try {
            const response = await voteService.getElectionType();
            setElectionTypes(response.data);
        } catch (error) {
            console.error('Failed to fetch election types', error);
        }
    };

    // *******getting lists of dzongkhags******* //
    const getAllDzongkhags = async () => {
        try {
            const response = await commonService.getAllDzongkhags();
            setDzongkhags(response.data);
        } catch (error) {
            console.error('Failed to fetch dzongkhag', error);
        }
    };

    // *******getting lists of gewogs******* //
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

    // *******getting lists of villages******* //
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

    // *******getting lists of elections******* //
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
        fetchElectionTypes();
        getAllCandidates();
        getAllDzongkhags();
        // getElectionByElectionType();
        // getAllGewogsByDzoId();
        // getAllVillagesByGewogId();
    }, []);

    // *******edit candidates******* //
    const handleEditClick = async (row) => {
        resetForm();
        await getElectionByElectionType(row.electionTypeId);
        await getAllGewogsByDzoId(row.dzongkhag);
        await getAllVillagesByGewogId(row.gewog);
        setFieldValue('id', row.id);
        setFieldValue('candidateName', row.candidateName);
        setFieldValue('candidateCid', row.candidateCid);
        setFieldValue('dzongkhagName', row.dzongkhagName);
        setFieldValue('gewogName', row.gewogName);
        setFieldValue('villageName', row.villageName);
        setFieldValue('dzongkhag', row.dzongkhag);
        setFieldValue('gewog', row.gewog);
        setFieldValue('village', row.village);
        setFieldValue('electionTypeId', row.electionTypeId);
        setFieldValue('electionId', row.electionId);
        setOpen(true);
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
                    Add Candidate
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
                    { accessorKey: 'candidateName', header: 'Name', size: 10 },
                    { accessorKey: 'candidateCid', header: 'CID', size: 10 },
                    { accessorKey: 'dzongkhagName', header: 'Dzongkhag', size: 10 },
                    { accessorKey: 'gewogName', header: 'Gewog', size: 10 },
                    { accessorKey: 'villageName', header: 'Village', size: 10 },
                    {
                        accessorKey: 'electionTypeName',
                        header: 'Election Type',
                        size: 100
                    },
                    {
                        accessorKey: 'electionName',
                        header: 'Election Name',
                        size: 100
                    }
                ]}
                data={candidateList ?? []}
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
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose();
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Candidate</DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={1}>
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <InputLabel>Election Type</InputLabel>

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
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
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
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <InputLabel>Candidate Name</InputLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={values.candidateName}
                                onChange={(e) => setFieldValue('candidateName', e.target.value)}
                                error={touched.candidateName && Boolean(errors.candidateName)}
                                helperText={touched.candidateName && errors.candidateName}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <InputLabel>Candidate CID</InputLabel>
                            <TextField
                                fullWidth
                                size="small"
                                value={values.candidateCid}
                                onChange={(e) => setFieldValue('candidateCid', e.target.value)}
                                error={touched.candidateCid && Boolean(errors.candidateCid)}
                                helperText={touched.candidateCid && errors.candidateCid}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
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
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
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
                        </Grid>
                        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
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
                        </Grid>

                        {/* <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <InputLabel sx={{ mb: 1 }}>
                                Profile Pic <span style={{ color: '#FA0101' }}>*</span>
                            </InputLabel>

                            <Box display="flex" flexDirection="column" gap={1}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<UploadFileIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        background: BUTTON_ADD_COLOR,
                                        '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                    }}
                                >
                                    Choose File
                                    <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
                                </Button>

                               
                                {values.profilePic && (
                                    <>
                                        <Typography variant="body2" color="textSecondary">
                                            Selected: <strong>{values.profilePic.name}</strong>
                                        </Typography>

                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar
                                                alt="Profile Preview"
                                                src={previewUrl}
                                                sx={{ width: 80, height: 80, border: '1px solid #ddd' }}
                                                variant="rounded"
                                            />
                                            <IconButton onClick={handleRemoveImage}>
                                                {' '}
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Stack>
                                    </>
                                )}

                              
                                {touched.profilePic && errors.profilePic && <FormHelperText error>{errors.profilePic}</FormHelperText>}
                            </Box>
                        </Grid> */}
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
            <Dialog
                open={deleteDialogOpenForCandidate}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setDeleteDialogOpenForCandidate(false);
                    }
                }}
                keepMounted
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography textAlign={'center'}>Are you sure you want to delete this candiate?</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => setDeleteDialogOpenForCandidate(false)} sx={{ color: '#002B69' }} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => confirmDeleteCandidate()} color="error" variant="outlined">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default AddCandidate;
