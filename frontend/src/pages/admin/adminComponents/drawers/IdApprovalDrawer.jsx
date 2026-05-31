import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
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
import { useParams } from "react-router-dom";
import { adminApproveId } from "../../../../redux/features/auth/authSlice";

const IdApprovalDrawer = ({
  open,
  handleClose,
  handleOpen,
  idApprovalDrawerLoader,
  setIdApprovalDrawerLoade,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (idApprovalDrawerLoader) {
      const timer = setTimeout(() => {
        setIdApprovalDrawerLoade(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [idApprovalDrawerLoader, setIdApprovalDrawerLoade]);

  // const [isEditing, setIsEditing] = useState(false);


  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState({
    switch1: singleUser?.isIdVerified === "VERIFIED" ? true : false,
    switch3: singleUser?.isIdVerified === "NOT VERIFIED" ? true : false,
    switch4: singleUser?.isIdVerified === "PENDING" ? true : false,
  });

  useEffect(() => {
    setChecked({
      switch1: singleUser?.isIdVerified === "VERIFIED" ? true : false,
      switch3: singleUser?.isIdVerified === "NOT VERIFIED" ? true : false,
      switch4: singleUser?.isIdVerified === "PENDING" ? true : false,
    })
  },[singleUser?.isIdVerified])



// Handle switch change
const handleSwitchChange = (event) => {
  const { name, checked: isChecked } = event.target;

    // Prevent toggling if the switch is already true
  if (checked[name] === true) {
    return; // Exit early
  }

  setChecked((prevState) => ({
    ...prevState,        // Spread the previous state
    [name]: isChecked,   // Update the specific switch's state
  }));

  setTimeout(() => {
    handleFormSubmit(name, isChecked);
  }, 400); 
  
};


  const handleFormSubmit = async (switchName) => {

    let status;
    if (switchName === "switch1") {
      status = "VERIFIED";
    }
    if (switchName === "switch3") {
      status = "NOT VERIFIED";
    }

    if (switchName === "switch4") {
      status = "PENDING";
    }
    
    const userData = {
      status,     
    }

    // console.log(id, userData)

    await dispatch(adminApproveId({ id, userData }));

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
        {idApprovalDrawerLoader || isSemiLoading ? (
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
                  sx={{ mr: 2, border: "1px solid grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  ID Approval
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
                  sx={{ mr: 2, border: "1px solid grey" }}
                  onClick={handleClose}
                  size="small"
                >
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Identity Approval
                </Typography>
              </Toolbar>
            </AppBar>

            <Box p={2}>
       

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  pb={2}
                  alignItems={"center"}
                >
                  <Typography variant="body1" fontWeight={"bold"}>
                    User Identity Approval
                  </Typography>
                  {/* <Button startIcon={<PlusCircle size={20} />}  size="small" variant="outlined" onClick={handleOpenAddWalletModal}>
                    Add Wallet
                  </Button> */}
                </Stack>

                <Divider flexItem />

                  <Stack
                  direction={"row"}
                  alignItems={"center"}
                  p={"10px 0"}
                  spacing={1}
                  display={{ xs: "flex", md: "flex" }}
                >
                  <Avatar
                    src={singleUser?.photo}
                    alt="profile picture"
                    sx={{ width: "60px", height: "60px" }}
                  />
                  <Stack>
                    <Typography variant="h6" fontWeight={"600"}>
                      {singleUser?.firstname} {singleUser?.lastname}
                    </Typography>
                    <Typography variant="caption">
                      {singleUser?.email}
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
                       click the button to view IDs
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography>View Uploaded IDs</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleOpenProof}
                      >
                        View ID Card
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
                          Approve User ID
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch1}
                        onChange={handleSwitchChange}
                        name="switch1"
                      />
                    </Stack>

                    <Typography>
                      Please note this will approve the user and user can login to dashboard
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
                      Please note this will Dissapprove the user Id and ask user to re-upload id
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
            maxWidth: { xs: "95%", sm: "70%", md: 540 },
            maxHeight: "90%",
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
            <Typography variant="h6">Uploaded IDs</Typography>
            <XCircle size={38} onClick={handleCloseProof} />
          </Stack>

          <Divider />

          <Stack spacing={5} mt={2}>
            <Stack spacing={0.5}>
            <Typography fontWeight={700}>Front ID</Typography>
            <img src={singleUser?.idVerificationPhoto?.front} alt="" width={"100%"} />
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
            <Typography fontWeight={700}>Back ID</Typography>
            <img src={singleUser?.idVerificationPhoto?.back} alt="" width={"100%"} />
            </Stack>
          </Stack>
          
          <Box>
          {/* <img src={depositProof} alt="" width={500} height={"auto"} /> */}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default IdApprovalDrawer;
