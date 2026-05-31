import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import "./GetStartedSlider.css";
import { Box, Button, Stack, Typography, useTheme, Link } from "@mui/material";
import { tokens } from "../../theme";
import slider1Image from "../../assets/mockup_images/3126834-cover.png";
import slider2Image from "../../assets/mockup_images/device-mobile-branch-wallet.png";
import slider3Image from "../../assets/mockup_images/customer-2.png";

import { Link as RouterLink } from "react-router-dom";

import UseWindowSize from "../../hooks/UseWindowSize";

import { DotButton, useDotButton } from "./EmblaCarouselDotButton";

import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import HomeHeader from "../../pages/home/HomeHeader";

const GiftSlider = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: "start" },
    [Autoplay({ delay: 40000, stopOnInteraction: false })]
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section
      className="embla"
      style={{
        position: "relative",
        height: size.height,
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: `${colors.dashboardbackground[100]}`,
        overflow: "hidden",
      }}
    >
      <Box
        backgroundColor={`${colors.dashboardbackground[100]}`}
        style={{
          position: "sticky",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <HomeHeader />
      </Box>

      <div className="embla__viewport" ref={emblaRef} style={{height: size.height - 80, overflow: "auto" }}>
        <div className="embla__container">
          {/* first slide */}
          <div
            className="embla__slide"
            // style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Stack
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              // boxShadow={
              //   theme.palette.mode === "light" &&
              //   `${theme.shadows[2]} !important`
              // }
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              // mt={2}
              // border={"2px solid green"}
            >
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                spacing={3}
                m={2}
                // mt={4}
              >
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={2}
                >
                  <img
                    src={slider1Image}
                    alt="happyclient"
                    width={"80%"}
                    // style={{ marginTop: 4 }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="h5" textAlign={"left"}>
                    Trade Like a Pro
                  </Typography>
                  <Typography variant="body2" textAlign={"left"}>
                    Welcome to your all-in-one trading hub for Forex, Stocks,
                    and Cryptocurrency. Our platform is built for traders of all
                    levels, offering advanced tools, real-time data, and
                    seamless execution to empower your trading journey.
                  </Typography>

                  <div className="embla__controls" style={{ marginTop: 20 }}>
                    <div className="embla__buttons">
                      <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                      />
                      <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                      />
                    </div>
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </div>

          {/* Second slide */}

          <div
            className="embla__slide"
            // style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Stack
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              // boxShadow={
              //   theme.palette.mode === "light" &&
              //   `${theme.shadows[2]} !important`
              // }
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                flex={1}
                spacing={3}
                m={2}
              >
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={2}
                >
                  <img src={slider3Image} alt="happyclient" width={"80%"} />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="h5" textAlign={"left"}>
                    Build Wealth With Our Platform.
                  </Typography>
                  <Typography variant="body2" textAlign={"left"}>
                    Invest in the World’s Top Companies Seize opportunities in
                    the stock market by trading shares of industry-leading
                    corporations. With our intuitive platform, you can easily
                    buy, sell, or short stocks while benefiting from real-time
                    data and insightful analysis.
                  </Typography>

                  <div className="embla__controls" style={{ marginTop: 20 }}>
                    <div className="embla__buttons">
                      <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                      />
                      <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                      />
                    </div>
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </div>

          {/* Third slide */}
          <div
            className="embla__slide"
            // style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Stack
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              // boxShadow={
              //   theme.palette.mode === "light" &&
              //   `${theme.shadows[2]} !important`
              // }
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                flex={1}
                spacing={3}
                m={2}
              >
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={2}
                >
                  <img
                    src={slider2Image}
                    alt="happyclient"
                    width={"80%"}
                    style={{ marginTop: "30px" }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography
                    variant={size.width > 370 ? "h5" : "h6"}
                    textAlign={"left"}
                  >
                    Ride the Crypto Wave
                  </Typography>
                  <Typography
                    variant={size.width > 370 ? "body2" : "caption"}
                    textAlign={"left"}
                  >
                    Dive into the dynamic world of cryptocurrencies and trade
                    the top digital assets like Bitcoin, Ethereum, and more.
                    With our cutting-edge platform, you can capitalize on market
                    volatility and unlock new opportunities 24/7.
                  </Typography>

                  <Stack width={"100%"}>
                    <Link
                      component={RouterLink}
                      to="/auth/register"
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
                          fontSize: size.width > 370 ? "18px" : "16px",
                        }}
                        fullWidth
                      >
                        Create Account
                      </Button>
                    </Link>
                  </Stack>

                  <div className="embla__controls" style={{ marginTop: 20 }}>
                    <div className="embla__buttons">
                      <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                      />
                      <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                      />
                    </div>

                    {/* <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                          <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={"embla__dot".concat(
                              index === selectedIndex ? " embla__dot--selected" : ""
                            )}
                          />
                        ))}
                      </div> */}
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftSlider;
