import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowsClockwise,
  Bell,
  Pen,
  Plus,
  PlusCircle,
  Trash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetUserNotifications,
  deleteNotification,
  getAllAdminNotifications,
  getUserNotifications,
  SETSELECTEDNOTIFICATION,
  userClearNotification,
} from "../redux/features/notifications/notificationsSlice";
import { timeAgo } from "../utils";
import { tokens } from "../theme";
import EditUserNotificationsDrawer from "../pages/admin/adminComponents/drawers/EditUserNotificationsDrawer";
import AddUserNotificationsDrawer from "../pages/admin/adminComponents/drawers/AddUserNotificationsDrawer";
import { getAllUserTotalCounts } from "../redux/features/totalCounts/totalCountsSlice";
import { toast } from "react-toastify";

const Notifications = ({
  handlenotificationClose,
  handleOpenAllNotificationsDrawer,
  setAllNotificationsLoader,
  allNotification,
  allAdminNotificationbar,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    isSemiLoading,
    allNotifications,
    allAdminNotifications,
    isSuccess,
    isError,
  } = useSelector((state) => state.notifications);

  const { user, singleUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (
      user?.role !== "admin" &&
      allNotifications?.length === 0 &&
      isSuccess === false &&
      isError === false
    ) {
      dispatch(getUserNotifications());
      dispatch(getAllUserTotalCounts());
    }
  }, [dispatch, user?.role, allNotifications, isSuccess, isError]);

  useEffect(() => {
    if (singleUser && user?.role === "admin") {
      dispatch(adminGetUserNotifications(singleUser?._id));
    }
  }, [dispatch, singleUser, user]);

  const id = user?._id;

  const handleDeleteNotification = async (notificationId) => {
    const formData = {
      userId: user?._id,
      notificationData: {
        notificationId,
      },
    };

    // console.log({ id, formData });

    if (user?.role !== "admin") {
      await dispatch(deleteNotification({ id, formData }));
      dispatch(getAllUserTotalCounts());
    }
  };



  // Delete Notification Drawer
  const [openDeleteNotificationDrawer, setDeleteNotificationDrawer] =
    useState(false);
  const [selectedNotificationID, setSelectedNotificationID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteNotificationDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteNotificationDrawer(false);
  };

  const AdmindeleteNotification = () => {
    const formData = {
      userId: singleUser?._id,
      notificationData: {
        notificationId: selectedNotificationID?.notificationId,
      },
    };
    const id = selectedNotificationID?.notificationId;
    dispatch(deleteNotification({ id, formData }));
  };

  // End Delete Notification Drawer
  allNotification;

  let AllNotifications;

  if (allNotification) {
    AllNotifications = Array.isArray(allNotifications[0]?.notifications)
      ? allNotifications[0].notifications
          .filter((notification) => notification.to !== "Support Team") // Exclude "Support Team"
          .slice() // Create a copy
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Newest first
          })
      : [];
  } else {
    AllNotifications = Array.isArray(allNotifications[0]?.notifications)
      ? allNotifications[0]?.notifications
          .filter((notification) => notification.to !== "Support Team") // Exclude "Support Team"
          .slice() // Create a copy
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Sort by newest first
          })
          .slice(0, 3) // Take the first 3 notifications
      : [];
  }

  const AllNotificationsLength = Array.isArray(
    allNotifications[0]?.notifications
  )
    ? allNotifications[0].notifications
        .filter((notification) => notification.to !== "Support Team") // Exclude "Support Team"
        .slice() // Create a copy
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Newest first
        })
    : [];

  // console.log(AllNotifications);


  const userClearNotificationNow = async () => {
    const formData = {
      userId: user?._id,
      notificationData: {
        notificationId: "",
      },
    };

    if(AllNotificationsLength.length === 0) {
       return toast.error("No Notification")
    }

    console.log({ id, formData });

    if (user?.role !== "admin") {
      await dispatch(userClearNotification({ id, formData }));
       await dispatch(getUserNotifications());
      dispatch(getAllUserTotalCounts());
    }
  };




  // AddUserNotification Drawer
  const [addUserNotificationLoader, setAddUserNotificationLoader] =
    useState(false);

  const [openAddUserNotificationDrawer, setOpenAddUserNotificationDrawer] =
    useState(false);

  const handleOpenAddUserNotificationDrawer = () => {
    setOpenAddUserNotificationDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseAddUserNotificationDrawer = () => {
    setOpenAddUserNotificationDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // End of EditUserNotification Drawer

  // EditUserNotification Drawer
  const [editUserNotificationLoader, setEditUserNotificationLoader] =
    useState(false);

  const [openEditUserNotificationDrawer, setOpenEditUserNotificationDrawer] =
    useState(false);

  const handleOpenEditUserNotificationDrawer = () => {
    setOpenEditUserNotificationDrawer(true);
    // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseEditUserNotificationDrawer = () => {
    setOpenEditUserNotificationDrawer(false);
    // document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // End of EditUserNotification Drawer

  return (
    <>
      {isSemiLoading ? (
        <Stack justifyContent={"center"} alignItems={"center"} m={4}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Stack spacing={2} height={"100%"} overflow={"auto"}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            p={"10px 16px 0px 16px"}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                <Bell size={24} />
                <Typography fontWeight={600}>Notifications</Typography>
              </Stack>

              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Stack
                  backgroundColor="green"
                  borderRadius={"6px"}
                  p={"0px 8px"}
                  color={"white"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="subtitle2">
                    {allNotifications.length > 0 &&
                      AllNotificationsLength.length}{" "}
                    New
                  </Typography>
                </Stack>

                {user?.role !== "admin" && allNotification === true && (
                  <Stack
                    backgroundColor="green"
                    borderRadius={"6px"}
                    p={"0px 8px"}
                    color={"white"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{cursor: "pointer"}}
                    onClick={userClearNotificationNow}
                  >
                    <Typography variant="subtitle2">Clear</Typography>
                  </Stack>
                )}

                {user?.role === "admin" && (
                  <Button
                    size={"small"}
                    variant="outlined"
                    startIcon={<PlusCircle size={15} />}
                    onClick={() => {
                      setAddUserNotificationLoader(true);
                      handleOpenAddUserNotificationDrawer();
                    }}
                  >
                    Add
                  </Button>
                )}

                {user?.role !== "admin" && allNotification !== true && (
                  <>
                    <IconButton
                      size="small"
                      sx={{ border: "0.5px solid grey" }}
                      onClick={() => {
                        dispatch(getUserNotifications());
                        dispatch(getAllUserTotalCounts());
                      }}
                    >
                      <ArrowsClockwise size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ border: "0.5px solid grey" }}
                      onClick={handlenotificationClose}
                    >
                      <X size={18} />
                    </IconButton>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* <Divider /> */}
          <Stack spacing={0} px={0}>
            {AllNotifications && AllNotifications.length > 0 ? (
              AllNotifications.map((notification) => (
                <>
                  <Stack
                    key={notification?._id}
                    direction={"row"}
                    spacing={1}
                    alignItems={"flex-start"}
                    p={"16px 20px"}
                    position={"relative"}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      cursor: "pointer",
                      borderTop: "0.5px solid lightgrey",
                    }}
                  >
                    {user?.role !== "admin" && (
                      <Box
                        borderRadius={"10px"}
                        position={"absolute"}
                        top={5}
                        right={10}
                      >
                        <IconButton
                          onClick={() =>
                            handleDeleteNotification(notification?._id)
                          }
                        >
                          <X size={18} />
                        </IconButton>
                      </Box>
                    )}
                    <Avatar sx={{ bgcolor: "green" }}>
                      <Bell color="white" size={28} />
                    </Avatar>
                    <Stack spacing={0.5}>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Typography variant="body1" fontWeight={"700"}>
                          {notification?.title}
                        </Typography>
                        {user?.role === "admin" && (
                          <>
                            <IconButton
                              size="small"
                              sx={{ border: "0.5px solid grey" }}
                              onClick={() => {
                                dispatch(SETSELECTEDNOTIFICATION(notification));
                                setEditUserNotificationLoader(true);
                                handleOpenEditUserNotificationDrawer();
                              }}
                            >
                              <Pen />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ border: "0.5px solid grey" }}
                              onClick={() => {
                                setSelectedNotificationID({
                                  notificationId: notification?._id,
                                });
                                handleClickDelete();
                              }}
                            >
                              <Trash />
                            </IconButton>
                          </>
                        )}
                      </Stack>

                      <Typography variant="subtitle2">
                        {notification?.message}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {timeAgo(new Date(notification?.createdAt).getTime())}
                      </Typography>
                    </Stack>
                  </Stack>
                </>
              ))
            ) : (
              <Stack justifyContent={"center"} alignItems={"center"}>
                <Typography variant="body1">No Notifications</Typography>
              </Stack>
            )}
          </Stack>

          {allNotification !== true && (
            <Stack p={2} borderTop={"2px solid grey"}>
              <Button
                variant="contained"
                onClick={() => {
                  handlenotificationClose();
                  setAllNotificationsLoader(true);
                  handleOpenAllNotificationsDrawer();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                View All Notifications
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      <Dialog
        open={openDeleteNotificationDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this notification`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              AdmindeleteNotification();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddUserNotificationsDrawer
        open={openAddUserNotificationDrawer}
        handleClose={handleCloseAddUserNotificationDrawer}
        handleOpen={handleOpenAddUserNotificationDrawer}
        addUserNotificationLoader={addUserNotificationLoader}
        setAddUserNotificationLoader={setAddUserNotificationLoader}
      />

      <EditUserNotificationsDrawer
        open={openEditUserNotificationDrawer}
        handleClose={handleCloseEditUserNotificationDrawer}
        handleOpen={handleOpenEditUserNotificationDrawer}
        editUserNotificationLoader={editUserNotificationLoader}
        setEditUserNotificationLoader={setEditUserNotificationLoader}
      />
    </>
  );
};

export default Notifications;
