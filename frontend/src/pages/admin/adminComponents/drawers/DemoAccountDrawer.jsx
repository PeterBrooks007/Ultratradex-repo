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
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";

import { IOSSwitch } from "../../../dashboard/Profile";
import { useParams } from "react-router-dom";
import { adminActivateDemoAccount, adminVerifyEmail } from "../../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const DemoAccountDrawer = ({
  open,
  handleClose,
  handleOpen,
  demoAccountDrawerLoader,
  setDemoAccountDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (demoAccountDrawerLoader) {
      const timer = setTimeout(() => {
        setDemoAccountDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [demoAccountDrawerLoader, setDemoAccountDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);

  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState(singleUser?.isDemoAccountActivated);

  const [demoBalance, setDemoBalance] = useState(singleUser?.demoBalance);

// console.log(demoBalance)

  useEffect(() => {
    if (singleUser?.isDemoAccountActivated) {
      setChecked(singleUser?.isDemoAccountActivated);
    }
  }, [singleUser?.isDemoAccountActivated]);

  // Handle switch change
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked); // Update the checked state directly
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if(!demoBalance || demoBalance < 1) {
     return toast.error("Demo Balance is required and must be greater than zero")
    }
  
    if(isNaN(demoBalance)) {
     return toast.error("Demo Balance must be a valid number")
    }


    const userData = {
      isDemoAccountActivated: checked,
      demoBalance,
    }

    // console.log(id, userData)


    await dispatch(adminActivateDemoAccount({id, userData}));
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
        {demoAccountDrawerLoader || isSemiLoading ? (
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
                  Demo Account
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
                  Demo Account
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
                  Activate and fund Demo account
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
                  <Typography variant="caption">{singleUser?.email}</Typography>
                </Stack>
              </Stack>

              <Divider />

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
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      {singleUser?.isDemoAccountActivated ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.isDemoAccountActivated
                          ? "Demo is Activated"
                          : "Activate Demo Account"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked}
                      onChange={handleSwitchChange}
                      name="switch1"
                    />
                  </Stack>

                  <Typography>Click to Activate or deactivate demo</Typography>
                </Stack>
              </Box>

              <form onSubmit={handleFormSubmit}>
              <Stack spacing={2} mt={2}>
                <TextField
                  fullWidth
                  size="medium"
                  variant="outlined"
                  type="text"
                  label="Enter Demo Balance"
                  name="demoBalance"
                  value={demoBalance}
                  onChange={(e) => setDemoBalance(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  
                  inputProps={{ maxLength: 101 }}
                />
                 <Button
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "text.primary",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: "600",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "common.white"
                    : "grey.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.whitw"
                      : "grey.800",
                },
              }}
             
              
            >
              {isSemiLoading ? (
                <CircularProgress size={22} />
              ) : (
                "Initiate Changes"
              )}
            </Button>
              </Stack>
              </form>

            </Box>
          </Box>
        )}
      </Drawer>

      
    </>
  );
};

export default DemoAccountDrawer;
