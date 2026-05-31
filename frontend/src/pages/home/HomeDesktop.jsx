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

import TradingViewWidget from "../../components/TradeviewWidgets/AdvanceChartWidget";
// import CryptoMarketWidget from "../../components/TradeviewWidgets/CryptoMarketWidget";

// import HeroIcon from "../../assets/devices-phones-mobile.png";

import HeroImg from "../../assets/mockup_images/iPhone_Mockup_doubleWhite.png";
import HeroImgmobile from "../../assets/device-mobile-branch-uk.png";

import HeroBackgroundImage from "../../assets/herobackgroundImage.jpg";

import { motion } from "framer-motion";
import {
  CurrencyCircleDollar,
  CurrencyDollar,
  UserCircle,
} from "@phosphor-icons/react";
import YandexTranslateWidget from "../../components/YandexTranslateWidget";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Homedesktop = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <Box
      // display={"flex"}
      // flexDirection={"column"}
      height={"calc(100vh - 80px)"}
      // height={{ xs: `${size.height}px`, md: `${size.height}px` }}
      overflow={"hidden"}
      sx={{
        backgroundImage: `url(${HeroBackgroundImage})`,
        backgroundSize: "cover", // Ensures the image covers the entire Box
        backgroundPosition: {
          xs: "75% ", // 100px from the left and vertically centered on small screens
          md: "top center", // Fully centered for medium screens and larger
        },
        backgroundRepeat: "no-repeat", // Prevents the image from repeating
      }}
    >
      <Container maxWidth="xl">
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          flexDirection={{ xs: "column", md: "row" }}
          margin={isMobile ? "0px 0px" : "0px 30px"}
          pt={2}
          height={"calc(100vh - 100px )"}
        >
          <MotionBox
            flex={"50%"}
            display={"flex"}
            alignItems={isMobile ? "center" : "flex-start"}
            flexDirection={"column"}
            justifyContent={"center"}
            gap={3}
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
            {/* <MotionBox
              backgroundColor="green"
              p={"5px"}
              borderRadius={5}
              display={"flex"}
              alignItems={"center"}
              gap={1}
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Box
                backgroundColor="white"
                color={"black"}
                borderRadius={4}
                padding={"4px 10px"}
                fontWeight={"bold"}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
              >
                35% PROFIT
              </Box>
              <Typography mr={1} color={"white"} fontWeight={"700"}>
                For all trades above $5,000
              </Typography>
            </MotionBox> */}

            <MotionTypography
              variant={isMobile ? "h4" : "h2"}
              sx={{ fontWeight: "bold", color: "white" }}
              textAlign={isMobile ? "center" : "left"}
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              CHALLENGE THE MARKET WITH ULTRATRADEX WEB APP
            </MotionTypography>

            <MotionTypography
              variant="h6"
              textAlign={isMobile ? "center" : "left"}
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              sx={{ textShadow: "1px 0px 2px black", color: "white" }}
            >
              The best trades require research, then commitment.
            </MotionTypography>

            <MotionBox
              display={"flex"}
              justifyContent={"flex-start"}
              gap={2}
              mt={2}
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Link component={RouterLink} to="/auth/register">
                <Button
                  color="secondary"
                  variant="contained"
                  sx={{
                    borderRadius: "40px",
                    fontSize: "25px",
                    p: "16px 32px",
                    backgroundColor: "green",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Get Started Now
                </Button>
              </Link>

              {/* <Link component={RouterLink} to="/auth/login">
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "green",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Login Account
                </Button>
              </Link> */}
            </MotionBox>

            <MotionBox
              display={"flex"}
              justifyContent={"flex-start"}
              gap={2}
              mt={2}
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={2}
              >
                <Typography
                  variant="h5"
                  sx={{ textShadow: "2px 0px 2px black", color: "white" }}
                >
                  Trade Crypto, Stocks, Forex, Indices and More...
                </Typography>
              </Stack>
            </MotionBox>
          </MotionBox>

          <MotionBox
            flex={"50%"}
            display={"flex"}
            justifyContent={isMobile ? "center" : "flex-end"}
            alignItems={"center"}
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{
              type: "smooth",
              repeatType: "mirror",
              duration: 2,
              repeat: Infinity,
              delay: 0.8,
            }}
          >
            {/* <img
              src={isMobile ? HeroImgmobile : HeroImg}
              alt=""
              width={isMobile ? "300px" : "700px"}
            /> */}
          </MotionBox>
        </Box>
      </Container>

      <Box sx={{ marginTop: -8, marginLeft: 10 }}>
        <YandexTranslateWidget />
      </Box>
    </Box>
  );
};

export default Homedesktop;
