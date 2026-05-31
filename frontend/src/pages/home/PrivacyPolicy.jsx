import React from 'react'
import TermsAndConditions from '../../components/TermsAndConditions'
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import headerImage from "../../assets/overview_header_bg.jpg";
import PrivacyAndPolicy from '../../components/PrivacyAndPolicy';


const PrivacyPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            variant={isMobile ? "h3" : "h2"}
            fontWeight={"500"}
            color={"white"}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            color={"white"}
            textAlign={"center"}
          >
          Your privacy is important to us
          </Typography>
        </Stack>

        <PrivacyAndPolicy />
    </>
  )
}

export default PrivacyPolicy