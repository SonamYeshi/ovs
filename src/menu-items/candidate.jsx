// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';
import candidateImg from 'assets/images/Candidate.svg';


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
            icon: () => (
                <img
                    src={candidateImg}
                    alt="candidateImg"
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

export default candidate;