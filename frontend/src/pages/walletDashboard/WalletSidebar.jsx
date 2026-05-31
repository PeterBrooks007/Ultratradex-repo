import { useContext, useEffect, useState } from "react";
import {
  Avatar,
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
  Cube,
  Link as LinkIcon,
  House,
  Question,
  Wallet,
  Coins,
  PlusCircle,
  ShareFat,
  CurrencyCircleDollar,
  CreditCard,
  ChartPie,
  Power,
  CaretRight,
  UserCircle,
  Moon,
  EnvelopeSimple,
  Package,
  ShieldChevron,
  X,
} from "@phosphor-icons/react";
import { ColorModeContext } from "../../theme";
import { tooltipClasses } from "@mui/material/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_FUNDACCOUNT,
  SET_ISLOADING_TRUE,
  SET_TYPEOFDEPOSIT,
} from "../../redux/features/app/appSlice";
import ConnectWalletModal from "../../components/drawers/ConnectWalletModal";
import CardDrawer from "../../components/drawers/CardDrawer";
import DepositDrawer from "../../components/drawers/DepositDrawer";
import SendCryptoDrawer from "../../components/drawers/SendCryptoDrawer";
import HelpSupport from "../../components/drawers/HelpSupport";
import { shortenText } from "../../utils";
import { logout, RESET_AUTH } from "../../redux/features/auth/authSlice";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";

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

const WalletSidebar = ({ Skeletonloader, isScrolling }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const colorMode = useContext(ColorModeContext);

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
    if (value !== newValue && newValue !== "") {
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

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // Clean up when the component is unmounted
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Card Drawer
  const [openCardDrawer, setCardDrawer] = useState(false);

  const handleOpenCardDrawer = () => {
    setCardDrawer(true);
  };

  const handleCloseCardDrawer = () => {
    setCardDrawer(false);
  };

  // End Card Drawer

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

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    await dispatch(RESET_AUTH());
    await dispatch(RESET_WITHDRAWAL());
    await dispatch(RESET_DEPOSIT());
  };

  //sidebar avatar menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          opacity: Skeletonloader ? 0 : 1,
          pointerEvents: Skeletonloader ? "none" : "auto",
          display: { xs: `${Skeletonloader ? "none" : "block"}`, md: "none" },
          transition: "opacity 0.5s ease-in-out",
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
            height: "100%",
            backgroundColor: "transparent",
            "& .MuiBottomNavigationAction-root": {
              color: (theme) =>
                theme.palette.mode === "light" ? "white" : "#111820",
              minWidth: 0,
              padding: "0 8px",
              "&.Mui-selected": {
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "springgreen"
                    : "forestgreen",
              },
              "& .MuiBottomNavigationAction-label": {
                color: "inherit",
              },
              "& .MuiSvgIcon-root": {
                color: "inherit",
              },
            },
          }}
          showLabels
          value={value}
          onChange={handleChange} // Use the modified handleChange
        >
          <BottomNavigationAction
            label="Home"
            value="/dashboard/home"
            icon={<House size={28} />}
            // onTouchStart={(event) => handleTouchStart(event, "/dashboard/home")}
          />
          <BottomNavigationAction
            label="Portfolio"
            value="/wallet/home"
            icon={<ChartPie size={28} />}
            // onTouchStart={(event) => handleTouchStart(event, "/wallet/home")}
          />
          <BottomNavigationAction
            label="NFTs"
            icon={<Cube size={28} />}
            value="/wallet/nfts"
            // onTouchStart={(event) => handleTouchStart(event, "/wallet/nfts")}
          />
          <BottomNavigationAction
            label="Assets"
            value="/wallet/assets"
            icon={<Coins size={28} />}
            // onTouchStart={(event) => handleTouchStart(event, "/wallet/assets")}
          />
          <BottomNavigationAction
            label="Connect"
            value=""
            icon={<Wallet size={28} />}
            // onTouchStart={(event) => {
            //   event.stopPropagation();
            //   handleOpenMenu();
            // }}
            onClick={(event) => {
              event.stopPropagation();
              handleOpenMenu();
            }}
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
        <Stack spacing={3}>
          <IconButton>
            <img src={LogoImg} alt="logo" width="25" />
          </IconButton>

          <CustomTooltip
            title="Home"
            placement="right"
            to={"/dashboard/home"}
            onClick={() => {
              handleChangesidebar("/dashboard/home");
            }}
          >
            <IconButton
              sx={{
                color: theme.palette.mode === "light" ? "#202020" : "white",
              }}
            >
              <House size={30} />
            </IconButton>
          </CustomTooltip>

          <Stack
            spacing={1}
            backgroundColor={"rgba(0,158,74,0.2)"}
            borderRadius={"25px"}
            p={"10px 0"}
          >
            <Link
              to={"/wallet/home"}
              onClick={() => {
                handleChangesidebar("/wallet/home");
              }}
            >
              <CustomTooltip
                title="Portfolio"
                placement="right"
                to={"/wallet/home"}
                onClick={() => {
                  handleChangesidebar("/wallet/home");
                }}
              >
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <ChartPie size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <Link
              to={"/wallet/assets"}
              onClick={() => {
                handleChangesidebar("/wallet/assets");
              }}
            >
              <CustomTooltip title="Assets" placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <Coins size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <Link
              to={"/wallet/nfts"}
              onClick={() => {
                handleChangesidebar("/wallet/nfts");
              }}
            >
              <CustomTooltip title="Nfts" placement="right">
                <IconButton
                  sx={{
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                  }}
                >
                  <Cube size={30} />
                </IconButton>
              </CustomTooltip>
            </Link>

            <CustomTooltip title="Connect Wallet" placement="right">
              <IconButton
                onClick={handleOpenMenu}
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
              >
                <Wallet size={30} />
              </IconButton>
            </CustomTooltip>
          </Stack>

          <Stack
            spacing={1}
            backgroundColor={"rgba(208,23,36, 0.2)"}
            borderRadius={"25px"}
            p={"10px 0"}
          >
            <CustomTooltip title="Deposit" placement="right">
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
                onClick={() => {
                  dispatch(SET_TYPEOFDEPOSIT("Wallet"));
                  setdepositLoader(true);
                  handleOpenDepositDrawer();
                }}
              >
                <PlusCircle size={30} />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Send Crypto" placement="right">
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
                onClick={() => {
                  dispatch(SET_FUNDACCOUNT(false));
                  setSendCryptoLoader(true);
                  handleOpenSendCryptoDrawer();
                }}
              >
                <ShareFat size={30} />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Fund Trade" placement="right">
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
                onClick={() => {
                  dispatch(SET_FUNDACCOUNT(true));
                  setSendCryptoLoader(true);
                  handleOpenSendCryptoDrawer();
                }}
              >
                <CurrencyCircleDollar size={30} />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              title="Card"
              placement="right"
              onClick={handleOpenCardDrawer}
            >
              <IconButton
                sx={{
                  color: theme.palette.mode === "light" ? "#202020" : "white",
                }}
              >
                <CreditCard size={30} />
              </IconButton>
            </CustomTooltip>
          </Stack>
        </Stack>

        <Stack spacing={2}>
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
            <Avatar sx={{ width: "40px", height: "40px" }} src={user?.photo} />
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

      <ConnectWalletModal
        open={openMenu}
        handleClose={handleCloseMenu}
        handleOpen={handleOpenMenu}
      />

      <CardDrawer
        open={openCardDrawer}
        handleClose={handleCloseCardDrawer}
        handleOpen={handleOpenCardDrawer}
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

export default WalletSidebar;
