import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputBase,
  OutlinedInput,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,
  Camera,
  Eye,
  PaperPlaneTilt,
  Trash,
  X,
} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import ReferralSystem from "../../pages/dashboard/dashboardComponents/ReferralSystem";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import UseWindowSize from "../../hooks/UseWindowSize";
import AllNfts from "../../pages/walletDashboard/walletComponents/AllNfts";
import MyNfts from "../../pages/walletDashboard/walletComponents/MyNfts";
import AllTraders from "../AllTraders";
import MyTrader from "../MyTrader";
import ClientTraders from "../ClientTraders";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { adminSendCustomizedMail, updateCustomizeEmailLogo } from "../../redux/features/auth/authSlice";

const CustomizeMailDrawer = ({
  open,
  handleClose,
  handleOpen,
  customMailDrawerLoader,
  setCustomMailDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  const [uploadLoading, setUploadLoading] = useState(false);

  const size = UseWindowSize();

  const dispatch = useDispatch();

  useEffect(() => {
    if (customMailDrawerLoader) {
      const timer = setTimeout(() => {
        setCustomMailDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [customMailDrawerLoader, setCustomMailDrawerLoader]);

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
    to: yup
      .string()
      .sanitize()
      .required("to required")
      .min(2, "to must be at least 2 characters long")
      .max(100, "to cannot exceed 100 characters"),
    fullName: yup
      .string()
      .sanitize()
      .required("fullName required")
      .min(2, "fullName must be at least 2 characters long")
      .max(50, "fullName cannot exceed 50 characters"),
    subject: yup
      .string()
      .sanitize()
      .required("subject required")
      .min(2, "subject must be at least 2 characters long")
      .max(50, "subject cannot exceed 50 characters"),
    teamName: yup
      .string()
      .sanitize()
      .required("teamName required")
      .min(2, "teamName must be at least 2 characters long")
      .max(50, "teamName cannot exceed 50 characters"),
    content: yup
      .string()
      .sanitize()
      .required("content required")
      .min(2, "content must be at least 2 characters long")
      .max(1000, "content cannot exceed 1000 characters"),
    footer: yup
      .string()
      .sanitize()
      .required("footer Text required")
      .min(2, "footer must be at least 2 characters long")
      .max(300, "footer cannot exceed 300 characters"),
  });

  const initiatialValue = {
    to: "",
    fullName: "",
    subject: "",
    teamName: "",
    content: "",
    footer: "",
    customizedLogo: singleUser?.customizeEmailLogo,
  };

  const [inputs, setInputs] = useState(initiatialValue);

  const handleFormSubmit = async (values) => {
    setUploadLoading(true);
    setInputs(values);
    setUploadLoading(false);
  };

  const handleSendMessage = async () => {

    const isEmpty = Object.values(inputs).some((value) => value.trim() === "");

    if (isEmpty) {
      toast.error("Please fill in all the email details");
      return false; // Validation failed
    }
    
    // console.log(inputs)

    const id = singleUser?.id

    const formData = {
      ...inputs,
    };

    await dispatch(adminSendCustomizedMail({id, formData}));
    setInputs(initiatialValue);

  };





  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const savePhoto = async (e) => {
    e.preventDefault();
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

        // Check if the compressed file is a valid image by loading it
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
        formData.append("image", profileImage);

        const id = singleUser?._id;

        dispatch(updateCustomizeEmailLogo({ id, formData }));

        // console.log(id, formData);

        // Reset the image preview and loading state
        setImagePreview(null);
        setUploadLoading(false);
      } else {
        toast.error("No image selected.");
        setUploadLoading(false);
      }
    } catch (error) {
      setUploadLoading(false);
      toast.error(error.message);
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
          width: { xs: "100%", md: "80%", xl: "60%" },
        },
      }}
    >
      {customMailDrawerLoader || isSemiLoading ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
          sx={{ overflowX: "hidden" }}
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
                Send Customize Email
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
          sx={{ overflowX: "hidden" }}
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
                Send Customize Email
              </Typography>
            </Toolbar>
          </AppBar>

          <Box>
            <Stack backgroundColor={`${colors.dashboardforeground[100]}`} p={2}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                pb={2}
                alignItems={"center"}
              >
                <Typography variant="body1" fontWeight={"bold"}>
                  Send Customize Email
                </Typography>
              </Stack>

              <Divider flexItem />

              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent={"space-between"}
              >
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
                    <Typography variant="caption">
                      {singleUser?.email}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }} // Hide the file input
                      onChange={handleImageChange}
                    />
                    <IconButton onClick={handleButtonClick}>
                      <Camera size={35} weight="bold" />
                    </IconButton>
                  </Box>

                  <Box>
                    <img
                      src={
                        imagePreview === null
                          ? singleUser?.customizeEmailLogo
                          : imagePreview
                      }
                      alt="profileimage"
                      width={"200px"}
                      height={"auto"}
                      style={
                        {
                          // border: "4px solid grey",
                          // borderRadius: "50%",
                        }
                      }
                    />
                  </Box>
                </Stack>

                {imagePreview !== null && (
                  <Stack spacing={0.5} sx={{}}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={savePhoto}
                      disabled={uploadLoading && true}
                      sx={{
                        "&.Mui-disabled": {
                          backgroundColor: "grey", // Background color when disabled
                          color: "white", // Optional: Set text color when disabled
                        },
                      }}
                    >
                      {uploadLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        "UPLOAD LOGO"
                      )}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setImagePreview(null)}
                    >
                      <X size={20} /> Cancel upload
                    </Button>
                  </Stack>
                )}
              </Stack>
              <Divider />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={4}>
                <Box
                  border={"1px solid grey"}
                  width={"100%"}
                  height={"auto"}
                  borderRadius={"15px"}
                >
                  <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={inputs}
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
                      <form action="" onSubmit={handleSubmit}>
                        <InputBase
                          startAdornment={
                            <InputAdornment position="start">
                              <Typography>To:</Typography>
                            </InputAdornment>
                          }
                          sx={{
                            p: 1,
                            pl: 2,
                          }}
                          placeholder="email address"
                          name="to"
                          value={values.to}
                          onChange={handleChange}
                        />

                        {touched.to && errors.to && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.to}
                          </FormHelperText>
                        )}

                        <OutlinedInput
                          placeholder=""
                          size="small"
                          name="fullName"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          startAdornment={
                            <InputAdornment
                              position="start"
                              sx={{ marginRight: "10px", marginLeft: "2px" }}
                            >
                              <Typography>Full Name:</Typography>
                            </InputAdornment>
                          }
                          sx={{
                            py: "10px",
                            width: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "0px",
                              // border: "none",
                              borderRight: "none",
                              borderLeft: "none",
                            },
                          }}
                        />

                        {touched.fullName && errors.fullName && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.fullName}
                          </FormHelperText>
                        )}

                        <OutlinedInput
                          placeholder=""
                          size="small"
                          name="subject"
                          value={values.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          startAdornment={
                            <InputAdornment
                              position="start"
                              sx={{ marginRight: "10px", marginLeft: "2px" }}
                            >
                              <Typography>Subject:</Typography>
                            </InputAdornment>
                          }
                          sx={{
                            py: "10px",
                            width: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "0px",
                              // border: "none",
                              borderRight: "none",
                              borderLeft: "none",
                            },
                          }}
                        />

                        {touched.subject && errors.subject && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.subject}
                          </FormHelperText>
                        )}

                        <OutlinedInput
                          placeholder=""
                          size="small"
                          name="teamName"
                          value={values.teamName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          startAdornment={
                            <InputAdornment
                              position="start"
                              sx={{ marginRight: "10px", marginLeft: "2px" }}
                            >
                              <Typography>Team Name:</Typography>
                            </InputAdornment>
                          }
                          sx={{
                            py: "10px",
                            width: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "0px",
                              // border: "none",
                              borderRight: "none",
                              borderLeft: "none",
                            },
                          }}
                        />

                        {touched.teamName && errors.teamName && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.teamName}
                          </FormHelperText>
                        )}

                        <OutlinedInput
                        multiline
                        rows={4}
                          placeholder="Footer Text"
                          size="small"
                          name="footer"
                          value={values.footer}
                          onChange={handleChange}
                          onBlur={handleBlur}
                         
                          sx={{
                            py: "10px",
                            width: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "0px",
                              // border: "none",
                              borderRight: "none",
                              borderLeft: "none",
                            },
                          }}
                        />

                        {touched.footer && errors.footer && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.footer}
                          </FormHelperText>
                        )}

                        <Box
                          height={"auto"}
                          maxHeight={{
                            xs: size.height - 100,
                            md: size.height < 967 ? "400px" : "400px",
                          }}
                          overflow={"hidden"}
                          pb={5}
                        >
                          <InputBase
                            multiline
                            rows={8}
                            sx={{
                              width: "100%",
                              // border: "2px solid grey",
                              p: 1,
                              pl: 2,
                              pt: 2,
                            }}
                            placeholder="Message Content"
                            name="content"
                            value={values.content}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{
                              maxLength: 1001,
                            }}
                          />
                        </Box>

                        {touched.content && errors.content && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.content}
                          </FormHelperText>
                        )}

                        <Box pb={{ xs: 2, md: 1 }}>
                          <Button
                          size="small"
                            startIcon={
                              <Eye
                                style={{ display: uploadLoading && "none" }}
                              />
                            }
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, ml: 2, minWidth: "200px" }}
                            disabled={uploadLoading}
                          >
                            {uploadLoading ? (
                              <CircularProgress size={22} />
                            ) : (
                              "Preview Message"
                            )}
                          </Button>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </Box>
                <Box
                  border={"1px solid grey"}
                  width={"100%"}
                  height={"auto"}
                  borderRadius={"15px"}
                >
                  <Stack
                    sx={{ p: 1.5 }}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography>Email Preview</Typography>

                    
                  </Stack>
                  <Divider />

                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    backgroundColor="white"
                    p={2}
                  >
                    <img
                      src={
                        imagePreview === null
                          ? singleUser?.customizeEmailLogo
                          : imagePreview
                      }
                      alt="profileimage"
                      width={"250px"}
                      height={"auto"}
                      style={
                        {
                          // border: "4px solid grey",
                        }
                      }
                    />
                  </Stack>

                  <Typography p={2} variant="h6" fontWeight={700}>
                    Hi {inputs?.fullName},
                  </Typography>

                  <Typography p={2}>{inputs?.content}</Typography>

                  <Stack p={2}>
                    <Typography variant="subtitle1">
                      Best Regards <br />
                    </Typography>
                    <Typography variant="h6">
                      {inputs?.teamName}
                    </Typography>
                  </Stack>

                  <Box p={2} backgroundColor="grey">
                    {inputs.footer}
                  </Box>

                  <Divider flexItem sx={{mt:2}} />

                  <Box p={2}>
                  <Button
                    size="small"
                      onClick={handleSendMessage}
                      startIcon={
                        <PaperPlaneTilt
                          style={{ display: uploadLoading && "none" }}
                        />
                      }
                      type="button"
                      variant="contained"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <CircularProgress size={22} />
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default CustomizeMailDrawer;
