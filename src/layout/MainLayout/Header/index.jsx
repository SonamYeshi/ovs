// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, ThemeMode } from 'config';
import { IconMenu2 } from '@tabler/icons-react';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Box } from '@mui/material';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { mode, menuOrientation } = useConfig();
    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

    return (
        <>
            {/* logo & toggler button */}
            <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                {!isHorizontal && (
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            overflow: 'hidden',
                            transition: 'all .2s ease-in-out',
                            bgcolor: '#003366',
                            color: '#ffffff',
                            '&:hover': {
                                bgcolor: '#356a9e'
                            }
                        }}
                        onClick={() => handlerDrawerOpen(!drawerOpen)}
                        color="#fffff"
                    >
                        <IconMenu2 stroke={1.5} size="20px" />
                    </Avatar>
                )}
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* profile */}
            <ProfileSection />
        </>
    );
};

export default Header;
