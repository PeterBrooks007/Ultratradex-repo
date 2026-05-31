import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  
  CaretRight,
  ClockCounterClockwise,

  X,
} from "@phosphor-icons/react";

import { useEffect, useState } from "react";

import UseWindowSize from "../../../../hooks/UseWindowSize.jsx";
// import DepositHistory from "../DepositHistory.jsx";
// import DepositProof from "../../../../dialogs/DepositProof.jsx";
import { tokens } from "../../../../theme.js";
import AdminUserDepositHistory from "../AdminUserDepositHistory.jsx";


const AdminDepositDrawer = ({
  open,
  handleClose,
  handleOpen,
  depositLoader,
  setdepositLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();

  const [selectedWallet, setSelectedWallet] = useState("history");
  


  // const [selectedWalletImg, setSelectedWalletImg] = useState(0);

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let timer;
    if (isConnecting) {
      timer = setTimeout(() => {
        setIsConnecting(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);

  useEffect(() => {
    if (depositLoader) {
      const timer = setTimeout(() => {
        setdepositLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [depositLoader, setdepositLoader]);




 

  return (
    <>
      <Drawer
        anchor={size.width > 899 ? "right" : "bottom"}
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            height:
              size.width > 899
                ? "100%" // Full height for desktop (right anchor)
                : `${
                    selectedWallet &&
                    selectedWallet !== "enteramount" &&
                    selectedWallet !== "allWallet" &&
                    selectedWallet !== "Bank"
                      ? "100%"
                      : "100%"
                  }`,
            width: size.width > 899 ? 550 : "100%",
            // borderRadius:
            //   size.width > 899 ? "30px 0px 0px 30px" : "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            // borderTop: `${size.width < 899 && "1px solid grey"}`,
            borderLeft: `${size.width > 899 && "1px solid grey"}`,
            transition: "height 2s ease",
          },
        }}
      >
        {depositLoader ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              height={"100%"}
              borderRadius={"30px 30px 0 0"}
              overflow={"hidden"}
              position={"absolute"}
              width={"100%"}
              sx={{
                opacity: selectedWallet ? 0 : 1,
                visibility: selectedWallet ? "hidden" : "visible",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  <ClockCounterClockwise
                    size={24}
                    weight="fill"
                  />
                  <Typography fontWeight={"600"}>Deposit Funds</Typography>
                  <X size={20} weight="bold" onClick={handleClose} />
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack p={1} spacing={1.5} overflow={"auto"} mt={1}>
                {/* <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography>Total Deposot</Typography>
                  <Typography>Deposot History</Typography>
                </Stack> */}

                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                  // onClick={() => {
                  //   setSelectedWallet("enteramount");
                  // }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <Skeleton
                      variant="circular"
                      width={"40px"}
                      height={"40px"}
                    />
                    <Skeleton
                      variant="text"
                      width={"150px"}
                      sx={{ fontSize: "18px" }}
                    />
                  </Stack>

                  <CaretRight size={24} />
                </Stack>
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                  // onClick={() => {
                  //   setSelectedWallet("enteramount");
                  // }}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    width={"100%"}
                    spacing={1}
                  >
                    <Skeleton
                      variant="circular"
                      width={"40px"}
                      height={"40px"}
                    />
                    <Skeleton
                      variant="text"
                      width={"150px"}
                      sx={{ fontSize: "18px" }}
                    />
                  </Stack>

                  <CaretRight size={24} />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
          >
          

            {/* History */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "history" ? 1 : 0,
                visibility: selectedWallet === "history" ? "visible" : "hidden",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <Stack spacing={1} p={"15px 15px 10px 15px"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={"5px 5px"}
                  alignItems={"center"}
                >
                  {/* <CaretLeft
                    size={20}
                    weight="bold"
                    onClick={() => {
                      handleClose();
                    }}
                  /> */}
                  <Typography fontWeight={"600"}>Deposit History</Typography>
                  <IconButton onClick={() => {
                      handleClose();
                    }}>
                  <X
                    size={20}
                    weight="bold"
                    
                  />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider />

              {selectedWallet === "history" && <AdminUserDepositHistory />}
            </Stack>
          </Box>
        )}
      </Drawer>

      

  
    </>
  );
};

export default AdminDepositDrawer;
