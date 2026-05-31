import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft } from "@phosphor-icons/react";
import { tokens } from "../../theme";
import ReferralSystem from "../../pages/dashboard/dashboardComponents/ReferralSystem";
import { useState } from "react";
import PropTypes from "prop-types";
import UseWindowSize from "../../hooks/UseWindowSize";
import AllNfts from "../../pages/walletDashboard/walletComponents/AllNfts";
import MyNfts from "../../pages/walletDashboard/walletComponents/MyNfts";
import AllTraders from "../AllTraders";
import MyTrader from "../MyTrader";
import ClientTraders from "../ClientTraders";

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
      {value === index && <Box sx={{padding: 2}}>{children}</Box>}
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

const AdminCopyTrade = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


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
              Copy Expert Trader
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          backgroundColor={
            theme.palette.mode === "light"
              ? "#f2f2f2"
              : colors.dashboardbackground[100]
          }
          height={"38px"}
          borderRadius={"20px"}
          p={"3px"}
          mt={2}
          mx={2}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs "
            variant="fullWidth"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "32px",
                padding: "4px 12px",
                minWidth: "auto",
                borderRadius: "20px",
                border: "none",
                borderBottom: "2px solid transparent",
                "&:hover": {
                  //   border: "2px solid #ccc",
                },
                "&.Mui-selected": {
                  // border: "2px solid #007bff",
                  backgroundColor: "white",
                  // boxShadow: `${theme.shadows[2]}`,
                  color: "black",
                },
              },
            }}
          >
            <Tab label="All Traders" {...a11yProps(0)} />
            <Tab label="View User Copied" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <AllTraders />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ClientTraders />
        </CustomTabPanel>
      </Box>
    </Drawer>
  );
};

export default AdminCopyTrade;
