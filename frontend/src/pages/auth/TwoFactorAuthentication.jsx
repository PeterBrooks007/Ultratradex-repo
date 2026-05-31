import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import emailIconImg from "../../assets/opened-envelope.png";
import LogoImg from "./../../assets/opengraph.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import UseWindowSize from "../../hooks/UseWindowSize";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { ColorModeContext, tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  RESET_AUTH,
  sendOTP,
  verifyOTP,
} from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AuthMobileHeader from "./AuthMobileHeader";

const MotionBox = motion(Box);

const NumberButtonsWrapper = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridGap: "10px",
  width: "300px",
  margin: "0 auto",
  textAlign: "center",
});

const StyledButton = styled("button")({
  backgroundColor: "grey",
  border: "none",
  color: "white",
  fontSize: "20px",
  padding: "14px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  "&:active": {
    boxShadow: "none",
    transform: "translateY(2px)",
  },
});

const TwoFactorAuthentication = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const size = UseWindowSize();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isLoggedIn, isSuccess, verificationEmail, user } =
    useSelector((state) => state.auth);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown timer
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Focus the first input field on load
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [resendTimer]);


  const handleButtonClick = (value) => {
    const emptyIndex = otp.findIndex((digit) => digit === "");
    if (emptyIndex !== -1) {
      const newOtp = [...otp];
      newOtp[emptyIndex] = value;
      setOtp(newOtp);
      if (emptyIndex < 3) {
        inputRefs.current[emptyIndex + 1]?.focus();
      }
    }
  };

  const handleDelete = () => {
    const lastFilledIndex = otp.findLastIndex((digit) => digit !== "");
    if (lastFilledIndex !== -1) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleOkClick = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      // console.log("OTP entered:", enteredOtp);

      // Add logic to verify OTP
      const userData = {
        email: verificationEmail || user?.email,
        otp: enteredOtp,
        twofaAuthentication: true,
      };
      // console.log(userData);

      await dispatch(verifyOTP(userData));
      setOtp(["", "", "", ""]);
    } else {
      toast.error("Please enter all 4 digits.");
    }
  };


  const sendOTPnow = async () => {
    const userData = {
      email: verificationEmail || user?.email,
      twofaAuthentication: true,
    };

    // console.log(userData);

      verificationEmail && await dispatch(sendOTP(userData));
      setResendTimer(60)
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn && user && user?.role !== "admin") {
      navigate("/dashboard/home");
      // dispatch(RESET_AUTH());
      return;
    }
  }, [dispatch, isLoggedIn, navigate, user, isSuccess]);

  useEffect(() => {
    if (isSuccess && isLoggedIn && user && user?.role === "admin") {
      navigate("/admin");
      // dispatch(RESET_AUTH());
      return;
    }
  }, [dispatch, isLoggedIn, navigate, user, isSuccess]);

 
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack height={size.height} justifyContent="space-between">
          <AuthMobileHeader
            writeUp={"Login to another account?"}
            buttonText={"Logout"}
            link={"logoutUser"}
          />

          <Stack flex={1} justifyContent={"center"} alignItems={"center"}>
            <Stack
              border={{ xs: "none", sm: "1px solid grey" }}
              justifyItems={"center"}
              alignItems={"center"}
              spacing={2}
              p={{ xs: 0, sm: 5 }}
              borderRadius={"15px"}
            >
              <MotionBox
                pt={{ xs: 0, md: 2 }}
                initial={{ y: -5 }}
                animate={{ y: 10 }}
                transition={{
                  type: "smooth",
                  repeatType: "mirror",
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.8,
                }}
              >
                <img
                  src={emailIconImg}
                  alt="emailIconImg"
                  width={isMobile ? "130px" : "150px"}
                />
              </MotionBox>

              <Stack p={"0 24px 10px 24px"} spacing={0.5} alignItems={"center"}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={"700"}
                  textAlign={"center"}
                >
                  2fa Authentication
                </Typography>
                <Typography
                  variant={isMobile ? "caption" : "subtitle2"}
                  textAlign={"center"}
                  width={"80%"}
                  margin={"0 auto"}
                >
                  Enter the four digits sent to your email address
                </Typography>
              </Stack>

              <Box>
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"center"}
                  mb={2}
                >
                  {otp.map((digit, index) => (
                    <div
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    contentEditable={false} // Prevents the div from being editable
                    suppressContentEditableWarning={true} // Avoids React warning
                    style={{
                      width: "40px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "1rem",
                      cursor: "default",
                      padding: "12px 8px",
                      border: "1px solid grey", // Optional: adds border for style
                      borderRadius: "10px",
                      backgroundColor: "transparent", // Optional: background color
                      // WebkitTextSecurity: "disc", // Obscures the text, acting like a password
                    }}
                  >
                    {digit}
                  </div>

                   

                  ))}
                </Stack>
              </Box>

              <Box
                display={"flex"}
                flexWrap={"wrap"}
                gap={2}
                width={"300px"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <NumberButtonsWrapper>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <StyledButton
                      key={i}
                      type="button"
                      onClick={() => handleButtonClick(i.toString())}
                    >
                      {i}
                    </StyledButton>
                  ))}
                  <StyledButton type="button" onClick={handleOkClick}>
                    OK
                  </StyledButton>
                  <StyledButton
                    type="button"
                    onClick={() => handleButtonClick("0")}
                  >
                    0
                  </StyledButton>
                  <StyledButton type="button" onClick={handleDelete}>
                    Del
                  </StyledButton>
                </NumberButtonsWrapper>
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                pb={3}
                pt={1}
              >
                 <Typography>Did&apos;t get the Email?</Typography>
                {resendTimer > 0 ? (
                  <Typography color="secondary">
                    Resend in {resendTimer}s
                  </Typography>
                ) : (
                  <Button color="secondary" onClick={sendOTPnow}>
                    Resend OTP
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default TwoFactorAuthentication;
