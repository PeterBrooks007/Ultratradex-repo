import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import { IOSSwitch } from "../Profile";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  changePin,
  twofaAuthentication,
} from "../../../redux/features/auth/authSlice";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const SecuritySystem = ({ changePasswordDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const elevation = theme.palette.mode === "light" ? 1 : 0;
  const size = UseWindowSize();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  const initialState = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const initialStatePin = {
    currentPin: "",
    newPin: "",
    confirmPin: "",
  };

  // Helper function to decode HTML entities
  function decodeEntities(encodedString) {
    const textarea = document.createElement("textarea");
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
    currentPassword: yup
      .string()
      .sanitize()
      .required("Current Password required")
      // .matches(/^[a-zA-Z]+$/, "First name must only contain letters")
      .min(6, "Current Password must be at least 6 characters long")
      .max(50, "Current Password cannot exceed 50 characters"),
    newPassword: yup
      .string()
      .sanitize()
      .required("New Password required")
      // .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
      .min(6, "New Password must be at least 6 characters long")
      .max(50, "New Password cannot exceed 50 characters"),
    confirmPassword: yup
      .string()
      .sanitize()
      .required("Confirm Password required")
      // .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
      .min(6, "Confirm Password must be at least 6 characters long")
      .max(50, "Confirm Password cannot exceed 50 characters")
      .oneOf(
        [yup.ref("newPassword"), null],
        "Confirm Password must match New Password"
      ),
  });

  const userSchemaPin = yup.object().shape({
    currentPin: yup
      .string()
      .required("Current Pin required")
      .matches(/^\d{4}$/, "Current Pin must be a 4-digit number"), // Validates a 4-digit number
    newPin: yup
      .string()
      .required("New Pin required")
      .matches(/^\d{4}$/, "New Pin must be a 4-digit number"), // Validates a 4-digit number
    confirmPin: yup
      .string()
      .required("Confirm Pin required")
      .matches(/^\d{4}$/, "Confirm Pin must be a 4-digit number") // Validates a 4-digit number
      .oneOf(
        [yup.ref("newPin"), null],
        "Confirm Pin must match New Pin"
      ),
  });

  const [formData, setFormData] = useState(initialState);

  const [formDataPin, setFormDataPin] = useState(initialStatePin);
  // const { currentPassword, newPassword, ConfirmPassword } = formData;


  // handleFormSubmitChangePassword
  const handleFormSubmitChangePassword = async (values) => {
    setFormData(values);

    if (values.newPassword !== values.confirmPassword) {
      return toast.error("Password does not match");
    }

    const userData = values;

    // console.log(userData)

    await dispatch(changePassword(userData));
  };

  
  // handleFormSubmitChangePin
  const handleFormSubmitChangePin = async (values) => {
    setFormDataPin(values);

    if (values.newPassword !== values.confirmPassword) {
      return toast.error("Password does not match");
    }

    const userData = values;

    console.log(userData)

    await dispatch(changePin(userData));
  };



  //2fa authentication
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (user?.isTwoFactorEnabled) {
      setChecked(user?.isTwoFactorEnabled);
    }
  }, [user?.isTwoFactorEnabled]);

  // Handle switch change
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked); // Update the checked state directly

    setTimeout(() => {
      handleFormSubmit(isChecked);
    }, 600);
  };

  const handleFormSubmit = async (isChecked) => {
    const userData = {
      isTwoFactorEnabled: isChecked,
    };

    // console.log(userData);

    await dispatch(twofaAuthentication(userData));
  };

  return (
    <>
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        component={Paper}
        p={2}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
        display={changePasswordDrawer && "none"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              Two-Factor Authentication (2FA)
            </Typography>
            <Typography>
              Kindly set up 2 factor authentication for a stronger account
              security.
            </Typography>
          </Stack>

          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography>OFF</Typography>
            <IOSSwitch
              checked={checked}
              onChange={handleSwitchChange}
              name="switch1"
            />
            <Typography>ON</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Formik
        onSubmit={handleFormSubmitChangePassword}
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
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              component={Paper}
              p={2}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              width={"100%"}
              mt={2}
            >
              <Stack width={"100%"}>
                <Stack spacing={1} mb={3}>
                  <Typography variant="h5" fontWeight={600}>
                    Change Account Password
                  </Typography>
                  <Typography
                    variant={size.width < 600 && "subtitle2"}
                    color={"orange"}
                  >
                    It is best to change your password once every month.
                  </Typography>
                </Stack>

                <Stack spacing={2} width={"100%"}>
                  <TextField
                    label="Current Password"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    width={"50%"}
                    name="currentPassword"
                    value={values.currentPassword}
                    error={
                      !!touched.currentPassword && !!errors.currentPassword
                    }
                    helperText={
                      touched.currentPassword && errors.currentPassword
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />

                  <TextField
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    name="newPassword"
                    value={values.newPassword}
                    error={!!touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />
                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />

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
                    disabled={isLoading && true}
                  >
                    {isLoading ? (
                      <CircularProgress size={28} />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>

      <Formik
        onSubmit={handleFormSubmitChangePin}
        initialValues={formDataPin}
        validationSchema={userSchemaPin}
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
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              component={Paper}
              p={2}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              width={"100%"}
              mt={2}
            >
              <Stack width={"100%"}>
                <Stack spacing={1} mb={3}>
                  <Typography variant="h5" fontWeight={600}>
                  Change Account Lock Pin
                  </Typography>
                  <Typography
                    variant={size.width < 600 && "subtitle2"}
                    color={"orange"}
                  >
                    It is best to change your lock pin once every month.
                  </Typography>
                </Stack>

                <Stack spacing={2} width={"100%"}>
                  <TextField
                    label="Current Pin"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    width={"50%"}
                    name="currentPin"
                    value={values.currentPin}
                    error={
                      !!touched.currentPin && !!errors.currentPin
                    }
                    helperText={
                      touched.currentPin && errors.currentPin
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />

                  <TextField
                    label="New Pin"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    name="newPin"
                    value={values.newPin}
                    error={!!touched.newPin && !!errors.newPin}
                    helperText={touched.newPin && errors.newPin}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />
                  <TextField
                    label="Confirm Pin"
                    variant="outlined"
                    fullWidth
                    size="normal"
                    name="confirmPin"
                    value={values.confirmPin}
                    error={
                      !!touched.confirmPin && !!errors.confirmPin
                    }
                    helperText={
                      touched.confirmPin && errors.confirmPin
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    inputProps={{ maxLength: 51 }}
                  />

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
                    disabled={isLoading && true}
                  >
                    {isLoading ? (
                      <CircularProgress size={28} />
                    ) : (
                      "Change Pin"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>

     
    </>
  );
};

export default SecuritySystem;
