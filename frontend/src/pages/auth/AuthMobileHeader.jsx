import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LogoImg from "./../../assets/favicon_logo.png";
import { logout, RESET_AUTH } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";

const AuthMobileHeader = ({ writeUp, buttonText, link, accountSetup }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    dispatch(RESET_AUTH());
    dispatch(RESET_WITHDRAWAL());
    dispatch(RESET_DEPOSIT());
  };

  return (
    <>
      <Stack
        alignItems={"flex-end"}
        direction={{ xs: "row", md: "column" }}
        justifyContent={"space-between"}
        width={"100%"}
        p={1.5}
      >
        <Stack
          direction={"row"}
          spacing={0.5}
          alignItems={"center"}
          sx={{ cursor: "pointer" }}
          display={{ xs: "flex", md: "none" }}
          onClick={() => {
            navigate("/");
          }}
        >
                   <img src={LogoImg} alt="logo" width={40} />
           <Typography variant="h6" fontWeight={"600"}>
                      UltraTradex
                      </Typography>
        </Stack>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          display={accountSetup === true && "none"}
        >
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

          <Typography variant="subtitle2" display={{ xs: "none", sm: "flex" }}>
            {writeUp}
          </Typography>
          <Button
            // size="small"
            // variant="contained"
            onClick={() => {
              if (link === "logoutUser") {
                logoutUser();
              } else {
                navigate(link);
              }
            }}
            sx={{borderRadius: "10px", p: "4px 10px", display: {xs: "flex", md: "flex", color: "white", backgroundColor: "green"}}}

          >
            {buttonText}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default AuthMobileHeader;
