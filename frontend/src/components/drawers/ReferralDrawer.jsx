import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft } from "@phosphor-icons/react";
import { tokens } from "../../theme";
import ReferralSystem from "../../pages/dashboard/dashboardComponents/ReferralSystem";

const ReferralDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: {xs: "100%", md: "auto"}, 
        },
      }}
    >
      <Box
        backgroundColor={colors.dashboardforeground[100]}
        width={"100%"}
        height={"100%"}
        overflow={"auto"}
      >
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: `${
              theme.palette.mode === "light"
                ? "lightgrey"
                : colors.dashboardbackground[100]
            }`,
            top: 0,
            height: "56px"
          }}
          color="grey"
        >
          <Toolbar variant="dense" sx={{minHeight: "56px"}}>
            <IconButton
              edge="start"
              
              aria-label="menu"
              sx={{ mr: 2, backgroundColor: "grey" }}
              onClick={handleClose}
              size="small"
             
            >
              <ArrowLeft size={26} />
            </IconButton>
            <Typography variant="body1" color="inherit" component="div">
              Referral System
            </Typography>
          </Toolbar>
        </AppBar>

        <Box>
          <ReferralSystem />
        </Box>


      </Box>
    </Drawer>
  );
};

export default ReferralDrawer;
