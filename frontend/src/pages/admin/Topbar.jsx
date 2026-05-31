import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  Bell,
  CaretCircleLeft,
  CaretRight,
  CurrencyCircleDollar,
  Desktop,
  EnvelopeSimple,
  List,
  MagnifyingGlass,
  Moon,
  Package,
  Power,
  ShieldChevron,
  Sun,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { shortenText } from "../../utils";
import StyledBadge from "../../components/StyledBadge";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { logout, RESET_AUTH } from "../../redux/features/auth/authSlice";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";
import { useNavigate } from "react-router-dom";
import { RESET_EXPERTTRADERS } from "../../redux/features/expertTraders/expertTradersSlice";
import { RESET_MAILBOX } from "../../redux/features/mailbox/mailboxSlice";
import { RESET_TOTALCOUNTS } from "../../redux/features/totalCounts/totalCountsSlice";
import Notifications from "../../components/Notifications";
import AllNotificationsDrawer from "../../components/drawers/AllNotificationsDrawer";
import AllAdminNotifications from "../../components/AllAdminNotifications";
import AllAdminNotificationsDrawer from "../../components/drawers/AllAdminNotificationsDrawer";

const Topbar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const size = UseWindowSize();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const { user } = useSelector((state) => state.auth);


  const { unreadMessages, newNotifications } = useSelector((state) => state.totalCounts);

  


  const [profileanchorEl, setprofileAnchorEl] = useState(null);
  const profileopen = Boolean(profileanchorEl);
  const handleprofileClick = (e) => {
    setprofileAnchorEl(e.currentTarget);
  };
  const handleprofileClose = () => {
    setprofileAnchorEl(null);
  };

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    await dispatch(RESET_AUTH());
    await dispatch(RESET_WITHDRAWAL());
    await dispatch(RESET_DEPOSIT());
    await dispatch(RESET_EXPERTTRADERS());
    await dispatch(RESET_MAILBOX());
    await dispatch(RESET_TOTALCOUNTS());
    
  };

  
  const [notificationanchorEl, setnotificationAnchorEl] = useState(null);
  const notificationopen = Boolean(notificationanchorEl);
  const handlenotificationClick = (e) => {
    setnotificationAnchorEl(e.currentTarget);
  };
  const handlenotificationClose = () => {
    setnotificationAnchorEl(null);
  };


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


  //color mode
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <>
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      backgroundColor={
        theme.palette.mode === "light"
          ? "#f2f2f2"
          : colors.dashboardbackground[100]
      }
      boxShadow={
        theme.palette.mode === "light" ? theme.shadows[1] : theme.shadows[0]
      }
      p={2}
      pl={1}
    >
      {/* SEARCH BAR */}

      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        ml={{ xs: 1, md: 0 }}
      >
        <Box
          onClick={() => setIsCollapsed(!isCollapsed)}
          display={{ xs: "flex", md: "flex" }}
          zIndex={2}
        >
          <IconButton size="small">
          {!isCollapsed ? <CaretCircleLeft size={32} /> :  <List size={28} />
          }
          </IconButton>
         
        </Box>
        <Box
          display={"flex"}
          backgroundColor={theme.palette.mode === "light" ? "grey.200" : colors.primary[400] }
          borderRadius={"10px"}
          // border={"0.5px solid grey"}
        >
          <InputBase
            sx={{ ml: 1, width: { xs: "55px", sm: "450px" } }}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: {xs:  0.5, md: 1} }}>
            <MagnifyingGlass size={18} />
          </IconButton>
        </Box>
      </Stack>

      {/* ICONS */}
      <Box display={"flex"} gap={0.5}>
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
            display: size.width < 355 && "none"
          }}
          onClick={() => {navigate("mailbox")}}
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
            mr: 1,
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
            <AllAdminNotifications handlenotificationClose={handlenotificationClose} handleOpenAllNotificationsDrawer={handleOpenAllNotificationsDrawer} setAllNotificationsLoader={setAllNotificationsLoader} />
            </Menu>

        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar src={user?.photo} onClick={handleprofileClick} sx={{cursor: "pointer"}} />
        </StyledBadge>
        <Menu
          anchorEl={profileanchorEl}
          id="account-menu"
          open={profileopen}
          onClose={handleprofileClose}
          // onClick={handleprofileClose}
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: "15px", // Add borderRadius here
              border: "1px solid grey",
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
                <Typography>$0.00</Typography>
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
                {/* <Typography>{user?.accounttype}</Typography> */}
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
                {/* <Typography>{user?.package}</Typography> */}
              </Stack>
            </Stack>

            <Divider />

            <Stack p={"8px 16px"} spacing={2.5}>
            <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/mailbox")}
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
                // onClick={() => navigate("/dashboard/profile")}
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
            <Stack direction={"row"} spacing={1.5} p={"10px 16px"} onClick={logoutUser} sx={{cursor: "pointer"}}>
              <Power
                size={24}
                color="red"
                weight="bold"
                sx={{ cursor: "pointer" }}
                onClick={() => {}}
              />
              <Typography variant="body1" fontWeight={"500"} color={"red"}>
                Logout
              </Typography>
            </Stack>
          </Stack>
        </Menu>
      </Box>
    </Box>
    
    
      <AllAdminNotificationsDrawer
        open={openAllNotificationsDrawer}
        handleClose={handleCloseAllNotificationsDrawer}
        handleOpen={handleOpenAllNotificationsDrawer}
        allNotificationsLoader={allNotificationsLoader}
        setAllNotificationsLoader={setAllNotificationsLoader}
      />

    </>
  );
};

export default Topbar;
