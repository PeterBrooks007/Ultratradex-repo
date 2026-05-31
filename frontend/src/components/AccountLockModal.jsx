import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import account_lockedImage from "../assets/account_locked.png";
import upgrade_lockedImage from "../assets/upgrade_locked.png";
import DepositDrawer from "./drawers/DepositDrawer";
import { SET_TYPEOFDEPOSIT } from "../redux/features/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import HelpSupport from "./drawers/HelpSupport";
import UseWindowSize from "../hooks/UseWindowSize";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  border: "1px solid white",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

const AccountLockModal = () => {
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const { user } = useSelector((state) => state.auth);

  let lockImage, writeUp, title;

  if (user?.accountLock.generalLock === true) {
    lockImage = account_lockedImage;
    title = "Account Locked!";
    writeUp =
      " This account has been locked. Please contact our support team to unlock your account.";
  } else if (user?.accountLock.upgradeLock) {
    lockImage = upgrade_lockedImage;
    title = "Upgrade is required!";
    writeUp =
      "An upgrade is required in this account. Please upgrade your account to continue.";
  } else {
    lockImage = upgrade_lockedImage;
    title = "No Trade Signal!";
    writeUp =
      "You currently have no trade signal in your account, purchase a trade signal to continue.";
  }

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
    },
  };
  const [profile, setProfile] = useState(initialState);

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

  const [depositLoader, setdepositLoader] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);

  const [openHelpSupportDrawer, setHelpSupportDrawer] = useState(false);

  // Deposit Drawer

  const handleOpenDepositDrawer = () => {
    setOpenDepositDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseDepositDrawer = () => {
    setOpenDepositDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  // HelpSupport Drawer
  const handleOpenHelpSupportDrawer = () => {
    setHelpSupportDrawer(true);
  };

  const handleCloseHelpSupportDrawer = () => {
    setHelpSupportDrawer(false);
  };

  return (
    <>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker overlay
          },
        }}
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Stack justifyContent={"center"} alignItems={"center"}>
              <img
                width={size.width < 600 ? "150px" : "200px"}
                src={lockImage}
                alt="LockedImage"
              />
            </Stack>
            <Typography
              id="modal-modal-description"
              textAlign={"center"}
              fontWeight={700}
              variant="h6"
            >
              {title}
            </Typography>

            <Typography
              id="modal-modal-description"
              textAlign={"center"}
              fontWeight={500}
              variant="subtitle2"
            >
              {writeUp}
            </Typography>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              spacing={1}
              pt={2}
            >
              <Button
                size="small"
                variant="contained"
                sx={{ backgroundColor: " green", color: "white" }}
                onClick={handleOpenHelpSupportDrawer}
              >
                Contact Support
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ backgroundColor: " green", color: "white" }}
                onClick={() => {
                  dispatch(SET_TYPEOFDEPOSIT("Trade"));
                  setdepositLoader(true);
                  handleOpenDepositDrawer();
                }}
              >
                Make Deposit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <DepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
      />

      <HelpSupport
        open={openHelpSupportDrawer}
        handleClose={handleCloseHelpSupportDrawer}
        handleOpen={handleOpenHelpSupportDrawer}
        profile={profile}
        setProfile={setProfile}
      />
    </>
  );
};

export default AccountLockModal;
