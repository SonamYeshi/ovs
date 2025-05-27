// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';
import voterVCImg from 'assets/images/Generate Voter VC.svg';

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
            icon: () => (
                <img
                    src={voterVCImg}
                    alt="voterVCImg"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            breadcrumbs: false
        }
    ]
};

export default ecbVoterVC;