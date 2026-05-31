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
import EditProfile from "../EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import {
  adminFundTradeBalance,
  getAllCoins,
} from "../../../../redux/features/auth/authSlice";
import {
  adminAddTradeHistoryToUser,
  adminGetUserDeposithistory,
} from "../../../../redux/features/deposit/depositSlice";
import { toast } from "react-toastify";

const AdminAddHistoryToUserDrawer = ({
  open,
  handleClose,
  handleOpen,
  adminAddHistoryToUserLoader,
  setAdminAddHistoryToUserLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isLoading, allCoins } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && allCoins.length === 0) {
      dispatch(getAllCoins());
    }
  }, [isLoading, dispatch, allCoins.length]);

  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(true);
  const { singleUser } = useSelector((state) => state.auth);

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  useEffect(() => {
    if (adminAddHistoryToUserLoader) {
      const timer = setTimeout(() => {
        setAdminAddHistoryToUserLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [adminAddHistoryToUserLoader, setAdminAddHistoryToUserLoader]);

  const initialState = {
    // typeOfDeposit: "",
    // method: "",
    amount: "",
    status: "APPROVED",
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
    // typeOfDeposit: yup
    //   .string()
    //   .sanitize()
    //   .required("typeOfDeposit required")
    //   .max(50, "typeOfDeposit cannot exceed 50 characters"),
    // method: yup
    //   .string()
    //   .sanitize()
    //   .required("method required")
    //   .max(50, "method cannot exceed 50 characters"),
    amount: yup
      .number()
      .typeError("amount must be a number")
      .required("amount is required"),
    status: yup
      .string()
      .sanitize()
      .required("status required")
      .max(50, "status cannot exceed 50 characters"),
  });

  const [selectedCoin, setSelectedCoin] = useState(null);

  const [type, setType] = useState("Trade");

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const [profile, setProfile] = useState(initialState);

  const saveProfile = async (values) => {
    if (!selectedCoin) {
      return toast.error("Please select a wallet");
    }

    if (!type) {
      return toast.error("Please select a type of deposit");
    }

    const formData = {
      ...values,
      status: values?.status,
      userId: singleUser?._id,
      typeOfDeposit: type,
      method: selectedCoin?.name,
      methodIcon: selectedCoin?.image,
    };

    // console.log(formData)

    handleClose();
    await dispatch(adminAddTradeHistoryToUser(formData));
    await dispatch(adminGetUserDeposithistory(singleUser?._id));
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
      {adminAddHistoryToUserLoader ? (
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
                Add Deposit History
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
                  Add Deposit History to this user
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
                      {/* <FormLabel>
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
                      </FormLabel> */}
                      <Stack direction={"row"} spacing={2}>
                        {/* <TextField
                          label="Type Of Deposit"
                          variant="outlined"
                          fullWidth
                          size="large"
                          name="typeOfDeposit"
                          value={values?.typeOfDeposit}
                          error={!!touched.typeOfDeposit && !!errors.typeOfDeposit}
                          helperText={touched.typeOfDeposit && errors.typeOfDeposit}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing && true}
                        /> */}

                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Age"
                            onChange={handleChangeType}
                          >
                            <MenuItem value={"Trade"}>Trade Deposit</MenuItem>
                            <MenuItem value={"Wallet"}>Wallet Deposit</MenuItem>
                          </Select>
                        </FormControl>

                        {/* <TextField
                          label="method"
                          variant="outlined"
                          fullWidth
                          size="large"
                          name="method"
                          value={values?.method}
                          error={!!touched.method && !!errors.method}
                          helperText={touched.method && errors.method}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing && true}
                        /> */}
                      </Stack>

                      <Stack mt={2} mx={2}>
                        <form onSubmit={() => {}}>
                          <Autocomplete
                            id="country-select-demo"
                            sx={{ width: "100%" }}
                            options={allCoins}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) =>
                              setSelectedCoin(newValue)
                            }
                            renderOption={(props, option) => {
                              const { key, ...optionProps } = props;
                              return (
                                <Box
                                  key={key}
                                  component="li"
                                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                  {...optionProps}
                                >
                                  <img
                                    loading="lazy"
                                    width="30"
                                    srcSet={option.image}
                                    src={option.image}
                                    alt=""
                                  />
                                  {option.name} ({option.symbol})
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search wallet"
                                slotProps={{
                                  htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  },
                                }}
                              />
                            )}
                          />
                          {/* <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Select
      </Button> */}
                        </form>
                      </Stack>

                      <Stack direction={"row"} spacing={2}>
                        <TextField
                          label="amount"
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
                        {/* <TextField
                          label="status"
                          variant="outlined"
                          fullWidth
                          size="large"
                          name="status"
                          value={values?.status}
                          error={!!touched.status && !!errors.status}
                          helperText={touched.status && errors.status}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing && true}
                        /> */}

                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values?.status}
                            name="status"
                            label="status"
                            onChange={handleChange}
                            error={!!touched.status && !!errors.status}
                            helperText={touched.status && errors.status}
                            onBlur={handleBlur}
                          >
                            <MenuItem value={"APPROVED"}>APPROVED</MenuItem>
                            <MenuItem value={"NOT-APPROVED"}>
                              NOT-APPROVED
                            </MenuItem>
                            <MenuItem value={"PENDING"}>PENDING</MenuItem>
                            <MenuItem value={"PROCESSING"}>PROCESSING</MenuItem>
                          </Select>
                        </FormControl>
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
                        Add History
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

export default AdminAddHistoryToUserDrawer;
