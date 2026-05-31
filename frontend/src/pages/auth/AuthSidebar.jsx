import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import LogoImg from "./../../assets/favicon_logo.png";
import { ColorModeContext } from "../../theme";
import { useContext, useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus, getUser } from "../../redux/features/auth/authSlice";

import bgImage from "../../assets/HdCrypto.jpg";
import AuthFooter from "./AuthFooter";
import UseWindowSize from "../../hooks/UseWindowSize";

const AuthHeader = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const size = UseWindowSize();


  const isMobile = useMediaQuery("(max-width: 400px)");

  const dispatch = useDispatch();

  const { user, isLoading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading && isLoggedIn && user === null) {
        await dispatch(getUser());
        // dispatch(RESET_AUTH());
      }
    };
    fetchData();
  }, [dispatch, isLoggedIn, user, isLoading, navigate]);

  return (
    <>
      <Box display={"flex"} flexDirection={"row"}  height={{xs:"auto", md: "100vh"}}
        overflow={"hidden"}>
        <Box
          flex={{ md: "0 0 40%", xl: "0 0 35%" }}
          height={"100vh"}
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          // borderRight={"0.5px solid grey"}
          p={3}
          position={"relative"}
          display={{ xs: "none", md: "block" }}
        >
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
                        <img src={LogoImg} alt="logo" width={40} />

            <Typography variant="h6" color={"white"} fontWeight={"700"}>
            UltraTradex
            </Typography>
          </Stack>

          <Stack position={"absolute"} bottom={20} width={"90%"} p={0}>
            <AuthFooter />
          </Stack>
        </Box>

        <Box
          flex={{ md: "0 0 60%", xl: "0 0 65%" }}
          width={"100%"}
        height={"100%"}
        overflow={"auto"}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default AuthHeader;
