import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';


// project import
import Loadable from 'ui-component/Loadable';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing/HomePage')));

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([{ path: '/', element: <PagesLanding /> },  LoginRoutes, MainRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
