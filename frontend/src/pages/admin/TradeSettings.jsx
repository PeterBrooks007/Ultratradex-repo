import { Box, Button, Stack,  } from "@mui/material";
import  { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";

import TradeSettingsTable from "./adminComponents/TradeSettingsTable";
import AddExchangeType from "./adminComponents/drawers/AddExchangeType";
import { getAllTradingSetting } from "../../redux/features/tradingSettings/tradingSettingsSlice";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const TradeSettings = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, allExchanges } = useSelector(
    (state) => state.tradingSettings
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
    if (allExchanges.length === 0) {
      dispatch(getAllTradingSetting());
    }
  }, [dispatch]);

  // AddExpertTrader Drawer
  const [exchangeTypeDrawerLoader, setExchangeTypeDrawerLoader] =
    useState(false);

  const [openAddExchangeTypeDrawer, setAddExchangeTypeDrawer] = useState(false);

  const handleOpenAddExchangeTypeDrawer = () => {
    setAddExchangeTypeDrawer(true);
  };

  const handleCloseAddExchangeTypeDrawer = () => {
    setAddExchangeTypeDrawer(false);
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
              title={"Trade Settings"}
              subtitle={"List of all Trade Exchange and Trading pairs"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setExchangeTypeDrawerLoader(true);
                handleOpenAddExchangeTypeDrawer();
              }}
            >
              ADD NEW EXCHANGE
            </Button>
          </Stack>

          <Box mx={{ xs: "5px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <TradeSettingsTable />
          </Box>
        </Box>
      )}

      <AddExchangeType
        open={openAddExchangeTypeDrawer}
        handleClose={handleCloseAddExchangeTypeDrawer}
        handleOpen={handleOpenAddExchangeTypeDrawer}
        exchangeTypeDrawerLoader={exchangeTypeDrawerLoader}
        setExchangeTypeDrawerLoader={setExchangeTypeDrawerLoader}
      />
    </>
  );
};

export default TradeSettings;
