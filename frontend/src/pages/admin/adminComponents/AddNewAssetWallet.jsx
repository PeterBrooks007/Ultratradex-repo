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
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Camera, CheckFat, WarningCircle } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../../theme";
import { adminAddNewAssetWalletToUser } from "../../../redux/features/auth/authSlice";



const AddNewAssetWallet = ({newAssetWalletLoader, setNewWalletLoader }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
  
    const { isLoading, singleUser, allCoins } = useSelector((state) => state.auth);

  
    useEffect(() => {
      if (newAssetWalletLoader) {
        const timer = setTimeout(() => {
          setNewWalletLoader(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [newAssetWalletLoader, setNewWalletLoader]);
  
  
    // useEffect(() => {
    //   if(!isLoading && allCoins.length === 0) {
    //     dispatch(getAllCoins());
    //   }
    // }, [isLoading, dispatch, allCoins.length]);
  
  
  
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
  
    const initialValuesManual = {
      walletName: "",
      walletSymbol: "",
    
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
    
    });
  
  
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
  
    const handleFormSubmitAuto = async (e) => {
     e.preventDefault()
  
      if (!selectedCoin) {
        return toast.error("Please select a wallet");
      }

      const userData = { walletName: selectedCoin?.name, walletSymbol: selectedCoin?.symbol, walletPhoto: selectedCoin?.image };
  
      //  console.log("form data", userData);
  
      if (userData) {
        setUploadLoading(true);
        try {
        
            const formData = new FormData();
    
            formData.append("userData", JSON.stringify(userData));

            const id = singleUser?._id
            // Dispatch the formData including both image and userData
            await dispatch(adminAddNewAssetWalletToUser({id, formData}));
            // setFormDataAuto(initialValuesAuto);
  
  
            // console.log("formData", formData);
  
            // Reset the image preview and loading state
            setUploadLoading(false);
            // handleClose()
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
    //   console.log(values);
      setFormDataManual(values);
  
      if (!profileImage) {
        return toast.error("Please add an asset icon image");
      }

      if (singleUser?.assets?.some(asset => asset.symbol.toLowerCase() === values.walletSymbol.toLowerCase())) {
        return toast.error("Wallet already exists");
      }


  
      const userData = values;
    //    console.log("form data", userData);
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
  
            const id = singleUser?._id
            // If all checks pass, proceed with the upload
            const formData = new FormData();
            formData.append("image", profileImage); // Use the original image
            formData.append("userData", JSON.stringify(userData));
  
            // Dispatch the formData including both image and userData
            await dispatch(adminAddNewAssetWalletToUser({id, formData}));
  
            // console.log(id, formData);
  
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
    <>
      {newAssetWalletLoader || isLoading ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
        >
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

       {/* Beginning of Auto add wallet */}

          <Stack mt={2} mx={2} display={tabValue === 0 ? "block" : "none"}>
            <form onSubmit={handleSelectSubmit}>
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
            display={!selectedCoin || tabValue === 1 ? "none" : "flex"}
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

          <Box p={2} display={tabValue === 0 ? "block" : "none"} mt={2}>
        
                <form onSubmit={handleFormSubmitAuto}>
                  <Stack spacing={2}>
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
             
          </Box>


          {/* Beginning of Manual add wallet */}

          <Stack
            m={2}
            border={"2px solid grey"}
            p={1}
            direction={"row"}
            alignItems={"flex-start"}
            spacing={0.5}
            display={tabValue !== 1 && "none"}
          >
            <Box>
              <WarningCircle size={22} color="orange" />
            </Box>
            <Typography variant="subtitle2" fontWeight={"bold"}>
              Note: You must use a real wallet name and symbol and it must match
              deposit wallet name and symbol
            </Typography>
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            p={"20px"}
            pt="30px"
            spacing={1}
            display={tabValue !== 1 && "none"}
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
                alt="assetIcon"
                width={"100px"}
                height={"100px"}
                style={{
                  border: "4px solid grey",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Badge>

            <Stack>
              <Typography variant="h6" fontWeight={"600"}>
                Add Asset Icon
              </Typography>
              <Typography variant="subtitle2">
                Click the camera icon to add an icon
              </Typography>
            </Stack>
          </Stack>

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
    </>
  );
}

export default AddNewAssetWallet