import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/HomeLogin')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/HomeRegister')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ForgotPassword3')));
const AuthResetPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ResetPassword3')));
const AuthCheckMail = Loadable(lazy(() => import('views/pages/authentication/authentication3/CheckMail3')));
const Election = Loadable(lazy(() => import('views/pages/election/Election')));
const ElectionCandidatesPage = Loadable(lazy(() => import('views/pages/election/ElectionCandidatesPage')));
const VoteNDIQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoteNDIQRCodePage')));
const VoterVcQRCodePage = Loadable(lazy(() => import('views/pages/ndi/VoterVcQRCodePage')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        },
        {
            path: '/reset-password',
            element: <AuthResetPassword />
        },
        {
            path: '/check-mail',
            element: <AuthCheckMail />
        },
        {
            path: '/election',
            element: <Election />
        },
        {
            path: '/election/vote-qrCode',
            element: <VoteNDIQRCodePage />
        },
        {
            path: '/election/candidates',
            element: <ElectionCandidatesPage />
        },
        {
            path: '/vc-qrCode',
            element: <VoterVcQRCodePage />
        }
    ]
};

export default LoginRoutes;
