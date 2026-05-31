import { Box, Button, Stack,  } from "@mui/material";
import  { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import TradingBotsTable from "./adminComponents/TradingBotsTable";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AddTradingBot from "./adminComponents/drawers/AddTradingBot";
import { getAllTradingBots } from "../../redux/features/tradingBots/tradingBotsSlice";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const TradingBots = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, tradingBots } = useSelector(
    (state) => state.tradingBots
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
    if (tradingBots.length === 0) {
      dispatch(getAllTradingBots());
    }
  }, [dispatch]);

  // AddExpertTrader Drawer
  const [tradingBotDrawerLoader, setTradingBotDrawerLoader] =
    useState(false);

  const [openAddTradingbotDrawer, setAddTradingbotDrawer] = useState(false);

  const handleOpenTradingbotDrawer = () => {
    setAddTradingbotDrawer(true);
  };

  const handleCloseTradingbotDrawer = () => {
    setAddTradingbotDrawer(false);
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
              title={"Trading Bots"}
              subtitle={"List of all Trading Bots"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setTradingBotDrawerLoader(true);
                handleOpenTradingbotDrawer();
              }}
            >
              ADD NEW BOT
            </Button>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <TradingBotsTable />
          </Box>
        </Box>
      )}

      <AddTradingBot
        open={openAddTradingbotDrawer}
        handleClose={handleCloseTradingbotDrawer}
        handleOpen={handleOpenTradingbotDrawer}
        tradingBotDrawerLoader={tradingBotDrawerLoader}
        setTradingBotDrawerLoader={setTradingBotDrawerLoader}
      />
    </>
  );
};

export default TradingBots;
