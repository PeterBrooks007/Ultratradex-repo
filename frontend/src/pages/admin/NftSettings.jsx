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
import AddNft from "./adminComponents/drawers/AddNft";
import NftSettingsTable from "./adminComponents/NftSettingsTable";
import { getAllNfts } from "../../redux/features/nftSettings/nftSettingsSlice";

const NftSettings = () => {
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, allNfts } = useSelector(
    (state) => state.nftSettings
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
    if (allNfts.length === 0) {
      dispatch(getAllNfts());
    }
  }, [dispatch]);

  // AddnftSettingsDrawer
  const [nftSettingsDrawerLoader, setNftSettingsDrawerLoader] = useState(false);

  const [openAddNftSettingsDrawer, setAddNftSettingsDrawer] = useState(false);

  const handleOpenAddNftSettingsDrawer = () => {
    setAddNftSettingsDrawer(true);
  };

  const handleCloseAddNftSettingsDrawer = () => {
    setAddNftSettingsDrawer(false);
  };

  // End AddnftSettingsDrawer



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
              title={"All Nfts"}
              subtitle={"List of all added Nfts"}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setNftSettingsDrawerLoader(true);
                handleOpenAddNftSettingsDrawer()}
              }
                
            >
              ADD NEW NFT
            </Button>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <NftSettingsTable />
          </Box>
        </Box>
      )}

      <AddNft
        open={openAddNftSettingsDrawer}
        handleClose={handleCloseAddNftSettingsDrawer}
        handleOpen={handleOpenAddNftSettingsDrawer}
        nftSettingsDrawerLoader={nftSettingsDrawerLoader}
        setNftSettingsDrawerLoader={setNftSettingsDrawerLoader}
      />

     
    </>
  );
};

export default NftSettings;
