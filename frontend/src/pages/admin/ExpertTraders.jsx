import { Box, Button, Stack } from "@mui/material";
import  { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import ExpertTradersTable from "./adminComponents/ExpertTradersTable";
import AddExpertTrader from "./adminComponents/drawers/AddExpertTrader";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import { getAllExpertTraders } from "../../redux/features/expertTraders/expertTradersSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const ExpertTraders = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, expertTraders } = useSelector(
    (state) => state.expertTraders
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
    if (expertTraders.length === 0) {
      dispatch(getAllExpertTraders());
    }
  }, [dispatch, expertTraders.length]);

  // AddExpertTrader Drawer
  const [expertTraderDrawerLoader, setExpertTraderDrawerLoader] = useState(false);

  const [openAddExpertTraderDrawer, setAddExpertTraderDrawer] = useState(false);

  const handleOpenAddExpertTraderDrawer = () => {
    setAddExpertTraderDrawer(true);
  };

  const handleCloseAddExpertTraderDrawer = () => {
    setAddExpertTraderDrawer(false);
  };

  // End AddExpertTrader Drawer



  return (
    <>
      {isLoading || pageLoading  ? (
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
              title={"Expert Traders"}
              subtitle={"List of all Expert Traders"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setExpertTraderDrawerLoader(true);
                handleOpenAddExpertTraderDrawer()}
              }
                
            >
              ADD NEW TRADER
            </Button>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <ExpertTradersTable />
          </Box>
        </Box>
      )}

      <AddExpertTrader
        open={openAddExpertTraderDrawer}
        handleClose={handleCloseAddExpertTraderDrawer}
        handleOpen={handleOpenAddExpertTraderDrawer}
        expertTraderDrawerLoader={expertTraderDrawerLoader}
        setExpertTraderDrawerLoader={setExpertTraderDrawerLoader}
      />

     
    </>
  );
};

export default ExpertTraders;
