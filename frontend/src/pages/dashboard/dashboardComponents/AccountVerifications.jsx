import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CheckCircle, CloudArrowUp, X, XCircle } from "@phosphor-icons/react";
import proofofidfront from "../../../assets/proof_of_identity1.png";
import proofofresidency from "../../../assets/proof_of_residency1.png";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { residencyVerification } from "../../../redux/features/auth/authSlice";

const AccountVerifications = ({ verificationDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();

  const dispatch = useDispatch();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const elevation = theme.palette.mode === "light" ? 1 : 0;

  const { isLoading, user } = useSelector((state) => state.auth);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const [uploadLoading, setUploadLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const savePhoto = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    //  if(imagePreview === null) toast.error("No image selected.");

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

        // Check if the compressed file is a valid image by loading it
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
        formData.append("image", profileImage);

        const id = user?._id;

        dispatch(residencyVerification({ id, formData }));

        // console.log({ id, formData })

        // Reset the image preview and loading state
        setImagePreview(null);
        setProfileImage(null);
        setUploadLoading(false);
      } else {
        toast.error("No image selected.");
        setUploadLoading(false);
      }
    } catch (error) {
      setUploadLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Stack
        spacing={2}
        component={Paper}
        p={4}
        borderRadius={"10px"}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant={size.width <= 899 ? "body2" : "h6"}>
            ID VERIFICATION
          </Typography>
          <Typography
            variant={size.width <= 899 ? "body2" : "h6"}
            textAlign={"right"}
          >
            {" "}
            {/* STATUS:{" "} */}
            <Chip
              size="large"
              icon={
                user?.isIdVerified ? (
                  <CheckCircle
                    color={user?.isIdVerified ? undefined : "white"}
                    size={20}
                  />
                ) : (
                  <XCircle
                    color={user?.isIdVerified ? undefined : "white"}
                    size={20}
                  />
                )
              }
              label={user?.isIdVerified ? "VERIFIED" : "NOT VERIFIED"}
              color={user?.isIdVerified ? "success" : "default"}
              sx={{
                backgroundColor: user?.isIdVerified ? undefined : "grey.800",
                color: user?.isIdVerified ? undefined : "white",
              }}
            />
          </Typography>
        </Stack>

        <Divider />

        <Stack pt={3} spacing={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle">
              Upload the front of the ID
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              display={"flex"}
              height={{ xs: "auto", sm: "250px" }}
              spacing={2}
            >
              <Box
                flex={{ lg: "45%", xl: verificationDrawer ? "50%" : "30%" }}
                sx={{
                  backgroundColor: `${theme.palette.background}`,
                  width: "100%",
                  height: "100%",
                  border: "2px solid grey",
                  borderRadius: "20px",
                }}
              >
                <img
                  src={user?.idVerificationPhoto?.front || proofofidfront}
                  alt="id front"
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "15px" }}
                />
              </Box>
              <Box
                flex={{ lg: "55%", xl: verificationDrawer ? "50%" : "70%" }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  border: "2px dashed grey",
                  height: { xs: "100%", sm: "100%", md: "100%" },
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Stack justifyContent={"center"} alignItems={"center"}>
                  <CloudArrowUp sx={{ fontSize: { xs: "28px", md: "48px" } }} />

                  <Typography
                    textAlign={"center"}
                    p={0.5}
                    variant={isMobile ? "caption" : "h6"}
                    color={"grey"}
                  >
                    click to upload a file
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle">
              Upload the Back of the ID
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              display={"flex"}
              height={{ xs: "auto", sm: "250px" }}
              spacing={2}
            >
              <Box
                flex={{ lg: "45%", xl: verificationDrawer ? "50%" : "30%" }}
                sx={{
                  backgroundColor: `${theme.palette.background}`,
                  width: "100%",
                  height: "100%",
                  border: "2px solid grey",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={user?.idVerificationPhoto?.back || proofofidfront}
                  alt="dummyprofileimg"
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "15px" }}
                />
              </Box>
              <Box
                flex={{ lg: "55%", xl: verificationDrawer ? "50%" : "70%" }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  border: "2px dashed grey",
                  height: { xs: "100%", sm: "100%", md: "100%" },
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Stack justifyContent={"center"} alignItems={"center"}>
                  <CloudArrowUp sx={{ fontSize: { xs: "28px", md: "48px" } }} />

                  <Typography
                    textAlign={"center"}
                    p={0.5}
                    variant={isMobile ? "caption" : "h6"}
                    color={"grey"}
                  >
                    click to upload a file
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            disabled={user?.isIdVerified}
            sx={{
              bgcolor: "text.primary",
              borderRadius: "10px",
              padding: "15px",
              fontWeight: "600",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.whitw" : "grey.800",
              },
            }}
          >
            Request Verification
          </Button>
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        component={Paper}
        p={4}
        borderRadius={"10px"}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
        mt={4}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant={size.width <= 899 ? "body2" : "h6"}>
            RESIDENCY VERIFICATION
          </Typography>
          <Typography
            variant={size.width <= 899 ? "body2" : "h6"}
            textAlign={"right"}
          >
            {" "}
            {/* STATUS:{" "} */}
            <Chip
              size="large"
              icon={
                user?.isResidencyVerified === "VERIFIED" ? (
                  <CheckCircle
                    color={user?.isResidencyVerified ? undefined : "white"}
                    size={20}
                  />
                ) : (
                  <XCircle
                    color={user?.isResidencyVerified ? undefined : "white"}
                    size={20}
                  />
                )
              }
              label={
                user?.isResidencyVerified === "VERIFIED"
                  ? "VERIFIED"
                  : user?.isResidencyVerified === "PENDING"
                  ? "PENDING"
                  : "NOT VERIFIED"
              }
              color={
                user?.isResidencyVerified === "VERIFIED"
                  ? "success"
                  : user?.isResidencyVerified === "PENDING"
                  ? "warning"
                  : "default"
              }
              sx={{
                backgroundColor:
                  user?.isResidencyVerified === "VERIFIED"
                    ? undefined
                    :  user?.isResidencyVerified === "PENDING"
                    ? "orange" : "grey.800",
                color:
                  user?.isResidencyVerified === "VERIFIED"
                    ? undefined
                    : user?.isResidencyVerified === "PENDING"
                    ? "black" : "white",
              }}
            />
          </Typography>
        </Stack>

        <Divider />

        <Stack pt={3} spacing={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle">
              Upload a proof of residency
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              display={"flex"}
              height={{ xs: "350px", sm: "250px" }}
              spacing={2}
            >
              <Box
                flex={{ lg: "45%", xl: verificationDrawer ? "50%" : "30%" }}
                sx={{
                  backgroundColor: `${theme.palette.background}`,
                  width: "100%",
                  height: "100%",
                  border: "2px solid grey",
                  borderRadius: "20px",
                }}
              >
                <img
                  // src={proofofresidency}
                  src={imagePreview === null ? proofofresidency : imagePreview}
                  alt="proof of residency"
                  width={"100%"}
                  height={"100%"}
                />
              </Box>

              <Box
                flex={{ lg: "55%", xl: verificationDrawer ? "50%" : "70%" }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  border: "2px dashed grey",
                  height: { xs: "100%", sm: "100%", md: "100%" },
                  width: "100%",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
                onClick={handleButtonClick}
              >
                <Stack justifyContent={"center"} alignItems={"center"}>
                  <CloudArrowUp sx={{ fontSize: { xs: "28px", md: "48px" } }} />

                  <Typography
                    textAlign={"center"}
                    p={0.5}
                    variant={isMobile ? "caption" : "h6"}
                  >
                    click to upload a file
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
            </Stack>
          </Stack>

          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <Button
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              onClick={savePhoto}
              sx={{
                bgcolor: "text.primary",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: "600",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.whitw"
                      : "grey.800",
                },
              }}
            >
              Request Verification
            </Button>
            <Button
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "text.primary",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: "600",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.whitw"
                      : "grey.800",
                },
                display: imagePreview !== null ? "block" : "none",
              }}
              onClick={() => {
                setImagePreview(null);
                setProfileImage(null);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AccountVerifications;
