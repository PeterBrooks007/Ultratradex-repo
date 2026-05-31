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
import { adminApproveId, adminApproveResidency } from "../../../../redux/features/auth/authSlice";

const ResidencyApprovalDrawer = ({
  open,
  handleClose,
  handleOpen,
  residencyApprovalDrawerLoader,
  setResidencyApprovalDrawerLoade,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (residencyApprovalDrawerLoader) {
      const timer = setTimeout(() => {
        setResidencyApprovalDrawerLoade(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [residencyApprovalDrawerLoader, setResidencyApprovalDrawerLoade]);

  // const [isEditing, setIsEditing] = useState(false);


  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState({
    switch1: singleUser?.isResidencyVerified === "VERIFIED" ? true : false,
    switch3: singleUser?.isResidencyVerified === "NOT VERIFIED" ? true : false,
    switch4: singleUser?.isResidencyVerified === "PENDING" ? true : false,
  });

  useEffect(() => {
    setChecked({
      switch1: singleUser?.isResidencyVerified === "VERIFIED" ? true : false,
      switch3: singleUser?.isResidencyVerified === "NOT VERIFIED" ? true : false,
      switch4: singleUser?.isResidencyVerified === "PENDING" ? true : false,
    })
  },[singleUser?.isResidencyVerified])



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

    await dispatch(adminApproveResidency({ id, userData }));

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
        {residencyApprovalDrawerLoader || isSemiLoading ? (
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
                  Residency Approval
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
                Residency Approval
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
                    User Residency Approval
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
                       click the button to view uploaded documet
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography>View Uploaded document</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleOpenProof}
                      >
                        View document
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
                          Approve User residency
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked.switch1}
                        onChange={handleSwitchChange}
                        name="switch1"
                      />
                    </Stack>

                    <Typography>
                      Please note this will approve the user residency
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
                      Please note this will Dissapprove the user uploaded document and ask user to re-upload another document
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
            <Typography variant="h6">Uploaded IDs</Typography>
            <XCircle size={38} onClick={handleCloseProof} />
          </Stack>
          
          <Box>
          <img src={singleUser?.residencyVerificationPhoto || ""} alt="" width={500} height={"auto"} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ResidencyApprovalDrawer;
