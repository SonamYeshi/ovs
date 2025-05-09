import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';

import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { loader as productsLoader, productLoader } from 'api/products';
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// widget routing
const WidgetStatistics = Loadable(lazy(() => import('views/widget/Statistics')));
const WidgetData = Loadable(lazy(() => import('views/widget/Data')));
const WidgetChart = Loadable(lazy(() => import('views/widget/Chart')));

const SamplePage = Loadable(lazy(() => import('views/pages/samplepage')));
const VoteNDIQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoteNDIQRCodePage')));
const NotEligible = Loadable(lazy(() => import('views/pages/ndi/NotEligible')));
const Candidates = Loadable(lazy(() => import('views/pages/ndi/CandidateDisplayPage')));

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
            path: '/dashboard/default',
            element: <SamplePage/>
            // element: <DashboardDefault />
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
            path: '/dashboard/default',
            element: <DashboardDefault />
        },

        {
            path: '/dashboard/vote-ndi-qr',
            element: <VoteNDIQRCodePage/>
        },
        {
            path: '/dashboard/candidates',
            element: <Candidates/>
        },
        {
            path: '/dashboard/not-eligible',
            element: <NotEligible/>
        }
    ]
};

export default MainRoutes;
