import {
  Box,
  Stack,
} from "@mui/material";
import Header from "./adminComponents/Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import { getAllPendingWithdrawalRequest } from "../../redux/features/withdrawal/withdrawalSlice";
import AllWithdrawalRequestTable from "./adminComponents/AllWithdrawalRequestTable";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";


const WithdrawalRequest = () => {

  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, AllPendingWithdrawalRequest } = useSelector((state) => state.withdrawal);

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);

  useEffect(() => {
    if(AllPendingWithdrawalRequest.length === 0) {
      dispatch(getAllPendingWithdrawalRequest());
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
              title={"Withdrawal Request"}
              subtitle={"List of all Pending Withdrawal Request"}
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
            <AllWithdrawalRequestTable />
          </Box>
        </Box>
      )}
    </>
  );
};

export default WithdrawalRequest;
