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
  Chip,
} from "@mui/material";
import {
  ClockCounterClockwise,
  Eye,
  MagnifyingGlass,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";

import { deleteDepositRequest, getAllPendingDepositRequest, SETSELECTEDDEPOSIT } from "../../../redux/features/deposit/depositSlice";
import EditDepositRequest from "./drawers/EditDepositRequest";
import { getAllAdminTotalCounts } from "../../../redux/features/totalCounts/totalCountsSlice";

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
  width: 80,
  height: 80,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function AllDepositRequestTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { AllPendingDepositRequest } = useSelector((state) => state.deposit);

  const [PendingDepositRequestList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(PendingDepositRequestList)
    ? PendingDepositRequestList.filter(
        (request) =>
          request?.userId?.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.userId?.lastname)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.userId?.email)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(request?.amount)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          request?.status
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          request?.method
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (AllPendingDepositRequest.length !== 0) {
      setTradingBotsList(AllPendingDepositRequest);
    }
  }, [AllPendingDepositRequest]);

  // EditExpertTrader Drawer

  const [depositRequestDrawerLoader, setDepositRequestDrawerLoader] = useState(false);

  const [openEditDepositRequestDrawer, setEditDepositRequestDrawer] = useState(false);

  const handleOpenEditDepositRequestDrawer = () => {
    setEditDepositRequestDrawer(true);
  };

  const handleCloseEditDepositRequestDrawer = () => {
    setEditDepositRequestDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteDepositRequestDrawer, setDeleteDepositRequestDrawer] =
    useState(false);
    
  const [selectedDepositRequestID, setSelectedDepositRequestID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteDepositRequestDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteDepositRequestDrawer(false);
  };

  const deleteDepositRequestNow = async () => {
    const id = selectedDepositRequestID.requestID;
    await dispatch(deleteDepositRequest({ id }));
    dispatch(getAllAdminTotalCounts());
};
  

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
            placeholder="Search Request"
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
            dispatch(getAllPendingDepositRequest());
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
                <TableCell>User</TableCell>
                {/* <TableCell>Status</TableCell> */}
                {!isMobile && (
                  <>
                    <TableCell>Type of Deposit</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell> Amount Deposited</TableCell>
                    <TableCell>Status</TableCell>
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
              filteredAllCoins.map((request) => (
                <StyledTableRow key={request?._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StyledAvatar
                        src={request?.userId?.photo}
                        alt={request?.userId?.firstname}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {request?.userId?.firstname}{" "}
                          {request?.userId?.lastname}
                        </Typography>
                        {isMobile && (
                          <>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color={"springgreen"}
                            >
                              Amount:{" "}
                              {Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                ...(request?.amount > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(request?.amount)}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Method: {request?.method}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Status:  <Chip
                          label={request?.status}
                          color={
                            request?.status === "PENDING" ? "error" : "primary"
                          }
                          size="small"
                          icon={<XCircle size={22} />}
                        />
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
                                  dispatch(SETSELECTEDDEPOSIT(request));
                                  setDepositRequestDrawerLoader(true);
                                  handleOpenEditDepositRequestDrawer();
                                }}
                              >
                                <Eye color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedDepositRequestID({
                                    requestID: request?._id,
                                    requestFirstname: request?.userId?.firstname,
                                    requestLastname: request?.userId?.lastname,
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
                    label={user?.status}
                    color={user?.status === 'online' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell> */}
                  {!isMobile && (
                    <>
                      <TableCell>
                        <Typography variant="body1">
                          {request?.typeOfDeposit} account deposit
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {request?.method} Method
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
                            ...(request?.amount > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(request?.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request?.status}
                          color={
                            request?.status === "PENDING" ? "error" : "primary"
                          }
                          size="large"
                          icon={<XCircle size={22} />}
                        />
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
                              dispatch(SETSELECTEDDEPOSIT(request));
                              setDepositRequestDrawerLoader(true);
                              handleOpenEditDepositRequestDrawer();
                            }}
                          >
                            <Eye color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedDepositRequestID({
                                requestID: request?._id,
                                requestFirstname: request?.userId?.firstname,
                                requestLastname: request?.userId?.lastname,
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

      <EditDepositRequest
        open={openEditDepositRequestDrawer}
        handleClose={handleCloseEditDepositRequestDrawer}
        handleOpen={handleOpenEditDepositRequestDrawer}
        depositRequestDrawerLoader={depositRequestDrawerLoader}
        setDepositRequestDrawerLoader={setDepositRequestDrawerLoader}
      />

      <Dialog
        open={openDeleteDepositRequestDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this Deposit Request by ${selectedDepositRequestID?.requestFirstname} ${selectedDepositRequestID?.requestLastname} ?`}
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
              deleteDepositRequestNow();
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
