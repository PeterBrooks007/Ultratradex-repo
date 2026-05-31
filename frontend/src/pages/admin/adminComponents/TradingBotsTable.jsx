import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  styled,
  Button,
  Stack,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  Pen,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTradingBot,
  getAllTradingBots,
  SETSELECTEDTRADINGBOT,
} from "../../../redux/features/tradingBots/tradingBotsSlice";
import EditTradingBot from "./drawers/EditTradingBot";

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
    fontSize: "18px",
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function TradingBotsTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { tradingBots } = useSelector((state) => state.tradingBots);

  const [tradingBotsList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(tradingBotsList)
    ? tradingBotsList.filter(
        (tradingbot) =>
          tradingbot.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(tradingbot.dailyTrades)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(tradingbot.price)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          tradingbot.winRate
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (tradingBots.length !== 0) {
      setTradingBotsList(tradingBots);
    }
  }, [tradingBots]);

  // EditExpertTrader Drawer

  const [tradingBotDrawerLoader, setTradingBotDrawerLoader] = useState(false);

  const [openEditTradingBotDrawer, setEditTradingBotDrawer] = useState(false);

  const handleOpenEditTradingBotDrawer = () => {
    setEditTradingBotDrawer(true);
  };

  const handleCloseEditTradingBotDrawer = () => {
    setEditTradingBotDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteTradingBotDrawer, setDeleteTradingBotDrawer] =
    useState(false);
  const [selectedTradingBotID, setSelectedTradingBotID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTradingBotDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTradingBotDrawer(false);
  };

  const deleteBot = () => {
    // console.log(selectedTraderID.traderID)
    const id = selectedTradingBotID?.botID;
    dispatch(deleteTradingBot({ id }));
  };

  // End Delete Trader Drawer

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={1} mb={1}>
        <Box
          display={"flex"}
          border="2px solid grey"
          borderRadius={"20px"}
          height={"35px"}
          width={{ xs: "70%", md: "200px" }}
        >
          <IconButton type="button" sx={{ p: 1, pr: 0 }}>
            <MagnifyingGlass />
          </IconButton>
          <InputBase
            sx={{ ml: 2, width: "100%" }}
            placeholder="Search Bot"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Button
          startIcon={<ClockCounterClockwise size={22} />}
          variant="contained"
          size="small"
          sx={{ borderRadius: "30px", fontWeight: 700 }}
          onClick={() => {
            dispatch(getAllTradingBots());
          }}
        >
          {" "}
          Refresh
        </Button>
      </Stack>
      <StyledTableContainer component={Paper}>
        <Table aria-label="stylish user table">
          {filteredAllCoins.length > 0 ? (
            <StyledTableHead>
              <TableRow>
                <TableCell>Trading Bots</TableCell>
                {/* <TableCell>Status</TableCell> */}
                {!isMobile && (
                  <>
                    <TableCell>daily Trades</TableCell>
                    <TableCell>Price Amount</TableCell>
                    <TableCell>Win Rate</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </>
                )}
              </TableRow>
            </StyledTableHead>
          ) : (
            <StyledTableHead>
              <TableRow>
                <TableCell>Trading Bots</TableCell>
              </TableRow>
            </StyledTableHead>
          )}
          <TableBody>
            {filteredAllCoins.length > 0 ? (
              filteredAllCoins.map((bot) => (
                <StyledTableRow key={bot?._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StyledAvatar src={bot?.photo} alt={bot?.name} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {bot?.name}
                        </Typography>
                        {isMobile && (
                          <>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color={"springgreen"}
                            >
                              Price:{" "}
                              {Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                ...(bot?.price > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(bot?.price)}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Daily Trades: {bot?.dailyTrades}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Win Rate: {bot?.winRate}
                            </Typography>

                            <Stack
                              direction={"row"}
                              justifyContent={"flex-start"}
                              spacing={1}
                              mt={1}
                            >
                              <ActionButton
                                sx={{ border: "2px solid green" }}
                                aria-label="edit"
                                onClick={() => {
                                  dispatch(SETSELECTEDTRADINGBOT(bot));
                                  setTradingBotDrawerLoader(true);
                                  handleOpenEditTradingBotDrawer();
                                }}
                              >
                                <Pen color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedTradingBotID({
                                    botID: bot?._id,
                                    botName: bot?.name,
                                  });
                                  handleClickDelete();
                                }}
                              >
                                <Trash color="red" />
                              </ActionButton>
                            </Stack>
                          </>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'online' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell> */}
                  {!isMobile && (
                    <>
                      <TableCell>
                        <Typography variant="body1">
                          {bot?.dailyTrades} Trades Daily
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color={"springgreen"}
                          fontWeight={"bold"}
                        >
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            ...(bot?.price > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(bot?.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>{bot?.winRate}</TableCell>
                      <TableCell>{bot?.comment}</TableCell>

                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          justifyContent={"flex-end"}
                          spacing={1}
                        >
                          <ActionButton
                            sx={{ border: "2px solid green" }}
                            aria-label="edit"
                            onClick={() => {
                              dispatch(SETSELECTEDTRADINGBOT(bot));
                              setTradingBotDrawerLoader(true);
                              handleOpenEditTradingBotDrawer();
                            }}
                          >
                            <Pen color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedTradingBotID({
                                botID: bot?._id,
                                botName: bot?.name,
                              });
                              handleClickDelete();
                            }}
                          >
                            <Trash color="red" />
                          </ActionButton>
                        </Stack>
                      </TableCell>
                    </>
                  )}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell>
                  <Stack
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt={3}
                  >
                    <XCircle size={"52"} />
                    <Typography variant="h5" mb={2}>
                      Nothing Found
                    </Typography>
                    {/* <Divider flexItem /> */}
                  </Stack>
                </TableCell>
              </StyledTableRow>
            )}
            <Box p={2}>Pagination</Box>
          </TableBody>
        </Table>
      </StyledTableContainer>

      <EditTradingBot
        open={openEditTradingBotDrawer}
        handleClose={handleCloseEditTradingBotDrawer}
        handleOpen={handleOpenEditTradingBotDrawer}
        tradingBotDrawerLoader={tradingBotDrawerLoader}
        setTradingBotDrawerLoader={setTradingBotDrawerLoader}
      />

      <Dialog
        open={openDeleteTradingBotDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this bot ${selectedTradingBotID?.botName} ?`}
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
              deleteBot();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
