import { Box, Button, Stack,  } from "@mui/material";
import  { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import TradingSignalsTable from "./adminComponents/TradingSignalsTable";
import { getAllTradingSignals } from "../../redux/features/tradingSignals/tradingSignalsSlice";
import AddTradingSignal from "./adminComponents/drawers/AddTradingSignal";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const TradingSignals = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, tradingSignals } = useSelector(
    (state) => state.tradingSignals
  );
  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);


  useEffect(() => {
    if (tradingSignals.length === 0) {
      dispatch(getAllTradingSignals());
    }
  }, [dispatch]);

  // AddExpertTrader Drawer
  const [tradingSignalDrawerLoader, setTradingSignalDrawerLoader] =
    useState(false);

  const [openAddTradingSignalDrawer, setAddTradingSignalDrawer] = useState(false);

  const handleOpenTradingSignalDrawer = () => {
    setAddTradingSignalDrawer(true);
  };

  const handleCloseTradingSignalDrawer = () => {
    setAddTradingSignalDrawer(false);
  };

  // End AddExpertTrader Drawer


  return (
    <>
      {isLoading || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box height={"100%"} overflow={"auto"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            m={"20px"}
          >
            <Header
              title={"Trading Signal"}
              subtitle={"List of all Trading Signal"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setTradingSignalDrawerLoader(true);
                handleOpenTradingSignalDrawer();
              }}
            >
              ADD NEW SIGNAL
            </Button>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <TradingSignalsTable />
          </Box>
        </Box>
      )}

      <AddTradingSignal
        open={openAddTradingSignalDrawer}
        handleClose={handleCloseTradingSignalDrawer}
        handleOpen={handleOpenTradingSignalDrawer}
        tradingSignalDrawerLoader={tradingSignalDrawerLoader}
        setTradingSignalDrawerLoader={setTradingSignalDrawerLoader}
      />
    </>
  );
};

export default TradingSignals;
