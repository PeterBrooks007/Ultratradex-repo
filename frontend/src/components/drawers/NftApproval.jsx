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
import PropTypes from "prop-types";
import NftsComp from "../NftsComp";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{padding: 2}}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const NftApproval = ({ open, handleClose, handleOpen }) => {
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
          width: { xs: "100%", md: "60%" },
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
              Nft System
            </Typography>
          </Toolbar>
        </AppBar>

        <Box m={2}>
        <NftsComp />
        </Box>

      </Box>
    </Drawer>
  );
};

export default NftApproval;
