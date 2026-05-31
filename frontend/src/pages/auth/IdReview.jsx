import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import proofofidfront from "../../assets/front-id.jpg";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import kycIconImg from "../../assets/check.svg";
import { useNavigate } from "react-router-dom";
import { logout, RESET_AUTH } from "../../redux/features/auth/authSlice";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";


const MotionBox = motion(Box);


const IdReview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {  user, } = useSelector((state) => state.auth);

  // Reusable Button Styles
  const buttonStyles = {
    bgcolor: "text.primary",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "50px",
    fontWeight: "600",
    color: (theme) =>
      theme.palette.mode === "light" ? "common.white" : "grey.800",
    "&:hover": {
      bgcolor: "text.primary",
      color: (theme) =>
        theme.palette.mode === "light" ? "common.white" : "grey.800",
    },
  };

  const motionBoxVariants = {
    initial: { y: -5 },
    animate: {
      y: 5,
      transition: {
        type: "smooth",
        repeatType: "mirror",
        duration: 1.5,
        repeat: Infinity,
        delay: 0.8,
      },
    },
  };

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    dispatch(RESET_AUTH());
    dispatch(RESET_WITHDRAWAL());
    dispatch(RESET_DEPOSIT());
  };


  return (
    <Container maxWidth="md">
      <Stack spacing={1} my={2}>
        {/* Header Section */}
        <Stack spacing={1.5}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="700"
            textAlign="center"
          >
            KYC VERIFICATION
          </Typography>

          {/* <MotionBox
            display="flex"
            justifyContent="center"
            variants={motionBoxVariants}
            initial="initial"
            animate="animate"
            p={2}
          >
            <img src={kycIconImg} alt="KYC Icon" width="100px" loading="lazy" />
          </MotionBox> */}

          <Box display="flex" justifyContent="center">
            <img
              src={user?.idVerificationPhoto.front}
              alt="KYC Document"
              width="80%"
              loading="lazy"
              style={{ borderRadius: "10px" }}
            />
          </Box>

          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="600"
            textAlign="center"
            color="orange"
          >
            Verification Pending
          </Typography>

          <Typography
            variant={isMobile ? "caption" : "body1"}
            fontWeight="600"
            textAlign="center"
          >
           Hello <span style={{fontWeight: 800}}>{user?.firstname+ " " +user?.lastname }, </span> We are currently reviewing your documents. This may take a while.
          </Typography>
        </Stack>

        {/* Body Section */}
        <Stack pt={3} spacing={3}>
          <Box width="100%">
            <Typography variant="body1" textAlign="center">
              The data that we collect from you may be transferred to, and
              stored at, a destination outside of the United States. It may
              also be processed by staff operating outside of the United States
              who work for us or for one of our suppliers. By submitting your
              personal data, you agree to this transfer, storing, or
              processing, as detailed above. All information you provide to us is stored on our or
              third-party cloud servers.
            </Typography>
          </Box>

          {/* Logout Button */}
          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            sx={buttonStyles}
            onClick={logoutUser}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default IdReview;
