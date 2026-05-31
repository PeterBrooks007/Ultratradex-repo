import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";

import { useEffect } from "react";

import WalletHomeSkeleton from "./walletSkeletons/WalletHomeSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import { WalletRight } from "../../components/WalletRight";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import WalletLeft from "../../components/WalletLeft";

const WalletHome = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  return (
    <>
      {appLoading || isLoading || !user ? (
        <WalletHomeSkeleton />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "15px", md: "20px" }}
          sx={{ overflowX: "hidden" }}
          // overflow={"auto"}
          className="scrollable-element"
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
            // mb={{xs: 10, md: 0}}
            // gap={2}
          >
            <Box
              flex={{ xs: "100%", lg: "30%", xl: "25%" }}
              sx={{ overflowY: "auto", overflowX: "hidden" }}
              pb={{ xs: 20, sm: 20, md: 0 }}
            >
              <WalletLeft />
            </Box>

            {size.width > 1200 && (
              <Box
                flex={{ xs: "100%", lg: "70%", xl: "75%" }}
                // backgroundColor="red"
                overflow={"hidden"}
                display={{ xs: "none", md: "flex" }}
                p={"15px"}
                ml={"20px"}
                // border={"1px solid grey"}
                borderRadius={"20px"}
              >
                <WalletRight />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default WalletHome;
