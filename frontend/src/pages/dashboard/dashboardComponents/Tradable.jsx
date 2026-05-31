import { Box, Stack, Typography, useTheme } from "@mui/material";
import { ArrowDown, ArrowRight, ArrowUp } from "@phosphor-icons/react";
import { tokens } from "../../../theme";
import TradableCryptoAssets from "./TradableCryptoAssets";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CoinDetailsDrawer from "../../../components/drawers/CoinDetailsDrawer";
import { SETSELECTEDCOIN } from "../../../redux/features/auth/authSlice";

const Tradable = ({ filteredAllCoins }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const {user, allCoins, conversionRate } = useSelector((state) => state.auth);
  const [coinDetailsLoader, setCoinDetailsLoader] = useState(false);
  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);

  const firstSix = Array.isArray(allCoins) ? allCoins.slice(0, 6) : [];

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
      <Stack spacing={4}>
        <Stack>
          <Typography pl={2} pb={0.5}>
            Top Crypto 🔥
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            overflow={"auto"}
            gap={2}
            p={0.5}
            sx={{
              "& > div": {
                flex: "0 0 40%",
                height: "120px",
                backgroundColor: `${colors.dashboardbackground[100]}`,
                boxShadow: theme.palette.mode === "light" && theme.shadows[2],
                borderRadius: "15px",
              },
            }}
          >
            {firstSix.map((data, index) => (
              <Stack
                key={index} // Moved the key to the outermost element
                justifyContent={"center"}
                alignItems={"center"}
                onClick={() => {
                  dispatch(SETSELECTEDCOIN(data));
                  setCoinDetailsLoader(true);
                  handleOpenCoinDetailsDrawer();
                }}
              >
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                  <Box>
                    <img
                      src={data?.image}
                      width={"25px"}
                      alt={data?.name}
                      style={{
                        backgroundColor: "lightgrey",
                        borderRadius: "50%",
                      }}
                    />{" "}
                  </Box>
                  <Typography>{data?.symbol}</Typography>
                </Stack>

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  color={
                    data?.price_change_percentage_24h < 0
                      ? "red"
                      : "springgreen"
                  }
                >
                  {data?.price_change_percentage_24h < 0 ? (
                    <ArrowDown />
                  ) : (
                    <ArrowUp />
                  )}
                  <Typography>
                    {Number(data?.price_change_percentage_24h).toFixed(2)}%
                  </Typography>
                </Stack>

                <Typography>
                  

                  {conversionRate?.rate
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(data?.current_price * conversionRate?.rate > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(data?.current_price * conversionRate?.rate)
                    : Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(data?.current_price > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(data?.current_price)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>

        <Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mx={"12px"}
          >
            <Stack direction={"row"} spacing={0.5} alignItems={"center"} mb={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Tradable Cryptos
              </Typography>
            </Stack>
            <ArrowRight />
          </Stack>

          <Stack
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            borderRadius={"20px 20px 20px 20px"}
            spacing={2.5}
            px={2}
            pb={1}
          >
            <TradableCryptoAssets filteredAllCoins={filteredAllCoins} />
          </Stack>
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

export default Tradable;
