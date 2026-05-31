import {
  Box,

  Stack,
} from "@mui/material";

import Header from "./adminComponents/Header";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AllDepositRequestTable from "./adminComponents/AllDepositRequestTable";
import { getAllPendingDepositRequest } from "../../redux/features/deposit/depositSlice";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";


const DepositRequest = () => {

  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading


  const { isLoading, AllPendingDepositRequest } = useSelector((state) => state.deposit);

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);


  useEffect(() => {
    if(AllPendingDepositRequest.length === 0) {
      dispatch(getAllPendingDepositRequest());
    }
  }, [dispatch]);


  return (
    <>
      {isLoading || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box height={"100%"} overflow={"auto"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            m={"20px"}
          >
            <Header
              title={"Deposit Request"}
              subtitle={"List of all deposit Request"}
            />
            {/* <Box
              display={"flex"}
              border="2px solid grey"
              borderRadius={"20px"}
              height={"35px"}
            >
              <InputBase
                sx={{ ml: 2, width: "100px" }}
                placeholder="Search Deposit Request"
              />
              <IconButton type="button" sx={{ p: 1 }}>
                <MagnifyingGlass />
              </IconButton>
            </Box> */}
          </Stack>

         

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            <AllDepositRequestTable />
          </Box>
        </Box>
      )}
    </>
  );
};

export default DepositRequest;
