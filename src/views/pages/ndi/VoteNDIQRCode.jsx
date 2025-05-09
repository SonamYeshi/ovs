import React from 'react';
import ScanButton from '../../../assets/images/ndi/ScanButton.png'
import {QRCode} from 'react-qrcode-logo';
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import {faPlayCircle} from "@fortawesome/free-solid-svg-icons";
import NDIlogobg from "../../../assets/images/ndi/QRNDIlogo.png";
import AppStore from "../../../assets/images/ndi/apple.jpg";
import GooglePlay from "../../../assets/images/ndi/google.jpg";
import Grid from "@mui/material/Grid";
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import AppConstant from "../ndi/AppConstant";
import BaseButton from "../ndi/BaseButton";
import Divider from "@mui/material/Divider";
import BaseInlineColorText from "../ndi/BaseInlineColorText";
// import { lineSpinner } from 'ldrs';

const VoteNDIQRCode = ({url, ndiScanOpen, setNdiScanOpen, isMobile, deepLinkUrl,progressNDI}) => {
    const constant = AppConstant();
    // lineSpinner.register()
    return (
        <Dialog open={ndiScanOpen} PaperProps={{
            style: {
                borderRadius: '30px', // Set the desired corner radius
                backgroundColor: "#F8F8F8",
                maxWidth: '352px',
            },
        }}>
            <DialogContent>
                <Grid container item xs={12}>
                    {!progressNDI && <Box display="flex" justifyContent="space-between" alignItems="center">
                        <CloseIcon onClick={e => setNdiScanOpen(false)} style={{cursor: 'pointer'}}/>
                    </Box>}
                    {/*<CardContent >*/}
                    <Grid sx={{margin: '0px', padding: '0px'}} item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center"
                             style={{padding: !isMobile ? '0 45px' : '0 40px', fontSize: '15px'}}>
                            <strong>Scan with <span
                                style={{color: '#5AC994'}}>
                               Bhutan NDI
                             </span> Wallet</strong>
                        </Box>
                        {progressNDI ? (
                            <Box
                                sx={{
                                    marginBottom: '30px',
                                    paddingTop:'20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <l-line-spinner
                                        size="40"
                                        stroke="3"
                                        speed="1"
                                        color="black"
                                    />
                                    <br/>
                                    <Typography>{("Generating QR code...")}</Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    borderRadius: '15px',
                                    borderColor: constant.NDI.TEXT_COLOR,
                                    paddingLeft:!isMobile ?  '55px':'45px',
                                    paddingTop: '15px',
                                    marginBottom: '30px',
                                    display: 'flex',
                                }}
                            >
                                <Box
                                    sx={{
                                        border: '2px',
                                        borderStyle: 'solid',
                                        borderRadius: '15px',
                                        borderColor: constant.NDI.TEXT_COLOR,
                                        padding: '10px'
                                    }}
                                >
                                    <QRCode logoImage={NDIlogobg} value={url}/>
                                </Box>
                            </Box>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <ol style={{
                                marginLeft: !isMobile ?'50px':'35px',
                                paddingInlineStart: '0',
                                color: 'rgba(128, 128, 128, 0.5)',
                                fontSize: '12px',
                                fontFamily: 'Inter'
                            }}>
                                <li style={{marginBottom: '-2px'}}>Open Bhutan NDI Wallet on your phone.</li>
                                <li style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <span>Tap the Scan button located on the menu bar and capture code.</span>
                                        <img
                                            src={ScanButton}
                                            alt="Scan Button"
                                            className="header-brand-img mb-2"
                                            style={{ width: '21px', height: '21px', marginRight: !isMobile ?'12px':'2px',marginTop: '-2px'  }} // Reduced margin
                                        />
                                    </div>
                                </li>
                            </ol>

                        </Box>
                        {isMobile && <Divider
                            component="div"
                            role="presentation"
                            style={{
                                marginBottom: '30px'
                            }}
                        >
                            <Typography>OR</Typography>
                        </Divider>}

                        {isMobile && <Box
                            style={{
                                marginBottom: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center'
                            }}
                        >
                            <Grid container item alignItems="center" justifyContent="center">
                                {!progressNDI && <BaseInlineColorText
                                    textAlign="center"
                                    style={{ color: constant.NDI.TEXT_COLOR, fontWeight: 'bold',fontSize: '18px' }}
                                    ix={{
                                        href:deepLinkUrl,
                                        target: '_blank',
                                        rel: 'noreferrer',
                                    }}
                                    first="Open "
                                    mid="Bhutan NDI"
                                    last=" Wallet "
                                    linkLabel="here"
                                    linkStyle={{ color: '#0000EE' }}
                                />}
                            </Grid>
                        </Box>}


                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center'
                            }}
                        >
                            <BaseButton
                                ix={{
                                    variant: 'contained',
                                    type: 'button',
                                    display: 'flex'
                                }}
                                sx={{
                                    background: constant.NDI.TEXT_COLOR, borderRadius: '20px',
                                    width: '145px', // Set the desired width
                                    height: '30px',
                                    fontSize: '10px',
                                    textTransform: 'none'
                                }}
                                label="Watch video guide"
                                onClick={(e) => {
                                    window.open('https://www.youtube.com/watch?v=A_k79pml9k8', '_blank');
                                }}
                                endIcon={<PlayCircleOutlinedIcon icon={faPlayCircle}/>}
                            />
                        </Box>
                        <Box
                            sx={{
                                paddingTop: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                color: 'rgba(128, 128, 128, 0.5)',
                                fontSize: '10px'
                            }}
                        >
                            <strong>Download Now!</strong>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <Grid container spacing={!isMobile ?1:-3} alignItems="center" justifyContent="center">
                                <Grid item>
                                    <Button onClick={(e) => {
                                        window.open(constant.NDI.NDI_GOOGLE_STORE_URL, '_blank');
                                    }}>
                                        <div style={{borderRadius: '5px', overflow: 'hidden'}}>
                                            <img src={GooglePlay} alt="google store" style={{height: !isMobile ?27:23, width:!isMobile ? 90:80}}/>
                                        </div>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={(e) => {
                                        window.open(constant.NDI.NDI_APPLE_STORE_URL, '_blank')
                                    }}>
                                        <div style={{borderRadius: '6px', overflow: 'hidden'}}>
                                            <img src={AppStore} alt="google store" style={{height: !isMobile ?27:23, width:!isMobile ? 90:80}}/>
                                        </div>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>


                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default VoteNDIQRCode;