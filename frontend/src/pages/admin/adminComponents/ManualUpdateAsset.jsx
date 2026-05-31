import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { X } from "@phosphor-icons/react";
import { tokens } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DO
import { useState } from "react";
import { adminManualUpdateAssetBalance } from "../../../redux/features/auth/authSlice";

const ManualUpdateAsset = ({ handleCloseModal, selectedAsset }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();

  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  // console.log(selectedAsset);

  const initialValues = {
    amount: selectedAsset?.ManualFiatbalance || "",
    amountInCryoto: selectedAsset?.Manualbalance || "",
  };

  const userSchema = yup.object().shape({
    amount: yup
      .number()
      .typeError("amount must be a number")
      .required("amount required"),
    amountInCryoto: yup
      .number()
      .typeError("amountInCryoto must be a number")
      .required("amountInCryoto required")
  });

  const [formData, setFormData] = useState(initialValues);

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

  //   const [amount, setAmount] = useState(0);
  //   const [amountInCryoto, setAmountInCryoto] = useState(0);

  // console.log(amountInCryoto)

  const updateWallet = (values) => {
       handleCloseModal()
      
      const userData = {
          ...values,
          symbol: selectedAsset?.symbol,
        };
        dispatch(adminManualUpdateAssetBalance({ id, userData }));
        // console.log(userData)
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: { xs: "95%", sm: "60%", md: 450 },
        maxHeight: "100%",
        overflow: "auto",
        bgcolor: "background.paper",
        // border: "2px solid #000",
        boxShadow: 24,
        borderRadius: "10px",
        p: 2,
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ pb: 0.5 }} variant="h6" fontWeight={"bold"}>
            Manual Mode Update
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton
              size="small"
              sx={{ border: "1px solid grey" }}
              onClick={handleCloseModal}
            >
                {isSemiLoading ? <CircularProgress size={18} /> : <X /> }
              
            </IconButton>
          </Stack>
        </Stack>
        <Divider flexItem />

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
            <img
              src={selectedAsset?.image}
              alt={selectedAsset?.name}
              width={"40"}
              height={"40"}
              style={{ backgroundColor: "white", borderRadius: "50%" }}
            />
            <Typography variant="h6">{selectedAsset?.name}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack my={3}>
        <Typography fontWeight={700} color={"springgreen"}>
          {selectedAsset?.name} Balance
        </Typography>
        <Typography>
          {" "}
          Fiat Balance:{" "}
          <span style={{ color: "springgreen" }}>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: singleUser?.currency?.code,
              ...(selectedAsset?.ManualFiatbalance > 999999
                ? { notation: "compact" }
                : {}),
            }).format(selectedAsset?.ManualFiatbalance)}
          </span>
        </Typography>
        <Typography variant="subtitle2">
          {selectedAsset?.Manualbalance} {selectedAsset?.symbol.toUpperCase()}{" "}
        </Typography>
      </Stack>

      <Formik
        onSubmit={updateWallet}
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
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <TextField
                fullWidth
                size="medium"
                variant="outlined"
                type="text"
                label="Fiat amount"
                name="amount"
                value={values.amount}
                error={!!touched.amount && !!errors.amount}
                helperText={(touched.amount && errors.amount) || " "}
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "10px",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <Typography>{singleUser?.currency?.code}</Typography>
                  </InputAdornment>
                }
              />

              <TextField
                fullWidth
                size="medium"
                variant="outlined"
                type="text"
                label={`amount in ${selectedAsset?.symbol?.toUpperCase()}`}
                name="amountInCryoto"
                value={values.amountInCryoto}
                error={!!touched.amountInCryoto && !!errors.amountInCryoto}
                helperText={
                  (touched.amountInCryoto && errors.amountInCryoto) || " "
                }
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "10px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>
                        {selectedAsset?.symbol?.toUpperCase() || ""}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
              {/* {console.log(selectedAsset?.price)} */}
            </Stack>

            <Stack mt={2}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                sx={{ borderRadius: "10px", padding: "10px" }}
              >
                Update Wallet
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ManualUpdateAsset;
