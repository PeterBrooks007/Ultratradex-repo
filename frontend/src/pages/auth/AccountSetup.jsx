import { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Container,
  useMediaQuery,
  Stack,
} from "@mui/material";
import KycVerification from "./KycVerification";
import IdVerification from "./IdVerification";
import IdReview from "./IdReview";
import { useTheme } from "@emotion/react";
import LogoImg from "./../../assets/opengraph.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RESET_AUTH } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AuthMobileHeader from "./AuthMobileHeader";

const steps = ["Personal Details", "Identity Verification", "Under Review"];

export default function IdVerificationStepper() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);

  const { isLoading, isLoggedIn, user, kycSetupStatus } = useSelector(
    (state) => state.auth
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (user?.isIdVerified === "NOT VERIFIED" && kycSetupStatus === "") {
      setActiveStep(0);
      dispatch(RESET_AUTH());
    }

    if (
      user?.isIdVerified === "NOT VERIFIED" &&
      user?.address.address !== "Not provided"
    ) {
      setActiveStep(1);
      dispatch(RESET_AUTH());
    }

    if (user?.isIdVerified === "PENDING") {
      setActiveStep(2);
      dispatch(RESET_AUTH());
    }

    if (isLoggedIn && user?.isIdVerified === "VERIFIED") {
      navigate("/dashboard");
      dispatch(RESET_AUTH());
    }
  }, [user, dispatch, setActiveStep, kycSetupStatus, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoading && isLoggedIn === false) {
      navigate("/auth/login");
      return;
    }
  }, [isLoggedIn, navigate, isLoading]);

  useEffect(() => {
    if (!isLoading && user && user?.isEmailVerified === false) {
      navigate("/auth/verify-email");
      return;
    }
  }, [isLoading, navigate, user]);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <KycVerification
            handleNext={handleNext}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            steps={steps}
          />
        );
      case 1:
        return (
          <IdVerification
            handleNext={handleNext}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            steps={steps}
          />
        );
      case 2:
        return <IdReview />;
      default:
        return;
    }
  };

  return (
    <>
      {isLoading || !user ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth="md">
          <Box
            sx={{
              m: 1,
              p: { xs: 0, md: 3 },
              maxWidth: "xl",
              mx: "auto",
              mt: { xs: 2, md: 0 },
            }}
          >
            {isSmallScreen ? (
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                m={0}
              >
                <Box mx={-1}>
                <AuthMobileHeader
                  accountSetup={true}
                />
                </Box>

                <Typography variant="h6" sx={{ textAlign: "center", mb: 0 }}>
                  Step {activeStep + 1}/{steps.length}
                </Typography>
              </Stack>
            ) : (
              <Stepper activeStep={activeStep} sx={{ overflowX: "auto" }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            <Box sx={{ mt: 4, mb: 2, mx: -1.5 }}>
              {getStepContent(activeStep)}
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}
