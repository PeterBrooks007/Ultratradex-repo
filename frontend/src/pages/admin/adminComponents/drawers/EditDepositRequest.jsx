import { useEffect, useState } from "react";
// import { Formik } from "formik";
// import * as yup from "yup";
// import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,

  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Modal,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,

  CheckCircle,
  Info,

  XCircle,
} from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";

import { IOSSwitch } from "../../../dashboard/Profile";
import { approveDepositRequest } from "../../../../redux/features/deposit/depositSlice";
import { getAllAdminTotalCounts } from "../../../../redux/features/totalCounts/totalCountsSlice";

const EditDepositRequest = ({
  open,
  handleClose,
  handleOpen,
  depositRequestDrawerLoader,
  setDepositRequestDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { deposit } = useSelector((state) => state.deposit);

  useEffect(() => {
    if (depositRequestDrawerLoader) {
      const timer = setTimeout(() => {
        setDepositRequestDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [depositRequestDrawerLoader, setDepositRequestDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);

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
  const {
    firstname,
    lastname,
    amount,
    method,
    photo,
    depositProof,
    typeOfDeposit,
  } = formData;

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


  // // Handle switch change
  // const handleSwitchChange = (event) => {
  //   setChecked(event.target.checked);
  //   handleFormSubmit();

  // };

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

  // // Submit logic
  // const handleSubmit = (switchName, switchValue) => {
  //   console.log(`Switch ${switchName} was toggled to ${switchValue}`);
  //   // Add form submission logic here
  // };

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
      userId: deposit?.userId?._id,
      typeOfDeposit: deposit?.typeOfDeposit
    }

    // console.log(id, userData)

    await dispatch(approveDepositRequest({ id, userData }));
    dispatch(getAllAdminTotalCounts());

  };

  const [openProof, setOpenProof] = useState(false);
  const handleOpenProof = () => setOpenProof(true);
  const handleCloseProof = () => setOpenProof(false);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "550px" },
          },
        }}
      >
        {depositRequestDrawerLoader ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            <AppBar
              position="sticky"
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "lightgrey"
                    : colors.dashboardbackground[100]
                }`,
                top: 0,
                height: "56px",
              }}
              color="grey"
            >
              <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
                <IconButton
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2, backgroundColor: "grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Edit Deposit Request
                </Typography>
              </Toolbar>
            </AppBar>

            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
              width={"100%"}
            >
              <CircularProgress />
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            <AppBar
              position="sticky"
              sx={{
                backgroundColor: `${
                  theme.palette.mode === "light"
                    ? "lightgrey"
                    : colors.dashboardbackground[100]
                }`,
                top: 0,
                height: "56px",
              }}
              color="grey"
            >
              <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
                <IconButton
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2, backgroundColor: "grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Edit Deposit Request
                </Typography>
              </Toolbar>
            </AppBar>

            <Box p={2}>
              {/* <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
              <Typography variant="body1" fontWeight={"bold"}>
                Edit this Trader
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#009e4a", color: "white" }}
                onClick={() => setIsEditing(true)}
              >
                Edit Trader
              </Button>
            </Stack>

            <Divider flexItem /> */}

              <Stack
                direction={"row"}
                alignItems={"center"}
                p={"10px"}
                spacing={1}
              >
                <img
                  src={photo}
                  alt="profileimage"
                  width={"120px"}
                  height={"120px"}
                  style={{
                    border: "4px solid grey",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <Stack>
                  <Typography variant="h6" fontWeight={"600"}>
                    {firstname} {lastname}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={"500"}
                    color={"springgreen"}
                  >
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      ...(amount > 999999 ? { notation: "compact" } : {}),
                    }).format(amount)}{" "}
                    <span style={{ color: "grey" }}>deposited</span>
                  </Typography>

                  <Typography variant="h6" color={"orange"}>
                    {method} Method
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

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
                  <Stack spacing={2.5}>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={0.5}
                      color={"violet"}
                    >
                      <Info size={28} />
                      <Typography variant="body1" fontWeight={600}>
                        {" "}
                        {typeOfDeposit} Account Deposit
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
                        <CheckCircle size={28} color="springgreen" />
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
                        <CheckCircle size={28} color="springgreen" />
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
                      user&apos;s Traderade balance
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
            </Box>
          </Box>
        )}
      </Drawer>

      <Modal
        open={openProof}
        onClose={handleCloseProof}
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
            <IconButton onClick={handleCloseProof}>
            <XCircle size={38}  />
            </IconButton>
          </Stack>
          
          <Box>
          <img src={depositProof} alt="" width={500} height={"auto"} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditDepositRequest;
