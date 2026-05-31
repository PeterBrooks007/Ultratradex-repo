import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import {
  AddressBookTabs,
  Bell,
  Camera,
  CaretRight,
  CurrencyCircleDollar,
  CurrencyDollar,
  HandDeposit,
  Headset,
  IdentificationCard,
  Lock,
  LockKey,
  Moon,
  Power,
  Question,
  TipJar,
  Translate,
  X,
} from "@phosphor-icons/react";
import { useContext, useEffect, useRef, useState } from "react";
import bgimage from "../../assets/SL_022321_41020_08.jpg";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import ProfileTabs from "./dashboardComponents/ProfileTabs";
import LoadingScreen from "../../components/LoadingScreen";
import {
  getLoginStatus,
  logout,
  RESET_AUTH,
  twofaAuthentication,
  updatePhoto,
} from "../../redux/features/auth/authSlice";
import TopBar from "./dashboardComponents/TopBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RESET_WITHDRAWAL } from "../../redux/features/withdrawal/withdrawalSlice";
import { RESET_DEPOSIT } from "../../redux/features/deposit/depositSlice";
import ReferralDrawer from "../../components/drawers/ReferralDrawer";
import EditProfileDrawer from "../../components/drawers/EditProfileDrawer";
import ChangePasswordDrawer from "../../components/drawers/ChangePassword";
import Language from "../../components/drawers/Language";
import HelpSupport from "../../components/drawers/HelpSupport";
import PolicyDialog from "../../components/dialogs/PolicyDialog";
import FaqsDialog from "../../components/dialogs/FaqsDialog";
import VerificationDrawer from "../../components/drawers/VerificationsDrawer";

export const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const cloud_name = import.meta.env.VITE_APP_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_APP_UPLOAD_PRESET;
const url = "https://api.cloudinary.com/v1_1/de1amvphn/image/upload";

const Profile = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const size = UseWindowSize();
  const { isLoading: appLoading } = useSelector((state) => state.app);
  const { user, isLoading, isLoggedIn, conversionRate } = useSelector(
    (state) => state.auth
  );

  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  const logoutUser = async () => {
    await dispatch(logout());
    navigate("/auth/login");
    dispatch(RESET_AUTH());
    dispatch(RESET_WITHDRAWAL());
    dispatch(RESET_DEPOSIT());
  };

  const initialState = {
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    photo: user?.photo || "",
    address: {
      address: user?.address?.address || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
      countryFlag: user?.address?.countryFlag || "",
    },
  };

  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfile({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        photo: user?.photo || "",
        address: {
          address: user?.address?.address || "",
          state: user?.address?.state || "",
          country: user?.address?.country || "",
        },
      });
    }
  }, [dispatch, user]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   
   const savePhoto = async (e) => {
     e.preventDefault();
     setUploadLoading(true);
   
     try {
       if (profileImage !== null) {
         // Check if the file is an allowed image type
         const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
         if (!validImageTypes.includes(profileImage.type)) {
           toast.error("Invalid file type. Only JPEG and PNG are allowed.");
           setUploadLoading(false);
           return;
         }
   
         // Check if the file size exceeds the limit
         if (profileImage.size > MAX_FILE_SIZE) {
           toast.error("File size exceeds the 5MB limit.");
           setUploadLoading(false);
           return;
         }
   
         // Check if the compressed file is a valid image by loading it
         const imageLoadCheck = new Promise((resolve, reject) => {
           const img = new Image();
           img.src = URL.createObjectURL(profileImage);
           img.onload = () => resolve(true);
           img.onerror = () => reject(false);
         });
   
         const isValidImage = await imageLoadCheck;
         if (!isValidImage) {
           toast.error("The file is not a valid image.");
           setUploadLoading(false);
           return;
         }
   
         // If all checks pass, proceed with the upload
         const formData = new FormData();
         formData.append("image", profileImage);
   
         const id = user?._id;
   
         dispatch(updatePhoto({ id, formData }));

        // console.log({ id, formData })
   
         // Reset the image preview and loading state
         setImagePreview(null);
         setUploadLoading(false);
       } else {
         toast.error("No image selected.");
         setUploadLoading(false);
       }
     } catch (error) {
       setUploadLoading(false);
       toast.error(error.message);
     }
   };
   

  const [openReferralDrawer, setReferralDrawer] = useState(false);
  const [openEditProfileDrawer, setEditProfileDrawer] = useState(false);
  const [openChangePasswordDrawer, setChangePasswordDrawer] = useState(false);
  const [openVerificationDrawer, setVerificationDrawer] = useState(false);
  const [openLanguageDrawer, setLanguageDrawer] = useState(false);
  const [openHelpSupportDrawer, setHelpSupportDrawer] = useState(false);
  const [openPolicyMenu, setOpenPolicyMenu] = useState(false);
  const [openFaqsMenu, setFaqsMenu] = useState(false);

  // Referral Drawer
  const handleOpenReferralDrawer = () => {
    setReferralDrawer(true);
  };

  const handleCloseReferralDrawer = () => {
    setReferralDrawer(false);
  };

  // End Referral Drawer

  // EditProfile Drawer
  const handleOpenEditProfileDrawer = () => {
    setEditProfileDrawer(true);
  };

  const handleCloseEditProfileDrawer = () => {
    setEditProfileDrawer(false);
  };

  // End EditProfile Drawer

  // Change Paasword Drawer
  const handleOpenChangePasswordDrawer = () => {
    setChangePasswordDrawer(true);
  };

  const handleCloseChangePasswordDrawer = () => {
    setChangePasswordDrawer(false);
  };

  // End Change Paasword Drawer

  // Language Drawer
  const handleOpenLanguageDrawer = () => {
    setLanguageDrawer(true);
  };

  const handleCloseLanguageDrawer = () => {
    setLanguageDrawer(false);
  };

  // End Language Drawer

  // HelpSupport Drawer
  const handleOpenHelpSupportDrawer = () => {
    setHelpSupportDrawer(true);
  };

  const handleCloseHelpSupportDrawer = () => {
    setHelpSupportDrawer(false);
  };

  // End HelpSupport Drawer

  //Policy Dialog
  const handleOpenPolicyMenu = () => {
    setOpenPolicyMenu(true);
  };

  const handleClosePolicyMenu = () => {
    setOpenPolicyMenu(false);
  };
  //End Policy Dialog

  //Faqs Dialog
  const handleOpenFaqsMenu = () => {
    setFaqsMenu(true);
  };

  const handleCloseFaqsMenu = () => {
    setFaqsMenu(false);
  };
  //End Faqs Dialog

  //Faqs Dialog
  const handleOpenVerificationDrawer = () => {
    setVerificationDrawer(true);
  };

  const handleCloseVerificationDrawer = () => {
    setVerificationDrawer(false);
  };
  //End Faqs Dialog



  // Start of 2fa-authenticaton
    const [checked, setChecked] = useState(user?.isTwoFactorEnabled || false);
  
    useEffect(() => {
      // if(user?.isTwoFactorEnabled) {
        setChecked(user?.isTwoFactorEnabled);
      // }
    }, [user?.isTwoFactorEnabled]);

  
  // Handle switch change
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked); // Update the checked state directly
  
    setTimeout(() => {
      handleFormSubmit(isChecked); 
    }, 600); 
  };
  
    const handleFormSubmit = async (isChecked) => {
      const userData = {
        isTwoFactorEnabled: isChecked
      }
      // console.log(userData);
      await dispatch(twofaAuthentication(userData));
    };
    // End of 2fa-authenticaton




    const { isLoading: coinPriceLoading, allCoins } = useSelector(
      (state) => state.coinPrice
    );
    
  const combinedAssets = user?.assets?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );
    // console.log("asset?.symbol", asset?.symbol?.toUpperCase())
    // console.log(`priceData.quotes.${[user.currency.code]}.price`, priceData?.quotes?.[user.currency.code]?.price)
    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[user?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[user?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });


    const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  

  return (
    <>
      {appLoading || isLoading || !user ? (
        <LoadingScreen />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "15px", md: "20px" }}
          sx={{ overflowX: "hidden" }}
          // overflow={"auto"}
          className="scrollable-element"
        >
          <Box
            mb={{ xs: 1.5, md: 3 }}
            mt={"-15px"}
            mx={"-15px"}
            borderBottom={"1px solid #111820"}
          >
            <TickerTapeWidget />
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            // mb={{xs: 10, md: 0}}
            // gap={2}
          >
            <Box
              flex={{ xs: "100%", lg: "30%", xl: "25%" }}
              sx={{ overflowY: "auto", overflowX: "hidden" }}
              pb={{ xs: 20, sm: 20, md: 0 }}
            >
              <Stack spacing={2} direction={"column"} p={0.5}>
                <TopBar />

                <Stack spacing={0.5}>
                  {/* <Box pl={1}>
                    <Typography variant="h6">Profile Overview</Typography>
                  </Box> */}
                  <Stack
                    width={"100%"}
                    height={"230px"}
                    backgroundColor={
                      theme.palette.mode === "light"
                        ? "#f2f2f2"
                        : colors.dashboardbackground[100]
                    }
                    borderRadius={"20px"}
                    p={"0px 0px"}
                    //   justifyContent={"center"}
                    alignItems={"center"}
                    overflow={"hidden"}
                  >
                    <Box
                      width={"100%"}
                      height={"40%"}
                      position={"relative"}
                      sx={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgimage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Badge
                        onClick={handleButtonClick}
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }} // Hide the file input
                              onChange={handleImageChange}
                            />
                            <IconButton>
                              <Camera size={35} weight="bold" />
                            </IconButton>
                          </>
                        }
                        sx={{
                          position: "absolute",
                          left: "50%",
                          top: "100%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <img
                          src={
                            imagePreview === null ? user?.photo : imagePreview
                          }
                          alt="profileimage"
                          width={"120px"}
                          height={"120px"}
                          style={{
                            border: "4px solid grey",
                            borderRadius: "50%",
                          }}
                        />
                      </Badge>
                      {imagePreview !== null && (
                        <Stack
                          spacing={0.5}
                          sx={{
                            position: "absolute",
                            left: "50%",
                            top: "205%",
                            transform: "translate(-50%, -50%)",
                            border: "4px solid grey",
                            borderRadius: "50%",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            onClick={savePhoto}
                            disabled={uploadLoading && true}
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "grey", // Background color when disabled
                                color: "white", // Optional: Set text color when disabled
                              },
                            }}
                          >
                            {uploadLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              "UPLOAD PHOTO"
                            )}
                          </Button>

                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => setImagePreview(null)}
                          >
                            <X size={20} /> Cancel upload
                          </Button>
                        </Stack>
                      )}
                    </Box>

                    <Stack
                      mt={7}
                      alignItems={"center"}
                      justifyContent={"center"}
                      mb={3}
                      spacing={1}
                      width={"100%"}
                      overflow={"auto"}
                    >
                      <Typography variant="h5" fontWeight={600}>
                        {user?.firstname} {user?.lastname}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={400}
                        textAlign={"center"}
                      >
                        {user?.email} | {user?.accounttype}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack>
                  <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                      <Box
                        sx={{ flexGrow: 1 }}
                        backgroundColor={`${colors.dashboardbackground[100]}`}
                        boxShadow={
                          theme.palette.mode === "light" &&
                          `${theme.shadows[2]}`
                        }
                        p={"10px 5px"}
                        borderRadius={"10px"}
                      >
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <CurrencyDollar size={40} />

                          <Stack>
                            <Typography variant="subtitle2" fontWeight={500}>
                              Trade Balance
                            </Typography>
                            <Typography fontWeight={"600"}>
                              {conversionRate?.rate
                                ? Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: conversionRate?.code,
                                    ...(user?.balance * conversionRate?.rate >
                                    9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(
                                    user?.balance * conversionRate?.rate
                                  )
                                : Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: user?.currency?.code,
                                    ...(user?.balance > 9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(user?.balance)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={8}>
                      <Box
                        sx={{ flexGrow: 1 }}
                        backgroundColor={`${colors.dashboardbackground[100]}`}
                        boxShadow={
                          theme.palette.mode === "light" &&
                          `${theme.shadows[2]}`
                        }
                        p={"10px 5px"}
                        borderRadius={"10px"}
                      >
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <CurrencyCircleDollar size={40} />

                          <Stack>
                            <Typography variant="subtitle2" fontWeight={500}>
                              Wallet Balance
                            </Typography>
                            {user?.isManualAssetMode ? (
                        <Typography fontWeight={"600"} >
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(totalWalletBalanceManual > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(totalWalletBalanceManual)}
                        </Typography>
                      ) : (
                        <Typography fontWeight={"600"} >
                          {coinPriceLoading ? (
                            <Skeleton variant="text" width={"200px"} />
                          ) : allCoins.length !== 0 ? (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(totalWalletBalance > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(totalWalletBalance)
                          ) : (
                            "UNAVAILABLE"
                          )}
                        </Typography>
                      )}
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box
                        sx={{ flexGrow: 1 }}
                        backgroundColor={`${colors.dashboardbackground[100]}`}
                        boxShadow={
                          theme.palette.mode === "light" &&
                          `${theme.shadows[2]}`
                        }
                        p={"10px 5px"}
                        borderRadius={"10px"}
                      >
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <HandDeposit size={40} />

                          <Stack>
                            <Typography variant="subtitle2" fontWeight={500}>
                              Total Deposit
                            </Typography>
                            <Typography fontWeight={"600"}>
                              {conversionRate?.rate
                                ? Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: conversionRate?.code,
                                    ...(user?.totalDeposit *
                                      conversionRate?.rate >
                                    9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(
                                    user?.totalDeposit * conversionRate?.rate
                                  )
                                : Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: user?.currency?.code,
                                    ...(user?.totalDeposit > 9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(user?.totalDeposit)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box
                        sx={{ flexGrow: 1 }}
                        backgroundColor={`${colors.dashboardbackground[100]}`}
                        boxShadow={
                          theme.palette.mode === "light" &&
                          `${theme.shadows[2]}`
                        }
                        p={"10px 5px"}
                        borderRadius={"10px"}
                      >
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <TipJar size={40} />

                          <Stack>
                            <Typography variant="subtitle2" fontWeight={500}>
                              Profit Earned
                            </Typography>
                            <Typography fontWeight={"600"}>
                              {conversionRate?.rate
                                ? Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: conversionRate?.code,
                                    ...(user?.earnedTotal *
                                      conversionRate?.rate >
                                    9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(
                                    user?.earnedTotal * conversionRate?.rate
                                  )
                                : Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: user?.currency?.code,
                                    ...(user?.earnedTotal > 9999999
                                      ? { notation: "compact" }
                                      : {}),
                                  }).format(user?.earnedTotal)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                >
                  <Stack spacing={2.5}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <CurrencyCircleDollar size={24} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Demo Balance
                        </Typography>
                      </Stack>
                      <Typography fontWeight={"600"}>
                        {conversionRate?.rate
                          ? Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(user?.demoBalance * conversionRate?.rate >
                              9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.demoBalance * conversionRate?.rate)
                          : Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(user?.demoBalance > 9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.demoBalance)}
                      </Typography>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <CurrencyDollar size={24} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Referral Bonus
                        </Typography>
                      </Stack>
                      <Typography fontWeight={"600"}>
                       

                        {conversionRate?.rate
                          ? Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: conversionRate?.code,
                              ...(user?.referralBonus * conversionRate?.rate >
                              9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(
                              user?.referralBonus * conversionRate?.rate
                            )
                          : Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: user?.currency?.code,
                              ...(user?.referralBonus > 9999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(user?.referralBonus)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenReferralDrawer}
                      sx={{ cursor: "pointer" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <CurrencyDollar size={24} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Referral System
                        </Typography>
                      </Stack>

                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={0.5}
                      >
                        <Typography variant="subtitle2" fontWeight={"600"}>View</Typography>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenEditProfileDrawer}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <AddressBookTabs size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Edit Profile Information
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Bell size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Notification
                        </Typography>
                      </Stack>

                      <IOSSwitch checked disabled />
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenLanguageDrawer}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Translate size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Language
                        </Typography>
                      </Stack>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={0.5}
                      >
                        <Typography variant="subtitle1" fontWeight={"500"}>English</Typography>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenChangePasswordDrawer}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Lock size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Change Password
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <LockKey size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          2FA Authentication
                        </Typography>
                      </Stack>
                      <IOSSwitch
                    checked={checked}
                    onChange={handleSwitchChange}
                    name="switch1"
                  />
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      sx={{ cursor: "default" }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Moon size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Theme
                        </Typography>
                      </Stack>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={0.5}
                        onClick={colorMode.toggleColorMode}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography
                        variant="subtitle2"
                          fontWeight={"500"}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {theme.palette.mode} Mode
                        </Typography>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      onClick={handleOpenVerificationDrawer}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <IdentificationCard size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Verifications
                        </Typography>
                      </Stack>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={0.5}
                      >
                        <Typography variant="subtitle2" fontWeight={"500"}>View</Typography>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenHelpSupportDrawer}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Headset size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Help & Support
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenPolicyMenu}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Lock size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          Privacy Policy
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={handleOpenFaqsMenu}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Question size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          FAQ
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{ flexGrow: 1 }}
                  mt={2}
                  backgroundColor={`${colors.dashboardbackground[100]}`}
                  boxShadow={
                    theme.palette.mode === "light" && `${theme.shadows[2]}`
                  }
                  p={"10px 15px"}
                  borderRadius={"10px"}
                >
                  <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      onClick={logoutUser}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Power size={28} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          LOGOUT
                        </Typography>
                      </Stack>
                      <Stack>
                        <CaretRight size={20} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {size.width > 899 && (
              <Box
                flex={{ xs: "100%", lg: "70%", xl: "75%" }}
                // backgroundColor="red"
                overflow={"hidden"}
                display={{ xs: "none", lg: "flex" }}
                p={"15px"}
                ml={"20px"}
                border={"1px solid grey"}
                borderRadius={"20px"}
              >
                <ProfileTabs profile={profile} setProfile={setProfile} />
              </Box>
            )}
          </Box>
        </Box>
      )}

      <ReferralDrawer
        open={openReferralDrawer}
        handleClose={handleCloseReferralDrawer}
        handleOpen={handleOpenReferralDrawer}
      />

      <EditProfileDrawer
        open={openEditProfileDrawer}
        handleClose={handleCloseEditProfileDrawer}
        handleOpen={handleOpenEditProfileDrawer}
        profile={profile}
        setProfile={setProfile}
      />

      <ChangePasswordDrawer
        open={openChangePasswordDrawer}
        handleClose={handleCloseChangePasswordDrawer}
        handleOpen={handleOpenChangePasswordDrawer}
        profile={profile}
        setProfile={setProfile}
      />

      <VerificationDrawer
        open={openVerificationDrawer}
        handleClose={handleCloseVerificationDrawer}
        handleOpen={handleOpenVerificationDrawer}
        profile={profile}
        setProfile={setProfile}
      />

      <Language
        open={openLanguageDrawer}
        handleClose={handleCloseLanguageDrawer}
        handleOpen={handleOpenLanguageDrawer}
        profile={profile}
        setProfile={setProfile}
      />

      <HelpSupport
        open={openHelpSupportDrawer}
        handleClose={handleCloseHelpSupportDrawer}
        handleOpen={handleOpenHelpSupportDrawer}
        profile={profile}
        setProfile={setProfile}
      />

      <PolicyDialog
        open={openPolicyMenu}
        handleClose={handleClosePolicyMenu}
        handleOpen={handleOpenPolicyMenu}
      />

      <FaqsDialog
        open={openFaqsMenu}
        handleClose={handleCloseFaqsMenu}
        handleOpen={handleOpenFaqsMenu}
      />
    </>
  );
};

export default Profile;
