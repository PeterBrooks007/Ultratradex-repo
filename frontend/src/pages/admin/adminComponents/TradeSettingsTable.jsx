import { useEffect, useState } from "react";
import {
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
  Grid,
  Checkbox,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  ClockCounterClockwise,

  MagnifyingGlass,
  Pen,
  Trash,
  TrashSimple,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";


import { tokens } from "../../../theme";
import { deleteArrayOfTradingExchange, deleteTradingSettingExchange, getAllTradingSetting, SETSELECTEDEXCHANGETYPE } from "../../../redux/features/tradingSettings/tradingSettingsSlice";
import EditTradingSettings from "./drawers/EditTradingSettings";


const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5),
  fontSize: "1.2rem",
  width: "38px",
  height: "38px",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function TradeSettingsTable() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { allExchanges } = useSelector((state) => state.tradingSettings);

  const [selectedExchanges, setselectedExchanges] = useState(new Set());
  const isAllSelected = selectedExchanges.size === allExchanges.length;


  // console.log(selectedExchanges)

  const [exchangeList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExchange = Array.isArray(exchangeList)
    ? allExchanges.filter((exchange) =>
      exchange?.exchangeType.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (allExchanges.length !== 0) {
      setTradingBotsList(allExchanges);
    }
  }, [allExchanges]);

  // EditExpertTrader Drawer

  const [tradeSettingsDrawerLoader, setTradeSettingsDrawerLoader] =
    useState(false);

  const [openEditTradeSettingsDrawer, setEditTradeSettingsDrawer] =
    useState(false);

  const handleOpenEditTradeSettingsDrawer = () => {
    setEditTradeSettingsDrawer(true);
  };

  const handleCloseEditTradeSettingsDrawer = () => {
    setEditTradeSettingsDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteTradingBotDrawer, setDeleteTradingBotDrawer] =
    useState(false);
  const [selectedTradeSettingsID, setSelectedTradeSettingsID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTradingBotDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTradingBotDrawer(false);
  };

  const deleteExchange = () => {
    // console.log(selectedTradeSettingsID?.walletID)
    const id = selectedTradeSettingsID?.exchangeID;
    dispatch(deleteTradingSettingExchange({ id }));
  };


   // Delete array of Wallet Drawer
   const [openDeleteSelectedExchange, setDeleteSelectedExchange] =
   useState(false);

 // console.log(selectedTraderID);

 const handleClickDeleteSelectedExchange = () => {
  setDeleteSelectedExchange(true);
 };

 const handleCloseDeleteSelectedExchange = () => {
  setDeleteSelectedExchange(false);
 };




  const handleSelectWallet = (id) => {
    const updatedSelection = new Set(selectedExchanges);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setselectedExchanges(updatedSelection);
  };

  const handleDeleteselectedExchanges = () => {
    dispatch(deleteArrayOfTradingExchange(Array.from(selectedExchanges))); // Pass the selected wallet IDs

    // console.log("selectedExchanges", Array.from(selectedExchanges));
  };


  // Function to handle master checkbox change
  const handleSelectAllWallet = (e) => {
    if (e.target.checked) {
      // If checked, add all mail IDs to the selectedExchanges
      const allWalletIds = new Set(allExchanges.map((mail) => mail._id));
      setselectedExchanges(allWalletIds);
    } else {
      // If unchecked, clear the selectedExchanges
      setselectedExchanges(new Set());
    }
  };

  // End Delete Trader Drawer



   //start of pagination
   // Define state for pagination
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(12); // Default rows per page
 
   // Handle page change
   const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };
 
   // Handle rows per page change
   const handleChangeRowsPerPage = (event) => {
     setRowsPerPage(parseInt(event.target.value, 10)); // Set rows per page
     setPage(0); // Reset to first page
   };
 
   // Calculate the current data slice
   const paginatedWallet = filteredExchange.slice(
     page * rowsPerPage,
     page * rowsPerPage + rowsPerPage
   );
   //end of pagination




  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={1} mb={1}>
        <Box
          display={"flex"}
          border="1px solid grey"
          borderRadius={"20px"}
          height={"35px"}
          width={{ xs: "70%", md: "200px" }}
        >
          <IconButton type="button" sx={{ p: 1, pr: 0 }}>
            <MagnifyingGlass />
          </IconButton>
          <InputBase
            sx={{ ml: 2, width: "100%" }}
            placeholder="Search Exchange"
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
            dispatch(getAllTradingSetting());
          }}
        >
         
          Refresh
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px 12px 0 0",
          backgroundColor: colors.dashboardforeground[100],
          border: `0.5px solid ${
            theme.palette.mode === "light"
              ? "lightgrey"
              : colors.dashboardbackground[100]
          }`,
        }}
      >
        <Stack
          direction={"row"}
          backgroundColor="green"
          p={2}
          borderRadius="10px 10px 0 0"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography fontWeight={600} color={"white"}>
            All Exchange Type
          </Typography>

          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={0}
          >
            <Tooltip title="Select" arrow>
              <Checkbox
                checked={isAllSelected}
                onChange={handleSelectAllWallet}
              />
            </Tooltip>

            <Tooltip title="Delete Wallets" arrow>
              <IconButton
                disabled={selectedExchanges.size === 0}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from bubbling up
                  handleClickDeleteSelectedExchange();
                }}
              >
                <TrashSimple size={24} color="white" />
              </IconButton>
            </Tooltip>

           
          </Stack>
        </Stack>

        <Grid container spacing={2} columns={12} p={2}>
          {paginatedWallet.map((exchange) => (
            <Grid item xs={6} md={3} key={exchange?._id}>
              <Box
                sx={{ flexGrow: 1 }}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  mb={2}
                >
                  <Checkbox
                    checked={selectedExchanges.has(exchange?._id)}
                    onClick={(e) => {
                      e.stopPropagation(); // Stop the click event from bubbling up
                    }}
                    onChange={() => handleSelectWallet(exchange?._id)}
                  />

                  <Stack direction={"row"} spacing={1}>
                    <ActionButton
                      sx={{ border: "2px solid green" }}
                      aria-label="edit"
                      onClick={() => {
                        dispatch(SETSELECTEDEXCHANGETYPE(exchange));
                        setTradeSettingsDrawerLoader(true);
                        handleOpenEditTradeSettingsDrawer();
                      }}
                    >
                      <Pen color="green" />
                    </ActionButton>

                    <ActionButton
                      sx={{ border: "2px solid red" }}
                      aria-label="delete"
                      onClick={() => {
                        setSelectedTradeSettingsID({
                          exchangeID: exchange?._id,
                          exchangeType: exchange?.exchangeType,
                        });
                        handleClickDelete();
                      }}
                    >
                      <Trash color="red" />
                    </ActionButton>
                  </Stack>
                </Stack>

                <Stack
                  direction={{ xs: "row", md: "row" }}
                  spacing={1}
                  alignItems={"center"}
                  p={0.5}
                >
                  <StyledAvatar src={exchange?.photo} alt={exchange?.exchangeType} />

                  <Stack>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        hyphens: "auto", // Enables automatic hyphenation
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {exchange?.exchangeType.toUpperCase()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Stack backgroundColor="green">
        <TablePagination
            rowsPerPageOptions={[4, 12, 24]}
            component="div"
            count={filteredExchange.length} // Total count of items
            rowsPerPage={rowsPerPage} // Rows per page
            page={page} // Current page
            onPageChange={handleChangePage} // Handle page change
            onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          />
        </Stack>
      </Paper>

      <EditTradingSettings
        open={openEditTradeSettingsDrawer}
        handleClose={handleCloseEditTradeSettingsDrawer}
        handleOpen={handleOpenEditTradeSettingsDrawer}
        tradeSettingsDrawerLoader={tradeSettingsDrawerLoader}
        setTradeSettingsDrawerLoader={setTradeSettingsDrawerLoader}
      />

      <Dialog
        open={openDeleteTradingBotDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this ${selectedTradeSettingsID?.exchangeType} Exchange and all its trading pairs ?`}
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
              deleteExchange();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openDeleteSelectedExchange}
        onClose={handleCloseDeleteSelectedExchange}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${selectedExchanges.size} selected Exchange?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDeleteSelectedExchange}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              handleDeleteselectedExchanges();
              handleCloseDeleteSelectedExchange();
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
