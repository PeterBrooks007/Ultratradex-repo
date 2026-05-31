import { Box, Stack, Typography } from "@mui/material";
import { CryptoImages } from "../../../data";
import { ArrowDown } from "@phosphor-icons/react";
import CoinDetailsDrawer from "../../../components/drawers/CoinDetailsDrawer";
import { SETSELECTEDCOIN } from "../../../redux/features/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FavouriteCryptoAssets = () => {
  const dispatch = useDispatch();

  const [coinDetailsLoader, setCoinDetailsLoader] = useState(false);
  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);

  // Coin Details Drawer
  const handleOpenCoinDetailsDrawer = () => {
    setCoinDetailsDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseCoinDetailsDrawer = () => {
    setCoinDetailsDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Clean up when the component is unmounted
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          width={"100%"}
          minHeight={"500px"}
          // onClick={() => {
          //   dispatch(SETSELECTEDCOIN(coin));
          //   setCoinDetailsLoader(true);
          //   handleOpenCoinDetailsDrawer();
          // }}
        >
          Nothing found
          
          {/* <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
            <Box>
              <img src={CryptoImages[0].url} width={"45px"} alt="bitcoin" />
            </Box>
            <Stack>
              <Typography variant="subtitle2">Bitcoin</Typography>
              <Typography variant="subtitle1">BTC</Typography>
            </Stack>
          </Stack>

          <Stack textAlign={"right"}>
            <Typography variant="subtitle1">US$65,786.00</Typography>
            <Stack
              direction={"row"}
              justifyContent={"end"}
              alignItems={"center"}
              color="red"
            >
              <ArrowDown />
              <Typography variant="subtitle2">1.82%</Typography>
            </Stack>
          </Stack> */}
          
        </Stack>
      </Stack>

      <CoinDetailsDrawer
        open={openCoinDetailsDrawer}
        handleClose={handleCloseCoinDetailsDrawer}
        handleOpen={handleOpenCoinDetailsDrawer}
        coinDetailsLoader={coinDetailsLoader}
        setCoinDetailsLoader={setCoinDetailsLoader}
      />
    </>
  );
};

export default FavouriteCryptoAssets;
