import { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,

} from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { adminChangeUserCurrency } from "../../../../redux/features/auth/authSlice";
import { currencies } from "../../../../data";




const ChangeCurrencyDrawer = ({
  open,
  handleClose,
  handleOpen,
  changeCurrencyDrawerLoader,
  setChangeCurrencyDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (changeCurrencyDrawerLoader) {
      const timer = setTimeout(() => {
        setChangeCurrencyDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [changeCurrencyDrawerLoader, setChangeCurrencyDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);


  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // console.log(selectedCurrency)


  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const userData = {
      code: selectedCurrency?.code,
      flag: selectedCurrency?.flag,
    }

    // console.log(userData)

    await dispatch(adminChangeUserCurrency({id, userData}));

  };


  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "550px" },
          },
        }}
      >
        {changeCurrencyDrawerLoader || isSemiLoading ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
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
                  Change Currency
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
                  Change Currency
                </Typography>
              </Toolbar>
            </AppBar>

            <Box p={2}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                pb={2}
                alignItems={"center"}
              >
                <Typography variant="body1" fontWeight={"bold"}>
                  Change User Currency
                </Typography>
                {/* <Button startIcon={<PlusCircle size={20} />}  size="small" variant="outlined" onClick={handleOpenAddWalletModal}>
                    Add Wallet
                  </Button> */}
              </Stack>

              <Divider flexItem />

              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                p={"10px 0"}
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

                <Stack>
                <Typography variant="subtitle2">
                 CURRENCY
                </Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                <img
                    width={"20"}
                    height={"20"}
                    style={{ borderRadius: "50%" }}
                    src={`https://flagcdn.com/w80/${singleUser?.currency?.flag}.png`}
                    alt={singleUser?.currency?.code}
                  />{" "}
                  <Typography>
                  {singleUser?.currency?.code}
                  </Typography>
                </Stack>
                </Stack>
                
              </Stack>

              <Divider />

              <Stack mt={2}>
                <form onSubmit={handleFormSubmit}>
                  <Stack spacing={2}>
                    <Autocomplete
                      id="country-select-demo"
                      sx={{ width: "100%" }}
                      options={currencies}
                      autoHighlight
                      getOptionLabel={(option) => option.code}
                      onChange={(event, newValue) =>
                        setSelectedCurrency(newValue)
                      }
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                          <Box
                            key={key}
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...optionProps}
                          >
                            <img
                              loading="lazy"
                              width="30"
                              height="30"
                              srcSet={`https://flagcdn.com/w80/${option?.flag}.png`}
                              src={`https://flagcdn.com/w80/${option?.flag}.png`}
                              alt={option?.code}
                              style={{ borderRadius: "50%" }}
                            />
                            {option.code}
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Currency"
                          slotProps={{
                            htmlInput: {
                              ...params.inputProps,
                              autoComplete: "new-password", // disable autocomplete and autofill
                            },
                          }}
                        />
                      )}
                    />

                    <Button
                      fullWidth
                      color="inherit"
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "text.primary",
                        borderRadius: "10px",
                        padding: "15px",
                        fontWeight: "600",
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "common.white"
                            : "grey.800",
                        "&:hover": {
                          bgcolor: "text.primary",
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "common.whitw"
                              : "grey.800",
                        },
                      }}
                      disabled={isSemiLoading}
                    >
                      {isSemiLoading ? (
                        <CircularProgress size={22} />
                      ) : (
                        " Change User Currency"
                      )}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default ChangeCurrencyDrawer;
