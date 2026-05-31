import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  CaretRight,
  Envelope,
  EnvelopeSimple,
  FileText,
  House,
  Info,
  ShieldCheck,
  TrayArrowDown,
  XCircle,
} from "@phosphor-icons/react";
import {
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import logo from "../../assets/logo.png";
import { IOSSwitch } from "../../pages/dashboard/Profile";
import { ColorModeContext, tokens } from "../../theme";
import { Link as RouterLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Language from "./Language";

const navItems = [
  { text: "Home", link: "/", icon: <House size={22} /> },
  { text: "About Us", link: "/about", icon: <Info size={22} /> },
  {
    text: "Privacy Policy",
    link: "/privacy-policy",
    icon: <ShieldCheck size={22} />,
  },
  { text: "Terms & Conditions", link: "/terms", icon: <FileText size={22} /> },
  {
    text: "Contact Us",
    link: "/contact-us",
    icon: <EnvelopeSimple size={22} />,
  },
];

const MenuDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const colorMode = useContext(ColorModeContext);

  const [checked, setChecked] = useState(theme.palette.mode === "dark");

  // console.log(checked)

  // Handle switch change
  const changeManualAssetMode = (event) => {
    const { checked: isChecked } = event.target;

    // Optionally update any local state if needed
    setChecked(isChecked);

    // Dispatch the action with a slight delay
    setTimeout(() => {
      colorMode.toggleColorMode();
    }, 400);
  };

  useEffect(() => {
    setChecked(theme.palette.mode === "dark");
  }, [theme.palette.mode]);

  // Language Drawer
  const [openLanguageDrawer, setLanguageDrawer] = useState(false);

  const handleOpenLanguageDrawer = () => {
    setLanguageDrawer(true);
  };

  const handleCloseLanguageDrawer = () => {
    setLanguageDrawer(false);
  };

  // End Language Drawer

  const DrawerList = (
    <Box
      sx={{ width: "100%" }}
      height={"100vh"}
      role="presentation"
      backgroundColor={colors.dashboardforeground[100]}
    >
      <Stack
        p={2}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        pb={0}
        pl={1}
      >
        <Box>
          <img src={logo} alt="" width={"150px"} />
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <XCircle size={32} />
        </IconButton>
      </Stack>

      <Divider />

      <List>
        {navItems.map(({ text, link, icon }, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link}
              onClick={handleClose}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      <Stack
        p={2}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body2">Dark Theme</Typography>
        <IOSSwitch
          checked={checked}
          onChange={changeManualAssetMode}
          // name="switch1"
        />
      </Stack>

      <Stack
        p={2}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{cursor: "pointer"}}
        onClick={handleOpenLanguageDrawer}
      >
        <Typography variant="body2">Language</Typography>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Typography variant="body2">English</Typography>
          <CaretRight />
        </Stack>
      </Stack>

      <Stack p={2} spacing={2}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ p: "10px 20px" }}
          component={RouterLink}
          to="/auth/register"
        >
          Create Account
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ p: "10px 20px" }}
          component={RouterLink}
          to="/auth/login"
        >
          Login Account
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        sx={{
          zIndex: 1401, // Apply zIndex at the root level too
          "& .MuiDrawer-paper": {
            backgroundColor: colors.dashboardforeground[100],
            width: "80%"
          },
        }}
      >
        {DrawerList}
      </Drawer>

      <Language
        open={openLanguageDrawer}
        handleClose={handleCloseLanguageDrawer}
        handleOpen={handleOpenLanguageDrawer}
      />
    </>
  );
};

export default MenuDrawer;
