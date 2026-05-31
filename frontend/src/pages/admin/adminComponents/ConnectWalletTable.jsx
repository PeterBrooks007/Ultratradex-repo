import { useEffect, useState } from "react";
import {

  Paper,
  IconButton,
  Typography,
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

import {
  deleteArrayOfWallets,
  deleteConnectWallet,
  getAllConnectWallet,
  SETSELECTEDCONNECTWALLET,
} from "../../../redux/features/connectWallet/connectWalletSlice";
import { tokens } from "../../../theme";
import EditConnectWallet from "./drawers/EditConnectWallet";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  marginRight: theme.spacing(2),
  border: `0.5px solid ${theme.palette.primary.main}`,
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

export default function ConnectWalletTable() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { wallets } = useSelector((state) => state.connectWallet);

  const [selectedWallets, setSelectedWallets] = useState(new Set());
  const isAllSelected = selectedWallets.size === wallets.length;


  // console.log(selectedWallets)

  const [connectWalletList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWallet = Array.isArray(connectWalletList)
    ? wallets.filter((wallet) =>
        wallet.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (wallets.length !== 0) {
      setTradingBotsList(wallets);
    }
  }, [wallets]);

  // EditExpertTrader Drawer

  const [connectWalletDrawerLoader, setConnectWalletDrawerLoader] =
    useState(false);

  const [openEditConnectWalletDrawer, setEditConnectWalletDrawer] =
    useState(false);

  const handleOpenEditConnectWalletDrawer = () => {
    setEditConnectWalletDrawer(true);
  };

  const handleCloseEditConnectWalletDrawer = () => {
    setEditConnectWalletDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteTradingBotDrawer, setDeleteTradingBotDrawer] =
    useState(false);
  const [selectedConnectWalletID, setSelectedConnectWalletID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTradingBotDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTradingBotDrawer(false);
  };

  const deleteWallet = () => {
    // console.log(selectedConnectWalletID?.walletID)
    const id = selectedConnectWalletID?.walletID;
    dispatch(deleteConnectWallet({ id }));
  };


   // Delete array of Wallet Drawer
   const [openDeleteSelectedWallet, setDeleteSelectedWallet] =
   useState(false);

 // console.log(selectedTraderID);

 const handleClickDeleteSelectedWallet = () => {
  setDeleteSelectedWallet(true);
 };

 const handleCloseDeleteSelectedWallet = () => {
  setDeleteSelectedWallet(false);
 };




  const handleSelectWallet = (id) => {
    const updatedSelection = new Set(selectedWallets);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedWallets(updatedSelection);
  };

  const handleDeleteSelectedWallets = () => {
    dispatch(deleteArrayOfWallets(Array.from(selectedWallets))); // Pass the selected wallet IDs

    // console.log("selectedWallets", Array.from(selectedWallets));
  };


  // Function to handle master checkbox change
  const handleSelectAllWallet = (e) => {
    if (e.target.checked) {
      // If checked, add all mail IDs to the selectedWallets
      const allWalletIds = new Set(wallets.map((mail) => mail._id));
      setSelectedWallets(allWalletIds);
    } else {
      // If unchecked, clear the selectedWallets
      setSelectedWallets(new Set());
    }
  };

  // End Delete Trader Drawer

  // const elevation = theme.palette.mode === "light" ? 1 : 0;


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
   const paginatedWallet = filteredWallet.slice(
     page * rowsPerPage,
     page * rowsPerPage + rowsPerPage
   );
   //end of pagination




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
            placeholder="Search wallets"
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
            dispatch(getAllConnectWallet());
          }}
        >
          {" "}
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
          just
        >
          <Typography fontWeight={600} color={"white"}>
            All Connect Wallets
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
                disabled={selectedWallets.size === 0}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from bubbling up
                  handleClickDeleteSelectedWallet();
                }}
              >
                <TrashSimple size={24} color="white" />
              </IconButton>
            </Tooltip>

           
          </Stack>
        </Stack>

        <Grid container spacing={2} columns={12} p={2}>
          {paginatedWallet.map((wallet) => (
            <Grid item xs={6} md={3} key={wallet?._id}>
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
                    checked={selectedWallets.has(wallet?._id)}
                    onClick={(e) => {
                      e.stopPropagation(); // Stop the click event from bubbling up
                    }}
                    onChange={() => handleSelectWallet(wallet?._id)}
                  />

                  <Stack direction={"row"} spacing={1}>
                    <ActionButton
                      sx={{ border: "2px solid green" }}
                      aria-label="edit"
                      onClick={() => {
                        dispatch(SETSELECTEDCONNECTWALLET(wallet));
                        setConnectWalletDrawerLoader(true);
                        handleOpenEditConnectWalletDrawer();
                      }}
                    >
                      <Pen color="green" />
                    </ActionButton>

                    <ActionButton
                      sx={{ border: "2px solid red" }}
                      aria-label="delete"
                      onClick={() => {
                        setSelectedConnectWalletID({
                          walletID: wallet?._id,
                          walletName: wallet?.name,
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
                  <StyledAvatar src={wallet?.photo} alt={wallet?.name} />

                  <Stack>
                    <Typography
                      variant="subtitle2"
                      fontWeight={500}
                      sx={{
                        hyphens: "auto", // Enables automatic hyphenation
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {wallet?.name}
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
            count={filteredWallet.length} // Total count of items
            rowsPerPage={rowsPerPage} // Rows per page
            page={page} // Current page
            onPageChange={handleChangePage} // Handle page change
            onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          />
        </Stack>
      </Paper>

      <EditConnectWallet
        open={openEditConnectWalletDrawer}
        handleClose={handleCloseEditConnectWalletDrawer}
        handleOpen={handleOpenEditConnectWalletDrawer}
        connectWalletDrawerLoader={connectWalletDrawerLoader}
        setConnectWalletDrawerLoader={setConnectWalletDrawerLoader}
      />

      <Dialog
        open={openDeleteTradingBotDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this wallet ${selectedConnectWalletID?.walletName} ?`}
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
              deleteWallet();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openDeleteSelectedWallet}
        onClose={handleCloseDeleteSelectedWallet}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${selectedWallets.size} selected Wallet?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDeleteSelectedWallet}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              handleDeleteSelectedWallets();
              handleCloseDeleteSelectedWallet();
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
