import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import {
  getAllCoins,
  getLoginStatus,
  getUser,
  RESET_AUTH,
  updatePinRequired,
} from "../../redux/features/auth/authSlice";
import { getAllUserTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import AccountLockModal from "../../components/AccountLockModal";
import { connectSocket, socket } from "../../socket";
import { getAllCoinpaprikaCoinPrices } from "../../redux/features/coinPrice/coinPriceSlice";

const DashboardRoot = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);

  //socket connection
  useEffect(() => {
    if (isLoggedIn && user?._id) {
      if (!socket) {
        connectSocket(user?._id); // Ensure connectSocket initializes the socket
      }

      if (socket) {
        // Register socket ID with server
        socket.emit("registerSocket", user?._id);

        // Notify server the user is online
        socket.emit("userOnline", user?._id);

       

        // Cleanup event listeners only
        return () => {
          socket?.off("updateStatus");
        };
      }
    }
  }, [isLoggedIn, user?._id]);

  //lock modal
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

   useEffect(() => {
      dispatch(getLoginStatus());
    }, [dispatch, isLoggedIn]);
  

  if (!isLoading && isLoggedIn === false) {
    navigate("/auth/login");
  }

  if (isLoggedIn && user && user?.isEmailVerified === false) {
    navigate("/auth/verify-email");
    dispatch(RESET_AUTH());
    return;
  }

  if (
    !isLoading &&
    user &&
    (user?.isIdVerified === "NOT VERIFIED" || user?.isIdVerified === "PENDING")
  ) {
    navigate("/auth/account-setup");
    dispatch(RESET_AUTH());
  }

  if (!isLoading && user?.pinRequired === true) {
    navigate("/auth/request-pin");
  }

  useEffect(() => {
    if (
      !isLoading &&
      (user?.accountLock.generalLock === true ||
        user?.accountLock.upgradeLock === true ||
        user?.accountLock.signalLock === true)
    ) {
      setOpen(true);
    }
  }, [user, isLoading]);

  useEffect(() => {
    dispatch(getAllUserTotalCounts());
  }, [dispatch, isLoggedIn]);


  

  //useeffect for getting allCoinpaprica allCoins price
    useEffect(() => {
      if (!user?.currency?.code) {
        return; // Exit early if user data is not yet available
      }
  
      const checkAndUpdatePrices = () => {
        const allCoinpaprikaCoinPricesData = localStorage.getItem(
          "allCoinpaprikaCoinPrices"
        );
  
        if (allCoinpaprikaCoinPricesData) {
          const { savedAt, data } = JSON.parse(allCoinpaprikaCoinPricesData);
  
          // Check if the data array is empty
          const isDataEmpty = !data || data.length === 0;
  
          // Check if any of the data's quote matches the user's currency code
          const doesCurrencyMatch = data.some(
            (coin) => coin.quotes[user?.currency?.code]
          );
  
          // console.log(doesCurrencyMatch);
  
          // Convert `savedAt` to Date object and compare time difference
          const savedAtTime = new Date(savedAt).getTime();
          const currentTime = new Date().getTime();
          const fifteenMinutesInMillis = 20 * 60 * 1000; // 15 minutes in milliseconds
          const timestampPlusFifteenMinutes =
            savedAtTime + fifteenMinutesInMillis;
  
          const hasTimePassedFifteenMinutes =
            currentTime > timestampPlusFifteenMinutes;
  
          // If more than 15 minutes have passed, data is empty, or currency doesn't match
          if (hasTimePassedFifteenMinutes || isDataEmpty || !doesCurrencyMatch) {
            dispatch(getAllCoinpaprikaCoinPrices());
          }
        } else {
          // If no data exists in localStorage, dispatch the action immediately
          dispatch(getAllCoinpaprikaCoinPrices());
        }
      };
  
      // Initial check
      checkAndUpdatePrices();
  
      // Set an interval to repeat the check every 15 minutes
      const intervalId = setInterval(() => {
        checkAndUpdatePrices();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
  
      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }, [dispatch, user?.currency?.code]);



    //code if user is Idle
  const idleTimerRef = useRef(null);
  const ONE_MINUTE = 60000; // 1 minute in milliseconds
  const FIVE_MINUTES = 3 * ONE_MINUTE; // 5 minutes in milliseconds

  const handleIdle = async () => {
    dispatch(updatePinRequired({ pinRequired: true }));
  };

  // Initialize the idle timer
  useIdleTimer({
    ref: idleTimerRef,
    timeout: FIVE_MINUTES,
    onIdle: handleIdle, // Make API call when idle
    // onActive: handleActive, // Make API call when active
    debounce: 500, // Debounce to reduce unnecessary calls
  });

   // end of code if user is Idle


  useEffect(() => {
    const allCoinsData = localStorage.getItem("allCoins");

    if (allCoinsData) {
      const { savedAt } = JSON.parse(allCoinsData);

      // Convert `savedAt` to Date object and compare time difference
      const savedAtTime = new Date(savedAt).getTime();
      const currentTime = new Date().getTime();
      const sixHoursInMillis = 6 * 60 * 60 * 1000;

      const timestampPlusSixHours = savedAtTime + sixHoursInMillis;

      const hasTimePassedSixHours = currentTime > timestampPlusSixHours;

      // console.log("hasTimePassed24Hours", hasTimePassedSixHours);

      // If more than 6 hours have passed, dispatch the action
      if (hasTimePassedSixHours) {
        dispatch(getAllCoins());
      }
    } else {
      // If no data exists in localStorage, dispatch the action immediately
      dispatch(getAllCoins());
    }
  }, [dispatch]);

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"row"}
        backgroundColor={colors.dashboardbackground[100]}
        boxSizing={"border-box"}
        height={{ xs: `${size.height}px`, md: `${size.height}px` }}
        overflow={"hidden"}
      >
        <DashboardSidebar isScrolling={false} />
        <Outlet />
      </Box>

      {open && <AccountLockModal open={open} />}
    </>
  );
};

export default DashboardRoot;
