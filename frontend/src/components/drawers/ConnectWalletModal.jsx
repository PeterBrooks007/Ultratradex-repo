import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  CaretLeft,
  CaretRight,
  DeviceMobileCamera,
  Headset,
  Link,
  PuzzlePiece,
  Question,
  X,
} from "@phosphor-icons/react";

import metaMaskImg from "../../assets/connectwallet/metamask.png";
import trustWalletImg from "../../assets/connectwallet/trustwallet.png";
import blockChainImg from "../../assets/connectwallet/blockchain-logo-png-transparent.png";
import coinBaseImg from "../../assets/connectwallet/coinbase.jpg";
import cryptoImg from "../../assets/connectwallet/crypto.com.png";
import walletConnectImg from "../../assets/connectwallet/wallet_connect.jpg";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ManualConnectWallet from "./ManualConnectWallet.jsx";
import AllWallets from "../AllWallets.jsx";
import connectWalletImages from "../connectWalletImages.js";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllConnectWallet,
  SETSELECTEDCONNECTWALLET,
} from "../../redux/features/connectWallet/connectWalletSlice.js";
import AllConnectWallets from "../AllConnectWallets.jsx";

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
      {value === index && <Box sx={{ p: "30px 0 0 0" }}>{children}</Box>}
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

const ConnectWalletModal = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const size = UseWindowSize();

  const [selectedWallet, setSelectedWallet] = useState(null);
  // const [selectedWalletImg, setSelectedWalletImg] = useState(0);

  const { isLoading, wallets, wallet } = useSelector(
    (state) => state.connectWallet
  );

  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(getAllConnectWallet());
    }
  }, [dispatch]);

  const [isConnecting, setIsConnecting] = useState(false);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let timer;
    if (isConnecting) {
      timer = setTimeout(() => {
        setIsConnecting(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  const walletsSlice = Array.isArray(wallets) ? wallets.slice(0, 5) : [];

  return (
    <>
      <Drawer
        anchor={size.width > 899 ? "right" : "bottom"}
        open={open}
        onClose={() => {
          handleClose();
          setSelectedWallet(null);
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: size.width > 899 ? 450 : "100%",
            height: `${
              selectedWallet
                ? size.width > 899
                  ? "100%"
                  : "80%"
                : size.width > 899
                ? "100%"
                : "70%"
            }`,
            borderRadius: size.width > 899 ? "none" : "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            borderTop: size.width > 899 ? "none" : `1px solid grey`,
            transition: "height 2s ease",
          },
        }}
      >
        {isLoading ? (
          <Stack
            height={"100%"}
            backgroundColor={colors.dashboardforeground[100]}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CircularProgress size={28} />
          </Stack>
        ) : (
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
                  <IconButton
                    size="small"
                    onClick={() => dispatch(getAllConnectWallet())}
                  >
                    <ArrowsClockwise size={22} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Connect Wallet</Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <X size={22} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack p={1} overflow={"auto"}>
                {wallets && wallets.length > 0
                  ? walletsSlice.map((wallet) => (
                      <>
                        <Stack
                          key={wallet?._id}
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                          backgroundColor={
                            theme.palette.mode === "light"
                              ? "#f2f2f2"
                              : colors.dashboardbackground[100]
                          }
                          p={"7px 7px"}
                          mt={0.5}
                          mx={1}
                          borderRadius={"15px"}
                          onClick={() => {
                            dispatch(SETSELECTEDCONNECTWALLET(wallet));
                            setSelectedWallet(wallet?.name);
                            setIsConnecting(true);
                          }}
                          sx={{ cursor: "pointer" }}
                        >
                          <img
                            src={wallet?.photo}
                            alt={wallet?.name}
                            style={{ borderRadius: "10px" }}
                            width={40}
                          />

                          <Typography variant="body1" fontWeight={600}>
                            {wallet?.name}
                          </Typography>
                        </Stack>
                      </>
                    ))
                  : "No wallet address"}

                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"7px 7px"}
                  pr={2}
                  mt={1}
                  mx={1}
                  borderRadius={"15px"}
                  onClick={() => {
                    setSelectedWallet("allWallet");
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <img
                      src={walletConnectImg}
                      alt="metaMaskImg"
                      style={{ borderRadius: "10px" }}
                      width={40}
                    />

                    <Typography variant="body1" fontWeight={600}>
                      All Wallets
                    </Typography>
                  </Stack>
                  <Box
                    backgroundColor="grey"
                    p={"1px 3px"}
                    borderRadius={"3px"}
                    fontSize={"12px"}
                    color={"white"}
                    fontWeight={600}
                  >
                    {wallets?.length - 1}+
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            {/* connecting wallet */}

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "help"
                    ? 1
                    : 0,
                visibility:
                  selectedWallet &&
                  selectedWallet !== "allWallet" &&
                  selectedWallet !== "help"
                    ? "visible"
                    : "hidden",
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
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={22} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>
                    Connect {wallet?.name}
                  </Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <X size={20} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box mx={"-15px"}>
                <Divider />
              </Box>

              <Stack overflow={"auto"} pb={2}>
                <Stack direction={"row"} justifyContent={"center"} mt={2}>
                  <Box
                    backgroundColor={
                      theme.palette.mode === "light"
                        ? "#f2f2f2"
                        : colors.dashboardbackground[100]
                    }
                    height={"38px"}
                    borderRadius={"20px"}
                    p={"3px"}
                    width={"210px"}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs "
                      centered
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "transparent",
                        },
                        "& .MuiTab-root": {
                          textTransform: "none",
                          minHeight: "32px",
                          padding: "4px 12px",
                          minWidth: "auto",
                          borderRadius: "20px",
                          border: "none",
                          borderBottom: "2px solid transparent",
                          "&:hover": {
                            //   border: "2px solid #ccc",
                          },
                          "&.Mui-selected": {
                            // border: "2px solid #007bff",
                            backgroundColor: "white",
                            // boxShadow: `${theme.shadows[2]}`,
                            color: "black",
                          },
                        },
                      }}
                    >
                      <Tab
                        label="Mobile"
                        icon={<DeviceMobileCamera size={20} weight="bold" />}
                        iconPosition="start"
                        {...a11yProps(0)}
                      />
                      <Tab
                        label="Browser"
                        icon={<PuzzlePiece size={20} weight="bold" />}
                        iconPosition="start"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                </Stack>

                <CustomTabPanel value={value} index={0}>
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={2}
                  >
                    <Stack justifyContent={"center"} direction={"row"}>
                      <img
                        src={wallet?.photo}
                        alt={wallet?.name}
                        width={100}
                        style={{
                          borderRadius: "30px",
                          border: "1px solid grey",
                        }}
                      />
                    </Stack>
                    <Stack
                      justifyContent={"center"}
                      alignItems={"center"}
                      spacing={1}
                    >
                      {isConnecting ? (
                        <Stack
                          direction={"row"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          spacing={1}
                        >
                          <CircularProgress size={"15px"} />
                          <Typography fontWeight={"bold"}>
                            Connecting...
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack
                          direction={"row"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          spacing={0.5}
                        >
                          <X color="red" size={"25px"} weight="bold" />
                          <Typography fontWeight={"bold"}>
                            Error Connecting...
                          </Typography>
                        </Stack>
                      )}

                      <Typography variant="subtitle2">
                        Accept connection request in the wallet
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      sx={{ borderRadius: "30px", textTransform: "capitalize" }}
                      startIcon={<ArrowCounterClockwise weight="bold" />}
                      disabled={isConnecting && true}
                      onClick={() => {
                        setIsConnecting(true);
                      }}
                    >
                      Try again
                    </Button>
                    <Button
                      sx={{ borderRadius: "30px", textTransform: "capitalize" }}
                      startIcon={<Link weight="bold" />}
                      disabled={isConnecting && true}
                      onClick={() => {
                        handleOpenMenu();
                        handleClose();
                      }}
                    >
                      Connect Manually
                    </Button>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"90%"}
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "#f2f2f2"
                          : colors.dashboardbackground[100]
                      }
                      p={"10px 20px"}
                      borderRadius={"15px"}
                      color={"grey"}
                    >
                      <Typography>Dont have {wallet?.name}</Typography>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        backgroundColor={colors.dashboardforeground[100]}
                        p={"2px 10px"}
                        borderRadius={"10px"}
                      >
                        <Typography>Get</Typography>
                        <CaretRight />
                      </Stack>
                    </Stack>
                  </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={2}
                  >
                    <Stack justifyContent={"center"} direction={"row"}>
                      <img
                        src={wallet?.photo}
                        alt={wallet?.name}
                        width={100}
                        style={{
                          borderRadius: "30px",
                          border: "1px solid grey",
                        }}
                      />
                    </Stack>
                    <Stack
                      justifyContent={"center"}
                      alignItems={"center"}
                      spacing={1}
                    >
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        spacing={0.5}
                      >
                        <X color="red" size={"25px"} weight="bold" />
                        <Typography fontWeight={"bold"}>
                          Not Detected
                        </Typography>
                      </Stack>
                    </Stack>

                    <Button
                      sx={{ borderRadius: "30px", textTransform: "capitalize" }}
                      startIcon={<Link weight="bold" />}
                      disabled={isConnecting && true}
                      onClick={() => {
                        handleOpenMenu();
                        handleClose();
                      }}
                    >
                      Connect Manually
                    </Button>
                  </Stack>
                </CustomTabPanel>
              </Stack>
            </Stack>

            {/* End of connecting wallet */}

            {/* all Wallet  */}
            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "allWallet" ? 1 : 0,
                visibility:
                  selectedWallet === "allWallet" ? "visible" : "hidden",
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
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={22} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>All Wallet</Typography>

                  <IconButton size="small" onClick={handleClose}>
                    <X size={22} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider />

              <AllConnectWallets
                setSelectedWallet={setSelectedWallet}
                setIsConnecting={setIsConnecting}
                // setSelectedWalletImg={setSelectedWalletImg}
              />
            </Stack>

            <Stack
              // backgroundColor={colors.dashboardforeground[100]}
              position={"absolute"}
              width={"100%"}
              height={"100%"}
              top={0}
              sx={{
                opacity: selectedWallet === "help" ? 1 : 0,
                visibility: selectedWallet === "help" ? "visible" : "hidden",
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
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedWallet(null);
                      setIsConnecting(false);
                    }}
                  >
                    <CaretLeft size={22} weight="bold" />
                  </IconButton>
                  <Typography fontWeight={"600"}>Help</Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <X size={22} weight="bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider />

              <Stack
                m={2}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={1}
              >
                <Headset size={54} />
                <Typography textAlign={"center"}>
                  Please if you have any question or query please contact out
                  support team for help
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}
      </Drawer>

      <ManualConnectWallet
        open={openMenu}
        handleClose={handleCloseMenu}
        handleOpen={handleOpenMenu}
        handleopenConnectWallet={handleOpen}
      />
    </>
  );
};

export default ConnectWalletModal;
