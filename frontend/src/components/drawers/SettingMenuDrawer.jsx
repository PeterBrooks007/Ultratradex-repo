import React, { useContext, useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  Box,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowFatLeft,
  ArrowFatRight,
  Desktop,
  Moon,
  Sun,
  X,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { ColorModeContext, tokens } from "../../theme";

const SettingMenuDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const [alignment, setAlignment] = React.useState("");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    setAlignment(theme.palette.mode);
  }, [theme.palette.mode]);

  const [savedColorModeData, setSavedColorModeData] = useState(savedColorMode);

  const DrawerList = (
    <Box
      sx={{ width: "100%" }}
      role="presentation"
      backgroundColor={colors.dashboardforeground[100]}
      height={"100%"}
      borderLeft={"1px solid grey"}
      borderRadius={"20px 0 0 20px"}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px solid grey"}
        p={"5px 10px"}
      >
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={handleClose}>
          <X />
        </IconButton>
      </Box>

      <Box
        display={"flex"}
        m={2}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Stack spacing={0.5}>
          <Typography>MODE</Typography>
          <ToggleButtonGroup
            color="primary"
            value={savedColorModeData}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
              width: { xs: "330px", md: "420px" },
              "& .MuiToggleButtonGroup-grouped": {
                flex: 1,
              },
            }}
          >
            <ToggleButton
              value="light"
              onClick={() => {
                colorMode.selectColorMode("light");
                setSavedColorModeData("light");
              }}
            >
              <Sun size={20} />
              &nbsp;Light
            </ToggleButton>
            <ToggleButton
              value="system"
              onClick={() => {
                colorMode.selectColorMode("system");
                setSavedColorModeData("system");
              }}
            >
              <Desktop size={20} />
              &nbsp;System
            </ToggleButton>
            <ToggleButton
              value="dark"
              onClick={() => {
                colorMode.selectColorMode("dark");
                setSavedColorModeData("dark");
              }}
            >
              <Moon size={20} />
              &nbsp;Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* <Box
        display={"flex"}
        m={5}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Stack spacing={0.5}>
          <Typography>DIRECTION</Typography>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
              width: { xs: "330px", md: "420px" },

              "& .MuiToggleButtonGroup-grouped": {
                flex: 1,
              },
            }}
          >
            <ToggleButton value="web">
              <ArrowFatLeft size={20} />
              &nbsp;Left to right
            </ToggleButton>

            <ToggleButton value="ios">
              <ArrowFatRight size={20} />
              &nbsp;right to left
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box> */}

      
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "350px", md: "450px" },
          borderRadius: "20px 0 0 20px",
          backgroundColor: colors.dashboardforeground[100],
        },
      }}
    >
      {DrawerList}
    </SwipeableDrawer>
  );
};

export default SettingMenuDrawer;
