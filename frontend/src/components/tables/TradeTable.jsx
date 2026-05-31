import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Trash, XCircle } from "@phosphor-icons/react";
import {
  adminGetAllUserTrades,
  cancelTrade,
  deleteTrade,
} from "../../redux/features/trades/tradesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CountdownTimer } from "../TradeHistoryOrdersComp";
import { useTheme } from "@emotion/react";
import {
  getSingleUserBalanceAfterTrade,
  getUserBalanceAfterTrade,
} from "../../redux/features/auth/authSlice";
import { useParams } from "react-router-dom";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "green",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default function StickyHeadTable({ allTradeFiltered }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);

  const { isSemiLoading, allTrades } = useSelector((state) => state.trades);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role !== "admin" && allTrades?.length === 0) {
      dispatch(adminGetAllUserTrades(user?._id));
    }
  }, [dispatch, user, allTrades?.length]);

  allTradeFiltered = Array.isArray(allTradeFiltered)
    ? [...allTradeFiltered].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  // console.log(allTradeFiltered);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Calculate the current data slice
  const paginatedAllTrades = allTradeFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  //end of pagination

  const [expiredTrades, setExpiredTrades] = useState({});

  // console.log(expiredTrades);

  const handleExpire = (tradeId) => {
    setExpiredTrades((prev) => ({ ...prev, [tradeId]: true }));
  };

  //Start Cancel Trade Drawer
  const [openCancelTradeDrawer, setCancelTradeDrawer] = useState(false);
  const [selectedTraderID, setSelectedTraderID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickCancel = () => {
    setCancelTradeDrawer(true);
  };

  const handleCloseCancel = () => {
    setCancelTradeDrawer(false);
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

  return (
    <>
      {isSemiLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          height={"100%"}
          width={"100%"}
          mt={4}
        >
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
          <StyledTableContainer component={Paper}>
            <Table aria-label="stylish user table">
              <StyledTableHead>
                <TableRow>
                  <TableCell>Symbols</TableCell>
                  <TableCell>Side</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </StyledTableHead>

              <TableBody>
                {paginatedAllTrades.length > 0 ? (
                  paginatedAllTrades.map((trade) => (
                    <StyledTableRow key={trade?._id}>
                      <TableCell>
                        <span
                          style={{
                            backgroundColor:
                            trade?.buyOrSell === "Buy"
                            ? theme.palette.mode === "light"
                              ? "#009e4a"
                              : "rgba(0, 255, 127, 0.8)"
                            : "red",
                            padding: "3px 8px",
                            borderRadius: "15px",
                            fontWeight: "700",
                            color: "white",
                          }}
                        >
                          {trade?.symbols}
                        </span>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <span
                          style={{
                            color:
                              trade?.buyOrSell === "Buy"
                                ? theme.palette.mode === "light"
                                  ? "#009e4a"
                                  : "rgba(0, 255, 127, 0.8)"
                                : "red",
                            fontWeight: "700",
                          }}
                        >
                          {trade?.buyOrSell}
                        </span>
                      </TableCell>
                      <TableCell>{trade?.type}</TableCell>
                      <TableCell>{trade?.price}</TableCell>
                      <TableCell>{trade?.units}</TableCell>
                      <TableCell>
                        <Typography
                          fontSize={"14px"}
                          fontWeight={"600"}
                          sx={{
                            color: !expiredTrades[trade?._id]
                              ? "orange"
                              : trade?.status?.toLowerCase() === "won"
                              ? theme.palette.mode === "light"
                                ? "#009e4a"
                                : "rgba(0, 255, 127, 0.8)"
                              : "red",
                          }}
                        >
                          {!expiredTrades[trade?._id] ||
                          trade?.status === "PENDING"
                            ? "PENDING"
                            : Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(trade?.profitOrLossAmount > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(trade?.profitOrLossAmount)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          color={
                            trade?.status?.toLowerCase() === "won"
                              ? theme.palette.mode === "light"
                                ? "#009e4a"
                                : "rgba(0, 255, 127, 0.8)"
                              : "red"
                          }
                        >
                          {expiredTrades[trade?._id] ? (
                            trade?.status
                          ) : (
                            <CountdownTimer
                              createdAt={trade?.createdAt}
                              expireTime={trade?.expireTime}
                              onExpire={() => handleExpire(trade?._id)}
                              trades={trade}
                            />
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction={"row"} alignItems={"center"}>
                          {trade?.isProcessed === false && (
                            <Tooltip title={"cancel Trade"}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedTraderID({
                                    tradeID: trade?._id,
                                    tradeExchangeType: trade?.exchangeType,
                                    tradeSymbol: trade?.symbols,
                                    tradeAmount: trade?.amount,
                                    tradingMode: trade?.tradingMode,
                                  });
                                  handleClickCancel();
                                  // handleClose(trades?._id); // Explicitly close the menu
                                }}
                              >
                                <XCircle color="red" size={25} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {trade?.isProcessed === true && (
                            <Tooltip title={"Delete Trade"}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedTraderID({
                                    tradeID: trade?._id,
                                    tradeExchangeType: trade?.exchangeType,
                                    tradeSymbol: trade?.symbols,
                                  });
                                  handleClickDelete();
                                  // handleClose(trade?._id); // Explicitly close the menu
                                }}
                              >
                                <Trash color="red" size={25} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <Stack m={2}>
                    <Typography variant="h6">No trade available</Typography>
                  </Stack>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allTradeFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
                Please Note, This action can&apos;t be undone!
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
        </Paper>
      )}
    </>
  );
}
