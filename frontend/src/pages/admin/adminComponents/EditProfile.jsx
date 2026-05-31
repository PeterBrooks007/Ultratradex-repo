import {
  Avatar,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUser } from "../redux/features/auth/authSlice";
// import { shortenText } from "../utils";
import { tokens } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import {
  adminUpdateUser,
} from "../../../redux/features/auth/authSlice";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //

const EditProfile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);

  const { id } = useParams();

  const { singleUser } = useSelector((state) => state.auth);

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    firstname: singleUser?.firstname || "",
    lastname: singleUser?.lastname || "",
    email: singleUser?.email || "",
    phone: singleUser?.phone || "",
    // currency: singleUser?.currency?.code || "",
    address: {
      address: singleUser?.address?.address || "",
      state: singleUser?.address?.state || "",
      country: singleUser?.address?.country || "",
    },
    balance: singleUser?.balance ?? "",
    demoBalance: singleUser?.demoBalance ?? "",
    earnedTotal: singleUser?.earnedTotal ?? "",
    totalDeposit: singleUser?.totalDeposit ?? "",
    referralBonus: singleUser?.referralBonus ?? "",
    totalWithdrew: singleUser?.totalWithdrew ?? "",
    package: singleUser?.package || "",
    pin: singleUser?.pin || "",
    role: singleUser?.role || "",
    accounttype: singleUser?.accounttype || "",
    pinRequired: singleUser?.pinRequired ?? "",

    password: singleUser?.password || "",
    isTwoFactorEnabled: singleUser?.isTwoFactorEnabled ?? "",
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
    firstname: yup
      .string()
      .sanitize()
      .required("firstname required")
      // .matches(/^[a-zA-Z]+$/, "First name must only contain letters")
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name cannot exceed 50 characters"),
    lastname: yup
      .string()
      .sanitize()
      .required("lastname required")
      // .matches(/^[a-zA-Z]+$/, "Last name must only contain letters")
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name cannot exceed 50 characters"),
    email: yup
      .string()
      .email("Invalid email")
      .sanitize()
      .required("email required"),
    phone: yup
      .string()
      .sanitize()
      .required("phone required")
      .max(50, "phone cannot exceed 50 characters"),

    // Schema for address object
    address: yup.object().shape({
      address: yup
        .string()
        .trim()
        .required("Address required")
        .sanitize()
        .max(500, "Address cannot exceed 500 characters"),
      state: yup
        .string()
        .trim()
        .required("State required")
        .sanitize()
        .max(50, "State cannot exceed 50 characters"),
      country: yup
        .string()
        .trim()
        .required("Country required")
        .sanitize()
        .max(50, "Country cannot exceed 50 characters"),
    }),

    balance: yup
      .number()
      .typeError("Trade Balance must be a number")
      .required("Trade Balance is required"),
    demoBalance: yup
      .number()
      .typeError("Demo Balance must be a number")
      .required("Demo Balance is required"),
    earnedTotal: yup
      .number()
      .typeError("Earned Total must be a number")
      .required("Earned Total required"),
    totalDeposit: yup
      .number()
      .typeError("Total Deposit must be a number")
      .required("Total Deposit is required"),
    referralBonus: yup
      .number()
      .typeError("Referral Bonus must be a number")
      .required("Referral Bonus is required"),
    totalWithdrew: yup
      .number()
      .typeError("Total Withdrew must be a number")
      .required("Total Withdrew is required"),
    package: yup
      .string()
      .sanitize()
      .required("package required")
      .max(50, "package cannot exceed 50 characters"),
    pin: yup
      .number()
      .typeError("Pin must be a number")
      .required("Pin is required"), 
    role: yup
      .string()
      .sanitize()
      .required("role required")
      .max(50, "role can not exceed 50 characters"),   
    accounttype: yup
      .string()
      .sanitize()
      .required("account type required")
      .max(50, "account type can not exceed 50 characters"),   
    pinRequired: yup
      .boolean()
      .typeError("Login Pin must be either true or false")
      .required("Login Pin is required"),

      password: yup
      .string()
      .sanitize()
      .required("password is required"),
      // .max(50, "password type can not exceed 50 characters"),   
     isTwoFactorEnabled: yup
      .boolean()
      .typeError("twoFaAuthentication must be either true or false")
      .required("twoFaAuthentication is required")
  });



  const [profile, setProfile] = useState(initialState);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the name attribute contains '.', it means it's a nested property like 'address.state'
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]; // Extract the field name (e.g., state, country)
      setProfile((prevProfile) => ({
        ...prevProfile,
        address: {
          ...prevProfile?.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const saveProfile = async (values) => {
    const userData = values;

    // const userData = {
    //   firstname: profile?.firstname,
    //   lastname: profile?.lastname,
    //   email: profile?.email.toLowerCase().trim(),
    //   phone: profile?.phone,
    //   address: {
    //     address: profile?.address?.address,
    //     state: profile?.address?.state,
    //     country: profile?.address?.country,
    //   },
    //   balance: profile?.balance,
    //   demoBalance: profile?.demoBalance,
    //   earnedTotal: profile?.earnedTotal,
    //   totalDeposit: profile?.totalDeposit,
    //   referralBonus: profile?.referralBonus,
    //   totalWithdrew: profile?.totalWithdrew,
    //   package: profile?.package,
    //   pin: profile?.pin,
    //   role: profile?.role,
    //   accounttype: profile?.accounttype,
    //   pinRequired: profile?.pinRequired,
    // };

    // console.log(userData)

    await dispatch(adminUpdateUser({ id, userData }));
    await setIsEditing(false);
  };

  return (
    <Stack
      component={Paper}
      elevation={elevation}
      backgroundColor={`${colors.dashboardbackground[100]}`}
      p={3}
    >
      <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
        <Typography variant="body1" fontWeight={"bold"}>
          Profile Details
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#009e4a", color: "white" }}
          onClick={() => setIsEditing(true)}
        >
          Edit Details
        </Button>
      </Stack>

      <Divider flexItem />

      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"10px 0"}
        spacing={1}
        display={{ xs: "flex", md: "flex" }}
      >
        <Avatar
          src={singleUser?.photo}
          alt="profile picture"
          sx={{ width: "60px", height: "60px" }}
        />
        <Stack>
          <Typography variant="h6" fontWeight={"600"}>
            {singleUser?.firstname} {singleUser?.lastname}
          </Typography>
          <Typography variant="caption">{singleUser?.email}</Typography>
        </Stack>
      </Stack>
      <Divider />


     <Formik
        onSubmit={saveProfile}
        initialValues={profile}
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
        <Stack spacing={2} height={"100%"} mt={3} mb={3}>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="firstname"
              variant="outlined"
              fullWidth
              size="small"
              name="firstname"
              value={values?.firstname}
              error={!!touched.firstname && !!errors.firstname}
              helperText={touched.firstname && errors.firstname}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="lastname"
              variant="outlined"
              fullWidth
              size="small"
              name="lastname"
              value={values.lastname}
              error={!!touched.lastname && !!errors.lastname}
              helperText={touched.lastname && errors.lastname}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              name="email"
              value={values.email}
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="phone"
              variant="outlined"
              fullWidth
              size="small"
              name="phone"
              value={values?.phone}
              error={!!touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            {/* <TextField
              label="Currency"
              variant="outlined"
              fullWidth
              size="small"
              name="currency"
              value={profile?.currency}
              onChange={handleInputChange}
              disabled={!isEditing && true}
            /> */}

            <TextField
              label="address"
              variant="outlined"
              fullWidth
              size="small"
              name="address.address"
              value={values?.address?.address}
              error={!!touched.address?.address && !!errors.address?.address}
              helperText={touched.address?.address && errors.address?.address}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="state"
              variant="outlined"
              fullWidth
              size="small"
              name="address.state"
              value={values?.address?.state}
              error={!!touched.address?.state && !!errors.address?.state}
              helperText={touched.address?.state && errors.address?.state}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />

            <TextField
              label="country"
              variant="outlined"
              fullWidth
              size="small"
              name="address.country"
              value={values?.address?.country}
              error={!!touched.address?.country && !!errors.address?.country}
              helperText={touched.address?.country && errors.address?.country}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Trade Balance"
              variant="outlined"
              fullWidth
              size="small"
              name="balance"
              type="text"
              value={values?.balance}
              error={!!touched.balance && !!errors.balance}
              helperText={touched.balance && errors.balance}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Demo Balance"
              variant="outlined"
              fullWidth
              size="small"
              name="demoBalance"
              type="text"
              value={values?.demoBalance}
              error={!!touched.demoBalance && !!errors.demoBalance}
              helperText={touched.demoBalance && errors.demoBalance}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Total Earned"
              variant="outlined"
              fullWidth
              type="text"
              size="small"
              name="earnedTotal"
              value={values?.earnedTotal}
              error={!!touched.earnedTotal && !!errors.earnedTotal}
              helperText={touched.earnedTotal && errors.earnedTotal}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Total Deposit"
              variant="outlined"
              fullWidth
              size="small"
              name="totalDeposit"
              type="text"
              value={values?.totalDeposit}
              error={!!touched.totalDeposit && !!errors.totalDeposit}
              helperText={touched.totalDeposit && errors.totalDeposit}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Referral Bonus"
              variant="outlined"
              fullWidth
              size="small"
              name="referralBonus"
              type="text"
              value={values?.referralBonus}
              error={!!touched.referralBonus && !!errors.referralBonus}
              helperText={touched.referralBonus && errors.referralBonus}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Total Withdrew"
              variant="outlined"
              fullWidth
              size="small"
              name="totalWithdrew"
              type="text"
              value={values?.totalWithdrew}
              error={!!touched.totalWithdrew && !!errors.totalWithdrew}
              helperText={touched.totalWithdrew && errors.totalWithdrew}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Package"
              variant="outlined"
              fullWidth
              size="small"
              name="package"
              value={values?.package}
              error={!!touched.package && !!errors.package}
              helperText={touched.package && errors.package}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Pin"
              variant="outlined"
              fullWidth
              size="small"
              name="pin"
              value={values?.pin}
              error={!!touched.pin && !!errors.pin}
              helperText={touched.pin && errors.pin}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              size="small"
              name="role"
              value={values?.role}
              error={!!touched.role && !!errors.role}
              helperText={touched.role && errors.role}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Account Type"
              variant="outlined"
              fullWidth
              size="small"
              name="accounttype"
              value={values?.accounttype}
              error={!!touched.accounttype && !!errors.accounttype}
              helperText={touched.accounttype && errors.accounttype}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Login Pin Required"
              variant="outlined"
              fullWidth
              size="small"
              name="pinRequired"
              value={values?.pinRequired}
              error={!!touched.pinRequired && !!errors.pinRequired}
              helperText={touched.pinRequired && errors.pinRequired}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>

          
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              size="small"
              name="password"
              value={values?.password}
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
            <TextField
              label="Enable 2faAuthentication"
              variant="outlined"
              fullWidth
              size="small"
              name="isTwoFactorEnabled"
              value={values?.isTwoFactorEnabled}
              error={!!touched.isTwoFactorEnabled && !!errors.isTwoFactorEnabled}
              helperText={touched.isTwoFactorEnabled && errors.isTwoFactorEnabled}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={!isEditing && true}
            />
          </Stack>


          <Button
            type="submit"
            variant="contained"
            fullWidth
            // size="small"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              backgroundColor: "#009e4a",
              color: "white",
              padding: "10px",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }}
            disabled={!isEditing && true}
          >
            {/* {isLoading ? <CircularProgress size={28} /> : "Update Details"} */}
            Update
          </Button>
        </Stack>
      </form>
        )}
        </Formik>
  
    </Stack>
  );
};

export default EditProfile;
