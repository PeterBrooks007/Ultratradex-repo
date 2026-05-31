import { Navigate, Outlet, useNavigate } from "react-router-dom";
import WalletSidebar from "./WalletSidebar";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useScrollActivity from "../../hooks/useScrollActivity";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {
  getAllCoins,
  getLoginStatus,
  getUser,
  RESET_AUTH,
  updatePinRequired,
} from "../../redux/features/auth/authSlice";
import { getAllCoinpaprikaCoinPrices } from "../../redux/features/coinPrice/coinPriceSlice";
import { getAllUserTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import { useIdleTimer } from "react-idle-timer";
import { connectSocket, socket } from "../../socket";

const WalletRoot = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isScrolling = useScrollActivity();

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

  if (!isLoading && user?.pinRequired === true) {
    navigate("/auth/request-pin");
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

  useEffect(() => {
    dispatch(getAllUserTotalCounts());
  }, [dispatch, isLoggedIn]);
  

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
        const fifteenMinutesInMillis = 15 * 60 * 1000; // 15 minutes in milliseconds
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

  // useEffect(() => {
  //   const allCoinsData = localStorage.getItem("allCoins");

  //   if (allCoinsData) {
  //     const { savedAt } = JSON.parse(allCoinsData);

  //     // Convert `savedAt` to Date object and compare time difference
  //     const savedAtTime = new Date(savedAt).getTime();
  //     const currentTime = new Date().getTime();

  //     // Calculate the difference in hours (1000 ms * 60 sec * 60 min)
  //     const hoursDifference = (currentTime - savedAtTime) / (1000 * 60 * 60);

  //     //  console.log(`Hours difference: ${hoursDifference}`);

  //     // If more than 12 hours have passed, dispatch the action
  //     if (hoursDifference > 12) {
  //       dispatch(getAllCoins());
  //     }
  //   } else {
  //     // If no data exists in localStorage, dispatch the action immediately
  //     dispatch(getAllCoins());
  //   }
  // }, [dispatch]);

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
    <Box
      display={"flex"}
      flexDirection={"row"}
      backgroundColor={colors.dashboardbackground[100]}
      height={{ xs: `${size.height}px`, md: `${size.height}px` }}
      boxSizing={"border-box"}
      overflow={"hidden"}
    >
      <WalletSidebar isScrolling={isScrolling} />
      <Outlet />
    </Box>
  );
};

export default WalletRoot;
