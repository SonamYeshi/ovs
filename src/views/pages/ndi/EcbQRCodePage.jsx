import { useEffect, useState } from 'react';
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import NDIlogobg from '../../../assets/images/ndi/QRNDIlogo.png';
import ScanButton from '../../../assets/images/ndi/ScanButton.png';
import GooglePlay from '../../../assets/images/ndi/google.jpg';
import AppStore from '../../../assets/images/ndi/apple.jpg';
import AppConstant from '../ndi/AppConstant';
import BaseButton from '../ndi/BaseButton';
import Divider from '@mui/material/Divider';
import BaseInlineColorText from '../ndi/BaseInlineColorText';
import { Box, Grid, Typography, Button, IconButton } from '@mui/material';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CrossImg from 'assets/images/corssImg.png';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import globalLib from 'common/global-lib';
import AppBar from 'ui-component/extended/AppBar';
import { BUTTON_ADD_COLOR, BUTTON_CANCEL_COLOR, BUTTON_VIEW_COLOR, TITLE } from 'common/color';
import NdiService from '../../../services/ndi.service';
import vcIssuanceService from 'services/vc-issuance-service';
import VCIssueLoading from 'common/VCIssueLoading';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/v1/vc';

const EcbQRCodePage = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [url, setUrl] = useState('');
    const [deepLinkUrl, setDeepLinkUrl] = useState('');
    const [progressNDI, setProgressNDI] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [dialogMessage, setDialogMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('error');
    const constant = AppConstant();

    useEffect(() => {
        generateQRCode();
    }, []);

    const generateQRCode = () => {
        setProgressNDI(true);
        NdiService.proofNdiREquestForECBVC()
            .then((res) => {
                const deepLink = res.data.deepLinkURL;
                const invite = res.data.inviteURL;
                const threadId = res.data.threadId;

                setUrl(invite);
                setDeepLinkUrl(deepLink);
                setProgressNDI(false);

                natsListener(threadId);
            })
            .catch((err) => {
                setAlertMessage('Failed to load QR code. Please try again.');
                setProgressNDI(false);
            });
    };

    const natsListener = (threadId) => {
        const endPoint = `${BASE_URL}/nats-subscribe?threadId=${threadId}`;
        const eventSource = new EventSource(endPoint);

        eventSource.addEventListener('NDI_SSI_EVENT', async (event) => {
            try {
                const data = JSON.parse(event.data);
                const message = data.userDTO?.message || 'No message received';

                if (data.status === 'exists') {
                    getnerateVC(data.userDTO.cid, data.userDTO.idType, data.userDTO.dob, data.userDTO.relationDID, data.userDTO.holderDID);
                } else {
                    await globalLib.warningMsg(message);
                }

                eventSource.close();
            } catch (err) {
                console.error('NDI_SSI_EVENT error:', err);
                globalLib.warningMsg('Something went wrong while processing the event.');
                eventSource.close();
            }
        });
    };

    const getnerateVC = async (cid, idType, dob, relation_did, holder_did) => {
        const payload = {
            cid: cid,
            idType: idType,
            dob: dob,
            relationDID: relation_did,
            holderDID: holder_did
        };
        setLoading(true);
        vcIssuanceService
            .generateVC(payload)
            .then((res) => {
                if (!res.data || !res.data.message) {
                    throw new Error('Response is missing data.message');
                }
                return globalLib.successMsg(res.data.message);
            })
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.error('Error generating VC', err);

                globalLib.warningMsg(err?.response.data?.message || 'Something went wrong').then(() => {
                    setLoading(false);
                });
            });
    };

    const handleDialogClose = () => {
        setLoading(false);
        setDialogOpen(false);
        generateQRCode();
    };

    return (
        <>
            <AppBar />
            <Box>
                <Box sx={{ background: TITLE, color: '#ffffff' }} p={1} >
                    {' '}
                    <Typography textAlign={'center'} variant="h2" sx={{ color: '#ffffff' }}>
                        Generate VC
                    </Typography>
                </Box>
                <MainCard sx={{ p: 5 }}>
                    <Box
                        sx={{
                            maxWidth: 500,
                            margin: 'auto',
                            padding: '20px',
                            backgroundColor: '#F8F8F8',
                            borderRadius: '20px',
                            marginTop: '30px'
                        }}
                    >
                        <Typography variant="h6" align="center">
                            Scan with <span style={{ color: '#5AC994' }}>Bhutan NDI</span> Wallet
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Box
                                sx={{
                                    border: '2px solid',
                                    borderRadius: '15px',
                                    padding: '10px',
                                    borderColor: constant.NDI.TEXT_COLOR,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '190px',
                                    minWidth: '190px'
                                }}
                            >
                                {progressNDI ? (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <CircularProgress size={40} thickness={4} sx={{ mb: 1 }} />
                                        <Typography sx={{ mt: 2 }}>Generating QR code...</Typography>
                                    </Box>
                                ) : alertMessage ? (
                                    <Typography color="error">{alertMessage}</Typography>
                                ) : (
                                    <QRCode logoImage={NDIlogobg} value={url} />
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <ol style={{ display: 'inline-block', textAlign: 'left', fontSize: '12px', color: 'gray' }}>
                                <li>Open Bhutan NDI Wallet on your phone.</li>
                                <li>
                                    Tap the Scan button located on the menu bar
                                    <img
                                        src={ScanButton}
                                        alt="Scan"
                                        style={{
                                            width: 21,
                                            height: 21,
                                            margin: '0 6px',
                                            verticalAlign: 'middle'
                                        }}
                                    />
                                    <br />
                                    and capture code.
                                </li>
                            </ol>
                        </Box>

                        {isMobile && (
                            <>
                                <Divider sx={{ my: 2 }}>
                                    <Typography>OR</Typography>
                                </Divider>
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <BaseInlineColorText
                                        textAlign="center"
                                        style={{ color: constant.NDI.TEXT_COLOR, fontWeight: 'bold', fontSize: '16px' }}
                                        ix={{
                                            href: deepLinkUrl,
                                            target: '_blank',
                                            rel: 'noreferrer'
                                        }}
                                        first="Open "
                                        mid="Bhutan NDI"
                                        last=" Wallet "
                                        linkLabel="here"
                                        linkStyle={{ color: '#0000EE' }}
                                    />
                                </Box>
                            </>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <BaseButton
                                label="Watch video guide"
                                onClick={() => window.open('https://www.youtube.com/watch?v=A_k79pml9k8', '_blank')}
                                endIcon={<PlayCircleOutlinedIcon icon={faPlayCircle} />}
                                ix={{ variant: 'contained', type: 'button' }}
                                sx={{
                                    background: constant.NDI.TEXT_COLOR,
                                    borderRadius: '20px',
                                    width: '145px',
                                    height: '30px',
                                    fontSize: '10px',
                                    textTransform: 'none'
                                }}
                            />
                        </Box>

                        <Typography align="center" sx={{ fontSize: '10px', color: 'gray' }}>
                            <strong>Download Now!</strong>
                        </Typography>

                        <Grid container justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                            <Grid item>
                                <Button onClick={() => window.open(constant.NDI.NDI_GOOGLE_STORE_URL, '_blank')}>
                                    <img src={GooglePlay} alt="Google Store" style={{ height: 27, width: 90 }} />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => window.open(constant.NDI.NDI_APPLE_STORE_URL, '_blank')}>
                                    <img src={AppStore} alt="Apple Store" style={{ height: 27, width: 90 }} />
                                </Button>
                            </Grid>
                        </Grid>

                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                            <IconButton aria-label="close" onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                                <CloseIcon color={dialogType === 'error' ? 'error' : 'success'} />
                            </IconButton>

                            <Box display="flex" justifyContent="center" mt={2}>
                                <img src={dialogType === 'error' ? CrossImg : CrossImg} alt={dialogType} width="30%" />
                            </Box>

                            <DialogContent>
                                <Box sx={{ p: 1, minWidth: 300 }} display="flex" flexDirection="column" gap={2}>
                                    <Typography variant="h4" textAlign="center">
                                        {dialogType === 'error' ? 'Error Message' : 'Success Message'}
                                    </Typography>
                                    <Typography variant="h5" textAlign="center" color={dialogType === 'error' ? 'error' : 'green'}>
                                        {dialogMessage}
                                    </Typography>
                                </Box>
                            </DialogContent>
                        </Dialog>

                        {/* lodaing page */}
                        {loading && (
                            <>
                                <VCIssueLoading />
                            </>
                        )}
                    </Box>
                </MainCard>
            </Box>
        </>
    );
};

export default EcbQRCodePage;
