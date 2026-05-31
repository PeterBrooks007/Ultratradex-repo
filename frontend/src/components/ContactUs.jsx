import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactUs, updateUser } from "../redux/features/auth/authSlice";
import { tokens } from "../theme";
import { shortenText } from "../utils";

const ContactUs = ({ profile, setProfile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);

  const elevation = theme.palette.mode === "light" ? 1 : 0;
  const { isSemiLoading, user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the name attribute contains '.', it means it's a nested property like 'address.state'
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]; // Extract the field name (e.g., state, country)
      setProfile((prevProfile) => ({
        ...prevProfile,
        address: {
          ...prevProfile.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const sendMessage = async (e) => {
    e.preventDefault();
    const userData = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      subject,
      message,
    };

    // console.log(userData)

    await dispatch(contactUs(userData));
    await setIsEditing(false);
    setSubject("")
    setMessage("")
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
          Send a message{" "}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#009e4a", color: "white" }}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      </Stack>

      <Divider flexItem />

      <form onSubmit={sendMessage}>
        <Stack spacing={2} height={"100%"} mt={3} mb={3}>
          <Stack direction={"row"} spacing={2}>
            <TextField
              placeholder="firstname"
              variant="outlined"
              fullWidth
              //   size="small"
              name="firstname"
              value={profile?.firstname}
              onChange={handleInputChange}
              disabled={true}
            />
            <TextField
              placeholder="lastname"
              variant="outlined"
              fullWidth
              //   size="small"
              name="lastname"
              value={profile?.lastname}
              onChange={handleInputChange}
              disabled={ true}
            />
          </Stack>

          <TextField
            placeholder="phone"
            variant="outlined"
            fullWidth
            // size="small"
            name="Email"
            value={profile?.email}
            onChange={handleInputChange}
            disabled={ true}
          />

          <TextField
            placeholder="Subject"
            variant="outlined"
            fullWidth
            // size="small"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
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
            {isSemiLoading ? <CircularProgress size={28} /> : "Send Message"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ContactUs;
