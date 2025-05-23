// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';
import electionTypeImg from 'assets/images/Election type.svg';

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
            icon: () => (
                <img
                    src={electionTypeImg}
                    alt="electionTypeImg"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/electionType'
        },

        {
            id: 'subElectionType',
            title: <FormattedMessage id="subElectionType" />,
            type: 'item',
            icon: () => (
                <img
                    src={electionTypeImg}
                    alt="dashboard"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/subElectionType'
        },
        // {
        //     id: 'electionParameterSetup',
        //     title: <FormattedMessage id="electionParameterSetup" />,
        //     type: 'item',
        //     icon: icons.IconDashboard,
        //     url: '/electionParameterSetup'
        // },
        {
            id: 'electionRule',
            title: <FormattedMessage id="election rule" />,
            type: 'item',
            icon: () => (
                <img
                    src={electionTypeImg}
                    alt="dashboard"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/electionRule'
        },
        {
            id: 'electionEligibilitySetup',
            title: <FormattedMessage id="electionEligibilitySetup" />,
            type: 'item',
            icon: () => (
                <img
                    src={electionTypeImg}
                    alt="dashboard"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/electionEligibilitySetup'
        }
    ]
};

export default candidate;