import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,

  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,

  ArrowsClockwise,

  PlusCircle,
  XCircle,

} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import PropTypes from "prop-types";
import { useState } from "react";
import UseWindowSize from "../../hooks/UseWindowSize";

import rewardImage from "../../assets/Rewards.png";
import giftSvgIcon from "../../assets/svgIcons/giftSvgIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import AdminAddRewardToUserDrawer from "../../pages/admin/adminComponents/drawers/AdminAddRewardToUserDrawer";
import {
  adminDeleteGiftReward,
  getSingleUser,
  UserClaimReward,
} from "../../redux/features/auth/authSlice";

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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
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

const RewardsDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const { user, singleUser, isSemiLoading } = useSelector(
    (state) => state.auth
  );
  const size = UseWindowSize();

  const [value, setValue] = useState(0);
  const [openSide, setOpenSide] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // AdminAddRewardToUserDrawer
  const [openAdminAddRewardToUserDrawer, setAdminAddRewardToUserDrawer] =
    useState(false);
  const [adminAddRewardToUserLoader, setAdminAddRewardToUserLoader] =
    useState(false);

  const handleOpenAdminAddRewardToUserDrawer = () => {
    setAdminAddRewardToUserDrawer(true);
  };

  const handleCloseAdminAddRewardToUserDrawer = () => {
    setAdminAddRewardToUserDrawer(false);
  };
  // End AdminAddRewardToUserDrawer

  let GiftArray;
  if (user?.role === "admin") {
    GiftArray = singleUser?.giftRewards;
  } else {
    GiftArray = user?.giftRewards;
  }

  const deleteGiftReward = async (giftId) => {
    const formData = {
      rewardId: giftId,
    };
    const id = singleUser?._id;

    // console.log(id, formData)

    await dispatch(adminDeleteGiftReward({ id, formData }));
  };
  

  const UserClaimRewardNow = async (giftId) => {
    const formData = {
      rewardId: giftId,
    };
    const id = user?._id;

    // console.log(id, formData)

    if (user?.role !== "admin") {

        await dispatch(UserClaimReward({ id, formData }));
    }

  };


  const handleRefresh = () => {
    const id = singleUser?._id;

    dispatch(getSingleUser(id));

  }



  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "550px" },
          },
        }}
      >
        {isSemiLoading ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
            sx={{ overflowX: "hidden" }}
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
                  Send Customize Email
                </Typography>
              </Toolbar>
            </AppBar>

            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
              width={"100%"}
            >
              <CircularProgress />
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
            position={"relative"}
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
                  <ArrowLeft color="white" size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Rewards
                </Typography>
              </Toolbar>
            </AppBar>

            <Box p={2} display={user?.role === "admin" && "none"}>
              <img
                src={rewardImage}
                alt=""
                width={"100%"}
                style={{ borderRadius: "15px" }}
              />
            </Box>

            {user?.role === "admin" && (
              <>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  p={2}
                  alignItems={"center"}
                >
                  <Typography variant="body1" fontWeight={"bold"}>
                    Reward this user
                  </Typography>
                  <Button
                    startIcon={<PlusCircle size={20} />}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setAdminAddRewardToUserLoader(true);
                      handleOpenAdminAddRewardToUserDrawer();
                    }}
                  >
                    Add Reward
                  </Button>
                </Stack>

                <Divider flexItem />

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  p={2}
                  py={0}
                  spacing={1}
                  display={{ xs: "flex", md: "flex" }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    p={"10px 0"}
                    spacing={1}
                    display={{ xs: "flex", md: "flex" }}
                  >
                    <Avatar
                      src={singleUser?.photo}
                      alt="profile picture"
                      sx={{ width: "60px", height: "60px" }}
                    />
                    <Stack>
                      <Typography variant="h6" fontWeight={"600"}>
                        {singleUser?.firstname} {singleUser?.lastname}
                      </Typography>
                      <Typography variant="caption">
                        {singleUser?.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Divider />
              </>
            )}

            <Box
              mx={2}
              p={2}
              backgroundColor={
                theme.palette.mode === "light"
                  ? "#f2f2f2"
                  : colors.dashboardbackground[100]
              }
              borderRadius={"15px"}
              mt={2}
            >
              {
                user?.role === "admin" &&
                <>
                <Stack
                direction={"row"}
                pr={2}
                pb={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h6">Claim Rewards</Typography>
                <Button startIcon={<ArrowsClockwise />} onClick={handleRefresh}>
                  Refresh
                </Button>
              </Stack>

              < Divider />
              </>
              }
             

              <Stack spacing={2} mt={1}>
                {GiftArray &&
                  GiftArray?.length !== 0 ?
                  GiftArray?.map((gift) => (
                    <Stack
                      key={gift._id}
                      direction={"row"}
                      spacing={2}
                      justifyContent={"space-between"}
                      alignItems={"flex-start"}
                    >
                      <img src={giftSvgIcon} alt="" width={40} />
                      <Stack spacing={1}>
                        <Typography fontWeight={"bold"}>
                          {gift.subject}
                        </Typography>
                        <Typography variant="body2">
                          {gift.message}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color={"springgreen"}
                        >
                          Gift Amount:{" "}
                          {user?.role === "admin"
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: singleUser?.currency?.code,
                                ...(gift.amount > 9999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(gift.amount)
                            : Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(gift.amount > 9999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(gift.amount)}
                        </Typography>
                      </Stack>

                      {user?.role !== "admin" && (
                        <Button variant="contained" sx={{ height: 40 }} onClick={() => UserClaimRewardNow(gift._id)}>
                          Claim
                        </Button>
                      )}
                      {user?.role === "admin" && (
                        <Button
                          variant="contained"
                          sx={{ height: 40 }}
                          onClick={() => deleteGiftReward(gift._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </Stack>
                  ))
                  : <Stack justifyContent={"center"} alignItems={"center"} spacing={1}>
                    <XCircle size={58} />
                    <Typography>NO GIFT REWARD</Typography>
                  </Stack>
                  }
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>

      <AdminAddRewardToUserDrawer
        open={openAdminAddRewardToUserDrawer}
        handleClose={handleCloseAdminAddRewardToUserDrawer}
        handleOpen={handleOpenAdminAddRewardToUserDrawer}
        adminAddRewardToUserLoader={adminAddRewardToUserLoader}
        setAdminAddRewardToUserLoader={setAdminAddRewardToUserLoader}
      />
    </>
  );
};

export default RewardsDrawer;
