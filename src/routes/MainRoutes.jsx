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
const ElectionCandidatesPage = Loadable(lazy(() => import('views/pages/election/ElectionCandidatesPage')));

// election result
const ElectionResult = Loadable(lazy(() => import('views/pages/electionResult/ElectionResult')));
const ElectionFinalResultPage = Loadable(lazy(() => import('views/pages/electionResult/ElectionFinalResultPage')));
const VoteNDIQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoteNDIQRCodePage')));
const Dasbboard = Loadable(lazy(() => import('views/dashboard/Dashoard')));
const ElectionEligibilitySetup = Loadable(lazy(() => import('views/pages/election/EligibilitySetup')));
const ElectionType = Loadable(lazy(() => import('views/pages/election/ElectionTypeSetup')));
const SubElectionType = Loadable(lazy(() => import('views/pages/election/ElectionNameSetup')));
const ElectionRule = Loadable(lazy(() => import('views/pages/election/ElectionRuleSetup')));
const ElectionParameter = Loadable(lazy(() => import('views/pages/election/ElectionParameterSetup')));
const VoterVcQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoterVcQRCodePage')));
const HomePage = Loadable(lazy(() => import('views/pages/landing/HomePage')));




// Add Candidate
const AddCandidate = Loadable(lazy(() => import('views/pages/candidate/AddCandidate')));

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
            path: '/home',
            element: <HomePage />
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
        // {
        //     path: '/election',
        //     element: <Election />
        // },
        // {
        //     path: '/election/candidates',
        //     element: <ElectionCandidatesPage />
        // },

        // election result
        {
            path: '/electionResult',
            element: <ElectionResult />
        },
        {
            path: '/electionResult/result',
            element: <ElectionFinalResultPage />
        },

        // {
        //     path: '/election/vote-qrCode',
        //     element: <VoteNDIQRCodePage />
        // },
        // {
        //     path: '/vc-qrCode',
        //     element: <VoterVcQRCodePage />
        // },
        {
            path: 'electionEligibilitySetup',
            element: <ElectionEligibilitySetup />
        },
        {
            path: 'electionType',
            element: <ElectionType />
        },
        {
            path: 'subElectionType',
            element: <SubElectionType />
        },
        {
            path: 'electionRule',
            element: <ElectionRule />
        },
        {
            path: 'electionParameterSetup',
            element: <ElectionParameter />
        },

        // add Candidate
        {
            path: 'addCandidate',
            element: <AddCandidate />
        }
    ]
};

export default MainRoutes;
