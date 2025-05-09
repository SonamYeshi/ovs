import { useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
// material-ui
import Typography from '@mui/material/Typography';
import NDIlogo from "../../assets/images/ndi/NDIlogobg.png";
// project imports
import MainCard from 'ui-component/cards/MainCard';
// import VoteNDIQRCode from 'views/pages/ndi/VoteNDIQRCode';
// import NdiService from '../../services/ndi.service';
// ==============================|| SAMPLE PAGE ||============================== //
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SamplePage = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const [progressNDI, setProgressNDI] = useState(true);
    const [url, setUrl] = useState("");
    const [deepLinkUrl, setDeepLinkUrl] = useState("");
    const [ndiScanOpen, setNdiScanOpen] = useState(false);

    const navigate = useNavigate();

    // Loading QR code page
    const handleQRLoading = () => {
        // NdiService.proofNdiRequest().then((res) => {
            // const deepLink = res.data.deepLinkURL;
            // const invite = res.data.inviteURL;
            // const threadId = res.data.threadId;
            // setUrl(invite);
            // setDeepLinkUrl(deepLink)

            // natsListener(threadId);

            // After "API call", navigate to QR code page
            navigate('/dashboard/vote-ndi-qr', {
                state: {
                    // url: invite,
                    // deepLinkUrl: deepLink,
                    isMobile,
                    // progressNDI: false,
                }
            });
        // });
    };

    async function natsListener(threadId) {
        let endPoint =
            BASE_URL + "ndi/nats-subscribe?threadId=" + threadId;
        let eventSource = new EventSource(endPoint);
        eventSource.addEventListener("NDI_SSI_EVENT", (event) => {
            let data = JSON.parse(event.data);
            console.log(data);
            if (data.status === "exists") {
                // handleLogin(data.userDTO.cidNumber, "12348579", true);
            } else {
                setShowAlert(true);
                setNdiScanOpen(false);
                setAlertData({
                    severity: "warning",
                    message: data.userDTO.message,
                });

            }
        });
    }

    return (
        <MainCard title="Online Voting">
            
            <br></br><br></br>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Button
                    variant="contained"
                    onClick={handleQRLoading}
                    sx={{
                        backgroundColor: '#124143',
                        textTransform: 'none',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#0e3335'
                        }
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <img
                            src={NDIlogo}
                            width="30"
                            height="30"
                            alt="NDI Logo"
                            style={{ marginRight: '10px' }}
                        />
                        <Typography sx={{ color: '#F0F9F4' }}>
                            Login with Bhutan NDI
                        </Typography>
                    </Box>
                </Button>
            </Box>
        </MainCard>
    );
}
export default SamplePage;
