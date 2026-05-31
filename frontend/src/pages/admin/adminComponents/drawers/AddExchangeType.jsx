import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Camera } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addExchangeType } from "../../../../redux/features/tradingSettings/tradingSettingsSlice";

const AddExchangeType = ({
  open,
  handleClose,
  handleOpen,
  exchangeTypeDrawerLoader,
  setExchangeTypeDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (exchangeTypeDrawerLoader) {
      const timer = setTimeout(() => {
        setExchangeTypeDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [exchangeTypeDrawerLoader, setExchangeTypeDrawerLoader]);

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

  const initialValues = {
    exchangeType: "",
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
    exchangeType: yup
      .string()
      .sanitize()
      .required("exchangeType  is required")
      .min(2, "exchangeType must be at least 2 characters long")
      .max(100, "exchangeType cannot exceed 100 characters"),
    
  });

  const [formData, setFormData] = useState(initialValues);

  const handleFormSubmit = async (values) => {
    // console.log(values);
    // setFormData(values);

    if (!profileImage) {
      return toast.error("Please add a profile photo");
    }

    const userData = values;
    //  console.log("form data", userData);
    //  console.log("photo", profileImage);

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
          await dispatch(addExchangeType(formData));

          // Reset the image preview and loading state
          setUploadLoading(false);
          handleClose();
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
      {exchangeTypeDrawerLoader ? (
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
                sx={{ mr: 2, border: "1px solid grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Add New Exchange Type
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
                sx={{ mr: 2, border: "1px solid grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
              Add New Exchange Type
              </Typography>
            </Toolbar>
          </AppBar>

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
                alt="profileimage"
                width={"120px"}
                height={"120px"}
                style={{
                  border: "4px solid grey",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Badge>

            <Stack>
              <Typography variant="h6" fontWeight={"600"}>
                Add Exchange Photo
              </Typography>
              <Typography variant="subtitle2">
                Click the camera icon to add a Exchange Type image
              </Typography>
            </Stack>
          </Stack>

          <Box p={2}>
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
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Exchange Name"
                        name="exchangeType"
                        value={values.exchangeType}
                        error={!!touched.exchangeType && !!errors.exchangeType}
                        helperText={touched.exchangeType && errors.exchangeType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 101 }}
                      />
                      {/* <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Price Amount"
                        name="price"
                        value={values.price}
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 51 }}
                      /> */}
                     
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
                        " Add Exchange Type"
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

export default AddExchangeType;
