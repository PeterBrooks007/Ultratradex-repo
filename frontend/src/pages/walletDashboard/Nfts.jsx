import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import {
  CaretDown,
  Cube,
  CurrencyCircleDollar,
  Eye,
  MagnifyingGlass,
  PlusCircle,
  ShareFat,
} from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import WalletHomeSkeleton from "./walletSkeletons/WalletHomeSkeleton";
import {
  changeCurrency,
  getLoginStatus,
} from "../../redux/features/auth/authSlice";
import TopBar from "../dashboard/dashboardComponents/TopBar";
import Activity from "./walletComponents/Activity";
import { CryptoImages } from "../../data";
import ChangeCurrencyDialog from "../../components/dialogs/ChangeCurrencyDialog";
import NftsComp from "../../components/NftsComp";
import WalletLeft from "../../components/WalletLeft";

export const Nfts = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const size = UseWindowSize();
  const { isLoading: appLoading } = useSelector((state) => state.app);

  const { user, isLoading, isLoggedIn, conversionRate } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  const totalWalletBalance = user?.assets.reduce(
    (acc, asset) => acc + asset?.balance,
    0
  );

  const currencies = [
    { code: "USD", flag: "us" }, // United States Dollar
    { code: "GBP", flag: "gb" }, // British Pound Sterling
    { code: "EUR", flag: "eu" }, // Euro (used by the Eurozone)
    { code: "JPY", flag: "jp" }, // Japanese Yen
    { code: "AUD", flag: "au" }, // Australian Dollar
    { code: "CAD", flag: "ca" }, // Canadian Dollar
    { code: "CHF", flag: "ch" }, // Swiss Franc
    { code: "CNY", flag: "cn" }, // Chinese Yuan
    { code: "HKD", flag: "hk" }, // Hong Kong Dollar
    { code: "NZD", flag: "nz" }, // New Zealand Dollar
  ];

  const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "USD",
    flag: "us",
  });

  const handleCurrencyClick = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
  };

  const handleSelectCurrency = () => {
    // console.log(selectedCurrency);
    dispatch(changeCurrency(selectedCurrency));
  };

  const [openChangeCurrencyDialog, setOpenChangeCurrencyDialog] =
    useState(false);

  const handleCloseChangeCurrencyDialog = () => {
    setOpenChangeCurrencyDialog(false);
  };

  const handleOpenChangeCurrencyDialog = () => {
    setOpenChangeCurrencyDialog(true);
  };
  return (
    <>
      {appLoading || isLoading || !user ? (
        <WalletHomeSkeleton />
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
            {size.width > 1200 && (
              <Box
                flex={{ xs: "100%", lg: "30%", xl: "25%" }}
                sx={{ overflowY: "auto", overflowX: "hidden" }}
                pb={{ xs: 20, sm: 20, md: 0 }}
              >
                <WalletLeft />
              </Box>
            )}

            <Box
              flex={{ xs: "100%", lg: "70%", xl: "75%" }}
              // backgroundColor="red"
              overflow={"hidden"}
              p={{ xs: "2px", md: "20px" }}
              ml={{ xs: "none", md: "20px" }}
              border={{ xs: "none", md: "0.5px solid grey" }}
              borderRadius={"20px"}
            >
              <Stack display={{ xs: "flex", md: "none" }}>
                <TopBar />
              </Stack>

              <NftsComp />
            </Box>
          </Box>
        </Box>
      )}

      <ChangeCurrencyDialog
        open={openChangeCurrencyDialog}
        handleClose={handleCloseChangeCurrencyDialog}
        handleOpen={handleOpenChangeCurrencyDialog}
        handleSelectCurrency={handleSelectCurrency}
      />
    </>
  );
};

export default Nfts;
