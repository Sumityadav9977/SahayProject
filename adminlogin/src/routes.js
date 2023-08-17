import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
// import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Profile from './pages/Profile';
import DashboardAppPage from './pages/DashboardAppPage';
import Data from './pages/Data'

// ----------------------------------------------------------------------

export default function Router() {
   const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
      children: [
        {element: <Navigate to ="/dashboard/app"/>, index: true },
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { element: <Navigate to="/dashboard/app" />, index: true },
        // {path:'login',element: <LoginPage />}
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'profile/:emailAddress', element: <Profile /> },
        { path: 'data', element: <Data /> },
      ],
    },
  
   
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
   ]);

  return routes;
}
