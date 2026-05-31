import {
  Box,
  Container,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import headerImage from "../../assets/overview_header_bg.jpg";
import macbookpro from "../../assets/mockup_images/macbook_Mockup_singleWhite.png";
import icmHeaderBg from "../../assets/icmHeaderBg.jpg";
import iPhone_Mockup_doubleWhite from "../../assets/mockup_images/iPhone_Mockup_doubleWhite.png";
import sectn1Img from "../../assets/sectn1Img.png";
import iPhone_Mockup_singleWhite from "../../assets/mockup_images/iPhone_Mockup_singleWhite.png";
import iPhone_Mockup_singleDark from "../../assets/mockup_images/iPhone_Mockup_singleDark.png";
import image21 from "../../assets/mockup_images/3126834-cover.png";
import device_mobile_branch_wallet from "../../assets/mockup_images/device-mobile-branch-wallet.png";
import TestimonialSection from "../../components/TestimonialSection ";
import certificate from "../../assets/certificate.jpg"
import PackagePlans from "../../components/PackagePlans";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box height={"auto"} overflow={"auto"} pb={2}>
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
            variant={isMobile ? "h3" : "h2"}
            fontWeight={"500"}
            color={"white"}
          >
            About Us
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            color={"white"}
            textAlign={"center"}
          >
            We are 100% Trusted Trading Broker
          </Typography>
        </Stack>

        <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={5}
            p={"10px 5px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box sx={{ flex: "50%" }}>
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 1 }} fontWeight={"500"}>
                Who we are ?
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"} color={"grey"}>
                Ultratradex Investment offers state-of-the-art trading technology
                and online electronic brokerage services to active individual
                and Passive traders in the U.K. and worldwide. The company’s
                innovative trading and analysis platform provides one-click
                access to all major U.K. exchanges and market centers, while its
                expansive product offering enable clients to enjoy a risk-free,
                effortless, auto trading and account management trading sessions
                after moment of account activation. 
                <span style={{display: isMobile ? 'none' : "flex", marginTop: "15px"}}>
                Ultratradex Investment’s fully customizable market monitoring,
                charting and analysis tools help clients to identify and act
                instantly on trading opportunities. The first-of-its-kind
                Ultratradex Investment Trading Planing offers hundreds of custom
                Ultratradex Investment-compatible software products – indicators,
                strategies and other apps – that further amplify the power of
                the Ultratradex Investment platform. With Ultratradex Investment web
                trading, clients on the go can access core features of the
                platform from their iOS or Android device, synchronized to their
                online accounts in real time.</span>
              </Typography>
            </Box>

            <Box flex={"50%"}>
              <img src={macbookpro} alt="" width={"100%"} />
            </Box>
          </Box>
        </Container>

        <Box
          width={"100%"}
          height={"auto"}
          sx={{
            backgroundImage: `url(${icmHeaderBg})`,
            backgroundSize: "cover",
            backgroundPosition: {
              xs: "75% ",
              md: "center",
            },
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
          }}
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-evenly"}
          color={"white"}
          p={3}
          gap={2}
        >
          <Stack alignItems={"center"}>
            <Typography variant="h4">0.0</Typography>
            <Typography variant="body1">Pip Spreads*</Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography variant="h4">1:500</Typography>
            <Typography variant="body1">Leverage</Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography variant="h4">0.01</Typography>
            <Typography variant="body1">Micro Lot Trading</Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography variant="h4">1750+</Typography>
            <Typography variant="body1">Tradable Instruments</Typography>
          </Stack>
        </Box>

        <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={{xs: 0, md: 5}}
            p={"10px 5px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box flex={"50%"}>
              <img src={iPhone_Mockup_doubleWhite} alt="" width={"100%"} />
            </Box>
            <Box sx={{ flex: "50%" }}>
            <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 1 }} fontWeight={"500"}>
                Innovation is written in our code.
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"} color={"grey"}>
                At Ultratradex Investment we believe in empowering traders to claim
                their financial edge. Whether you are new to trading or a
                seasoned professional, through a full suite of powerful trading
                technology, online brokerage services, and trading education, we
                are committed to empowering you to unlock your trading and
                investor potential.Trade stocks, ETFs, futures, options, or
                crypto with reliable execution on powerful platforms, broad
                market access, and competitive pricing models. At Ultratradex
                Investment, traders and investors have the tools to compete in
                numerous markets, the data to test and optimize their
                strategies, and the community to share their knowledge and learn
                new skills.
                <br /> <br />
              </Typography>
            </Box>
          </Box>
        </Container>

        <Box backgroundColor="#f4f4f4">
          <Container maxWidth="xl">
            <Box
              display={"flex"}
              flexDirection={{ xs: "column", md: "row" }}
              p={4}
              px={{xs: 0, md:10}}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box flex={"50%"}>
                <Typography color={"grey"} variant={isMobile ? "h4" : "h3"}>
                  Spreads from 0.0 pips
                </Typography>
                <Typography
                  variant={isMobile ? "subtitle2" : "body1"}
                  color={"grey"}
                >
                  Ultratradex EURUSD Avg spread of 0.1 is one of the
                  best in the world. Raw spreads means really from 0.0 pips.{" "}
                  <br />
                  <br />
                  Our diverse and proprietary liquidity mix keeps spreads tight
                  24/5. <br /> <br />
                </Typography>
              </Box>
              <Box flex={"50%"} display={"flex"} justifyContent={"center"}>
                <img src={sectn1Img} alt="" width={"70%"} />
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={5}
            p={"10px 5px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box sx={{ flex: "50%" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Build Wealth With Our Platform.
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"} color={"grey"}>
                Invest in the World’s Top Companies Seize opportunities in the
                stock market by trading shares of industry-leading corporations.
                With our intuitive platform, you can easily buy, sell, or short
                stocks while benefiting from real-time data and insightful
                analysis. <br />
                <br /> Ultratradex is the one of the top choices for
                automated traders. Our order matching engine located in the United Kingdom with data centre processes over 500,000 trades per
                day with over two thirds of all trades coming from automated
                trading systems.trade
              </Typography>
            </Box>
            <Box flex={"50%"} display={"flex"} justifyContent={"center"}>
              <img src={iPhone_Mockup_singleWhite} alt="" width={isMobile ? "90%" : "70%"} />
            </Box>
          </Box>
        </Container>

        <Divider />

        <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={5}
            p={"10px 5px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box flex={"50%"} display={"flex"} justifyContent={"center"}  order={{ xs: 1, md: 0 }}>
              <img src={image21} alt="" width={"90%"} />
            </Box>
            <Box sx={{ flex: "50%" }} order={{ xs: 0, md: 1 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Trade Stocks, ETFs, Crypto, Options, Futures and more
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"}>
                In today&apos;s fast-paced financial markets, investors have an array
                of instruments to explore and trade, each catering to diverse
                goals, risk appetites, and investment strategies. Here&apos;s a
                breakdown of these financial products and what makes them
                unique: <br />
                <br />
                Stocks <br />
                Stocks represent ownership in a company and are one of the most
                common and accessible investment options. Traders can profit
                from price movements in the stock market or earn dividends from
                long-term holdings. With global exchanges offering shares from
                various sectors, investors can build diverse portfolios aligned
                with their risk and return objectives.
                <br />
                <br />
              
                Cryptocurrencies
                <br />
                Cryptocurrencies, like Bitcoin and Ethereum, have emerged as
                transformative digital assets. These decentralized currencies
                operate on blockchain technology and offer unique opportunities
                for speculative trading and long-term investment. The crypto
                market is known for its volatility, presenting significant
                potential returns but also heightened risk.

                <br /><br />
                And more...
              </Typography>
            </Box>
          </Box> 
        </Container>

        <Divider />

        <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={5}
            p={"10px 5px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box sx={{ flex: "50%" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
              Ride the Crypto Wave
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"}>
              The cryptocurrency market is transforming the global financial landscape, offering a dynamic, fast-paced environment for traders and investors alike. As digital assets continue to evolve, they present unparalleled opportunities to grow wealth and diversify portfolios. Here’s why you should dive in and make the most of the crypto wave:
Trade the Top Digital Assets <br /> <br />

From the pioneers like Bitcoin (BTC) and Ethereum (ETH) to emerging altcoins with promising potential, the cryptocurrency market offers a vast selection of assets to explore. Each asset comes with unique characteristics and use cases, enabling traders to tailor their strategies to specific goals.

   
              </Typography>
            </Box>
            <Box flex={"50%"} display={"flex"} justifyContent={"center"}>
              <img src={device_mobile_branch_wallet} alt="" width={"80%"} />
            </Box>
          </Box>
        </Container>

        <Divider />

       <Box  width={{xs:"100%", md: "60%"}} height={"auto"} margin={"auto"}>
        <TestimonialSection />

       </Box>


        <Divider />


       <Container maxWidth="xl">
          <Box
            display={"flex"}
            mt={4}
            gap={5}
            p={"20px 5px"}
            pb={"50px"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={{ xs: "column", md: "row" }}
          >
             <Box flex={"50%"} display={"flex"} justifyContent={"center"}>
              <img src={certificate} alt="" width={"100%"} />
            </Box>
            <Box sx={{ flex: "50%" }}>
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 1 }}>
              Registered Trading Company
              </Typography>
              <Typography variant={isMobile ? "subtitle2" : "body1"}>
              Ultratradex is a fully registered and compliant trading company with a robust history of excellence in facilitating domestic and international trade. Our company is recognized for its integrity, transparency, and adherence to industry standards, making us a trusted partner for clients and suppliers alike. With full regulatory registration and compliance certifications, we are committed to providing a secure and efficient trading environment.
   
              </Typography>
            </Box>
           
          </Box>
        </Container>

        <Divider />

        <Box>
          <PackagePlans  />
        </Box>


       


        <Box
          display={"flex"}
          justifyContent={"center"}
          sx={{ borderTop: "0.5px solid darkgrey", padding: "10px" }}
          backgroundColor="black"
          color={"white"}
        >
      (c) Copyright © {new Date().getFullYear()} Ultratradex, Inc.       
       </Box>
      </Box>
    </>
  );
};

export default About;
