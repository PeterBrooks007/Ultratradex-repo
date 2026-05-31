import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CloudArrowUp,
  CurrencyCircleDollar,
  CurrencyDollar,
  HandDeposit,
  ShieldStar,
  TipJar,
  X,
} from "@phosphor-icons/react";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import {
  updatePhoto,
  updateUser,
} from "../../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditProfile from "../../../components/EditProfile";

const cloud_name = import.meta.env.VITE_APP_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_APP_UPLOAD_PRESET;
const url = "https://api.cloudinary.com/v1_1/de1amvphn/image/upload";

const AccountOverview = ({ profile, setProfile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const elevation = theme.palette.mode === "light" ? 1 : 0;

  const { isLoading, user, conversionRate } = useSelector(
    (state) => state.auth
  );

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user === null) {
  //     dispatch(getUser());
  //   }
  // }, [dispatch, user]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    let imageURL;
    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        //save image to cloudinary
        const response = await fetch(url, { method: "post", body: image });
        const imgData = await response.json();
        // console.log(imgData)
        imageURL = imgData.url.toString();
      }

      // save image to mongoDB
      const userData = {
        photo: profileImage ? imageURL : profile.photo,
      };
      await dispatch(updatePhoto(userData));
      setImagePreview(null);
    } catch (error) {
      toast.error(error.message);
    }
  };


  
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
    <Stack spacing={2}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"top"}
        component={Paper}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
        p={3}
        borderRadius={"10px"}
      >
        <Stack direction={"row"} spacing={2} alignItems={"top"}>
          <Stack spacing={0.5}>
            <img
              src={imagePreview === null ? user?.photo : imagePreview}
              alt="profileimage"
              width={"130px"}
              height={"130px"}
              style={{
                border: "4px solid grey",
                borderRadius: "50%",
              }}
            />

            {imagePreview !== null && (
              <Stack spacing={0.5}>
                <Button size="small" variant="contained" onClick={savePhoto}>
                  <CloudArrowUp size={20} /> upload Photo
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
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={"600"}>
              {user?.firstname} {user?.lastname}
            </Typography>
            <Typography variant="h6">{user?.email}</Typography>
            <Typography variant="h6">{user?.accounttype}</Typography>
          </Stack>
        </Stack>

        <Stack>
          <Typography borderBottom={"2px solid green"}>100%</Typography>
          <Typography variant="h6">{user?.package} PACKAGE</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <ShieldStar size={35} />
            <Typography variant="h6">TOP RATED</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} display={{ lg: "none", xl: "flex" }}>
          <CurrencyDollar size={80} />
          <Stack>
            <Typography variant="h5">Trade Balance</Typography>
            <Typography variant="h4" fontWeight={600}>
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate?.code,
                    ...(user?.balance * conversionRate?.rate > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.balance * conversionRate?.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(user?.balance > 9999999 ? { notation: "compact" } : {}),
                  }).format(user?.balance)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* <p>
        <label> Change Photo: </label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
        />
      </p> */}

      <Box display={"flex"} flexDirection={"row"} gap={3} pt={1}>
        <Stack flex={"50%"}>
          <EditProfile profile={profile} setProfile={setProfile} />
        </Stack>
        <Stack flex={"50%"}>
          <Grid container spacing={2} columns={16}>
            <Grid item xs={8}>
              <Box
                sx={{ flexGrow: 1 }}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
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
                            ...(user?.balance * conversionRate?.rate > 9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.balance * conversionRate?.rate)
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
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
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
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
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
                            ...(user?.totalDeposit * conversionRate?.rate >
                            9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.totalDeposit * conversionRate?.rate)
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
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
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
                            ...(user?.earnedTotal * conversionRate?.rate >
                            9999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(user?.earnedTotal * conversionRate?.rate)
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

          <Stack
            component={Paper}
            height={"100%"}
            mt={2}
            elevation={elevation}
            backgroundColor={`${colors.dashboardbackground[100]}`}
            p={3}
          >
            {/* <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
              <Typography variant="h6" fontWeight={"bold"}>
                Profile Details
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#009e4a", color: "white" }}
              >
                Edit Details
              </Button>
            </Stack> */}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AccountOverview;
