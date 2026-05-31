import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,
  Autocomplete,
  Badge,
  Box,
  Button,
  CircularProgress,
  Drawer,

  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, ArrowsClockwise, Camera, CaretRight, CheckFat, ClockClockwise } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { addWalletAddress } from "../../../../redux/features/walletAddress/walletAddressSlice";
import { getAllCoins } from "../../../../redux/features/auth/authSlice";


const AddWalletAddress = ({
  open,
  handleClose,
  handleOpen,
  walletAddressDrawerLoader,
  setWalletAddressDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isLoading, allCoins } = useSelector((state) => state.auth);


  useEffect(() => {
    if (walletAddressDrawerLoader) {
      const timer = setTimeout(() => {
        setWalletAddressDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [walletAddressDrawerLoader, setWalletAddressDrawerLoader]);


  useEffect(() => {
    if(!isLoading && allCoins.length === 0) {
      dispatch(getAllCoins());
    }
  }, [dispatch]);



  const [uploadLoading, setUploadLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const initialValuesAuto = {
    walletAddress: "",
  };

  const initialValuesManual = {
    walletName: "",
    walletSymbol: "",
    walletAddress: "",
    walletQrcode: "",
    walletPhoto: "",
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

  const userSchemaAuto = yup.object().shape({
    walletAddress: yup
      .string()
      .sanitize()
      .required("walletAddress required")
      .min(2, "walletAddress must be at least 2 characters long")
      .max(200, "walletAddress cannot exceed 200 characters"),
  });

  const userSchemaManual = yup.object().shape({
    walletName: yup
      .string()
      .sanitize()
      .required("walletName required")
      .min(2, "walletName must be at least 2 characters long")
      .max(100, "walletName cannot exceed 100 characters"),
    walletSymbol: yup
      .string()
      .sanitize()
      .required("walletSymbol required")
      .min(2, "walletSymbol must be at least 2 characters long")
      .max(50, "walletSymbol cannot exceed 50 characters"),
    walletAddress: yup
      .string()
      .sanitize()
      .required("walletAddress required")
      .min(2, "walletAddress must be at least 2 characters long")
      .max(200, "walletAddress cannot exceed 200 characters"),
    walletPhoto: yup
      .string()
      .sanitize()
      .required("walletPhoto required")
      .min(2, "walletPhoto must be at least 2 characters long")
      .max(200, "walletPhoto cannot exceed 200 characters"),
  });

  const [formDataAuto, setFormDataAuto] = useState(initialValuesAuto);

  const [formDataManual, setFormDataManual] = useState(initialValuesManual);

  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleSelectSubmit = (event) => {
    event.preventDefault();
    if (selectedCoin) {
      // Process form data (e.g., submit the selected coin)
      // console.log("Selected Coin:", selectedCoin);
    } else {
      // console.log("Please select a coin.");
    }
  };

  const handleFormSubmitAuto = async (values) => {
    // console.log(values);
    setFormDataAuto(values);

    if (!selectedCoin) {
      return toast.error("Please select a wallet");
    }

    if (!profileImage) {
      return toast.error("Please add a Wallet Qr code image");
    }

    const userData = {...values, walletName: selectedCoin?.name, walletSymbol: selectedCoin?.symbol, walletPhoto: selectedCoin?.image };

    //  console.log("form data", userData);
    //  console.log("photo", profileImage);`

    if (userData && profileImage !== null) {
      setUploadLoading(true);
      try {
        if (profileImage !== null) {
          // Check if the file is an allowed image type
          const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!validImageTypes.includes(profileImage.type)) {
            toast.error("Invalid file type. Only JPEG and PNG are allowed.");
            setUploadLoading(false);
            return;
          }

          // Check if the file size exceeds the limit
          if (profileImage.size > MAX_FILE_SIZE) {
            toast.error("File size exceeds the 5MB limit.");
            setUploadLoading(false);
            return;
          }

          // Check if the image is valid by loading it
          const imageLoadCheck = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(profileImage);
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
          });

          const isValidImage = await imageLoadCheck;
          if (!isValidImage) {
            toast.error("The file is not a valid image.");
            setUploadLoading(false);
            return;
          }

          // If all checks pass, proceed with the upload
          const formData = new FormData();
          formData.append("image", profileImage); // Use the original image
          formData.append("userData", JSON.stringify(userData));

          // Dispatch the formData including both image and userData
          await dispatch(addWalletAddress(formData));
          setFormDataAuto(initialValuesAuto);


          // console.log(formData);

          // Reset the image preview and loading state
          setUploadLoading(false);
          // handleClose();
        } else {
          toast.error("No image selected.");
          setUploadLoading(false);
        }
      } catch (error) {
        setUploadLoading(false);
        toast.error(error.message);
      }
    } else {
      setUploadLoading(false);
      toast.error("An error occurred");
    }
  };



  const handleFormSubmitManual = async (values) => {
    // console.log(values);
    setFormDataManual(values);

    if (!profileImage) {
      return toast.error("Please add a Wallet Qr code image");
    }

    const userData = values;
    //  console.log("form data", userData);
    //  console.log("photo", profileImage);`

    if (userData && profileImage !== null) {
      setUploadLoading(true);
      try {
        if (profileImage !== null) {
          // Check if the file is an allowed image type
          const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!validImageTypes.includes(profileImage.type)) {
            toast.error("Invalid file type. Only JPEG and PNG are allowed.");
            setUploadLoading(false);
            return;
          }

          // Check if the file size exceeds the limit
          if (profileImage.size > MAX_FILE_SIZE) {
            toast.error("File size exceeds the 5MB limit.");
            setUploadLoading(false);
            return;
          }

          // Check if the image is valid by loading it
          const imageLoadCheck = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(profileImage);
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
          });

          const isValidImage = await imageLoadCheck;
          if (!isValidImage) {
            toast.error("The file is not a valid image.");
            setUploadLoading(false);
            return;
          }

          // If all checks pass, proceed with the upload
          const formData = new FormData();
          formData.append("image", profileImage); // Use the original image
          formData.append("userData", JSON.stringify(userData));

          // Dispatch the formData including both image and userData
          await dispatch(addWalletAddress(formData));

          // console.log(formData);

          // Reset the image preview and loading state
          setUploadLoading(false);
          // handleClose();
        } else {
          toast.error("No image selected.");
          setUploadLoading(false);
        }
      } catch (error) {
        setUploadLoading(false);
        toast.error(error.message);
      }
    } else {
      setUploadLoading(false);
      toast.error("An error occurred");
    }
  };


  const [tabValue, setTabValue] = React.useState(0);
          
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      {walletAddressDrawerLoader || isLoading ? (
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
                Add Wallet Address
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
                Add Wallet Address
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ width: "100%" }}>
            <Box
              backgroundColor={
                theme.palette.mode === "light"
                  ? "lightgrey"
                  : colors.dashboardbackground[100]
              }
              height={"38px"}
              borderRadius={"20px"}
              p={"3px"}
              mt={2}
              mx={2}
              mb={tabValue === 0 ? 5 : 1}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                variant="fullWidth"
                centered
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "transparent",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    minHeight: "32px",
                    padding: "4px 12px",
                    minWidth: "auto",
                    borderRadius: "20px",
                    border: "none",
                    borderBottom: "2px solid transparent",
                    "&:hover": {
                      //   border: "2px solid #ccc",
                    },
                    "&.Mui-selected": {
                      // border: "2px solid #007bff",
                      backgroundColor: "white",
                      // boxShadow: `${theme.shadows[2]}`,
                      color: "black",
                    },
                  },
                }}
              >
                <Tab label="Automatic Wallets" />
                <Tab label="Manually add wallet" />
              </Tabs>
            </Box>
          </Box>

          <Stack mt={2} mx={2} display={tabValue === 0 ? "block" : "none"}>
            <form onSubmit={handleSelectSubmit}>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Autocomplete
                id="country-select-demo"
                sx={{ width: "100%" }}
                options={allCoins}
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => setSelectedCoin(newValue)}
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
              <IconButton size="large" sx={{border: "1px solid grey", borderRadius:"4px" }} onClick={() => dispatch(getAllCoins())}><ArrowsClockwise /></IconButton>
              </Stack>
              {/* <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Select
      </Button> */}
            </form>
          </Stack>

          <Stack
            spacing={1}
            direction={"row"}
            alignItems={"center"}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            p={"16px 16px"}
            mt={2}
            mx={2}
            borderRadius={"15px"}
            display={(!selectedCoin || tabValue === 1) ? "none" : "flex"}
            border={`${
              theme.palette.mode === "light"
                ? "1px solid #202020"
                : "1px solid lightgrey"
            }`}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              width={"100%"}
              spacing={1}
            >
              <img
                src={selectedCoin?.image}
                alt="metaMaskImg"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  padding: "4px",
                }}
                width={60}
              />

              <Typography fontSize={"18px"} fontWeight={600}>
                {selectedCoin?.name} wallet selected
              </Typography>
            </Stack>

            <CheckFat color="springgreen" size={24} />
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            p={"20px"}
            pt="30px"
            spacing={1}
          >
            <Badge
              onClick={handleButtonClick}
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the file input
                    onChange={handleImageChange}
                  />
                  <IconButton>
                    <Camera size={35} weight="bold" />
                  </IconButton>
                </>
              }
            >
              <img
                src={imagePreview === null ? "" : imagePreview}
                alt="walletQrcode"
                width={"150px"}
                height={"150px"}
                style={{
                  border: "4px solid grey",
                  // borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Badge>

            <Stack>
              <Typography variant="h6" fontWeight={"600"}>
                Add Wallet QRcode Image
              </Typography>
              <Typography variant="subtitle2">
                Click the camera icon to add a QR code Image
              </Typography>
            </Stack>
          </Stack>

          <Box p={2} display={tabValue === 0 ? "block" : "none"}>
            <Formik
              onSubmit={handleFormSubmitAuto}
              initialValues={formDataAuto}
              validationSchema={userSchemaAuto}
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
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Wallet Address"
                        name="walletAddress"
                        value={values.walletAddress}
                        error={
                          !!touched.walletAddress && !!errors.walletAddress
                        }
                        helperText={
                          touched.walletAddress && errors.walletAddress
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 201 }}
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
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <CircularProgress size={22} />
                      ) : (
                        " Add Wallet address"
                      )}
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Box>

          <Box p={2} display={tabValue === 1 ? "block" : "none"}>
            <Formik
              onSubmit={handleFormSubmitManual}
              initialValues={formDataManual}
              validationSchema={userSchemaManual}
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
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Wallet Name"
                        name="walletName"
                        value={values.walletName}
                        error={!!touched.walletName && !!errors.walletName}
                        helperText={touched.walletName && errors.walletName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 101 }}
                      />
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Wallet Symbol"
                        name="walletSymbol"
                        value={values.walletSymbol}
                        error={!!touched.walletSymbol && !!errors.walletSymbol}
                        helperText={touched.walletSymbol && errors.walletSymbol}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 51 }}
                      />
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Wallet Address"
                        name="walletAddress"
                        value={values.walletAddress}
                        error={
                          !!touched.walletAddress && !!errors.walletAddress
                        }
                        helperText={
                          touched.walletAddress && errors.walletAddress
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 201 }}
                      />
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Wallet Icon"
                        name="walletPhoto"
                        value={values.walletPhoto}
                        error={!!touched.walletPhoto && !!errors.walletPhoto}
                        helperText={touched.walletPhoto && errors.walletPhoto}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 200 }}
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
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <CircularProgress size={22} />
                      ) : (
                        " Add Wallet address"
                      )}
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default AddWalletAddress;
