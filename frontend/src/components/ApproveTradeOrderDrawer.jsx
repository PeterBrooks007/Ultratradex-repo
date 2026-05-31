import { useEffect } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Moon, Sun, X } from "@phosphor-icons/react";
import { tokens } from "../theme";
import EditProfile from "../pages/admin/adminComponents/EditProfile";
import EditTradeOrder from "./drawers/EditTradeOrder";
import ApproveTradeOrder from "./drawers/ApproveTradeOrder";

const ApproveTradeOrderDrawer = ({
  open,
  handleClose,
  handleOpen,
  openApproveTradeOrderDrawerLoader,
  setApproveTradeOrderDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

// console.log(openTradeOrderDrawerLoader);

  useEffect(() => {
    if (openApproveTradeOrderDrawerLoader) {
      const timer = setTimeout(() => {
        setApproveTradeOrderDrawerLoader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [openApproveTradeOrderDrawerLoader, setApproveTradeOrderDrawerLoader]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      ModalProps={{
        BackdropProps: {
          invisible: true, // Disables the backdrop
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "550px" },
        },
      }}
    >
      {openApproveTradeOrderDrawerLoader ? (
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
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
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
              Approve Trade Order
              </Typography>
            </Toolbar>
          </AppBar>

          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={0.5}
            mx={2}
            mt={4}
            
          >
            <Skeleton variant="rectangular" sx={{width: "100%", height: "30px", borderRadius: "10px 0px 0px 10px"}} />
            <Skeleton variant="rectangular" sx={{width: "100%", height: "30px", borderRadius: "0px 10px 10px 0px"}} />
            
          </Stack>
        </Box>
      ) : (
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
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
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
                Approve Trade Order
              </Typography>
            </Toolbar>
          </AppBar>

          <Box>
            <ApproveTradeOrder />
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default ApproveTradeOrderDrawer;
