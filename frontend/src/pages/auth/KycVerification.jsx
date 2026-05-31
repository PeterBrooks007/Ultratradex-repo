import { useTheme } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import dummyProfileImg from "../../assets/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.png";
import kycIconImg from "../../assets/check.svg";
import { CloudArrowUp, Power } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  kycSetup,
  logout,
  RESET_AUTH,
} from "../../redux/features/auth/authSlice";
import { countries, currencies } from "../../data";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const KycVerification = ({
  handleNext,
  activeStep,
  setActiveStep,
  handleBack,
  steps,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    isSemiLoading,
    user,
    isError,
    isSuccess,
    kycSetupStatus,
  } = useSelector((state) => state.auth);



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

  const initialState = {
    state: user?.address?.state ?? "",
    address: user?.address?.address ?? "",
    phone: user?.phone ?? "",
    accounttype: user?.accounttype ?? "STOCKS TRADING",
    package: user?.package ?? "STARTER",
    country: user?.address?.country ?? null,
    currency: user?.currency?.code ?? null,
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
    state: yup
      .string()
      .sanitize()
      .required("state required")
      .max(50, "state cannot exceed 50 characters"),

    address: yup
      .string()
      .sanitize()
      .required("address required")
      .max(50, "address cannot exceed 50 characters"),

    phone: yup
      .string()
      .sanitize()
      .required("phone required")
      .max(50, "phone cannot exceed 50 characters"),

    accounttype: yup
      .string()
      .sanitize()
      .required("accounttype required")
      .max(50, "accounttype cannot exceed 50 characters"),

    package: yup
      .string()
      .sanitize()
      .required("package required")
      .max(50, "package cannot exceed 50 characters"),

    country: yup
      .mixed()
      .required("Country is required")
      .test("is-valid-country", "Invalid country selection", (value) => {
        return value && typeof value === "object" && value.label; // Check if an object with a label is selected
      }),

    currency: yup
      .mixed()
      .required("Currency is required")
      .test("is-valid-Currency", "Invalid Currency selection", (value) => {
        return value && typeof value === "object" && value.code; // Check if an object with a code is selected
      }),

      pin: yup
      .string()
      .matches(/^[0-9]+$/, "Pin must only contain numbers from 0 to 9") // Allows only digits 0-9
      .required("Pin is required")
      .max(4, "Pin cannot exceed 4 digits"),
  });

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData({
      state: user?.address?.state ?? "",
      address: user?.address?.address ?? "",
      phone: user?.phone ?? "",
      accounttype: user?.accounttype ?? "STOCKS TRADING",
      package: user?.package ?? "STARTER",
      country: user?.address?.country ?? null,
      currency: user?.currency?.code ?? null,
      pin: "",
    });
  }, [user]);

  const handleFormSubmit = async (values) => {
    // setFormData(values);

    if (!profileImage) {
      return toast.error("Please add a profile photo");
    }

    const userData = values;
    // console.log("form data", userData);
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
          await dispatch(kycSetup(formData));

          // Reset the image preview and loading state
          setUploadLoading(false);
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

  useEffect(() => {
    if (
      !isSemiLoading &&
      !isError &&
      isSuccess &&
      kycSetupStatus === "KYCSETUP_OK"
    ) {
      setActiveStep(1);
      dispatch(RESET_AUTH());
    }
  }, [
    dispatch,
    isSemiLoading,
    setActiveStep,
    isError,
    isSuccess,
    kycSetupStatus,
  ]);


  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    dispatch(RESET_AUTH());
    dispatch(RESET_WITHDRAWAL());
    dispatch(RESET_DEPOSIT());
  };


  return (
    <>
      {isSemiLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth="md">
          <Stack spacing={1}>
            {/* Header */}
            <Stack spacing={0}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="700"
                textAlign="center"
              >
                KYC Setup For{" "}
                {user ? user?.firstname + " " + user?.lastname : "loading..."}
              </Typography>

              <MotionBox
                display="flex"
                justifyContent="center"
                initial={{ y: -5 }}
                animate={{ y: 5 }}
                transition={{
                  type: "smooth",
                  repeatType: "mirror",
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.8,
                }}
                p={2}
              >
                <img src={kycIconImg} alt="KYC Icon" width="100px" />
              </MotionBox>

              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                fontWeight="600"
                textAlign="center"
              >
                To continue, let&apos;s start by setting up your trading account
              </Typography>
            </Stack>

            {/* Profile Upload */}
            <Stack pt={3} spacing={3}>
              <Stack spacing={1} pb={2}>
                <Typography variant="subtitle1">
                  Upload a profile image
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: "100px", sm: "150px" },
                      height: { xs: "100px", sm: "150px" },
                      borderRadius: "20px",
                      border: "1px solid grey",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      // src={dummyProfileImg}
                      src={
                        imagePreview === null ? dummyProfileImg : imagePreview
                      }
                      alt="Dummy Profile"
                      width="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Box
                    flex={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      height: { xs: "100px", sm: "150px" },
                      borderRadius: "20px",
                      border: "1px dashed grey",
                      cursor: "pointer",
                    }}
                    onClick={handleButtonClick}
                  >
                    <Stack alignItems="center">
                      <CloudArrowUp size={isMobile ? 28 : 48} />
                      <Typography
                        variant={isMobile ? "caption" : "h6"}
                        textAlign={"center"}
                      >
                        Click here to upload an image
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }} // Hide the file input
                        onChange={handleImageChange}
                      />
                    </Stack>
                  </Box>
                </Box>
              </Stack>

              {/* Details Form */}
              <Divider>Give us more details about you</Divider>

              <Formik
                onSubmit={handleFormSubmit}
                initialValues={formData}
                validationSchema={userSchema}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      {/* First Row */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Which country are you from ?</Typography>
                          <Autocomplete
                            fullWidth
                            id="country-select-demo"
                            sx={{ width: "100%" }}
                            options={countries}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            onChange={(event, newValue) =>
                              setFieldValue("country", newValue)
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
                                    width="25"
                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                    alt=""
                                  />
                                  {option.label} (+{option.phone})
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // label="Select Country"
                                placeholder="Select Country"
                                slotProps={{
                                  htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  },
                                }}
                                sx={{
                                  borderRadius: 2, // Adds rounded corners
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2, // Applies to the input field
                                  },
                                }}
                                error={
                                  touched.country && Boolean(errors.country)
                                }
                                helperText={touched.country && errors.country}
                              />
                            )}
                          />
                        </Stack>
                        <Stack spacing={0.5} flex={1}>
                          <Typography>State</Typography>
                          <OutlinedInput
                            name="state"
                            value={values?.state}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          />
                          {touched.state && errors.state && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.state}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Stack>

                      {/* Second Row */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Address</Typography>
                          <OutlinedInput
                            name="address"
                            value={values?.address}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your full address"
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          />
                          {touched.address && errors.address && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.address}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Stack>

                      {/* Third Row */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Phone</Typography>
                          <OutlinedInput
                            name="phone"
                            value={values?.phone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          />
                          {touched.phone && errors.phone && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.phone}
                            </FormHelperText>
                          )}
                        </Stack>
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Currency</Typography>
                          <Autocomplete
                            id="country-select-demo"
                            sx={{ width: "100%" }}
                            options={currencies}
                            autoHighlight
                            getOptionLabel={(option) => option.code}
                            onChange={(event, newValue) =>
                              setFieldValue("currency", newValue)
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
                                    width="25"
                                    height="25"
                                    srcSet={`https://flagcdn.com/w80/${option?.flag}.png`}
                                    src={`https://flagcdn.com/w80/${option?.flag}.png`}
                                    alt={option?.code}
                                    style={{ borderRadius: "50%" }}
                                  />
                                  {option.code}
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // label="Select Currency"
                                placeholder="select currency"
                                slotProps={{
                                  htmlInput: {
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  },
                                }}
                                sx={{
                                  borderRadius: 2, // Adds rounded corners
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2, // Applies to the input field
                                  },
                                }}
                                error={
                                  touched.currency && Boolean(errors.currency)
                                }
                                helperText={touched.currency && errors.currency}
                              />
                            )}
                          />
                          {/* {touched.ticks && errors.ticks && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.ticks}
                        </FormHelperText>
                      )} */}
                        </Stack>
                      </Stack>

                      {/* Fourth Row */}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Account Type</Typography>
                          <Select
                            name="accounttype"
                            placeholder="Select account type"
                            id="demo-simple-select"
                            value={values?.accounttype}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={"STOCKS TRADING"}>
                            STOCKS TRADING
                            </MenuItem>
                            <MenuItem value={"CRYPTO TRADING"}>
                            CRYPTO TRADING
                            </MenuItem>
                            <MenuItem value={"FOREX TRADING"}>
                            FOREX TRADING
                            </MenuItem>
                            <MenuItem value={"BINARY OPTIONS"}>
                            BINARY OPTIONS
                            </MenuItem>
                            <MenuItem value={"OTHERS"}>OTHERS</MenuItem>
                          </Select>
                          {touched.accounttype && errors.accounttype && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.accounttype}
                            </FormHelperText>
                          )}
                        </Stack>
                        <Stack spacing={0.5} flex={1}>
                          <Typography>Select Package Plan</Typography>
                          <Select
                            name="package"
                            placeholder="Select Package"
                            id="demo-simple-select"
                            value={values?.package}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={"STARTER"}>STARTER</MenuItem>
                            <MenuItem value={"BRONZE"}>BRONZE</MenuItem>
                            <MenuItem value={"SILVER"}>SILVER</MenuItem>
                            <MenuItem value={"GOLD"}>GOLD</MenuItem>
                            <MenuItem value={"PLATINUM"}>PLATINUM</MenuItem>
                          </Select>

                          {touched.package && errors.package && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.package}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Stack>

                      <Stack spacing={0.5} flex={1}>
                          <Typography>Set a lock pin</Typography>
                          <OutlinedInput
                          type="text"
                            name="pin"
                            value={values?.pin}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your pin"
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          />
                          {touched.pin && errors.pin && (
                            <FormHelperText error sx={{ ml: 2 }}>
                              {errors.pin}
                            </FormHelperText>
                          )}
                        </Stack>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: "text.primary",
                          color:
                            theme.palette.mode === "light"
                              ? "common.white"
                              : "grey.800",
                          borderRadius: "10px",
                          fontWeight: "600",
                          "&:hover": {
                            bgcolor: "text.primary",
                          },
                        }}
                      >
                        Continue
                      </Button>
                      <Button
                      startIcon={<Power/> }
                        type="button"
                        fullWidth
                        variant="outlined"
                        size="large"
                        sx={{
                          // bgcolor: "text.primary",
                          color:
                            theme.palette.mode === "light"
                              ? "black"
                              : "white",
                          borderRadius: "10px",
                          fontWeight: "600",
                          "&:hover": {
                            bgcolor: "text.primary",
                            color: "red"
                          },

                        }}
                        onClick={logoutUser}
                      >
                        Sign out
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Stack>
          </Stack>

          <Box sx={{ display: "none", justifyContent: "flex-end" }}>
            <Button
              //  disabled={activeStep === 0 || activeStep === steps.length - 1}
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                activeStep === steps.length - 1
                //   (activeStep === 0 && (!formData.name || !formData.email)) ||
                //   (activeStep === 1 && (!formData.frontId || !formData.backId))
              }
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
};

export default KycVerification;
