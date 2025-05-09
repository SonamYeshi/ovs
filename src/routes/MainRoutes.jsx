import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';

import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { loader as productsLoader, productLoader } from 'api/products';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// widget routing
const WidgetStatistics = Loadable(lazy(() => import('views/widget/Statistics')));
const WidgetData = Loadable(lazy(() => import('views/widget/Data')));
const WidgetChart = Loadable(lazy(() => import('views/widget/Chart')));


// election
const Election = Loadable(lazy(() => import('views/pages/election/Election')));
const LocalElectionScanPage = Loadable(lazy(() => import('views/pages/election/LocalElectionScanPage')));
const NationalAssemblyElectionScanPage = Loadable(lazy(() => import('views/pages/election/NationalAssemblyElectionScanPage')));
const NationalCouncilElectionScanPage = Loadable(lazy(() => import('views/pages/election/NationalCouncilElectionScanPage')));
const ByeElectionScanPage = Loadable(lazy(() => import('views/pages/election/ByeElectionScanPage')));

// election result
const ElectionResult = Loadable(lazy(() => import('views/pages/electionResult/ElectionResult')));
const LocalElectionResult = Loadable(lazy(() => import('views/pages/electionResult/LocalElectionResult')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/widget/statistics',
            element: <WidgetStatistics />
        },
        {
            path: '/widget/data',
            element: <WidgetData />
        },
        {
            path: '/widget/chart',
            element: <WidgetChart />
        },
        {
            path: '/election',
            element: <Election />
        },
        {
            path: '/localElectionScanPage',
            element: <LocalElectionScanPage />
        },
        {
            path: '/nationalAssemblyElectionScanPage',
            element: <NationalAssemblyElectionScanPage />
        },
        {
            path: '/nationalCouncilElectionScanPage',
            element: <NationalCouncilElectionScanPage />
        },
        {
            path: '/byeElectionScanPage',
            element: <ByeElectionScanPage />
        },

        // election result
        {
            path: '/electionResult',
            element: <ElectionResult />
        },
        {
            path: '/localElectionResult',
            element: <LocalElectionResult />
        }
    ]
};

export default MainRoutes;
