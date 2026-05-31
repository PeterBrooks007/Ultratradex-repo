import {
  Box,
} from "@mui/material";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import MailBoxComp from "./adminComponents/MailBoxComp";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

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

const Mailbox = () => {
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading


  const { isLoading, } = useSelector(
    (state) => state.auth
  );

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);


  return (
    <>
      {isLoading || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box m={{xs: 0, md: "20px"}} height={"90vh"} overflow={"hidden"} pb={5}>
          <Box
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
          >
            <Box
              flex={{ xs: "100%", lg: "70%", xl: "75%" }}
              overflow={"hidden"}
              height={{xs: size.height, md: "85vh"}}
            >
              <MailBoxComp/>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Mailbox;
