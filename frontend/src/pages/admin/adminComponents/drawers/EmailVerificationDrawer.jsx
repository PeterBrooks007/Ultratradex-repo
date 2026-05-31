import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
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

  XCircle,
} from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";

import { IOSSwitch } from "../../../dashboard/Profile";
import { useParams } from "react-router-dom";
import { adminVerifyEmail } from "../../../../redux/features/auth/authSlice";

const EmailVerificationDrawer = ({
  open,
  handleClose,
  handleOpen,
  emailVerificationDrawerLoader,
  setEmailVerificationDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (emailVerificationDrawerLoader) {
      const timer = setTimeout(() => {
        setEmailVerificationDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [emailVerificationDrawerLoader, setEmailVerificationDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);


  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState(singleUser?.isEmailVerified);

  useEffect(() => {
    if(singleUser?.isEmailVerified) {
      setChecked(singleUser?.isEmailVerified);
    }
  }, [singleUser?.isEmailVerified]);
  

// Handle switch change
const handleSwitchChange = (event) => {
  const isChecked = event.target.checked;
  setChecked(isChecked); // Update the checked state directly

  setTimeout(() => {
    handleFormSubmit(); 
  }, 600); 
};



  const handleFormSubmit = async () => {

    // console.log(id, userData)

    await dispatch(adminVerifyEmail(id));

  };

  const [openProof, setOpenProof] = useState(false);
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
        {emailVerificationDrawerLoader || isSemiLoading ? (
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
                Email Verification
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
                Email Verification
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
                 Verify Email Address
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
                        {singleUser?.isEmailVerified ? <CheckCircle size={28} color="springgreen" /> : <XCircle size={28} color="red" />}
                        

                        <Typography variant="body1" fontWeight={500}>
                          {singleUser?.isEmailVerified ? "User Email is Verified" : "Verify User Email"}
                          
                        </Typography>
                      </Stack>

                      <IOSSwitch
                        checked={checked}
                        onChange={handleSwitchChange}
                        name="switch1"
                      />
                    </Stack>

                    <Typography>
                     click to verify or not verify this user
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
          {/* <img src={depositProof} alt="" width={500} height={"auto"} /> */}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EmailVerificationDrawer;
