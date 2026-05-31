import { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
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
  Paper,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { adminAddGiftReward, getAllCoins } from "../../../../redux/features/auth/authSlice";
import { adminAddTradeHistoryToUser, adminGetUserDeposithistory } from "../../../../redux/features/deposit/depositSlice";
import { toast } from "react-toastify";

const AdminAddRewardToUserDrawer = ({
  open,
  handleClose,
  handleOpen,
  adminAddRewardToUserLoader,
  setAdminAddRewardToUserLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isLoading, allCoins } = useSelector((state) => state.auth);

  
  // useEffect(() => {
  //   if(!isLoading && allCoins.length === 0) {
  //     dispatch(getAllCoins());
  //   }
  // }, [isLoading, dispatch, allCoins.length]);



  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(true);
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  const elevation = theme.palette.mode === "light" ? 1 : 0;



  useEffect(() => {
    if (adminAddRewardToUserLoader) {
      const timer = setTimeout(() => {
        setAdminAddRewardToUserLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [adminAddRewardToUserLoader, setAdminAddRewardToUserLoader]);

  const initialState = {
    amount: "",
    subject: "",
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
    amount: yup
      .number()
      .typeError("amount must be a number")
      .required("amount is required"),
    subject: yup
      .string()
      .sanitize()
      .required("subject required")
      .max(50, "subject cannot exceed 50 characters"),
      message: yup
      .string()
      .sanitize()
      .required("message required")
      .max(200, "message cannot exceed 200 characters"),
    
  
  });


  const [profile, setProfile] = useState(initialState);

  const saveProfile = async (values) => {
    const formData = {
     ...values,
     
    } 

    // console.log(formData)

    const id = singleUser?._id;

    handleClose()
    await dispatch(adminAddGiftReward({id, formData}));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "550px" },
        },
      }}
    >
      {adminAddRewardToUserLoader || isSemiLoading ? (
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
              Add Deposit History
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
                Add Gift Reward
              </Typography>
            </Toolbar>
          </AppBar>

          <Box>
            <Stack
              component={Paper}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              p={2}
            >
              <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
                <Typography variant="body1" fontWeight={"bold"}>
                Add gift reward to this user
                </Typography>
                {/* <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#009e4a", color: "white" }}
                  onClick={() => setIsEditing(true)}
                >
                  Add Deposit History
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

              <Formik
                onSubmit={saveProfile}
                initialValues={profile}
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
                    <Stack spacing={2} height={"100%"} mt={3} mb={3}>


                    <Stack direction={"row"} spacing={2}>
                     
                     <TextField
                       label="Gift Amount"
                       variant="outlined"
                       fullWidth
                       size="large"
                       name="amount"
                       value={values?.amount}
                       error={!!touched.amount && !!errors.amount}
                       helperText={touched.amount && errors.amount}
                       onBlur={handleBlur}
                       onChange={handleChange}
                       disabled={!isEditing && true}
                     />
                    
                   </Stack>
                     
                      <Stack direction={"row"} spacing={2}>
                    <TextField
                    
                          label="Title Subject"
                          variant="outlined"
                          fullWidth
                          size="large"
                          name="subject"
                          value={values?.subject}
                          error={!!touched.subject && !!errors.subject}
                          helperText={touched.subject && errors.subject}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing && true}
                        />
                      </Stack>

                      
      
                    
                      <Stack direction={"row"} spacing={2}>
                      <TextField
                      multiline
                      rows={4}
                          label="Message"
                          variant="outlined"
                          fullWidth
                          size="large"
                          name="message"
                          value={values?.message}
                          error={!!touched.message && !!errors.message}
                          helperText={touched.message && errors.message}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing && true}
                        />
                      
                       
                      </Stack>

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        // size="small"
                        sx={{
                          fontSize: "16px",
                          fontWeight: "500",
                          backgroundColor: "#009e4a",
                          color: "white",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: "darkgreen",
                          },
                        }}
                        disabled={!isEditing && true}
                      >
                        {/* {isLoading ? <CircularProgress size={28} /> : "Update Details"} */}
                        Add Gift Reward
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Stack>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default AdminAddRewardToUserDrawer;
