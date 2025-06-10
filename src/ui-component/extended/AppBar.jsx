import PropTypes from 'prop-types';
import { cloneElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from 'assets/images/ecb-logo.gif';
import { ThemeMode } from 'config';
import { IconBook, IconCreditCard, IconDashboard, IconHome2 } from '@tabler/icons-react';
import MenuIcon from '@mui/icons-material/Menu';
import { BUTTON_ADD_COLOR, TITLE } from 'common/color';
function ElevationScroll({ children, window }) {
    const theme = useTheme();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window
    });

    return cloneElement(children, {
        elevation: trigger ? 1 : 0,
        style: {
            backgroundColor: theme.palette.mode === ThemeMode.DARK && trigger ? theme.palette.dark[800] : theme.palette.background.default,
            color: theme.palette.text.dark
        }
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.node,
    window: PropTypes.object
};

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

const AppBar = ({ ...others }) => {
    const [drawerToggle, setDrawerToggle] = useState(false);
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    const drawerToggler = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerToggle(open);
    };

    return (
        <ElevationScroll {...others}>
            <MuiAppBar
                position="static"
                sx={{
                    borderBottom: '2px solid #003366', // Change this color to your desired value
                    boxShadow: 'none' // Optional: remove default shadow if needed
                }}
            >
                <Container>
                    <Toolbar sx={{ py: 2.5, px: `0 !important` }}>
                        <Typography sx={{ flexGrow: 1, textAlign: 'left' }} href="/" component={Link}>
                            <img src={Logo} alt="" style={{ width: isMatch ? '22%' : '8%' }} />
                        </Typography>
                        <Stack direction="row" sx={{ display: { xs: 'none', sm: 'block' } }} spacing={{ xs: 1.5, md: 1 }}>
                            <Button
                                component={Link}
                                href="/"
                                sx={{
                                    color: '#002B69'
                                    // background: BUTTON_ADD_COLOR,
                                    // '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                }}
                            >
                                Home
                            </Button>

                            <Button
                                component={Link}
                                href="/vc-qrCode"
                                sx={{
                                    color: '#002B69'
                                    // background: BUTTON_ADD_COLOR,
                                    // '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                }}
                            >
                                Generate Voter VC
                            </Button>
                            <Button
                                component={Link}
                                href="/election"
                                sx={{
                                    color: '#002B69'
                                    // background: BUTTON_ADD_COLOR,
                                    // '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                }}
                            >
                                Election
                            </Button>
                            <Button
                                component={Link}
                                href="/login"
                                sx={{
                                    color: '#ffffff',
                                    background: BUTTON_ADD_COLOR,
                                    '&:hover': { backgroundColor: BUTTON_ADD_COLOR }
                                }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </MuiAppBar>
        </ElevationScroll>
    );
};

export default AppBar;
