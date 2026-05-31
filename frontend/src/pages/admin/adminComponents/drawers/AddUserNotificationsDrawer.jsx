import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Pen, X } from "@phosphor-icons/react";

import { useEffect, useState } from "react";

import UseWindowSize from "../../../../hooks/UseWindowSize.jsx";
// import DepositHistory from "../DepositHistory.jsx";
// import DepositProof from "../../../../dialogs/DepositProof.jsx";
import { tokens } from "../../../../theme.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // U
import { addNotification, adminUpdateUserNotification } from "../../../../redux/features/notifications/notificationsSlice.js";

const AddUserNotificationsDrawer = ({
  open,
  handleClose,
  handleOpen,
  addUserNotificationLoader,
  setAddUserNotificationLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const size = UseWindowSize();

  const [selectedWallet, setSelectedWallet] = useState("history");

  const { singleUser } = useSelector((state) => state.auth);

  const {isSemiLoading, selectedNotification } = useSelector((state) => state.notifications);

  // const [selectedWalletImg, setSelectedWalletImg] = useState(0);

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let timer;
    if (isConnecting) {
      timer = setTimeout(() => {
        setIsConnecting(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);

  useEffect(() => {
    if (addUserNotificationLoader) {
      const timer = setTimeout(() => {
        setAddUserNotificationLoader(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [addUserNotificationLoader, setAddUserNotificationLoader]);

  const initialState = {
    title: "",
    message: "",
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
    title: yup
      .string()
      .sanitize()
      .required("Title is required")
      // .matches(/^[a-zA-Z]+$/, "First name must only contain letters")
      .max(40, "Title cannot exceed 40 characters"),
    message: yup
      .string()
      .sanitize()
      .required("Messages required")
      // .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
      .max(60, "Message cannot exceed 60 characters"),

  });

  const [formData, setFormData] = useState(initialState);





  const handleFormSubmit = async (values) => {
    if (
      !values.title ||
      !values.message 
    ) {
      return toast.error("All fields are required");
    }
    const searchWord = "Support Team";

    const formData = {
      userId: id,
      notificationData: {
        from: searchWord,
        title: values.title,
        message: values.message,
      },
    };

    // console.log(formData);

    await dispatch(addNotification(formData));
    await handleClose();
    
  };


  return (
    <>
      <Drawer
        anchor={size.width > 899 ? "right" : "bottom"}
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            height:
              size.width > 899
                ? "100%" // Full height for desktop (right anchor)
                : `${
                    selectedWallet &&
                    selectedWallet !== "enteramount" &&
                    selectedWallet !== "allWallet" &&
                    selectedWallet !== "Bank"
                      ? "100%"
                      : "100%"
                  }`,
            width: size.width > 899 ? 450 : "100%",
            // borderRadius:
            //   size.width > 899 ? "30px 0px 0px 30px" : "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            // borderTop: `${size.width < 899 && "1px solid grey"}`,
            borderLeft: `${size.width > 899 && "1px solid grey"}`,
            transition: "height 2s ease",
          },
        }}
      >
        {addUserNotificationLoader || isSemiLoading ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
            <Stack spacing={1} p={"15px 15px 10px 15px"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"5px 5px"}
                alignItems={"center"}
              >
                <IconButton>
                  <Pen size={24} weight="fill" />
                </IconButton>{" "}
                <Typography fontWeight={"600"}>
                Add Notifications to User
                </Typography>
                <X size={20} weight="bold" onClick={handleClose} />
              </Stack>
            </Stack>
            <Box mx={"-15px"}>
              <Divider />
            </Box>

            <Stack justifyContent={"center"} alignItems={"center"} mt={5}>
              <CircularProgress size={22} />
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "history" ? 1 : 0,
                visibility: selectedWallet === "history" ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Box m={1} height={"100%"} overflow={"auto"}>
                <Stack spacing={1} p={"0 15px 10px 0px"}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    p={"5px 0px"}
                    alignItems={"center"}
                  >
                    <IconButton>
                      <Pen size={24} weight="fill" />
                    </IconButton>
                    <Typography fontWeight={"600"}>
                      Add Notifications to User
                    </Typography>
                    <IconButton onClick={handleClose}>
                      <X size={20} weight="bold" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Box mt={9} height={"100%"} overflow={"auto"} pb={10}>
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
                <Stack spacing={2} m={2}>
                <Stack spacing={2} width={"100%"}>
                        <TextField
                          label="Title"
                          variant="outlined"
                          fullWidth
                          size="normal"
                          width={"50%"}
                          name="title"
                          value={values.title}
                          error={
                            !!touched.title &&
                            !!errors.title
                          }
                          helperText={
                            touched.title && errors.title
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                          }}
                          inputProps={{ maxLength: 41 }}
                        />

                        <TextField
                          label="Message"
                          variant="outlined"
                          fullWidth
                          size="normal"
                          name="message"
                          value={values.message}
                          error={!!touched.message && !!errors.message}
                          helperText={touched.message && errors.message}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                          }}
                          inputProps={{ maxLength: 61 }}
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
                          disabled={isSemiLoading && true}
                        >
                          {isSemiLoading ? (
                            <CircularProgress size={28} />
                          ) : (
                            "Add Notification"
                          )}
                        </Button>
                      </Stack>
               
                </Stack>
              </form>
                            )}
            </Formik>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default AddUserNotificationsDrawer;
