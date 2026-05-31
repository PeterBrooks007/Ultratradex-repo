import React, { useEffect } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../theme";
import EditProfile from "../EditProfile";
import SecuritySystem from "../../pages/dashboard/dashboardComponents/SecuritySystem";
import ContactUs from "../ContactUs";

const HelpSupport = ({
  open,
  handleClose,
  handleOpen,
  profile,
  setProfile,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        zIndex: 1401, // Apply zIndex at the root level too
        "& .MuiDrawer-paper": {
          width: {xs: "100%", md: "auto"}, 
        },
      }}
    >
      <Box
        backgroundColor={colors.dashboardforeground[100]}
        width={"100%"}
        height={"100%"}
        overflow={"auto"}
      >
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: `${
              theme.palette.mode === "light"
                ? "lightgrey"
                : colors.dashboardbackground[100]
            }`,
            top: 0,
            height: "56px"
          }}
          color="grey"
        >
          <Toolbar variant="dense" sx={{minHeight: "56px"}}>
            <IconButton
              edge="start"
              
              aria-label="menu"
              sx={{ mr: 2, backgroundColor: "grey" }}
              onClick={handleClose}
              size="small"
             
            >
              <ArrowLeft size={26} />
            </IconButton>
            <Typography variant="body1" color="inherit" component="div">
              Contact Us
            </Typography>
          </Toolbar>
        </AppBar>

        <Box>
          <ContactUs profile={profile} setProfile={setProfile} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default HelpSupport;
