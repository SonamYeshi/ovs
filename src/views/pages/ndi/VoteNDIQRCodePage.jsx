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
import { useEffect, useState } from 'react';
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

const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/v1/ndi';

const VoteNDIQRCodePage = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [url, setUrl] = useState('');
    const [deepLinkUrl, setDeepLinkUrl] = useState('');
    const [progressNDI, setProgressNDI] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
        if (!electionId || !electionTypeId) {
            navigate('/election', { replace: true });
        } else {
            generateQRCode();
        }
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

                natsListener(threadId);
            })
            .catch((err) => {
                setAlertMessage('Failed to load QR code. Please try again.');
                setProgressNDI(false);
            });
    };

    const natsListener = (threadId) => {
        const endPoint = `${BASE_URL}/nats-subscribe?threadId=${threadId}&isBiometric=false&electionTypeId=${electionTypeId}&electionId=${electionId}`;
        const eventSource = new EventSource(endPoint);

        eventSource.addEventListener('NDI_SSI_EVENT', async (event) => {

            const data = JSON.parse(event.data);

            eventSource.close();
            if (data.status === 'exists') {
                setLoading(true); // Show loading spinner
                await setDIDCredentials(data.userDTO.relationship_did, data.userDTO.holder_did);
                
                // Directly navigate without checking if already voted
                navigate('/election/candidates', {
                    state: {
                        voterVid: data.userDTO.vid,
                        village: data.userDTO.village,
                        dzongkhag: data.userDTO.dzongkhag,
                        gewog: data.userDTO.gewog,
                        electionTypeId: electionTypeId,
                        electionId: electionId,
                        electionTypeName: electionTypeName,
                        electionName: electionName
                    }
                });
            } else {
                clearDIDs();
                setDialogMessage(data.userDTO.message || 'Voters Eligibility Failed.');
                setErrorDialogOpen(true);
            }
        });
    };

    const handleDialogClose = () => {
        setErrorDialogOpen(false);
        generateQRCode();
    };

    return (
        <>
            <AppBar />

            <Box >
                <Box sx={{ background: TITLE, color: '#ffffff' }} p={1} >
                    {' '}
                    <Typography textAlign={'center'} variant="h2" sx={{ color: '#ffffff' }}>
                        {electionName}
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
                        {/* lodaing page */}
                        {loading && (
                            <>
                                <NormalLoadingPage />
                            </>
                        )}
                    </Box>
                </MainCard>
            </Box>
            <Footer />
        </>
    );
};

export default VoteNDIQRCodePage;
