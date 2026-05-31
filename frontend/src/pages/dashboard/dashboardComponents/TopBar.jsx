import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bell,
  Desktop,
  EnvelopeSimple,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notifications from "../../../components/Notifications";
import AllNotificationsDrawer from "../../../components/drawers/AllNotificationsDrawer";
import UseWindowSize from "../../../hooks/UseWindowSize";

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const size = UseWindowSize()

  const savedColorMode = localStorage.getItem("colorMode") || null;
  const { user } = useSelector((state) => state.auth);

  const { unreadMessages, newNotifications } = useSelector(
    (state) => state.totalCounts
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //notification

  const [notificationanchorEl, setnotificationAnchorEl] = useState(null);
  const notificationopen = Boolean(notificationanchorEl);
  const handlenotificationClick = (e) => {
    setnotificationAnchorEl(e.currentTarget);
  };
  const handlenotificationClose = () => {
    setnotificationAnchorEl(null);
  };

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

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
          <Avatar
            sx={{
              width: { xs: 50, md: 56 },
              height: { xs: 50, md: 56 },
            }}
            src={user?.photo}
          />
          <Stack>
            <Typography  fontSize={{ xs: "16px", md: size.width < 1300 ? "16px"  : "22px" }}>
              Hi, {user?.firstname}
            </Typography>
            <Typography variant="caption" mt={"-3px"}>
              {(() => {
                const currentHour = new Date().getHours();
                if (currentHour < 12) return "Good Morning";
                if (currentHour < 18) return "Good Afternoon";
                return "Good Evening";
              })()}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} spacing={2}>
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
              // display: { xs: "none", md: "flex" },
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

      <AllNotificationsDrawer
        open={openAllNotificationsDrawer}
        handleClose={handleCloseAllNotificationsDrawer}
        handleOpen={handleOpenAllNotificationsDrawer}
        allNotificationsLoader={allNotificationsLoader}
        setAllNotificationsLoader={setAllNotificationsLoader}
      />
    </>
  );
};

export default TopBar;
