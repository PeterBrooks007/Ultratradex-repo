import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Router from "./routes/Index";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus, getUser } from "./redux/features/auth/authSlice";
import useOnlineStatus from "./hooks/useOnlineStatus";
import LoadingScreen from "./components/LoadingScreen";

const App = () => {
  const [theme, colorMode] = useMode();
  axios.defaults.withCredentials = true;
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isOnline = useOnlineStatus();

 
  // useEffect(() => {
  //   if (isLoggedIn && user === null) {
  //     dispatch(getUser());
  //   }
  // }, [dispatch, isLoggedIn, user]);


  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate an initial app loading delay
  //   const loadApp = setTimeout(() => {
  //     setIsLoading(false); // Switch off the loading state after resources load
  //   }, 500); // Set the time based on the real loading scenario

  //   return () => clearTimeout(loadApp); // Clean up the timeout when the component unmounts
  // }, []);

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }


  

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <Router />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
