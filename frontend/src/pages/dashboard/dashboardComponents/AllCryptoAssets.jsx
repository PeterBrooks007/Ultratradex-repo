import { Box, Stack, Typography } from "@mui/material";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import CoinDetailsDrawer from "../../../components/drawers/CoinDetailsDrawer";
import { SETSELECTEDCOIN } from "../../../redux/features/auth/authSlice";
import { useEffect, useState } from "react";

const AllCryptoAssets = ({ filteredAllCoins }) => {
  const dispatch = useDispatch();

  const [coinDetailsLoader, setCoinDetailsLoader] = useState(false);
  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);

  const { user, conversionRate } = useSelector((state) => state.auth);

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

  // Each row item component for rendering
  const Row = ({ index, style }) => {
    const coin = filteredAllCoins[index];
    const isLastItem = index === filteredAllCoins.length - 1;
    // console.log(`Rendering row ${index}`);

    return (
      <Stack
        key={index}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
        style={{
          ...style, // This ensures proper positioning from react-window
          paddingBottom: isLastItem ? "156px" : "0", // Add extra padding to the last item
          paddingTop: isLastItem ? "36px" : "0", // Add extra padding to the last item
        }}
        onClick={() => {
          dispatch(SETSELECTEDCOIN(coin));
          setCoinDetailsLoader(true);
          handleOpenCoinDetailsDrawer();
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img
              src={coin?.image}
              width={"45px"}
              alt={coin?.name}
              style={{ backgroundColor: "lightgrey", borderRadius: "50%" }}
            />
          </Box>
          <Stack>
            <Typography variant="subtitle2">{coin?.name}</Typography>
            <Typography variant="subtitle1">{coin?.symbol}</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle1">
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate?.code,
                  ...(coin?.current_price * conversionRate?.rate > 9999999
                    ? { notation: "compact" }
                    : {}),
                }).format(coin?.current_price * conversionRate?.rate)
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code,
                  ...(coin?.current_price > 9999999
                    ? { notation: "compact" }
                    : {}),
                }).format(coin?.current_price)}
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"end"}
            alignItems={"center"}
            color={`${
              coin?.price_change_percentage_24h < 0 ? "red" : "springgreen"
            }`}
          >
            {coin?.price_change_percentage_24h < 0 ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )}
            <Typography
              variant="subtitle2"
              color={`${
                coin?.price_change_percentage_24h < 0 ? "red" : "springgreen"
              }`}
            >
              {Number(coin?.price_change_percentage_24h).toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      <Box sx={{ height: "70vh", overflow: "auto" }}>
        {/* Make the list scrollable within 80% of the viewport height */}
        <List
          height={640} // Height of the virtualized list (can adjust based on your design)
          itemCount={filteredAllCoins?.length} // Number of coins to render
          itemSize={80} // Height of each row (adjust this based on your layout)
          width={"100%"} // Set to the full width of the parent container
        >
          {Row}
        </List>
      </Box>

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

export default AllCryptoAssets;
