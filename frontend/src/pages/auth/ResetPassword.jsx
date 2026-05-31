import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {  resetPassword } from "../../redux/features/auth/authSlice.js";
import LogoImg from "./../../assets/favicon_logo.png";
import AuthMobileHeader from "./AuthMobileHeader.jsx";
import { Lock } from "@phosphor-icons/react";

const ResetPassword = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {token} = useParams()

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");

  const { isLoading } = useSelector(
    (state) => state.auth
  );

  const resetPasswordNow = async (e) => {
    e.preventDefault();
    if (!password || !cPassword) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be up to 6 characters");
    }
 
    if (password !== cPassword) {
      return toast.error("Password and confirm password does not match");
    }
 

    const userData = {
      token,
      newPassword: password,
    };
    await dispatch(resetPassword(userData));
    setPassword("")
    setCpassword("")
    // console.log(userData)
    
  };

  // useEffect(() => {

  //   if (isSuccess && isLoggedIn && is2FARequired) {
  //     navigate("/auth/2faAuthentication");
  //     return;
  //   }

  //   if (isSuccess && isLoggedIn && user && user?.role === "admin") {
  //     navigate("/admin");
  //     return;
  //   }

  //   if (isSuccess && isLoggedIn && user && user?.isEmailVerified === false) {
  //     navigate("/auth/verify-email");
  //     dispatch(RESET_AUTH());
  //     return;
  //   }

  //   if (
  //     isSuccess &&
  //     isLoggedIn &&
  //     user &&
  //     (user?.isIdVerified === "NOT VERIFIED" ||
  //       user?.isIdVerified === "PENDING")
  //   ) {
  //     navigate("/auth/account-setup");
  //     dispatch(RESET_AUTH());
  //     return;
  //   }

  //   if (isSuccess && isLoggedIn && user && user?.role === "customer") {
  //     navigate("/dashboard");
  //     dispatch(RESET_AUTH());
  //     return;
  //   }
  // }, [isLoggedIn, isSuccess, dispatch, navigate, user]);

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
          writeUp={"Login Account"}
          buttonText={"Login"}
          link={"/auth/login"}
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
                  Reset Password
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={"600"}
                  textAlign={"center"}
                >
                  set a new password for your account
                </Typography>
              </Stack>

              <Stack spacing={2}>
               

                <form onSubmit={resetPasswordNow}>
                  <Stack spacing={2}>
                    

                    <TextField
                      required
                      fullWidth
                      size="medium"
                      variant="outlined"
                      type="password"
                      // label="Password"
                      placeholder="Enter New Password"
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

                    <TextField
                    required
                      fullWidth
                      size="medium"
                      variant="outlined"
                      type="password"
                      // label="Password"
                      placeholder="Confirm New Password"
                      name="password"
                      value={cPassword}
                      onChange={(e) => setCpassword(e.target.value)}
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
                        "Change Password"
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

export default ResetPassword;
