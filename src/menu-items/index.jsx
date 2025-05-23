import dashboard from './dashboard';
import Election from './electionsPage';
import Candiate from './candidate'
import MasterSetup from './masterSetup'
import ecbVoterVC from './ecbVoterVC';


// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard,ecbVoterVC,Candiate,MasterSetup, Election]
};

export default menuItems;
