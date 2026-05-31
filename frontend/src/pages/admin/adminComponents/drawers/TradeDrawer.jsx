import { useEffect } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import EditProfile from "../EditProfile";
import Trading from "../../../../components/Trading";
import { useSelector } from "react-redux";

const TradeDrawer = ({
  open,
  handleClose,
  handleOpen,
  liveTradeDrawerLoader,
  setLiveTradeDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { tradingMode } = useSelector(
    (state) => state.app
  );



  useEffect(() => {
    if (liveTradeDrawerLoader) {
      const timer = setTimeout(() => {
        setLiveTradeDrawerLoader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [liveTradeDrawerLoader, setLiveTradeDrawerLoader]);

  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "550px" },
        },
        
      }}
    >
      {liveTradeDrawerLoader ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
          borderLeft={{xs:"none", md: "0.5px solid grey"}}
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
                {tradingMode} Trade Account
              </Typography>
            </Toolbar>
          </AppBar>

          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <CircularProgress />
          </Stack>
        </Box>
      ) : (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
          borderLeft={{xs:"none", md: "0.5px solid grey"}}
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
               {tradingMode} Trade Account
              </Typography>
            </Toolbar>
          </AppBar>

          <Box m={2}>
            <Trading />
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default TradeDrawer;
