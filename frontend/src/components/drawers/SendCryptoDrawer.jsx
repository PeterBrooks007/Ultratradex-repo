import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme.js";
import {

  ArrowsLeftRight,
  CaretLeft,
  CaretRight,
  ClockCounterClockwise,
  ExclamationMark,
  X,
} from "@phosphor-icons/react";

import walletConnectImg from "../../assets/connectwallet/wallet_connect.jpg";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BankLogoImg from "../../assets/bank.png";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
import WithdrawalHistory from "../WithdrawalHistory.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getUserWithdrawalhistory,
  withdrawFund,
} from "../../redux/features/withdrawal/withdrawalSlice.js";
import { getUser } from "../../redux/features/auth/authSlice.js";
import axios from "axios";
import { getSingleCoinPrice } from "../../redux/features/coinPrice/coinPriceSlice.js";

import WithdrawFormLoaderOverlay from "../../pages/dashboard/dashboardComponents/WithdrawFormLoaderOverlay.jsx";
import {
  getAllWalletAddress,
  SETSELECTEDWALLETADDRESS,
} from "../../redux/features/walletAddress/walletAddressSlice.js";
import AllWalletsSendCrypto from "../AllWalletsSendCrypto.jsx";
import { addTransaction } from "../../redux/features/walletTransactions/walletTransactionsSlice.js";
import Activity from "../../pages/walletDashboard/walletComponents/Activity.jsx";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: "30px 0 0 0" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const initialState = {
  to: "",
  amount: 0,
  description: "",
};

const SendCryptoDrawer = ({
  open,
  handleClose,
  handleOpen,
  sendCryptoLoader,
  setSendCryptoLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const [openWithdrawalLockModal, setOpenWithdrawalLockModal] = useState(false);
  const handleOpenWithdrawalLockModal = () => setOpenWithdrawalLockModal(true);
  const handleCloseWithdrawalLockModal = () => setOpenWithdrawalLockModal(false);

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [Wallet, setWallet] = useState(null);

  // console.log(Wallet)

  const { fundAccount } = useSelector((state) => state.app);

  const {
    isLoading: coinPriceLoading,
    user,
    conversionRate,
  } = useSelector((state) => state.auth);
  const { allCoins } = useSelector((state) => state.coinPrice);

  const { isLoading, allWalletAddress } = useSelector(
    (state) => state.walletAddress
  );

  const { isSemiLoading: walletTransacLoading } = useSelector(
    (state) => state.walletTransactions
  );

  useEffect(() => {
    if (allWalletAddress?.length === 0) {
      dispatch(getAllWalletAddress());
    }
  }, [dispatch, allWalletAddress?.length]);

  const [isConnecting, setIsConnecting] = useState(false);

  const [value, setValue] = useState(0);

  const size = UseWindowSize();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let timer;
    if (isConnecting) {
      timer = setTimeout(() => {
        setIsConnecting(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);

  useEffect(() => {
    if (sendCryptoLoader) {
      const timer = setTimeout(() => {
        setSendCryptoLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sendCryptoLoader, setSendCryptoLoader]);

  const [isCryptoInput, setIsCryptoInput] = useState(false);
  const [amountInCryoto, setAmountInCryoto] = useState(0.0);

  const [formData, setFormData] = useState(initialState);

  const { to, amount, description } = formData;

  const priceData = Array.isArray(allCoins)
    ? allCoins.find((coin) => coin?.symbol === Wallet?.symbol?.toUpperCase())
    : null; // Use null instead of an empty array

  const CryptoPrice = priceData?.quotes?.[user?.currency?.code]?.price ?? null;

  // console.log(priceData)

  const quickCheckAmount = isCryptoInput
    ? Number(CryptoPrice ? CryptoPrice * amountInCryoto : 0)
    : Number(amount) || 0;

  const quickCheckAmountInCrypto = isCryptoInput
    ? Number(amountInCryoto) || 0
    : CryptoPrice
    ? Number(amount / CryptoPrice)
    : 0;

  useEffect(() => {
    if (allCoins && allCoins.length === 0) {
      setIsCryptoInput(false);
    }
  }, [allCoins, allCoins.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (user?.withdrawalLocked?.isWithdrawalLocked && !fundAccount ) {
      return handleOpenWithdrawalLockModal();
    }

    if (user?.isManualAssetMode === false && Wallet?.balance < quickCheckAmountInCrypto) {
      return toast.error("Insufficient Balance");
    }
    
    if (user?.isManualAssetMode === true && Wallet?.ManualFiatbalance < amount) {
      return toast.error("Insufficient Balance");
    }
    setSelectedWallet(Wallet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.isManualAssetMode  === false && Wallet?.balance < quickCheckAmountInCrypto) {
      return toast.error("Insufficient Balance");
    }

    if (user?.isManualAssetMode === false && !quickCheckAmountInCrypto) {
      return toast.error("Amount is are required");
    }

    if (user?.isManualAssetMode === true && !amount) {
      return toast.error("Amount is are required");
    }

    if (user?.isManualAssetMode === true && Wallet?.ManualFiatbalance < amount) {
      return toast.error("Insufficient Balance");
    }

    const formData = {
      userId: user?._id,
      transactionData: {
        typeOfTransaction: "Sent",
        method: Wallet?.name,
        methodIcon: Wallet?.image,
        symbol: Wallet?.symbol,
        amount: quickCheckAmountInCrypto,
        walletAddress: fundAccount ? "Trade Balance" : to,
        description,
        status: fundAccount ? "confirmed" : "Pending",
        amountFiat: Number(amount),
      },
    };

    // console.log(formData);
    await dispatch(addTransaction(formData));
    setSelectedWallet(null)
    await handleClose()
    // await dispatch(getUserWithdrawalhistory());
    await dispatch(getUser());
    // setFormData(initialState);
  };

  const combinedAssets = user?.assets?.slice(0, 4).map((asset) => {
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

  // console.log(combinedAssets)

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  return (
    <>
      <Drawer
        anchor={size.width > 899 ? "right" : "bottom"}
        open={open}
        onClose={() => {
          handleClose();
          setSelectedWallet(null);
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            height:
              size.width > 899
                ? "100%" // Full height for desktop (right anchor)
                : `${
                    selectedWallet &&
                    selectedWallet !== "enteramount" &&
                    selectedWallet !== "allWallet"
                      ? "95%"
                      : "95%"
                  }`,
            width: size.width > 899 ? 450 : "100%",
            borderRadius: "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            borderTop: `${size.width < 899 && "1px solid grey"}`,
            borderLeft: `${size.width > 899 && "1px solid grey"}`,
            transition: "height 2s ease",
          },
        }}
      >
        {sendCryptoLoader || walletTransacLoading || isLoading || !user ? (
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
                  <IconButton
                    size="small"
                    onClick={() => setSelectedWallet("history")}
                  >
                    <ClockCounterClockwise size={24} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    {fundAccount ? "Fund Trade Account" : "Send Crypto"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack p={1} spacing={1.5} overflow={"auto"} mt={1}>
                {/* <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography>Total Deposot</Typography>
                  <Typography>Deposot History</Typography>
                </Stack> */}

                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                  onClick={() => {
                    setSelectedWallet("enteramount");
                  }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <Skeleton
                      variant="circular"
                      width={"40px"}
                      height={"40px"}
                    />
                    <Skeleton
                      variant="text"
                      width={"150px"}
                      sx={{ fontSize: "18px" }}
                    />
                  </Stack>

                  <CaretRight size={24} />
                </Stack>
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                  onClick={() => {
                    setSelectedWallet("enteramount");
                  }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <Skeleton
                      variant="circular"
                      width={"40px"}
                      height={"40px"}
                    />
                    <Skeleton
                      variant="text"
                      width={"150px"}
                      sx={{ fontSize: "18px" }}
                    />
                  </Stack>

                  <CaretRight size={24} />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
            {/* select the asset wallet */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              height={"100%"}
              borderRadius={"30px 30px 0 0"}
              overflow={"hidden"}
              position={"absolute"}
              width={"100%"}
              sx={{
                opacity: selectedWallet ? 0 : 1,
                visibility: selectedWallet ? "hidden" : "visible",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <IconButton
                    size="small"
                    onClick={() => setSelectedWallet("history")}
                  >
                    <ClockCounterClockwise size={24} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    {fundAccount ? "Fund Trade Account" : "Send Crypto"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack p={1} spacing={1.5} overflow={"auto"} mt={1}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack px={1}>
                    <Typography variant="subtitle2">Wallet Balance</Typography>
                    <Typography variant="body1">
                      {user?.isManualAssetMode ? (
                        <Typography variant={"body1"} fontWeight={600}>
                          {coinPriceLoading ? (
                            <Skeleton variant="text" width={"150px"} />
                          ) : conversionRate?.rate ? (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(totalWalletBalanceManual *
                                conversionRate?.rate >
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
                        <Typography variant={"body1"} fontWeight={600}>
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
                              }).format(
                                totalWalletBalance * conversionRate?.rate
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
                              ...(totalWalletBalance > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(totalWalletBalance)
                          ) : (
                            "UNAVAILABLE"
                          )}
                        </Typography>
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} spacing={1}>
                    {/* <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ArrowsClockwise />}
                      sx={{ height: "35px", fontSize: "12px" }}
                      onClick={() => dispatch(getAllWalletAddress())}
                    >
                      refresh
                    </Button> */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ClockCounterClockwise />}
                      sx={{ height: "35px", fontSize: "12px" }}
                      onClick={() => setSelectedWallet("history")}
                    >
                      Transactions
                    </Button>
                  </Stack>
                </Stack>
                <Divider />

                {/* select the asseet wallet */}

                {combinedAssets &&
                  combinedAssets.map((asset) => (
                    <>
                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"center"}
                        backgroundColor={
                          theme.palette.mode === "light"
                            ? "#f2f2f2"
                            : colors.dashboardbackground[100]
                        }
                        p={"16px 16px"}
                        mt={0.5}
                        mx={1}
                        borderRadius={"15px"}
                        onClick={() => {
                          setSelectedWallet("enteramount");
                          setWallet(asset);
                          // dispatch(SETSELECTEDWALLETADDRESS(asset));
                        }}
                        border={`${
                          theme.palette.mode === "light"
                            ? "1px solid #202020"
                            : "1px solid lightgrey"
                        }`}
                      >
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          width={"100%"}
                          spacing={1}
                          sx={{ cursor: "pointer" }}
                        >
                          <img
                            src={asset?.image}
                            alt={asset?.name}
                            style={{
                              borderRadius: "10px",
                              backgroundColor: "white",
                              padding: "2px",
                            }}
                            width={45}
                          />
                          <Stack spacing={-0.6}>
                            <Typography fontSize={"18px"}>
                              {asset?.name} wallet
                            </Typography>
                            <Typography variant="body1">
                              {user?.isManualAssetMode ? (
                                <Typography variant="h5" fontWeight={600}>
                                  {coinPriceLoading ? (
                                    <Skeleton variant="text" width={"80px"} />
                                  ) : conversionRate?.rate ? (
                                    Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: conversionRate?.code,
                                      ...(asset?.ManualFiatbalance *
                                        conversionRate?.rate >
                                      99999999
                                        ? { notation: "compact" }
                                        : {}),
                                    }).format(
                                      asset?.ManualFiatbalance *
                                        conversionRate?.rate
                                    )
                                  ) : (
                                    Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: user?.currency?.code,
                                      ...(asset?.ManualFiatbalance > 99999999
                                        ? { notation: "compact" }
                                        : {}),
                                    }).format(asset?.ManualFiatbalance)
                                  )}
                                </Typography>
                              ) : (
                                <Typography variant="h6" fontWeight={600}>
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
                                        99999999
                                          ? { notation: "compact" }
                                          : {}),
                                      }).format(
                                        asset?.totalValue * conversionRate?.rate
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
                                      ...(asset?.totalValue > 99999999
                                        ? { notation: "compact" }
                                        : {}),
                                    }).format(asset?.totalValue)
                                  ) : (
                                    "UNAVAILABLE"
                                  )}
                                </Typography>
                              )}
                            </Typography>
                          </Stack>
                        </Stack>

                        <CaretRight size={24} />
                      </Stack>
                    </>
                  ))}

                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  pr={2}
                  mx={1}
                  borderRadius={"15px"}
                  onClick={() => {
                    setSelectedWallet("allWallet");
                  }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <img
                      src={walletConnectImg}
                      alt="metaMaskImg"
                      style={{ borderRadius: "10px" }}
                      width={45}
                    />

                    <Typography variant="body1" fontWeight={600}>
                      All Assets Wallet
                    </Typography>
                  </Stack>
                  <Box
                    backgroundColor="grey"
                    p={"1px 3px"}
                    borderRadius={"3px"}
                    fontSize={"12px"}
                    color={"white"}
                    fontWeight={600}
                  >
                    {combinedAssets?.length - 1}+
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            {/* All Withdrawal Methods View */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "allWallet" ? 1 : 0,
                visibility:
                  selectedWallet === "allWallet" ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <IconButton
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>All Assets Wallet</Typography>
                  <IconButton
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider />

              <AllWalletsSendCrypto
                setSelectedWallet={setSelectedWallet}
                setWallet={setWallet}
                // setSelectedWalletImg={setSelectedWalletImg}
              />
            </Stack>

            {/* Ammount to Withdraw */}
            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "enteramount" ? 1 : 0,
                visibility:
                  selectedWallet === "enteramount" ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
              overflow={"auto"}
              pb={"20px"}
            >
              <Stack
                spacing={1}
                p={"15px 15px 10px 15px"}
                position={"sticky"}
                top={0}
                backgroundColor={colors.dashboardforeground[100]}
                zIndex={"1000"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    {fundAccount ? "Fund Trade Account" : "Send Crypto"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider />

              {/* get the allCoins price if outdated */}

              {selectedWallet === "enteramount" && (
                <WithdrawFormLoaderOverlay />
              )}

              {/* get the allCoins price if outdated */}

              <form onSubmit={handleContinue}>
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={2}
                  mt={2}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    px={2.5}
                    alignItems={"center"}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Stack
                        justifyContent={"center"}
                        direction={"row"}
                        border={"2px solid lightgrey"}
                        padding={0.5}
                        borderRadius={"20px"}
                        position={"relative"}
                      >
                        <img
                          src={Wallet === "Bank" ? BankLogoImg : Wallet?.image}
                          alt={Wallet?.name}
                          width={20}
                        />
                      </Stack>
                      <Stack>
                        <Typography>
                          {Wallet === "Bank" ? "Request" : Wallet?.name} Wallet
                        </Typography>
                        <Typography>
                          {user?.isManualAssetMode === true
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(Wallet?.ManualFiatbalance > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(Wallet?.ManualFiatbalance)
                            : Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(Wallet?.balance * CryptoPrice > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(Wallet?.balance * CryptoPrice)}
                        </Typography>
                      </Stack>
                    </Stack>

                    {user?.isManualAssetMode === false && (
                      <Stack>
                        <Typography>
                          {Wallet?.symbol.toUpperCase()} Balance:
                        </Typography>
                        <Typography>
                          {Wallet?.balance.toFixed(8)}{" "}
                          {Wallet?.symbol.toUpperCase()}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Divider flexItem />

                  <Stack spacing={2} width={"90%"}>
                    <Stack spacing={0.5} display={Wallet === "Bank" && "none"}>
                      <InputLabel htmlFor="my-input">To</InputLabel>
                      <OutlinedInput
                        name="to"
                        value={fundAccount ? "Trade Balance" : to}
                        onChange={handleInputChange}
                        placeholder="Enter Wallet Address"
                        required={Wallet !== "Bank" && true}
                        readOnly={fundAccount}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "10px",
                          },
                        }}
                      />
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
                              ? amountInCryoto * CryptoPrice
                              : amount
                          }
                          onChange={handleInputChange}
                          placeholder="0"
                          readOnly={isCryptoInput}
                          disabled={allCoins.length === 0}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "10px",
                            },
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <Typography>{user?.currency?.code}</Typography>
                            </InputAdornment>
                          }
                        />
                      </Stack>

                      {CryptoPrice && user?.isManualAssetMode === false && (
                        <>
                          <Stack pt={4}>
                            <IconButton
                              sx={{ border: "2px solid green" }}
                              onClick={() => {
                                setAmountInCryoto(0);
                                setFormData(initialState);
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
                              {Wallet?.symbol.toUpperCase()}
                            </InputLabel>
                            <OutlinedInput
                              value={
                                isCryptoInput
                                  ? amountInCryoto
                                  : allCoins.length === 0
                                  ? amountInCryoto
                                  : Number(amount / CryptoPrice).toFixed(8)
                              }
                              onChange={(e) =>
                                setAmountInCryoto(e.target.value)
                              }
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
                                    {Wallet?.symbol.toUpperCase()}
                                  </Typography>
                                </InputAdornment>
                              }
                            />
                          </Stack>
                        </>
                      )}
                    </Stack>

                    <Stack spacing={0.5}>
                      <Stack direction={"row"} alignItems={"center"}>
                        <InputLabel htmlFor="my-input">Description</InputLabel>
                        <ExclamationMark />
                      </Stack>
                      <OutlinedInput
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        placeholder="What's this transaction for ? (optional)"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "10px",
                          },
                        }}
                        required
                      />
                    </Stack>

                    <Stack spacing={0.5}>
                      <Typography>
                        Estimated confirmation time 1+ hour
                      </Typography>
                      <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        disabled={isConnecting && true}
                        sx={{ borderRadius: "10px", padding: "10px" }}
                        // onClick={() => {
                        //   setSelectedWallet("Bitcoin");
                        //   // setIsConnecting(true);
                        // }}
                      >
                        Continue
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </form>
            </Stack>

            {/* Send crypto */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "history" &&
                  selectedWallet !== "enteramount"
                    ? 1
                    : 0,
                visibility:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "history" &&
                  selectedWallet !== "enteramount"
                    ? "visible"
                    : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Stack
                spacing={1}
                p={"15px 15px 10px 15px"}
                position={"sticky"}
                top={0}
                backgroundColor={colors.dashboardforeground[100]}
                zIndex={1000}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Quick Check</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Box
                border={"1px dashed orange"}
                padding={"4px 8px"}
                textAlign={"center"}
                m={2}
              >
                <Typography variant="caption">
                  Kindly confirm the details before sending to avoid lose of
                  funds
                </Typography>
              </Box>

              <Divider sx={{ mb: "16px" }}>Confirm Details</Divider>

              <Stack
                spacing={1.5}
                component={Paper}
                // border={"1px solid grey"}
                borderRadius={"10px"}
                p={"16px 16px"}
                mx={2}
                sx={{ wordWrap: "break-word" }}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Stack
                    justifyContent={"center"}
                    direction={"row"}
                    border={"2px solid lightgrey"}
                    padding={0.5}
                    borderRadius={"8px"}
                  >
                    <img
                      src={Wallet === "Bank" ? BankLogoImg : Wallet?.image}
                      alt={Wallet?.name}
                      width={30}
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight={"600"}>
                    {Wallet?.name} Wallet
                  </Typography>
                </Stack>

                <Divider />

                <Stack display={Wallet === "Bank" ? "none" : "flex"}>
                  <Typography fontWeight={"600"}>To:</Typography>
                  <Typography>{fundAccount ? "Trade Balance" : to}</Typography>
                </Stack>

                <Divider
                  sx={{ display: Wallet === "Bank" ? "none" : "block" }}
                />

                <Divider />

                <Stack>
                  <Typography fontWeight={"600"}>Sending Amount:</Typography>
                  <Typography>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code,
                      ...(quickCheckAmount > 999999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(quickCheckAmount)}
                  </Typography>
                </Stack>

                <Divider />

                {user?.isManualAssetMode === false && (
                  <>
                    <Stack display={Wallet === "Bank" ? "none" : "flex"}>
                      <Typography fontWeight={"600"}>
                        Amount in {Wallet?.walletName}:
                      </Typography>
                      <Typography>
                        {quickCheckAmountInCrypto.toFixed(8)}{" "}
                        {Wallet?.symbol.toUpperCase()}
                      </Typography>
                    </Stack>

                    <Divider />
                  </>
                )}

                <Button
                  size="large"
                  variant="contained"
                  disabled={isConnecting && true}
                  sx={{ borderRadius: "10px", padding: "10px" }}
                  onClick={handleSubmit}
                >
                  Send Now
                </Button>
              </Stack>
            </Stack>

            {/* History */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "history" ? 1 : 0,
                visibility: selectedWallet === "history" ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    Transaction History
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClose();
                      setSelectedWallet(null);
                    }}
                  >
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider />
              <Box m={2}>
                {selectedWallet === "history" && (
                  <Activity transactionNumber={"All"} />
                )}
              </Box>
            </Stack>
          </Box>
        )}
      </Drawer>


      <Dialog
        open={openWithdrawalLockModal}
        onClose={handleCloseWithdrawalLockModal}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            const code = formJson.code;
            console.log(code);

            if(code == user?.withdrawalLocked?.lockCode ) {
               setSelectedWallet(Wallet);
               handleCloseWithdrawalLockModal();
            } else {
              toast.error("Wrong Code")
            }
           
          },
        }}
      >
        <DialogTitle>{user?.withdrawalLocked?.lockSubject}</DialogTitle>
        <DialogContent>
          <DialogContentText>
           {user?.withdrawalLocked?.lockComment}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="code"
            label="Enter Code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawalLockModal}>Cancel</Button>
          <Button type="submit">continue</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendCryptoDrawer;
