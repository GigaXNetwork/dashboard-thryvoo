import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// 🔁 Hooks
import { useScrollToTop } from './hooks/useScrollToTop';

// 🌐 Layouts
import Main from './components/Main/Main';
import Admin from './components/Admin/Admin';

// 🌐 Pages
import Card from './components/Card/Card';
import Enquary from './components/Enquary/Enquary';
import Reviews from './components/Reviews/Reviews';


// 🌐 Account
import Login from './components/Account/Login';
import SignupPage from './components/Account/SignupPage';
import ForgotPasswordPage from './components/Account/ForgotPasswordPage';
import ResetPasswordPage from './components/Account/ResetPasswordPage';
import Me from './components/Account/Me';

// 🌐 Common
import ErrorHandler from './components/Common/ErrorHandler';
import User from './components/User/User';
import { UserProvider, useUser } from './Context/ContextApt';
import ItemsWrapper from './components/Items/ItemsWrapper';
import UserData from './components/User/UserData';
import Coupon from './components/Coupon/Coupon';
import GetMyCard from './components/Card/GetMyCard';
import LoadingAnimation from './components/Common/LoadingAnimation';
import AllCoupon from './components/Coupon/AllCoupons';
import MyProfile from './components/User/MyProfile';
import SetDiscountPage from './components/Coupon/SetDiscountPage';
import WhatsAppTemplates from './components/WhatsApp/WhatsAppTemplates';
import RegistrationInfo from './components/WhatsApp/RegistrationInfo';
import Dashboard from './components/Dashboard/Dashboard';


// 🔁 Scroll Wrapper
function ScrollToTop() {
  useScrollToTop();
  return <Outlet />;
}

function App() {
  const { userData, loading, error } = useUser();

  if (loading) return <LoadingAnimation />;

  if (error) {
    console.error('Authentication error:', error);
    // Optionally render an error page or redirect to login
    return <ErrorHandler error={error} />;
  }

  const isAuthenticated = !!userData?.user;
  const role = userData?.user?.role || 'user';

  // Common protected routes for all authenticated users
  const protectedRoutes = [
    { path: 'me', element: <Me /> },
    { path: 'card/:cardId', element: <ItemsWrapper role={role} /> },
    { path: 'reviews', element: <Reviews role={role} /> },
  ];

  // Admin-only routes
  const adminRoutes = [
    { path: '/', element: <User /> },
    { path: 'card', element: <Card /> },
    { path: 'coupons', element: <AllCoupon role={role} /> },
    { path: 'whatsapp', element: <WhatsAppTemplates /> },
    { path: 'signup', element: <SignupPage /> },
    {
      path: 'user/:userId',
      element: <UserData />,
      children: [
        { index: true, element: <MyProfile role={role} /> },
        { path: 'card', element: <GetMyCard role={role} /> },
        { path: 'coupon', element: <Coupon role={role} /> },
        { path: 'presets', element: <SetDiscountPage role={role} /> },
        { path: 'enquary', element: <Enquary /> },
      ]
    }
  ];

  // User-only routes
  const userRoutes = [
    { path: '/', element: <Dashboard /> },
    { path: 'card', element: <GetMyCard role={role} /> },
    { path: 'coupon', element: <Coupon role={role} /> },
    { path: 'presets', element: <SetDiscountPage role={role} /> },
    { path: 'whatsapp/templates', element: <WhatsAppTemplates /> },
    { path: 'whatsapp/registration', element: <RegistrationInfo /> },
  ];

  const router = createBrowserRouter([
    // Public routes
    { path: '/login', element: <Login /> },
    { path: '/forgot', element: <ForgotPasswordPage /> },
    { path: '/resetpassword/:token', element: <ResetPasswordPage /> },
    
    // Protected routes wrapper
    {
      path: '/',
      element: isAuthenticated ? (
        role === 'admin' ? <Admin /> : <Main />
      ) : (
        <Login />
      ),
      children: isAuthenticated ? [
        {
          element: <ScrollToTop />,
          children: [
            ...protectedRoutes,
            ...(role === 'admin' ? adminRoutes : userRoutes)
          ]
        }
      ] : []
    },
    
    // Error handling
    { path: '*', element: <ErrorHandler /> }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
