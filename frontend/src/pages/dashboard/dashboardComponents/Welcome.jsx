import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowRight,
  Bell,
  CaretDown,
  CaretRight,
  ClockCounterClockwise,
  Compass,
  CurrencyCircleDollar,
  Desktop,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Gear,
  Gift,
  HandDeposit,
  HandWithdraw,
  MinusCircle,
  Moon,
  Package,
  PlusCircle,
  Power,
  ShieldChevron,
  SortDescending,
  Sun,
  User,
  UserCircle,
  Wallet,
  X,
  XCircle,
} from "@phosphor-icons/react";
import CryptoBox from "../../../components/CryptoBox";
import GiftSlider from "../../../components/giftslider/GiftSlider";
import { ColorModeContext, tokens, useMode } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import DepositDrawer from "../../../components/drawers/DepositDrawer";
import WithdrawalDrawer from "../../../components/drawers/WithdrawalDrawer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StyledBadge from "../../../components/StyledBadge";
import { shortenText } from "../../../utils";
import CoinDetailsDrawer from "../../../components/drawers/CoinDetailsDrawer";
import {
  changeCurrency,
  logout,
  SETSELECTEDCOIN,
} from "../../../redux/features/auth/authSlice";
import ChangeCurrencyDialog from "../../../components/dialogs/ChangeCurrencyDialog";

import walletSvgIcon from "../../../assets/svgIcons/walletSvgIcon.svg";
import cardSvgIcon from "../../../assets/svgIcons/cardSvgIcon.svg";
// import gif from "../../../assets/svgIcons/gift.gif";
import giftSvgIcon from "../../../assets/svgIcons/giftSvgIcon.svg";
import inviteSvgIcon from "../../../assets/svgIcons/inviteSvgIcon.svg";
import copySvgIcon from "../../../assets/svgIcons/copySvgIcon.svg";
import botSvgIcon from "../../../assets/svgIcons/botSvgIcon.svg";
import signalSvgIcon from "../../../assets/svgIcons/signalSvgIcon.svg";
import demoSvgIcon from "../../../assets/svgIcons/demoSvgIcon.svg";
import earnedSvgIcon from "../../../assets/svgIcons/earnedSvgIcon.svg";
import totalDepositSvgIcon from "../../../assets/svgIcons/totalDepositSvgIcon.svg";
import backgroundSvgImg from "../../../assets/svgIcons/backgroundSvgImg.svg";
import { CryptoImages, currencies } from "../../../data";
import ReferralDrawer from "../../../components/drawers/ReferralDrawer";
import CardDrawer from "../../../components/drawers/CardDrawer";
import RewardsDrawer from "../../../components/drawers/RewardsDrawal";
import CopyTrade from "../../../components/drawers/CopyTrade";
import TradingBot from "../../../components/drawers/TradingBot";
import MarketSignals from "../../../components/drawers/MarketSignals";
import {
  SET_TRADINGMODE,
  SET_TYPEOFDEPOSIT,
} from "../../../redux/features/app/appSlice";
import Notifications from "../../../components/Notifications";
import AllNotificationsDrawer from "../../../components/drawers/AllNotificationsDrawer";
import SettingMenuDrawer from "../../../components/drawers/SettingMenuDrawer";

const Welcome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const size = UseWindowSize();
  const dispatch = useDispatch();

  const { user, allCoins, conversionRate } = useSelector((state) => state.auth);

  const { allCoins: allCoins_coinpaprika, coinPriceLoading   } = useSelector((state) => state.coinPrice);



  const { unreadMessages, newNotifications } = useSelector(
    (state) => state.totalCounts
  );

  const [depositLoader, setdepositLoader] = useState(false);
  const [withdrawerLoader, setwithdrawerLoader] = useState(false);
  const [coinDetailsLoader, setCoinDetailsLoader] = useState(false);

  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
  const [openWithdrawalDrawer, setOpenWithdrawalDrawer] = useState(false);
  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);

  const navigate = useNavigate();

  // Deposit Drawer

  const handleOpenDepositDrawer = () => {
    setOpenDepositDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseDepositDrawer = () => {
    setOpenDepositDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Withdrawal Drawer
  const handleOpenWithdrawalDrawer = () => {
    setOpenWithdrawalDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseWithdrawalDrawer = () => {
    setOpenWithdrawalDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [profileanchorEl, setprofileAnchorEl] = useState(null);
  const profileopen = Boolean(profileanchorEl);
  const handleprofileClick = (e) => {
    setprofileAnchorEl(e.currentTarget);
  };
  const handleprofileClose = () => {
    setprofileAnchorEl(null);
  };

  const [notificationanchorEl, setnotificationAnchorEl] = useState(null);
  const notificationopen = Boolean(notificationanchorEl);
  const handlenotificationClick = (e) => {
    setnotificationAnchorEl(e.currentTarget);
  };
  const handlenotificationClose = () => {
    setnotificationAnchorEl(null);
  };

  // const firstSix = allCoins?.slice(0, 4);
  const firstSix = Array.isArray(allCoins) ? allCoins.slice(0, 4) : [];

  // console.log(firstSix)

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

  // Referral Drawer
  const [openReferralDrawer, setReferralDrawer] = useState(false);

  const handleOpenReferralDrawer = () => {
    setReferralDrawer(true);
  };

  const handleCloseReferralDrawer = () => {
    setReferralDrawer(false);
  };

  // End Referral Drawer

  // Card Drawer
  const [openCardDrawer, setCardDrawer] = useState(false);

  const handleOpenCardDrawer = () => {
    setCardDrawer(true);
  };

  const handleCloseCardDrawer = () => {
    setCardDrawer(false);
  };

  // End Card Drawer

  // Rewards Drawer
  const [openRewardsDrawer, setRewardsDrawer] = useState(false);

  const handleOpenRewardsDrawer = () => {
    setRewardsDrawer(true);
  };

  const handleCloseRewardsDrawer = () => {
    setRewardsDrawer(false);
  };

  // End Rewards Drawer

  // CopyTrade Drawer
  const [openCopyTradeDrawer, setCopyTradeDrawer] = useState(false);

  const handleOpenCopyTradeDrawer = () => {
    setCopyTradeDrawer(true);
  };

  const handleCloseCopyTradeDrawer = () => {
    setCopyTradeDrawer(false);
  };

  // End CopyTrade Drawer

  // TradingBot Drawer
  const [openTradingBotDrawer, setTradingBotDrawer] = useState(false);

  const handleOpenTradingBotDrawer = () => {
    setTradingBotDrawer(true);
  };

  const handleCloseTradingBotDrawer = () => {
    setTradingBotDrawer(false);
  };

  // End TradingBot Drawer

  // MarketSignals Drawer
  const [openMarketSignalsDrawer, setMarketSignalsDrawer] = useState(false);

  const handleOpenMarketSignalsDrawer = () => {
    setMarketSignalsDrawer(true);
  };

  const handleCloseMarketSignalsDrawer = () => {
    setMarketSignalsDrawer(false);
  };

  // End MarketSignals Drawer

  // AllNotificationsDrawer

  const [allNotificationsLoader, setAllNotificationsLoader] = useState(false);
  const [openAllNotificationsDrawer, setOpenAllNotificationsDrawer] =
    useState(false);

  const handleOpenAllNotificationsDrawer = () => {
    setOpenAllNotificationsDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseAllNotificationsDrawer = () => {
    setOpenAllNotificationsDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // end of All AllNotificationsDrawer

  // Settings Drawer
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);

  const handleCloseSettingsMenu = () => {
    setOpenSettingsMenu(false);
  };

  const handleOpenSettingsMenu = () => {
    setOpenSettingsMenu(true);
  };

  // End Settings Drawer

  //hide balance state
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <>
      <Box flex={{ xs: "100%", md: "0 0 65%", lg: "0 0 70%", xl: "0 0 75%" }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                sx={{
                  width: { xs: 50, md: 56 },
                  height: { xs: 50, md: 56 },
                  border: "1px solid green",
                }}
                src={user?.photo}
              />
            </StyledBadge>

            <Stack>
              <Typography
                variant="h6"
                fontSize={{ xs: "16px", lg: "18px", xl: "22px" }}
                display={{ xs: "none", md: "block" }}
              >
                {(() => {
                  const currentHour = new Date().getHours();
                  if (currentHour < 12) return "Good Morning";
                  if (currentHour < 18) return "Good Afternoon";
                  return "Good Evening";
                })()}{" "}
                {user?.firstname}
              </Typography>

              <Typography
                display={{ xs: "block", md: "none" }}
                fontWeight={"600"}
                fontSize={{ xs: "16px", md: "22px" }}
              >
                Hi, {user?.firstname}
              </Typography>

              <Typography
                variant="caption"
                display={{ xs: "none", md: "block" }}
                fontSize={{ xs: "16px", lg: "10px", xl: "16px" }}
              >
                Take a Comprehensive dive into trading.
              </Typography>

              <Typography
                variant="caption"
                display={{ xs: "block", md: "none" }}
                mt={"-3px"}
              >
                {(() => {
                  const currentHour = new Date().getHours();
                  if (currentHour < 12) return "Good Morning";
                  if (currentHour < 18) return "Good Afternoon";
                  return "Good Evening";
                })()}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={1.5}>
            {size.width >= 900 && (
              <>
                <Button
                  startIcon={<PlusCircle size={24} />}
                  variant="outlined"
                  sx={{
                    display: {
                      xs: "none",
                      md: "flex",
                      color:
                        theme.palette.mode === "light"
                          ? "#009e4a"
                          : "rgba(0, 255, 127, 0.8)",
                      borderColor:
                        theme.palette.mode === "light"
                          ? "#009e4a"
                          : "rgba(0, 255, 127, 0.8)",
                      borderRadius: "10px",
                    },
                  }}
                  // color={"secondary"}
                  onClick={() => {
                    dispatch(SET_TYPEOFDEPOSIT("Trade"));
                    setdepositLoader(true);
                    handleOpenDepositDrawer();
                  }}
                >
                  Deposit
                </Button>
                <Button
                  startIcon={<MinusCircle size={24} />}
                  variant="outlined"
                  sx={{
                    display: {
                      xs: "none",
                      md: "flex",
                      color:
                        theme.palette.mode === "light"
                          ? "#009e4a"
                          : "rgba(0, 255, 127, 0.8)",
                      borderColor:
                        theme.palette.mode === "light"
                          ? "#009e4a"
                          : "rgba(0, 255, 127, 0.8)",
                      borderRadius: "10px",
                    },
                  }}
                  // color={"secondary"}
                  onClick={() => {
                    setwithdrawerLoader(true);
                    handleOpenWithdrawalDrawer();
                  }}
                >
                  Withdraw
                </Button>
              </>
            )}

            <IconButton
              // disableRipple
              onClick={handleClick}
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {theme.palette.mode === "dark" ? (
                <Moon weight="bold" />
              ) : (
                <Sun weight="bold" />
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  borderRadius: "15px",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* Light Mode */}
              <MenuItem
                sx={{
                  backgroundColor:
                    savedColorMode === "light" ? "green" : "transparent",
                  color: savedColorMode === "light" ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                onClick={() => colorMode.selectColorMode("light")}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Sun size={24} />
                  <Typography>Light Mode</Typography>
                </Stack>
              </MenuItem>

              {/* Dark Mode */}
              <MenuItem
                sx={{
                  backgroundColor:
                    savedColorMode === "dark" ? "green" : "transparent",
                  color: savedColorMode === "dark" ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                onClick={() => colorMode.selectColorMode("dark")}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Moon size={24} />
                  <Typography>Dark Mode</Typography>
                </Stack>
              </MenuItem>

              {/* System Mode */}
              <MenuItem
                sx={{
                  backgroundColor:
                    savedColorMode === "system" ? "green" : "transparent",
                  color: savedColorMode === "system" ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                onClick={() => colorMode.selectColorMode("system")}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Desktop size={24} />
                  <Typography>System Mode</Typography>
                </Stack>
              </MenuItem>
            </Menu>

            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
              }}
              onClick={handleOpenSettingsMenu}
            >
              <Gear weight="bold" />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
              }}
              onClick={handleprofileClick}
            >
              <User weight="bold" />
            </IconButton>

            <Menu
              anchorEl={profileanchorEl}
              id="account-menu"
              open={profileopen}
              onClose={handleprofileClose}
              // onClick={handleprofileClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  border: "1px solid grey",
                  borderRadius: "15px",
                  width: 400,
                  height: "auto",
                  overflow: "auto",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 50,
                    height: 50,
                    ml: -0.5,
                    mr: 1,
                  },
                  // "&::before": {
                  //   content: '""',
                  //   display: "block",
                  //   position: "absolute",
                  //   top: 0,
                  //   right: 14,
                  //   width: 10,
                  //   height: 10,
                  //   bgcolor: "background.paper",
                  //   transform: "translateY(-50%) rotate(45deg)",
                  //   zIndex: 0,
                  //   border: "1px solid grey",
                  // },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Stack spacing={1}>
                <Stack direction={"row"} alignItems={"center"} p={"10px 16px"}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    width={"100%"}
                  >
                    <Stack direction={"row"} alignItems={"center"}>
                      <Avatar src={user?.photo} alt="profile picture" />
                      <Stack>
                        <Typography variant="h6" fontWeight={"600"}>
                        {user?.firstname+" "+user?.lastname}
                        </Typography>
                        <Typography variant="caption">
                          {" "}
                          {shortenText(user?.email || "", 30)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <IconButton
                      size="small"
                      sx={{ border: "1px solid grey" }}
                      onClick={handleprofileClose}
                    >
                      <X size={18} />
                    </IconButton>
                  </Stack>
                </Stack>
                <Divider />
                <Stack p={"8px 16px"} spacing={2.5}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <CurrencyCircleDollar size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        Balance
                      </Typography>
                    </Stack>
                    <Typography>
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(user?.balance * conversionRate?.rate > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.balance * conversionRate?.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(user?.balance > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.balance)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <ShieldChevron size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        Account Type
                      </Typography>
                    </Stack>
                    <Typography>{user?.accounttype}</Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <Package size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        Package Plan
                      </Typography>
                    </Stack>
                    <Typography>{user?.package}</Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Stack p={"8px 16px"} spacing={2.5}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/dashboard/mailbox")}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <EnvelopeSimple size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        Message
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                      <Typography
                        backgroundColor="red"
                        color={"white"}
                        p={"0px 8px"}
                        borderRadius={"15px"}
                        variant="caption"
                      >
                        {unreadMessages}
                      </Typography>
                      <CaretRight size={24} />
                    </Stack>
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <Moon size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        Theme
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      onClick={() => colorMode.toggleColorMode()}
                    >
                      <Typography>{theme.palette.mode} mode</Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    onClick={() => navigate("/dashboard/profile")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <UserCircle size={24} />
                      <Typography variant="body1" fontWeight={"500"}>
                        My Profile
                      </Typography>
                    </Stack>
                    <CaretRight size={24} />
                  </Stack>
                </Stack>

                <Divider />
                <Stack
                  direction={"row"}
                  spacing={1.5}
                  p={"10px 16px"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => dispatch(logout())}
                >
                  <Power
                    size={24}
                    color="red"
                    weight="bold"
                    onClick={() => {}}
                  />
                  <Typography variant="body1" fontWeight={"500"} color={"red"}>
                    Logout
                  </Typography>
                </Stack>
              </Stack>
            </Menu>

            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => navigate("/dashboard/mailbox")}
            >
              <Badge badgeContent={unreadMessages} color="error">
                <EnvelopeSimple />
              </Badge>
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
              }}
              onClick={handlenotificationClick}
            >
              <Badge badgeContent={newNotifications} color="secondary">
                <Bell />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notificationanchorEl}
              id=""
              open={notificationopen}
              onClose={handlenotificationClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  border: "1px solid grey",
                  borderRadius: "15px",
                  width: 450,
                  height: "auto",
                  maxHeight: "80%",
                  overflow: "auto",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 50,
                    height: 50,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Notifications
                handlenotificationClose={handlenotificationClose}
                handleOpenAllNotificationsDrawer={
                  handleOpenAllNotificationsDrawer
                }
                setAllNotificationsLoader={setAllNotificationsLoader}
              />
            </Menu>
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          mt={{ xs: 1.5, md: 2 }}
          justifyContent={"space-between"}
          display={{ xs: "flex", md: "none" }}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={1}>
            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
              }}
              onClick={() => navigate("/dashboard/mailbox")}
            >
              <Badge badgeContent={unreadMessages} color="error">
                <EnvelopeSimple />
              </Badge>
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
                // display: `${size.width < 355 && "none"}`,
              }}
              onClick={() => navigate("/wallet/home")}
            >
              <Wallet />
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "#f2f2f2"
                    : colors.dashboardbackground[100]
                }`,
                color: theme.palette.mode === "light" ? "#202020" : "white",
                borderRadius: "10px",
              }}
              onClick={handleOpenSettingsMenu}
            >
              <Gear weight="bold" />
            </IconButton>
          </Stack>

          <Stack direction={"row"} spacing={1}>
            <Button
              startIcon={size.width > 412 && <HandWithdraw />}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{
                color: theme.palette.mode === "light" ? "#CC5500" : "orange",
                borderColor:
                  theme.palette.mode === "light" ? "#CC5500" : "orange",
                borderRadius: "10px",
                height: "37px",
              }}
              onClick={() => {
                dispatch(SET_TYPEOFDEPOSIT("Trade"));
                setdepositLoader(true);
                handleOpenDepositDrawer();
              }}
            >
              Deposit
            </Button>
            <Button
              startIcon={size.width > 412 && <HandDeposit />}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{
                color: theme.palette.mode === "light" ? "#CC5500" : "orange",
                borderColor:
                  theme.palette.mode === "light" ? "#CC5500" : "orange",
                borderRadius: "10px",
                height: "37px",
              }}
              onClick={() => {
                setwithdrawerLoader(true);
                handleOpenWithdrawalDrawer();
              }}
            >
              Withdraw
            </Button>
          </Stack>
        </Stack>

        <Stack
          mt={{ xs: 1.5, md: 3 }}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          position={"relative"}
          overflow={"hidden"}
        >
          <Box position={"absolute"} right={-30} bottom={0} top={-20}>
            <img
              src={CryptoImages[0].url}
              width={"100px"}
              alt=""
              style={{
                // backgroundColor: "lightgrey",
                borderRadius: "50%",
                transform: "rotate(-50deg)",
                opacity: theme.palette.mode === "light" ? "0.1" : "0.1",
              }}
            />
          </Box>
          <Stack
            spacing={4}
            direction={"row"}
            width={"100%"}
            pl={2}
            backgroundColor={
              theme.palette.mode === "light"
                ? "RGB(0, 105, 26)"
                : "RGBA(0, 105, 26, 0.8)"
            }
            p={1}
            borderRadius={"10px"}
            sx={{
              backgroundImage: `url(${backgroundSvgImg})`,
              backgroundSize: { xs: "cover", md: "contain" },
              backgroundPosition: "center",
            }}
            color={theme.palette.mode === "light" ? "#f2f2f2" : "white"}
          >
            <Box width={{ xs: "100%", sm: "auto" }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <Typography variant="subtitle1">Trade Balance </Typography>

                  <IconButton
                    size="small"
                    onClick={() => setHideBalance(!hideBalance)}
                  >
                    {hideBalance ? (
                      <EyeSlash weight="bold" fontSize={24} color="white" />
                    ) : (
                      <Eye weight="bold" fontSize={24} color="white" />
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
                  sx={{ cursor: "pointer" }}
                  zIndex={1000}
                >
                  <img
                    src={`https://flagcdn.com/w80/${
                      conversionRate
                        ? conversionRate.flag
                        : user?.currency?.flag
                    }.png`}
                    alt=""
                    width={18}
                    height={18}
                    style={{ borderRadius: "50%" }}
                  />

                  <Typography variant="subtitle2">
                    {conversionRate
                      ? conversionRate.code
                      : user?.currency?.code}
                  </Typography>
                  <CaretDown />
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
              </Stack>

              {hideBalance ? (
                <Typography variant="h4" fontWeight={"500"} mt={"-4px"}>
                  {" "}
                  ********
                </Typography>
              ) : (
                <Typography variant="h4" fontWeight={"500"} mt={"-4px"}>
                  {conversionRate?.rate
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: conversionRate?.code,
                        ...(user?.balance * conversionRate?.rate > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(user?.balance * conversionRate?.rate)
                    : Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(user?.balance > 9999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(user?.balance)}
                </Typography>
              )}

              {hideBalance ? (
                <Typography> ********** BTC</Typography>
              ) : (
                // <Typography>4.43547880 BTC</Typography>

                <Typography >
               {coinPriceLoading ? (
                <Skeleton variant="text" width="150px" />
              ) : (
                <>
                  {user?.balance &&
                    allCoins_coinpaprika[0]?.quotes?.[user?.currency?.code?.toUpperCase()]?.price ? (
                    <>
                      {Number(
                        user?.balance /
                          allCoins_coinpaprika[0].quotes[user?.currency?.code.toUpperCase()].price
                      ).toFixed(8)}{" "}
                      {allCoins_coinpaprika[0].symbol.toUpperCase()}
                    </>
                  ) : (
                    "0 BTC" // Fallback in case price or balance is unavailable
                  )}
                </>
              )}

              </Typography>
              )}

            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />

            {size.width >= 900 && (
              <>
                <Box display={{ xs: "none", md: "block" }}>
                  <Typography variant="subtitle1">Total Deposit</Typography>

                  {hideBalance ? (
                    <Typography variant="h4" fontWeight={"500"} mt={"-4px"}>
                      {" "}
                      ********
                    </Typography>
                  ) : (
                    <Typography variant="h4" fontWeight={"500"} mt={"-5px"}>
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(user?.totalDeposit * conversionRate?.rate >
                            9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.totalDeposit * conversionRate?.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(user?.totalDeposit > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.totalDeposit)}
                    </Typography>
                  )}

               {hideBalance ? (
                <Typography> ********** BTC</Typography>
              ) : (
                // <Typography>4.43547880 BTC</Typography>

                <Typography >
               {coinPriceLoading ? (
                <Skeleton variant="text" width="150px" />
              ) : (
                <>
                  { user?.totalDeposit &&
                    allCoins_coinpaprika[0]?.quotes?.[user?.currency?.code?.toUpperCase()]?.price ? (
                    <>
                      {Number(
                        user?.totalDeposit /
                          allCoins_coinpaprika[0].quotes[user?.currency?.code.toUpperCase()].price
                      ).toFixed(8)}{" "}
                      {allCoins_coinpaprika[0].symbol.toUpperCase()}
                    </>
                  ) : (
                    "0 BTC" // Fallback in case price or balance is unavailable
                  )}
                </>
              )}

              </Typography>
              )}
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", md: "block" } }}
                />
                <Box display={{ xs: "none", md: "block" }}>
                  <Typography variant="subtitle1">Profit Earned</Typography>

                  {hideBalance ? (
                    <Typography variant="h4" fontWeight={"500"} mt={"-4px"}>
                      {" "}
                      ********
                    </Typography>
                  ) : (
                    <Typography variant="h4" fontWeight={"500"} mt={"-5px"}>
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(user?.earnedTotal * conversionRate?.rate >
                            9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.earnedTotal * conversionRate?.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(user?.earnedTotal > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.earnedTotal)}
                    </Typography>
                  )}

          {hideBalance ? (
                          <Typography> ********** BTC</Typography>
                        ) : (
                          // <Typography>4.43547880 BTC</Typography>

                          <Typography >
                        {coinPriceLoading ? (
                          <Skeleton variant="text" width="150px" />
                        ) : (
                          <>
                            {user?.earnedTotal &&
                              allCoins_coinpaprika[0]?.quotes?.[user?.currency?.code?.toUpperCase()]?.price ? (
                              <>
                                {Number(
                                  user?.earnedTotal /
                                    allCoins_coinpaprika[0].quotes[user?.currency?.code.toUpperCase()].price
                                ).toFixed(8)}{" "}
                                {allCoins_coinpaprika[0].symbol.toUpperCase()}
                              </>
                            ) : (
                              "0 BTC" // Fallback in case price or balance is unavailable
                              // "N/A" // Fallback in case price or balance is unavailable
                            )}
                          </>
                        )}

                        </Typography>
                        )}
                </Box>
              </>
            )}
          </Stack>

          {/* <Stack direction={"row"} spacing={2}>
            <IconButton
              sx={{
                display: { xs: "flex", md: "none", lg: "flex" },
                backgroundColor:
                  theme.palette.mode === "light"
                    ? `#f1f3f8`
                    : colors.dashboardbackground[100],
                borderRadius: "10px",
              }}
            >
              <ArrowLeft />
            </IconButton>
            <IconButton
              sx={{
                display: { xs: "flex", md: "none", lg: "flex" },
                backgroundColor:
                  theme.palette.mode === "light"
                    ? `#f1f3f8`
                    : colors.dashboardbackground[100],
                borderRadius: "10px",
              }}
            >
              <ArrowRight />
            </IconButton>
          </Stack> */}
        </Stack>

        {/* <Stack direction={"row"} spacing={1} mt={2} justifyContent={"space-between"}>
          <Chip
            icon={<CurrencyCircleDollar size={25} />}
            label="Total Deposit: $25,208,00"
            variant="outlined"
          />
          <Chip
            icon={<CurrencyCircleDollar size={25} />}
            label="Total Earn: $25,208,00"
            variant="outlined"
          /> */}
        {/* <Chip
            avatar={<Avatar alt="Natacha" src={profilepicture} />}
            label="Avatar"
            variant="outlined"
          />
          <Chip
            avatar={<Avatar alt="Natacha" src={profilepicture} />}
            label="Avatar"
            variant="outlined"
          /> */}
        {/* </Stack> */}

        <Box mt={2} display={{ xs: "flex", md: "none" }}>
          <Grid container spacing={1.5} columns={16}>
            <Grid item xs={8}>
              <Box
                sx={{ flexGrow: 1 }}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"8px 5px"}
                borderRadius={"10px"}
                position={"relative"}
                overflow={"hidden"}
              >
                <Box position={"absolute"} right={-30} bottom={0} top={0}>
                  <img
                    src={earnedSvgIcon}
                    width={"70px"}
                    alt=""
                    style={{
                      // backgroundColor: "lightgrey",
                      // borderRadius: "50%",

                      opacity: theme.palette.mode === "light" ? "0.05" : "0.05",
                    }}
                  />
                </Box>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                  <img src={earnedSvgIcon} alt="" width={40} />

                  <Stack>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Profit Earned
                    </Typography>
                    {hideBalance ? (
                      <Typography fontWeight={"600"}> ********</Typography>
                    ) : (
                      <Typography fontWeight={"600"}>
                        {conversionRate?.rate
                          ? Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(user?.earnedTotal * conversionRate?.rate >
                              999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.earnedTotal * conversionRate?.rate)
                          : Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(user?.earnedTotal > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.earnedTotal)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={8}>
              <Box
                sx={{ flexGrow: 1 }}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"8px 5px"}
                borderRadius={"10px"}
                position={"relative"}
                overflow={"hidden"}
              >
                <Box position={"absolute"} right={-20} bottom={0} top={0}>
                  <img
                    src={totalDepositSvgIcon}
                    width={"70px"}
                    alt=""
                    style={{
                      // backgroundColor: "lightgrey",
                      // borderRadius: "50%",

                      opacity: theme.palette.mode === "light" ? "0.05" : "0.05",
                    }}
                  />
                </Box>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                  <img src={totalDepositSvgIcon} alt="" width={40} />

                  <Stack>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Total Deposit
                    </Typography>
                    {hideBalance ? (
                      <Typography fontWeight={"600"}> ********</Typography>
                    ) : (
                      <Typography fontWeight={"600"}>
                        {conversionRate?.rate
                          ? Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(user?.totalDeposit * conversionRate?.rate >
                              9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.totalDeposit * conversionRate?.rate)
                          : Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(user?.totalDeposit > 9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.totalDeposit)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* {size.width <= 899 && ( */}
        <Stack display={{ xs: "flex", md: "none" }}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mx={"5px"}
            mt={2}
          >
            <Stack direction={"row"} spacing={0.5} alignItems={"center"} mb={1}>
              <Compass size={22} />
              <Typography variant="subtitle2" fontWeight={600}>
                Quick Links
              </Typography>
            </Stack>
            <ArrowRight size={20} />
          </Stack>

          <Box
            sx={{ flexGrow: 1 }}
            backgroundColor={`${colors.dashboardbackground[100]}`}
            boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
            p={"12px 0px"}
            borderRadius={"10px"}
          >
            <Grid container rowSpacing={3} spacing={1.5} textAlign={"center"}>
              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/wallet/home")}
              >
                <img src={walletSvgIcon} alt="" width={36} />

                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  Wallet
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(SET_TRADINGMODE("Demo"));
                  navigate("/dashboard/livetrades");
                }}
              >
                <img src={demoSvgIcon} alt="" width={36} />
                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  Demo
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenCardDrawer}
              >
                <img src={cardSvgIcon} alt="" width={36} />
                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  Card
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenRewardsDrawer}
              >
                <Badge badgeContent={user?.giftRewards.length} color="success">
                  <img src={giftSvgIcon} alt="" width={36} />
                </Badge>
                <Typography fontWeight={"600"} fontSize={"12px"}>
                  Rewards
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenReferralDrawer}
              >
                <img src={inviteSvgIcon} alt="" width={36} />
                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  Referral
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenCopyTradeDrawer}
              >
                <Badge
                  badgeContent={"new"}
                  color="success"
                  sx={{
                    "& .MuiBadge-badge": {
                      top: 0,
                      right: -10,
                    },
                  }}
                >
                  <img src={copySvgIcon} alt="" width={36} />
                </Badge>
                <Typography fontWeight={"600"} fontSize={"12px"}>
                  CopyTrade
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenTradingBotDrawer}
              >
                <img src={botSvgIcon} alt="" width={36} />
                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  TradingBot
                </Typography>
              </Grid>

              <Grid
                item
                xs={3}
                md={3}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenMarketSignalsDrawer}
              >
                <img src={signalSvgIcon} alt="" width={36} />
                <Typography fontWeight={"600"} fontSize={"12px"} mt={"-5px"}>
                  Signals
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
        {/* )} */}

        <Box sx={{ flexGrow: 1 }} mt={3}>
          {size.width < 899 && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mx={"5px"}
            >
              <Stack
                direction={"row"}
                spacing={0.5}
                alignItems={"center"}
                mb={1}
              >
                <SortDescending size={22} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Top Cryptocurrency
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                spacing={0.2}
                alignItems={"center"}
                mb={1}
                zIndex={999}
              >
                <ArrowRight size={20} />
                {/* <Typography>Refresh</Typography> */}
              </Stack>
            </Stack>
          )}

          <Grid container spacing={1.5}>
            {firstSix && firstSix.length > 0
              ? firstSix.map((data, index) => (
                  <Grid
                    item
                    xs={6}
                    md={3}
                    key={index}
                    onClick={() => {
                      dispatch(SETSELECTEDCOIN(data));
                      setCoinDetailsLoader(true);
                      handleOpenCoinDetailsDrawer();
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <CryptoBox data={data} />
                  </Grid>
                ))
              : [1, 2, 3, 4].map((data, index) => (
                  <Grid
                    item
                    xs={6}
                    md={3}
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box
                      width={"100%"}
                      height={{ xs: "140px", md: "170px" }}
                      backgroundColor={`${colors.dashboardbackground[100]}`}
                      boxShadow={
                        theme.palette.mode === "light" && `${theme.shadows[2]}`
                      }
                      borderRadius={"10px"}
                      padding={"10px 20px"}
                    >
                      <Stack height={"100%"} spacing={1.5}>
                        <Stack
                          justifyContent={"center"}
                          alignItems={"center"}
                          height={"100%"}
                          spacing={1}
                        >
                          <XCircle color="red" size={52} />
                          <Typography textAlign={"center"}>
                            Unable to load crypto data at this time
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {size.width <= 899 && (
          <Box width={"100%"} mt={3} mx={"-5px"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mx={"10px"}
            >
              <Stack
                direction={"row"}
                spacing={0.5}
                alignItems={"center"}
                mb={1}
              >
                <Gift size={20} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Promos and Reminders
                </Typography>
              </Stack>
              <ArrowRight size={20} />
            </Stack>
            <GiftSlider />
          </Box>
        )}
      </Box>

      <DepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
      />

      <WithdrawalDrawer
        open={openWithdrawalDrawer}
        handleClose={handleCloseWithdrawalDrawer}
        handleOpen={handleOpenWithdrawalDrawer}
        withdrawerLoader={withdrawerLoader}
        setwithdrawerLoader={setwithdrawerLoader}
      />

      <CoinDetailsDrawer
        open={openCoinDetailsDrawer}
        handleClose={handleCloseCoinDetailsDrawer}
        handleOpen={handleOpenCoinDetailsDrawer}
        coinDetailsLoader={coinDetailsLoader}
        setCoinDetailsLoader={setCoinDetailsLoader}
      />

      {openChangeCurrencyDialog && (
        <ChangeCurrencyDialog
          open={openChangeCurrencyDialog}
          handleClose={handleCloseChangeCurrencyDialog}
          handleOpen={handleOpenChangeCurrencyDialog}
          handleSelectCurrency={handleSelectCurrency}
        />
      )}

      {openReferralDrawer && (
        <ReferralDrawer
          open={openReferralDrawer}
          handleClose={handleCloseReferralDrawer}
          handleOpen={handleOpenReferralDrawer}
        />
      )}

      {openCardDrawer && (
        <CardDrawer
          open={openCardDrawer}
          handleClose={handleCloseCardDrawer}
          handleOpen={handleOpenCardDrawer}
        />
      )}

      {openRewardsDrawer && (
        <RewardsDrawer
          open={openRewardsDrawer}
          handleClose={handleCloseRewardsDrawer}
          handleOpen={handleOpenRewardsDrawer}
        />
      )}

      {openCopyTradeDrawer && (
        <CopyTrade
          open={openCopyTradeDrawer}
          handleClose={handleCloseCopyTradeDrawer}
          handleOpen={handleOpenCopyTradeDrawer}
        />
      )}

      {openTradingBotDrawer && (
        <TradingBot
          open={openTradingBotDrawer}
          handleClose={handleCloseTradingBotDrawer}
          handleOpen={handleOpenTradingBotDrawer}
        />
      )}

      {openMarketSignalsDrawer && (
        <MarketSignals
          open={openMarketSignalsDrawer}
          handleClose={handleCloseMarketSignalsDrawer}
          handleOpen={handleOpenMarketSignalsDrawer}
        />
      )}

      <AllNotificationsDrawer
        open={openAllNotificationsDrawer}
        handleClose={handleCloseAllNotificationsDrawer}
        handleOpen={handleOpenAllNotificationsDrawer}
        allNotificationsLoader={allNotificationsLoader}
        setAllNotificationsLoader={setAllNotificationsLoader}
      />

      <SettingMenuDrawer
        open={openSettingsMenu}
        handleClose={handleCloseSettingsMenu}
        handleOpen={handleOpenSettingsMenu}
      />
    </>
  );
};

export default Welcome;
