import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Calculator } from "@phosphor-icons/react";
import { ColorModeContext, tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllUsersSkeleton from "../../pages/admin/adminSkeletons/AllUsersSkeleton";
import { addTrade } from "../../redux/features/trades/tradesSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSingleUser,
  getSingleUserBalanceAfterTrade,
  getUser,
  getUserBalanceAfterTrade,
} from "../../redux/features/auth/authSlice";

const LimitStopTrade = ({
  type,
  selectedExchange,
  selectedSymbol,
  handleOpenTradeHistoryDrawer,
  tradeHistoryDrawerLoader,
  setTradeHistoryDrawerLoader,
  isQuickTrade,
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { id } = useParams();

  const ShortScreen = useMediaQuery("(max-height: 899px)");

  const [isEditing, setIsEditing] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const { isSemiLoading } = useSelector((state) => state.trades);

  const { tradingMode } = useSelector((state) => state.app);

  const { user, singleUser } = useSelector((state) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 100); // Simulate a 2-second loading delay
  }, []);

  // take profit checkbox
  const [checkedTakeProfit, setCheckedTakeProfit] = useState(false);

  const handleChangeTakeProfit = (event) => {
    setCheckedTakeProfit(event.target.checked);

    if (checkedStopLoss === true) {
      setCheckedStopLoss(false);
    }
  };

  // end of take profit checkbox

  // stop loss checkbox
  const [checkedStopLoss, setCheckedStopLoss] = useState(false);

  // console.log(checkedStopLoss)
  const handleChangeStopLoss = (event) => {
    setCheckedStopLoss(event.target.checked);

    if (checkedTakeProfit === true) {
      setCheckedTakeProfit(false);
    }
  };

  // end of stop loss checkbox

  const initialState = {
    price: "",
    ticks: type !== "LMT" && type !== "STP" ? "none" : "",
    units: "",
    risk: "0",
    riskPercentage: "0",
    expireTime:
      user?.autoTradeSettings?.isAutoTradeActivated === true
        ? ""
        : user?.role === "admin"
        ? "1"
        : "1",
    amount: "",
    open: "0",
    close: "0",
    longOrShortUnit: "0",
    roi: "0",
    profitOrLossAmount: 0,
    status: "PENDING",
  };

  // console.log(initialState)

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
    price: yup
      .number()
      .typeError("price must be a number")
      .required("price is required"),
    ticks: yup
      .string()
      .sanitize()
      .required("ticks required")
      .max(50, "ticks cannot exceed 50 characters"),
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

  const [buyOrSell, setBuyOrSell] = useState(null);

  const saveProfile = async (values) => {
    setTradeData(values);

    if (!selectedExchange?.exchangeType) {
      return toast.error("Please Select an exchange");
    }

    if (!selectedSymbol) {
      return toast.error("Please Select a symbol");
    }

    const tradeBalance =
      user?.role === "admin" ? singleUser?.balance : user?.balance;

    if (tradingMode === "Live" && values?.amount > tradeBalance) {
      return toast.error("Insufficient trade balance to trade with");
    }

    const demoBalance =
      user?.role === "admin" ? singleUser?.demoBalance : user?.demoBalance;

    if (tradingMode === "Demo" && values?.amount > demoBalance) {
      return toast.error("Insufficient demo balance to trade with");
    }

    const formData = {
      userId: user?.role === "admin" ? id : user?._id,
      tradeData: {
        tradingMode,
        tradeFrom: user?.role === "admin" ? "admin" : "user",
        exchangeType: selectedExchange?.exchangeType,
        exchangeTypeIcon: selectedExchange?.photo,
        symbols: selectedSymbol,
        type: checkedTakeProfit ? "Take Profit" : type,
        buyOrSell,
        ...values,
      },
    };

    // console.log(formData);

    await dispatch(addTrade(formData));
    (await user?.role) === "admin"
      ? dispatch(getSingleUserBalanceAfterTrade(id))
      : dispatch(getUserBalanceAfterTrade());
    handleOpenTradeHistoryDrawer();
    setTradeHistoryDrawerLoader(true);
    await setIsEditing(false);
  };

  return (
    <>
      {pageLoading || isSemiLoading ? (
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={5}
          mx={0}
          spacing={0.5}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: "35px",
              borderRadius: "10px 0px 0px 10px",
            }}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: "35px",
              borderRadius: "0px 10px 10px 0px",
            }}
          />
        </Stack>
      ) : (
        <>
          <Formik
            onSubmit={saveProfile}
            initialValues={tradeData}
            validationSchema={userSchema}
            enableReinitialize
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
                <Stack spacing={1} mt={1}>
                  <Stack direction={"row"}>
                    <Stack spacing={0.5} width={"100%"}>
                      <InputLabel htmlFor="my-input">Price</InputLabel>
                      <OutlinedInput
                        name="price"
                        value={values?.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter Price "
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius:
                              type !== "LMT" && type !== "STP"
                                ? "10px"
                                : "10px 0px 0px 10px",
                          },
                        }}
                      />
                      {touched.price && errors.price && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.price}
                        </FormHelperText>
                      )}
                    </Stack>
                    <Stack
                      spacing={0.5}
                      width={"100%"}
                      display={
                        type !== "LMT" && type !== "STP" ? "none" : "block"
                      }
                    >
                      <InputLabel htmlFor="my-input">Ticks</InputLabel>
                      <OutlinedInput
                        name="ticks"
                        value={values?.ticks}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter Ticks"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "0px 10px 10px 0px",
                          },
                        }}
                      />
                      {touched.ticks && errors.ticks && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.ticks}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Stack>

                  <Stack direction={"row"}>
                    <Stack spacing={0.5} width={"100%"}>
                      <InputLabel htmlFor="my-input">Units</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name="units"
                        value={values?.units}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter Units"
                        endAdornment={
                          <InputAdornment
                            position="end"
                            sx={{ marginRight: "-10px" }}
                          >
                            <IconButton>
                              <Calculator />
                            </IconButton>
                          </InputAdornment>
                        }
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: !checkedStopLoss
                              ? "10px"
                              : "10px 0px 0px 10px",
                          },
                        }}
                      />

                      {touched.units && errors.units && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.units}
                        </FormHelperText>
                      )}
                    </Stack>

                    <Stack spacing={0.5} display={!checkedStopLoss && "none"}>
                      <InputLabel htmlFor="my-input">Risk</InputLabel>
                      <OutlinedInput
                        name="risk"
                        value={values?.risk}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        size="small"
                        placeholder="Risk"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "0px 0px 0px 0px",
                          },
                        }}
                      />
                      {touched.risk && errors.risk && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.risk}
                        </FormHelperText>
                      )}
                    </Stack>
                    <Stack spacing={0.5} display={!checkedStopLoss && "none"}>
                      <InputLabel htmlFor="my-input">%Risk</InputLabel>
                      <OutlinedInput
                        name="riskPercentage"
                        value={values?.riskPercentage}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        size="small"
                        placeholder="Risk %"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "0px 10px 10px 0px",
                          },
                        }}
                      />
                      {touched.riskPercentage && errors.riskPercentage && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.riskPercentage}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Stack>
                </Stack>

                <Box
                  mx={"-15px"}
                  mt={2}
                  borderBottom={
                    theme.palette.mode === "light"
                      ? "2px solid rgba(47,49,58,0.3)"
                      : "2px solid rgba(47,49,58,1)"
                  }
                  display={isQuickTrade && "none"}
                ></Box>

                <Stack
                  mt={0.5}
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={"5px"}
                  display={isQuickTrade && "none"}
                >
                  <Stack direction={"row"} alignItems={"center"}>
                    <Checkbox
                      checked={checkedTakeProfit}
                      onChange={handleChangeTakeProfit}
                      inputProps={{ "aria-label": "controlled" }}
                      sx={{ marginLeft: "-10px" }}
                    />
                    <Typography variant="subtitle2">Take Profit</Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"start"}
                    alignItems={"center"}
                    mr={"5px"}
                  >
                    <Checkbox
                      checked={checkedStopLoss}
                      onChange={handleChangeStopLoss}
                      inputProps={{ "aria-label": "controlled" }}
                      sx={{ marginLeft: "-10px" }}
                    />
                    <Typography variant="subtitle2">Stop Loss</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction={"row"}
                  spacing={2}
                  display={isQuickTrade && "none"}
                >
                  <Box
                    border={
                      theme.palette.mode === "light"
                        ? "1px solid rgba(47,49,58,0.5)"
                        : "1px solid rgba(47,49,58,1)"
                    }
                    borderRadius={"5px"}
                  >
                    <Input
                    readOnly
                      value={""}
                      placeholder="75"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                      value={values?.price}
                      placeholder="220.01"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                      value={""}
                      placeholder="2000"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                    value={""}
                      placeholder="0.00"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderBottom: "none",
                        },
                        "&:after": {
                          borderBottom: "none",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "none",
                        },
                      }}
                    />
                  </Box>

                  <Stack justifyContent={"space-around"} textAlign={"center"}>
                    <Typography>Ticks</Typography>
                    <Typography>Price</Typography>
                    <Typography>Money</Typography>
                    <Typography>%</Typography>
                  </Stack>

                  <Box
                    border={
                      theme.palette.mode === "light"
                        ? "1px solid rgba(47,49,58,0.5)"
                        : "1px solid rgba(47,49,58,1)"
                    }
                    borderRadius={"5px"}
                  >
                    <Input
                    readOnly
                    value={values?.ticks === "none" ? "" : values?.ticks}
                      placeholder="25"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                      value={values?.price} 
                      placeholder="220.01"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                    value={checkedStopLoss ? values?.risk : ""}

                      placeholder="2000"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:after": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(47,49,58,0.5)"
                              : "rgba(47,49,58,1)",
                        },
                      }}
                    />
                    <Input
                    readOnly
                    value={checkedStopLoss ? values?.riskPercentage : ""}
                      placeholder="0.00"
                      fullWidth
                      sx={{
                        px: "10px",
                        borderBottom: "none",
                        "&:before": {
                          borderBottom: "none",
                        },
                        "&:after": {
                          borderBottom: "none",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "none",
                        },
                      }}
                    />
                  </Box>
                </Stack>

                {user?.role === "admin" ? (
                  <Stack mt={1} spacing={0.5}>
                    <InputLabel id="expire-time-label">Expire Time</InputLabel>
                    <Select
                      size="small"
                      name="expireTime"
                      value={values?.expireTime || ""}
                      labelId="expire-time-label" // Associate the InputLabel with Select
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty // Allows showing a default text when no value is selected
                    >
                      <MenuItem disabled value="">
                        Select expire time
                      </MenuItem>
                      <MenuItem value={"0.5"}>30 seconds</MenuItem>
                      <MenuItem value={"1"}>1 minute</MenuItem>
                      <MenuItem value={"5"}>5 minutes</MenuItem>
                      <MenuItem value={"10"}>10 minutes</MenuItem>
                      <MenuItem value={"30"}>30 minutes</MenuItem>
                      <MenuItem value={"60"}>1 hour</MenuItem>
                      <MenuItem value={"180"}>3 hours</MenuItem>
                      <MenuItem value={"360"}>6 hours</MenuItem>
                      <MenuItem value={"600"}>10 hours</MenuItem>
                      <MenuItem value={"1440"}>1 day</MenuItem>
                    </Select>
                    {touched.expireTime && errors.expireTime && (
                      <FormHelperText error sx={{ ml: 2 }}>
                        {errors.expireTime}
                      </FormHelperText>
                    )}
                  </Stack>
                ) : (
                  <Stack mt={1} spacing={0.5}>
                    <InputLabel id="expire-time-label">Expire Time</InputLabel>
                    <Select
                      size="small"
                      name="expireTime"
                      value={values?.expireTime || ""}
                      labelId="expire-time-label" // Associate the InputLabel with Select
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty // Allows showing a default text when no value is selected
                    >
                      <MenuItem disabled value="">
                        Select expire time
                      </MenuItem>
                      <MenuItem value={"0.5"}>30 seconds</MenuItem>
                      <MenuItem value={"1"}>1 minute</MenuItem>
                      <MenuItem value={"5"}>5 minutes</MenuItem>
                      <MenuItem value={"10"}>10 minutes</MenuItem>
                      <MenuItem value={"30"}>30 minutes</MenuItem>
                      <MenuItem value={"60"}>1 hour</MenuItem>
                      <MenuItem value={"180"}>3 hours</MenuItem>
                      <MenuItem value={"360"}>6 hours</MenuItem>
                      <MenuItem value={"600"}>10 hours</MenuItem>
                      <MenuItem value={"1440"}>1 day</MenuItem>
                    </Select>
                    {touched.expireTime && errors.expireTime && (
                      <FormHelperText error sx={{ ml: 2 }}>
                        {errors.expireTime}
                      </FormHelperText>
                    )}
                  </Stack>
                )}

                <Stack mt={1} spacing={0.5}>
                  <InputLabel htmlFor="my-input">Amount</InputLabel>
                  <OutlinedInput
                    name="amount"
                    value={values?.amount}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                    size="small"
                  />
                  {touched.amount && errors.amount && (
                    <FormHelperText error sx={{ ml: 2 }}>
                      {errors.amount}
                    </FormHelperText>
                  )}
                  {user?.role === "admin" ? (
                    <Typography
                      variant="subtitle2"
                      sx={{ pl: 0.5, color: theme.palette.mode === "light"
                        ? "#009e4a"
                        : "rgba(0, 255, 127, 0.8)" }}
                    >
                      Trade Balance:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code || "USD",
                        ...(tradingMode.toLowerCase() === "live"
                          ? singleUser?.balance
                          : singleUser?.demoBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        tradingMode.toLowerCase() === "live"
                          ? singleUser?.balance
                          : singleUser?.demoBalance
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      sx={{ pl: 0.5, color: theme.palette.mode === "light"
                        ? "#009e4a"
                        : "rgba(0, 255, 127, 0.8)" }}
                    >
                      {tradingMode === "Live"
                        ? "Trade Balance:"
                        : "Demo Balance:"}{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user?.currency?.code,
                        ...(tradingMode.toLowerCase() === "live"
                          ? user?.balance
                          : user?.demoBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(
                        tradingMode.toLowerCase() === "live"
                          ? user?.balance
                          : user?.demoBalance
                      )}
                    </Typography>
                  )}
                </Stack>

                {user?.role === "admin" && (
                  <Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={2}
                      mt={2}
                    >
                      <Stack mt={1} spacing={0.5}>
                        <InputLabel htmlFor="my-input">Open</InputLabel>
                        <OutlinedInput
                          name="open"
                          value={values?.open}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter Open"
                          size="small"
                        />
                        {touched.open && errors.open && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.open}
                          </FormHelperText>
                        )}
                      </Stack>
                      <Stack mt={1} spacing={0.5}>
                        <InputLabel htmlFor="my-input">Close</InputLabel>
                        <OutlinedInput
                          name="close"
                          value={values?.close}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter Close"
                          size="small"
                        />
                        {touched.close && errors.close && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.close}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={2}
                      mt={2}
                    >
                      <Stack mt={1} spacing={0.5}>
                        <InputLabel htmlFor="my-input">
                          Long or Short Unit
                        </InputLabel>
                        <OutlinedInput
                          name="longOrShortUnit"
                          value={values?.longOrShortUnit}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter unit e.g 25X, 45X etc"
                          size="small"
                        />
                        {touched.longOrShortUnit && errors.longOrShortUnit && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.longOrShortUnit}
                          </FormHelperText>
                        )}
                      </Stack>
                      <Stack mt={1} spacing={0.5}>
                        <InputLabel htmlFor="my-input">ROI</InputLabel>
                        <OutlinedInput
                          name="roi"
                          value={values?.roi}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter ROI"
                          size="small"
                        />
                        {touched.roi && errors.roi && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.roi}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                    <Stack mt={1} spacing={0.5}>
                      <InputLabel htmlFor="my-input">
                        Amount Win or Lose
                      </InputLabel>
                      <OutlinedInput
                        name="profitOrLossAmount"
                        value={values?.profitOrLossAmount}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter amount win or lose"
                        size="small"
                      />
                      {touched.profitOrLossAmount &&
                        errors.profitOrLossAmount && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.profitOrLossAmount}
                          </FormHelperText>
                        )}
                    </Stack>
                    <Stack mt={3} spacing={0.5}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          size="small"
                          name="status"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values?.status}
                          label="Status"
                          onChange={handleChange}
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
                  </Stack>
                )}

                <Stack direction={"row"} spacing={2} size="large" mt={2}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: "#009e4a",
                      color: "white",
                      padding: "10px",
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                    }}
                    onClick={() => setBuyOrSell("Buy")}
                  >
                    Buy
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: "#d01725",
                      color: "white",
                      padding: "10px",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    onClick={() => setBuyOrSell("Sell")}
                  >
                    Sell
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>

          {/* <Box display={ShortScreen ? "none" : ""} px={"15px"}>
            <Box
              mx={"-15px"}
              mt={2}
              borderBottom={
                theme.palette.mode === "light"
                  ? "2px solid rgba(47,49,58,0.3)"
                  : "2px solid rgba(47,49,58,1)"
              }
            ></Box>

            <Stack spacing={1} mt={0.5}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Order Info
              </Typography>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="subtitle2">Symbol</Typography>
                <Typography variant="subtitle2">Buy BTCUSDT {type}</Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="subtitle2">Price</Typography>
                <Typography variant="subtitle2">435665</Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="subtitle2">Amount</Typography>
                <Typography variant="subtitle2">2000</Typography>
              </Stack>
            </Stack>
          </Box> */}
        </>
      )}
    </>
  );
};

export default LimitStopTrade;
