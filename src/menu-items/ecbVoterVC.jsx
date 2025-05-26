// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const ecbVoterVC = {
    id: 'votervc',
    title: <FormattedMessage id="votervc" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'getvotervc',
            title: <FormattedMessage id="getvotervc" />,
            type: 'item',
            url: '/ecbQrCode',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default ecbVoterVC;