import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, ArrowsClockwise, ArrowsLeftRight, Eye, PlusCircle, Trash, X, XCircle } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UseWindowSize from "../../../../hooks/UseWindowSize";
import { adminGetAllCoinpaprikaCoinPrices } from "../../../../redux/features/coinPrice/coinPriceSlice";
import { adminDeleteAssetWalletFromUser, adminFundAssetBalance, adminSetIsManualAssetMode } from "../../../../redux/features/auth/authSlice";
import AddNewAssetWallet from "../AddNewAssetWallet";
import { shortenText } from "../../../../utils";
import { IOSSwitch } from "../../../dashboard/Profile";
import ManualUpdateAsset from "../ManualUpdateAsset";
import { toast } from "react-toastify";
const FundWalletBalanceDrawer = ({
  open,
  handleClose,
  handleOpen,
  fundWalletBalanceLoader,
  setFundWalletBalanceLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { singleUser, conversionRate, isSemiLoading } = useSelector((state) => state.auth);

  const { isLoading: coinPriceLoading, allCoins } = useSelector(
    (state) => state.coinPrice
  );


  useEffect(() => {
    if (!singleUser?.currency?.code) {
      return; // Exit early if user data is not yet available
    }
  
    const checkAndUpdatePrices = () => {
      const allCoinpaprikaCoinPricesData = localStorage.getItem("allCoinpaprikaCoinPrices");
  
      if (allCoinpaprikaCoinPricesData) {
        const { savedAt, data } = JSON.parse(allCoinpaprikaCoinPricesData);
  
        // Check if the data array is empty
        const isDataEmpty = !data || data.length === 0;
  
        // Check if any of the data's quote matches the user's currency code
        const doesCurrencyMatch = data.some((coin) => coin.quotes[singleUser?.currency?.code]);
  
        // Convert `savedAt` to Date object and compare time difference
        const savedAtTime = new Date(savedAt).getTime();
        const currentTime = new Date().getTime();
        const fifteenMinutesInMillis = 15 * 60 * 1000; // 15 minutes in milliseconds
        const timestampPlusFifteenMinutes = savedAtTime + fifteenMinutesInMillis;
  
        const hasTimePassedFifteenMinutes = currentTime > timestampPlusFifteenMinutes;
  
        // If more than 15 minutes have passed, data is empty, or currency doesn't match
        if (hasTimePassedFifteenMinutes || isDataEmpty || !doesCurrencyMatch) {
          dispatch(adminGetAllCoinpaprikaCoinPrices(id));
        }
      } else {
        // If no data exists in localStorage, dispatch the action immediately
        dispatch(adminGetAllCoinpaprikaCoinPrices(id));
      }
    };
  
    // Initial check
    checkAndUpdatePrices();
  
    // Set an interval to repeat the check every 15 minutes
    const intervalId = setInterval(() => {
      checkAndUpdatePrices();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch, id, singleUser?.currency?.code]);
  

  

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  useEffect(() => {
    if (fundWalletBalanceLoader) {
      const timer = setTimeout(() => {
        setFundWalletBalanceLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fundWalletBalanceLoader, setFundWalletBalanceLoader]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  // console.log(selectedAsset);

  const [openMoodal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const combinedAssets = singleUser?.assets?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );
    // console.log("asset?.symbol", asset?.symbol?.toUpperCase())
    // console.log(`priceData.quotes.${[user.currency.code]}.price`, priceData?.quotes?.[user.currency.code]?.price)
    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[singleUser?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[singleUser?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  })?.sort((a, b) => {
    if (singleUser?.isManualAssetMode) {
      return b.Manualbalance - a.Manualbalance; // Sort by Manualbalance if isManualAssetMode is true
    } else {
      return b.totalValue - a.totalValue; // Otherwise, sort by totalValue
    }
  });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;
    
    const totalWalletBalanceManual =  Array.isArray(singleUser?.assets)
    ? singleUser?.assets.reduce((total, asset) => total + (asset.ManualFiatbalance || 0), 0) : 0;

    // console.log(totalWalletBalanceManual)


    

  const [amount, setAmount] = useState(0);
  const [amountInCryoto, setAmountInCryoto] = useState(0.00000000);
  const [isCryptoInput, setIsCryptoInput] = useState(false);

  // console.log(amountInCryoto)


  useEffect(() => {
    if(allCoins.length === 0) {
      setIsCryptoInput(true)
    }
  },[allCoins.length])

 
  const fundwallet = () => {
    const userData = {
      symbol: selectedAsset?.symbol,
      amount: isCryptoInput ? amountInCryoto.trim() : Number(amount / selectedAsset?.price)
    }
    dispatch(adminFundAssetBalance({ id, userData }));
    // console.log(userData);
  }


  const [openAddWalletMoodal, setOpenAddWalletModal] = useState(false);
  const handleOpenAddWalletModal = () => setOpenAddWalletModal(true);
  const handleCloseAddWalletModal = () => setOpenAddWalletModal(false);

  

 



  // Delete Trader Drawer
  const [openDeleteTraderDrawer, setDeleteTraderDrawer] = useState(false);
  const [selectedWalletID, setSelectedWalletID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTraderDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTraderDrawer(false);
  };


  const handleAssetDelete = () => {
    // console.log(assetSymbol);
    const userData = {
      walletSymbol: selectedWalletID?.walletSymbol,
    }

    dispatch(adminDeleteAssetWalletFromUser({ id, userData }));

  }

  // End Delete Trader Drawer


  
  const [checked, setChecked] = useState(singleUser?.isManualAssetMode);

   // Handle switch change
const changeManualAssetMode = (event) => {
  const { checked: isChecked } = event.target; // Extract the checked state from the event

  // Optionally update any local state if needed
  setChecked(isChecked);

  // Log the switch state if required
  // console.log("Switch is now:", isChecked ? "ON" : "OFF");

  // Dispatch the action with a slight delay
  setTimeout(() => {
    dispatch(adminSetIsManualAssetMode(id)); // Update the backend
  }, 500);
};


const handleRefreshCryptPrices = () => {
  const refreshData = JSON.parse(localStorage.getItem("cryptoRefreshData")) || {};
  const currentTime = new Date().getTime();
  const refreshLimit = 3; // Maximum allowed refreshes
  const cooldownPeriod = 20 * 60 * 1000; // 20 minutes cooldown in milliseconds

  // Initialize if not present
  if (!refreshData.count) {
    refreshData.count = 0;
    refreshData.lastRefresh = 0;
  }

  // Check refresh conditions
  if (refreshData.count < refreshLimit) {
    // Update count and last refresh time
    refreshData.count += 1;
    refreshData.lastRefresh = currentTime;

    // Save updated data to localStorage
    localStorage.setItem("cryptoRefreshData", JSON.stringify(refreshData));

    // Dispatch API call
    dispatch(adminGetAllCoinpaprikaCoinPrices(id));

    // Notify user
    toast.success(
      `Prices refreshed successfully. Refresh count: ${refreshData.count}/${refreshLimit}`
    );
  } else {
    // Check if cooldown period has passed
    if (currentTime - refreshData.lastRefresh > cooldownPeriod) {
      // Reset refresh count and allow refresh
      refreshData.count = 1;
      refreshData.lastRefresh = currentTime;

      // Save updated data to localStorage
      localStorage.setItem("cryptoRefreshData", JSON.stringify(refreshData));

      // Dispatch API call
      dispatch(adminGetAllCoinpaprikaCoinPrices(id));

      // Notify user
      toast.success(
        "Prices refreshed successfully after cooldown. Please refresh responsibly."
      );
    } else {
      // Notify user of abuse prevention
      const timeLeftInMs = cooldownPeriod - (currentTime - refreshData.lastRefresh);
      const timeLeftMinutes = Math.floor(timeLeftInMs / (1000 * 60));
      const timeLeftSeconds = Math.floor((timeLeftInMs % (1000 * 60)) / 1000);
    
      const readableTime =
        timeLeftMinutes > 0
          ? `${timeLeftMinutes} minute${timeLeftMinutes > 1 ? "s" : ""} and ${timeLeftSeconds} second${timeLeftSeconds > 1 ? "s" : ""}`
          : `${timeLeftSeconds} second${timeLeftSeconds > 1 ? "s" : ""}`;
    
      toast.error(
        `You have recently refreshed prices. Please try again in ${readableTime}.`, {
          autoClose: 10000,
        }
      );
    }
  }
};


  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "550px" },
          },
        }}
      >
        {fundWalletBalanceLoader ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            <AppBar
              position="sticky"
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "lightgrey"
                    : colors.dashboardbackground[100]
                }`,
                top: 0,
                height: "56px",
              }}
              color="grey"
            >
              <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
                <IconButton
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2, backgroundColor: "grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Fund Wallet Balance
                </Typography>
              </Toolbar>
            </AppBar>

            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
              width={"100%"}
            >
              <CircularProgress />
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            <AppBar
              position="sticky"
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "lightgrey"
                    : colors.dashboardbackground[100]
                }`,
                top: 0,
                height: "56px",
              }}
              color="grey"
            >
              <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
                <IconButton
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2, backgroundColor: "grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Fund Wallet Balance
                </Typography>
              </Toolbar>
            </AppBar>

            <Box>
              <Stack
                component={Paper}
                elevation={elevation}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                p={2}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  pb={2}
                  alignItems={"center"}
                >
                  <Stack>
                  <Button
                    startIcon={<ArrowsClockwise size={20} />}
                    size="small"
                    variant="outlined"
                    onClick={handleRefreshCryptPrices}
                  >
                    Refresh Prices
                  </Button>
                  </Stack>

                  <Button
                    startIcon={<PlusCircle size={20} />}
                    size="small"
                    variant="outlined"
                    onClick={handleOpenAddWalletModal}
                  >
                    Add Wallet
                  </Button>
                </Stack>

                <Divider flexItem />

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  p={"10px 0"}
                  spacing={1}
                  display={{ xs: "flex", md: "flex" }}
                >
                  <Avatar
                    src={singleUser?.photo}
                    alt="profile picture"
                    sx={{ width: "60px", height: "60px" }}
                  />
                  <Stack>
                    <Typography variant="h6" fontWeight={"600"}>
                      {singleUser?.firstname} {singleUser?.lastname}
                    </Typography>
                    <Typography variant="caption">
                      {singleUser?.email}
                    </Typography>
                  </Stack>
                </Stack>
                
                <Divider />

                <Stack spacing={1} pl={1} my={2}>
                  <Box py={2} display={allCoins.length > 0 && "none"}>
                    <Stack
                      direction={"row"}
                      spacing={0.5}
                      alignItems={"flex-start"}
                      border={"1px solid red"}
                      p={0.5}
                    >
                      <Box>
                        <XCircle size={42} color="red" />
                      </Box>
                      <Typography variant="subtitle2">
                        Unable to get fiat rate balance for coins at this time,
                        please kindly make calculations manually for now.
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Typography>Wallet Balance</Typography>

                      {/* <Eye weight="bold" fontSize={24} /> */}
                    </Stack>



                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Stack
                        direction={"row"}
                        spacing={0.5}
                        alignItems={"center"}
                      >
                        <Typography>Manual Mode </Typography>
                      </Stack>
                      {isSemiLoading ? (
                        <Box px={1.2}>
                          {" "}
                          <CircularProgress size={22} />
                        </Box>
                      ) : (
                        <IOSSwitch
                          checked={checked}
                          onChange={changeManualAssetMode}
                          // name="switch1"
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Stack spacing={0}>
                    {singleUser?.isManualAssetMode ? (
                      <Typography
                        variant={size.width < 370 ? "h5" : "h4"}
                        fontWeight={600}
                        mt={"-5px"}
                      >
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: singleUser?.currency?.code,
                          ...(totalWalletBalanceManual > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(totalWalletBalanceManual)}
                      </Typography>
                    ) : (
                      <Typography
                        variant={size.width < 370 ? "h5" : "h4"}
                        fontWeight={600}
                        mt={"-5px"}
                      >
                        {coinPriceLoading ? (
                          <Skeleton variant="text" width={"200px"} />
                        ) : conversionRate?.rate ? (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(totalWalletBalance * conversionRate?.rate >
                            999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(totalWalletBalance * conversionRate?.rate)
                        ) : (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
                            ...(totalWalletBalance > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(totalWalletBalance)
                        )}
                      </Typography>
                    )}

                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ display: singleUser?.isManualAssetMode && "none" }}
                    >
                      {totalWalletBalance &&
                        Number(
                          totalWalletBalance /
                            allCoins[0]?.quotes?.[
                              singleUser?.currency?.code.toUpperCase()
                            ]?.price
                        ).toFixed(8)}{" "}
                      {allCoins[0]?.symbol.toUpperCase()}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack>
                  {/* <Typography variant="h6" pl={1} mb={1}>All Assets</Typography> */}

                  <Grid container spacing={2} columns={16}>
                    {combinedAssets &&
                      combinedAssets?.map((asset, index) => (
                        <Grid
                          item
                          xs={8}
                          key={index}
                          onClick={() => {
                            setSelectedAsset(asset);
                            handleOpenModal();
                          }}
                        >
                          <Box
                            position={"relative"}
                            sx={{ flexGrow: 1 }}
                            backgroundColor={
                              theme.palette.mode === "light"
                                ? "#f2f2f2"
                                : "rgba(239, 239, 240, 0.05)"
                            }
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

                                {singleUser?.isManualAssetMode ? (
                                  <Typography fontWeight={"800"}>
                                    {Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: singleUser?.currency?.code,
                                      ...(asset?.ManualFiatbalance > 9999
                                        ? { notation: "compact" }
                                        : {}),
                                    }).format(asset?.ManualFiatbalance)}
                                  </Typography>
                                ) : (
                                  <Typography fontWeight={"800"}>
                                    {coinPriceLoading ? (
                                      <Skeleton variant="text" width={"80px"} />
                                    ) : conversionRate?.rate ? (
                                      Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: conversionRate?.code,
                                        ...(asset?.totalValue *
                                          conversionRate?.rate >
                                        9999
                                          ? { notation: "compact" }
                                          : {}),
                                      }).format(
                                        asset?.totalValue * conversionRate?.rate
                                      )
                                    ) : (
                                      Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: singleUser?.currency?.code,
                                        ...(asset?.totalValue > 9999
                                          ? { notation: "compact" }
                                          : {}),
                                      }).format(asset?.totalValue)
                                    )}
                                  </Typography>
                                )}

                                {singleUser?.isManualAssetMode ? (
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

                            <Box position={"absolute"} top={5} right={5}>
                              <IconButton
                                size="small"
                                sx={{ border: "1px solid grey" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWalletID({
                                    walletId: asset?._id,
                                    walletName: asset?.name,
                                    walletSymbol: asset?.symbol,
                                  });
                                  handleClickDelete();
                                  // handleAssetDelete(asset.symbol)
                                }}
                              >
                                <Trash />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>

      <Modal
        open={openMoodal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {singleUser?.isManualAssetMode ? (
          <ManualUpdateAsset
            selectedAsset={selectedAsset}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: { xs: "95%", sm: "60%", md: 450 },
              maxHeight: "100%",
              overflow: "auto",
              bgcolor: "background.paper",
              // border: "2px solid #000",
              boxShadow: 24,
              borderRadius: "10px",
              p: 2,
            }}
          >
            <Stack spacing={1}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography sx={{ pb: 0.5 }} variant="h6" fontWeight={"bold"}>
                  Fund wallet
                </Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography>
                    {!isCryptoInput ? "Fiat Method" : "Crypto Method"}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ border: "1px solid grey" }}
                    onClick={handleCloseModal}
                  >
                    <X />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider flexItem />

              <Box py={2} display={allCoins.length > 0 && "none"}>
                <Stack
                  direction={"row"}
                  spacing={0.5}
                  alignItems={"flex-start"}
                  border={"1px solid red"}
                  p={0.5}
                >
                  <Box>
                    <XCircle size={42} color="red" />
                  </Box>
                  <Typography variant="subtitle2">
                    Unable to get fiat rate balance for coins at this time,
                    please kindly make calculations manually for now.
                  </Typography>
                </Stack>
              </Box>

              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <img
                    src={selectedAsset?.image}
                    alt={selectedAsset?.name}
                    width={"40"}
                    height={"40"}
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                  />
                  <Typography variant="h6">{selectedAsset?.name}</Typography>
                </Stack>

                <Typography>
                  Price:{" "}
                  {coinPriceLoading ? (
                    <Skeleton variant="text" width={"200px"} />
                  ) : conversionRate?.rate ? (
                    Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: conversionRate?.code,
                      ...(selectedAsset?.price * conversionRate?.rate > 999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(selectedAsset?.price * conversionRate?.rate)
                  ) : (
                    Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: singleUser?.currency?.code,
                      ...(selectedAsset?.price > 999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(selectedAsset?.price)
                  )}
                </Typography>
              </Stack>
            </Stack>

            <Stack my={3}>
              <Typography fontWeight={700} color={"springgreen"}>
                {selectedAsset?.name} Balance
              </Typography>
              <Typography>
                {" "}
                Fiat Balance:{" "}
                <span style={{ color: "springgreen" }}>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: singleUser?.currency?.code,
                    ...(selectedAsset?.balance * selectedAsset?.price > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(selectedAsset?.balance * selectedAsset?.price)}
                </span>
              </Typography>
              <Typography variant="subtitle2">
                {selectedAsset?.balance} {selectedAsset?.symbol.toUpperCase()}{" "}
              </Typography>
            </Stack>

            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Stack spacing={0.5} width={"100%"}>
                <InputLabel htmlFor="my-input">Amount</InputLabel>
                <OutlinedInput
                  required
                  type="text"
                  name="amount"
                  value={
                    isCryptoInput
                      ? amountInCryoto * selectedAsset?.price
                      : amount
                  }
                  onChange={(e) => setAmount(e.target.value)}
                  readOnly={isCryptoInput}
                  disabled={allCoins.length === 0}
                  placeholder="0"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "10px",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography>{singleUser?.currency?.code}</Typography>
                    </InputAdornment>
                  }
                />
              </Stack>

              <Stack pt={4}>
                <IconButton
                  sx={{ border: "2px solid green" }}
                  onClick={() => {
                    setAmount(0);
                    setAmountInCryoto(0);
                    setIsCryptoInput(!isCryptoInput);
                  }}
                >
                  <ArrowsLeftRight />
                </IconButton>
              </Stack>

              <Stack
                spacing={0.5}
                // display={Wallet !== "Bitcoin" && "none"}
                width={"100%"}
              >
                <InputLabel htmlFor="my-input">
                  {selectedAsset?.symbol.toUpperCase()}
                </InputLabel>
                <OutlinedInput
                  type="text"
                  value={
                    isCryptoInput
                      ? amountInCryoto
                      : allCoins.length === 0
                      ? amountInCryoto
                      : Number(amount / selectedAsset?.price).toFixed(8)
                  }
                  onChange={(e) => setAmountInCryoto(e.target.value)}
                  readOnly={!isCryptoInput}
                  placeholder="Enter Amount"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "10px",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography>
                        {selectedAsset?.symbol.toUpperCase()}
                      </Typography>
                    </InputAdornment>
                  }
                />
                {/* {console.log(selectedAsset?.price)} */}
              </Stack>
            </Stack>

            <Stack mt={2}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                // disabled={isConnecting && true}
                sx={{ borderRadius: "10px", padding: "10px" }}
                onClick={fundwallet}
              >
                Fund Wallet
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>

      <Modal
        open={openAddWalletMoodal}
        onClose={handleCloseAddWalletModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: { xs: "95%", sm: "60%", md: 450 },
            maxHeight: "100%",
            overflow: "auto",
            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "10px",
            // p: 2,
          }}
        >
          <Stack spacing={1}>
          <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          px={2}
          pt={2}
        >
          <Typography sx={{ pb: 0.5 }} variant="h6" fontWeight={"bold"}>
            Add New Asset
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton
              size="small"
              sx={{ border: "1px solid grey" }}
              onClick={handleCloseAddWalletModal}
            >
                {isSemiLoading ? <CircularProgress size={18} /> : <X /> }
              
            </IconButton>
          </Stack>
        </Stack>
            <Divider flexItem />

            <AddNewAssetWallet />
          </Stack>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteTraderDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete ${selectedWalletID?.walletName} Asset and it's balance ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              handleAssetDelete();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FundWalletBalanceDrawer;
