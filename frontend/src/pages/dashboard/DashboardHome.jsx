import { useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import { tokens } from "../../theme";
import MarketNewsWidgets from "../../components/TradeviewWidgets/MarketNewsWidgets";
import CryptoTrending from "./dashboardComponents/CryptoTrending";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import Welcome from "./dashboardComponents/Welcome";
import MarketOverview from "./dashboardComponents/MarketOverview";
import QuickTrade from "./dashboardComponents/QuickTrade";
import TradeHistory from "./dashboardComponents/TradeHistory";
import TradeHistoryChart from "./dashboardComponents/TradeHistoryChart";
import DashboardHomeSkeleton from "./dashboardSkeletons/DashboardHomeSkeleton";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import UseWindowSize from "../../hooks/UseWindowSize";

const DashboardHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const { isLoading: appLoading } = useSelector((state) => state.app);
  const { user, isLoading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  // useEffect(() => {
  //   // dispatch(SET_ISLOADING_TRUE());
  //   const performanceTime = measurePerformance();
  //   const timeoutDuration = performanceTime < 50 ? 300 : 300; // Adjust these values based on your testing

  //   let timer;
  //   if (user) { //remove the || !user after all works
  //     timer = setTimeout(() => {
  //       dispatch(SET_ISLOADING_FALSE());
  //     }, timeoutDuration);
  //   }

  //   // Cleanup function to clear the timeout if the component unmounts
  //   return () => clearTimeout(timer);

  // }, [user, dispatch]); // Added dependencies

  return (
    <>
      {appLoading || isLoading || !user ? (
        <DashboardHomeSkeleton />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          // height={"96vh"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "15px", md: "20px" }}
          overflow={"auto"}
          sx={{ overflowX: "hidden" }}
        >
          <Box
            mb={{ xs: 1.5, md: 3 }}
            mt={"-15px"}
            mx={"-15px"}
            borderBottom={
              theme.palette.mode === "light"
                ? "2px solid rgba(108, 108, 108, 0.2)"
                : "2px solid rgba(108, 108, 108, 0.2)"
            }
          >
            <TickerTapeWidget />
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            gap={2}
          >
            <Welcome />
            <CryptoTrending />
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            mt={2}
          >
            <MarketOverview />
            {size.width > 899 && <QuickTrade />}
          </Box>

          <Box
            display={"flex"}
            flexWrap={"wrap"}
            flexDirection={{ xs: "column", md: "row", lg: "row" }}
            gap={2}
            mt={2}
          >
            <TradeHistory />
            <TradeHistoryChart />
            <Box
              flex={{ xs: "", md: "100%" }}
              width={"100%"}
              height={{ xs: "450px", md: "500px" }}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]}`
              }
              borderRadius={"10px"}
            >
              <Box overflow={"hidden"} height={{ xs: "430px", md: "100%" }}>
                <MarketNewsWidgets />
              </Box>
            </Box>
            <Box mt={{ xs: 15, md: 0 }}></Box>
          </Box>
        </Box>
      )}
      
    </>
  );
};

export default DashboardHome;
