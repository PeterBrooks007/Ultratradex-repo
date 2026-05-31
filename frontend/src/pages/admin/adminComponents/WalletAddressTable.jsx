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
  Eye,
  MagnifyingGlass,
  Trash,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import EditWalletAddress from "./drawers/EditWalletAddress";
import { deleteWalletAddress, getAllWalletAddress, SETSELECTEDWALLETADDRESS } from "../../../redux/features/walletAddress/walletAddressSlice";

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
  width: 80, // Default width for xs breakpoint
  height: 80, // Default height for xs breakpoint
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.up('md')]: {
    width: 100,
    height: 100,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function WalletAddressTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { allWalletAddress } = useSelector((state) => state.walletAddress);



  const [walletAddressList, setWalletAddressList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(walletAddressList) ? walletAddressList.filter((walletAddress) =>
    walletAddress.walletName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  walletAddress.walletSymbol.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  walletAddress.walletAddress.toLowerCase().includes(searchTerm.toLowerCase().trim()) 
  ) : [];
  



  useEffect(() => {
    if(allWalletAddress.length !== 0) {
      setWalletAddressList(allWalletAddress);
    }
  }, [allWalletAddress]);








  // WalletAddress Drawer

  const [walletAddressDrawerLoader, setWalletAddressDrawerLoader] =
    useState(false);

  const [openEditWalletAddressDrawer, setEditWalletAddressDrawer] =
    useState(false);

  const handleOpenEditWalletAddressDrawer = () => {
    setEditWalletAddressDrawer(true);
  };

  const handleCloseEditWalletAddressDrawer = () => {
    setEditWalletAddressDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteTraderDrawer, setDeleteTraderDrawer] = useState(false);
  const [selectedWalletID, setSelectedWalletID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTraderDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTraderDrawer(false);
  };

  const deleteWallet = () => {
    // console.log(selectedTraderID.traderID)
    const id = selectedWalletID?.walletId;
    dispatch(deleteWalletAddress({ id }));
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
            placeholder="Search Wallet"
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
            dispatch(getAllWalletAddress());
          }}
        >
          {" "}
          Refresh
        </Button>
      </Stack>
      <StyledTableContainer component={Paper}>
        <Table aria-label="stylish user table">
          <StyledTableHead>
            <TableRow>
              <TableCell>
                Wallet Address
                
              </TableCell>
              {/* <TableCell>Status</TableCell> */}
              {!isMobile && (
                <>
                  <TableCell>Wallet Symbol</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Wallet Image</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {allWalletAddress &&
              filteredAllCoins.map((wallet) => (
                <StyledTableRow key={wallet?._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StyledAvatar
                        src={wallet?.walletPhoto}
                        alt={wallet?.walletName}
                        sx={{backgroundColor: "white"}}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {wallet?.walletName} wallet address
                        </Typography>
                        {isMobile && (
                          <>
                            
                            <Typography variant="body1" color="textSecondary">
                              symbol: {wallet?.walletSymbol}
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
                                  // dispatch(RESET_SETEXPERTTRADER());
                                  dispatch(SETSELECTEDWALLETADDRESS(wallet));
                                  setWalletAddressDrawerLoader(true);
                                  handleOpenEditWalletAddressDrawer();
                                }}
                              >
                                <Eye color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedWalletID({
                                    walletId: wallet?._id,
                                    walletName: wallet?.walletName,
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
                        <Typography variant="body1">{wallet?.walletSymbol}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{wallet?.walletAddress}</Typography>
                      </TableCell>
                      
                      <TableCell>
                        <img width={100} height={100} src={wallet?.walletQrcode} alt={wallet?.walletName}  />
                        
                        </TableCell>
                     
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
                              // dispatch(RESET_SETEXPERTTRADER());
                              dispatch(SETSELECTEDWALLETADDRESS(wallet));
                              setWalletAddressDrawerLoader(true);
                              handleOpenEditWalletAddressDrawer();
                            }}
                          >
                            <Eye color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                                  setSelectedWalletID({
                                    walletId: wallet?._id,
                                    walletName: wallet?.walletName,
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
              ))}
            <Box p={2}>Pagination</Box>
          </TableBody>
        </Table>
      </StyledTableContainer>

      <EditWalletAddress
        open={openEditWalletAddressDrawer}
        handleClose={handleCloseEditWalletAddressDrawer}
        handleOpen={handleOpenEditWalletAddressDrawer}
        walletAddressDrawerLoader={walletAddressDrawerLoader}
        setWalletAddressDrawerLoader={setWalletAddressDrawerLoader}
      />

      <Dialog
        open={openDeleteTraderDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete ${
            selectedWalletID?.walletName
          } wallet ?`}
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
    </>
  );
}
