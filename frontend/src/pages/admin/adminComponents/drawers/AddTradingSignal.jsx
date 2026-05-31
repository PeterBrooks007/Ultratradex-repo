import{ useEffect, useRef, useState } from "react";
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
import { addTradingSignal } from "../../../../redux/features/tradingSignals/tradingSignalsSlice";

const AddTradingSignal = ({
  open,
  handleClose,
  handleOpen,
  tradingSignalDrawerLoader,
  setTradingSignalDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tradingSignalDrawerLoader) {
      const timer = setTimeout(() => {
        setTradingSignalDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tradingSignalDrawerLoader, setTradingSignalDrawerLoader]);

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
    name: "",
    price: "",
    lastname: "",
    dailyTrades: "",
    winRate: "",
    comment: "",
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
    name: yup
      .string()
      .sanitize()
      .required("Signal name is required")
      .min(2, "Signal name must be at least 2 characters long")
      .max(50, "Signal name cannot exceed 50 characters"),
    price: yup
      .number()
      .min(0, "price must be a positive number")
      .required("price required"),
    dailyTrades: yup
      .number()
      .min(0, "dailyTrades must be a positive number")
      .max(1000, "dailyTrades cannot exceed 1000")
      .required("dailyTrades required"),
      winRate: yup
      .string()
      .matches(/^[0-9%]+$/, 'Win rate must contain only numbers or the "%" symbol') // Regex match with custom message
      .required('Win rate is required') // Required field
      .max(10, 'Win rate cannot exceed 10 characters'),
    comment: yup
      .string()
      .sanitize()
      .required("comment required")
      .max(200, "comment cannot exceed 200 characters"),
  });

  const [formData, setFormData] = useState(initialValues);

  const handleFormSubmit = async (values) => {
    // console.log(values);
    setFormData(values);

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
          await dispatch(addTradingSignal(formData));

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
      {tradingSignalDrawerLoader ? (
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
                Add Trading Signal
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
                Add Trading Signal
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
                Add Signal Photo
              </Typography>
              <Typography variant="subtitle2">
                Click the camera icon to add a profile image
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
                        label="Signal Name"
                        name="name"
                        value={values.name}
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 51 }}
                      />
                      <TextField
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
                      />
                     
                    </Stack>

                    <Stack direction={"row"} spacing={2}>
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="dailyTrades"
                        name="dailyTrades"
                        value={values.dailyTrades}
                        error={!!touched.dailyTrades && !!errors.dailyTrades}
                        helperText={touched.dailyTrades && errors.dailyTrades}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 11 }}
                      />
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="winRate"
                        name="winRate"
                        value={values.winRate}
                        error={!!touched.winRate && !!errors.winRate}
                        helperText={touched.winRate && errors.winRate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        inputProps={{ maxLength: 11 }}
                      />
                    </Stack>
                    <Stack>
                      <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Short Info"
                        name="comment"
                        value={values.comment}
                        error={!!touched.comment && !!errors.comment}
                        helperText={touched.comment && errors.comment}
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
                        " Add Trading Signal"
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

export default AddTradingSignal;
