import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import HeroImg from "../../assets/mockup_images/iPhone_Mockup_doubleWhite.png";
import HeroImgmobile from "../../assets/mockup_images/device-mobile-branch-uk.png";

import logo from "../../assets/favicon_logo.png"

import HeroBackgroundImage from "../../assets/herobackgroundImageMobile.jpg";

import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const HomeMobile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (

    <Box
    // display={"flex"}
    // flexDirection={"column"}
    height={"100vh"}
    // height={{ xs: `${size.height}px`, md: `${size.height}px` }}
    overflow={"hidden"}
    sx={{
      backgroundImage: `url(${HeroBackgroundImage})`,
      backgroundSize: "cover", // Ensures the image covers the entire Box
      backgroundPosition: {
        xs: "center ", // 100px from the left and vertically centered on small screens
        md: "center", // Fully centered for medium screens and larger
      },
      backgroundRepeat: "no-repeat", // Prevents the image from repeating
    }}
  >
      <Box
        display={"flex"}
        width={"100%"}
        justifyContent={"center"}
        gap={2}
        flexDirection={{ xs: "column", md: "row" }}
        alignContent={"center"}
        margin={isMobile ? "0px 0px" : "0px 16px"}
        pt={2}
        px={1}
        position={"absolute"}
        bottom={0}
        // border={"2px solid green"}
      >
        <MotionBox
          flex={"50%"}
          display={"flex"}
          alignItems={isMobile ? "center" : "flex-start"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={1}
          mb={5}
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          

          <MotionBox
            flex={"50%"}
            display={"flex"}
            justifyContent={isMobile ? "center" : "flex-end"}
            alignItems={"center"}
            initial={{ y: -10 }}
            animate={{ y: 10 }}
          >
            {/* <img
              src={isMobile ? HeroImgmobile : HeroImg}
              alt=""
              width={isMobile ? "400px" : "700px"}
            /> */}
          </MotionBox>

          <Stack direction={"row"} alignItems={"center"} spacing={2} justifyContent={"center"} width={"100%"}>
          
          <Box>
            <img src={logo} alt="logo" width={isMobile ? "50px" : "120px"} />
          </Box>
          <MotionTypography
            variant={isMobile ? "h4" : "h1"}
            sx={{ textShadow: "1px 0px 8px black" }}
            textAlign={isMobile ? "center" : "left"}
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            color={"white"}
            fontWeight={900}
          >
            ULTRATRADEX
          </MotionTypography>

          </Stack>

         

          <MotionTypography
            variant={isMobile ? "h6" : "h3"}
            sx={{ textShadow: "0px 0px 4px black" }}
            textAlign={isMobile ? "center" : "center"}
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            color={"gold"}
            fontWeight={900}
          >
            CHALLENGE THE MARKET WITH <span style={{color: "gold"}}> ULTRATRADEX WEB APP </span>
          </MotionTypography>

          <MotionTypography
            variant={isMobile ? "body1" : "h5"}
            textAlign={isMobile ? "center" : "center"}
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            sx={{ fontWeight: "600", textShadow: "1px 0px 8px black", color: "white" }}

          >
            Join over 26 million users who have already chosen the ultratradex
            web app for trading.
          </MotionTypography>

          <Link
            component={RouterLink}
            to="/auth/get-started"
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "30px",
                p: "15px 20px",
                mt: 2,
                backgroundColor: "green",
                color: "white",
                fontWeight: "700",
                fontSize: isMobile ? "18px" : "32px",
              }}
              fullWidth
            >
              Get Started
            </Button>
          </Link>
          <Stack direction={"row"} alignItems={"center"} spacing={isMobile ? 1 : 2} mt={1} justifyContent={"center"} width={"100%"}>
          <Typography color={"white"} variant={isMobile ? "body1": "h5"}>Already have an account?</Typography>
          <Button
          variant="outlined"
          size={isMobile ? "small" : "large"}
            component={RouterLink}
            to="/auth/login"
            color="secondary"
          >
            Login
          </Button>
            
          </Stack>

         
        </MotionBox>
      </Box>
      </Box>
  );
};

export default HomeMobile;
