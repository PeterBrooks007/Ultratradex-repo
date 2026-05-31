import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "./adminComponents/Header";
import { tokens } from "../../theme";
import {
  ArrowLeft,
  Bell,
  CaretRight,
  CheckCircle,
  CurrencyCircleDollar,
  CurrencyDollar,
  GlobeHemisphereEast,
  HandDeposit,
  Lock,
  LockKey,
  Phone,
  TipJar,
  XCircle,
} from "@phosphor-icons/react";
import { IOSSwitch } from "../dashboard/Profile";
import Operators from "./adminComponents/Operators";
import { useDispatch, useSelector } from "react-redux";
import {
  adminLockAccount,
  getSingleUser,
} from "../../redux/features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

import earnedSvgIcon from "../../assets/svgIcons/earnedSvgIcon.svg";
import totalDepositSvgIcon from "../../assets/svgIcons/totalDepositSvgIcon.svg";
import walletSvgIcon from "../../assets/svgIcons/walletSvgIcon.svg";
import StyledBadge from "../../components/StyledBadge";
import { timeAgo } from "../../utils";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150, // Default width for xs breakpoint
  height: 150, // Default height for xs breakpoint
  marginRight: theme.spacing(0),
  border: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.up("md")]: {
    width: 180,
    height: 180,
  },
}));

const UserDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [pageLoading, setPageLoading] = useState(true); // Track event loading

  const { isLoading, user, singleUser } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 100); // Simulate a 2-second loading delay
  }, []);

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  const { isLoading: coinPriceLoading, allCoins } = useSelector(
    (state) => state.coinPrice
  );

  const combinedAssets = singleUser?.assets?.map((asset) => {
    const priceData = allCoins?.find(
      (price) => price?.symbol === asset?.symbol?.toUpperCase()
    );

    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[singleUser?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[singleUser?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(singleUser?.assets)
    ? singleUser?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  const [checked, setChecked] = useState({
    switch1: singleUser?.accountLock?.generalLock ?? false,
    switch2: singleUser?.accountLock?.upgradeLock ?? false,
    switch3: singleUser?.accountLock?.signalLock ?? false,
  });

  useEffect(() => {
    setChecked({
      switch1: singleUser?.accountLock?.generalLock ?? false,
      switch2: singleUser?.accountLock?.upgradeLock ?? false,
      switch3: singleUser?.accountLock?.signalLock ?? false,
    });
  }, [singleUser?.accountLock]);

  const handleSwitchChange = (switchKey) => {
    setChecked((prevState) => {
      const newSwitchState = {
        switch1: false,
        switch2: false,
        switch3: false,
        [switchKey]: !prevState[switchKey], // Toggle the current switchKey
      };

      // Log the new state for debugging
      // console.log(newSwitchState);

      // Schedule a call to handleAccountLock with the updated state
      setTimeout(() => {
        handleAccountLock(newSwitchState);
      }, 500);

      return newSwitchState; // Update the state
    });
  };

  const handleAccountLock = (newSwitchState) => {
    const formData = {
      generalLock: newSwitchState.switch1,
      upgradeLock: newSwitchState.switch2,
      signalLock: newSwitchState.switch3,
    };

    // console.log(formData);
    dispatch(adminLockAccount({ id, formData }));
  };

  return (
    <>
      {isLoading || !user || !singleUser || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box
          m={{ xs: "10px", md: "20px" }}
          height={"90vh"}
          pb={5}
          sx={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Stack
            m={"10px"}
            direction={"row"}
            alignItems={{ xs: "center", md: "flex-start" }}
            spacing={2}
          >
            <IconButton
              sx={{ border: "2px solid grey" }}
              onClick={() => navigate("/admin/all-users")}
              size="small"
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Stack direction={"row"} alignItems={"flex-start"} spacing={1}>
              <Avatar
                src={singleUser?.photo}
                alt={singleUser?.firstname}
                sx={{ width: 30, height: 30 }}
              />

              <Header
                title={singleUser?.firstname + " " + singleUser?.lastname}
                subtitle={"Operate on this user"}
              />
            </Stack>
          </Stack>

          <Stack mt={2} display={{ xs: "none", md: "flex" }}>
            <Grid container spacing={2} columns={12}>
              <Grid item xs={3}>
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
                    <CurrencyDollar
                      size={60}
                      color={
                        theme.palette.mode === "light" ? "green" : "springgreen"
                      }
                    />

                    <Stack>
                      <Typography variant="body1" fontWeight={500}>
                        Trade Balance
                      </Typography>
                      <Typography fontWeight={"600"} variant="h5">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: singleUser?.currency?.code,
                          ...(singleUser?.balance > 9999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleUser?.balance)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={3}>
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
                    <img src={totalDepositSvgIcon} alt="" width={60} />

                    <Stack>
                      <Typography variant="body1" fontWeight={500}>
                        Total Deposit
                      </Typography>
                      <Typography fontWeight={"600"} variant="h5">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: singleUser?.currency?.code,
                          ...(singleUser?.totalDeposit > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleUser?.totalDeposit)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={3}>
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
                    <img src={earnedSvgIcon} alt="" width={60} />

                    <Stack>
                      <Typography variant="body" fontWeight={500}>
                        Profit Earned
                      </Typography>
                      <Typography fontWeight={"600"} variant="h5">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: singleUser?.currency?.code,
                          ...(singleUser?.earnedTotal > 999999
                            ? { notation: "compact" }
                            : {}),
                        }).format(singleUser?.earnedTotal)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={3}>
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
                    <img src={walletSvgIcon} alt="" width={50} />

                    <Stack>
                      <Typography variant="body" fontWeight={500}>
                        Wallet Balance
                      </Typography>

                      {singleUser?.isManualAssetMode ? (
                        <Typography fontWeight={"600"} variant="h5">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: singleUser?.currency?.code,
                            ...(totalWalletBalanceManual > 999999
                              ? { notation: "compact" }
                              : {}),
                          }).format(totalWalletBalanceManual)}
                        </Typography>
                      ) : (
                        <Typography fontWeight={"600"} variant="h5">
                          {coinPriceLoading ? (
                            <Skeleton variant="text" width={"200px"} />
                          ) : allCoins.length !== 0 ? (
                            Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
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
            </Grid>
          </Stack>

          <Box
            m="22px 0 0 0"
            height={"75vh"}
            border={"2px solid transparent"}
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <Box flex={"30%"} backgroundColor="transparent">
              <Box
                sx={{ flexGrow: 1 }}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 5px"}
                borderRadius={"10px"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  mb={2}
                  mx={1}
                  mt={1}
                >
                  <Stack direction={"column"} alignItems={"flex-start"}>
                    <Chip
                      size="large"
                      icon={
                        singleUser?.isOnline ? (
                          <CheckCircle
                            color={singleUser?.isOnline ? undefined : "white"}
                            size={20}
                          />
                        ) : (
                          <XCircle
                            color={singleUser?.isOnline ? undefined : "white"}
                            size={20}
                          />
                        )
                      }
                      label={singleUser?.isOnline ? "Online" : "Offline"}
                      color={singleUser?.isOnline ? "success" : "default"}
                      sx={{
                        backgroundColor: singleUser?.isOnline
                          ? undefined
                          : "grey.800",
                        color: singleUser?.isOnline ? undefined : "white",
                      }}
                    />
                  </Stack>

                  <Stack direction={"row"} spacing={1}>
                    <Chip
                      size="large"
                      icon={
                        singleUser?.isIdVerified === "VERIFIED" ? (
                          <CheckCircle size={20} />
                        ) : (
                          <XCircle size={20} />
                        )
                      }
                      label={singleUser?.isIdVerified}
                      color={
                        singleUser?.isIdVerified === "VERIFIED"
                          ? "success"
                          : singleUser?.isIdVerified === "PENDING"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Stack>
                </Stack>

                <Stack
                  direction={"column"}
                  spacing={1}
                  alignItems={"center"}
                  p={0.5}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant={singleUser?.isOnline && "dot"}
                  >
                    <StyledAvatar
                      src={singleUser?.photo}
                      alt={singleUser?.firstname}
                      sx={{
                        border: singleUser?.isOnline
                          ? "3px solid green"
                          : "3px solid grey",
                      }}
                    />
                  </StyledBadge>

                  <Stack alignItems={"center"}>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        hyphens: "auto", // Enables automatic hyphenation
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {singleUser?.firstname} {singleUser?.lastname}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        hyphens: "auto", // Enables automatic hyphenation
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {singleUser?.email}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : "rgba(239, 239, 240, 0.1)"
                  }
                  mx={1}
                  mt={2}
                  p={1}
                  px={2}
                  borderRadius={2}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        hyphens: "auto", // Enables automatic hyphenation
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <GlobeHemisphereEast /> Country:{" "}
                      {singleUser?.address?.country}
                    </Typography>
                    <Avatar
                      src={`https://flagcdn.com/w80/${singleUser?.address?.countryFlag}.png`}
                      alt="countryflag"
                      sx={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      hyphens: "auto", // Enables automatic hyphenation
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    <Phone /> Phone: {singleUser?.phone}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      hyphens: "auto", // Enables automatic hyphenation
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    <Lock /> Password: {singleUser?.password}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      hyphens: "auto", // Enables automatic hyphenation
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    <CheckCircle /> Last seen:{" "}
                    {singleUser?.lastSeen === null
                      ? "now"
                      : timeAgo(new Date(singleUser?.lastSeen).getTime())}
                  </Typography>
                </Stack>

                <Box m={1.5}>
                  Joined on{" "}
                  {(() => {
                    const date = new Date(singleUser?.createdAt);
                    return date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  })()}
                </Box>
              </Box>

              <Stack mt={2} display={{ xs: "flex", md: "none" }}>
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
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(singleUser?.balance > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(singleUser?.balance)}
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
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(singleUser?.totalDeposit > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(singleUser?.totalDeposit)}
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
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: singleUser?.currency?.code,
                              ...(singleUser?.earnedTotal > 999999
                                ? { notation: "compact" }
                                : {}),
                            }).format(singleUser?.earnedTotal)}
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

                          {singleUser?.isManualAssetMode ? (
                            <Typography fontWeight={"600"}>
                              {Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: singleUser?.currency?.code,
                                ...(totalWalletBalanceManual > 999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(totalWalletBalanceManual)}
                            </Typography>
                          ) : (
                            <Typography fontWeight={"600"}>
                              {coinPriceLoading ? (
                                <Skeleton variant="text" width={"200px"} />
                              ) : allCoins.length !== 0 ? (
                                Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: singleUser?.currency?.code,
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
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <CurrencyCircleDollar size={24} />
                      <Typography variant="subtitle2" fontWeight={500}>
                        Demo Balance
                      </Typography>
                    </Stack>
                    <Typography fontWeight={"600"}>
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code,
                        ...(singleUser?.demoBalance > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(singleUser?.demoBalance)}
                    </Typography>
                  </Stack>

                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <CurrencyDollar size={24} />
                      <Typography variant="subtitle2" fontWeight={500}>
                        Referral Bonus
                      </Typography>
                    </Stack>
                    <Typography fontWeight={"600"}>
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: singleUser?.currency?.code,
                        ...(singleUser?.referralBonus > 999999
                          ? { notation: "compact" }
                          : {}),
                      }).format(singleUser?.referralBonus)}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    //   onClick={handleOpenReferralDrawer}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
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
                      <Typography fontWeight={"600"}>View</Typography>
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
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <LockKey size={28} />
                      <Typography variant="subtitle2" fontWeight={500}>
                        General Lock
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch1}
                      onChange={() => handleSwitchChange("switch1")}
                      name="switch1"
                    />
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <LockKey size={28} />
                      <Typography variant="subtitle2" fontWeight={500}>
                        Upgrade Lock
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch2}
                      onChange={() => handleSwitchChange("switch2")}
                      name="switch2"
                    />
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <LockKey size={28} />
                      <Typography variant="subtitle2" fontWeight={500}>
                        Signal Lock
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch3}
                      onChange={() => handleSwitchChange("switch3")}
                      name="switch3"
                    />
                  </Stack>
                </Stack>
              </Box>
            </Box>

            <Box flex={"70%"} backgroundColor="transparent">
              <Operators />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserDetails;
