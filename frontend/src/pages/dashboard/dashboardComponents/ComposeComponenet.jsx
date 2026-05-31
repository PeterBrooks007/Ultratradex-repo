import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  InputAdornment,
  InputBase,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Calculator, Envelope, EnvelopeSimple, PaperPlaneTilt, X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addmail,
} from "../../../redux/features/mailbox/mailboxSlice";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";


const ComposeComponenet = ({
  openComposeMessage,
  setOpenComposeMessage,
  composeMessageType,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize()

  //   console.log(composeMessageType);

  const { isSemiLoading, selectedMail, allUsers } = useSelector(
    (state) => state.mailbox
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const [uploadLoading, setUploadLoading] = useState(false);


  //   console.log(selectedMail);

  // useEffect(() => {
  //   if (allUsers.length === 0 && composeMessageType === "compose") {
  //     dispatch(getAllUsers());
  //   }
  // }, [dispatch, allUsers.length, composeMessageType]);

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
    from: yup
    .string()
    .sanitize()
    .required("from required")
    .min(2, "from must be at least 2 characters long")
    .max(100, "from cannot exceed 100 characters"),
    // to: yup
    // .string()
    // .sanitize()
    // .required("to required")
    // .min(2, "to must be at least 2 characters long")
    // .max(50, "to cannot exceed 50 characters"),
    subject: yup
    .string()
    .sanitize()
    .required("subject required")
    .min(2, "subject must be at least 2 characters long")
    .max(50, "subject cannot exceed 50 characters"),
    content: yup
    .string()
    .sanitize()
    .required("content required")
    .min(2, "content must be at least 2 characters long")
    .max(1000, "content cannot exceed 1000 characters"),
  });



  const initiatialValue = {
    from: user?.email,
    to: "Support Team",
    subject: composeMessageType === "reply" ? selectedMail?.subject : "",
    content: "",
  };

  const [inputs, setInputs] = useState(initiatialValue);

  // console.log(inputs)

  useEffect(() => {
    if (selectedMail) {
      setInputs({
        from: user?.email,
    to: "Support Team",
    subject: composeMessageType === "reply" ? selectedMail?.subject : "",
    content: "",
      });
    }
  }, [selectedMail, composeMessageType, user?.email]);

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setInputs((values) => ({ ...values, [name]: value }));
  // };


   const handleFormSubmit = async (values, { resetForm }) => {

    // console.log(values)

    setUploadLoading(true);
    // alert(inputs);

    const formData = {
      userId: user._id,
      messages: [
        {
          to:  "Support Team",
          from: user?.email,
          subject: values.subject,
          content: values.content,
        },
      ],
    };

    // console.log("formData:", formData)
    await dispatch(addmail(formData));
    resetForm();
    setInputs(null)
    setUploadLoading(false);
  };


  return (
    <>
      {isSemiLoading ? (
        <Box
          backgroundColor={
            theme.palette.mode === "light"
              ? "white"
              : colors.dashboardbackground[100]
          }
          position={{ xs: "absolute", md: "absolute" }}
          right={0}
          bottom={0}
          zIndex={1001}
          border={{
            xs: "none",
            md:
              theme.palette.mode === "light"
                ? "0px solid grey"
                : "1px solid grey",
          }}
          borderTop={{ xs: "1px solid grey" }}
          sx={{
            display: openComposeMessage ? "flex" : "none",
            width: {
              xs: "100%",
              md: "50%",
            },
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
            height: {
              xs: "100%",
              md: "60%",
            },
            transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
          }}
          // display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
          borderRadius={{ xs: "none", md: "10px 10px 0px 0px" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          backgroundColor={
            theme.palette.mode === "light"
              ? "white"
              : colors.dashboardbackground[100]
          }
          position={{ xs: "absolute", md: "absolute" }}
          right={{ xs: 0, md: 20 }}
          bottom={0}
          zIndex={1001}
          border={{
            xs: "none",
            md:
              theme.palette.mode === "light"
                ? "0px solid grey"
                : "1px solid grey",
          }}
          borderTop={{ xs: "1px solid grey" }}
          sx={{
            display: openComposeMessage ? "block" : "none",
            width: {
              xs: "100%",
              md: "50%",
            },
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            overflow: "auto",
            minHeight: "60%",
            height: {
              xs: "100%",
              md: "auto",
            },
            transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
            pb: "60px",
          }}
          borderRadius={{ xs: "none", md: "10px 10px 0px 0px" }}
        >
          <Stack
            p={2}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1}
            >
              <EnvelopeSimple size={28} />
              <Typography>Send Message</Typography>
            </Stack>
            <X size={"24"} onClick={() => setOpenComposeMessage(false)} />
          </Stack>

          <Divider />

          <Formik
        onSubmit={handleFormSubmit}
        initialValues={inputs}
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


          <form action="" onSubmit={handleSubmit}>
           
              <InputBase
                startAdornment={
                  <InputAdornment position="start">
                    <Typography>To:</Typography>
                  </InputAdornment>
                }
                sx={{
                  p: 1,
                  pl: 2,
                }}
                placeholder="to"
                name="to"
                value={"Support Team"}
                onChange={handleChange}
                readOnly={true}
              />
           

            <OutlinedInput
              placeholder=""
              size="small"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              readOnly={composeMessageType === "reply" && true}
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{ marginRight: "10px", marginLeft: "2px" }}
                >
                  <Typography>Subject:</Typography>
                </InputAdornment>
              }
              sx={{
                py: "10px",
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0px",
                  // border: "none",
                  borderRight: "none",
                  borderLeft: "none",
                },
              }}
            />

{touched.subject && errors.subject && (
            <FormHelperText error sx={{ml: 2}}>{errors.subject}</FormHelperText> 
          )}
            


            <Box
              height={"auto"}
              maxHeight={size.height < 967 ? "200px" : "400px"}
              overflow={"hidden"}
            >
              <InputBase
                multiline
                sx={{
                  width: "100%",
                  // border: "2px solid grey",
                  p: 1,
                  pl: 2,
                  pt: 2,
                }}
                placeholder="Message Content"
                name="content"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur} 
                inputProps={{
                  maxLength: 1001, 
                }}
              />
            </Box>

                
          {touched.content && errors.content && (
              <FormHelperText error sx={{ml: 2}}>{errors.content}</FormHelperText> 
            )}
                    



            <Box position={"absolute"} bottom={{xs: 100, md: 10}}>
              <Button
                startIcon={<PaperPlaneTilt style={{display: uploadLoading && "none"}} />}
                type="submit"
                variant="contained"
                sx={{ mt: 3, ml: 2, minWidth: "200px" }}
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                        <CircularProgress size={22} />
                      ) : (
                        "  Send Message"
                      )}
               
              </Button>
            </Box>
          </form>

          
)}
</Formik>

        </Box>
      )}
    </>
  );
};

export default ComposeComponenet;
