import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import DashboardHomeSkeleton from "../pages/dashboard/dashboardSkeletons/DashboardHomeSkeleton";
import WalletHomeSkeleton from "../pages/walletDashboard/walletSkeletons/WalletHomeSkeleton";
import TradesSkeletons from "../pages/dashboard/dashboardSkeletons/TradesSkeletons";


import AdminRoot from "../pages/admin/AdminRoot";
import AdminHome from "../pages/admin/AdminHome";
import AuthSidebar from "../pages/auth/AuthSidebar";
import GetStartedSlider from "../components/getStartedSlider/GetStartedSlider";
// import NftSettings from "../pages/admin/NftSettings";
// import AllUsers from "../pages/admin/AllUsers";
// import UserDetails from "../pages/admin/UserDetails";
// import ExpertTraders from "../pages/admin/ExpertTraders";
// import MailBox from "../pages/admin/MailBox";
// import DepositRequest from "../pages/admin/DepositRequest";
// import WithdrawalRequest from "../pages/admin/WithdrawalRequest";
// import TradeSettings from "../pages/admin/TradeSettings";
// import Currencies from "../pages/admin/Currencies";
// import TradingBots from "../pages/admin/TradingBots";
// import TradingSignals from "../pages/admin/TradingSignals";
// import WalletAddress from "../pages/admin/WalletAddress";
// import ChangePassword from "../pages/admin/ChangePassword";
// import TwofaAuthentication from "../pages/admin/2faAuthentication";
// import Calendar from "../pages/admin/Calendar";
// import ConnectWallet from "../pages/admin/ConnectWallet";

// import AuthHeader from "../pages/auth/AuthHeader"
// import DashboardRoot from "../pages/dashboard/DashboardRoot"
// import Home from "../pages/home/Home"
// import DashboardHome from "../pages/dashboard/DashboardHome"
// import Trades from "../pages/dashboard/Trades"
// import WalletHome from "../pages/walletDashboard/WalletHome"
// import Prices from "../pages/dashboard/Prices";
// import Profile from "../pages/dashboard/Profile";
// import Nfts from "../pages/walletDashboard/Nfts";
// import WalletRoot from "../pages/walletDashboard/WalletRoot";
// import Assets from "../pages/walletDashboard/Assets";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import RequestPin from "../pages/auth/RequestPin";
// import Mailbox from "../pages/dashboard/Mailbox";




// const Loadable = (Component) => (props) => {
//   return (
//     <Suspense fallback={<LoadingScreen />}>
//       <Component {...props} />
//     </Suspense>
//   );
// };


const Loadable = (Component, FallbackComponent) => (props) => {
  return (
    <Suspense fallback={FallbackComponent ? <FallbackComponent /> : <LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};


// const About = Loadable(lazy(() => import('../pages/home/About')), CustomFallback);



// const AuthSidebar = Loadable(lazy(() => import('../pages/auth/AuthSidebar')));
const DashboardRoot = Loadable(lazy(() => import('../pages/dashboard/DashboardRoot')));
const Home = Loadable(lazy(() => import('../pages/home/Home')));
const DashboardHome = Loadable(lazy(() => import('../pages/dashboard/DashboardHome')), DashboardHomeSkeleton);
const Trades = Loadable(lazy(() => import('../pages/dashboard/Trades')), TradesSkeletons );
const WalletRoot = Loadable(lazy(() => import('../pages/walletDashboard/WalletRoot')));
const WalletHome = Loadable(lazy(() => import('../pages/walletDashboard/WalletHome')), WalletHomeSkeleton);
const Prices = Loadable(lazy(() => import('../pages/dashboard/Prices')));
const Profile = Loadable(lazy(() => import('../pages/dashboard/Profile')));
const Nfts = Loadable(lazy(() => import('../pages/walletDashboard/Nfts')));

const Assets = Loadable(lazy(() => import('../pages/walletDashboard/Assets')));
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const RequestPin = Loadable(lazy(() => import('../pages/auth/RequestPin')));
const Mailbox = Loadable(lazy(() => import('../pages/dashboard/Mailbox')));


// const AdminRoot = Loadable(lazy(() => import("../pages/admin/AdminRoot")));
// const AdminHome = Loadable(lazy(() => import("../pages/admin/AdminHome")));
const AllUsers = Loadable(lazy(() => import("../pages/admin/AllUsers")));
const UserDetails = Loadable(lazy(() => import("../pages/admin/UserDetails")));
const ExpertTraders = Loadable(lazy(() => import("../pages/admin/ExpertTraders")));
const MailBox = Loadable(lazy(() => import("../pages/admin/MailBox")));
const DepositRequest = Loadable(lazy(() => import("../pages/admin/DepositRequest")));
const WithdrawalRequest = Loadable(lazy(() => import("../pages/admin/WithdrawalRequest")));
const TradeSettings = Loadable(lazy(() => import("../pages/admin/TradeSettings")));
const Currencies = Loadable(lazy(() => import("../pages/admin/Currencies")));
const TradingBots = Loadable(lazy(() => import("../pages/admin/TradingBots")));
const TradingSignals = Loadable(lazy(() => import("../pages/admin/TradingSignals")));
const WalletAddress = Loadable(lazy(() => import("../pages/admin/WalletAddress")));
const ChangePassword = Loadable(lazy(() => import("../pages/admin/ChangePassword")));
const TwofaAuthentication = Loadable(lazy(() => import("../pages/admin/2faAuthentication")));
const Calendar = Loadable(lazy(() => import("../pages/admin/Calendar")));
const ConnectWallet = Loadable(lazy(() => import('../pages/admin/ConnectWallet')));
const NftSettings = Loadable(lazy(() => import('../pages/admin/NftSettings')));







const About = Loadable(lazy(() => import('../pages/home/About')));
const Terms = Loadable(lazy(() => import('../pages/home/Terms')));
const PrivacyPolicy = Loadable(lazy(() => import('../pages/home/PrivacyPolicy')));
const ContactUs = Loadable(lazy(() => import('../pages/home/ContactUs')));

const Root = Loadable(lazy(() => import('../pages/home/Root')));
const VerifyEmail = Loadable(lazy(() => import('../pages/auth/VerifyEmail')));
const AccountSetup = Loadable(lazy(() => import('../pages/auth/AccountSetup')));
const IdVerification = Loadable(lazy(() => import('../pages/auth/IdVerification')));
const IdReview = Loadable(lazy(() => import('../pages/auth/IdReview')));
const TwoFactorAuthentication = Loadable(lazy(() => import('../pages/auth/TwoFactorAuthentication')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));

// const Trades = Loadable(lazy(() => import('../pages/dashboard/Trades')));


export default function Router() {
    return useRoutes([
      // {
      //   path: "/",
      //   element: <AuthSidebar />,
      //   children: [
      //     { path: "/", element: <Register /> },
      //     { path: "about", element: <About /> },
      //   ],
      // },
      {
        path: "/",
        element: <Root />,
        children: [
          { path: "/", element: <Home /> },
          { path: "about", element: <About /> },
          { path: "terms", element: <Terms /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "contact-us", element: <ContactUs /> },
        ],
      },
      {
        path: "/auth",
        element: <AuthSidebar />,
        children: [
          { element: <Login />, path: "login" },
          { element: <Register />, path: "register" },
          { element: <GetStartedSlider />, path: "get-started" },
          { element: <VerifyEmail />, path: "verify-email" },
          { element: <AccountSetup />, path: "account-setup" },
          { element: <IdVerification />, path: "id-verification" },
          { element: <IdReview />, path: "id-review" },
          { element: <RequestPin />, path: "request-pin" },          
          { element: <TwoFactorAuthentication />, path: "2faAuthentication" },          
          { element: <ForgotPassword />, path: "forgot-password" },          
          { element: <ResetPassword />, path: "reset-password/:token" },          

        ],
      },
      {
        path: "/dashboard",
        element: <DashboardRoot />,
        children: [
          { element: <DashboardHome />, path: "" },          
          { element: <DashboardHome />, path: "home" },          
          { element: <Trades />, path: "livetrades" },          
          { element: <Prices />, path: "prices" },          
          { element: <Profile />, path: "profile" },          
          { element: <Mailbox />, path: "mailbox" },          
         
        ],
      },
      {
        path: "/wallet",
        element: <WalletRoot />,
        children: [
          { element: <WalletHome />, path: "" },          
          { element: <WalletHome />, path: "home" },          
          { element: <Nfts />, path: "nfts" },          
          { element: <Assets />, path: "assets" },          
         
        ],
      },

      {
        path: "/admin",
        element: <AdminRoot />,
        children: [
          { element: <AdminHome />, path: "" },          
          { element: <AdminHome />, path: "home" },          
          { element: <AllUsers />, path: "all-users" },          
          { element: <UserDetails />, path: "user-details/:id" },          
          { element: <Calendar />, path: "calendar" },          
          { element: <ExpertTraders />, path: "expert-traders" },          
          { element: <MailBox />, path: "mailbox" },          
          { element: <DepositRequest />, path: "deposit-request" },          
          { element: <WithdrawalRequest />, path: "withdrawal-request" },          
          { element: <TradeSettings />, path: "trade-settings" },          
          { element: <Currencies />, path: "currencies-settings" },          
          { element: <TradingBots />, path: "trading-bots" },          
          { element: <TradingSignals />, path: "trading-signals" },          
          { element: <WalletAddress />, path: "wallet-address" },          
          { element: <ChangePassword />, path: "change-password" },          
          { element: <TwofaAuthentication />, path: "2fa-authentication" },          
          { element: <ConnectWallet />, path: "connect-wallet" },          
          { element: <NftSettings />, path: "nfts" },          
         
        ],
      },
      { path: "*", element: <Navigate to="/404" replace /> },
    ]);
  }