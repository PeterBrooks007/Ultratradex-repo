import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowsClockwise,
  Camera,
  CheckCircle,
  DotsThreeOutline,
  EnvelopeSimple,
  EnvelopeSimpleOpen,
  Image,
  MagnifyingGlass,
  NotePencil,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import React, { Fragment, useEffect, useState } from "react";
import { tokens } from "../theme";
import EditTradeOrderDrawer from "./EditTradeOrderDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  adminApproveUserTrade,
  adminGetAllUserTrades,
  autoTradeUpdate,
  cancelTrade,
  deleteTrade,
  SETSELECTEDTRADES,
  userUpdateAdminTrade,
} from "../redux/features/trades/tradesSlice";
import { useParams } from "react-router-dom";
import ApproveTradeOrderDrawer from "./ApproveTradeOrderDrawer";
import { toast } from "react-toastify";
import {
  getSingleUser,
  getSingleUserBalanceAfterTrade,
  getUser,
  getUserBalanceAfterTrade,
} from "../redux/features/auth/authSlice";

export const CountdownTimer = ({ createdAt, expireTime, onExpire, trades }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const dispatch = useDispatch();

  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const countdownEndTime =
      new Date(createdAt).getTime() + expireTime * 60 * 1000;

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDiff = countdownEndTime - currentTime;

      if (timeDiff > 0) {
        setTimeLeft({
          hours: Math.floor(timeDiff / (1000 * 60 * 60)),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);

        if (onExpire) {
          const userId = user?.role === "admin" ? id : user?._id;

          //set autotrade Outcome
          let outcomes;
          if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.type === "Random"
          ) {
            outcomes = ["Won", "Lose"];
          } else if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.type === "Always_Win"
          ) {
            outcomes = ["Won", "Won"];
          } else {
            outcomes = ["Lose", "Lose"];
          }
          const randomIndex = Math.floor(Math.random() * outcomes.length);
          const randomOutcome = outcomes[randomIndex];

          //End of set autotrade Outcome

          //set win rate
          let winrate;
          if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.winLoseValue === "Ten"
          ) {
            winrate = Math.floor(Math.random() * 100); //random number from 0 to 99
          } else if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.winLoseValue === "Hundred"
          ) {
            winrate = Math.floor(Math.random() * 900) + 100;
          } else if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.winLoseValue === "Thousand"
          ) {
            winrate = Math.floor(Math.random() * 9000) + 1000;
          } else if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.winLoseValue === "Random"
          ) {
            winrate = Math.floor(Math.random() * 10000000);
          } else {
            winrate = Math.floor(Math.random() * 9000000) + 1000000;
          }

          //End of set autotrade Outcome

          if (
            user?.role !== "admin" &&
            user?.autoTradeSettings?.isAutoTradeActivated === true &&
            trades?.status === "PENDING" &&
            trades?.tradeFrom !== "admin" &&
            trades?.isProcessed === false
          ) {
            const formData = {
              userId: user?.role === "admin" ? id : user?._id,
              tradeData: {
                tradeId: trades?._id,
                exchangeType: trades?.exchangeType,
                exchangeTypeIcon: trades?.exchangeTypeIcon,
                symbols: trades?.symbols || "",
                type: trades?.type || "",
                buyOrSell: trades?.buyOrSell || "",
                price: trades?.price || "",
                ticks: trades?.ticks || "",
                units: trades?.units || "",
                risk: trades?.risk || "",
                riskPercentage: trades?.riskPercentage ?? "",
                expireTime: "-30",
                amount: trades?.amount ?? "",
                open: "90000",
                close: "90100",
                longOrShortUnit: "25X",
                roi: "100%",
                profitOrLossAmount:
                  randomOutcome === "Lose" ? trades?.amount : winrate,
                status: randomOutcome,
                tradingMode: trades?.tradingMode,
                tradeFrom: trades?.tradeFrom,
                createdAt: trades?.createdAt,
                isProcessed: true,
              },
            };

            // dispatch(autoTradeUpdate({userId, formData}));
            // dispatch(adminGetAllUserTrades(userId));

            const makeApicall = async () => {
              await dispatch(autoTradeUpdate({ userId, formData }));
              await dispatch(adminGetAllUserTrades(userId));
              user?.role === "admin"
                ? dispatch(getSingleUserBalanceAfterTrade(id))
                : dispatch(getUserBalanceAfterTrade());
            };
            makeApicall();

            // console.log(formData);
          }

          if (trades?.tradeFrom === "admin" && trades?.isProcessed === false) {
            const formData = {
              userId: user?.role === "admin" ? id : user?._id,
              tradeData: {
                tradeId: trades?._id,
                exchangeType: trades?.exchangeType,
                exchangeTypeIcon: trades?.exchangeTypeIcon,
                symbols: trades?.symbols || "",
                type: trades?.type || "",
                buyOrSell: trades?.buyOrSell || "",
                price: trades?.price || "",
                ticks: trades?.ticks || "",
                units: trades?.units || "",
                risk: trades?.risk || "",
                riskPercentage: trades?.riskPercentage ?? "",
                expireTime: "-30",
                amount: trades?.amount ?? "",
                open: trades?.open,
                close: trades?.close,
                longOrShortUnit: trades?.longOrShortUnit,
                roi: trades?.roi,
                profitOrLossAmount:
                  trades?.status === "Lose"
                    ? trades?.amount
                    : trades?.profitOrLossAmount,
                status: trades?.status,
                tradingMode: trades?.tradingMode,
                tradeFrom: trades?.tradeFrom,
                createdAt: trades?.createdAt,
                isProcessed: true,
              },
            };

            const makeApicall = async () => {
              await dispatch(userUpdateAdminTrade({ userId, formData }));
              await dispatch(adminGetAllUserTrades(userId));
              user?.role === "admin"
                ? dispatch(getSingleUserBalanceAfterTrade(id))
                : dispatch(getUserBalanceAfterTrade());
            };
            makeApicall();

            // console.log(formData);
          }

          onExpire(true);
        } // Notify parent
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, expireTime, onExpire, trades]);

  if (isExpired) {
    return <span style={{ color: "red", fontWeight: "600" }}>Expired</span>;
  }

  return (
    <span
      style={{
        color:
          timeLeft.minutes <= 5 && timeLeft.hours === 0
            ? theme.palette.mode === "light"
              ? "#009e4a"
              : "rgba(0, 255, 127, 0.8)"
            : theme.palette.mode === "light"
            ? "#009e4a"
            : "rgba(0, 255, 127, 0.8)",
        fontWeight: "600",
      }}
    >
      {timeLeft.hours > 0 ? `${timeLeft.hours}:` : ""}
      {timeLeft.minutes < 10 && timeLeft.hours > 0
        ? `0${timeLeft.minutes}`
        : timeLeft.minutes}
      :{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
    </span>
  );
};

const TradeHistoryOrdersComp = ({ allTradeFiltered }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const { selectedTrade } = useSelector((state) => state.trades);
  const { user, singleUser } = useSelector((state) => state.auth);

  const [menuAnchor, setMenuAnchor] = useState({});
  //  const open = Boolean(menuAnchor);

  const handleClick = (event, tradeId) => {
    setMenuAnchor({ [tradeId]: event.currentTarget }); // Reset other anchors
  };

  const handleClose = () => {
    setMenuAnchor({});
  };

  // ApproveTradeOrderDrawer
  const [openApproveTradeOrderDrawer, setApproveTradeOrderDrawer] =
    useState(false);
  const [openApproveTradeOrderDrawerLoader, setApproveTradeOrderDrawerLoader] =
    useState(false);

  const handleOpenApproveTradeOrderDrawer = () => {
    setApproveTradeOrderDrawer(true);
  };

  const handleCloseApproveTradeOrderDrawer = () => {
    setApproveTradeOrderDrawer(false);
  };
  // ApproveTradeOrderDrawer

  // EditTradeOrderDrawer
  const [openEditTradeOrderDrawer, setEditTradeOrderDrawer] = useState(false);
  const [openTradeOrderDrawerLoader, setEditTradeOrderDrawerLoader] =
    useState(false);

  const handleOpenEditTradeOrderDrawer = () => {
    setEditTradeOrderDrawer(true);
  };

  const handleCloseEditTradeOrderDrawer = () => {
    setEditTradeOrderDrawer(false);
  };
  // EditTradeOrderDrawer

  //Start Cancel Trade Drawer
  const [openCancelTradeDrawer, setCancelTradeDrawer] = useState(false);
  const [selectedTraderID, setSelectedTraderID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickCancel = () => {
    setCancelTradeDrawer(true);
  };

  const handleCloseCancel = () => {
    setCancelTradeDrawer(false);
    setSelectedTraderID(null); // Cleanup
  };

  const handleCancelTrade = async () => {
    const formData = {
      userId: user?.role === "admin" ? id : user?._id,
      tradeData: {
        tradeId: selectedTraderID?.tradeID,
        tradeAmount: selectedTraderID?.tradeAmount,
        tradingMode: selectedTraderID?.tradingMode,
      },
    };

    //  console.log(formData);

    await dispatch(cancelTrade({ id, formData }));
    user?.role === "admin"
      ? dispatch(getSingleUserBalanceAfterTrade(id))
      : dispatch(getUserBalanceAfterTrade());
  };
  // End Cancel Trade Drawer

  // Delete Trade Drawer
  const [openDeleteTradeDrawer, setDeleteTradeDrawer] = useState(false);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTradeDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTradeDrawer(false);
    setSelectedTraderID(null); // Cleanup
  };

  const handleDeleteTrade = async () => {
    const formData = {
      userId: user?.role === "admin" ? id : user?._id,
      tradeData: {
        tradeId: selectedTraderID?.tradeID,
      },
    };

    //  console.log(formData);

    await dispatch(deleteTrade({ id, formData }));
  };

  // End Delete Trade Drawer

  const [expiredTrades, setExpiredTrades] = useState({});

  // console.log(expiredTrades);

  const handleExpire = (tradeId) => {
    setExpiredTrades((prev) => ({ ...prev, [tradeId]: true }));
  };

  allTradeFiltered = Array.isArray(allTradeFiltered)
    ? [...allTradeFiltered].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  return (
    <>
      <Stack>
        <Box
          display={"flex"}
          backgroundColor={
            theme.palette.mode === "light" ? "white" : colors.primary[400]
          }
          borderRadius={"10px"}
          border={"1px solid grey"}
        >
          <InputBase
            sx={{ ml: 1, width: { xs: "100%", sm: "450px" } }}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: { xs: 0.5, md: 1 } }}>
            <MagnifyingGlass />
          </IconButton>
        </Box>

        {allTradeFiltered && allTradeFiltered?.length !== 0 ? (
          allTradeFiltered?.map((trades) => (
            <Fragment key={trades?._id}>
              <Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={3}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={0.5}
                    sx={{
                      border: "1px solid green",
                      width: "fit-content",
                      p: "1px 4px",
                      borderRadius: "5px",
                    }}
                  >
                    <img
                      src={trades?.exchangeTypeIcon}
                      alt="forex"
                      width={20}
                      style={{ borderRadius: "50%" }}
                    />
                    <Typography variant="subtitle1">
                      {" "}
                      {trades?.exchangeType}: {trades?.symbols}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Stack
                      direction={"row"}
                      spacing={0.5}
                      alignItems={"center"}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          mr: 0.5,
                          border:
                            trades?.tradingMode?.toLowerCase() === "live"
                              ? `1px solid ${
                                  theme.palette.mode === "light"
                                    ? "#009e4a"
                                    : "rgba(0, 255, 127, 0.8)"
                                }`
                              : "1px solid red",
                          p: "0px 8px",
                          borderRadius: "8px",
                        }}
                        fontWeight={"600"}
                        color={
                          trades?.tradingMode?.toLowerCase() === "live"
                            ? theme.palette.mode === "light"
                              ? "#009e4a"
                              : "rgba(0, 255, 127, 0.8)"
                            : "red"
                        }
                      >
                        {trades?.tradingMode}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          handleClick(event, trades?._id);
                        }}
                      >
                        <DotsThreeOutline size={22} />
                      </IconButton>

                      <Menu
                        anchorEl={menuAnchor[trades?._id]}
                        open={Boolean(menuAnchor[trades?._id])}
                        onClose={() => handleClose(trades?._id)}
                        id="account-menu"
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            borderRadius: "15px",
                            overflow: "visible",
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
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        {user?.role === "admin" && (
                          <Box>
                            {trades?.isProcessed === false &&
                              trades?.tradeFrom === "user" && (
                                <MenuItem
                                  onClick={() => {
                                    dispatch(SETSELECTEDTRADES(trades));
                                    setApproveTradeOrderDrawerLoader(true);
                                    handleOpenApproveTradeOrderDrawer();
                                    handleClose(trades?._id); // Explicitly close the menu
                                  }}
                                  sx={{
                                    display:
                                      trades?.status !== "PENDING" && "none",
                                  }}
                                >
                                  <ListItemIcon>
                                    <CheckCircle size={22} />
                                  </ListItemIcon>
                                  Approve Order
                                </MenuItem>
                              )}
                            {trades?.isProcessed === true && (
                              <MenuItem
                                onClick={() => {
                                  dispatch(SETSELECTEDTRADES(trades));
                                  setEditTradeOrderDrawerLoader(true);
                                  handleOpenEditTradeOrderDrawer();
                                  handleClose(trades?._id); // Explicitly close the menu
                                }}
                              >
                                <ListItemIcon>
                                  <NotePencil size={22} />
                                </ListItemIcon>
                                Edit Order
                              </MenuItem>
                            )}
                          </Box>
                        )}
                        {trades?.isProcessed === false && (
                          <MenuItem
                            onClick={() => {
                              setSelectedTraderID({
                                tradeID: trades?._id,
                                tradeExchangeType: trades?.exchangeType,
                                tradeSymbol: trades?.symbols,
                                tradeAmount: trades?.amount,
                                tradingMode: trades?.tradingMode,
                              });
                              handleClickCancel();
                              handleClose(trades?._id); // Explicitly close the menu
                            }}
                          >
                            <ListItemIcon>
                              <XCircle size={22} />
                            </ListItemIcon>
                            Cancel Order
                          </MenuItem>
                        )}
                        {trades?.isProcessed === true && (
                          <MenuItem
                            onClick={() => {
                              setSelectedTraderID({
                                tradeID: trades?._id,
                                tradeExchangeType: trades?.exchangeType,
                                tradeSymbol: trades?.symbols,
                              });
                              handleClickDelete();
                              handleClose(trades?._id); // Explicitly close the menu
                            }}
                            //  onClick={() => {
                            //   handleDeleteTrade(trades?._id);
                            //   handleClose(trades?._id); // Explicitly close the menu
                            // }}
                          >
                            <ListItemIcon>
                              <Trash size={22} />
                            </ListItemIcon>
                            Delete Order
                          </MenuItem>
                        )}
                      </Menu>

                      <IconButton size="small">
                        <Image size={22} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack width={"50%"} maxWidth={"80%"} mt={0.5} spacing={0.2}>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">Side</Typography>
                    <Typography
                      variant="subtitle2"
                      color={
                        trades?.buyOrSell?.toLowerCase() === "buy"
                          ? theme.palette.mode === "light"
                            ? "#009e4a"
                            : "rgba(0, 255, 127, 0.8)"
                          : "red"
                      }
                    >
                      {trades?.buyOrSell}
                    </Typography>
                  </Stack>

                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">Type</Typography>
                    <Typography variant="subtitle2">{trades?.type}</Typography>
                  </Stack>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">Price</Typography>
                    <Typography variant="subtitle2">{trades?.price}</Typography>
                  </Stack>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">Qty</Typography>
                    <Typography variant="subtitle2">{trades?.units}</Typography>
                  </Stack>
                  {/* <Stack justifyContent={"space-between"} direction={"row"}>
                  <Typography variant="subtitle2">isProcessed</Typography>
                  <Typography variant="subtitle2">{`${trades?.isProcessed}`}</Typography>
                </Stack> */}
                  {/* <Stack justifyContent={"space-between"} direction={"row"}>
            <Typography variant="caption">Limit Price</Typography>
            <Typography variant="caption">227.34</Typography>
          </Stack> */}

                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">
                      {expiredTrades[trades?._id] ? "Status " : "Expire Time"}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={
                        trades?.status?.toLowerCase() === "won"
                          ? theme.palette.mode === "light"
                            ? "#009e4a"
                            : "rgba(0, 255, 127, 0.8)"
                          : "red"
                      }
                    >
                      {expiredTrades[trades?._id] ? (
                        trades?.status
                      ) : (
                        <CountdownTimer
                          createdAt={trades?.createdAt}
                          expireTime={trades?.expireTime}
                          onExpire={() => handleExpire(trades?._id)}
                          trades={trades}
                        />
                      )}
                    </Typography>
                  </Stack>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography variant="subtitle2">
                      Amount {!expiredTrades[trades?._id] ? "" : trades?.status}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={
                        !expiredTrades[trades?._id]
                          ? "orange"
                          : trades?.status?.toLowerCase() === "won"
                          ? theme.palette.mode === "light"
                            ? "#009e4a"
                            : "rgba(0, 255, 127, 0.8)"
                          : "red"
                      }
                    >
                      {!expiredTrades[trades?._id] ||
                      trades?.status === "PENDING"
                        ? "PENDING"
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency:
                              user?.role === "admin"
                                ? singleUser?.currency?.code
                                : user?.currency?.code,
                            ...(trades?.profitOrLossAmount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(trades?.profitOrLossAmount)}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mt: 2 }} />
              </Stack>
            </Fragment>
          ))
        ) : (
          <Stack justifyContent={"center"} alignItems={"center"} mt={3}>
            <XCircle size={52} />
            <Typography variant="h6">No Trade Available</Typography>
          </Stack>
        )}
      </Stack>

      <ApproveTradeOrderDrawer
        open={openApproveTradeOrderDrawer}
        handleClose={handleCloseApproveTradeOrderDrawer}
        handleOpen={handleOpenApproveTradeOrderDrawer}
        openApproveTradeOrderDrawerLoader={openApproveTradeOrderDrawerLoader}
        setApproveTradeOrderDrawerLoader={setApproveTradeOrderDrawerLoader}
      />

      <EditTradeOrderDrawer
        open={openEditTradeOrderDrawer}
        handleClose={handleCloseEditTradeOrderDrawer}
        handleOpen={handleOpenEditTradeOrderDrawer}
        openTradeOrderDrawerLoader={openTradeOrderDrawerLoader}
        setEditTradeOrderDrawerLoader={setEditTradeOrderDrawerLoader}
      />

      <Dialog
        open={openDeleteTradeDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{
          style: { backgroundColor: "transparent" },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete Trade ${
            selectedTraderID?.tradeExchangeType +
            ": " +
            selectedTraderID?.tradeSymbol
          } ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              handleDeleteTrade();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancelTradeDrawer}
        onClose={handleCloseCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{
          style: { backgroundColor: "transparent" },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Cancel Trade ${
            selectedTraderID?.tradeExchangeType +
            ": " +
            selectedTraderID?.tradeSymbol
          } ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseCancel}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Don&apos;t Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              handleCancelTrade();
              handleCloseCancel();
            }}
            autoFocus
          >
            Cancel Trade
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TradeHistoryOrdersComp;
