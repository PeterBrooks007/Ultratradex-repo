import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { EnvelopeSimple, GoogleLogo, Lock } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../utils/index.js";
import { login, RESET_AUTH } from "../../redux/features/auth/authSlice.js";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
// import LogoImg from "./../../assets/opengraph.png";
import LogoImg from "./../../assets/favicon_logo.png";
import { ColorModeContext, tokens } from "../../theme.js";
import AuthMobileHeader from "./AuthMobileHeader.jsx";

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const size = UseWindowSize();

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, isLoading, isLoggedIn, isSuccess, is2FARequired } = useSelector(
    (state) => state.auth
  );

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address");
    }

    const userData = {
      email: email.toLowerCase().trim(),
      password,
    };
    await dispatch(login(userData));
  };

  useEffect(() => {

    if (isSuccess && isLoggedIn && is2FARequired) {
      navigate("/auth/2faAuthentication");
      return;
    }

    if (isSuccess && isLoggedIn && user && user?.role === "admin") {
      navigate("/admin");
      return;
    }

    if (isSuccess && isLoggedIn && user && user?.isEmailVerified === false) {
      navigate("/auth/verify-email");
      dispatch(RESET_AUTH());
      return;
    }

    if (
      isSuccess &&
      isLoggedIn &&
      user &&
      (user?.isIdVerified === "NOT VERIFIED" ||
        user?.isIdVerified === "PENDING")
    ) {
      navigate("/auth/account-setup");
      dispatch(RESET_AUTH());
      return;
    }

    if (isSuccess && isLoggedIn && user && user?.role === "customer") {
      navigate("/dashboard");
      dispatch(RESET_AUTH());
      return;
    }
  }, [isLoggedIn, isSuccess, dispatch, navigate, user]);

  return (
    <>
      <Stack
        height="90vh"
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
        {/* <Box position={"absolute"} top={270} left={-50} sx={{opacity: 0.09, transform: "rotate"}}>
          <img src={LogoImg} alt="" />
        </Box> */}

        {/* Top Bar with "Already have an account?" */}

        <AuthMobileHeader
          writeUp={"Don't have an account ?"}
          buttonText={"Register"}
          link={"/auth/register"}
        />

        {/* Centered Login Form */}
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
                  Login with your ultratradex Credendtials
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={"600"}
                  textAlign={"center"}
                >
                  Don&apos;t have an account yet ? go to register.
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    p: 1,
                    color:
                      theme.palette.mode === "light" ? "black" : "lightgrey",
                    borderColor:
                      theme.palette.mode === "light" ? "black" : "grey",
                  }}
                >
                  <GoogleLogo
                    weight="bold"
                    size={22}
                    color={theme.palette.mode === "light" ? "red" : "red"}
                  />{" "}
                  &nbsp; Sign in with Google
                </Button>

                <Divider>or</Divider>

                <form onSubmit={loginUser}>
                  <Stack spacing={2}>
                    <TextField
                      // autoFocus
                      fullWidth
                      size="medium"
                      variant="outlined"
                      type="email"
                      // label="Email Address"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EnvelopeSimple
                              weight="thin"
                              size={26}
                              color={
                                theme.palette.mode === "light" ? "grey" : "grey"
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
                              theme.palette.mode === "light" ? "black" : "grey", // Change the border color to red
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red when focused
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
                      type="password"
                      // label="Password"
                      placeholder="Enter Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              weight="thin"
                              size={28}
                              color={
                                theme.palette.mode === "light" ? "grey" : "grey"
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
                              theme.palette.mode === "light" ? "black" : "grey", // Change the border color to red
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red when focused
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

                    <Stack justifyContent={"flex-end"} alignItems={"flex-end"}>
                      <Link
                        sx={{ color: "", textDecoration: "none", mt: -1.5 }}
                        component={RouterLink}
                        to="/auth/forgot-password"
                      >
                        <Button
                          variant="subtitle2"
                          textAlign={"center"}
                          fontWeight={500}
                          sx={{
                            color:
                              theme.palette.mode === "light"
                                ? "#009e4a"
                                : "rgba(0, 255, 127, 0.8)",
                          }}
                        >
                          Forgot Credentials ?
                        </Button>
                      </Link>
                    </Stack>

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
                        "Login Account"
                      )}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </Stack>
    </>
  );
};

export default Login;
