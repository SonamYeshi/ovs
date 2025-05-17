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
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CrossImg from 'assets/images/corssImg.png';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';

import globalLib from 'common/global-lib';
import LoadingPage from 'common/LoadingPage';
import NdiService from '../../../services/ndi.service';
import blockchainAuthService from 'services/blockchainAuth.service';
import blockchainService from 'services/blockchain.service';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NDIBiometricQRCodePage = ({ electionTypeId, candidate }) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [url, setUrl] = useState('');
    const [deepLinkUrl, setDeepLinkUrl] = useState('');
    const [progressNDI, setProgressNDI] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [voterCid, setVoterCid] = useState(null);

    const constant = AppConstant();
    const navigate = useNavigate();

    useEffect(() => {
        NdiService.proofNdiRequest(true)
            .then((res) => {
                const deepLink = res.data.deepLinkURL;
                const invite = res.data.inviteURL;
                const threadId = res.data.threadId;

                setUrl(invite);
                setDeepLinkUrl(deepLink);
                setProgressNDI(false);
                natsListenerForBiometric(threadId);
            })
            .catch((err) => {
                setAlertMessage('Failed to load QR code. Please try again.');
                setProgressNDI(false);
            });
    }, []);

    const natsListenerForBiometric = (threadId) => {
        const endPoint = `${BASE_URL}ndi/nats-subscribe?threadId=${threadId}&isBiometric=true`;
        const eventSource = new EventSource(endPoint);
        eventSource.addEventListener('NDI_SSI_EVENT', (event) => {
            const data = JSON.parse(event.data);

            if (data.status === 'exists') {
                const voterCid = data.userDTO.cid;
                setVoterCid(voterCid);
                submitVote(candidate, voterCid);
            } else {
                setDialogMessage(data.userDTO.message || 'Biometric scan failed.');
                setErrorDialogOpen(true);
            }
        });
    };

    const submitVote = async (candidate, voterCid) => {
        const bc_token = await blockchainAuthService.fetchBlockchainAccessToken();
        if (!bc_token) {
            return globalLib.warningMsg("Could not load access token for blockchain.");
        }

        const payload = {
            voterName: 'Voter Name',
            voterCid: voterCid,
            candidateCid: candidate.candidateCid,
            candidateId: candidate.id,
            electionTypeId: electionTypeId,
            isVoted: true,
            voteTxnHash: 'vote-txn-hash',
            bcAccessToken: bc_token
        };
        setLoading(true);
        blockchainService
            .saveVote(payload)
            .then((res) => {
                if (!res.data || !res.data.message) {
                    throw new Error('Response is missing data.message');
                }

                // Show success message
                return globalLib.successMsg(res.data.message);
            })
            .then(() => {
                navigate('/vote-ndi-qr', {
                    state: { electionId: electionTypeId }
                });
                return;
            })
            .catch((err) => {
                console.error('Error submitting vote', err?.response?.data?.error || err.message || err);

                globalLib.warningMsg(err?.response?.data?.error || err.message || 'Something went wrong').then(() => {
                    setLoading(false);
                    navigate('/vote-ndi-qr', {
                        state: { electionId: electionTypeId }
                    });
                    return;
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 100);
                });
            });
    };

    return (
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
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <IconButton
                    aria-label="close"
                    onClick={() => setErrorDialogOpen(false)}
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
                        <Typography variant="h5" color="error">
                            {dialogMessage}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
            {/* lodaing page */}
            {loading && (
                <>
                    <LoadingPage />
                </>
            )}
        </Box>
    );
};

export default NDIBiometricQRCodePage;
