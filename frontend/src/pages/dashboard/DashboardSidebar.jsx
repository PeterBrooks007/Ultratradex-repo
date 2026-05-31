import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  IconButton,
  Menu,
  Paper,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import LogoImg from "./../../assets/favicon_logo.png";
import {
  CaretRight,
  ChalkboardTeacher,
  ChartBar,
  ChartLineUp,
  Copy,
  CurrencyCircleDollar,
  EnvelopeSimple,
  Gift,
  House,
  Moon,
  Package,
  Power,
  PresentationChart,
  Question,
  Robot,
  ShieldChevron,
  Swap,
  User,
  UserCircle,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { tooltipClasses } from "@mui/material/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_ISLOADING_TRUE,
  SET_TRADINGMODE,
} from "../../redux/features/app/appSlice";
import { logout, RESET_AUTH } from "../../redux/features/auth/authSlice";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";
import CopyTrade from "../../components/drawers/CopyTrade";
import TradingBot from "../../components/drawers/TradingBot";
import MarketSignals from "../../components/drawers/MarketSignals";
import { shortenText } from "../../utils";
import { ColorModeContext } from "../../theme";
import RewardsDrawer from "../../components/drawers/RewardsDrawal";
import HelpSupport from "../../components/drawers/HelpSupport";

const CustomTooltip = styled(({ className, title, ...props }) => (
  <Tooltip title={title} {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#009e4a",
    color: "white",
    fontSize: "1rem",
    padding: "5px 15px",
    fontWeight: "600",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#009e4a",
  },
}));

const DashboardSidebar = ({ Skeletonloader, isScrolling }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const { user, conversionRate } = useSelector((state) => state.auth);

  const { unreadMessages } = useSelector((state) => state.totalCounts);

  // const handleTouchStart = (event, newValue) => {
  //   if (isScrolling) {
  //     // Stop scrolling if currently scrolling
  //     const scrollPosition = window.scrollY;
  //     document.documentElement.scrollTop = scrollPosition;
  //     document.body.scrollTop = scrollPosition;
  //   }
  //   handleChange(event, newValue);
  // };

  const handleChange = (event, newValue) => {
    if (value !== newValue) {
      dispatch(SET_ISLOADING_TRUE());
      setValue(newValue);
      navigate(newValue);
    }
  };

  const handleChangesidebar = (newValue) => {
    if (value !== newValue) {
      dispatch(SET_ISLOADING_TRUE());
      setValue(newValue);
      navigate(newValue);
    }
  };

  useEffect(() => {
    if (value !== location.pathname) {
      setValue(location.pathname);
    }
  }, [location.pathname, value]);

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    await dispatch(RESET_AUTH());
    await dispatch(RESET_WITHDRAWAL());
    await dispatch(RESET_DEPOSIT());
  };

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

  //sidebar avatar menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Rewards Drawer
  const [openRewardsDrawer, setRewardsDrawer] = useState(false);

  const handleOpenRewardsDrawer = () => {
    setRewardsDrawer(true);
  };

  const handleCloseRewardsDrawer = () => {
    setRewardsDrawer(false);
  };

  // HelpSupport Drawer

  const initialState = {
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    photo: user?.photo || "",
    address: {
      address: user?.address?.address || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
    },
  };

  const [profile, setProfile] = useState(initialState);

  useEffect(() => {
    if (user) {
      setProfile({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        photo: user?.photo || "",
        address: {
          address: user?.address?.address || "",
          state: user?.address?.state || "",
          country: user?.address?.country || "",
        },
      });
    }
  }, [dispatch, user]);

  const [openHelpSupportDrawer, setHelpSupportDrawer] = useState(false);
  const handleOpenHelpSupportDrawer = () => {
    setHelpSupportDrawer(true);
  };

  const handleCloseHelpSupportDrawer = () => {
    setHelpSupportDrawer(false);
  };

  // End HelpSupport Drawer

  return (
    <>
      {/* bottom navigation */}

      <Paper
        sx={{
          position: "fixed",
          bottom: "10px",
          left: 0,
          right: 0,
          width: "90%",
          margin: "0 auto",
          borderRadius: "20px",
          overflow: "hidden",
          zIndex: "1000",
          height: "65px", // Increase the height as needed
          opacity: Skeletonloader || isScrolling ? 0 : 1,
          pointerEvents: Skeletonloader || isScrolling ? "none" : "auto",
          transition: "opacity 0.5s ease-in-out",
          display: {
            xs: `${
              Skeletonloader || location.pathname === "/dashboard/livetrades"
                ? "none"
                : "block"
            }`,
            md: "none",
          },
          backdropFilter: "blur(4px)", // Apply the backdrop blur effect
          backgroundColor: `${
            theme.palette.mode === "light"
              ? "rgba(11, 18, 20, 0.9)"
              : "rgba(255, 255, 255, 0.9)"
          }`, // Add a translucent background
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            height: "100%", // Ensure BottomNavigation takes full height
            backgroundColor: "transparent", // Make background transparent to see the blur effect
            "& .MuiBottomNavigationAction-root": {
              color: (theme) =>
                theme.palette.mode === "light" ? "white" : "#111820", // Default color
              minWidth: 0, // Remove minimum width
              padding: "0 8px", // Reduce padding
              "&.Mui-selected": {
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "springgreen"
                    : "forestgreen", // Selected color
              },
              "& .MuiBottomNavigationAction-label": {
                color: "inherit", // Inherit color from root
              },
              "& .MuiSvgIcon-root": {
                color: "inherit", // Inherit color from root
              },
            },
          }}
          showLabels
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            label="Home"
            value="/dashboard/home"
            icon={<House size={28} />}
            // onTouchStart={(event) => handleTouchStart(event, "/dashboard/home")}
          />
          <BottomNavigationAction
            value="/dashboard/prices"
            label="Prices"
            icon={<ChartBar size={28} />}
            // onTouchStart={(event) =>
            //   handleTouchStart(event, "/dashboard/prices")
            // }
          />
          <BottomNavigationAction
            // label="Trade"
            icon={
              <Swap
                size={48}
                style={{
                  borderRadius: "50%",
                  padding: "8px",
                  backgroundColor: "green",
                  color: "white",
                }}
              />
            }
            value="/dashboard/livetrades"
            onClick={() => dispatch(SET_TRADINGMODE("Live"))}
            // onTouchStart={(event) =>
            //   handleTouchStart(event, "/dashboard/livetrades")
            // }
          />
          <BottomNavigationAction
            label="Wallet"
            value="/wallet/home"
            icon={<Wallet size={28} />}
            // onClick={handleChange}
          />
          <BottomNavigationAction
            label="Profile"
            value="/dashboard/profile"
            icon={<User size={28} />}
            // onTouchStart={(event) =>
            //   handleTouchStart(event, "/dashboard/profile")
            // }
          />
        </BottomNavigation>
      </Paper>

      {/* Side Navbar */}

      <Stack
        position={"fixed"}
        top={0}
        left={0}
        bottom={0}
        justifyContent={"space-between"}
        width="60px"
        height="100vh"
        padding={"15px 20px 20px 20px"}
        alignItems={"center"}
        display={{ xs: "none", md: "flex" }}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <IconButton>
          <img src={LogoImg} alt="logo" width="25" />
        </IconButton>

        <Link
          to={"/dashboard/home"}
          onClick={() => {
            handleChangesidebar("/dashboard/home");
          }}
        >
          <CustomTooltip title="Home" placement="right">
            <IconButton
              sx={{
                color: theme.palette.mode === "light" ? "#202020" : "white",
              }}
            >
              <House size={30} />
            </IconButton>
          </CustomTooltip>
        </Link>

        <Stack spacing={3}>
          <Stack
            spacing={1}
            backgroundColor={"rgba(0,158,74,0.2)"}
            borderRadius={"25px"}
            p={"10px 0"}
          >
            <Link
              to={"/dashboard/livetrades"}
              onClick={() => {
                dispatch(SET_TRADINGMODE("Live"));
                handleChangesidebar("/dashboard/livetrades");
              }}
            >
              <CustomTooltip title="Live Trade " placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <ChartLineUp size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <Link
              to={"/wallet/home"}
              onClick={() => {
                handleChangesidebar("/wallet/home");
              }}
            >
              <CustomTooltip title="Wallet" placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <Wallet size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <Link
              to={"/dashboard/prices"}
              onClick={() => {
                handleChangesidebar("/dashboard/prices");
              }}
            >
              <CustomTooltip title="Prices" placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <ChartBar size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <CustomTooltip
              title="Copy Trade"
              placement="right"
              onClick={handleOpenCopyTradeDrawer}
            >
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
              >
                <Copy size={30} />
              </IconButton>
            </CustomTooltip>
          </Stack>

          <Stack
            spacing={1}
            backgroundColor={"rgba(208,23,36, 0.2)"}
            borderRadius={"25px"}
            p={"10px 0"}
          >
            <CustomTooltip
              title="Trading Bot"
              placement="right"
              onClick={handleOpenTradingBotDrawer}
            >
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
              >
                <Robot size={30} />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              title="Market Signals"
              placement="right"
              onClick={handleOpenMarketSignalsDrawer}
            >
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
              >
                <PresentationChart size={30} />
              </IconButton>
            </CustomTooltip>

            <Link
              to={"/dashboard/livetrades"}
              onClick={() => {
                dispatch(SET_TRADINGMODE("Demo"));
                handleChangesidebar("/dashboard/livetrades");
              }}
            >
              <CustomTooltip title="Demo Trade" placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <ChalkboardTeacher size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            {/* <CustomTooltip title="Card" placement="right">
            <IconButton
              sx={{
                color: theme.palette.mode === "light" ? "#202020" : "white",
              }}
            >
              <CreditCard size={30} />
            </IconButton>
            </CustomTooltip> */}
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <CustomTooltip title="Reward Hub" placement="right">
            <IconButton
              sx={{
                color: theme.palette.mode === "light" ? "#202020" : "white",
              }}
              onClick={handleOpenRewardsDrawer}
            >
              <Badge badgeContent={user?.giftRewards?.length} color="success">
                <Gift size={28} />
              </Badge>
            </IconButton>
          </CustomTooltip>

          <CustomTooltip title="Contact Support" placement="right">
            <IconButton
              sx={{
                color: theme.palette.mode === "light" ? "#202020" : "white",
              }}
              onClick={handleOpenHelpSupportDrawer}
            >
              <Question size={30} />
            </IconButton>
          </CustomTooltip>
        </Stack>

        <Stack>
          <IconButton
            sx={{ color: theme.palette.mode === "light" ? "#202020" : "white" }}
            onClick={handleClick}
          >
            <Avatar
              sx={{ width: "40px", height: "40px", border: "1px solid green" }}
              src={user?.photo}
            />
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
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
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
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
                    onClick={handleClose}
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
                      : user &&
                        Intl.NumberFormat("en-US", {
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
                onClick={logoutUser}
              >
                <Power size={24} color="red" weight="bold" onClick={() => {}} />
                <Typography variant="body1" fontWeight={"500"} color={"red"}>
                  Logout
                </Typography>
              </Stack>
            </Stack>
          </Menu>
        </Stack>
      </Stack>

      <CopyTrade
        open={openCopyTradeDrawer}
        handleClose={handleCloseCopyTradeDrawer}
        handleOpen={handleOpenCopyTradeDrawer}
      />

      <TradingBot
        open={openTradingBotDrawer}
        handleClose={handleCloseTradingBotDrawer}
        handleOpen={handleOpenTradingBotDrawer}
      />

      <MarketSignals
        open={openMarketSignalsDrawer}
        handleClose={handleCloseMarketSignalsDrawer}
        handleOpen={handleOpenMarketSignalsDrawer}
      />

      {openRewardsDrawer && (
        <RewardsDrawer
          open={openRewardsDrawer}
          handleClose={handleCloseRewardsDrawer}
          handleOpen={handleOpenRewardsDrawer}
        />
      )}

      <HelpSupport
        open={openHelpSupportDrawer}
        handleClose={handleCloseHelpSupportDrawer}
        handleOpen={handleOpenHelpSupportDrawer}
        profile={profile}
        setProfile={setProfile}
      />
    </>
  );
};

export default DashboardSidebar;
