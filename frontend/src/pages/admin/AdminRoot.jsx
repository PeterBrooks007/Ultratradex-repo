import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import {
  getAllCoins,
  getLoginStatus,
  getUser,
  SETALLUSERS,
  SETSINGLEUSERS,
  updatePinRequired,
} from "../../redux/features/auth/authSlice";
import { connectSocket, socket } from "../../socket";
import { useIdleTimer } from "react-idle-timer";
// import Topbar from "./Topbar";

const AdminRoot = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:899px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedIn, isLoading, singleUser } = useSelector(
    (state) => state.auth
  );

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

        socket.on("updateStatus", (data) => {
          // console.log("data", data);
          dispatch(SETALLUSERS(data.allUser));
          // dispatch(SETSINGLEUSERS(data.singleUser));
          
        });

        // Cleanup event listeners only
        return () => {
          socket?.off("updateStatus");
        };
      }
    }
  }, [isLoggedIn, user?._id, dispatch]);

  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  if (!isLoading && isLoggedIn === false) {
    navigate("/auth/login");
  }

  if (!isLoading && user?.pinRequired === true) {
    navigate("/auth/request-pin");
  }

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    const allCoinsData = localStorage.getItem("allCoins");

    if (allCoinsData) {
      const { savedAt } = JSON.parse(allCoinsData);

      // Convert `savedAt` to Date object and compare time difference
      const savedAtTime = new Date(savedAt).getTime();
      const currentTime = new Date().getTime();
      const sixHoursInMillis = 24 * 60 * 60 * 1000;

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

  return (
    <>
      {user && user?.role !== "admin" ? (
        <Box p={4}>
          <Typography variant="h6">
            You do not have Permission to view this Page
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"row"}
          height={"100vh"}
          overflow={"hidden"}
          width={"100%"}
        >
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <Box width={"100%"}>
            <Topbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <Outlet />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AdminRoot;
