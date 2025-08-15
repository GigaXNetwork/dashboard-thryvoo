import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
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
import BlogCreateForm from './components/Blog/Blog';
import BlogListPage from './components/Blog/BlogListPage';
import Setting from './components/Setting/Setting';
import MediaRewards from './components/SocialMedia/MediaRewards';
import SocialMedia from './components/SocialMedia/SocialMedia';


// 🔁 Scroll Wrapper
function ScrollToTop() {
  useScrollToTop();
  return <Outlet />;
}

function App() {
  const { userData, loading } = useUser();

  if (loading) return <LoadingAnimation />;

  const isAuthenticated = !!userData?.user;
  const role = userData?.user?.role || 'user';

  // Protected Route Wrapper Component
  const ProtectedRoute = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (roles && !roles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  const router = createBrowserRouter([
    // Public Routes
    { 
      path: '/login', 
      element: !isAuthenticated ? <Login /> : <Navigate to="/" replace />
    },
    { path: '/forgot', element: <ForgotPasswordPage /> },
    { path: '/resetpassword/:token', element: <ResetPasswordPage /> },
    
    // Protected Routes
    {
      path: '/',
      element: (
        <ProtectedRoute>
          {role === 'admin' ? <Admin /> : <Main />}
        </ProtectedRoute>
      ),
      children: [
        {
          element: <ScrollToTop />,
          children: [
            // Common routes
            { path: 'me', element: <Me /> },
            { path: 'card/:cardId', element: <ItemsWrapper role={role} /> },
            { path: 'reviews', element: <Reviews role={role} /> },
            
            // Admin-only routes
            ...(role === 'admin' ? [
              { index: true, element: <User /> },
              { path: 'card', element: <Card /> },
              { path: 'coupons', element: <AllCoupon role={role} /> },
              { path: 'blog', element: <BlogListPage /> },
              { path: 'signup', element: <SignupPage /> },
              { path: 'setting', element: <Setting /> },
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
            ] : []),
            
            // User-only routes
            ...(role !== 'admin' ? [
              { index: true, element: <Dashboard /> },
              { path: 'card', element: <GetMyCard role={role} /> },
              { path: 'coupon', element: <Coupon role={role} /> },
              { path: 'presets', element: <SetDiscountPage role={role} /> },
              { path: 'media/allMedia', element: <MediaRewards /> },
              { path: 'media/setMedia', element: <SocialMedia /> },
              { path: 'whatsapp/templates', element: <WhatsAppTemplates /> },
              { path: 'whatsapp/registration', element: <RegistrationInfo /> },
            ] : [])
          ]
        }
      ]
    },
    
    // Error Handling
    { path: '*', element: <ErrorHandler /> }
  ]);

  return <RouterProvider router={router} />;
}

export default App;