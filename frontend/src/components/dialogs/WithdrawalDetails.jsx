import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Modal, Paper, Stack, useTheme } from "@mui/material";
import { CheckCircle, Info, SpinnerBall, Trash, X, XCircle } from "@phosphor-icons/react";
import { CryptoImages } from "../../data";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import BankLogoImg from "../../assets/bank.png";
import { useState } from "react";
import { adminGetUserWithdrawalhistory, approveWithdrawalRequest, deleteWithdrawalRequest, getUserWithdrawalhistory } from "../../redux/features/withdrawal/withdrawalSlice";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";
import { IOSSwitch } from "../../pages/dashboard/Profile";
import { tokens } from "../../theme";
import { getSingleUserBalanceAfterTrade } from "../../redux/features/auth/authSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const WithdrawalDetails = ({ open, handleClose }) => {
  const size = UseWindowSize();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();


  const { withdrawal } = useSelector((state) => state.withdrawal);

  const { user, conversionRate,singleUser } = useSelector((state) => state.auth);

  // Function to get the URL by the crypto name
  const getCryptoImageUrl = (cryptoName) => {
    const crypto = CryptoImages.find((image) => image.name === cryptoName);
    return crypto ? crypto.url : "URL not found";
  };



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
    ...prevState,        // Spread the previous state
    [name]: isChecked,   // Update the specific switch's state
  }));
  
  setTimeout(() => {
    handleFormSubmit(name, isChecked);
  }, 600); 
};



  const handleFormSubmit = async (switchName) => {

    let status;
    if (switchName === "switch1") {
      status = "APPROVED";
      
    }
    if (switchName === "switch2") {
      status = "PROCESSING";
     
    }
    if (switchName === "switch3") {
      status = "NOT-APPROVED";
     
    }
    if (switchName === "switch4") {
      status = "PENDING";
     
    }
    
    const id = withdrawal?._id;

    const userData = {
      status,
      amount: withdrawal?.amount,
      userId: withdrawal?.userId,
      typeOfWithdrawal: withdrawal?.typeOfWithdrawal
    }

    // console.log(id, userData)

    handleClose()
    await dispatch(approveWithdrawalRequest({ id, userData }));
    await dispatch(adminGetUserWithdrawalhistory(singleUser?._id));
    await dispatch(getSingleUserBalanceAfterTrade(singleUser?._id));
    dispatch(getAllAdminTotalCounts());

  };


  
 // Delete History Drawer
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

  handleClose();

 const id = selectedDepositRequestID.requestID;
 await dispatch(deleteWithdrawalRequest({ id }));

 if(user?.role === "admin") {
  dispatch(adminGetUserWithdrawalhistory(singleUser?._id));
  dispatch(getAllAdminTotalCounts());
 }
 else  {
  dispatch(getUserWithdrawalhistory());

 }


};



  return (
    <>
    <Modal open={open} onClose={handleClose}>
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
          <Stack direction={"row"} spacing={1}  alignItems={"center"}
          >
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
                  withdrawal?.method === "Bank"
                    ? BankLogoImg
                    : withdrawal?.methodIcon
                }
                alt={withdrawal?.method}
                width={30}
              />
            </Stack>
            <Typography variant="h6" fontWeight={"600"}>
              {withdrawal?.method} Withdrawal
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton
            size="small"
              sx={{ border: "2px solid darkgrey" }}
              onClick={() => {
                setSelectedDepositRequestID({
                  requestID: withdrawal?._id,
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
              sx={{ border: "2px solid darkgrey"  }}
              onClick={handleClose}
            >
              <X size={20} />
            </IconButton>
           
            </Stack>
           
        </Stack>

        <Stack>
          <Typography fontWeight={"600"}>Transaction Id:</Typography>
          <Typography>ID-{withdrawal?._id}</Typography>
        </Stack>

        <Divider />

        <Stack>
          <Typography fontWeight={"600"}>Date:</Typography>
          <Typography>
            {new Date(withdrawal?.createdAt).toLocaleString("en-US", {
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

        <Stack display={withdrawal?.method === "Bank" ? "none" : "flex"}>
          <Typography fontWeight={"600"}>Bitcoin Wallet:</Typography>
          <Typography>{withdrawal?.walletAddress}</Typography>
        </Stack>

        <Divider
          sx={{ display: withdrawal?.method === "Bank" ? "none" : "block" }}
        />

        <Stack
          spacing={1.5}
          display={withdrawal?.method === "Bank" ? "flex" : "none"}
        >
          <Stack>
            <Typography fontWeight={"600"}>Bank Name:</Typography>
            <Typography>{withdrawal?.bankName}</Typography>
          </Stack>

          <Divider />
          <Stack>
            <Typography fontWeight={"600"}>Account Number:</Typography>
            <Typography>{withdrawal?.bankAccount}</Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography fontWeight={"600"}>Routing Number:</Typography>
            <Typography>{withdrawal?.routingCode}</Typography>
          </Stack>

          <Divider />
        </Stack>

        <Stack>
          <Typography fontWeight={"600"}>Withdrawal Amount:</Typography>
          <Typography>
            -
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate?.code,
                  ...(withdrawal?.amount * conversionRate?.rate > 9999999
                    ? { notation: "compact" }
                    : {}),
                }).format(withdrawal?.amount * conversionRate?.rate)
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code,
                  ...(withdrawal?.amount > 9999999
                    ? { notation: "compact" }
                    : {}),
                }).format(withdrawal?.amount)}
          </Typography>
        </Stack>

        <Divider />

        <Stack>
          <Typography fontWeight={"600"}>Status:</Typography>
          <Typography>{withdrawal?.status}</Typography>
        </Stack>

        <Divider />

        <Button onClick={handleClose} variant="contained">
          Close
        </Button>

        {user?.role === "admin" && (
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
                          Approve Withdrawal
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch1}
                        onChange={handleSwitchChange}
                        name="switch1"
                      />
                    </Stack>

                    
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
                        <SpinnerBall size={28} color="dodgerblue" />
                        <Typography variant="body1" fontWeight={500}>
                          Set Withdrawal to processing
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch2}
                        onChange={handleSwitchChange}
                        name="switch2"
                      />
                    </Stack>

                    
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
                  display={withdrawal?.status === "NOT-APPROVED" ? "none" : "block"}
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

                  </Stack>
                </Box>
              </Box>
            </>
          )}



      </Stack>
    </Modal>


    <Dialog
        open={openDeleteDepositRequestDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this Withdrawal History `}
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

export default WithdrawalDetails;
