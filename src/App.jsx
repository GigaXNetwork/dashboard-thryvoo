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
import { UserProvider } from './Context/ContextApt';
import ItemsWrapper from './components/Items/ItemsWrapper';
import UserData from './components/User/UserData';
import Coupon from './components/Coupon/Coupon';
import GetMyCard from './components/Card/GetMyCard';
import LoadingAnimation from './components/Common/LoadingAnimation';
import AllCoupon from './components/Coupon/AllCoupons';

// 🔁 Scroll Wrapper
function ScrollToTop() {
  useScrollToTop();
  return <Outlet />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Ensure auth check is complete before rendering
  const [role, setRole] = useState("user")

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('https://api.thryvoo.com/api/user/isAuthenticated', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setRole(data.user.role)
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);


  // 🔁 Optional: loading indicator
  if (loading) return <LoadingAnimation/>;

  const router = createBrowserRouter([
    // 🔓 Public Routes
    { path: '/login', element: <Login /> },
    { path: '/forgot', element: <ForgotPasswordPage /> },
    { path: '/resetpassword/:token', element: <ResetPasswordPage /> },
    { path: '*', element: <ErrorHandler /> },

    // 🔐 Protected Routes
    // Assuming you have a `UserProvider` wrapping layout elements for shared context
    {
      path: '/',
      element: isAuthenticated ? (
        <UserProvider>
          {role === 'admin' ? <Admin /> : <Main />}
        </UserProvider>
      ) : (
        <Login />
      ),
      children:
        isAuthenticated && (
          [
            {
              element: <ScrollToTop />,
              children:
                role === 'admin'
                  ? [
                    { path: '/', element: <User /> },
                    {
                      path: '/user/:userId', element: <UserData />, children: [
                        {
                          element: <ScrollToTop />,
                          children: [
                            { path: 'card', element: <GetMyCard />},
                            { path: 'coupon', element: <Coupon user={role} /> },
                            { path: 'enquary', element: <Enquary /> },
                            { path: 'reviews', element: <Reviews /> },
                          ]
                        }
                      ]
                    },
                    { path: 'me', element: <Me /> },
                    { path: 'card', element: <Card /> },
                    { path: 'card/:cardId', element: <ItemsWrapper /> },
                    { path: 'coupon', element: <AllCoupon /> },
                    { path: 'reviews', element: <Reviews /> },
                    { path: '/signup', element: <SignupPage /> },
                  ]
                  : [
                    { path: '/', element: <User /> },
                    { path: 'me', element: <Me /> },
                    { path: 'card', element: <GetMyCard /> },
                    { path: 'card/:cardId', element: <ItemsWrapper role={role} /> },
                    { path: 'coupon', element: <Coupon /> },
                    { path: 'reviews', element: <Reviews role={role}/> },
                  ],
            },
          ]
        ),
    }


  ]);

  return <RouterProvider router={router} />;
}

export default App;
