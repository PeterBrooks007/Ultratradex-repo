import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import EditProfile from "../EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { adminDebitTradeBalance, adminFundTradeBalance } from "../../../../redux/features/auth/authSlice";

const DebitTradeBalanceDrawer = ({
  open,
  handleClose,
  handleOpen,
  debitTradeBalanceLoader,
  setDebitTradeBalanceLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const { singleUser } = useSelector((state) => state.auth);

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  useEffect(() => {
    if (debitTradeBalanceLoader) {
      const timer = setTimeout(() => {
        setDebitTradeBalanceLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [debitTradeBalanceLoader, setDebitTradeBalanceLoader]);

  const initialState = {
    amount: "",
   
    
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
   
  });

  const [profile, setProfile] = useState(initialState);

  const saveProfile = async (values) => {
    const userData = values;

    // console.log(userData)

    await dispatch(adminDebitTradeBalance({ id, userData }));
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
      {debitTradeBalanceLoader ? (
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
                Debit Trade Balance
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
                Debit Trade Balance
              </Typography>
            </Toolbar>
          </AppBar>

          <Box>
            <Stack
              component={Paper}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              p={3}
            >
              <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
                <Typography variant="body1" fontWeight={"bold"}>
                  Trade Balance 
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#009e4a", color: "white" }}
                  onClick={() => setIsEditing(true)}
                >
                  Debit Balance
                </Button>
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
                      <FormLabel>
                        Current Trade Balance:{" "}
                        <span style={{color: "springgreen"}}>
                         
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
                            ...(singleUser?.balance > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(singleUser?.balance)}{" "}
                        </span>
                      </FormLabel>
                      <Stack direction={"row"} spacing={2}>
                        <TextField
                          label="Amount to Remove"
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
                        Debit Balance
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

export default DebitTradeBalanceDrawer;
