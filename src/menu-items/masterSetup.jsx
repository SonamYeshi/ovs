// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const candidate = {
    id: 'masterSetup',
    title: <FormattedMessage id="masterSetup" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'electionType',
            title: <FormattedMessage id="electionType" />,
            type: 'item',
            icon: icons.IconDashboard,
            url: '/electionType'
        },
        {
            id: 'subElectionType',
            title: <FormattedMessage id="subElectionType" />,
            type: 'item',
            icon: icons.IconDashboard,
            url: '/subElectionType'
        },
        {
            id: 'electionEligibilitySetup',
            title: <FormattedMessage id="electionEligibilitySetup" />,
            type: 'item',
            icon: icons.IconDashboard,
            url: '/electionEligibilitySetup'
        }
      
    ]
};

export default candidate;