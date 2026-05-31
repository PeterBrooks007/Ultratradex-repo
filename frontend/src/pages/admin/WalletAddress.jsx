import { Box, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "./adminComponents/Header";

import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";

import LoadingScreen from "../../components/LoadingScreen";
import WalletAddressTable from "./adminComponents/WalletAddressTable";
import AddWalletAddress from "./adminComponents/drawers/AddWalletAddress";
import { getAllWalletAddress } from "../../redux/features/walletAddress/walletAddressSlice";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";


const WalletAddress = () => {
  const dispatch = useDispatch();

  const { isLoading, allWalletAddress, isError, isSuccess } = useSelector(
    (state) => state.walletAddress
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
    if (allWalletAddress.length === 0 && isError === false && isSuccess === false ) {
      dispatch(getAllWalletAddress());
    }
  }, [dispatch, allWalletAddress.length, isError, isSuccess]);

  // AddWalletAddress Drawer
  const [walletAddressDrawerLoader, setWalletAddressDrawerLoader] = useState(false);

  const [openAddWalletAddressDrawer, setAddWalletAddressDrawer] = useState(false);

  const handleOpenAddWalletAddressDrawer = () => {
    setAddWalletAddressDrawer(true);
  };

  const handleCloseAddWalletAddressDrawer = () => {
    setAddWalletAddressDrawer(false);
  };

  // End AddWalletAddress Drawer


  const [pageLoading, setPageLoading] = useState(true);  // Track event loading




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
              title={"Wallet Address"}
              subtitle={"List of all Wallet Address"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setWalletAddressDrawerLoader(true);
                handleOpenAddWalletAddressDrawer()}
              }
                
            >
              ADD NEW WALLET
            </Button>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <WalletAddressTable />
          </Box>
        </Box>
      )}

      <AddWalletAddress
        open={openAddWalletAddressDrawer}
        handleClose={handleCloseAddWalletAddressDrawer}
        handleOpen={handleOpenAddWalletAddressDrawer}
        walletAddressDrawerLoader={walletAddressDrawerLoader}
        setWalletAddressDrawerLoader={setWalletAddressDrawerLoader}
      />

     
    </>
  );
};

export default WalletAddress;
