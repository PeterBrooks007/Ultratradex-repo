import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bell,
  ChartBar,
  ChartLine,
  ChartLineUp,
  CheckFat,
  ClockCounterClockwise,
  Copy,
  Cube,
  CurrencyCircleDollar,
  Gear,
  Gift,
  GlobeHemisphereWest,
  HandWithdraw,
  IdentificationBadge,
  Lock,
  MagnifyingGlass,
  MinusCircle,
  PaperPlaneTilt,
  Pen,
  PlusCircle,
  Wallet,
} from "@phosphor-icons/react";
import { tokens } from "../../../theme";
import EditProfileDrawer from "./drawers/EditProfileDrawer";
import { useState } from "react";
import FundTradeBalanceDrawer from "./drawers/FundTradeBalanceDrawer";
import DebitTradeBalanceDrawer from "./drawers/DebitTradeBalanceDrawer";
import FundWalletBalanceDrawer from "./drawers/FundWalletBalanceDrawer";
import DebitWalletBalanceDrawer from "./drawers/DebitWalletBalanceDrawer";
import IdApprovalDrawer from "./drawers/IdApprovalDrawer";
import ResidencyApprovalDrawer from "./drawers/ResidencyApprovalDrawer";
import EmailVerificationDrawer from "./drawers/EmailVerificationDrawer";
import ChangeCurrencyDrawer from "./drawers/ChangeCurrencyDrawer";
import DemoAccountDrawer from "./drawers/DemoAccountDrawer";
import AutoTradeSettingsDrawer from "./drawers/AutoTradeSettingsDrawer";
import WithdrawalLockDrawer from "./drawers/WithdrawalLockDrawer";
import LiveTradeDrawer from "./drawers/TradeDrawer";
import { useDispatch } from "react-redux";
import {
  SET_TRADEORDERCLICKED,
  SET_TRADINGMODE,
} from "../../../redux/features/app/appSlice";
import TradeDrawer from "./drawers/TradeDrawer";
import TradeHistoryDrawer from "../../../components/drawers/TradeHistoryDrawer";
import CopyTrade from "../../../components/drawers/CopyTrade";
import AdminCopyTrade from "../../../components/drawers/AdminCopyTrade";
import DepositDrawer from "../../../components/drawers/DepositDrawer";
import AdminDepositDrawer from "./drawers/AdminDepositDrawer";
import AdminWithdrawalDrawer from "./drawers/AdminWithdrawalDrawer";
import UseWindowSize from "../../../hooks/UseWindowSize";
import CustomizeMailDrawer from "../../../components/drawers/CustomizeMailDrawer";
import RewardsDrawer from "../../../components/drawers/RewardsDrawal";
import NftApproval from "../../../components/drawers/NftApproval";
import WalletTransactionsDrawer from "./drawers/WalletTransactionsDrawer";
import UserNotificationsDrawer from "./drawers/UserNotificationsDrawer";

const Operators = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const size = UseWindowSize();

  // EditProfile Drawer
  const [openEditProfileDrawer, setEditProfileDrawer] = useState(false);
  const [EditProfileDrawerLoader, setEditProfileDrawerLoader] = useState(false);

  const handleOpenEditProfileDrawer = () => {
    setEditProfileDrawer(true);
  };

  const handleCloseEditProfileDrawer = () => {
    setEditProfileDrawer(false);
  };
  // End EditProfile Drawer

  // FundTradeBalanceDrawer
  const [openFundTradeBalanceDrawer, setFundTradeBalanceDrawer] =
    useState(false);
  const [fundTradeBalanceLoader, setFundTradeBalanceLoader] = useState(false);

  const handleOpenFundTradeBalanceDrawer = () => {
    setFundTradeBalanceDrawer(true);
  };

  const handleCloseFundTradeBalanceDrawer = () => {
    setFundTradeBalanceDrawer(false);
  };
  // End FundTradeBalanceDrawer

  // DebitTradeBalanceDrawer
  const [openDebitTradeBalanceDrawer, setDebitTradeBalanceDrawer] =
    useState(false);
  const [debitTradeBalanceLoader, setDebitTradeBalanceLoader] = useState(false);

  const handleOpenDebitTradeBalanceDrawer = () => {
    setDebitTradeBalanceDrawer(true);
  };

  const handleCloseDebitTradeBalanceDrawer = () => {
    setDebitTradeBalanceDrawer(false);
  };
  // End FundTradeBalanceDrawer

  // FundWalletBalanceDrawer
  const [openFundWalletBalanceDrawer, setFundWalletBalanceDrawer] =
    useState(false);
  const [fundWalletBalanceLoader, setFundWalletBalanceLoader] = useState(false);

  const handleOpenFundWalletBalanceDrawer = () => {
    setFundWalletBalanceDrawer(true);
  };

  const handleCloseFundWalletBalanceDrawer = () => {
    setFundWalletBalanceDrawer(false);
  };
  // End FundWalletBalanceDrawer

  // DebitWalletBalanceDrawer
  const [openDebitWalletBalanceDrawer, setDebitWalletBalanceDrawer] =
    useState(false);
  const [debitWalletBalanceLoader, setDebitWalletBalanceLoader] =
    useState(false);

  const handleOpenDebitWalletBalanceDrawer = () => {
    setDebitWalletBalanceDrawer(true);
  };

  const handleCloseDebitWalletBalanceDrawer = () => {
    setDebitWalletBalanceDrawer(false);
  };
  // End FundWalletBalanceDrawer

  // IdApprovalDrawer
  const [openIdApprovalDrawer, setIdApprovalDrawer] = useState(false);
  const [idApprovalDrawerLoader, setIdApprovalDrawerLoader] = useState(false);

  const handleOpenIdApprovalDrawer = () => {
    setIdApprovalDrawer(true);
  };

  const handleCloseIdApprovalDrawer = () => {
    setIdApprovalDrawer(false);
  };
  // End IdApprovalDrawer

  // ResidencyApprovalDrawer
  const [openResidencyApprovalDrawer, setResidencyApprovalDrawer] =
    useState(false);
  const [residencyApprovalDrawerLoader, setResidencyApprovalDrawerLoader] =
    useState(false);

  const handleOpenResidencyApprovalDrawer = () => {
    setResidencyApprovalDrawer(true);
  };

  const handleCloseResidencyApprovalDrawer = () => {
    setResidencyApprovalDrawer(false);
  };
  // End ResidencyApprovalDrawer

  // EmailVerificationDrawer
  const [openEmailVerificationDrawer, setEmailVerificationDrawer] =
    useState(false);
  const [emailVerificationDrawerLoader, setEmailVerificationDrawerLoader] =
    useState(false);

  const handleOpenEmailVerificationDrawer = () => {
    setEmailVerificationDrawer(true);
  };

  const handleCloseEmailVerificationDrawer = () => {
    setEmailVerificationDrawer(false);
  };
  // End EmailVerificationDrawer

  // ChangeCurrencyDrawer
  const [openChangeCurrencyDrawer, setChangeCurrencyDrawer] = useState(false);
  const [changeCurrencyDrawerLoader, setChangeCurrencyDrawerLoader] =
    useState(false);

  const handleOpenChangeCurrencyDrawer = () => {
    setChangeCurrencyDrawer(true);
  };

  const handleCloseChangeCurrencyDrawer = () => {
    setChangeCurrencyDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // DemoAccountDrawer
  const [openDemoAccountDrawer, setDemoAccountDrawer] = useState(false);
  const [demoAccountDrawerLoader, setDemoAccountDrawerLoader] = useState(false);

  const handleOpenDemoAccountDrawer = () => {
    setDemoAccountDrawer(true);
  };

  const handleCloseDemoAccountDrawer = () => {
    setDemoAccountDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // AutoTradeSettingsDrawer
  const [openAutoTradeSettingsDrawer, setAutoTradeSettingsDrawer] =
    useState(false);
  const [autoTradeSettingsDrawerLoader, setAutoTradeSettingsDrawerLoader] =
    useState(false);

  const handleOpenAutoTradeSettingsDrawer = () => {
    setAutoTradeSettingsDrawer(true);
  };

  const handleCloseAutoTradeSettingsDrawer = () => {
    setAutoTradeSettingsDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // WithdrawalLocksDrawer
  const [openWithdrawalLocksDrawer, setWithdrawalLocksDrawer] = useState(false);
  const [withdrawalLocksDrawerLoader, setWithdrawalLocksDrawerLoader] =
    useState(false);

  const handleOpenWithdrawalLocksDrawer = () => {
    setWithdrawalLocksDrawer(true);
  };

  const handleCloseWithdrawalLocksDrawer = () => {
    setWithdrawalLocksDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // LiveTradeDrawer
  const [openLiveTradeDrawer, setLiveTradeDrawer] = useState(false);
  const [liveTradeDrawerLoader, setLiveTradeDrawerLoader] = useState(false);

  const handleOpenLiveTradeDrawer = () => {
    setLiveTradeDrawer(true);
  };

  const handleCloseLiveTradeDrawer = () => {
    setLiveTradeDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // TradeHistoryDrawer
  const [openTradeHistoryDrawer, setTradeHistoryDrawer] = useState(false);
  const [tradeHistoryDrawerLoader, setTradeHistoryDrawerLoader] =
    useState(false);

  const handleOpenTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(true);
  };

  const handleCloseTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(false);
  };
  // End ChangeCurrencyDrawer

  // CopyTrade Drawer
  const [openCopyTradeDrawer, setCopyTradeDrawer] = useState(false);
  const [setCopyTradeDrawerLoader, setCopyTraderDrawerLoader] = useState(false);

  const handleOpenCopyTradeDrawer = () => {
    setCopyTradeDrawer(true);
  };

  const handleCloseCopyTradeDrawer = () => {
    setCopyTradeDrawer(false);
  };

  // End CopyTrade Drawer

  // Deposit Drawer
  const [depositLoader, setdepositLoader] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const handleOpenDepositDrawer = () => {
    setOpenDepositDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseDepositDrawer = () => {
    setOpenDepositDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Withdrawal Drawer
  const [withdrawalLoader, setWithdrawalLoader] = useState(false);
  const [openWithdrawalDrawer, setOpenWithdrawalDrawer] = useState(false);
  const handleOpenWithdrawalDrawer = () => {
    setOpenWithdrawalDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseWithdrawalDrawer = () => {
    setOpenWithdrawalDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Customise Mail Drawer
  const [openCustomMailDrawer, setCustomMailDrawer] = useState(false);
  const [customMailDrawerLoader, setCustomMailDrawerLoader] = useState(false);

  const handleOpenCustomMailDrawer = () => {
    setCustomMailDrawer(true);
  };

  const handleCloseCustomMailDrawer = () => {
    setCustomMailDrawer(false);
  };

  // Customise Mail Drawer

  // Rewards Drawer
  const [openRewardsDrawer, setRewardsDrawer] = useState(false);

  const handleOpenRewardsDrawer = () => {
    setRewardsDrawer(true);
  };

  const handleCloseRewardsDrawer = () => {
    setRewardsDrawer(false);
  };

  // End Rewards Drawer

  // NftApproval Drawer
  const [openNftApprovalDrawer, setNftApprovalDrawer] = useState(false);

  const [nftApprovalDrawerLoader, setNftApprovalDrawerLoader] = useState(false);

  const handleOpentNftApprovalDrawer = () => {
    setNftApprovalDrawer(true);
  };

  const handleCloseNftApprovalDrawer = () => {
    setNftApprovalDrawer(false);
  };

  // console.log(openNftApprovalDrawer)
  // End CopyTrade Drawer

  // Wallet Transaction Drawer
  const [walletTransactionLoader, setWalletTransactionLoader] = useState(false);
  const [openWalletTransactionDrawer, setOpenWalletTransactionDrawer] =
    useState(false);
  const handleOpenWalletTransactionDrawer = () => {
    setOpenWalletTransactionDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseWalletTransactionDrawer = () => {
    setOpenWalletTransactionDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // UserNotification Drawer
  const [userNotificationLoader, setUserNotificationLoader] = useState(false);
  const [openUserNotificationDrawer, setOpenUserNotificationDrawer] =
    useState(false);
  const handleOpenUserNotificationDrawer = () => {
    setOpenUserNotificationDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseUserNotificationDrawer = () => {
    setOpenUserNotificationDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        backgroundColor={`${colors.dashboardbackground[100]}`}
        boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
        borderRadius={"10px"}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={2}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Gear size={28} />
            <Typography variant="h6">Operators</Typography>
          </Stack>

          <Box
            display={"flex"}
            backgroundColor={colors.primary[400]}
            borderRadius={"15px"}
            height={"32px"}
          >
            <InputBase
              sx={{ ml: 2, width: "100px" }}
              placeholder="Search Operator"
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <MagnifyingGlass />
            </IconButton>
          </Box>
        </Stack>
        <Divider flexItem sx={{ backgroundColor: "green" }} />

        <Box p={{ xs: 1, md: 2 }} spacing={2} py={{ xs: 3, md: 3 }} mb={5}>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setIdApprovalDrawerLoader(true);
                  handleOpenIdApprovalDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "orange" }}
                >
                  <IdentificationBadge color="black" />
                </IconButton>
                <Stack>
                  <Typography>Identity</Typography>
                  <Typography>Approval</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setAutoTradeSettingsDrawerLoader(true);
                  handleOpenAutoTradeSettingsDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "darkred" }}
                >
                  <ChartLineUp color="white" />
                </IconButton>
                <Stack>
                  <Typography>AutoTrade</Typography>
                  <Typography>Settings</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setEditProfileDrawerLoader(true);
                  handleOpenEditProfileDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "dodgerblue" }}
                >
                  <Pen color="white" />
                </IconButton>
                <Stack>
                  <Typography>Edit</Typography>
                  <Typography>Account</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setFundTradeBalanceLoader(true);
                  handleOpenFundTradeBalanceDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "green" }}
                >
                  <PlusCircle color="white" />
                </IconButton>
                <Stack>
                  <Typography>Fund</Typography>
                  <Typography>Trade_Bal</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setDebitTradeBalanceLoader(true);
                  handleOpenDebitTradeBalanceDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Red" }}
                >
                  <MinusCircle color="white" />
                </IconButton>
                <Stack>
                  <Typography>Debit</Typography>
                  <Typography>Trade_Bal</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setFundWalletBalanceLoader(true);
                  handleOpenFundWalletBalanceDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "violet" }}
                >
                  <Wallet color="black" />
                </IconButton>
                <Stack>
                  <Typography>Fund </Typography>
                  <Typography>Wallet</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setDebitWalletBalanceLoader(true);
                  handleOpenDebitWalletBalanceDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Red" }}
                >
                  <MinusCircle color="white" />
                </IconButton>
                <Stack>
                  <Typography>Debit</Typography>
                  <Typography>Wallet</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADINGMODE("Live"));
                  setLiveTradeDrawerLoader(true);
                  handleOpenLiveTradeDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Fuchsia" }}
                >
                  <ChartLineUp color="white" />
                </IconButton>
                <Stack>
                  <Typography>Live</Typography>
                  <Typography>Trade</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADINGMODE("Demo"));
                  setLiveTradeDrawerLoader(true);
                  handleOpenLiveTradeDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "skyblue" }}
                >
                  <ChartBar color="black" />
                </IconButton>
                <Stack>
                  <Typography>Demo</Typography>
                  <Typography>Trade</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADEORDERCLICKED(""));
                  setTradeHistoryDrawerLoader(true);
                  handleOpenTradeHistoryDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "orange" }}
                >
                  <ClockCounterClockwise color="black" />
                </IconButton>
                <Stack>
                  <Typography>Trade</Typography>
                  <Typography>history</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setdepositLoader(true);
                  handleOpenDepositDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "yellow" }}
                >
                  <ClockCounterClockwise color="black" />
                </IconButton>
                <Stack>
                  <Typography>Deposit</Typography>
                  <Typography>History</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setWithdrawalLoader(true);
                  handleOpenWithdrawalDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "darkred" }}
                >
                  <HandWithdraw color="white" />
                </IconButton>
                <Stack>
                  <Typography>Withdrawal</Typography>
                  <Typography>Request</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setWalletTransactionLoader(true);
                  handleOpenWalletTransactionDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "orange" }}
                >
                  <CurrencyCircleDollar color="black" />
                </IconButton>
                <Stack>
                  <Typography>Wallet</Typography>
                  <Typography>Transactions</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setResidencyApprovalDrawerLoader(true);
                  handleOpenResidencyApprovalDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "gold" }}
                >
                  <CheckFat color="black" />
                </IconButton>
                <Stack>
                  <Typography>Residency</Typography>
                  <Typography>Approval</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setDemoAccountDrawerLoader(true);
                  handleOpenDemoAccountDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Cyan" }}
                >
                  <GlobeHemisphereWest color="black" />
                </IconButton>
                <Stack>
                  <Typography>Demo</Typography>
                  <Typography>Request</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADEORDERCLICKED("TradeOrders"));
                  setTradeHistoryDrawerLoader(true);
                  handleOpenTradeHistoryDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "green" }}
                >
                  <ChartLine color="white" />
                </IconButton>
                <Stack>
                  <Typography>Trade</Typography>
                  <Typography>Orders</Typography>
                </Stack>
              </Stack>
            </Grid>
            {/* <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADEORDERCLICKED("DemoTradeOrder"))
                  setTradeHistoryDrawerLoader(true)
                  handleOpenTradeHistoryDrawer()
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Aqua" }}
                >
                  <ChartBarHorizontal color="black" />
                </IconButton>
                <Stack>
                  <Typography>DemoTrade</Typography>
                  <Typography>Order</Typography>
                </Stack>
              </Stack>
            </Grid>
             */}
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setEmailVerificationDrawerLoader(true);
                  handleOpenEmailVerificationDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "forestgreen" }}
                >
                  <Pen color="white" />
                </IconButton>
                <Stack>
                  <Typography>Email</Typography>
                  <Typography>Verification</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setChangeCurrencyDrawerLoader(true);
                  handleOpenChangeCurrencyDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "gold" }}
                >
                  <CurrencyCircleDollar color="black" />
                </IconButton>
                <Stack>
                  <Typography>Change </Typography>
                  <Typography>Currency</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setChangeCurrencyDrawerLoader(true);
                  handleOpenCopyTradeDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "darkred" }}
                >
                  <Copy color="white" />
                </IconButton>
                <Stack>
                  <Typography>Copied </Typography>
                  <Typography>Trader</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setCustomMailDrawerLoader(true);
                  handleOpenCustomMailDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "dodgerblue" }}
                >
                  <PaperPlaneTilt color="white" />
                </IconButton>
                <Stack>
                  <Typography>
                    {" "}
                    <span style={{ display: size.width < 600 && "none" }}>
                      {"send"}
                    </span>{" "}
                    Customize
                  </Typography>
                  <Typography>Email</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setWithdrawalLocksDrawerLoader(true);
                  handleOpenWithdrawalLocksDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "darkred" }}
                >
                  <Lock color="white" />
                </IconButton>
                <Stack>
                  <Typography>Withdrawal </Typography>
                  <Typography>lock</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setNftApprovalDrawerLoader(true);
                  handleOpentNftApprovalDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Skyblue" }}
                >
                  <Cube color="black" />
                </IconButton>
                <Stack>
                  <Typography>NFT </Typography>
                  <Typography>Settings</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  // setWithdrawalLocksDrawerLoader(true);
                  handleOpenRewardsDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "violet" }}
                >
                  <Gift color="black" />
                </IconButton>
                <Stack>
                  <Typography>Gift </Typography>
                  <Typography>Reward</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={6} md={4}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                border={"1px solid grey"}
                width={"100%"}
                p={2}
                borderRadius={"15px"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setUserNotificationLoader(true);
                  handleOpenUserNotificationDrawer();
                }}
              >
                <IconButton
                  sx={{ borderRadius: "10px", backgroundColor: "Fuchsia" }}
                >
                  <Bell color="black" />
                </IconButton>
                <Stack>
                  <Typography>User</Typography>
                  <Typography>Notifications</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <IdApprovalDrawer
        open={openIdApprovalDrawer}
        handleClose={handleCloseIdApprovalDrawer}
        handleOpen={handleOpenIdApprovalDrawer}
        idApprovalDrawerLoader={idApprovalDrawerLoader}
        setIdApprovalDrawerLoade={setIdApprovalDrawerLoader}
      />

      <EditProfileDrawer
        open={openEditProfileDrawer}
        handleClose={handleCloseEditProfileDrawer}
        handleOpen={handleOpenEditProfileDrawer}
        EditProfileDrawerLoader={EditProfileDrawerLoader}
        setEditProfileDrawerLoader={setEditProfileDrawerLoader}
      />

      <FundTradeBalanceDrawer
        open={openFundTradeBalanceDrawer}
        handleClose={handleCloseFundTradeBalanceDrawer}
        handleOpen={handleOpenFundTradeBalanceDrawer}
        fundTradeBalanceLoader={fundTradeBalanceLoader}
        setFundTradeBalanceLoader={setFundTradeBalanceLoader}
      />

      <DebitTradeBalanceDrawer
        open={openDebitTradeBalanceDrawer}
        handleClose={handleCloseDebitTradeBalanceDrawer}
        handleOpen={handleOpenDebitTradeBalanceDrawer}
        debitTradeBalanceLoader={debitTradeBalanceLoader}
        setDebitTradeBalanceLoader={setDebitTradeBalanceLoader}
      />

      <FundWalletBalanceDrawer
        open={openFundWalletBalanceDrawer}
        handleClose={handleCloseFundWalletBalanceDrawer}
        handleOpen={handleOpenFundWalletBalanceDrawer}
        fundWalletBalanceLoader={fundWalletBalanceLoader}
        setFundWalletBalanceLoader={setFundWalletBalanceLoader}
      />

      <DebitWalletBalanceDrawer
        open={openDebitWalletBalanceDrawer}
        handleClose={handleCloseDebitWalletBalanceDrawer}
        handleOpen={handleOpenDebitWalletBalanceDrawer}
        debitWalletBalanceLoader={debitWalletBalanceLoader}
        setDebitWalletBalanceLoader={setDebitWalletBalanceLoader}
      />

      <ResidencyApprovalDrawer
        open={openResidencyApprovalDrawer}
        handleClose={handleCloseResidencyApprovalDrawer}
        handleOpen={handleOpenResidencyApprovalDrawer}
        residencyApprovalDrawerLoader={residencyApprovalDrawerLoader}
        setResidencyApprovalDrawerLoade={setResidencyApprovalDrawerLoader}
      />

      <EmailVerificationDrawer
        open={openEmailVerificationDrawer}
        handleClose={handleCloseEmailVerificationDrawer}
        handleOpen={handleOpenEmailVerificationDrawer}
        emailVerificationDrawerLoader={emailVerificationDrawerLoader}
        setEmailVerificationDrawerLoader={setEmailVerificationDrawerLoader}
      />

      <ChangeCurrencyDrawer
        open={openChangeCurrencyDrawer}
        handleClose={handleCloseChangeCurrencyDrawer}
        handleOpen={handleOpenChangeCurrencyDrawer}
        changeCurrencyDrawerLoader={changeCurrencyDrawerLoader}
        setChangeCurrencyDrawerLoader={setChangeCurrencyDrawerLoader}
      />

      <DemoAccountDrawer
        open={openDemoAccountDrawer}
        handleClose={handleCloseDemoAccountDrawer}
        handleOpen={handleOpenDemoAccountDrawer}
        demoAccountDrawerLoader={demoAccountDrawerLoader}
        setDemoAccountDrawerLoader={setDemoAccountDrawerLoader}
      />

      <AutoTradeSettingsDrawer
        open={openAutoTradeSettingsDrawer}
        handleClose={handleCloseAutoTradeSettingsDrawer}
        handleOpen={handleOpenAutoTradeSettingsDrawer}
        autoTradeSettingsDrawerLoader={autoTradeSettingsDrawerLoader}
        setAutoTradeSettingsDrawerLoader={setAutoTradeSettingsDrawerLoader}
      />

      <WithdrawalLockDrawer
        open={openWithdrawalLocksDrawer}
        handleClose={handleCloseWithdrawalLocksDrawer}
        handleOpen={handleOpenWithdrawalLocksDrawer}
        withdrawalLocksDrawerLoader={withdrawalLocksDrawerLoader}
        setWithdrawalLocksDrawerLoader={setWithdrawalLocksDrawerLoader}
      />

      <TradeDrawer
        open={openLiveTradeDrawer}
        handleClose={handleCloseLiveTradeDrawer}
        handleOpen={handleOpenLiveTradeDrawer}
        liveTradeDrawerLoader={liveTradeDrawerLoader}
        setLiveTradeDrawerLoader={setLiveTradeDrawerLoader}
      />

      <TradeHistoryDrawer
        open={openTradeHistoryDrawer}
        handleClose={handleCloseTradeHistoryDrawer}
        handleOpen={handleOpenTradeHistoryDrawer}
        tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
        setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
      />

      <AdminCopyTrade
        open={openCopyTradeDrawer}
        handleClose={handleCloseCopyTradeDrawer}
        handleOpen={handleOpenCopyTradeDrawer}
      />

      <AdminDepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
      />

      <AdminWithdrawalDrawer
        open={openWithdrawalDrawer}
        handleClose={handleCloseWithdrawalDrawer}
        handleOpen={handleOpenWithdrawalDrawer}
        withdrawalLoader={withdrawalLoader}
        setWithdrawalLoader={setWithdrawalLoader}
      />

      <CustomizeMailDrawer
        open={openCustomMailDrawer}
        handleClose={handleCloseCustomMailDrawer}
        handleOpen={handleOpenCustomMailDrawer}
        customMailDrawerLoader={customMailDrawerLoader}
        setCustomMailDrawerLoader={setCustomMailDrawerLoader}
      />

      <RewardsDrawer
        open={openRewardsDrawer}
        handleClose={handleCloseRewardsDrawer}
        handleOpen={handleOpenRewardsDrawer}
      />

      <NftApproval
        open={openNftApprovalDrawer}
        handleClose={handleCloseNftApprovalDrawer}
        handleOpen={handleOpentNftApprovalDrawer}
      />

      <WalletTransactionsDrawer
        open={openWalletTransactionDrawer}
        handleClose={handleCloseWalletTransactionDrawer}
        handleOpen={handleOpenWalletTransactionDrawer}
        walletTransactionLoader={walletTransactionLoader}
        setWalletTransactionLoader={setWalletTransactionLoader}
      />

      <UserNotificationsDrawer
        open={openUserNotificationDrawer}
        handleClose={handleCloseUserNotificationDrawer}
        handleOpen={handleOpenUserNotificationDrawer}
        userNotificationLoader={userNotificationLoader}
        setUserNotificationLoader={setUserNotificationLoader}
      />
      


    </>
  );
};

export default Operators;
