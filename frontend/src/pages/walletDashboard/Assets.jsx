import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import {
  CaretDown,
  CaretRight,
  Eye,
  EyeSlash,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import WalletHomeSkeleton from "./walletSkeletons/WalletHomeSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import { CryptoImages } from "../../data";
import Activity from "./walletComponents/Activity";
import { WalletRight } from "../../components/WalletRight";
import {
  changeCurrency,
  getLoginStatus,
} from "../../redux/features/auth/authSlice";
import TopBar from "../dashboard/dashboardComponents/TopBar";
import ChangeCurrencyDialog from "../../components/dialogs/ChangeCurrencyDialog";
import { shortenText } from "../../utils";

const Assets = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();
  const { isLoading: appLoading } = useSelector((state) => state.app);

  const { user, isLoading, isLoggedIn, conversionRate } = useSelector(
    (state) => state.auth
  );

  const { isLoading: coinPriceLoading } = useSelector(
    (state) => state.coinPrice
  );

  const { allCoins } = useSelector((state) => state.coinPrice);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  const currencies = [
    { code: "USD", flag: "us" }, // United States Dollar
    { code: "GBP", flag: "gb" }, // British Pound Sterling
    { code: "EUR", flag: "eu" }, // Euro (used by the Eurozone)
    { code: "JPY", flag: "jp" }, // Japanese Yen
    { code: "AUD", flag: "au" }, // Australian Dollar
    { code: "CAD", flag: "ca" }, // Canadian Dollar
    { code: "CHF", flag: "ch" }, // Swiss Franc
    { code: "CNY", flag: "cn" }, // Chinese Yuan
    { code: "HKD", flag: "hk" }, // Hong Kong Dollar
    { code: "NZD", flag: "nz" }, // New Zealand Dollar
  ];

  const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "USD",
    flag: "us",
  });

  const handleCurrencyClick = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
  };

  const handleSelectCurrency = () => {
    // console.log(selectedCurrency);
    dispatch(changeCurrency(selectedCurrency));
  };

  const [openChangeCurrencyDialog, setOpenChangeCurrencyDialog] =
    useState(false);

  const handleCloseChangeCurrencyDialog = () => {
    setOpenChangeCurrencyDialog(false);
  };

  const handleOpenChangeCurrencyDialog = () => {
    setOpenChangeCurrencyDialog(true);
  };

  const combinedAssets = user?.assets
  ?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );

    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[user?.currency.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[user?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  })
  ?.sort((a, b) => {
    if (user?.isManualAssetMode) {
      return b.Manualbalance - a.Manualbalance; // Sort by Manualbalance if isManualAssetMode is true
    } else {
      return b.totalValue - a.totalValue; // Otherwise, sort by totalValue
    }
  });


  console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  // console.log('Total Amount:', totalWalletBalance);

   //hide balance state
   const [hideBalance, setHideBalance] = useState(false);


  return (
    <>
      {appLoading || isLoading || !user ? (
        <WalletHomeSkeleton />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "15px", md: "20px" }}
          sx={{ overflowX: "hidden" }}
          // overflow={"auto"}
          className="scrollable-element"
        >
          <Box
            mb={{ xs: 1.5, md: 3 }}
            mt={"-15px"}
            mx={"-15px"}
            borderBottom={"1px solid #111820"}
          >
            <TickerTapeWidget />
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            // mb={{xs: 10, md: 0}}
            // gap={2}
          >
            <Box
              flex={{ xs: "100%", lg: "30%", xl: "25%" }}
              sx={{ overflowY: "auto", overflowX: "hidden" }}
              pb={{ xs: 10, sm: 10, md: 0 }}
            >
              <Stack spacing={2} direction={"column"} p={0.5}>
                <TopBar />
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="calculator" edge="end">
                          <MagnifyingGlass />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "20px",
                    },
                  }}
                />

                <Stack spacing={0.1} pl={1}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography>Wallet Balance</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setHideBalance(!hideBalance)}
                  >
                    {hideBalance ? (
                      <EyeSlash weight="bold" fontSize={24}  />
                    ) : (
                      <Eye weight="bold" fontSize={24} />
                    )}
                  </IconButton>
                </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={0.5}
                      border={{ xs: "1px solid darkgrey", sm: "none" }}
                      borderRadius={"15px"}
                      p={"4px 8px"}
                      onClick={handleCurrencyClick}
                      sx={{ cursor: "pointer", zIndex: "1000" }}
                    >
                      <img
                        src={`https://flagcdn.com/w80/${
                          conversionRate
                            ? conversionRate?.flag
                            : user?.currency?.flag
                        }.png`}
                        alt=""
                        width={18}
                        height={18}
                        style={{ borderRadius: "50%" }}
                      />

                      <Typography variant="subtitle2">
                        {conversionRate
                          ? conversionRate?.code
                          : user?.currency.code}
                      </Typography>
                      <CaretDown />
                    </Stack>
                  </Stack>

                  <Menu
                    anchorEl={currencyAnchorEl}
                    open={Boolean(currencyAnchorEl)}
                    onClose={handleCurrencyClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    PaperProps={{
                      sx: {
                        maxHeight: 400, // Set the max height
                        overflowY: "auto", // Enable scrolling when content exceeds maxHeight
                      },
                    }}
                  >
                    {currencies
                      // ?.filter((currency) => currency.code !== user?.currency.code)
                      ?.map((currency) => (
                        <MenuItem
                          key={currency?.code}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            handleCurrencyClose();
                            handleOpenChangeCurrencyDialog();
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <img
                              src={`https://flagcdn.com/w80/${currency?.flag}.png`}
                              alt={currency?.code}
                              width={25}
                              height={25}
                              style={{ borderRadius: "50%" }}
                            />
                            <Typography variant="subtitle2">
                              {currency?.code}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                  </Menu>

                  <Stack spacing={0}>
                  { hideBalance ? (
                <Typography variant={size.width < 390 ? "h5" : "h4"} fontWeight={"600"}>
                  {" "}
                  ********
                </Typography>
              ) : user?.isManualAssetMode ? (
                    <Typography
                      variant={size.width < 390 ? "h5" : "h4"}
                      fontWeight={600}
                    >
                      {coinPriceLoading ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : conversionRate?.rate ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(totalWalletBalanceManual * conversionRate?.rate >
                          999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          totalWalletBalanceManual * conversionRate?.rate
                        )
                      ) : (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(totalWalletBalanceManual > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(totalWalletBalanceManual)
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      variant={size.width < 390 ? "h5" : "h4"}
                      fontWeight={600}
                    >
                      {coinPriceLoading ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : conversionRate?.rate ? (
                        allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase()
                        ] ? (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(totalWalletBalance * conversionRate?.rate >
                            999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(totalWalletBalance * conversionRate?.rate)
                        ) : (
                          "UNAVAILABLE"
                        )
                      ) : allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase()
                        ] ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(totalWalletBalance > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(totalWalletBalance)
                      ) : (
                        "UNAVAILABLE"
                      )}
                    </Typography>
                  )}
           {hideBalance ? (
                <Typography variant="subtitle1" fontWeight={"600"} mt={"-4px"}>
                  {" "}
                  ******** {allCoins[0]?.symbol.toUpperCase()}
                </Typography>
              ) : (
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ display: user?.isManualAssetMode && "none" }}
                  >
                    {totalWalletBalance &&
                      Number(
                        totalWalletBalance /
                          allCoins[0]?.quotes?.[
                            user?.currency?.code.toUpperCase()
                          ]?.price
                      ).toFixed(8)}{" "}
                    {allCoins[0]?.symbol.toUpperCase()}
                  </Typography>
              )}
                  
                </Stack>
                </Stack>

                <Stack>
                  {/* <Typography variant="h6" pl={1} mb={1}>All Assets</Typography> */}

                  <Grid container spacing={2} columns={16}>
                    {combinedAssets &&
                      combinedAssets?.map((asset, index) => (
                        <Grid item xs={8} key={index}>
                          <Box
                            sx={{ flexGrow: 1 }}
                            backgroundColor={`${colors.dashboardbackground[100]}`}
                            boxShadow={
                              theme.palette.mode === "light" &&
                              `${theme.shadows[2]}`
                            }
                            p={"10px 0px"}
                            borderRadius={"10px"}
                          >
                            <Stack
                              direction={"row"}
                              spacing={1}
                              alignItems={"center"}
                              pl={0.5}
                            >
                              <Box pl={1}>
                                <img src={asset?.image} alt="" width={"32px"} />
                              </Box>

                              <Stack>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={500}
                                >
                                  {shortenText(asset?.name, 10)}
                                </Typography>

                                {user?.isManualAssetMode ? (
                                  <Typography fontWeight={"800"}>
                                    {coinPriceLoading ? (
                                      <Skeleton variant="text" width={"80px"} />
                                    ) : conversionRate?.rate ? (
                                       (
                                        Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: conversionRate?.code,
                                          ...(asset?.ManualFiatbalance *
                                            conversionRate?.rate >
                                          9999
                                            ? { notation: "compact" }
                                            : {}),
                                        }).format(
                                          asset?.ManualFiatbalance *
                                            conversionRate?.rate
                                        )
                                      ) 
                                    ) :  (
                                      Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: user?.currency?.code,
                                        ...(asset?.ManualFiatbalance > 9999
                                          ? { notation: "compact" }
                                          : {}),
                                      }).format(asset?.ManualFiatbalance)
                                    ) }
                                  </Typography>
                                ) : (
                                  <Typography fontWeight={"800"}>
                                    {coinPriceLoading ? (
                                      <Skeleton variant="text" width={"80px"} />
                                    ) : conversionRate?.rate ? (
                                      allCoins[0]?.quotes?.[
                                        user?.currency?.code.toUpperCase()
                                      ] ? (
                                        Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: conversionRate?.code,
                                          ...(asset?.totalValue *
                                            conversionRate?.rate >
                                          9999
                                            ? { notation: "compact" }
                                            : {}),
                                        }).format(
                                          asset?.totalValue *
                                            conversionRate?.rate
                                        )
                                      ) : (
                                        "UNAVAILABLE"
                                      )
                                    ) : allCoins[0]?.quotes?.[
                                        user?.currency?.code.toUpperCase()
                                      ] ? (
                                      Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: user?.currency?.code,
                                        ...(asset?.totalValue > 9999
                                          ? { notation: "compact" }
                                          : {}),
                                      }).format(asset?.totalValue)
                                    ) : (
                                      "UNAVAILABLE"
                                    )}
                                  </Typography>
                                )}

                                {user?.isManualAssetMode ? (
                                  <Typography variant="subtitle2">
                                    {Number(asset?.Manualbalance).toFixed(2)}{" "}
                                    {asset.symbol.toUpperCase()}
                                  </Typography>
                                ) : (
                                  <Typography variant="subtitle2">
                                    {Number(asset?.balance).toFixed(2)}{" "}
                                    {asset.symbol.toUpperCase()}
                                  </Typography>
                                )}
                              </Stack>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Stack>
              </Stack>

              <Stack
                backgroundColor={
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }
                borderRadius={"20px 20px 20px 20px"}
                spacing={2.5}
                p={2}
                mt={3}
                mb={10}
              >
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Activities
                  </Typography>
                  <Stack direction={"row"} alignItems={"center"} spacing={0.3}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      See All
                    </Typography>
                    <CaretRight size={20} />
                  </Stack>
                </Stack>

                <Divider />

                <Stack>
                  <Activity />
                </Stack>
              </Stack>
            </Box>

            {size.width > 1200 && (
              <Box
                flex={{ xs: "100%", lg: "70%", xl: "75%" }}
                // backgroundColor="red"
                overflow={"hidden"}
                p={{ xs: "2px", md: "20px" }}
                ml={{ xs: "none", md: "20px" }}
                // border={{ xs: "2px solid grey", md: "2px solid grey" }}
                borderRadius={"20px"}
                display={{ xs: "none", md: "flex" }}
              >
                <WalletRight />
              </Box>
            )}
          </Box>
        </Box>
      )}

      <ChangeCurrencyDialog
        open={openChangeCurrencyDialog}
        handleClose={handleCloseChangeCurrencyDialog}
        handleOpen={handleOpenChangeCurrencyDialog}
        handleSelectCurrency={handleSelectCurrency}
      />
    </>
  );
};

export default Assets;
