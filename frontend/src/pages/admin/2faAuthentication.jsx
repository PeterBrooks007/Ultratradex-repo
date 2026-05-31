import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus, twofaAuthentication } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import { tokens } from "../../theme";
import { IOSSwitch } from "../dashboard/Profile";
import UseWindowSize from "../../hooks/UseWindowSize";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const ChangePassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading


  const { isLoading, user } = useSelector((state) => state.auth);
  const elevation = theme.palette.mode === "light" ? 1 : 0;

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);


  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if(user?.isTwoFactorEnabled) {
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
      isTwoFactorEnabled: isChecked
    }

    // console.log(userData);


    await dispatch(twofaAuthentication(userData));
  };





  return (
    <>
      {isLoading || !user || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box m={"20px"} height={"90vh"} overflowY={"hidden"} pb={5}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Header
              title={"2fa Authentication"}
              subtitle={
                "Set up Two factor authentication for a stronger account security"
              }
            />

            {/* <Button variant="contained" onClick={handleOpenAddExpertTraderDrawer}>ADD TRADING BOT</Button> */}
          </Stack>

          <Paper sx={{ p: 2 }}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              component={Paper}
              p={2}
              elevation={elevation}
              backgroundColor={`${colors.dashboardbackground[100]}`}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Stack spacing={1}>
                  <Typography
                    variant={size.width <= 600 ? "body1" : "h5"}
                    fontWeight={600}
                  >
                    Two-Factor Authentication (2FA)
                  </Typography>
                  <Typography color={"orange"}>
                    Kindly set up 2 factor authentication for a stronger account
                    security.
                  </Typography>
                </Stack>

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={2}
                  mt={2}
                >
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
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ChangePassword;
