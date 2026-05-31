import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import TermsDialog from "../../components/dialogs/TermsDialog.jsx";
import { useContext, useEffect, useState } from "react";
import PolicyDialog from "../../components/dialogs/PolicyDialog.jsx";
import {
  Desktop,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  GoogleLogo,
  Lock,
  Moon,
  Sun,
  User,
} from "@phosphor-icons/react";
import { toast, Slide } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, RESET_AUTH } from "../../redux/features/auth/authSlice.js";
import LogoImg from "./../../assets/favicon_logo.png";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { ColorModeContext, tokens } from "../../theme.js";
import AuthMobileHeader from "./AuthMobileHeader.jsx";

const Register = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [termsAccepted, setTermsAccepted] = useState(false); // State to track terms acceptance
  const [openMenu, setOpenMenu] = useState(false);
  const [openPolicyMenu, setOpenPolicyMenu] = useState(false);

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked); // Update checkbox state
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleClosePolicyMenu = () => {
    setOpenPolicyMenu(false);
  };

  const handleOpenPolicyMenu = () => {
    setOpenPolicyMenu(true);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
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

  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cPassword: "",
  };

  const [formData, setFormData] = useState(initialState);
  const { isLoading, isLoggedIn, isSuccess } = useSelector(
    (state) => state.auth
  );

  const userSchema = yup.object().shape({
    firstname: yup
      .string()
      .sanitize()
      .required("Firstname is required")
      .max(50, "Firstname cannot exceed 50 characters"),
    lastname: yup
      .string()
      .sanitize()
      .required("Lastname is required")
      .max(50, "Lastname cannot exceed 50 characters"),
    email: yup
      .string()
      .email("Invalid email")
      .sanitize()
      .required("Email required"),
    password: yup
      .string()
      .sanitize()
      .required("Password is required")
      .min(6, "Password must be up to 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
    cPassword: yup
      .string()
      .sanitize()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required")
      .max(100, "Confirm password cannot exceed 100 characters"),
  });

  const registerUser = async (values) => {
    if (!termsAccepted) {
      return toast.error("You must accept the Terms and Conditions", {
        position: "top-center",
        transition: Slide,
      });
    }

    const userData = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email.toLowerCase().trim(),
      password: values.password,
    };
    await dispatch(register(userData));
    // console.log(userData);
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/auth/verify-email");
      dispatch(RESET_AUTH());
    }
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <>
      <Stack
        height="100vh"
        justifyContent="space-between"
        position={"relative"}
        sx={{overflowX: "hidden"}}

      >
        <Box
          position={"absolute"}
          right={-50}
          top={-50}
          sx={{ opacity: 0.09, transform: "rotate" }}
        >
          <img src={LogoImg} alt="" />
        </Box>
        {/* <Box position={"absolute"} bottom={-50} left={-50}  sx={{ opacity: 0.09,  transform: "rotate(180deg)" }}>
          <img src={LogoImg} alt="" />
        </Box> */}

        {/* Top Bar with "Already have an account?" */}

        <AuthMobileHeader
          writeUp={"Already have an account ?"}
          buttonText={"Login"}
          link={"/auth/account-setup"}
        />

        <Stack flex={1} justifyContent="center" alignItems="center" mx={0}>
          <Container maxWidth="sm">
            <Stack spacing={3} mx={{ xs: 0, md: 4 }} my={2}>
              <Stack spacing={1}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={"700"}
                  textAlign={"center"}
                  pt={2}
                >
                  Create your Account
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={"600"}
                  textAlign={"center"}
                >
                  Let&apos;s get started by creating a free account
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    p: 1,
                    color: theme.palette.mode === "light" ? "black" : "grey",
                    borderColor:
                      theme.palette.mode === "light" ? "black" : "grey",
                  }}
                >
                  <GoogleLogo weight="bold" color="#Df3e30" size={22} /> &nbsp;
                  Sign up with Google
                </Button>

                <Divider>or</Divider>

                <Formik
                  onSubmit={registerUser}
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
                            // label="First Name"
                            placeholder="First Name"
                            name="firstname"
                            value={values.firstname}
                            error={!!touched.firstname && !!errors.firstname}
                            helperText={touched.firstname && errors.firstname}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User
                                    weight="thin"
                                    size={26}
                                    color={
                                      theme.palette.mode === "light"
                                        ? "grey"
                                        : "grey"
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Change the border color to red
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Ensure it stays red on hover
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor:
                                      theme.palette.mode === "light"
                                        ? "black"
                                        : "grey", // Ensure it stays red when focused
                                  },
                                "&:before": {
                                  content: '""',
                                  position: "absolute",
                                  height: "95%",
                                  width: "1px",
                                  backgroundColor:
                                    theme.palette.mode === "light"
                                      ? "grey"
                                      : "grey.800", // Border color
                                  left: "50px", // Adjust this value based on the width of the `startAdornment`
                                  zIndex: 1,
                                },
                                "& .MuiInputBase-input": {
                                  paddingLeft: "16px", // Adjust padding to ensure alignment
                                },
                              },
                            }}
                          />

                          <TextField
                            fullWidth
                            size="medium"
                            variant="outlined"
                            type="text"
                            // label="Last Name"
                            placeholder="Last Name"
                            name="lastname"
                            value={values.lastname}
                            error={!!touched.lastname && !!errors.lastname}
                            helperText={touched.lastname && errors.lastname}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User
                                    weight="thin"
                                    size={26}
                                    color={
                                      theme.palette.mode === "light"
                                        ? "grey"
                                        : "grey"
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Change the border color to red
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Ensure it stays red on hover
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor:
                                      theme.palette.mode === "light"
                                        ? "black"
                                        : "grey", // Ensure it stays red when focused
                                  },
                                "&:before": {
                                  content: '""',
                                  position: "absolute",
                                  height: "95%",
                                  width: "1px",
                                  backgroundColor:
                                    theme.palette.mode === "light"
                                      ? "grey"
                                      : "grey.800", // Border color
                                  left: "50px", // Adjust this value based on the width of the `startAdornment`
                                  zIndex: 1,
                                },
                                "& .MuiInputBase-input": {
                                  paddingLeft: "16px", // Adjust padding to ensure alignment
                                },
                              },
                            }}
                          />
                        </Stack>

                        <TextField
                          fullWidth
                          size="medium"
                          variant="outlined"
                          type="text"
                          // label="Email"
                          placeholder="Email Address"
                          name="email"
                          value={values.email}
                          error={!!touched.email && !!errors.email}
                          helperText={touched.email && errors.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EnvelopeSimple
                                  weight="thin"
                                  size={26}
                                  color={
                                    theme.palette.mode === "light"
                                      ? "grey"
                                      : "grey"
                                  }
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Change the border color to red
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Ensure it stays red on hover
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Ensure it stays red when focused
                                },
                              "&:before": {
                                content: '""',
                                position: "absolute",
                                height: "95%",
                                width: "1px",
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "grey"
                                    : "grey.800", // Border color
                                left: "50px", // Adjust this value based on the width of the `startAdornment`
                                zIndex: 1,
                              },
                              "& .MuiInputBase-input": {
                                paddingLeft: "16px", // Adjust padding to ensure alignment
                              },
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          size="medium"
                          variant="outlined"
                          type={showPassword ? "text" : "password"}
                          // label="Password"
                          placeholder="Password"
                          name="password"
                          value={values.password}
                          error={!!touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Change the border color to red
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Ensure it stays red on hover
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Ensure it stays red when focused
                                },
                              "&:before": {
                                content: '""',
                                position: "absolute",
                                height: "95%",
                                width: "1px",
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "grey"
                                    : "grey.800", // Border color
                                left: "50px", // Adjust this value based on the width of the `startAdornment`
                                zIndex: 1,
                              },
                              "& .MuiInputBase-input": {
                                paddingLeft: "16px", // Adjust padding to ensure alignment
                              },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="start"
                              >
                                {showPassword ? (
                                  <EyeSlash size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </IconButton>
                            ),
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock
                                  weight="thin"
                                  size={28}
                                  color={
                                    theme.palette.mode === "light"
                                      ? "grey"
                                      : "grey"
                                  }
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          size="medium"
                          variant="outlined"
                          type={showConfirmPassword ? "text" : "password"}
                          // label="Confirm Password"
                          placeholder="Confirm Password"
                          name="cPassword"
                          value={values.cPassword}
                          error={!!touched.cPassword && !!errors.cPassword}
                          helperText={touched.cPassword && errors.cPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Change the border color to red
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "light"
                                    ? "black"
                                    : "grey", // Ensure it stays red on hover
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor:
                                    theme.palette.mode === "light"
                                      ? "black"
                                      : "grey", // Ensure it stays red when focused
                                },
                              "&:before": {
                                content: '""',
                                position: "absolute",
                                height: "95%",
                                width: "1px",
                                backgroundColor:
                                  theme.palette.mode === "light"
                                    ? "grey"
                                    : "grey.800", // Border color
                                left: "50px", // Adjust this value based on the width of the `startAdornment`
                                zIndex: 1,
                              },
                              "& .MuiInputBase-input": {
                                paddingLeft: "16px", // Adjust padding to ensure alignment
                              },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={toggleConfirmPasswordVisibility}
                                edge="start"
                              >
                                {showConfirmPassword ? (
                                  <EyeSlash size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </IconButton>
                            ),
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock
                                  weight="thin"
                                  size={28}
                                  color={
                                    theme.palette.mode === "light"
                                      ? "grey"
                                      : "grey"
                                  }
                                />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={termsAccepted}
                              onChange={handleCheckboxChange}
                              name="terms"
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="subtitle2">
                              I agree to the{" "}
                              <Link
                                onClick={handleOpenMenu}
                                sx={{
                                  color: "dodgerblue",
                                  textDecoration: "none",
                                }}
                              >
                                {" "}
                                Terms{" "}
                              </Link>
                              {"  "}&{"  "}
                              <Link
                                sx={{
                                  color: "dodgerblue",
                                  textDecoration: "none",
                                }}
                                onClick={handleOpenPolicyMenu}
                              >
                                Privacy Policy
                              </Link>
                            </Typography>
                          }
                        />

                        <Button
                          fullWidth
                          color="inherit"
                          size="large"
                          type="submit"
                          variant="contained"
                          disabled={isLoading && true}
                          sx={{
                            bgcolor: "green",
                            borderRadius: "10px",
                            padding: "15px",
                            fontWeight: "600",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "common.white"
                                : "white",
                            "&:hover": {
                              bgcolor: "green",
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "common.white"
                                  : "common.white",
                            },
                            "&:active": {
                              bgcolor: "darkgreen !important", // Adjust color for active state
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "common.white"
                                  : "common.white",
                            },
                          }}
                        >
                          {isLoading ? (
                            <CircularProgress size={28} />
                          ) : (
                            "Create Account"
                          )}
                        </Button>

                        <Typography variant="body1" textAlign={"center"}>
                          Already have an account ?{" "}
                          <Link
                            sx={{ color: "dodgerblue", textDecoration: "none" }}
                            component={RouterLink}
                            to="/auth/login"
                          >
                            Login
                          </Link>
                        </Typography>

                        <Box></Box>
                      </Stack>
                    </form>
                  )}
                </Formik>
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </Stack>

      <TermsDialog
        open={openMenu}
        handleClose={handleCloseMenu}
        handleOpen={handleOpenMenu}
      />

      <PolicyDialog
        open={openPolicyMenu}
        handleClose={handleClosePolicyMenu}
        handleOpen={handleOpenPolicyMenu}
      />
    </>
  );
};

export default Register;
