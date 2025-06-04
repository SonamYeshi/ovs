import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItemButton, Box, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import {
    Login as LoginIcon,
    AppRegistration as AppRegistrationIcon,
    Inbox as InboxIcon,
    Call as CallIcon,
    Campaign as CampaignIcon,
    ContentPasteSearch as ContentPasteSearchIcon,
    Home as HomeIcon,
    LocationCity as LocationCityIcon
} from '@mui/icons-material';

const pages = [
    { name: 'Home', link: '/', color: '#FF0000', icon: <HomeIcon /> },
    { name: 'Result', link: '/resultPublicPage', icon: <ContentPasteSearchIcon /> },
    { name: 'Vacancies', link: '/vacancyPublicPage', icon: <WorkOutlineOutlinedIcon /> },
    { name: 'Registration', link: '/register', icon: <AppRegistrationIcon /> },
    { name: 'Company', link: '/displayCompanies', icon: <LocationCityIcon /> },
    { name: 'Log In', link: '/login', icon: <LoginIcon /> }
];

const DrawerComponent = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleClose = () => {
        setOpenDrawer(false);
    };

    return (
        <React.Fragment>
            <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box display={'flex'} justifyContent={'flex-end'} pr={2} mt={2}>
                    <IconButton onClick={handleClose} sx={{ cursor: 'Pointer' }}>
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                </Box>
                <Box mt={-2} p={2}>
                    <List>
                        {pages.map((page, index) => (
                            <ListItemButton key={index} component={Link} to={page.link}>
                                <ListItemIcon>{page.icon}</ListItemIcon>
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <IconButton sx={{ color: 'black', marginLeft: 'auto' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon color="white" />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComponent;
