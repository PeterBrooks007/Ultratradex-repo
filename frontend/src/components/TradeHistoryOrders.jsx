import {
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { XCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import TradeHistoryOrdersComp from "./TradeHistoryOrdersComp";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllUserTrades } from "../redux/features/trades/tradesSlice";
import { useParams } from "react-router-dom";
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
      {value === index && <Box sx={{ p: "0px 16px" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TradeHistoryOrders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { id } = useParams();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { isSemiLoading, allTrades } = useSelector((state) => state.trades);

  const { tradeOrderClicked } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(adminGetAllUserTrades(id));
    }

  }, [dispatch, user, allTrades?.length, id]);

  useEffect(() => {

    if (user?.role !== "admin" && allTrades?.length === 0) {
      dispatch(adminGetAllUserTrades(user?._id));
    }
  }, [dispatch, user, allTrades?.length, id]);
  

  let allTradeTab, liveTradeTab, demoTradeTab, PendingTradeTab, CancelledTradeTab, RejectedTradeTab;

  if (user?.role === "admin" && tradeOrderClicked === "TradeOrders") {
    allTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "PENDING";
        })
      : [];

    liveTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.tradingMode === "Live" && trade.status === "PENDING";
        })
      : [];

    demoTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
         return trade.tradingMode === "Demo" && trade.status === "PENDING";
        })
      : [];

    PendingTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "PENDING";
        })
      : [];

    CancelledTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "CANCELLED";
        })
      : [];

    RejectedTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "REJECTED";
        })
      : [];

  } else {
    allTradeTab = allTrades?.trades;

    liveTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.tradingMode === "Live";
        })
      : [];

    demoTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.tradingMode === "Demo";
        })
      : [];

    PendingTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "PENDING";
        })
      : [];

    CancelledTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "CANCELLED";
        })
      : [];


    RejectedTradeTab = Array.isArray(allTrades?.trades)
      ? allTrades?.trades.filter((trade) => {
          return trade.status === "REJECTED";
        })
      : [];
        
  }


  return (
    <>
      {isSemiLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          height={"100%"}
          width={"100%"}
          mt={2}
        >
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Box height={"100%"} mt={1} mx={-2}>
          <Box mx={2}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "transparent",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  minHeight: "32px",
                  padding: "4px 12px",
                  minWidth: "auto",
                  borderRadius: "20px",
                  border: "none",
                  borderBottom: "2px solid transparent",
                  "&:hover": {
                    //   border: "2px solid #ccc",
                  },
                  "&.Mui-selected": {
                    // border: "2px solid #007bff",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    // boxShadow: `${theme.shadows[2]}`,
                    color: "black",
                  },
                },
              }}
            >
              <Tab label="All" {...a11yProps(0)} />
              <Tab label="Live" {...a11yProps(1)} />
              <Tab label="Demo" {...a11yProps(2)} />
              <Tab label="Pending" {...a11yProps(3)} />
              <Tab label="Cancelled" {...a11yProps(4)} />
              <Tab label="Rejected" {...a11yProps(5)} />
              {/* <Tab label="Notification log" {...a11yProps(3)} /> */}
            </Tabs>
          </Box>

          <Box
            height={"100%"}
            overflow={"auto"}          >
            <CustomTabPanel value={value} index={0}>
              <TradeHistoryOrdersComp allTradeFiltered={allTradeTab} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
            <TradeHistoryOrdersComp allTradeFiltered={liveTradeTab} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
            <TradeHistoryOrdersComp allTradeFiltered={demoTradeTab} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
            <TradeHistoryOrdersComp allTradeFiltered={PendingTradeTab} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
            <TradeHistoryOrdersComp allTradeFiltered={CancelledTradeTab} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
            <TradeHistoryOrdersComp allTradeFiltered={RejectedTradeTab} />
            </CustomTabPanel>
           
          </Box>
        </Box>
      )}
    </>
  );
};

export default TradeHistoryOrders;
