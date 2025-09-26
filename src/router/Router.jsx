import { Route, Routes, Navigate } from "react-router-dom";
import { useUser } from "../Context/ContextApt";

// Layouts
import Main from "../components/Main/Main";
import Admin from "../components/Admin/Admin";

// Auth Pages
import Login from "../components/Account/Login";
import SignupPage from "../components/Account/SignupPage";
import ForgotPasswordPage from "../components/Account/ForgotPasswordPage";
import ResetPasswordPage from "../components/Account/ResetPasswordPage";
import Me from "../components/Account/Me";

// Common
import ErrorHandler from "../components/Common/ErrorHandler";
import LoadingAnimation from "../components/Common/LoadingAnimation";

// Pages
import Card from "../components/Card/Card";
import GetMyCard from "../components/Card/GetMyCard";
import Reviews from "../components/Reviews/Reviews";
import User from "../components/User/User";
import UserData from "../components/User/UserData";
import MyProfile from "../components/User/MyProfile";
import ItemsWrapper from "../components/Items/ItemsWrapper";
import Coupon from "../components/Coupon/Coupon";
import AllCoupon from "../components/Coupon/AllCoupons";
import SetDiscountPage from "../components/Coupon/SetDiscountPage";
import WhatsAppTemplates from "../components/WhatsApp/WhatsAppTemplates";
import RegistrationInfo from "../components/WhatsApp/RegistrationInfo";
import Dashboard from "../components/Dashboard/Dashboard";
import BlogListPage from "../components/Blog/BlogListPage";
import Setting from "../components/Setting/Setting";
import MediaRewards from "../components/SocialMedia/MediaRewards";
import SocialMedia from "../components/SocialMedia/SocialMedia";
import FlashHourOffer from "../components/FlashHourOffer/FlashHourOffer";
import Spinning from "../components/Spinning/Spinning";
import CrossBrand from "../components/CrossBrand/CrossBrand";
import MyPreset from "../components/CrossBrand/MyPreset";
import RedeemStore from "../components/RedeemStore/RedeemStore";
import Enquary from "../components/Enquary/Enquary";

// Layout Wrappers
const BlankLayout = ({ children }) => <div>{children}</div>;
const NotFound = () => <ErrorHandler />;
const ScrollToTop = ({ children }) => children;

// Private Route
const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 🔹 Define all routes here
const allRoutes = (role) => [
  // Public
  { url: "/login", element: Login, isProtected: false },
  { url: "/signup", element: SignupPage, isProtected: false },
  { url: "/forgot", element: ForgotPasswordPage, isProtected: false },
  { url: "/resetpassword/:token", element: ResetPasswordPage, isProtected: false },

  // Common (Protected)
  { url: "/me", element: Me, isProtected: true },
  { url: "/card/:cardId", element: () => <ItemsWrapper role={role} />, isProtected: true },
  { url: "/reviews", element: () => <Reviews role={role} />, isProtected: true },

  // Admin routes
  ...(role === "admin"
    ? [
        { url: "/card", element: Card, isProtected: true },
        { url: "/coupons", element: () => <AllCoupon role={role} />, isProtected: true },
        { url: "/blog", element: BlogListPage, isProtected: true },
        { url: "/setting", element: Setting, isProtected: true },
        {
          url: "/user/:userId",
          element: () => (
            <UserData>
              <MyProfile role={role} />
              <GetMyCard role={role} />
              <Coupon role={role} />
              <SetDiscountPage role={role} />
              <RedeemStore />
              <Enquary />
            </UserData>
          ),
          isProtected: true,
        },
      ]
    : []),

  // User routes
  ...(role !== "admin"
    ? [
        { url: "/dashboard", element: Dashboard, isProtected: true },
        { url: "/card", element: () => <GetMyCard role={role} />, isProtected: true },
        { url: "/coupon", element: () => <Coupon role={role} />, isProtected: true },
        { url: "/presets", element: () => <SetDiscountPage role={role} />, isProtected: true },
        { url: "/flashOffer", element: () => <FlashHourOffer role={role} />, isProtected: true },
        { url: "/media/allMedia", element: MediaRewards, isProtected: true },
        { url: "/media/setMedia", element: SocialMedia, isProtected: true },
        { url: "/spin", element: Spinning, isProtected: true },
        { url: "/cross-brand/store", element: CrossBrand, isProtected: true },
        { url: "/cross-brand/presets", element: MyPreset, isProtected: true },
        { url: "/whatsapp/templates", element: WhatsAppTemplates, isProtected: true },
        { url: "/whatsapp/registration", element: RegistrationInfo, isProtected: true },
      ]
    : []),
];

function Router() {
  const { userData, loading } = useUser();

  if (loading) return <LoadingAnimation />;

  const isAuthenticated = !!userData?.user;
  const role = userData?.user?.role || 'user';
  const routes = allRoutes(role);

  const renderRoutes = (routes) =>
    routes.map((item) => {
      const Element = item.element;
      let element;

      if (item.isProtected) {
        element = (
          <PrivateRoute isAuthenticated={isAuthenticated}>
            {role === "admin" ? <Admin><Element /></Admin> : <Main><Element /></Main>}
          </PrivateRoute>
        );
      } else {
        element = (
          <BlankLayout>
            <Element />
          </BlankLayout>
        );
      }

      return <Route key={item.url} path={item.url} element={element} />;
    });

  return (
    <ScrollToTop>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" ? <Navigate to="/card" /> : <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {renderRoutes(routes)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ScrollToTop>
  );
}

export default Router;
