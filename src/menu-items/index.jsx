import dashboard from './dashboard';
import Election from './electionsPage';
import Candiate from './candidate'
import MasterSetup from './masterSetup'
import ecbVoterVC from './ecbVoterVC';


// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard, 
        // ecbVoterVC, 
        MasterSetup, Candiate, Election]
};

export default menuItems;
