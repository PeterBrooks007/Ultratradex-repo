import  { useEffect, useRef, useState } from "react";
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

import { updateConnectWallet, updateConnectWalletPhoto } from "../../../../redux/features/connectWallet/connectWalletSlice";

const EditConnectWallet = ({
  open,
  handleClose,
  handleOpen,
  connectWalletDrawerLoader,
  setConnectWalletDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isLoading, wallet } = useSelector(
    (state) => state.connectWallet
  );

  useEffect(() => {
    if (connectWalletDrawerLoader) {
      const timer = setTimeout(() => {
        setConnectWalletDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [connectWalletDrawerLoader, setConnectWalletDrawerLoader]);

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    name: wallet?.name || "",
    photo: wallet?.photo || "",
  };


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
    name: yup
      .string()
      .sanitize()
      .required("Wallet name is required")
      .min(2, "Wallet name must be at least 2 characters long")
      .max(100, "Wallet name cannot exceed 100 characters"),
    
  });



  const [formData, setFormData] = useState(initialState);
  const { name, photo } =
    formData;

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet?.name || "",
        photo: wallet?.photo || "",
      });
    }
  }, [wallet]);



  const handleFormSubmit = async (values) => {

    const userData = values;

    const id = wallet?._id;


    await dispatch(updateConnectWallet({ id, userData }));
    // console.log(id, userData)

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
  
        const id = wallet?._id;
  
        dispatch(updateConnectWalletPhoto({ id, formData }));

        // console.log(id, formData)
  
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
      {connectWalletDrawerLoader ? (
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
                sx={{ mr: 2, backgroundColor: "grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Edit Connect Wallet
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
                sx={{ mr: 2, backgroundColor: "grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
              Edit Connect Wallet
              </Typography>
            </Toolbar>
          </AppBar>

          <Box p={2}>
            <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
              <Typography variant="body1" fontWeight={"bold"}>
                Edit this wallet
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#009e4a", color: "white" }}
                onClick={() => setIsEditing(true)}
              >
                Edit Wallet
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
                  src={imagePreview === null ? photo : imagePreview}
                  alt="profileimage"
                  width={"120px"}
                  height={"120px"}
                  style={{
                    border: "4px solid grey",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Badge>

              <Stack>
                <Typography variant="h6" fontWeight={"600"}>
                  {name} wallet
                </Typography>
                <Typography variant="subtitle2" >
                  Click the image to change wallet image
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
              <Stack spacing={2} mt={2}>
                <Stack direction={"row"} spacing={2}>
                  <TextField
                    fullWidth
                    size="medium"
                    variant="outlined"
                    type="text"
                    label="Wallet Name"
                    name="name"
                    value={values.name}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
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

                  
                </Stack>
               
              

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
                  disabled={isLoading || (!isEditing && true)}
                >
                  {isLoading ? (
                    <CircularProgress size={28} />
                  ) : (
                    "Make Changes"
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

export default EditConnectWallet;
