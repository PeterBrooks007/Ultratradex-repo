import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import {
  ArrowsClockwise,
  Backspace,
  CaretLeft,
  CaretRight,
  ClockCounterClockwise,
  X,
} from "@phosphor-icons/react";

import walletConnectImg from "../../assets/connectwallet/wallet_connect.jpg";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AllWallets from "../AllWallets.jsx";
import BankLogoImg from "../../assets/bank.png";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
import { useDispatch, useSelector } from "react-redux";
import DepositHistory from "../DepositHistory.jsx";
import { toast } from "react-toastify";
import { requestDepositDetails } from "../../redux/features/deposit/depositSlice.js";
import WithdrawFormLoaderOverlay from "../../pages/dashboard/dashboardComponents/WithdrawFormLoaderOverlay.jsx";
import {
  getAllWalletAddress,
  SETSELECTEDWALLETADDRESS,
} from "../../redux/features/walletAddress/walletAddressSlice.js";
import MakeTheDepositNow from "../MakeTheDepositNow.jsx";

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

const initialState = {
  amount: "",
};

const NumberButtonsWrapper = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridGap: "15px",
  width: "300px",
  margin: "0 auto",
  textAlign: "center",
});

const StyledButton = styled("button")(({ theme }) => ({
  backgroundColor: "transparent",
  border: "none",
  color: theme.palette.mode === "dark" ? "white" : "black",
  fontSize: "24px",
  padding: "8px",
  borderRadius: "5px",
  cursor: "pointer",
  "&:hover": {
    // backgroundColor: theme.palette.mode === "dark" ? "#444" : "#ddd",
  },
  "&:active": {
    boxShadow: "none",
    transform: "translateY(2px)",
  },
}));

const DepositDrawer = ({
  open,
  handleClose,
  handleOpen,
  depositLoader,
  setdepositLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const size = UseWindowSize();

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [Wallet, setWallet] = useState(null);

  // console.log("wallet", Wallet);
  // console.log("slected wallet", Wallet);

  const { user } = useSelector((state) => state.auth);
  const { typeOfDeposit } = useSelector((state) => state.app);
  const { allCoins } = useSelector((state) => state.coinPrice);

  const { isLoading, allWalletAddress, walletAddress, isSuccess, isError  } = useSelector(
    (state) => state.walletAddress
  );

  // const [selectedWalletImg, setSelectedWalletImg] = useState(0);

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (allWalletAddress?.length === 0 && isSuccess === false && isError === false ) {
      dispatch(getAllWalletAddress());
    }
  }, [dispatch, allWalletAddress?.length, isSuccess, isError]);

  
  useEffect(() => {
    if (depositLoader) {
      const timer = setTimeout(() => {
        setdepositLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [depositLoader, setdepositLoader]);

  // const [coinID, setCoinID] = useState(null);
  // console.log("cryptoID", coinID);

  const [formData, setFormData] = useState(initialState);
  const { amount } = formData;

  // console.log(amount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleButtonClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      amount: prev.amount + value, // Append the clicked value
    }));
  };

  const handleBackspace = () => {
    setFormData((prev) => ({
      ...prev,
      amount: prev.amount.slice(0, -1), // Remove the last character
    }));
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      return toast.error("Please enter a valid deposit amount.");
    }

    if (amount < 500) {
      return toast.error(
        `Minimum deposit of ${Intl.NumberFormat("en-US", {
          style: "currency",
          currency: user?.currency?.code,
        }).format(500)}`
      );
    }

    // Retrieve existing session data from localStorage
    const savedSession = localStorage.getItem("depositSession");
    // console.log("saved Sesion", savedSession);

    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const endTime = new Date(sessionData.countdownEndTime).getTime();
      const currentTime = new Date().getTime();

      // Check if the timer has not expired
      if (endTime > currentTime) {
        const remainingMinutes = Math.floor(
          (endTime - currentTime) / (1000 * 60)
        );
        setSelectedWallet(sessionData?.walletName);
        return toast.info(
          `A deposit session is already active! ${remainingMinutes} min(s) remaining. Cancel if you wish to start another.`,
          {
            autoClose: 5000, // Delay time in milliseconds (5 seconds)
          }
        );
      }
    }

    if (Wallet !== "Bank") {
      // Calculate future time
      const futureTime = new Date();
      futureTime.setMinutes(futureTime.getMinutes() + 20);

      // Prepare session data
      const depositSession = {
        countdownEndTime: futureTime.toISOString(),
        walletAddress: walletAddress?.walletAddress,
        amountFiat: amount,
        amountCrypto: Number(amount / CryptoPrice).toFixed(8),
        walletQRCode: walletAddress?.walletQrcode,
        walletName: walletAddress?.walletName,
        walletSymbol: walletAddress?.walletSymbol,
        walletPhoto: walletAddress?.walletPhoto,
        typeOfDeposit: typeOfDeposit,
      };

      // Save session data to localStorage
      localStorage.setItem("depositSession", JSON.stringify(depositSession));
      toast.success(
        "Your deposit session has been activated. You have 20 minutes to complete the deposit before the session expires.",
        {
          autoClose: 10000, // 10 seconds
        }
      );

      // Proceed with the wallet selection
      setSelectedWallet(Wallet);
    } else {
      // Proceed with the wallet selection
      setSelectedWallet(Wallet);
    }
  };

  const [modeOfDeposit, setModeOfDeposit] = useState("Bank Transfer");
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleMakeRequest = async (e) => {
    e.preventDefault();
    if (amount < 500) {
      return toast.error("Minimum deposit of $500");
    }

    const userData = {
      amount,
      method: modeOfDeposit,
    };

    // console.log(userData)
    setIsRequestLoading(true);
    await dispatch(requestDepositDetails(userData));
    setIsRequestLoading(false);
    // setFormData(initialState);
  };

  const first4wallet = Array.isArray(allWalletAddress)
    ? [...allWalletAddress] // Create a new copy of the array because redux is  frozen or immutable and cant be modify with sort
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort the copied array
        .slice(0, 4) // Take the first 4 elements
    : [];

  const priceData = Array.isArray(allCoins)
    ? allCoins.find(
        (coin) => coin?.symbol === walletAddress?.walletSymbol?.toUpperCase().trim()
      )
    : null; // Use null instead of an empty array

  const CryptoPrice = priceData?.quotes?.[user?.currency?.code]?.price ?? null;

  // console.log(CryptoPrice);

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
          zIndex: 1401, // Apply zIndex at the root level too
          "& .MuiDrawer-paper": {
            height:
              size.width > 899
                ? "100%" // Full height for desktop (right anchor)
                : `${
                    selectedWallet &&
                    selectedWallet !== "enteramount" &&
                    selectedWallet !== "allWallet" &&
                    selectedWallet !== "Bank"
                      ? "95%"
                      : "95%"
                  }`,
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
        {depositLoader || isLoading || !user ? (
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
                    <ClockCounterClockwise size={22} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Deposit Funds</Typography>
                  <IconButton size="small" onClick={handleClose}>
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
                    <ClockCounterClockwise size={22} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Deposit Funds</Typography>
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
                    <Typography variant="subtitle2">Total Deposit</Typography>
                    <Typography variant="body1">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(user?.totalDeposit > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(user?.totalDeposit)}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ArrowsClockwise />}
                      sx={{ height: "35px", fontSize: "12px" }}
                      onClick={() => dispatch(getAllWalletAddress())}
                    >
                      refresh
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ClockCounterClockwise />}
                      sx={{ height: "35px", fontSize: "12px" }}
                      onClick={() => setSelectedWallet("history")}
                    >
                      History
                    </Button>
                  </Stack>
                </Stack>

                {/* select the deposit wallet */}

                {first4wallet.map((wallet) => (
                  <>
                    <Stack
                      key={wallet._id}
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
                        setWallet(wallet?.walletName);
                        dispatch(SETSELECTEDWALLETADDRESS(wallet));
                      }}
                      border={`${
                        theme.palette.mode === "light"
                          ? "1px solid #202020"
                          : "1px solid lightgrey"
                      }`}
                      sx={{ cursor: "pointer" }}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        width={"100%"}
                        spacing={1}
                      >
                        <img
                          src={wallet?.walletPhoto}
                          alt={wallet?.walletName}
                          style={{
                            borderRadius: "10px",
                            backgroundColor: "white",
                            padding: "1px",
                          }}
                          width={40}
                        />

                        <Typography fontSize={"18px"} fontWeight={600}>
                          {wallet?.walletName} Deposit
                        </Typography>
                      </Stack>

                      <CaretRight size={24} />
                    </Stack>
                  </>
                ))}

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
                    setWallet("Bank");
                  }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                    sx={{ cursor: "pointer" }}
                  >
                    <img
                      src={BankLogoImg}
                      alt="bank"
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "white",
                        padding: "1px",
                      }}
                      width={40}
                    />

                    <Typography fontSize={"18px"} fontWeight={600}>
                      Request Details
                    </Typography>
                  </Stack>

                  <CaretRight size={24} />
                </Stack>

                {/* run this deposit with card later */}

                {/* <Stack
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
                    setWallet("Bank");
                  }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                  sx={{cursor: "pointer"}}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <img
                      src={BankLogoImg}
                      alt="metaMaskImg"
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "white",
                        padding: "4px",
                      }}
                      width={40}
                    />

                    <Typography fontSize={"18px"} fontWeight={600}>
                      Deposit with Card
                    </Typography>
                  </Stack>

                  <CaretRight size={24} />
                </Stack> */}

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
                      alt="bankLogo"
                      style={{ borderRadius: "10px" }}
                      width={40}
                    />

                    <Typography variant="body1" fontWeight={600}>
                      All Deposit Methods
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
                    {allWalletAddress?.length - 1}+
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            {/* Amount to Deposit */}

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
                    }}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Amount To Deposit</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      handleClose();
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

              {/* end of get the currentprice of the selected coin */}

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
                          src={
                            Wallet === "Bank"
                              ? BankLogoImg
                              : walletAddress?.walletPhoto
                          }
                          alt={walletAddress?.walletName}
                          width={20}
                        />
                      </Stack>
                      <Typography>
                        {Wallet === "Bank"
                          ? "Request"
                          : walletAddress?.walletName}{" "}
                        Method
                      </Typography>
                    </Stack>

                    <Typography>
                      Balance:
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(user?.balance > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(user?.balance)}
                    </Typography>
                  </Stack>

                  <Divider flexItem />

                  <Stack
                    spacing={0}
                    width={"90%"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Stack
                      spacing={0}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <InputLabel htmlFor="my-input">
                        Enter Amount to Deposit
                      </InputLabel>
                      <OutlinedInput
                        readOnly
                        type="text"
                        name="amount"
                        value={amount}
                        onChange={handleInputChange}
                        placeholder="$0.00"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold", // Bold text for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none", // No border
                          },
                          "& .MuiOutlinedInput-input": {
                            textAlign: "center",
                            padding: 0,
                          },
                          "&::placeholder": {
                            fontWeight: "bold", // Bold placeholder text
                          },
                          fontSize: "40px", // Adjust size as needed
                        }}
                      />
                      {CryptoPrice &&
                        Wallet !== "Bank" &&
                        Number(amount / CryptoPrice).toFixed(8)}{" "}
                      {Wallet !== "Bank" &&
                        CryptoPrice &&
                        walletAddress?.walletSymbol.toUpperCase()}
                    </Stack>

                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={2}
                      width={"300px"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      mt={3}
                    >
                      <NumberButtonsWrapper>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                          <StyledButton
                            key={i}
                            type="button"
                            onClick={() => handleButtonClick(i.toString())}
                          >
                            {i}
                          </StyledButton>
                        ))}

                        <StyledButton type="button">.</StyledButton>

                        <StyledButton
                          type="button"
                          name="submit"
                          onClick={() => handleButtonClick("0")}
                        >
                          0
                        </StyledButton>
                        <StyledButton type="button" onClick={handleBackspace}>
                          <Backspace size={32} />
                        </StyledButton>
                      </NumberButtonsWrapper>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: "80%", mt: 2 }}
                    >
                      Continue
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>

            {/* All Wallets View */}

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
                  <IconButton size="small" onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}>
                  <CaretLeft
                    size={20}
                    weight="bold"
                    
                  />
                  </IconButton>
                  <Typography fontWeight={"600"}>All Wallet</Typography>
                  <IconButton size="small" onClick={handleClose}>
                  <X size={20} weight="bold"  />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider />

              <AllWallets
                setSelectedWallet={setSelectedWallet}
                setWallet={setWallet}
                // setSelectedWalletImg={setSelectedWalletImg}
              />
            </Stack>

            {/* Request for Bank detail */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "Bank" ? 1 : 0,
                visibility: selectedWallet === "Bank" ? "visible" : "hidden",
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
                  <CaretLeft
                    size={20}
                    weight="bold"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  />
                  <Typography fontWeight={"600"}>
                    Request for Details
                  </Typography>
                  <X size={20} weight="bold" onClick={handleClose} />
                </Stack>
              </Stack>
              <Divider />

              <form onSubmit={handleMakeRequest}>
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={3}
                  mt={2}
                >
                  <Stack
                    justifyContent={"center"}
                    direction={"row"}
                    border={"2px solid lightgrey"}
                    padding={2}
                    borderRadius={"20px"}
                    position={"relative"}
                  >
                    <img src={BankLogoImg} alt={selectedWallet} width={100} />
                    <Stack
                      position={"absolute"}
                      bottom={"-15px"}
                      backgroundColor={colors.dashboardforeground[100]}
                      minHeight={0}
                      p={"0 10px"}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      spacing={0.5}
                    >
                      <img src={BankLogoImg} alt={selectedWallet} width={20} />

                      <Typography>Request</Typography>
                    </Stack>
                  </Stack>

                  <Divider flexItem />

                  <Box
                    border={"1px dashed orange"}
                    padding={"4px 8px"}
                    textAlign={"center"}
                    m={2}
                  >
                    <Typography variant="caption">
                      Use the form below to request for any details to make your
                      deposit.
                    </Typography>
                  </Box>

                  <Stack spacing={2} width={"90%"}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="my-input">
                        Preferred Mode of Deposit
                      </InputLabel>
                      {/* <OutlinedInput
                        required
                        type="text"
                        name="amount"
                        // readOnly
                        value={modeOfDeposit}
                        onChange={(e) => setModeOfDeposit(e.target.value)}  
                        placeholder="Enter Prefer Mode of deposit"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "10px",
                          },
                        }}
                      /> */}

                      <FormControl fullWidth>
                        {/* <InputLabel id="demo-simple-select-label">
                          Deposit Method
                        </InputLabel> */}
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={modeOfDeposit}
                          // label="Age"
                          onChange={(e) => setModeOfDeposit(e.target.value)}
                          MenuProps={{
                            disablePortal: true, // Ensures it stays inside the drawer
                            sx: { zIndex: 2100 }, // Ensure it's above the drawer
                            PaperProps: {
                              sx: {
                                zIndex: 2100, // Higher than the drawer (2000)
                                position: "absolute",
                              },
                            },
                          }}
                        >
                          <MenuItem value={"Bank Transfer"}>
                            Bank Transfer
                          </MenuItem>
                          <MenuItem value={"Western Union"}>
                            Western Union
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="my-input">
                        Amount to Deposit
                      </InputLabel>
                      <OutlinedInput
                        required
                        readOnly
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={handleInputChange}
                        placeholder="0"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </Stack>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      disabled={isRequestLoading && true}
                      sx={{ borderRadius: "10px", padding: "10px" }}
                      
                    > {
                      isRequestLoading ? (  <CircularProgress size={24} />) : "Make Request"  
                    }
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>

            {/* Make the Deposit Now with wallet details */}

            <Stack
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "history" &&
                  selectedWallet !== "enteramount" &&
                  selectedWallet !== "Bank"
                    ? 1
                    : 0,
                visibility:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "history" &&
                  selectedWallet !== "enteramount" &&
                  selectedWallet !== "Bank"
                    ? "visible"
                    : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <MakeTheDepositNow
                Wallet={Wallet}
                setSelectedWallet={setSelectedWallet}
                handleClose={handleClose}
                amount={amount}
              />
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
                  <Typography fontWeight={"600"}>Deposit History</Typography>
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

              {selectedWallet === "history" && <DepositHistory />}
            </Stack>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default DepositDrawer;
