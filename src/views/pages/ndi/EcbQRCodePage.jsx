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
import { useNavigate, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CrossImg from 'assets/images/corssImg.png';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import globalLib from 'common/global-lib';
import NormalLoadingPage from 'common/NormalLoadingPage';

import NdiService from '../../../services/ndi.service';
import blockchainAuthService from 'services/blockchainAuth.service';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EcbQRCodePage = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [url, setUrl] = useState('');
    const [deepLinkUrl, setDeepLinkUrl] = useState('');
    const [progressNDI, setProgressNDI] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [voterCid, setVoterCid] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('error');

    const constant = AppConstant();
    const navigate = useNavigate();
    const location = useLocation();
    const electionId = location.state?.electionId;

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
        const endPoint = `${BASE_URL}vc/nats-subscribe?threadId=${threadId}`;
        const eventSource = new EventSource(endPoint);
        eventSource.addEventListener('NDI_SSI_EVENT', async (event) => {
            const data = JSON.parse(event.data);

            if (data.status === 'exists') {
                setLoading(true); // Show loading spinner
                globalLib.successMsg(data.userDTO.message);
                setTimeout(async () => {
                  setLoading(false);
                  window.location.reload();
                }, 2000);
                
                // setTimeout(async () => {
                //     try {
                //         const isAllowed = await performExtraCheck(data.userDTO.cid, electionId);
                
                //         if (!isAllowed) {
                //             navigate('/localElectionScanPage', {
                //                 state: {
                //                     voterCid: data.userDTO.cid,
                //                     electionTypeId: electionId
                //                 }
                //             });
                //         } else {
                //             setLoading(false);
                //             setDialogMessage('You have already voted for this election.');
                //             setErrorDialogOpen(true);
                //         }
                //     } catch (err) {
                //         setLoading(false);
                //         setDialogMessage('Failed to verify voter eligibility.');
                //         setErrorDialogOpen(true);
                //         console.error('Extra check error:', err);
                //     }
                // }, 100);
            } else {
              globalLib.warningMsg(data.userDTO.message);
              setTimeout(async () => {
                window.location.reload();
              }, 5000);
                // setDialogMessage(data.userDTO.message || 'Voters Eligibility Failed.');
                // setErrorDialogOpen(true);
            }
        });
    };

    const performExtraCheck = async (cid, electionTypeId) => {
        const token = await blockchainAuthService.fetchBlockchainAccessToken();

        if (!token) {
            setLoading(false);
            setDialogMessage('Could not authenticate with the blockchain.');
            setErrorDialogOpen(true);
            return;
        }

        const response = await axios.get(`${BASE_URL}blockchain/checkIfVoted`, {
            params: { voterCid: cid, 
                electionTypeId: electionTypeId,
                bcToken: token
            },
        });

        return response.data;
    };

    const openDialog = (message, type = 'error') => {
      setDialogMessage(message);
      setDialogType(type);
      setDialogOpen(true);
  };

    const handleDialogClose = () => {
        setDialogOpen(false);
        generateQRCode(); 
    };
    

    const electionTitles = {
        1: 'Local Government',
        2: 'National Assembly Election',
        3: 'National Council Election'
    };
    return (
        <MainCard>
            {/* <Typography variant="h3" textAlign={'center'}>
                {electionTitles[electionId] || 'Mock Election'}
            </Typography> */}
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
              <IconButton
                  aria-label="close"
                  onClick={handleDialogClose}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                  <CloseIcon color={dialogType === 'error' ? 'error' : 'success'} />
              </IconButton>

              <Box display="flex" justifyContent="center" mt={2}>
                  <img
                      src={dialogType === 'error' ? CrossImg : CrossImg}
                      alt={dialogType}
                      width="30%"
                  />
              </Box>

              <DialogContent>
                  <Box sx={{ p: 1, minWidth: 300 }} display="flex" flexDirection="column" gap={2}>
                      <Typography variant="h4" textAlign="center">
                          {dialogType === 'error' ? 'Error Message' : 'Success Message'}
                      </Typography>
                      <Typography
                          variant="h5"
                          textAlign="center"
                          color={dialogType === 'error' ? 'error' : 'green'}
                      >
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
    );
};

export default EcbQRCodePage;
