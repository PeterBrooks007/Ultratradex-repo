import {
  Avatar,
  Box,
  CircularProgress,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthFooter from "./AuthFooter.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  RESET_AUTH,
  verifyPinRequired,
} from "../../redux/features/auth/authSlice.js";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
import LogoImg from "./../../assets/favicon_logo.png";
import { ColorModeContext, tokens } from "../../theme.js";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice.js";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice.js";
import { motion } from "framer-motion";
import emailIconImg from "../../assets/opened-envelope.png";
import AuthMobileHeader from "./AuthMobileHeader.jsx";

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

const RequestPin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { user, isLoading, isLoggedIn, isSuccess } = useSelector(
    (state) => state.auth
  );

  const size = UseWindowSize();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Focus the first input field on load
  }, []);

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
    let lastFilledIndex = -1;
    for (let i = otp.length - 1; i >= 0; i--) {
      if (otp[i] !== "") {
        lastFilledIndex = i;
        break;
      }
    }
  
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
        pin: enteredOtp,
      };
      // console.log(userData);

      await dispatch(verifyPinRequired(userData));
      setOtp(["", "", "", ""]);
    } else {
      toast.error("Please enter all 4 digits.");
    }
  };

  if (!isLoading && isLoggedIn === false) {
    navigate("/auth/login");
  }

  useEffect(() => {
    if (!isLoading && user?.role !== "admin" && user?.pinRequired == false) {
      navigate("/dashboard");
      dispatch(RESET_AUTH());
    }

    if (!isLoading && user?.role === "admin" && user?.pinRequired == false) {
      navigate("/admin");
      dispatch(RESET_AUTH());
    }
  }, [isLoading, dispatch, navigate,user?.role, user?.pinRequired]);

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    dispatch(RESET_AUTH());
    dispatch(RESET_WITHDRAWAL());
    dispatch(RESET_DEPOSIT());
  };

  return (
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
          <Stack pt={{ xs: 0, md: 2 }} spacing={1}>
            <Avatar
              src={user?.photo}
              alt={user?.firstname}
              style={{ borderRadius: "50%", border: "2px solid grey", width: isMobile ? "100px" : "100px", height: isMobile ? "100px" : "100px" }}
            />
            <Typography>{ user ? user?.firstname + " " + user?.lastname : "Loading..."}</Typography>
          </Stack>

          <Stack p={"0 24px 10px 24px"} spacing={0.5} alignItems={"center"}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={"700"}
              textAlign={"center"}
            >
              Enter Your Pin
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
                    WebkitTextSecurity: "disc", // Obscures the text, acting like a password
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
            pb={2}
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
              <StyledButton
                disabled={isLoading}
                type="button"
                onClick={handleOkClick}
              >
                {isLoading ? <CircularProgress size={16} sx={{color: "white"}} /> : "OK"}
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

          {/* <Stack direction="row" alignItems="center" spacing={1} pb={3} pt={1}>
            <Typography>Did&apos;t get the Email ?</Typography>
            <Button color="secondary" onClick={() => {}}>
              Resend OTP
            </Button>
          </Stack> */}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RequestPin;
