import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,
  CheckCircle,
  Info,
  SpinnerBall,
  XCircle,
} from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { IOSSwitch } from "../../../dashboard/Profile";

import { approveWithdrawalRequest } from "../../../../redux/features/withdrawal/withdrawalSlice";
import { getAllAdminTotalCounts } from "../../../../redux/features/totalCounts/totalCountsSlice";

const EditWithdrawalRequest = ({
  open,
  handleClose,
  handleOpen,
  withdrawalRequestDrawerLoader,
  setWithdrawalRequestDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isLoading, withdrawal } = useSelector((state) => state.withdrawal);

  useEffect(() => {
    if (withdrawalRequestDrawerLoader) {
      const timer = setTimeout(() => {
        setWithdrawalRequestDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [withdrawalRequestDrawerLoader, setWithdrawalRequestDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    firstname: withdrawal?.userId?.firstname || "",
    lastname: withdrawal?.userId?.lastname || "",
    amount: withdrawal?.amount || "",
    method: withdrawal?.method || "",
    status: withdrawal?.status || "",
    photo: withdrawal?.userId?.photo || "",

    walletAddress: withdrawal?.walletAddress || "",
    bankName: withdrawal?.bankName || "",
    bankAccount: withdrawal?.bankAccount || "",
    routingCode: withdrawal?.routingCode || "",
    description: withdrawal?.description || "",
    
    // depositProof: withdrawal?.depositProof || "",
    typeOfWithdrawal: withdrawal?.typeOfWithdrawal || "",
  };

  const [formData, setFormData] = useState(initialState);
  const {
    firstname,
    lastname,
    amount,
    method,
    photo,
    walletAddress,
    bankName,
    bankAccount,
    routingCode,
    description,
    // depositProof,
    typeOfWithdrawal,
  } = formData;

  useEffect(() => {
    if (withdrawal) {
      setFormData({
        firstname: withdrawal?.userId?.firstname || "",
        lastname: withdrawal?.userId?.lastname || "",
        amount: withdrawal?.amount ?? "",
        method: withdrawal?.method || "",
        status: withdrawal?.status || "",
        photo: withdrawal?.userId?.photo || "",

        walletAddress: withdrawal?.walletAddress || "",
        bankName: withdrawal?.bankName || "",
        bankAccount: withdrawal?.bankAccount || "",
        routingCode: withdrawal?.routingCode || "",
        description: withdrawal?.description || "",


        // depositProof: withdrawal?.depositProof || "",
        typeOfWithdrawal: withdrawal?.typeOfWithdrawal || "",
      });
    }
  }, [withdrawal]);

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
      userId: withdrawal?.userId?._id,
      typeOfWithdrawal: withdrawal?.typeOfWithdrawal
    }

    // console.log(id, userData)

    await dispatch(approveWithdrawalRequest({ id, userData }));
    dispatch(getAllAdminTotalCounts());

  };


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
        {withdrawalRequestDrawerLoader ? (
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
                  Edit Withdrawal Request
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
                  Edit Withdrawal Request
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
                    fontWeight={"600"}
                    color={"springgreen"}
                  >
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      ...(amount > 999999 ? { notation: "compact" } : {}),
                    }).format(amount)}{" "}
                    <span style={{ color: "grey" }}> to withdraw</span>
                  </Typography>

                  <Typography variant="h6" color={"orange"}>
                    {method} Withdrawal
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
                      <Typography variant="body1">
                        {" "}
                        {typeOfWithdrawal} account withdrawal
                      </Typography>
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
                 <Stack
                spacing={1.5}
                // border={"1px solid grey"}
                borderRadius={"10px"}
                p={"16px 0px"}
                mx={2}
                sx={{ wordWrap: "break-word" }}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography variant="body1" fontWeight={"600"} color={"springgreen"}>
                     Withdrawal Details
                  </Typography>
                </Stack>

                <Divider />

                <Stack display={method === "Bank" ? "none" : "flex"}>
                  <Typography fontWeight={"600"}>To:</Typography>
                  <Typography>{walletAddress}</Typography>
                </Stack>

                <Divider
                  sx={{ display: method === "Bank" ? "none" : "block" }}
                />

                <Stack
                  spacing={1.5}
                  display={method === "Bank" ? "flex" : "none"}
                >
                  <Stack>
                    <Typography fontWeight={"600"}>Bank Name:</Typography>
                    <Typography>{bankName}</Typography>
                  </Stack>

                  <Divider />
                  <Stack>
                    <Typography fontWeight={"600"}>Account Number:</Typography>
                    <Typography>{bankAccount}</Typography>
                  </Stack>

                  <Divider />

                  <Stack>
                    <Typography fontWeight={"600"}>Routing Number:</Typography>
                    <Typography>{routingCode}</Typography>
                  </Stack>

                  <Divider />
                </Stack>

                <Stack>
                  <Typography fontWeight={"600"}>Withdrawal Amount:</Typography>
                  <Typography>
                   {amount}
                  </Typography>
                </Stack>

                <Divider />


                <Stack>
                  <Typography fontWeight={"600"}> Description:</Typography>
                  <Typography>
                   {description}
                  </Typography>
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
            </Box>
          </Box>
        )}
      </Drawer>

    
    </>
  );
};

export default EditWithdrawalRequest;
