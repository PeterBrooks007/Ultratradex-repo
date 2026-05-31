import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUser } from "../redux/features/auth/authSlice";
// import { shortenText } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { adminUpdateUser } from "../../redux/features/auth/authSlice";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { tokens } from "../../theme";
import { adminUpdateUserTrade } from "../../redux/features/trades/tradesSlice";

const EditTradeOrder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);

  const { id } = useParams();

  const { selectedTrade } = useSelector((state) => state.trades);

  const elevation = theme.palette.mode === "light" ? 1 : 0;

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    symbols: selectedTrade?.symbols || "",
    type: selectedTrade?.type || "",
    buyOrSell: selectedTrade?.buyOrSell || "",
    price: selectedTrade?.price || "",
    ticks: selectedTrade?.ticks || "",
    tradingMode: selectedTrade?.tradingMode || "",
    units: selectedTrade?.units || "",
    risk: selectedTrade?.risk || "",
    riskPercentage: selectedTrade?.riskPercentage ?? "",
    expireTime: String(selectedTrade?.expireTime) ?? "",
    amount: selectedTrade?.amount ?? "",
    open: selectedTrade?.open ?? "",
    close: selectedTrade?.close ?? "",
    longOrShortUnit: selectedTrade?.longOrShortUnit ?? "",
    roi: selectedTrade?.roi || "",
    profitOrLossAmount: selectedTrade?.profitOrLossAmount || "",
    createdAt: selectedTrade?.createdAt || "",
    status: selectedTrade?.status || "",
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
    symbols: yup
      .string()
      .sanitize()
      .required("symbols required")
      .max(50, "symbols cannot exceed 50 characters"),
    type: yup
      .string()
      .sanitize()
      .required("type required")
      .max(50, "type cannot exceed 50 characters"),
    buyOrSell: yup
      .string()
      .sanitize()
      .required("buyOrSell required")
      .max(50, "buyOrSell cannot exceed 50 characters"),
    price: yup
      .number()
      .typeError("price must be a number")
      .required("price is required"),
    ticks: yup
      .string()
      .sanitize()
      .required("ticks required")
      .max(50, "ticks cannot exceed 50 characters"),
    tradingMode: yup
      .string()
      .sanitize()
      .required("tradingMode required")
      .max(50, "tradingMode cannot exceed 50 characters"),
    units: yup
      .number()
      .typeError("units must be a number")
      .required("units is required"),
    risk: yup.string().sanitize().required("risk required"),
    riskPercentage: yup
      .string()
      .sanitize()
      .required("riskPercentage required")
      .max(50, "riskPercentage cannot exceed 50 characters"),
    expireTime: yup.string().sanitize().required("expireTime required"),
    amount: yup
      .number()
      .typeError("amount must be a number")
      .required("amount is required"),
    open: yup.string().sanitize().required("open required"),
    close: yup.string().sanitize().required("close required"),
    longOrShortUnit: yup.string().sanitize().required("longShortUnit required"),
    roi: yup.string().sanitize().required("roi required"),
    profitOrLossAmount: yup
      .number()
      .typeError("profitOrLossAmount must be a number")
      .required("profitOrLossAmount is required"),
    status: yup.string().sanitize().required("status required"),
  });

  const [tradeData, setTradeData] = useState(initialState);

  useEffect(() => {
    if (selectedTrade) {
      setTradeData({
        symbols: selectedTrade?.symbols || "",
        type: selectedTrade?.type || "",
        buyOrSell: selectedTrade?.buyOrSell || "",
        price: selectedTrade?.price || "",
        ticks: selectedTrade?.ticks || "",
        units: selectedTrade?.units || "",
        risk: selectedTrade?.risk || "",
        riskPercentage: selectedTrade?.riskPercentage ?? "",
        expireTime: selectedTrade?.expireTime ?? "",
        amount: selectedTrade?.amount ?? "",
        open: selectedTrade?.open ?? "",
        close: selectedTrade?.close ?? "",
        longOrShortUnit: selectedTrade?.longOrShortUnit ?? "",
        roi: selectedTrade?.roi || "",
        createdAt: selectedTrade?.createdAt || "",
        profitOrLossAmount: selectedTrade?.profitOrLossAmount || "",
        status: selectedTrade?.status || "",
      });
    }
  }, [selectedTrade]);

  const saveProfile = async (values) => {
    setTradeData(values);

    const formData = {
      userId: id,
      tradeData: {
        tradeId: selectedTrade?._id,
        exchangeType: selectedTrade?.exchangeType,
        exchangeTypeIcon: selectedTrade?.exchangeTypeIcon,
        isProcessed: values.status === "PENDING" ? false : true,
        // createdAt: selectedTrade?.createdAt || "",
        tradeFrom: selectedTrade?.tradeFrom || "",
        ...values,
      },
    };

    // console.log(formData);

    await dispatch(adminUpdateUserTrade({ id, formData }));
    await setIsEditing(false);
  };

  return (
    <Stack
      component={Paper}
      elevation={elevation}
      backgroundColor={`${colors.dashboardbackground[100]}`}
      p={3}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        pb={2}
        alignItems={"flex-start"}
      >
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={0.5}
            sx={{
              border: "1px solid green",
              width: "fit-content",
              p: "2px 8px",
              borderRadius: "5px",
            }}
          >
            <img
              src={selectedTrade?.exchangeTypeIcon}
              alt="forex"
              width={20}
              style={{ borderRadius: "50%" }}
            />
            <Typography variant="subtitle1">
              {selectedTrade?.exchangeType}: {selectedTrade?.symbols}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#009e4a", color: "white" }}
          onClick={() => setIsEditing(true)}
        >
          Edit Order
        </Button>
      </Stack>

      <Divider flexItem />

      <Formik
        onSubmit={saveProfile}
        initialValues={tradeData}
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
                  label="symbols"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="symbols"
                  value={values?.symbols}
                  error={!!touched.symbols && !!errors.symbols}
                  helperText={touched.symbols && errors.symbols}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="type"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="type"
                  value={values.type}
                  error={!!touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="buyOrSell"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="buyOrSell"
                  value={values.buyOrSell}
                  error={!!touched.buyOrSell && !!errors.buyOrSell}
                  helperText={touched.buyOrSell && errors.buyOrSell}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="price"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="price"
                  value={values?.price}
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="ticks"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="ticks"
                  value={values?.ticks}
                  error={!!touched.ticks && !!errors.ticks}
                  helperText={touched.ticks && errors.ticks}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="tradingMode"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="tradingMode"
                  value={values?.tradingMode}
                  error={!!touched.tradingMode && !!errors.tradingMode}
                  helperText={touched.tradingMode && errors.tradingMode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="units"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="units"
                  value={values?.units}
                  error={!!touched.units && !!errors.units}
                  helperText={touched.units && errors.units}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />

                <TextField
                  label="risk"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="risk"
                  value={values?.risk}
                  error={!!touched.risk && !!errors.risk}
                  helperText={touched.risk && errors.risk}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="riskPercentage"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="riskPercentage"
                  type="text"
                  value={values?.riskPercentage}
                  error={!!touched.riskPercentage && !!errors.riskPercentage}
                  helperText={touched.riskPercentage && errors.riskPercentage}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="expireTime"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="expireTime"
                  type="text"
                  value={values?.expireTime}
                  error={!!touched.expireTime && !!errors.expireTime}
                  helperText={touched.expireTime && errors.expireTime}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="amount"
                  variant="outlined"
                  fullWidth
                  type="text"
                  size="small"
                  name="amount"
                  value={values?.amount}
                  error={!!touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="open"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="open"
                  type="text"
                  value={values?.open}
                  error={!!touched.open && !!errors.open}
                  helperText={touched.open && errors.open}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="close"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="close"
                  type="text"
                  value={values?.close}
                  error={!!touched.close && !!errors.close}
                  helperText={touched.close && errors.close}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="longOrShortUnit"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="longOrShortUnit"
                  type="text"
                  value={values?.longOrShortUnit}
                  error={!!touched.longOrShortUnit && !!errors.longOrShortUnit}
                  helperText={touched.longOrShortUnit && errors.longOrShortUnit}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
                <TextField
                  label="roi"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="roi"
                  value={values?.roi}
                  error={!!touched.roi && !!errors.roi}
                  helperText={touched.roi && errors.roi}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <TextField
                  type="date"
                  label={`Date Created`}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="createdAt"
                  value={
                    values?.createdAt
                      ? new Date(values?.createdAt).toISOString().split("T")[0]
                      : ""
                  } 
                  error={!!touched.createdAt && !!errors.createdAt}
                  helperText={touched.createdAt && errors.createdAt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                  sx={{
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(34%) sepia(91%) saturate(1700%) hue-rotate(120deg) brightness(100%) contrast(90%)",
                      cursor: "pointer",
                    },
                  }}
                />
              </Stack>
              <Stack direction={"row"} spacing={2}>
                <TextField
                  label="profitOrLossAmount"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="profitOrLossAmount"
                  value={values?.profitOrLossAmount}
                  error={
                    !!touched.profitOrLossAmount && !!errors.profitOrLossAmount
                  }
                  helperText={
                    touched.profitOrLossAmount && errors.profitOrLossAmount
                  }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!isEditing && true}
                />
              </Stack>
              <Stack direction={"row"} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    size="small"
                    name="status"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values?.status}
                    label="Status"
                    onChange={handleChange}
                    disabled={!isEditing && true}
                  >
                    <MenuItem value={"Won"}>Won</MenuItem>
                    <MenuItem value={"Lose"}>Lose</MenuItem>
                    <MenuItem value={"PENDING"}>PENDING</MenuItem>
                    <MenuItem value={"CANCELLED"}>CANCELLED</MenuItem>
                    <MenuItem value={"REJECTED"}>REJECTED</MenuItem>
                  </Select>
                </FormControl>
                {touched.status && errors.status && (
                  <FormHelperText error sx={{ ml: 2 }}>
                    {errors.status}
                  </FormHelperText>
                )}
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

export default EditTradeOrder;
