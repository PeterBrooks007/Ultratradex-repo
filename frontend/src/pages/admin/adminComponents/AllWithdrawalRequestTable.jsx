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
import { deleteWithdrawalRequest, getAllPendingWithdrawalRequest, SETSELECTEDWITHDRAWAL } from "../../../redux/features/withdrawal/withdrawalSlice";
import EditWithdrawalRequest from "./drawers/EditWithdrawalRequest";
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

export default function AllWithdrawalRequestTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { AllPendingWithdrawalRequest } = useSelector((state) => state.withdrawal);

  const [PendingWithdrawalRequestList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(PendingWithdrawalRequestList)
    ? PendingWithdrawalRequestList.filter(
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
    if (AllPendingWithdrawalRequest.length !== 0) {
      setTradingBotsList(AllPendingWithdrawalRequest);
    }
  }, [AllPendingWithdrawalRequest]);

  // EditExpertTrader Drawer

  const [withdrawalRequestDrawerLoader, setWithdrawalRequestDrawerLoader] = useState(false);

  const [openEditWithdrawalRequestDrawer, setEditWithdrawalRequestDrawer] = useState(false);

  const handleOpenEditWithdrawalRequestDrawer = () => {
    setEditWithdrawalRequestDrawer(true);
  };

  const handleCloseEditWithdrawalRequestDrawer = () => {
    setEditWithdrawalRequestDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteWithdrawalRequestDrawer, setDeleteWithdrawalRequestDrawer] =
    useState(false);
    
  const [selectedWithdrawalRequestID, setSelectedWithdrawalRequestID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteWithdrawalRequestDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteWithdrawalRequestDrawer(false);
  };

  const deleteWithdrawalRequestNow = async () => {
    const id = selectedWithdrawalRequestID.requestID;
    await dispatch(deleteWithdrawalRequest({ id }));
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
            dispatch(getAllPendingWithdrawalRequest());
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
                    <TableCell>Type of Withdrawal</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell> Amount to withdraw</TableCell>
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
                                  dispatch(SETSELECTEDWITHDRAWAL(request));
                                  setWithdrawalRequestDrawerLoader(true);
                                  handleOpenEditWithdrawalRequestDrawer();
                                }}
                              >
                                <Eye color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedWithdrawalRequestID({
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
                          {request?.typeOfWithdrawal} account withdrawal
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
                              dispatch(SETSELECTEDWITHDRAWAL(request));
                              setWithdrawalRequestDrawerLoader(true);
                              handleOpenEditWithdrawalRequestDrawer();
                            }}
                          >
                            <Eye color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedWithdrawalRequestID({
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

      <EditWithdrawalRequest
        open={openEditWithdrawalRequestDrawer}
        handleClose={handleCloseEditWithdrawalRequestDrawer}
        handleOpen={handleOpenEditWithdrawalRequestDrawer}
        withdrawalRequestDrawerLoader={withdrawalRequestDrawerLoader}
        setWithdrawalRequestDrawerLoader={setWithdrawalRequestDrawerLoader}
      />

      <Dialog
        open={openDeleteWithdrawalRequestDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this withdrawal Request by ${selectedWithdrawalRequestID?.requestFirstname} ${selectedWithdrawalRequestID?.requestLastname} ?`}
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
              deleteWithdrawalRequestNow();
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
