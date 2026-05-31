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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { EnvelopeSimple, GoogleLogo, Lock } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../utils/index.js";
import { forgotPassword, login, RESET_AUTH } from "../../redux/features/auth/authSlice.js";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
// import LogoImg from "./../../assets/opengraph.png";
import LogoImg from "./../../assets/favicon_logo.png";
import { ColorModeContext, tokens } from "../../theme.js";
import AuthMobileHeader from "./AuthMobileHeader.jsx";

const ForgotPassword = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");

  const { user, isLoading } = useSelector(
    (state) => state.auth
  );

  const forgetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter email");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address");
    }

    const userData = {
      email: email.toLowerCase().trim(),
    };

    // console.log(email)
    await dispatch(forgotPassword(userData));
    setEmail("")
  };

  

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
          writeUp={"Login account"}
          buttonText={"Login"}
          link={"/auth/login"}
        />

        {/* Centered Login Form */}
        <Stack flex={1} justifyContent="center" alignItems="center" mx={0}>
          <Container maxWidth="sm">
            <Stack spacing={3} mx={{ xs: 0, md: 4 }} my={2}>
              <Stack spacing={3}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={"700"}
                  textAlign={"center"}
                  pt={2}
                >
                  Forgot Password ?
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={"600"}
                  textAlign={"center"}
                  sx={{border: "1px solid green", p: 2, mt: 2, borderRadius: "10px"}}
                >
                  To reset your password, use the email address associated with your account and double-check it before submitting, as the email&apos;s validity won&apos;t be confirmed for security reasons. 
                </Typography>
              </Stack>

              <Stack spacing={2}>
               

                <form onSubmit={forgetPassword}>
                  <Stack spacing={2}>
                    <TextField
                      
                      fullWidth
                      size="medium"
                      variant="outlined"
                      type="email"
                      // label="Email Address"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                        "Get a new password"
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

export default ForgotPassword;
