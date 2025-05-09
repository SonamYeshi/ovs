
import { useTheme } from '@mui/material/styles';


import { ThemeMode } from 'config';
import logo from 'assets/images/ecb-logo.gif';


const Logo = () => {
    const theme = useTheme();

    return <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="POC" width={'40%'} height={'90%'} />;
};

export default Logo;
