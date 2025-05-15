// third-party
import { FormattedMessage } from "react-intl";

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
  IconNfc,
} from "@tabler/icons-react";

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
  IconNfc,
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const reports = {
    id: 'elections',
    title: <FormattedMessage id="elections" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
      {
        id: 'electionType',
        title: <FormattedMessage id="electionType" />,
        type: 'item',
        icon: icons.IconUserCheck,
        url: '/electionType'
    },
        {
          id: 'electionEligibilitySetup',
          title: <FormattedMessage id="electionEligibilitySetup" />,
          type: 'item',
          icon: icons.IconUserCheck,
          url: '/electionEligibilitySetup'
      },
    
        {
            id: 'elections',
            title: <FormattedMessage id="elections" />,
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/election'
        },
        {
            id: 'electionResult',
            title: <FormattedMessage id="electionResult" />,
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/electionResult'
        }
    ]
};

export default reports;
