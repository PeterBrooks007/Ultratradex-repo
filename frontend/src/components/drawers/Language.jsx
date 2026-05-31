import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, ArrowRight, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../theme";
import EditProfile from "../EditProfile";
import SecuritySystem from "../../pages/dashboard/dashboardComponents/SecuritySystem";
import YandexTranslateWidget from "../YandexTranslateWidget";

const Language = ({ open, handleClose, handleOpen, profile, setProfile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [boxWidth, setBoxWidth] = useState(false);

  // console.log("boxWidth", boxWidth);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "100%" },
        },
        zIndex: 20000,
      }}
      keepMounted
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
            height: "56px",
          }}
          color="grey"
        >
          <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
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
              Select Language
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          p={3}
          sx={{
            width: boxWidth ? 1000 : "100%",
            height: 600,
            overflow: "scroll",
            // border: "2px solid green",
          }}
        >
          <Box
            sx={{
              width: "auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* <Typography>Scroll Right to select Language</Typography> */}
              <IconButton
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, backgroundColor: "grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowRight size={26} />
              </IconButton>
            </Box>
            <Box onClick={() => setBoxWidth(!boxWidth)}>
              <YandexTranslateWidget />
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Language;
