import {
  Autocomplete,
  Avatar,
  Box,
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
import { updateUser } from "../redux/features/auth/authSlice";
import { tokens } from "../theme";
import { shortenText } from "../utils";
import { countries } from "../data";

const EditProfile = ({ profile, setProfile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);

  const elevation = theme.palette.mode === "light" ? 1 : 0;
  const { isLoading, user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);


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

  const saveProfile = async (e) => {
    e.preventDefault();
    const userData = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      phone: profile.phone,
      address: {
        address: profile.address.address,
        state: profile.address.state,
        country: selectedCountry ? selectedCountry.label : profile?.address.country,
        countryFlag: selectedCountry ? selectedCountry.code.toLowerCase() : user?.address?.countryFlag.toLowerCase(),      },
    };

    await dispatch(updateUser(userData));
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

      <Stack direction={"row"} alignItems={"center"} p={"10px 0"} spacing={1} display={{xs: "flex", md: "none"}}>
        <Avatar src={profile?.photo} alt="profile picture" sx={{width: "60px", height: "60px"}} />
        <Stack>
          <Typography variant="h6" fontWeight={"600"}>
          {profile?.firstname} {profile?.lastname}
          </Typography>
          <Typography variant="caption">
            {" "}
            {shortenText(profile?.email, 30)}
          </Typography>
        </Stack>
      </Stack>
      <Divider />

      <form onSubmit={saveProfile}>
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
              disabled={!isEditing && true}
            />
            <TextField
              placeholder="lastname"
              variant="outlined"
              fullWidth
              //   size="small"
              name="lastname"
              value={profile?.lastname}
              onChange={handleInputChange}
              disabled={!isEditing && true}
            />
          </Stack>

          <TextField
            placeholder="phone"
            variant="outlined"
            fullWidth
            // size="small"
            name="phone"
            value={profile?.phone}
            onChange={handleInputChange}
            disabled={!isEditing && true}
          />

          <TextField
            placeholder="address"
            variant="outlined"
            fullWidth
            // size="small"
            name="address.address"
            value={profile?.address?.address}
            onChange={handleInputChange}
            disabled={!isEditing && true}
          />

          <TextField
            placeholder="state"
            variant="outlined"
            fullWidth
            // size="small"
            name="address.state"
            value={profile?.address?.state}
            onChange={handleInputChange}
            disabled={!isEditing && true}
          />
          {/* <TextField
            placeholder="country"
            variant="outlined"
            fullWidth
            // size="small"
            name="address.country"
            value={profile?.address?.country}
            onChange={handleInputChange}
            disabled={!isEditing && true}
          /> */}

<Typography>
             Country: {profile?.address?.country}
          </Typography>

           <Autocomplete
                       disabled={!isEditing && true}
                      id="country-select-demo"
                      sx={{ width: "100%" }}
                      options={countries}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      onChange={(event, newValue) =>
                        setSelectedCountry(newValue)
                      }
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                          <Box
                                  key={key}
                                  component="li"
                                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                  {...optionProps}
                                >
                                  <img
                                    loading="lazy"
                                    width="25"
                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                    alt=""
                                  />
                                  {option.label} (+{option.phone})
                                </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Change country"
                          slotProps={{
                            htmlInput: {
                              ...params.inputProps,
                              autoComplete: "new-password", // disable autocomplete and autofill
                            },
                          }}
                        />
                      )}
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
            disabled={isLoading || (!isEditing && true)}
          >
            {isLoading ? <CircularProgress size={28} /> : "Update Details"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default EditProfile;
