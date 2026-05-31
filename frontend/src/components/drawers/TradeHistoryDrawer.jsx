import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormLabel,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,
  CaretUp,
  ClockCounterClockwise,
  DotsThree,
  FrameCorners,
  Moon,
  Sun,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import EditProfile from "../../pages/admin/adminComponents/EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { adminFundTradeBalance, getSingleUserBalanceAfterTrade, getUserBalanceAfterTrade } from "../../redux/features/auth/authSlice";
import TradeHistoryOrders from "../TradeHistoryOrders";
import { adminGetAllUserTrades } from "../../redux/features/trades/tradesSlice";

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
      {value === index && <Box sx={{ p: "10px 20px" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TradeHistoryDrawer = ({
  open,
  handleClose,
  handleOpen,
  tradeHistoryDrawerLoader,
  setTradeHistoryDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const { id } = useParams();

  const { user, singleUser } = useSelector((state) => state.auth);
  const { tradingMode } = useSelector((state) => state.app);

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  useEffect(() => {
    if (tradeHistoryDrawerLoader) {
      const timer = setTimeout(() => {
        setTradeHistoryDrawerLoader(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [tradeHistoryDrawerLoader, setTradeHistoryDrawerLoader]);

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
          width: { xs: "100%", md: "550px" },
        },
      }}
    >
      {tradeHistoryDrawerLoader ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
          sx={{ overflowX: "hidden" }}
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
                Trade History
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
          sx={{ overflowX: "hidden" }}
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
                Trade History
              </Typography>
            </Toolbar>
          </AppBar>

          <Box>
            <Stack
              component={Paper}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              p={1.5}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  p={"10px 0"}
                  spacing={1}
                  display={{ xs: "flex", md: "flex" }}
                >
                  <Avatar
                    src={
                      user?.role === "admin" ? singleUser?.photo : user?.photo
                    }
                    alt="profile picture"
                    sx={{ width: "60px", height: "60px" }}
                  />
                  <Stack>
                    <Typography variant="h6" fontWeight={"600"}>
                      {user?.role === "admin"
                        ? singleUser?.firstname
                        : user?.firstname}{" "}
                      {user?.role === "admin"
                        ? singleUser?.lastname
                        : user?.lastname}
                    </Typography>
                    <Typography variant="caption">
                      {user?.role === "admin" ? singleUser?.email : user?.email}
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  startIcon={<ClockCounterClockwise />}
                  size="small"
                  variant="outlined"
                  onClick={() => {

                  
                    dispatch(
                      adminGetAllUserTrades(
                        user?.role === "admin" ? id : user?._id
                      )
                    )

                    user?.role === "admin"
                          ? dispatch(getSingleUserBalanceAfterTrade(id))
                          : dispatch(getUserBalanceAfterTrade());
                  }
                  }
                >
                  Refresh
                </Button>
              </Stack>
              <Divider />

              <Box>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"2px 20px"}
                  alignItems={"center"}
                  mx={-2}
                  mt={1}
                >
                  <Stack>
                    <Typography variant="subtitle2">Account Trades:</Typography>
                    <Typography>All Trade history</Typography>
                  </Stack>

                  {tradingMode === "Live" ? (
                    <Stack>
                      <Typography variant="subtitle2">Trade Balance</Typography>
                      {user?.role === "admin" ? (
                        <Typography variant="subtitle2">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code || "USD",
                            ...(singleUser?.balance || "" > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(singleUser?.balance || "")}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle2">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code || "USD",
                            ...(user?.balance > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.balance)}
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Stack>
                      <Typography variant="subtitle2">Demo Balance</Typography>
                      {user?.role === "admin" ? (
                        <Typography variant="subtitle2">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
                            ...(singleUser?.demoBalance > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(singleUser?.demoBalance)}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle2">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(user?.demoBalance > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.demoBalance)}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Box height={"100%"} mt={1} mx={-2}>
                <Box
                  borderBottom={
                    theme.palette.mode === "light"
                      ? "2px solid rgba(47,49,58,0.2)"
                      : "2px solid rgba(47,49,58,1)"
                  }
                  margin={"0px 20px"}
                  sx={{
                    borderColor: "divider",
                    "& .MuiTab-root": {
                      fontSize: "12px",
                      color:
                        theme.palette.mode === "light" ? "#202020" : "white",
                      //   borderBottom:
                      //     theme.palette.mode === "light"
                      //       ? "2px solid rgba(47,49,58,0.2)"
                      //       : "2px solid rgba(47,49,58,1)",
                    },
                    "& .MuiTab-root:first-of-type": {
                      minWidth: 0,
                      paddingLeft: "0px",
                      marginLeft: 0,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "rgba(47,49,58,0.5)"
                          : "",
                    },
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Orders" {...a11yProps(0)} />
                    <Tab label="Position" {...a11yProps(1)} />
                    <Tab label="Account Summary" {...a11yProps(2)} />
                    <Tab label="Notification log" {...a11yProps(3)} />
                  </Tabs>
                </Box>

                <Box
                  height={"30%"}
                  overflow={"auto"}
                  pb={{ xs: "100px", md: "60px" }}
                >
                  <CustomTabPanel value={value} index={0}>
                    <TradeHistoryOrders />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Stack
                      justifyContent={"center"}
                      alignItems={"center"}
                      mt={3}
                      textAlign={"center"}
                    >
                      <XCircle size={48} />
                      <Typography variant="subtitle2" mx={4}>
                        There are no open position in your trading account yet
                      </Typography>
                    </Stack>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    Nothing here
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                  Nothing here
                  </CustomTabPanel>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default TradeHistoryDrawer;
