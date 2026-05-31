import {
  Box,
  Divider,
  Drawer,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme.js";
import { Question, Star, X } from "@phosphor-icons/react";

import { useEffect } from "react";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
import { useSelector } from "react-redux";
import CoinDetailsChart from "../charts/CoinDetailsChart.jsx";

const CoinDetailsDrawer = ({
  open,
  handleClose,
  handleOpen,
  coinDetailsLoader,
  setCoinDetailsLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //  const coinDetailsLoader = true;

  const size = UseWindowSize();

  const { singleCoinDetails } = useSelector((state) => state.auth);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const { user, conversionRate } = useSelector((state) => state.auth);

  useEffect(() => {
    if (coinDetailsLoader) {
      const timer = setTimeout(() => {
        setCoinDetailsLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [coinDetailsLoader, setCoinDetailsLoader]);

  return (
    <>
      <Drawer
        anchor={size.width > 899 ? "right" : "bottom"}
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            height:
              size.width > 899
                ? "100%" // Full height for desktop (right anchor)
                : "70%",
            width: size.width > 899 ? 450 : "100%",
            borderRadius:
              size.width > 899 ? "30px 0px 0px 30px" : "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            borderTop: `${size.width < 899 && "1px solid grey"}`,
            borderLeft: `${size.width > 899 && "1px solid grey"}`,
            transition: "height 2s ease",
          },
        }}
      >
        {coinDetailsLoader ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              height={"100%"}
              borderRadius={"30px 30px 0 0"}
              overflow={"hidden"}
              position={"absolute"}
              width={"100%"}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <Star size={24} weight="regular" />
                  <Typography fontWeight={"600"}>Loading...</Typography>
                  <X size={20} weight="bold" onClick={handleClose} />
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack p={1} spacing={1.5} overflow={"auto"} mt={1}>
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  p={"0px 8px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <Skeleton
                      variant="circular"
                      width={"45px"}
                      height={"45px"}
                    />
                    <Stack>
                      <Skeleton
                        variant="text"
                        width={"80px"}
                        sx={{ fontSize: "16px" }}
                      />
                      <Skeleton
                        variant="text"
                        width={"60px"}
                        sx={{ fontSize: "16px" }}
                      />
                    </Stack>
                  </Stack>

                  <Stack alignItems={"flex-end"}>
                    <Skeleton
                      variant="text"
                      width={"80px"}
                      sx={{ fontSize: "16px" }}
                    />
                    <Skeleton
                      variant="text"
                      width={"60px"}
                      sx={{ fontSize: "16px" }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflowY={"auto"}
          >
            <Stack spacing={1} p={"15px 15px 10px 15px"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"5px 5px"}
                alignItems={"center"}
              >
                <Star size={24} weight="regular" onClick={() => {}} style={{cursor: "pointer"}} />
                  <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={0.5}>
                  <img
                    src={singleCoinDetails?.image}
                    width={isMobile ? "25px" : "25px"}
                    height={isMobile ? "25px" : "25px"}
                    style={{ borderRadius: "50%", backgroundColor: "white" }}
                    alt=""
                  />
                <Typography fontWeight={"600"}> {singleCoinDetails?.name}</Typography>
                  </Stack>
                <X size={20} weight="bold" onClick={handleClose} style={{cursor: "pointer"}}  />
              </Stack>
            </Stack>
            <Box mx={"-15px"}>
              <Divider />
            </Box>

            <Stack p={2} height={"90%"} overflow={"auto"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"row"} spacing={1}>
                  <img
                    src={singleCoinDetails?.image}
                    width={isMobile ? "45px" : "45px"}
                    height={isMobile ? "45px" : "45px"}
                    style={{ borderRadius: "50%", backgroundColor: "white" }}
                    alt=""
                  />
                  <Stack spacing={-0.5}>
                    <Typography variant="body1">
                      {singleCoinDetails?.name}
                    </Typography>
                    <Typography variant="subtitle2">
                      {singleCoinDetails?.symbol?.toUpperCase()}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack spacing={-0.5} alignItems={"flex-end"}>
                  <Typography variant="h6" fontWeight={700}>
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(singleCoinDetails?.current_price *
                            conversionRate?.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          singleCoinDetails?.current_price *
                            conversionRate?.rate
                        )
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(singleCoinDetails?.current_price > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleCoinDetails?.current_price)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={
                      singleCoinDetails?.price_change_percentage_24h < 0
                        ? "red"
                        : "green"
                    }
                  >
                    {Number(
                      singleCoinDetails?.price_change_percentage_24h
                    ).toFixed(2)}
                    % (
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(singleCoinDetails?.price_change_24h *
                            conversionRate?.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          singleCoinDetails?.price_change_24h *
                            conversionRate?.rate
                        )
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(singleCoinDetails?.price_change_24h > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleCoinDetails?.price_change_24h)}
                    )
                  </Typography>
                </Stack>
              </Stack>

              <Box
                // flex={}
                overflow={"hidden"}
                height={"250px"}
                mt={5}
                mx={"-16px"}
              >
                <CoinDetailsChart
                  data={singleCoinDetails?.sparkline_in_7d.price.map(
                    (price, i) => ({
                      name: i,
                      value: price,
                    })
                  )}
                  dataPricePercentage={
                    singleCoinDetails?.price_change_percentage_24h
                  }
                />
              </Box>

              <Divider />

              <Stack mt={2} direction={"row"} justifyContent={"space-between"}>
                <Stack>
                  <Typography variant="subtitle1">Current Price</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(singleCoinDetails?.current_price *
                            conversionRate?.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          singleCoinDetails?.current_price *
                            conversionRate?.rate
                        )
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(singleCoinDetails?.current_price > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleCoinDetails?.current_price)}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">Market Cap</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(singleCoinDetails?.market_cap *
                            conversionRate?.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          singleCoinDetails?.market_cap * conversionRate?.rate
                        )
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(singleCoinDetails?.market_cap > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleCoinDetails?.market_cap)}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">Total Vol</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {conversionRate?.rate
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(singleCoinDetails?.total_volume *
                            conversionRate?.rate >
                          9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          singleCoinDetails?.total_volume * conversionRate?.rate
                        )
                      : Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(singleCoinDetails?.total_volume > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleCoinDetails?.total_volume)}
                  </Typography>
                </Stack>
              </Stack>

              <Box mx={"-15px"} mt={2}>
                <Divider />
              </Box>
            </Stack>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default CoinDetailsDrawer;
