import { Box, Button, Stack,  } from "@mui/material";
import  { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";

import AddConnectWallet from "./adminComponents/drawers/AddConnectWallet";
import ConnectWalletTable from "./adminComponents/ConnectWalletTable";
import { getAllConnectWallet } from "../../redux/features/connectWallet/connectWalletSlice";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const ConnectWallet = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, wallets } = useSelector(
    (state) => state.connectWallet
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
    if (wallets.length === 0) {
      dispatch(getAllConnectWallet());
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
      {isLoading || pageLoading? (
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
              title={"Connect Wallets"}
              subtitle={"List of all wallets user can connect"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setTradingBotDrawerLoader(true);
                handleOpenTradingbotDrawer();
              }}
            >
              ADD NEW WALLET
            </Button>
          </Stack>

          <Box mx={{ xs: "5px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <ConnectWalletTable />
          </Box>
        </Box>
      )}

      <AddConnectWallet
        open={openAddTradingbotDrawer}
        handleClose={handleCloseTradingbotDrawer}
        handleOpen={handleOpenTradingbotDrawer}
        tradingBotDrawerLoader={tradingBotDrawerLoader}
        setTradingBotDrawerLoader={setTradingBotDrawerLoader}
      />
    </>
  );
};

export default ConnectWallet;
