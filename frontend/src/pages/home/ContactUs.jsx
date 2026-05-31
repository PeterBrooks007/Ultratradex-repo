import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import headerImage from "../../assets/overview_header_bg.jpg";
import { Phone, MapPin, Envelope } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { contactUs } from "../../redux/features/auth/authSlice";

import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; //

const ContactUs = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isSemiLoading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message: "",
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
    subject: yup
      .string()
      .sanitize()
      .required("subject required")
      .max(50, "subject cannot exceed 50 characters"),
    message: yup
      .string()
      .sanitize()
      .required("message required")
      .max(300, "message cannot exceed 300 characters"),
  });

  const [profile, setProfile] = useState(initialState);

  const sendMessage = async (values) => {
    const userData = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      subject: values.subject,
      message: values.message,
    };

    // console.log(userData);

    await dispatch(contactUs(userData));
    await setIsEditing(false);
  };

  return (
    <>
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        height={{ xs: "120px", sm: "150px", md: "150px", xl: "200px" }}
        sx={{
          backgroundImage: ` url(${headerImage})`,
          backgroundSize: "cover", // Ensures the image covers the entire Box
          backgroundPosition: {
            xs: "75% ", // 100px from the left and vertically centered on small screens
            md: "center", // Fully centered for medium screens and larger
          },
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight={"500"}
          color={"white"}
        >
          Contact Us
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h5"}
          color={"white"}
          textAlign={"center"}
        >
          If you have any complain or enquiry to make, do well to send us a
          message
        </Typography>
      </Stack>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "lg", margin: "20px auto" }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Get in Touch
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Fill out the form below, and we’ll get back to you as soon as
                possible.
              </Typography>
              <Formik
                onSubmit={sendMessage}
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
                          placeholder="firstname"
                          variant="outlined"
                          fullWidth
                          //   size="small"
                          name="firstname"
                          value={values?.firstname}
                          error={!!touched.firstname && !!errors.firstname}
                          helperText={touched.firstname && errors.firstname}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <TextField
                          placeholder="lastname"
                          variant="outlined"
                          fullWidth
                          //   size="small"
                          name="lastname"
                          value={values.lastname}
                          error={!!touched.lastname && !!errors.lastname}
                          helperText={touched.lastname && errors.lastname}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Stack>

                      <TextField
                        placeholder="Email"
                        variant="outlined"
                        fullWidth
                        // size="small"
                        name="email"
                        value={values.email}
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />

                      <TextField
                        placeholder="Subject"
                        variant="outlined"
                        fullWidth
                        // size="small"
                        name="subject"
                        value={values?.subject}
                        error={!!touched.subject && !!errors.subject}
                        helperText={touched.subject && errors.subject}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        // disabled={!isEditing && true}
                      />

                      <TextField
                        placeholder="Enter Message"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        // size="small"
                        name="message"
                        value={values?.message}
                        error={!!touched.message && !!errors.message}
                        helperText={touched.message && errors.message}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        // disabled={!isEditing && true}
                      />

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
                        disabled={isSemiLoading && true}
                      >
                        {isSemiLoading ? (
                          <CircularProgress size={28} />
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                You can also reach us directly via email, phone, or visit us at
                our office.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Envelope size={22} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  support@ultratradex.io
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone size={22} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  VIPs ONLY
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MapPin size={22} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  30 St Mary Axe (The Gherkin), London, EC3A 8BF, United Kingdom
                </Typography>
              </Box>
            </Box>

            {/* Embedded Map */}
            <Box
              sx={{
                mt: 4,
                height: isMobile ? "200px" : "300px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.9302783298995!2d-0.0828814230111647!3d51.51449511018453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876034d372b3ded%3A0x5c81b8a1a822fda8!2s30%20St%20Mary%20Axe%20(The%20Gherkin)!5e0!3m2!1sen!2sng!4v1739856895358!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{ borderTop: "0.5px solid darkgrey", padding: "10px" }}
        backgroundColor="black"
        color={"white"}
      >
        (c) Copyright © {new Date().getFullYear()} ultratradex, Inc.
      </Box>
    </>
  );
};

export default ContactUs;
