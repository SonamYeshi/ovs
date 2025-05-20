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
    id: 'candidate',
    title: <FormattedMessage id="candidate" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'candidate',
            title: <FormattedMessage id="candidate" />,
            type: 'item',
            url: '/addCandidate',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default candidate;