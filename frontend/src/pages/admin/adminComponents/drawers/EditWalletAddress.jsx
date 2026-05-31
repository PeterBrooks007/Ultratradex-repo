import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Camera, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { updateWalletAddresIcon, updateWalletAddresQrcode, updateWalletAddress } from "../../../../redux/features/walletAddress/walletAddressSlice";

const EditWalletAddress = ({
  open,
  handleClose,
  handleOpen,
  walletAddressDrawerLoader,
  setWalletAddressDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { walletAddress } = useSelector(
    (state) => state.walletAddress
  );

  useEffect(() => {
    if (walletAddressDrawerLoader) {
      const timer = setTimeout(() => {
        setWalletAddressDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [walletAddressDrawerLoader, setWalletAddressDrawerLoader]);

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    walletName: walletAddress?.walletName || "",
    walletSymbol: walletAddress?.walletSymbol || "",
    walletAddress: walletAddress?.walletAddress || "",
    // walletPhoto: walletAddress?.walletPhoto || "",
    
  };

  // // //DOMPurify Config setup
  // DOMPurify.setConfig({
  //   ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // Only allow essential tags
  //   ALLOWED_ATTR: ['href', 'title'], // Only allow safe attributes
  //   FORBID_TAGS: ['style', 'iframe', 'object', 'embed'], // Block risky tags
  //   FORBID_ATTR: ['src', 'onerror', 'onload'], // Block risky attributes
  //   ALLOWED_URI_REGEXP: /^(https?|ftp|mailto|tel|file):/, // Safe URL schemes only
  //   SAFE_FOR_TEMPLATES: true, // Sanitize inline styles
  //   RETURN_TRUSTED_TYPE: true, // Return as DOM element if applicable
  //   WHOLE_DOCUMENT: false, // Not sanitizing full HTML documents
  //   MUSTACHE_TEMPLATES: false, // Prevent code injections via template engines
  // });
  

   // Helper function to decode HTML entities
function decodeEntities(encodedString) {
  const textarea = document.createElement('textarea');
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

  const userSchema = yup.object().shape({
    walletName: yup
    .string()
    .sanitize()
    .required("walletName required")
    .min(2, "walletName must be at least 2 characters long")
    .max(100, "walletName cannot exceed 100 characters"),
  walletSymbol: yup
    .string()
    .sanitize()
    .required("walletSymbol required")
    .min(2, "walletSymbol must be at least 2 characters long")
    .max(50, "walletSymbol cannot exceed 50 characters"),
  walletAddress: yup
    .string()
    .sanitize()
    .required("walletAddress required")
    .min(2, "walletAddress must be at least 2 characters long")
    .max(200, "walletAddress cannot exceed 200 characters"),
  // walletPhoto: yup
  //   .string()
  //   .sanitize()
  //   .required("walletPhoto required")
  //   .min(2, "walletPhoto must be at least 2 characters long")
  //   .max(200, "walletPhoto cannot exceed 200 characters"),
  });


  const [formData, setFormData] = useState(initialState);
  const {walletName, walletPhoto, walletQrcode } =
    formData;

  useEffect(() => {
    if (walletAddress) {
      setFormData({
        walletName: walletAddress?.walletName || "",
        walletSymbol: walletAddress?.walletSymbol || "",
        walletAddress: walletAddress?.walletAddress || "",
        walletPhoto: walletAddress?.walletPhoto || "",
        walletQrcode: walletAddress?.walletQrcode || "",
      });
    }
  }, [walletAddress]);



  const handleFormSubmit = async (values) => {

    const userData = values;

    const id = walletAddress._id;

    // console.log(id, userData);


    await dispatch(updateWalletAddress({ id, userData }));

  };


  const [uploadLoading, setUploadLoading] = useState(false);

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


  const [profileImageQrcode, setProfileImageQrcode] = useState(null);
  const [imagePreviewQrcode, setImagePreviewQrcode] = useState(null);
  const fileInputRefQrcode = useRef(null);

  const handleButtonClickQrcode = () => {
    if (fileInputRefQrcode.current) {
      fileInputRefQrcode.current.click();
    }
  };

  const handleImageChangeQrcode = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageQrcode(file);
      setImagePreviewQrcode(URL.createObjectURL(e.target.files[0]));
    }
  };


  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  const savePhoto = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
  
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
  
        const id = walletAddress._id;
  
        dispatch(updateWalletAddresIcon({ id, formData }));

        // console.log({id, formData })
  
        // Reset the image preview and loading state
        setImagePreview(null);
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

  const savePhotoQrcode = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
  
    try {
      if (profileImageQrcode !== null) {
        // Check if the file is an allowed image type
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(profileImageQrcode.type)) {
          toast.error("Invalid file type. Only JPEG and PNG are allowed.");
          setUploadLoading(false);
          return;
        }
  
        // Check if the file size exceeds the limit
        if (profileImageQrcode.size > MAX_FILE_SIZE) {
          toast.error("File size exceeds the 5MB limit.");
          setUploadLoading(false);
          return;
        }
  
       
  
        // Check if the compressed file is a valid image by loading it
        const imageLoadCheck = new Promise((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(profileImageQrcode);
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
        formData.append("image", profileImageQrcode);
  
        const id = walletAddress._id;
  
        dispatch(updateWalletAddresQrcode({ id, formData }));

        // console.log({id, formData })

  
        // Reset the image preview and loading state
        setImagePreview(null);
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
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        setImagePreview(null);
        handleClose();
      }}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "550px" },
        },
      }}
    >
      {walletAddressDrawerLoader ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: `${
                theme.palette.mode === "light"
                  ? "lightgrey"
                  : colors.dashboardbackground[100]
              }`,
              top: 0,
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
              <IconButton
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, border: "2px solid grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Edit Wallet Address
              </Typography>
            </Toolbar>
          </AppBar>

          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <CircularProgress />
          </Stack>
        </Box>
      ) : (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: `${
                theme.palette.mode === "light"
                  ? "lightgrey"
                  : colors.dashboardbackground[100]
              }`,
              top: 0,
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
              <IconButton
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, border: "2px solid grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Edit Wallet Address
              </Typography>
            </Toolbar>
          </AppBar>

          <Box p={2}>
            <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
              <Typography variant="body1" fontWeight={"bold"}>
                Edit this Wallet
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#009e4a", color: "white" }}
                onClick={() => setIsEditing(true)}
              >
                Edit Wallet Address
              </Button>
            </Stack>

            <Divider flexItem />

            <Stack
              direction={"row"}
              alignItems={"center"}
              p={"10px"}
              spacing={1}
            >
              <Badge
                onClick={handleButtonClick}
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }} // Hide the file input
                      onChange={handleImageChange}
                    />
                    <IconButton>
                      <Camera size={35} weight="bold" />
                    </IconButton>
                  </>
                }
              >
                <img
                  src={imagePreview === null ? walletPhoto : imagePreview}
                  alt="walletIcon"
                  width={"100px"}
                  height={"100px"}
                  style={{
                    border: "4px solid grey",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "white"
                  }}
                />
              </Badge>

              <Stack>
                <Typography variant="h6" fontWeight={"600"}>
                  {walletName} Wallet
                </Typography>
                <Typography variant="subtitle2">
                Click the camera icon to change the wallet Icon
              </Typography>
                
              </Stack>
            </Stack>
            {imagePreview !== null && (
              <Box spacing={0.5} mb={3}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={savePhoto}
                  disabled={uploadLoading && true}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "grey",
                      color: "white",
                    },
                  }}
                >
                  {uploadLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "UPLOAD PHOTO"
                  )}
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setImagePreview(null)}
                  sx={{ ml: 1 }}
                >
                  <X size={20} /> Cancel upload
                </Button>
              </Box>
            )}
            <Divider />

            <Stack
              direction={"row"}
              alignItems={"center"}
              p={"10px"}
              spacing={1}
              mb={2}
            >
              <Badge
                onClick={handleButtonClickQrcode}
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRefQrcode}
                      style={{ display: "none" }} // Hide the file input
                      onChange={handleImageChangeQrcode}
                    />
                    <IconButton>
                      <Camera size={35} weight="bold" />
                    </IconButton>
                  </>
                }
              >
                <img
                  src={imagePreviewQrcode === null ? walletQrcode : imagePreviewQrcode}
                  alt="walletIcon"
                  width={"150px"}
                  height={"150px"}
                  style={{
                    border: "4px solid grey",
                    // borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Badge>

              <Stack>
              <Typography variant="h6" fontWeight={"600"}>
                Change Wallet QRcode
              </Typography>
              <Typography variant="subtitle2">
                Click the image to change the QR code Image
              </Typography>
            </Stack>
            </Stack>
            {imagePreviewQrcode !== null && (
              <Box spacing={0.5} mb={3}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={savePhotoQrcode}
                  disabled={uploadLoading && true}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "grey",
                      color: "white",
                    },
                  }}
                >
                  {uploadLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "UPLOAD PHOTO"
                  )}
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setImagePreviewQrcode(null)}
                  sx={{ ml: 1 }}
                >
                  <X size={20} /> Cancel upload
                </Button>
              </Box>
            )}

          
            <Formik
        onSubmit={handleFormSubmit}
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
                label="Wallet Name"
                name="walletName"
                value={values.walletName}
                error={!!touched.walletName && !!errors.walletName}
                helperText={touched.walletName && errors.walletName}
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                disabled={!isEditing && true}
                inputProps={{ maxLength: 101 }}
              />
              <TextField
                fullWidth
                size="medium"
                variant="outlined"
                type="text"
                label="Wallet Symbol"
                name="walletSymbol"
                value={values.walletSymbol}
                error={!!touched.walletSymbol && !!errors.walletSymbol}
                helperText={touched.walletSymbol && errors.walletSymbol}
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                disabled={!isEditing && true}
                inputProps={{ maxLength: 51 }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                fullWidth
                size="medium"
                variant="outlined"
                type="text"
                label="Wallet Address"
                name="walletAddress"
                value={values.walletAddress}
                error={
                  !!touched.walletAddress && !!errors.walletAddress
                }
                helperText={
                  touched.walletAddress && errors.walletAddress
                }
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                disabled={!isEditing && true}
                inputProps={{ maxLength: 201 }}
              />
            </Stack>
            {/* <Stack direction={"row"} spacing={2}>
              <TextField
                fullWidth
                size="medium"
                variant="outlined"
                type="text"
                label="Wallet Icon"
                name="walletPhoto"
                value={values.walletPhoto}
                error={!!touched.walletPhoto && !!errors.walletPhoto}
                helperText={touched.walletPhoto && errors.walletPhoto}
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                inputProps={{ maxLength: 200 }}
              />
            </Stack> */}

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
                  theme.palette.mode === "light"
                    ? "common.white"
                    : "grey.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.whitw"
                      : "grey.800",
                },
              }}
              disabled={uploadLoading || isEditing === false}
              
            >
              {uploadLoading ? (
                <CircularProgress size={22} />
              ) : (
                " Update Wallet address"
              )}
            </Button>
          </Stack>
        </form>
             )}
      </Formik>


          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default EditWalletAddress;
