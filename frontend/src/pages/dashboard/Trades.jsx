import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import AdvanceChartWidget from "../../components/TradeviewWidgets/AdvanceChartWidget";
import {
  Bell,
  CaretDown,
  CaretUp,
  ClockCounterClockwise,
  DotsThree,
  FrameCorners,
  House,
  X,
} from "@phosphor-icons/react";
import TradeTable from "../../components/tables/TradeTable";
import MarketNewsWidgets from "../../components/TradeviewWidgets/MarketNewsWidgets";
import Watchlistmarketdata from "../../components/TradeviewWidgets/Watchlistmarketdata";
import TradeDrawer from "../../components/drawers/TradeDrawer";
import Trading from "../../components/Trading";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
// import LoadingScreen from "../../components/LoadingScreen";
import {
  SET_ISLOADING_FALSE,
  SET_TRADEORDERCLICKED,
} from "../../redux/features/app/appSlice";
import TradesSkeletons from "./dashboardSkeletons/TradesSkeletons";
import { Link } from "react-router-dom";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import TradeHistoryDrawer from "../../components/drawers/TradeHistoryDrawer";
import Notifications from "../../components/Notifications";
import AllNotificationsDrawer from "../../components/drawers/AllNotificationsDrawer";
// import PropTypes from 'prop-types';

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

const Trades = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const extraSmallMobile = useMediaQuery("(max-width: 360px)");
  const isMobileShortscreen = useMediaQuery("(max-height: 600px)");
  const isSmallMobileScreen = useMediaQuery("(max-width: 395px)");

  const { isLoading: appLoading } = useSelector((state) => state.app);
  const { user, isLoading, isLoggedIn } = useSelector((state) => state.auth);

  const { tradingMode } = useSelector((state) => state.app);

  const { newNotifications } = useSelector((state) => state.totalCounts);

  const { isSemiLoading, allTrades } = useSelector((state) => state.trades);

  const size = UseWindowSize();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [TradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (TradeLoading) {
      timer = setTimeout(() => {
        setTradeLoading(false);
        setOpenMenu(true);
      }, 300); // Simulate a 500ms loading time
    }
    return () => clearTimeout(timer); // Cleanup timer on component unmount or isLoading change
  }, [TradeLoading]);

  const handleOpenMenu = () => {
    setTradeLoading(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  const allTradeTab = allTrades?.trades;

  const allTradeSlice = Array.isArray(allTrades?.trades)
    ? [...allTrades.trades]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    : [];

  // console.log(allTradeSlice)

  // TradeHistoryDrawer
  const [openTradeHistoryDrawer, setTradeHistoryDrawer] = useState(false);
  const [tradeHistoryDrawerLoader, setTradeHistoryDrawerLoader] =
    useState(false);

  const handleOpenTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(true);
  };

  const handleCloseTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(false);
  };
  // End TradeHistoryDrawer

  //notification
  const [notificationanchorEl, setnotificationAnchorEl] = useState(null);
  const notificationopen = Boolean(notificationanchorEl);
  const handlenotificationClick = (e) => {
    setnotificationAnchorEl(e.currentTarget);
  };
  const handlenotificationClose = () => {
    setnotificationAnchorEl(null);
  };

  // AllNotificationsDrawer

  const [allNotificationsLoader, setAllNotificationsLoader] = useState(false);
  const [openAllNotificationsDrawer, setOpenAllNotificationsDrawer] =
    useState(false);

  const handleOpenAllNotificationsDrawer = () => {
    setOpenAllNotificationsDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseAllNotificationsDrawer = () => {
    setOpenAllNotificationsDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  return (
    <>
      {appLoading || isLoading || !user ? (
        <TradesSkeletons />
      ) : (
        <Box
          display={"flex"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          height={{ xs: size.height, md: "calc(100% - 30px)" }}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "10px" }}
          overflow={"hidden"}
        >
          <Box
            flex={{
              sm: "0 0 60%",
              md: "0 0 60%",
              lg: "0 0 50%",
              xl: "0 0 60%",
            }}
            sx={{ overflow: { xs: "hidden", sm: "hidden" } }}
            width={"100%"}
          >
            <Box
              height={{
                xs: `${
                  isMobileShortscreen
                    ? "calc(100% - 160px)"
                    : `calc(100% - 153px)`
                }`,
                sm: "60%",
              }}
              width={"100%"}
              position={"relative"}
            >
              <AdvanceChartWidget tradingpage="true" />

              <Stack
                direction={"row"}
                spacing={1}
                position={"absolute"}
                top={"120px"}
                left={"65px"}
                display={{ xs: "flex", md: "none" }}
              >
                <Button
                  disabled={TradeLoading && true}
                  onClick={handleOpenMenu}
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#009e4a",
                    color: "white",
                    px: `${extraSmallMobile ? "2px" : "2px"}`,
                    fontSize: !isSmallMobileScreen && "16px",
                    "&:hover": {
                      backgroundColor: "darkgreen", // Color when the button is hovered
                    },
                    // "&:active": {
                    //   backgroundColor: "#009e4a", // Color when the button is actively pressed
                    // },
                  }}
                >
                  {TradeLoading ? (
                    <CircularProgress
                      size={`${extraSmallMobile ? "10px" : "15px"}`}
                      sx={{
                        color: "white",
                        margin: `${extraSmallMobile ? "2px" : "2px"}`,
                      }}
                    />
                  ) : (
                    "Buy"
                  )}
                </Button>
                <Button
                  disabled={TradeLoading && true}
                  onClick={handleOpenMenu}
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#d01724",
                    color: "white",
                    px: `${extraSmallMobile ? "2px" : "2px"}`,
                    fontSize: !isSmallMobileScreen && "16px",
                    "&:hover": {
                      backgroundColor: "darkred", // Color when the button is hovered
                    },
                    // "&:active": {
                    //   backgroundColor: "#d01724", // Color when the button is actively pressed
                    // },
                  }}
                >
                  {TradeLoading ? (
                    <CircularProgress
                      size={`${extraSmallMobile ? "10px" : "15px"}`}
                      sx={{
                        color: "white",
                        margin: `${extraSmallMobile ? "2px" : "5px"}`,
                      }}
                    />
                  ) : (
                    "Sell"
                  )}
                </Button>
              </Stack>

              <Stack
                display={{ xs: "flex", sm: "none" }}
                direction={"row"}
                justifyContent={"space-between"}
                p={"8px 10px"}
                backgroundColor={colors.dashboardbackground[100]}
                color={
                  theme.palette.mode === "light"
                    ? `colors.dashboardbackground[100]`
                    : "#f1f3f8"
                }
                border={
                  theme.palette.mode === "light"
                    ? "2px solid rgba(47,49,58,0.1)"
                    : "2px solid rgba(47,49,58,1)"
                }
                borderTop={"none"}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Stack spacing={0.2}>
                    <Typography variant={size.width < 365 ? "body2" : "body1"}>
                      Account:{" "}
                      <span
                        style={{
                          color: `${
                            tradingMode.toLowerCase() === "live"
                              ? "springgreen"
                              : "red"
                          }`,
                          fontWeight: "600",
                        }}
                      >
                        {tradingMode}
                      </span>{" "}
                      Account
                    </Typography>
                    <Typography
                      variant={size.width < 365 ? "body2" : "body1"}
                      mt={"2px"}
                    >
                      Balance:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(tradingMode.toLowerCase() === "live"
                          ? user?.balance
                          : user?.demoBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        tradingMode.toLowerCase() === "live"
                          ? user?.balance
                          : user?.demoBalance
                      )}
                    </Typography>
                  </Stack>

                  <Stack direction={"row"} spacing={1}>
                    {/* <Button size="small" variant="outlined">History</Button> */}

                    <Stack direction={"row"} spacing={1}>
                      <Link
                        to={"/dashboard/home"}
                        style={{ textDecoration: "none" }}
                      >
                        <Stack alignItems={"center"}>
                          <IconButton
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "#f2f2f2"
                                  : "#41464d",
                              color:
                                theme.palette.mode === "light"
                                  ? "#202020"
                                  : "white",
                              borderRadius: "10px",
                            }}
                          >
                            <House size={26} />
                          </IconButton>
                          <Typography
                            variant="caption"
                            color={
                              theme.palette.mode === "light"
                                ? "black"
                                : "#f2f2f2"
                            }
                          >
                            Home
                          </Typography>
                        </Stack>
                      </Link>

                      <Stack
                        alignItems={"center"}
                        onClick={() => {
                          dispatch(SET_TRADEORDERCLICKED(""));
                          setTradeHistoryDrawerLoader(true);
                          handleOpenTradeHistoryDrawer();
                        }}
                      >
                        <IconButton
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "light"
                                ? "#f2f2f2"
                                : "#41464d",
                            color:
                              theme.palette.mode === "light"
                                ? "#202020"
                                : "white",
                            borderRadius: "10px",
                          }}
                        >
                          <ClockCounterClockwise size={26} />
                        </IconButton>
                        <Typography
                          variant="caption"
                          color={
                            theme.palette.mode === "light" ? "black" : "#f2f2f2"
                          }
                        >
                          History
                        </Typography>
                      </Stack>

                      <Stack
                        alignItems={"center"}
                        onClick={handlenotificationClick}
                      >
                        <IconButton
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "light"
                                ? "#f2f2f2"
                                : "#41464d",
                            color:
                              theme.palette.mode === "light"
                                ? "#202020"
                                : "white",
                            borderRadius: "10px",
                          }}
                        >
                          <Badge
                            badgeContent={newNotifications}
                            color="secondary"
                          >
                            <Bell size={26} />
                          </Badge>
                        </IconButton>
                        <Typography
                          variant="caption"
                          color={
                            theme.palette.mode === "light" ? "black" : "#f2f2f2"
                          }
                        >
                          Notices
                        </Typography>
                      </Stack>

                      <Menu
                        anchorEl={notificationanchorEl}
                        id=""
                        open={notificationopen}
                        onClose={handlenotificationClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            border: "1px solid grey",
                            borderRadius: "15px",
                            width: 450,
                            height: "auto",
                            minHeight: size.width < 400 ? "70%" : "60%",
                            maxHeight: "90%",
                            overflow: "auto",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 50,
                              height: 50,
                              ml: -0.5,
                              mr: 1,
                            },
                          },
                        }}
                        anchorOrigin={{
                          vertical: "top", // Start at the top of the anchor
                          horizontal: "left", // Align to the left of the anchor
                        }}
                        transformOrigin={{
                          vertical: "bottom", // Position the menu's origin at its bottom
                          horizontal: "left", // Position the menu's origin at its left
                        }}
                      >
                        <Notifications
                          handlenotificationClose={handlenotificationClose}
                          handleOpenAllNotificationsDrawer={
                            handleOpenAllNotificationsDrawer
                          }
                          setAllNotificationsLoader={setAllNotificationsLoader}
                        />
                      </Menu>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack
                direction={"row"}
                spacing={1.5}
                size="large"
                p={"10px"}
                border={
                  theme.palette.mode === "light"
                    ? "2px solid rgba(47,49,58,0.1)"
                    : "2px solid rgba(47,49,58,1)"
                }
                borderTop={"none"}
                backgroundColor={colors.dashboardbackground[100]}
                display={{ xs: "flex", sm: "none" }}
              >
                <Button
                  disabled={TradeLoading && true}
                  onClick={handleOpenMenu}
                  fullWidth
                  variant="contained"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "500",
                    backgroundColor: "#009e4a",
                    color: "white",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                  }}
                >
                  {TradeLoading ? (
                    <CircularProgress
                      size={`${extraSmallMobile ? "22px" : "22"}`}
                      sx={{
                        color: "white",
                        margin: `${extraSmallMobile ? "5px" : "2px"}`,
                      }}
                    />
                  ) : (
                    "Buy"
                  )}
                </Button>
                <Button
                  disabled={TradeLoading && true}
                  onClick={handleOpenMenu}
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "500",
                    backgroundColor: "#d01725",
                    color: "white",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                >
                  {TradeLoading ? (
                    <CircularProgress
                      size={`${extraSmallMobile ? "22px" : "22px"}`}
                      sx={{
                        color: "white",
                        margin: `${extraSmallMobile ? "5px" : "5px"}`,
                      }}
                    />
                  ) : (
                    "Sell"
                  )}
                </Button>
              </Stack>
            </Box>

            <Box
              // height={{ xs: `${isMobileShortscreen ? "50%" : "40%"}` }}
              display={{ xs: "block", sm: "none" }}
              overflow={"auto"}
              pb={"120px"}
            >
              {/* <Divider sx={{backgroundColor: "red", mx: "-10px", mt: "0px"}} /> */}
            </Box>

            <Box display={{ xs: "none", sm: "block" }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"2px 20px"}
                border={
                  theme.palette.mode === "light"
                    ? "1px solid rgba(47,49,58,0.4)"
                    : "1px solid rgba(47,49,58)"
                }
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <Typography variant="subtitle2" color={"dodgerblue"}>
                    Account Manager
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      height: "25px",
                      backgroundColor: "rgba(47,49,58,1)",
                      color: "white",
                    }}
                    onClick={() => {
                      dispatch(SET_TRADEORDERCLICKED(""));
                      setTradeHistoryDrawerLoader(true);
                      handleOpenTradeHistoryDrawer();
                    }}
                  >
                    All Trade
                  </Button>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                  <IconButton size="small">
                    <CaretUp size={24} />
                  </IconButton>
                  <IconButton size="small">
                    <FrameCorners size={24} />
                  </IconButton>
                </Stack>
              </Stack>

              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"2px 20px"}
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <Typography variant="subtitle2">
                    Account:{" "}
                    <span
                      style={{
                        color:
                          tradingMode.toLowerCase() === "live"
                            ? theme.palette.mode === "light"
                              ? "#009e4a"
                              : "rgba(0, 255, 127, 0.8)"
                            : "red",
                        fontWeight: "500",
                      }}
                    >
                      {tradingMode}
                    </span>{" "}
                    Account
                  </Typography>
                  <IconButton>
                    <DotsThree size={30} />
                  </IconButton>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Balance</Typography>
                  <Typography variant="subtitle2">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code,
                      ...(tradingMode.toLowerCase() === "live"
                        ? user?.balance
                        : user?.demoBalance > 999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(
                      tradingMode.toLowerCase() === "live"
                        ? user?.balance
                        : user?.demoBalance
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box display={{ xs: "none", sm: "block" }} height={"100%"}>
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
                    color: theme.palette.mode === "light" ? "#202020" : "white",
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
                  <TradeTable allTradeFiltered={allTradeTab} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  Nothing found
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  Nothing found
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                  Nothing found
                </CustomTabPanel>
              </Box>
            </Box>
          </Box>

          {size.width >= 600 && (
            <Stack
              flex={{
                sm: "0 0 40%",
                md: "0 0 40%",
                lg: "0 0 25%",
                xl: "0 0 20%",
              }}
              border={"1px solid rgba(47,49,58,0.5)"}
              sx={{ borderRight: "none" }}
              p={"15px 15px 10px 15px"}
              overflow={"hidden"}
              display={{ xs: "none", sm: "block" }}
            >
              <Trading />
            </Stack>
          )}

          {size.width >= 1200 && (
            <Box
              flex={{
                sm: "0 0 25%",
                md: "0 0 25%",
                lg: "0 0 25%",
                xl: "0 0 20%",
              }}
              borderRadius={"0px 15px 15px 0px"}
              border={"1px solid rgba(47,49,58,0.5)"}
              height={"100%"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
              <Box
                height={"40%"}
                borderBottom={"1px solid grey"}
                overflow={"hidden"}
                p={"15px 15px 10px 15px"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={0.2}>
                    <Typography variant="body2">Watchlist </Typography>
                    <CaretDown />
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={0.5}
                    justifyContent={"space-between"}
                  >
                    {/* <DotsThreeOutline size={24} /> */}
                    <X size={24} />
                  </Stack>
                </Stack>

                <Box
                  mx={"-15px"}
                  height={"100%"}
                  mt={2}
                  borderTop={"3px solid rgba(47,49,58,0.5)"}
                  p={"5px"}
                  pb={"32px"}
                >
                  <Watchlistmarketdata />
                </Box>
              </Box>

              <Box
                height={"30%"}
                borderBottom={"1px solid grey"}
                overflow={"auto"}
                width={"100%"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={"15px 20px 10px 15px"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={0.2}>
                    <Typography variant="body2" fontWeight={500}>
                      Trading History{" "}
                    </Typography>
                    {/* <CaretDown /> */}
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={0.5}
                    justifyContent={"space-between"}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "20px",
                        textTransform: "capitalize",
                        color: "#009e4a",
                        border: "1px solid #009e4a",
                      }}
                      onClick={() => {
                        dispatch(SET_TRADEORDERCLICKED(""));
                        setTradeHistoryDrawerLoader(true);
                        handleOpenTradeHistoryDrawer();
                      }}
                    >
                      View All
                    </Button>
                  </Stack>
                </Stack>
                <Divider
                  sx={{
                    border:
                      theme.palette.mode === "light"
                        ? "1px solid rgba(47,49,58,0.5)"
                        : "1px solid rgba(47,49,58,1)",
                  }}
                />

                <Box width={"100%"} overflow={"auto"}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">SYMBOLS</TableCell>
                        <TableCell align="center">PRICE</TableCell>
                        <TableCell align="center" colSpan={2}>
                          DATE
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allTradeSlice && allTradeSlice.length > 0
                        ? allTradeSlice.map((trade) => (
                            <TableRow
                              key={trade?._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    trade?.buyOrSell === "Buy"
                                      ? theme.palette.mode === "light"
                                        ? "#009e4a"
                                        : "rgba(0, 255, 127, 0.8)"
                                      : "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {trade?.symbols}
                              </TableCell>
                              <TableCell align="center">
                                {trade?.price}
                              </TableCell>
                              <TableCell align="center">
                                {trade?.createdAt &&
                                  new Intl.DateTimeFormat("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).format(new Date(trade.createdAt))}
                              </TableCell>
                            </TableRow>
                          ))
                        : "No Trade Available"}
                    </TableBody>
                  </Table>
                </Box>
              </Box>

              <Box
                height={"30%"}
                overflow={"auto"}
                sx={{
                  "& .tradingview-widget-container .image-gDIex6UB": {
                    display: "none !important", // Ensure it is hidden
                  },
                }}
              >
                <MarketNewsWidgets />
              </Box>
            </Box>
          )}

          {size.width <= 600 && (
            <TradeDrawer
              open={openMenu}
              handleClose={handleCloseMenu}
              handleOpen={handleOpenMenu}
            />
          )}
        </Box>
      )}

      {/* {openTradeHistoryDrawer && ( */}
        <TradeHistoryDrawer
          open={openTradeHistoryDrawer}
          handleClose={handleCloseTradeHistoryDrawer}
          handleOpen={handleOpenTradeHistoryDrawer}
          tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
          setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
        />
      {/* )} */}

      <AllNotificationsDrawer
        open={openAllNotificationsDrawer}
        handleClose={handleCloseAllNotificationsDrawer}
        handleOpen={handleOpenAllNotificationsDrawer}
        allNotificationsLoader={allNotificationsLoader}
        setAllNotificationsLoader={setAllNotificationsLoader}
      />
    </>
  );
};

export default Trades;
