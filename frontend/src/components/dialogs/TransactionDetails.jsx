import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Info,
  Pen,
  SpinnerBall,
  Trash,
  X,
  XCircle,
} from "@phosphor-icons/react";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import BankLogoImg from "../../assets/bank.png";
import { IOSSwitch } from "../../pages/dashboard/Profile";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import {
  adminGetUserDeposithistory,
  deleteDepositRequest,
  getUserDeposithistory,
} from "../../redux/features/deposit/depositSlice";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import { getSingleUser } from "../../redux/features/auth/authSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  adminGetAllUserWalletTransactions,
  adminUpdateUserWalletTransaction,
  deleteTransaction,
  getUserWalletTransactions,
} from "../../redux/features/walletTransactions/walletTransactionsSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const TransactionDetails = ({ open, handleClose }) => {
  const size = UseWindowSize();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const { user, conversionRate, singleUser } = useSelector(
    (state) => state.auth
  );

  const { selectedTransaction } = useSelector(
    (state) => state.walletTransactions
  );

  // Delete History Drawer
  const [openDeleteTransactionDrawer, setDeleteTransactionDrawer] =
    useState(false);

  const [selectedTransactionID, setSelectedTransactionID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTransactionDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTransactionDrawer(false);
  };

  const deleteTransactionNow = async () => {
    handleClose();

    const formData = {
      userId: user?.role === "admin" ? id : user?._id,
      transactionData: {
        transactionsId: selectedTransactionID.requestID,
      },
    };
    await dispatch(deleteTransaction({ id, formData }));

    if (user?.role === "admin") {
      dispatch(adminGetAllUserWalletTransactions(singleUser?._id));
      // dispatch(getAllAdminTotalCounts());
    } else {
      dispatch(getUserWalletTransactions());
    }
  };

  // open edit transaction drawer

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const initialState = {
    typeOfTransaction: selectedTransaction?.typeOfTransaction || "",
    walletAddress: selectedTransaction?.walletAddress || "",
    amount: selectedTransaction?.amount ?? "",
    createdAt: "",
    description: selectedTransaction?.description || "",
    status: selectedTransaction?.status || "",
  };

  const [formData, setFormData] = useState(initialState);

  const {
    typeOfTransaction,
    walletAddress,
    amount,
    createdAt,
    description,
    status,
  } = formData;

  useEffect(() => {
    if (selectedTransaction) {
      setFormData({
        typeOfTransaction: selectedTransaction?.typeOfTransaction || "",
        walletAddress: selectedTransaction?.walletAddress || "",
        amount: selectedTransaction?.amount || "",
        createdAt: selectedTransaction?.createdAt || "",
        description: selectedTransaction?.description || "",
        status: selectedTransaction?.status || "",
      });
    }
  }, [selectedTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !typeOfTransaction ||
      !walletAddress ||
      !amount ||
      !createdAt ||
      !description ||
      !status
    ) {
      return toast.error("All fields are required");
    }

    const formData = {
      userId: id,
      transactionData: {
        transactionId: selectedTransaction?._id,
        typeOfTransaction,
        method: selectedTransaction?.method,
        methodIcon: selectedTransaction?.methodIcon,
        symbol: selectedTransaction?.symbol,
        amount,
        walletAddress,
        description,
        status,
        createdAt,
      },
    };

    // console.log(formData);

    await dispatch(adminUpdateUserWalletTransaction({ id, formData }));
    await handleClose();
    // await dispatch(getUserWithdrawalhistory());
    // await dispatch(getUser());
    // setFormData(initialState);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} >
        <Stack
          spacing={1.5}
          component={Paper}
          // border={"1px solid grey"}
          borderRadius={"10px"}
          p={"16px 16px"}
          sx={{ wordWrap: "break-word" }}
          style={style}
          width={size.width <= 899 ? "95%" : 600}
          maxHeight={size.width <= 899 ? "90vh" : 700}
          overflow={"auto"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Stack
                justifyContent={"center"}
                direction={"row"}
                border={"1px solid lightgrey"}
                padding={0.2}
                borderRadius={"8px"}
                backgroundColor="white"
              >
                <img
                  src={
                    selectedTransaction?.method === "Bank"
                      ? BankLogoImg
                      : selectedTransaction?.methodIcon
                  }
                  alt={selectedTransaction?.method}
                  width={30}
                />
              </Stack>
              <Typography variant="h6" fontWeight={"600"}>
                {selectedTransaction?.method} Transaction
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              {user?.role === "admin" && (
                <IconButton
                  size="small"
                  sx={{ border: "2px solid darkgrey" }}
                  onClick={() => {
                    handleOpenEdit();
                  }}
                >
                  <Pen size={20} />
                </IconButton>
              )}

              <IconButton
                size="small"
                sx={{ border: "2px solid darkgrey" }}
                onClick={() => {
                  setSelectedTransactionID({
                    requestID: selectedTransaction?._id,
                    // requestFirstname: request?.userId?.firstname,
                    // requestLastname: request?.userId?.lastname,
                  });
                  handleClickDelete();
                }}
              >
                <Trash size={20} />
              </IconButton>

              <IconButton
                size="small"
                sx={{ border: "2px solid darkgrey" }}
                onClick={handleClose}
              >
                <X size={20} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack>
            <Typography fontWeight={"600"}>Transaction Id:</Typography>
            <Typography>ID-{selectedTransaction?._id}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Type:</Typography>
            <Typography>{selectedTransaction?.typeOfTransaction}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>To:</Typography>
            <Typography>{selectedTransaction?.walletAddress}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Amount:</Typography>

            {user?.role !== "admin" ? (
              <Typography>
                {user?.isManualAssetMode === false
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code,
                      ...(selectedTransaction?.amount *
                        selectedTransaction?.price >
                      9999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(
                      selectedTransaction?.amount * selectedTransaction?.price
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code,
                      ...(selectedTransaction?.amount > 9999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(selectedTransaction?.amount)}{" "}
                {user?.isManualAssetMode === false &&
                  `( ${Number(selectedTransaction?.amount).toFixed(
                    8
                  )} ${selectedTransaction?.symbol.toUpperCase()} ) `}
              </Typography>
            ) : (
              <Typography>
                {singleUser?.isManualAssetMode === false
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: singleUser?.currency?.code,
                      ...(selectedTransaction?.amount *
                        selectedTransaction?.price >
                      9999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(
                      selectedTransaction?.amount * selectedTransaction?.price
                    )
                  : Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: singleUser?.currency?.code,
                      ...(selectedTransaction?.amount > 9999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(selectedTransaction?.amount)}{" "}
                 {singleUser?.isManualAssetMode === false &&
                  `( ${Number(selectedTransaction?.amount).toFixed(
                    8
                  )} ${selectedTransaction?.symbol.toUpperCase()} ) `}
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Date:</Typography>
            <Typography>
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(selectedTransaction?.createdAt || 0))}
            </Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Description:</Typography>
            <Typography>{selectedTransaction?.description}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Status:</Typography>
            <Typography>{selectedTransaction?.status}</Typography>
          </Stack>

          {/* <Divider /> */}

          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </Stack>
      </Modal>

      <Dialog
        open={openDeleteTransactionDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this Transaction History ? `}
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
              deleteTransactionNow();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: { xs: "95%", sm: "60%", md: 540 },
            maxHeight: "90%",
            overflow: "auto",
            bgcolor: colors.dashboardbackground[100],
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "10px",
            p: 2,
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            mb={1}
            alignItems={"center"}
          >
            <Typography variant="h6">Edit Transaction</Typography>
            <XCircle size={38} onClick={handleCloseEdit} />
          </Stack>

          <Divider />

          <form onSubmit={handleSubmit}>
            <Box mt={2}>
              <Stack spacing={2}>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">Type</InputLabel>
                  <Select
                    name="typeOfTransaction"
                    value={formData?.typeOfTransaction}
                    label="Age"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"Sent"}>Sent</MenuItem>
                    <MenuItem value={"Received"}>Received</MenuItem>
                  </Select>
                </Stack>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">To</InputLabel>
                  <OutlinedInput
                    size="normal"
                    name="walletAddress"
                    placeholder="Enter address "
                    value={formData?.walletAddress}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">Amount</InputLabel>
                  <OutlinedInput
                    name="amount"
                    size="normal"
                    placeholder="Enter amount "
                    value={formData?.amount}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">Date</InputLabel>
                  <OutlinedInput
                    type="date"
                    name="createdAt"
                    size="normal"
                    placeholder="Enter Date "
                    value={
                      formData?.createdAt
                        ? new Date(formData?.createdAt).toISOString().split("T")[0]
                        : ""
                    } 
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "10px",
                      },
                      "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(34%) sepia(91%) saturate(1700%) hue-rotate(120deg) brightness(100%) contrast(90%)",
                      cursor: "pointer",
                    },
                    }}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">Description</InputLabel>
                  <OutlinedInput
                    name="description"
                    multiline
                    rows={4}
                    size="normal"
                    placeholder="Enter Description "
                    value={formData?.description}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <InputLabel htmlFor="my-input">Status</InputLabel>
                  <Select
                    name="status"
                    value={formData?.status}
                    label="Age"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                    <MenuItem value={"Completed"}>Completed</MenuItem>
                    <MenuItem value={"Processing"}>Processing</MenuItem>
                    <MenuItem value={"confirmed"}>confirmed</MenuItem>
                    <MenuItem value={"Unconfirmed"}>Unconfirmed</MenuItem>
                    <MenuItem value={"Rejected"}>Rejected</MenuItem>
                    <MenuItem value={"Stuck"}>Stuck</MenuItem>
                    <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                    <MenuItem value={"Under Dispute"}>Under Dispute</MenuItem>
                  </Select>
                </Stack>
                <Stack>
                  <Button type="submit" variant="contained">
                    Confirm
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TransactionDetails;
