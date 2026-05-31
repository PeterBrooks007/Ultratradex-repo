import React from 'react'
import TermsAndConditions from '../../components/TermsAndConditions'
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import headerImage from "../../assets/overview_header_bg.jpg";


const Terms = () => {
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
               variant={isMobile ? "h4" : "h2"}
               fontWeight={"500"}
               color={"white"}
             >
               Terms and Conditions
             </Typography>
             <Typography
               variant={isMobile ? "body1" : "h5"}
               color={"white"}
               textAlign={"center"}
             >
             Please read the following terms and conditions carefully before using our platform.
             </Typography>
           </Stack>

        <TermsAndConditions />
    </>
  )
}

export default Terms