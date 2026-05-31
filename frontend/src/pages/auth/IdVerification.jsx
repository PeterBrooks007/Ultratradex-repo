import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import proofofidfront from "../../assets/front-id.jpg";
import proofofidback from "../../assets/back-id.jpg";
import kycIconImg from "../../assets/check.svg";
import { ArrowCircleLeft, Camera } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { idVerificationUpload, RESET_AUTH } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";

const MotionBox = motion(Box);

const IdVerification = ({ handleNext, activeStep, setActiveStep, handleBack, steps }) => {

  const theme = useTheme();
  const dispatch = useDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { isSemiLoading, isError, isSuccess, kycSetupStatus } = useSelector((state) => state.auth);

  const buttonStyles = {
    bgcolor: "text.primary",
    borderRadius: "10px",
    padding: "15px",
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

  const [uploadLoading, setUploadLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const [profileImages, setProfileImages] = useState({
    front: null,
    back: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    back: null,
  });

  const fileInputRefs = {
    front: useRef(null),
    back: useRef(null),
  };

  const handleButtonClick = (type) => {
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current.click();
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImages((prev) => ({ ...prev, [type]: file }));
      setImagePreviews((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    }
  };

  const validateImage = async (file) => {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG and PNG are allowed.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 5MB limit.");
    }

    const isValidImage = await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
    });

    if (!isValidImage) {
      throw new Error("The file is not a valid image.");
    }
  };

  const handleRequestVerification = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    try {
      await Promise.all(
        Object.entries(profileImages).map(async ([type, file]) => {
          if (!file) throw new Error(`No ${type} image selected.`);
          await validateImage(file);
        })
      );

      const formData = new FormData();
      formData.append("frontImage", profileImages.front);
      formData.append("backImage", profileImages.back);

      // Submit the form data (e.g., dispatch or API call here)

        await dispatch(idVerificationUpload(formData))

      // console.log(formData);

      // toast.success("Verification request submitted successfully.");

      setImagePreviews({ front: null, back: null });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (!isSemiLoading &&  !isError && isSuccess && kycSetupStatus === "KYCIDVERIFICATIONUPLOAD_OK") {
      setActiveStep(2)
      dispatch(RESET_AUTH())
    }
  }, [dispatch, isSemiLoading, setActiveStep, isError, isSuccess, kycSetupStatus]);

  return (

    <>
      {isSemiLoading ? (
        <LoadingScreen />
      ) : (

    <Container maxWidth="md">
      <Stack spacing={1}>
        {/* Header Section */}
        <Stack spacing={0}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="700"
            textAlign="center"
          >
            KYC VERIFICATION
          </Typography>

          <MotionBox
            display="flex"
            justifyContent="center"
            variants={motionBoxVariants}
            initial="initial"
            animate="animate"
            p={2}
          >
            <img src={kycIconImg} alt="KYC Icon" width="100px" loading="lazy" />
          </MotionBox>

          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="500"
            textAlign="center"
          >
            Verify your identity!
          </Typography>

          <Typography
            variant={isMobile ? "caption" : "body1"}
            fontWeight="600"
            textAlign="center"
          >
            To continue, please provide us with the front and back of any
            government-recognized IDs.
          </Typography>
        </Stack>

        {/* Content Section */}
        <Stack pt={6} spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={4}
          >
            {["front", "back"].map((type) => (
              <Stack key={type} spacing={1}>
                <Typography variant="subtitle" sx={{ pl: 2 }}>
                  Upload the {type} of the ID
                </Typography>
                <Box display="flex" justifyContent="center">
                  <img
                    src={
                      imagePreviews[type] === null
                        ? type === "front"
                          ? proofofidfront
                          : proofofidback
                        : imagePreviews[type]
                    }
                    alt={`${type} ID`}
                    width="90%"
                    loading="lazy"
                  />
                </Box>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  p={2}
                  onClick={() => handleButtonClick(type)}
                >
                  <Button variant="contained" startIcon={<Camera size={28} />}>
                    Upload {type.charAt(0).toUpperCase() + type.slice(1)} ID
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs[type]}
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, type)}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Divider />

          {/* Button */}
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={buttonStyles}
            onClick={handleRequestVerification}
          >
            Request Verification
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }} mt={2}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeft size={32} />}
        >
         Back to KYC SETUP
        </Button>
      </Box>
    </Container>

)}
    </>

  );
};

export default IdVerification;
