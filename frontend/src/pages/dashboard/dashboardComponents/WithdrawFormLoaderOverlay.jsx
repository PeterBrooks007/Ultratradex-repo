import { CircularProgress, Stack, useTheme } from "@mui/material";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoinpaprikaCoinPrices } from "../../../redux/features/coinPrice/coinPriceSlice";
import { tokens } from "../../../theme";

const WithdrawFormLoaderOverlay = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();
  const { isLoading, } = useSelector((state) => state.coinPrice);


  useEffect(() => {
    const localStorageKey = "allCoinpaprikaCoinPrices";
    const cooldownPeriod = 20 * 60 * 1000; // 20 minutes in milliseconds
  
    const fetchCoinPrices = () => {
      dispatch(getAllCoinpaprikaCoinPrices());
    };
  
    const cachedData = localStorage.getItem(localStorageKey);
  
    if (cachedData) {
      try {
        const { data, savedAt } = JSON.parse(cachedData);
        if (!data || !savedAt) throw new Error("Invalid structure");
        const timeSinceSaved = new Date().getTime() - new Date(savedAt).getTime();

        // console.log(timeSinceSaved > cooldownPeriod)
  
        if (!data || data.length === 0 || timeSinceSaved > cooldownPeriod) {
        // Data is stale, fetch new data
          fetchCoinPrices();
          // console.log("allCoinpaprikaCoinPrices data re-fetch");
        } else {
          // console.log("Using cached allCoinpaprikaCoinPrices data");
        }
      } catch (error) {
        // console.error("Invalid cached data, refetching:", error);
        fetchCoinPrices();
      }
    } else {
      // No cached data, fetch for the first time
      fetchCoinPrices();
      // console.log("First-time fetch for allCoinpaprikaCoinPrices data");
    }
  }, [dispatch]);
  
  

  return (
    <>
      {isLoading && (
        <Stack
          position={"absolute"}
          height={"90%"}
          width={"100%"}
          backgroundColor={colors.dashboardforeground[100]}
          zIndex={1000}
          mt={8}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress sx={{mt: -10}}/>
        </Stack>
      )}
    </>
  );
};

export default WithdrawFormLoaderOverlay;
