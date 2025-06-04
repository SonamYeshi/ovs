// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ThemeMode } from 'config';
import Login from '../authentication/authentication3/HomeLogin';
import AppBar from 'ui-component/extended/AppBar';
import Election from '../election/Election';
import { motion } from 'framer-motion';
import MainCard from 'ui-component/cards/MainCard';
import { Typography,Grid,ListItem,List } from '@mui/material';
// =============================|| LANDING MAIN ||============================= //

const Landing = () => {
    const theme = useTheme();

    return (
        <>
            {/* <Box
                id="home"
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'clip',
                    background:
                        theme.palette.mode === ThemeMode.DARK
                            ? theme.palette.background.default
                            : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`
                }}
            >
                <AppBar />
              
            </Box> */}
            <AppBar />

            <Box sx={{ p: 0 }}>
                <MainCard sx={{p:10}}>
                    <Box display={'flex'} flexDirection={'column'} gap={3}>
                        <Typography variant="h3" sx={{ color: '#003366', fontWeight: 'bold' }}>
                            About Online Voting System (OVS)
                        </Typography>
                        <Typography variant="h7" textAlign={'justify'}>
                            It aims to revolutionize the electoral process by enhancing user experience through a simplified voting
                            procedure, bolstering public trust with increased transparency and security, and improving accountability via
                            tamper-resistant blockchain technology. By increasing accessibility, it has the potential to boost voter
                            participation. This initiative sets a new standard for electronic voting systems, addressing the needs of an
                            increasingly digital society while maintaining democratic integrity. Upon successful implementation, this system
                            could serve as a model for electoral modernization efforts both within Bhutan and internationally, underscoring
                            the nation's commitment to democratic principles and technological innovation. Ultimately, this project
                            represents a significant step forward in ensuring secure, efficient, and accessible elections for all citizens.
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={3} mt={4}>
                        <Typography variant="h3" sx={{ color: '#003366', fontWeight: 'bold' }}>
                            Core Components of OVS
                        </Typography>
                        <List
                            component="ol"
                            sx={{
                                width: '100%',
                                maxWidth: '100%',
                                listStyleType: 'decimal',
                                pl: 4,
                                '& .MuiListItem-root': {
                                    display: 'list-item',
                                    alignItems: 'start'
                                }
                            }}
                        >
                            <ListItem component="li">
                                <Typography variant="body1">
                                    <strong>Digital Readiness of Voters:</strong> To participate in the digital voting process, voters must
                                    be equipped with a digital wallet application. This wallet should contain essential identity and address
                                    credentials necessary for voter verification. In the second phase of implementation, voters will be
                                    granted the ability to "Revoke" their vote and recast it, providing flexibility in the voting process.
                                </Typography>
                            </ListItem>
                            <ListItem component="li">
                                <Typography variant="body1">
                                    <strong>Voter Verification Process:</strong> The verification process begins when voters scan a secure
                                    QR code provided on the Election Portal. They are then required to provide key personal details for
                                    identity verification from their wallet. The OVS verifies the voter's eligibility by matching their
                                    permanent address details against the list of ongoing elections provided by ECB. The OVS also checks
                                    whether a vote has already been cast. If a vote has been cast but no Voter Credential (VC) has been
                                    issued, as confirmed by checking the ECB Agent Issue database, the voting details are reissued to the
                                    user. If no vote has been cast, the system generates an election ballot and displays it on the touch
                                    screen based on the voter's permanent address location.
                                </Typography>
                            </ListItem>
                            <ListItem component="li">
                                <Typography variant="body1">
                                    <strong>Voting Mechanism:</strong> Voters are presented with an election ballot containing a list of
                                    candidates and can initiate the voting process through a secure touch screen interface provided by ECB.
                                    The VCS confirms voter identity through biometric liveness test before a vote can be cast. If
                                    authentication is successful, the vote is securely recorded on the Polygon blockchain, storing only
                                    three key data items: the date and time, the vote itself, and the "salt" for that specific election. In
                                    case of authentication failure, voters are allowed to retry the process.
                                </Typography>
                            </ListItem>
                            <ListItem component="li">
                                <Typography variant="body1">
                                    <strong>Credential Management:</strong> Upon successful participation in an election, voters are issued
                                    digital credentials in the form of a Verifiable Credential (VC) to confirm the voter's identity and
                                    voting status. A voter can participate in multiple elections over time and receive a VC for each, which
                                    will be stored in their digital wallet for reference and proof.
                                </Typography>
                            </ListItem>
                        </List>
                    </Box>
                </MainCard>
            </Box>
        </>
    );
};

export default Landing;
