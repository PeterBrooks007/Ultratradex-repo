import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
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
import {
  adminActivateDemoAccount,
  adminSetUserAutoTrade,
  adminSetUserWithdrawalLock,
  adminVerifyEmail,
} from "../../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify";

const WithdrawalLockDrawer = ({
  open,
  handleClose,
  handleOpen,
  withdrawalLocksDrawerLoader,
  setWithdrawalLocksDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (withdrawalLocksDrawerLoader) {
      const timer = setTimeout(() => {
        setWithdrawalLocksDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [withdrawalLocksDrawerLoader, setWithdrawalLocksDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);

  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState(
    singleUser?.withdrawalLocked?.isWithdrawalLocked
  );

  useEffect(() => {
    if (singleUser?.withdrawalLocked?.isWithdrawalLocked) {
      setChecked(singleUser?.withdrawalLocked?.isWithdrawalLocked);
    }
  }, [singleUser?.withdrawalLocked?.isWithdrawalLocked]);

  // Handle switch change
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked); // Update the checked state directly
  };

  const initialState = {
    lockCode: singleUser?.withdrawalLocked?.lockCode || "",
    lockSubject: singleUser?.withdrawalLocked?.lockSubject || "",
    lockComment: singleUser?.withdrawalLocked?.lockComment || "",
  };

  // Helper function to decode HTML entities
  function decodeEntities(encodedString) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = encodedString;
    return textarea.value;
  }

  // Custom yup method to sanitize and check for malicious input
  yup.addMethod(yup.string, "sanitize", function () {
    return this.test("sanitize", "Invalid input detected!", function (value) {
      const decodedValue = decodeEntities(value);

      const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
      if (sanitizedValue !== decodedValue) {
        // toast.error('Input contains invalid or malicious content!');
        return false; // Fail the validation
      }
      return true; // Pass the validation
    });
  });

  const userSchema = yup.object().shape({
    lockCode: yup
      .number()
      .typeError("Lock Code must be a number")
      .required("Lock Code is required"),
    lockSubject: yup
      .string()
      .sanitize()
      .required("Lock Subject required")
      .max(50, "Lock Subject cannot exceed 50 characters"),
    lockComment: yup
      .string()
      .sanitize()
      .required("Lock Comment required")
      .max(200, "Lock Comment cannot exceed 200 characters"),
  });

  const [formData, setFormData] = useState(initialState);
  // const { currentPassword, newPassword, ConfirmPassword } = formData;

  useEffect(() => {
    if (singleUser) {
      setFormData({
        lockCode: singleUser?.withdrawalLocked?.lockCode || "",
        lockSubject: singleUser?.withdrawalLocked?.lockSubject || "",
        lockComment: singleUser?.withdrawalLocked?.lockComment || "",
      });
    }
  }, [singleUser]);

  const handleFormSubmit = async (values) => {
    setFormData(values)
    
    const userData = {
      isWithdrawalLocked: checked,
      ...values,
    };

    // console.log(id, userData)

    await dispatch(adminSetUserWithdrawalLock({ id, userData }));
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
        {withdrawalLocksDrawerLoader || isSemiLoading ? (
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
                  Withdrawal Lock
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
                  Withdrawal Lock
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
                  Set to lock or unlock user Withdrawal
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
                      {singleUser?.withdrawalLocked?.isWithdrawalLocked ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.withdrawalLocked?.isWithdrawalLocked
                          ? "Withdrawal Lock is Activated"
                          : "Activate Withdrawal Lock"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked}
                      onChange={handleSwitchChange}
                      name="switch1"
                    />
                  </Stack>

                  <Typography>
                    Click to Activate or deactivate Withadrawal Lock
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
                  <Typography>Withdrawal Lock Settings</Typography>

                  <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={formData}
                    validationSchema={userSchema}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                          <Stack direction={"row"} spacing={2}>
                            <TextField
                              label="Lock Code"
                              variant="outlined"
                              fullWidth
                              size="large"
                              name="lockCode"
                              value={values?.lockCode}
                              error={!!touched.lockCode && !!errors.lockCode}
                              helperText={touched.lockCode && errors.lockCode}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              // disabled={!isEditing && true}
                            />
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <TextField
                              label="Lock Subject"
                              variant="outlined"
                              fullWidth
                              size="large"
                              name="lockSubject"
                              value={values?.lockSubject}
                              error={
                                !!touched.lockSubject && !!errors.lockSubject
                              }
                              helperText={
                                touched.lockSubject && errors.lockSubject
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              // disabled={!isEditing && true}
                            />
                          </Stack>
                          <Stack direction={"row"} spacing={2}>
                            <TextField
                              multiline
                              rows={4}
                              label="Lock Comment"
                              variant="outlined"
                              fullWidth
                              size="large"
                              name="lockComment"
                              value={values?.lockComment}
                              error={
                                !!touched.lockComment && !!errors.lockComment
                              }
                              helperText={
                                touched.lockComment && errors.lockComment
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              // disabled={!isEditing && true}
                            />
                          </Stack>

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
                    )}
                  </Formik>
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default WithdrawalLockDrawer;
