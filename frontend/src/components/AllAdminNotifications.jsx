import {
  Avatar,
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
import { ArrowsClockwise, Bell, Pen, Trash, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminClearNotification,
  deleteNotification,
  getAllAdminNotifications,
  SETSELECTEDNOTIFICATION,
} from "../redux/features/notifications/notificationsSlice";
import { timeAgo } from "../utils";
import { getAllAdminTotalCounts } from "../redux/features/totalCounts/totalCountsSlice";
import { toast } from "react-toastify";

const AllAdminNotifications = ({
  handlenotificationClose,
  handleOpenAllNotificationsDrawer,
  setAllNotificationsLoader,
  allNotification,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { isSemiLoading, allAdminNotifications, isSuccess, isError } =
    useSelector((state) => state.notifications);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(getAllAdminNotifications());
      dispatch(getAllAdminTotalCounts());
    }
  }, [dispatch, user]);

  // Delete Notification Drawer
  const [openDeleteNotificationDrawer, setDeleteNotificationDrawer] =
    useState(false);

  const [selectedNotificationID, setSelectedNotificationID] = useState(null);

  // console.log(selectedNotificationID);

  const handleClickDelete = () => {
    setDeleteNotificationDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteNotificationDrawer(false);
  };

  const AdmindeleteNotification = async () => {
    const formData = {
      userId: selectedNotificationID?.userId,
      notificationData: {
        notificationId: selectedNotificationID?.notificationId,
      },
    };
    const id = selectedNotificationID?.userId;

    await dispatch(deleteNotification({ id, formData }));
    dispatch(getAllAdminNotifications());
    dispatch(getAllAdminTotalCounts());
  };

  // End Delete Notification Drawer

  let AllNotifications;

  if (allNotification) {
    AllNotifications = Array.isArray(allAdminNotifications)
      ? allAdminNotifications?.slice().sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Newest first
        })
      : [];
  } else {
    AllNotifications = Array.isArray(allAdminNotifications)
      ? allAdminNotifications
          ?.slice() // Create a copy to avoid mutating the original array
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Sort by newest first
          })
          .slice(0, 3) // Take the first 3 notifications
      : [];
  }

  const adminClearNotificationNow = async () => {
    if (AllNotifications.length === 0) {
      return toast.error("No Notification");
    }

    const formData = {
      userId: selectedNotificationID?.userId,
      notificationData: {
        notificationId: selectedNotificationID?.notificationId,
      },
    };
    const id = selectedNotificationID?.userId;

    // console.log(id)

    await dispatch(adminClearNotification({ id, formData }));
    dispatch(getAllAdminNotifications());
    dispatch(getAllAdminTotalCounts());
  };

  // // AddUserNotification Drawer
  // const [addUserNotificationLoader, setAddUserNotificationLoader] =
  //   useState(false);

  // const [openAddUserNotificationDrawer, setOpenAddUserNotificationDrawer] =
  //   useState(false);

  // const handleOpenAddUserNotificationDrawer = () => {
  //   setOpenAddUserNotificationDrawer(true);
  //   // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  // };

  // const handleCloseAddUserNotificationDrawer = () => {
  //   setOpenAddUserNotificationDrawer(false);
  //   // document.documentElement.style.overflow = ""; // Resets <html> scroll
  // };

  // // End of EditUserNotification Drawer

  // // EditUserNotification Drawer
  // const [editUserNotificationLoader, setEditUserNotificationLoader] =
  //   useState(false);

  // const [openEditUserNotificationDrawer, setOpenEditUserNotificationDrawer] =
  //   useState(false);

  // const handleOpenEditUserNotificationDrawer = () => {
  //   setOpenEditUserNotificationDrawer(true);
  //   // document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  // };

  // const handleCloseEditUserNotificationDrawer = () => {
  //   setOpenEditUserNotificationDrawer(false);
  //   // document.documentElement.style.overflow = ""; // Resets <html> scroll
  // };

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
                    {allAdminNotifications?.length} New
                  </Typography>
                </Stack>
                <Stack
                  backgroundColor="green"
                  borderRadius={"6px"}
                  p={"0px 8px"}
                  color={"white"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={adminClearNotificationNow}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography variant="subtitle2">Clear</Typography>
                </Stack>
                {user?.role === "admin" && (
                  <IconButton
                    size="small"
                    sx={{ border: "0.5px solid grey" }}
                    onClick={() => {
                      dispatch(getAllAdminNotifications());
                      dispatch(getAllAdminTotalCounts());
                    }}
                  >
                    <ArrowsClockwise size={15} />
                  </IconButton>
                )}

                {user?.role !== "admin" && allNotification !== true && (
                  <IconButton
                    size="small"
                    sx={{ border: "0.5px solid grey" }}
                    onClick={handlenotificationClose}
                  >
                    <X size={18} />
                  </IconButton>
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
                            {/* <IconButton
                              size="small"
                              sx={{ border: "0.5px solid grey" }}
                              onClick={() => {
                                dispatch(SETSELECTEDNOTIFICATION(notification));
                                setEditUserNotificationLoader(true);
                                handleOpenEditUserNotificationDrawer();
                              }}
                            >
                              <Pen />
                            </IconButton> */}
                            <IconButton
                              size="small"
                              sx={{ border: "0.5px solid grey" }}
                              onClick={() => {
                                setSelectedNotificationID({
                                  userId: notification?.userId?._id,
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

      {/* <AddUserNotificationsDrawer
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
      /> */}
    </>
  );
};

export default AllAdminNotifications;
