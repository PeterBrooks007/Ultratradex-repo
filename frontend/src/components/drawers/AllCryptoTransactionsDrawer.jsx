import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme.js";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  ArrowsLeftRight,
  Calculator,
  CaretLeft,
  CaretRight,
  ClockCounterClockwise,
  Copy,
  ExclamationMark,
  Link,
  Question,
  X,
} from "@phosphor-icons/react";

import walletConnectImg from "../../assets/connectwallet/wallet_connect.jpg";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ManualConnectWallet from "./ManualConnectWallet.jsx.jsx";
import AllWallets from "../AllWallets.jsx";
import connectWalletImages from "../connectWalletImages.js";
import { CryptoImages } from "../../data/index.js";
import bitcoinWalletImg from "../../assets/bitcoin_wallet.jpeg";
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
import { addTransaction, getUserWalletTransactions } from "../../redux/features/walletTransactions/walletTransactionsSlice.js";
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

const AllCryptoTransactionsDrawer = ({
  open,
  handleClose,
  handleOpen,
  allCryptoTransactionsLoader,
  setAllCryptoTransactionsLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [Wallet, setWallet] = useState(null);

  // console.log(Wallet)

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
  }, [dispatch]);

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
    if (allCryptoTransactionsLoader) {
      const timer = setTimeout(() => {
        setAllCryptoTransactionsLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allCryptoTransactionsLoader, setAllCryptoTransactionsLoader]);


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
        {allCryptoTransactionsLoader || !user ? (
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
                  >
                        
                    <ClockCounterClockwise size={24} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    All Transaction History
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

              <Stack p={1} spacing={1} overflow={"auto"} mt={1}>
                {[1, 2].map((_, index) => (
                  <Stack
                    key={index}
                    spacing={1}
                    direction={"row"}
                    alignItems={"center"}
                    p={"0px 8px"}
                    mt={0.5}
                    mx={1}
                    borderRadius={"15px"}
                    onClick={() => {
                      setSelectedWallet("enteramount");
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      width={"100%"}
                      spacing={1.5}
                    >
                      <Skeleton
                        variant="rectangle"
                        width={"40px"}
                        height={"40px"}
                        sx={{ borderRadius: "10px" }}
                      />
                      <Stack>
                        <Skeleton
                          variant="text"
                          width={"80px"}
                          sx={{ fontSize: "16px" }}
                        />
                        <Skeleton
                          variant="text"
                          width={"100px"}
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
                        width={"100px"}
                        sx={{ fontSize: "16px" }}
                      />
                    </Stack>
                  </Stack>
                ))}
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
                    onClick={() => dispatch(getUserWalletTransactions())}
                  >
                    <ArrowsClockwise size={24} weight="fill" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    All Transaction History
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

              <Box m={2} height={"100%"} overflow={"auto"}>
                <Activity transactionNumber={"All"} />
              </Box>
            </Stack>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default AllCryptoTransactionsDrawer;
