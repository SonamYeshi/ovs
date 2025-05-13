import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';

import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { loader as productsLoader, productLoader } from 'api/products';
import { element } from 'prop-types';

// dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

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
const VoteNDIQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoteNDIQRCodePage')));
const NotEligible = Loadable(lazy(() => import('views/pages/ndi/NotEligible')));
const Candidates = Loadable(lazy(() => import('views/pages/ndi/CandidateDisplayPage')));
const Dasbboard = Loadable(lazy(() => import('views/dashboard/Dashoard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // {
        //     path: '/dashboard',
        //     element: <DashboardDefault />
        // },
        {
            path: '/dashboard',
            element: <Dasbboard />
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
        },

        {
            path: '/dashboard/vote-ndi-qr',
            element: <VoteNDIQRCodePage />
        },
        {
            path: '/dashboard/candidates',
            element: <Candidates />
        },
        {
            path: '/dashboard/not-eligible',
            element: <NotEligible />
        }
    ]
};

export default MainRoutes;
