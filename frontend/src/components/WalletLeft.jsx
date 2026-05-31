import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CaretDown,
  Cube,
  CurrencyCircleDollar,
  Eye,
  EyeSlash,
  PlusCircle,
  ShareFat,
} from "@phosphor-icons/react";
import { CryptoImages, currencies } from "../data";
import TopBar from "../pages/dashboard/dashboardComponents/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UseWindowSize from "../hooks/UseWindowSize";
import {
  SET_FUNDACCOUNT,
  SET_TYPEOFDEPOSIT,
} from "../redux/features/app/appSlice";
import Activity from "../pages/walletDashboard/walletComponents/Activity";
import ChangeCurrencyDialog from "./dialogs/ChangeCurrencyDialog";
import DepositDrawer from "./drawers/DepositDrawer";
import SendCryptoDrawer from "./drawers/SendCryptoDrawer";
import AllCryptoTransactionsDrawer from "./drawers/AllCryptoTransactionsDrawer";
import { changeCurrency } from "../redux/features/auth/authSlice";

const WalletLeft = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const size = UseWindowSize();

  const { user, conversionRate } = useSelector(
    (state) => state.auth
  );

  const { isLoading: coinPriceLoading } = useSelector(
    (state) => state.coinPrice
  );

  const { allCoins } = useSelector((state) => state.coinPrice);

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

  const combinedAssets = user?.assets?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );
   
    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[user?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[user?.currency?.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  // Deposit Drawer
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [depositLoader, setdepositLoader] = useState(false);

  const handleOpenDepositDrawer = () => {
    setOpenDepositDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseDepositDrawer = () => {
    setOpenDepositDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Send Crypto Drawer

  const [sendCryptoLoader, setSendCryptoLoader] = useState(false);
  const [openSendCryptoDrawer, setOpenSendCryptoDrawer] = useState(false);

  const handleOpenSendCryptoDrawer = () => {
    setOpenSendCryptoDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseSendCryptoDrawer = () => {
    setOpenSendCryptoDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // AllCryptoTransactionsDrawer

  const [allCryptoTransactionsLoader, setAllCryptoTransactionsLoader] =
    useState(false);
  const [openAllCryptoTransactionsDrawer, setOpenAllCryptoTransactionsDrawer] =
    useState(false);

  const handleOpenAllCryptoTransactionsDrawer = () => {
    setOpenAllCryptoTransactionsDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseAllCryptoTransactionsDrawer = () => {
    setOpenAllCryptoTransactionsDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

   //hide balance state
   const [hideBalance, setHideBalance] = useState(false);


  return (
    <>
      <Stack spacing={2} direction={"column"} p={0.5}>
        <TopBar />

        <Stack spacing={0.5}>
          {/* <Box pl={1}>
                    <Typography variant="h6">Portfolio Overview</Typography>
                  </Box> */}

          <Stack
            width={"100%"}
            height={"180px"}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            // border={theme.palette.mode === "light" ? "1px solid lightgray" : `2px solid ${colors.dashboardbackground[100]}`}
            borderRadius={"20px"}
            p={"10px 15px"}
            justifyContent={"space-around"}
            position={"relative"}
            overflow={"hidden"}
          >
            <Box position={"absolute"} right={-30} bottom={0} top={0}>
              <img
                src={CryptoImages[0].url}
                width={"120px"}
                alt=""
                style={{
                  // backgroundColor: "lightgrey",
                  borderRadius: "50%",
                  transform: "rotate(-50deg)",
                  opacity: theme.palette.mode === "light" ? "0.1" : "0.05",
                }}
              />
            </Box>
            <Stack
              direction={"row"}
              alignItems={"start"}
              justifyContent={"space-between"}
            >
              <Stack spacing={0.5}>
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
                    conversionRate ? conversionRate?.flag : user?.currency?.flag
                  }.png`}
                  alt=""
                  width={18}
                  height={18}
                  style={{ borderRadius: "50%" }}
                />

                <Typography variant="subtitle2">
                  {conversionRate ? conversionRate?.code : user?.currency?.code}
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
                // ?.filter((currency) => currency.code !== user?.currency?.code)
                ?.map((currency) => (
                  <MenuItem
                    key={currency?.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      handleCurrencyClose();
                      handleOpenChangeCurrencyDialog();
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
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

            <Divider />

            <Stack
              spacing={1.5}
              direction={"row"}
              justifyContent={"space-around"}
              width={"100%"}
              overflow={"auto"}
            >
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <img
                  src={combinedAssets[0]?.image}
                  alt="bitcoin"
                  width={size.width < 370 ? "25px" : "30px"}
                />
                {user?.isManualAssetMode ? (
                  <Typography
                    variant={size.width < 370 ? "subtitle1" : "body1"}
                    fontWeight={"bold"}
                  >
                    {coinPriceLoading ? (
                      <Skeleton variant="text" width={"80px"} />
                    ) : conversionRate?.rate ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(combinedAssets[0]?.ManualFiatbalance *
                          conversionRate?.rate >
                        9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        combinedAssets[0]?.ManualFiatbalance *
                          conversionRate?.rate
                      )
                    ) : (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(combinedAssets[0]?.ManualFiatbalance > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(combinedAssets[0]?.ManualFiatbalance)
                    )}
                  </Typography>
                ) : (
                  <Typography
                    variant={size.width < 370 ? "subtitle1" : "body1"}
                    fontWeight={"bold"}
                  >
                    {coinPriceLoading ? (
                      <Skeleton variant="text" width={"80px"} />
                    ) : conversionRate?.rate ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(combinedAssets[0]?.totalValue *
                          conversionRate?.rate >
                        9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        combinedAssets[0]?.totalValue * conversionRate?.rate
                      )
                    ) : (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(combinedAssets[0]?.totalValue > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(combinedAssets[0]?.totalValue)
                    )}
                  </Typography>
                )}
              </Stack>

              <Divider orientation="vertical" />

              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <img
                  src={combinedAssets[1]?.image}
                  alt="bitcoin"
                  width={size.width < 370 ? "25px" : "30px"}
                />
                {user?.isManualAssetMode ? (
                  <Typography
                    variant={size.width < 370 ? "subtitle1" : "body1"}
                    fontWeight={"bold"}
                  >
                    {coinPriceLoading ? (
                      <Skeleton variant="text" width={"80px"} />
                    ) : conversionRate?.rate ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(combinedAssets[1]?.ManualFiatbalance *
                          conversionRate?.rate >
                        9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        combinedAssets[1]?.ManualFiatbalance *
                          conversionRate?.rate
                      )
                    ) : (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(combinedAssets[1]?.ManualFiatbalance > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(combinedAssets[1]?.ManualFiatbalance)
                    )}
                  </Typography>
                ) : (
                  <Typography
                    variant={size.width < 370 ? "subtitle1" : "body1"}
                    fontWeight={"bold"}
                  >
                    {coinPriceLoading ? (
                      <Skeleton variant="text" width={"80px"} />
                    ) : conversionRate?.rate ? (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(combinedAssets[1]?.totalValue *
                          conversionRate?.rate >
                        9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        combinedAssets[1]?.totalValue * conversionRate?.rate
                      )
                    ) : (
                      Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(combinedAssets[1]?.totalValue > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(combinedAssets[1]?.totalValue)
                    )}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* {isScrolling ? <p>Scrolling...</p> : <p>Not scrolling</p>} */}

        <Stack p={"5px 0 10px 0"}>
          <Stack
            direction={"row"}
            justifyContent={"space-around"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Stack
              spacing={0.5}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(SET_TYPEOFDEPOSIT("Wallet"));
                setdepositLoader(true);
                handleOpenDepositDrawer();
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: `${
                    theme.palette.mode === "light" ? "#009a4c" : "#009a4c"
                  }`,
                  color: theme.palette.mode === "light" ? "white" : "white",
                  borderRadius: "30px",
                  p: "8px",
                }}
              >
                <PlusCircle size={40} />
              </IconButton>
              <Typography variant="caption">Deposit</Typography>
            </Stack>

            <Stack
              spacing={0.5}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(SET_FUNDACCOUNT(false));
                setSendCryptoLoader(true);
                handleOpenSendCryptoDrawer();
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: `${
                    theme.palette.mode === "light" ? "#009a4c" : "#009a4c"
                  }`,
                  color: theme.palette.mode === "light" ? "white" : "white",
                  borderRadius: "30px",
                  p: "8px",
                }}
              >
                <ShareFat size={40} />
              </IconButton>
              <Typography variant="caption">Send</Typography>
            </Stack>

            <Stack
              spacing={0.5}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/wallet/nfts")}
            >
              <IconButton
                sx={{
                  backgroundColor: `${
                    theme.palette.mode === "light" ? "#009a4c" : "#009a4c"
                  }`,
                  color: theme.palette.mode === "light" ? "white" : "white",
                  borderRadius: "30px",
                  p: "8px",
                }}
              >
                <Cube size={40} />
              </IconButton>
              <Typography variant="caption">Nfts</Typography>
            </Stack>
            <Stack
              spacing={0.5}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(SET_FUNDACCOUNT(true));
                setSendCryptoLoader(true);
                handleOpenSendCryptoDrawer();
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: `${
                    theme.palette.mode === "light" ? "#009a4c" : "#009a4c"
                  }`,
                  color: theme.palette.mode === "light" ? "white" : "white",
                  borderRadius: "30px",
                  p: "8px",
                }}
              >
                <CurrencyCircleDollar size={40} />
              </IconButton>
              <Typography variant="caption">Fund </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mx={"8px"}
          >
            <Stack direction={"row"} spacing={0.5} alignItems={"center"} mb={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                My Portfolio
              </Typography>
            </Stack>
            <Typography
              onClick={() => navigate("/wallet/assets")}
              sx={{ cursor: "pointer" }}
            >
              See all
            </Typography>
          </Stack>
          <Box
            display={"flex"}
            flexDirection={"row"}
            overflow={"auto"}
            gap={2}
            p={0.5}
            mb={1}
            sx={{
              "& > div": {
                flex: "0 0 70%",
                height: "120px",
                backgroundColor: `${colors.dashboardbackground[100]}`,
                // background: `url(${CryptoImages[0].url}) no-repeat right / 40%`,
                boxShadow: theme.palette.mode === "light" && theme.shadows[2],
                borderRadius: "15px",
              },
            }}
          >
            {combinedAssets &&
              combinedAssets?.slice(0, 4).map((asset, index) => (
                <Stack
                  p={"15px 15px"}
                  justifyContent={"space-arouns"}
                  position={"relative"}
                  overflow={"hidden"}
                  spacing={1}
                  key={index}
                  width={"100%"}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Box position={"absolute"} right={-30} bottom={0} top={0}>
                      <img
                        src={asset?.image}
                        width={"100px"}
                        alt=""
                        style={{
                          backgroundColor: "lightgrey",
                          borderRadius: "50%",
                          transform: "rotate(-50deg)",
                          opacity:
                            theme.palette.mode === "light" ? "0.1" : "0.04",
                        }}
                      />
                    </Box>

                    <Box>
                      <img
                        src={asset?.image}
                        width={"50px"}
                        alt=""
                        style={{
                          backgroundColor: "lightgrey",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                    <Stack spacing={-0.5}>
                      <Typography variant="h6" fontWeight={500}>
                        {asset?.name}
                      </Typography>

                      {user?.isManualAssetMode ? (
                        <Typography>
                          {Number(asset?.Manualbalance).toFixed(2)}{" "}
                          {asset.symbol.toUpperCase()}
                        </Typography>
                      ) : (
                        <Typography>
                          {Number(asset?.balance).toFixed(2)}{" "}
                          {asset.symbol.toUpperCase()}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  {user?.isManualAssetMode ? (
                    <Typography variant="h5" fontWeight={600}>
                      {coinPriceLoading ? (
                        <Skeleton variant="text" width={"80px"} />
                      ) : conversionRate?.rate ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: conversionRate?.code,
                          ...(asset?.ManualFiatbalance * conversionRate?.rate >
                          999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(
                          asset?.ManualFiatbalance * conversionRate?.rate
                        )
                      ) : (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(asset?.ManualFiatbalance > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(asset?.ManualFiatbalance)
                      )}
                    </Typography>
                  ) : (
                    <Typography variant="h5" fontWeight={600}>
                      {coinPriceLoading ? (
                        <Skeleton variant="text" width={"80px"} />
                      ) : conversionRate?.rate ? (
                        allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase()
                        ] ? (
                          Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(asset?.totalValue * conversionRate?.rate >
                            999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(asset?.totalValue * conversionRate?.rate)
                        ) : (
                          "UNAVAILABLE"
                        )
                      ) : allCoins[0]?.quotes?.[
                          user?.currency?.code.toUpperCase()
                        ] ? (
                        Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: user?.currency?.code,
                          ...(asset?.totalValue > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(asset?.totalValue)
                      ) : (
                        "UNAVAILABLE"
                      )}
                    </Typography>
                  )}
                </Stack>
              ))}
          </Box>
        </Stack>

        <Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mx={"8px"}
          >
            <Stack direction={"row"} spacing={0.5} alignItems={"center"} mb={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Transactions
              </Typography>
            </Stack>
            <Typography
              onClick={() => {
                setAllCryptoTransactionsLoader(true);
                handleOpenAllCryptoTransactionsDrawer();
              }}
              sx={{ cursor: "pointer" }}
            >
              See all
            </Typography>
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
          >
            <Stack height={"400px"}>
              <Activity />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <ChangeCurrencyDialog
        open={openChangeCurrencyDialog}
        handleClose={handleCloseChangeCurrencyDialog}
        handleOpen={handleOpenChangeCurrencyDialog}
        handleSelectCurrency={handleSelectCurrency}
      />

      <DepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
      />

      <SendCryptoDrawer
        open={openSendCryptoDrawer}
        handleClose={handleCloseSendCryptoDrawer}
        handleOpen={handleOpenSendCryptoDrawer}
        sendCryptoLoader={sendCryptoLoader}
        setSendCryptoLoader={setSendCryptoLoader}
      />

      <AllCryptoTransactionsDrawer
        open={openAllCryptoTransactionsDrawer}
        handleClose={handleCloseAllCryptoTransactionsDrawer}
        handleOpen={handleOpenAllCryptoTransactionsDrawer}
        allCryptoTransactionsLoader={allCryptoTransactionsLoader}
        setAllCryptoTransactionsLoader={setAllCryptoTransactionsLoader}
      />
    </>
  );
};

export default WalletLeft;
