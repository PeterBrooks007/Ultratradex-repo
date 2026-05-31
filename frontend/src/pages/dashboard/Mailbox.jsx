import {
  Box,
  Container,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import PropTypes from "prop-types";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import MailBoxComp from "./dashboardComponents/MailBoxComp";
import { getUserMail } from "../../redux/features/mailbox/mailboxSlice";

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
      {value === index && <Box sx={{ p: "20px 0 0 0" }}>{children}</Box>}
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

const Mailbox = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();
  // const { isLoading: appLoading } = useSelector((state) => state.app);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { user, isLoading, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const { allMails } = useSelector(
    (state) => state.mailbox
  );

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);


  useEffect(() => {
    if (allMails.length === 0) {
      dispatch(getUserMail());
    }
  }, [dispatch, allMails.length]);
  



  return (
    <>
      { isLoading || !user ? (
        <LoadingScreen />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "0px", md: "20px" }}
          sx={{ overflowX: "hidden" }}
          // overflow={"auto"}
          className="scrollable-element"
          // border={"2px solid green"}
        >
          <Box
            mb={{ xs: 1.5, md: 3 }}
            mt={"-15px"}
            mx={"-15px"}
            borderBottom={"1px solid #111820"}
            display={{xs: "none", md: "flex"}}
          >
            <TickerTapeWidget />
          </Box>

          {/* {size.width < 899 && (
            <Box mb={2}>
              <TopBar />
            </Box>
          )} */}

          <Container
            // display={"flex"}
            // flexDirection={{ xs: "column", lg: "row" }}
            // mb={{xs: 10, md: 0}}
            // gap={2}
            maxWidth="xxl"
            
            
          >
            <Box
              flex={{ xs: "100%", lg: "70%", xl: "75%" }}
              overflow={"hidden"}
              ml={{ xs: "none", md: "20px" }}
              height={{xs: size.height, md: "85vh"}}
              // border={"2px solid green"}
              mx={"-15px"}
            >
              <MailBoxComp />
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default Mailbox;
