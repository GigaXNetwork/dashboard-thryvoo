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
import Setting from './components/Setting/Setting';
import MediaRewards from './components/SocialMedia/MediaRewards';
import SocialMedia from './components/SocialMedia/SocialMedia';
import FlashHourOffer from './components/Offer/FlashHourOffer/FlashHourOffer';
import Spinning from './components/Spinning/Spinning';
import PresetCard from './components/Presets/PresetCard';
import PresetsPage from './components/Presets/Presets';
import CrossBrand from './components/CrossBrand/CrossBrand';
import RedeemStoreForm from './components/RedeemStore/RedeemStoreForm';
import RedeemStore from './components/RedeemStore/RedeemStore';
import MyPreset from './components/CrossBrand/MyPreset';
import BlogAdmin from './components/Blog/BlogAdmin';
import Customers from './components/Customers';
import Categories from './components/User/Categories/Categories';
import SpecialOffer from './components/Offer/SpecialOffer/SpecialOffer';
import MyCategories from './components/MyCategories/MyCategories';
import CreateCrossCoupon from './components/CrossBrand/CreateCrossCoupon';
import Support from './components/Support/Support';
import Plan from './components/Plans/Plan';
import AffiliateManagement from './components/AffiliateUsers/AffiliateManagement';
import AffiliateDetails from './components/AffiliateUsers/AffiliateDetails';

// 🔁 Scroll Wrapper
function ScrollToTop() {
  useScrollToTop();
  return <Outlet />;
}

function App() {
  const { userData, loading } = useUser();

  if (loading) return <LoadingAnimation loading={loading}/>;

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

  // const ProtectedRoute = ({ children, roles }) => {
  //   const { userData, loading } = useUser();

  //   if (loading) return null; // or a spinner

  //   const isAuthenticated = !!userData?.isAuthenticated;
  //   const role = userData?.user?.role || "user";

  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   if (roles && !roles.includes(role)) {
  //     return <Navigate to="/" replace />; // unauthorized
  //   }

  //   return children;
  // };

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
            { path: 'plans', element: <Plan role={role}/> },

            // Admin-only routes
            ...(role === 'admin' ? [
              { index: true, element: <User /> },
              { path: 'card', element: <Card /> },
              { path: 'coupons', element: <AllCoupon role={role} /> },
              { path: 'blog', element: <BlogAdmin /> },
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
                  { path: 'redeem-store', element: <RedeemStore /> },
                  { path: 'enquary', element: <Enquary /> },
                  { path: 'reviews', element: <Reviews role={role} /> },
                  { path: 'categories', element: <Categories /> },
                ]
              },
              { path: 'support', element: <Support /> },
              { path: 'affiliate-users', element: <AffiliateManagement /> },
              { path: '/affiliate/:id', element: <AffiliateDetails />}
            ] : []),

            // User-only routes
            ...(role !== 'admin' ? [
              { index: true, element: <Dashboard /> },
              { path: 'card', element: <GetMyCard role={role} /> },
              { path: 'coupon', element: <Coupon role={role} /> },
              { path: 'presets', element: <SetDiscountPage role={role} /> },
              { path: 'offer/flashOffer', element: <FlashHourOffer role={role} /> },
              { path: 'offer/specialOffer', element: <SpecialOffer role={role} /> },
              { path: 'media/allMedia', element: <MediaRewards /> },
              { path: 'spin', element: <Spinning /> },
              { path: 'media/setMedia', element: <SocialMedia /> },
              { path: 'cross-brand/store', element: <CrossBrand /> },
              { path: 'cross-brand/presets', element: <MyPreset /> },
              { path: 'cross-brand/coupon', element: <CreateCrossCoupon /> },
              { path: 'whatsapp/templates', element: <WhatsAppTemplates /> },
              { path: 'whatsapp/registration', element: <RegistrationInfo /> },
              { path: 'customers', element: <Customers /> },
              { path: 'myCategories', element: <MyCategories /> },
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