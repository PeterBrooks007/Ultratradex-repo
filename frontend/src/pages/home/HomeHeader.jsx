import {
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LogoImg from "./../../assets/favicon_logo.png";
import { ColorModeContext, tokens } from "../../theme";
import { useContext, useState } from "react";
import MenuDrawer from "../../components/drawers/MenuDrawer";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { Desktop, List, Moon, Sun } from "@phosphor-icons/react";

const HomeHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const [openMenu, setOpenMenu] = useState(false);

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };



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
      display="flex"
      justifyContent={{ xs: "space-between", md: "space-around" }}
      width={"100%"}
      alignItems="center"
      sx={{
        // borderBottom: `1px solid ${colors.primary[300]}`,
        padding: { xs: "16px 0px", md: "12px 8px" },
      }}
      backgroundColor="black"
    >
      <Box display={"flex"} justifyContent="center" gap={0} alignItems="center">
        <Box display={{ xs: "flex", lg: "none" }}>
          <IconButton
            onClick={handleOpenMenu}
            sx={{ color: theme.palette.mode === "light" ? "white" : "white" }}
          >
            <List />
          </IconButton>
        </Box>

        <Link component={RouterLink} to="/">
          <img
            src={LogoImg}
            alt="logo"
            width="40px"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          />
        </Link>

        <Link component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
          <Typography
            variant="h5"
            fontWeight={"700"}
            sx={{ display: { xs: "none", sm: "flex", color: "white" } }}
          >
            UltraTradex
          </Typography>
        </Link>
      </Box>

      <nav>
        <Box
          display={{ xs: "none", lg: "flex" }}
          gap={4}
          sx={{ fontSize: "18px", fontWeight: 700 }}
        >
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive
                ? { color: "springgreen", fontWeight: "400", textDecoration: "none" }
                : { color: "white", textDecoration: "none" }
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) =>
              isActive
                ? { color: "springgreen", fontWeight: "400", textDecoration: "none" }
                : { color: "white", textDecoration: "none" }
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/terms"
            style={({ isActive }) =>
              isActive
                ? { color: "springgreen", fontWeight: "400", textDecoration: "none" }
                : { color: "white", textDecoration: "none" }
            }
          >
            Terms
          </NavLink>
          
          <NavLink
            to="/privacy-policy"
            style={({ isActive }) =>
              isActive
                ? { color: "springgreen", fontWeight: "400", textDecoration: "none" }
                : { color: "white", textDecoration: "none" }
            }
          >
            Privacy Policy
          </NavLink>

          <NavLink
            to="/contact-us"
            style={({ isActive }) =>
              isActive
                ? { color: "green", fontWeight: "bold", textDecoration: "none" }
                : { color: "white", textDecoration: "none" }
            }
          >
           Contact Us
          </NavLink>

        
        </Box>
      </nav>

      <Box display="flex" gap={1} mr={1}>
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

        <Button
          size="small"
          component={RouterLink}
          to="/auth/get-started"
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: "10px",
            p: "4px 10px",
            display: {
              xs: "flex",
              md: "none",
              color: "white",
              backgroundColor: "green",
            },
          }}
        >
          Get Started
        </Button>

        {/* <IconButton onClick={handleOpenSettingsMenu}>
          <Gear />
        </IconButton> */}

        <Box display={{ xs: "none", md: "flex" }} gap={2}>
          <Button
            component={RouterLink}
            to="/auth/login"
            variant="outlined"
            color="secondary"
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/auth/register"
            variant="contained"
            color="secondary"
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>



<MenuDrawer
open={openMenu}
handleClose={handleCloseMenu}
handleOpen={handleOpenMenu}
/>


</>
  );
};

export default HomeHeader;
