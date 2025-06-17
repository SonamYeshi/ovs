import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import CrossImg from 'assets/images/corssImg.png';
import NormalLoadingPage from 'common/NormalLoadingPage';
import { TITLE } from 'common/color';
import { useEffect, useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useLocation, useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import AppBar from 'ui-component/extended/AppBar';
import NDIlogobg from '../../../assets/images/ndi/QRNDIlogo.png';
import ScanButton from '../../../assets/images/ndi/ScanButton.png';
import AppStore from '../../../assets/images/ndi/apple.jpg';
import GooglePlay from '../../../assets/images/ndi/google.jpg';
import AppConstant from '../ndi/AppConstant';
import BaseButton from '../ndi/BaseButton';
import BaseInlineColorText from '../ndi/BaseInlineColorText';
import Footer from '../landing/Footer';
import NdiService from '../../../services/ndi.service';
import { clearDIDs, setDIDs } from '../../../utils/ndi-storage';
import publicService from 'services/public.service';
import Layout from 'ui-component/Layout';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/v1/ndi';

const VoteNDIQRCodePage = () => {
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [url, setUrl] = useState('');
    const [deepLinkUrl, setDeepLinkUrl] = useState('');
    const [progressNDI, setProgressNDI] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const eventSourceRef = useRef(null);

    const constant = AppConstant();
    const navigate = useNavigate();
    const location = useLocation();
    const { electionTypeId, electionId, electionName, electionTypeName } = location.state || {};

    const setDIDCredentials = async (relationship_did, holder_did) => {
        if (relationship_did && holder_did) {
            await setDIDs(relationship_did, holder_did);
        } else {
            await clearDIDs();
        }
    };

    useEffect(() => {
        let cleanupNatsListener;

        if (!electionId || !electionTypeId) {
            navigate('/election', { replace: true });
        } else {
            cleanupNatsListener = generateQRCode();
        }

        return () => {
            // Cleanup both the QR code generation and EventSource
            if (cleanupNatsListener) {
                cleanupNatsListener();
            }
        };
    }, [electionId, electionTypeId, navigate]);

    const generateQRCode = () => {
        setProgressNDI(true);
        NdiService.proofNdiRequest(false, null)
            .then((res) => {
                const deepLink = res.data.deepLinkURL;
                const invite = res.data.inviteURL;
                const threadId = res.data.threadId;

                setUrl(invite);
                setDeepLinkUrl(deepLink);
                setProgressNDI(false);

                return natsListener(threadId);
            })
            .catch((err) => {
                setAlertMessage('Failed to load QR code. Please try again.');
                setProgressNDI(false);
            });
    };

    const natsListener = (threadId) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const endPoint = `${BASE_URL}/nats-subscribe?threadId=${threadId}&isBiometric=false&electionTypeId=${electionTypeId}&electionId=${electionId}`;
        eventSourceRef.current = new EventSource(endPoint);

        let eventProcessed = false;

        const handleEvent = async (event) => {
            try {
                const data = JSON.parse(event.data);
                eventProcessed = true;

                setLoading(true);
                if (data.status === 'exists') {
                    await setDIDCredentials(data.userDTO.relationship_did, data.userDTO.holder_did);
                    await handleEligibleUser(data.userDTO);
                } else {
                    handleIneligibleUser(data.userDTO.message || 'Voters authentication Failed.');
                }
            } catch (error) {
                console.error('Error processing NDI event:', error);
                setLoading(false);
                setDialogMessage('Error processing authentication');
                setErrorDialogOpen(true);
            } finally {
                setLoading(false);
                if (eventSourceRef.current?.readyState !== EventSource.CLOSED) {
                    eventSourceRef.current?.close();
                }
            }
        };

        eventSourceRef.current.addEventListener('NDI_SSI_EVENT', handleEvent);

        // Return cleanup function
        return () => {
            if (eventSourceRef.current?.readyState !== EventSource.CLOSED) {
                eventSourceRef.current?.close();
            }
        };
    };

    const handleEligibleUser = async (userDTO) => {
        try {
            const response = await publicService.checkVoterEligibility(
                userDTO,
                electionId,
                electionTypeId
            );

            if (response === true) {
                navigateToCandidatesPage(userDTO);
            } else {
                throw new Error('Eligibility check failed.');
            }
        } catch (error) {
            clearDIDs();
            const msg = error.response?.data?.message || error.message || 'Eligibility verification failed.';
            setDialogMessage(msg);
            setErrorDialogOpen(true);
        } finally {
            setLoading(false); // Ensure loading is turned off
        }
    };

    const navigateToCandidatesPage = (userDTO) => {
        // 1. Store data in sessionStorage (as before)
        const stateData = {
            voterVid: userDTO.vid,
            village: userDTO.village,
            dzongkhag: userDTO.dzongkhag,
            gewog: userDTO.gewog,
            electionTypeId,
            electionId,
            electionTypeName,
            electionName,
        };
        sessionStorage.setItem('candidatesPageState', JSON.stringify(stateData));
        // window.open('/election/candidates', '_blank');

        const openOnSecondaryScreen = () => {
            try {
                // Get primary screen dimensions
                const primaryWidth = window.screen.width;
                const primaryHeight = window.screen.height;

                // Position window on secondary screen (right of primary)
                const leftPos = primaryWidth;
                const topPos = 0;

                // Use full secondary screen dimensions
                const width = primaryWidth;
                const height = primaryHeight;

                // Window features (important flags)
                const features = [
                    `width=${width}`,
                    `height=${height}`,
                    `left=${leftPos}`,
                    `top=${topPos}`,
                    'fullscreen=yes',
                    'location=no',
                    'menubar=no',
                    'toolbar=no',
                    'status=no'
                ].join(',');

                // Open window
                const candidatesWindow = window.open(
                    '/election/candidates',
                    'CandidatesWindow', // Named target for reusing same window
                    features
                );

                // Focus and prevent accidental closure
                if (candidatesWindow) {
                    candidatesWindow.focus();
                    // Optional: Prevent user from closing with JS (ethical considerations apply)
                    candidatesWindow.onbeforeunload = () => "Candidate display is active. Close anyway?";
                }

            } catch (e) {
                console.error("Failed to open secondary window:", e);
                // Fallback: Open in new tab
                window.open('/election/candidates', '_blank');
            }
        };
        // 3. Delay opening slightly to ensure sessionStorage is ready
        setTimeout(openOnSecondaryScreen, 100);
    };

    const handleIneligibleUser = (message) => {
        clearDIDs();
        setDialogMessage(message);
        setErrorDialogOpen(true);
    };

    const handleDialogClose = () => {
        setErrorDialogOpen(false);
        generateQRCode();
    };

    return (
        <Layout>
            <Box sx={{ background: TITLE, color: '#ffffff' }} p={1} >
                {' '}
                <Typography textAlign={'center'} variant="h2" sx={{ color: '#ffffff' }}>
                    {electionName}
                </Typography>
            </Box>
            <MainCard sx={{ p: 3 }}>
                <Box
                    sx={{
                        maxWidth: 500,
                        margin: 'auto',
                        padding: '20px',
                        backgroundColor: '#F8F8F8',
                        borderRadius: '20px',
                        marginTop: '1px'
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
                </Box>
            </MainCard>

            {loading && <NormalLoadingPage />}

            <Dialog open={errorDialogOpen} onClose={handleDialogClose}>
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <CloseIcon color="error" />
                </IconButton>
                <Box display={'flex'} justifyContent={'center'}>
                    <img src={CrossImg} alt="corssImg" width="30%" />
                </Box>
                <DialogContent>
                    <Box sx={{ p: 1, minWidth: 300 }} display={'flex'} flexDirection={'column'} gap={2}>
                        <Typography variant="h4" textAlign={'center'}>
                            Error Message
                        </Typography>
                        <Typography variant="h5" color="error" textAlign={'center'}>
                            {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default VoteNDIQRCodePage;
