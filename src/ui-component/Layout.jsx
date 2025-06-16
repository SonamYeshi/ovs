import { Box } from '@mui/material';
import AppBar from 'ui-component/extended/AppBar';
import Footer from 'views/pages/landing/Footer';

const Layout = ({ children }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <AppBar />
            <Box component="main" sx={{ flexGrow: 1, pb: 4 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;