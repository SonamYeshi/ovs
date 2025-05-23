// third-party
import { FormattedMessage } from 'react-intl';
import electionImg from 'assets/images/Elections.svg'
import voteResultImg from 'assets/images/Vote result.svg'

// assets
import {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconFileInvoice,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
} from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconFileInvoice,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const reports = {
    id: 'elections',
    title: <FormattedMessage id="elections" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'elections',
            title: <FormattedMessage id="elections" />,
            type: 'item',
            icon: () => (
                <img
                    src={electionImg}
                    alt="dashboard"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/election'
        },
        {
            id: 'electionResult',
            title: <FormattedMessage id="electionResult" />,
            type: 'item',
            icon: () => (
                <img
                    src={voteResultImg}
                    alt="dashboard"
                    style={{
                        width: 24,
                        height: 24,
                        filter: 'invert(48%) sepia(100%) saturate(2000%) hue-rotate(10deg)'
                    }}
                />
            ),
            url: '/electionResult'
        }
    ]
};

export default reports;
