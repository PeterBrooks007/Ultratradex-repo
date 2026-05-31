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
  Modal,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import { CheckCircle, Info, Trash, X, XCircle } from "@phosphor-icons/react";
import { CryptoImages } from "../../data";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import BankLogoImg from "../../assets/bank.png";
import { IOSSwitch } from "../../pages/dashboard/Profile";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import {
  adminGetUserDeposithistory,
  approveDepositRequest,
  deleteDepositRequest,
  getUserDeposithistory,
} from "../../redux/features/deposit/depositSlice";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import { getSingleUser } from "../../redux/features/auth/authSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const DepositDetails = ({ open, handleClose, handleOpen }) => {
  const size = UseWindowSize();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { deposit } = useSelector((state) => state.deposit);
  const { user, conversionRate, singleUser } = useSelector(
    (state) => state.auth
  );

  // Function to get the URL by the crypto name
  const getCryptoImageUrl = (cryptoName) => {
    const crypto = CryptoImages.find((image) => image.name === cryptoName);
    return crypto ? crypto.url : "URL not found";
  };

  const initialState = {
    firstname: deposit?.userId?.firstname || "",
    lastname: deposit?.userId?.lastname || "",
    amount: deposit?.amount || "",
    method: deposit?.method || "",
    status: deposit?.status || "",
    photo: deposit?.userId?.photo || "",
    depositProof: deposit?.depositProof || "",
    typeOfDeposit: deposit?.typeOfDeposit || "",
  };

  const [formData, setFormData] = useState(initialState);
  const { depositProof, typeOfDeposit } = formData;

  useEffect(() => {
    if (deposit) {
      setFormData({
        firstname: deposit?.userId?.firstname || "",
        lastname: deposit?.userId?.lastname || "",
        amount: deposit?.amount ?? "",
        method: deposit?.method || "",
        status: deposit?.status || "",
        photo: deposit?.userId?.photo || "",
        depositProof: deposit?.depositProof || "",
        typeOfDeposit: deposit?.typeOfDeposit || "",
      });
    }
  }, [deposit]);

  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
  });

  // Handle switch change
  const handleSwitchChange = (event) => {
    const { name, checked: isChecked } = event.target;
    setChecked((prevState) => ({
      ...prevState, // Spread the previous state
      [name]: isChecked, // Update the specific switch's state
    }));
    setTimeout(() => {
      handleFormSubmit(name, isChecked);
    }, 600);
  };

  const handleFormSubmit = async (switchName) => {
    let status;
    let comment;
    if (switchName === "switch1") {
      status = "APPROVED";
      comment = "ApproveWithBalance";
    }
    if (switchName === "switch2") {
      status = "APPROVED";
      comment = "ApproveWithoutBalance";
    }
    if (switchName === "switch3") {
      status = "NOT-APPROVED";
      comment = "Dissapprove ";
    }
    if (switchName === "switch4") {
      status = "PENDING";
      comment = "pending";
    }

    const id = deposit?._id;

    const userData = {
      status,
      comment,
      amount: deposit?.amount,
      userId: deposit?.userId,
      typeOfDeposit: deposit?.typeOfDeposit,
    };

    // console.log(id, userData)

    await dispatch(approveDepositRequest({ id, userData }));
    dispatch(getSingleUser(singleUser?._id));
    dispatch(adminGetUserDeposithistory(singleUser?._id));
    dispatch(getAllAdminTotalCounts());
    handleClose()
  };

  const [openProof, setOpenProof] = useState(false);
  const handleOpenProof = () => setOpenProof(true);
  const handleCloseProof = () => setOpenProof(false);

  // Delete History Drawer
  const [openDeleteDepositRequestDrawer, setDeleteDepositRequestDrawer] =
    useState(false);

  const [selectedDepositRequestID, setSelectedDepositRequestID] =
    useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteDepositRequestDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteDepositRequestDrawer(false);
  };

  const deleteDepositRequestNow = async () => {
    handleClose();

    const id = selectedDepositRequestID.requestID;
    await dispatch(deleteDepositRequest({ id }));

    if (user?.role === "admin") {
      dispatch(adminGetUserDeposithistory(singleUser?._id));
      dispatch(getAllAdminTotalCounts());
    } else {
      dispatch(getUserDeposithistory());
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} sx={{zIndex: 1402}}>
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
                    deposit?.method === "Bank"
                      ? BankLogoImg
                      : deposit?.methodIcon
                  }
                  alt={deposit?.method}
                  width={30}
                />
              </Stack>
              <Typography variant="h6" fontWeight={"600"}>
                {deposit?.method} Deposit
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                size="small"
                sx={{ border: "2px solid darkgrey" }}
                onClick={() => {
                  setSelectedDepositRequestID({
                    requestID: deposit?._id,
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
            <Typography>ID-{deposit?._id}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Type of deposit:</Typography>
            <Typography>{deposit?.typeOfDeposit} account deposit</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Date:</Typography>
            <Typography>
              {new Date(deposit?.createdAt).toLocaleString("en-US", {
                month: "2-digit", // 12 for December
                day: "2-digit", // 12 for the day
                year: "numeric", // 2024 for the year
                hour: "2-digit", // 12-hour format
                minute: "2-digit", // 12:12
                second: "2-digit", // 12:12:10
                hour12: true, // AM/PM format
              })}
            </Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Deposited Amount:</Typography>
            <Typography>
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate?.code,
                    ...(deposit?.amount * conversionRate?.rate > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(deposit?.amount * conversionRate?.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(deposit?.amount > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(deposit?.amount)}
            </Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Status:</Typography>
            <Typography>{deposit?.status}</Typography>
          </Stack>

          {/* <Divider /> */}

          <Button onClick={handleClose} variant="contained">
            Close
          </Button>

          {/* {user?.role === "admin" && ( */}
            <Box>
              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
                mx={-1}
              >
                <Stack spacing={2.5}>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={0.5}
                    color={"violet"}
                  >
                    <Info size={28} />
                    <Typography variant="body1">
                      {" "}
                      {typeOfDeposit} account Deposit
                    </Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography>View Proof of deposit</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenProof}
                    >
                      View Proof
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          {/* )} */}

          {user?.role === "admin" && deposit?.status === "PENDING" && (
            <>
              <Box>
                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                  mx={-1}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <CheckCircle size={28} color="#009e4a" />
                        <Typography variant="body1" fontWeight={500}>
                          Approve With Balance
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch1}
                        onChange={handleSwitchChange}
                        name="switch1"
                      />
                    </Stack>

                    <Typography>
                    Please note this approval will add the amount to the
                      user&apos;s Trade balance and total deposit only.{" "}
                       <span style={{color: "orange", fontWeight: 700}}>NOT FOR WALLET DEPOSIT AND BALANCE</span>
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                  mx={-1}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <CheckCircle size={28} color="#009e4a" />
                        <Typography variant="body1" fontWeight={500}>
                          Approve Without Balance
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch2}
                        onChange={handleSwitchChange}
                        name="switch2"
                      />
                    </Stack>

                    <Typography>
                      Please note this approval will NOT add the amount to the
                      user&apos;s trade balance
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                  mx={-1}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <XCircle size={28} color="red" />
                        <Typography variant="body1" fontWeight={500}>
                          Dissapprove this Request
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch3}
                        onChange={handleSwitchChange}
                        name="switch3"
                      />
                    </Stack>

                    <Typography>
                      Please note this will Dissapprove the request
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                  mx={-1}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Info size={28} color="orange" />
                        <Typography variant="body1" fontWeight={500}>
                          Set Request to Pending
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch4}
                        onChange={handleSwitchChange}
                        name="switch4"
                      />
                    </Stack>

                    <Typography>
                      Please note this request will be set to pending
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </Modal>

      <Modal
        open={openProof}
        onClose={handleCloseProof}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{zIndex: 1403}}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: { xs: "90%", sm: "60%", md: 540 },
            maxHeight: "100%",
            overflow: "auto",
            bgcolor: "background.paper",
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
            <Typography variant="h6">Proof of deposit</Typography>
            <XCircle size={38} onClick={handleCloseProof} />
          </Stack>

          <Box>
            <img src={depositProof} alt="" width={500} height={"auto"} />
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteDepositRequestDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{zIndex: 1403}}
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this Deposit History `}
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
};

export default DepositDetails;
