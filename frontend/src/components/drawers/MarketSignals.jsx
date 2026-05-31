import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,
  Cardholder,
  CheckFat,
  CurrencyCircleDollar,
  HandCoins,
  Lightning,
  Lock,
  ShieldCheck,
  ShoppingCart,
} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import ReferralSystem from "../../pages/dashboard/dashboardComponents/ReferralSystem";
import { useState } from "react";
import PropTypes from "prop-types";
import UseWindowSize from "../../hooks/UseWindowSize";
import AllNfts from "../../pages/walletDashboard/walletComponents/AllNfts";
import MyNfts from "../../pages/walletDashboard/walletComponents/MyNfts";
import AllTraders from "../AllTraders";
import MyTrader from "../MyTrader";
import CardComponent from "../cardComponent/CardComponent";
import AllTraderBot from "../AllTraderBot";
import AllTraderSignals from "../AllTraderSignals";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ padding: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MarketSignals = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "60%" },
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
              Trading Signals
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          mt={2}
          mx={2}
         
        >
          <AllTraderSignals />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MarketSignals;
