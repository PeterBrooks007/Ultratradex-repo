import {
  Box,
  Button,
  IconButton,
  InputBase,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";

import Header from "./adminComponents/Header";
import {
  CheckCircle,
  ClockCounterClockwise,
  MagnifyingGlass,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import AllUsersTable from "./adminComponents/AllUsersTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  getLoginStatus,
} from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";

const AllUsers = () => {
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(true); // Track event loading

  const { isLoading, user, allUsers } = useSelector((state) => state.auth);

  const [value, setValue] = useState("all");

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 100); // Simulate a 2-second loading delay
  }, []);

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  let allUservalue;

  if (value === "all") {
    allUservalue = Array.isArray(allUsers)
      ? allUsers
          .filter((user) => user?.role !== "admin") // Filter out admins
          .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0)) // Sort by isOnline, online users first
      : [];
  } else if (value === "active") {
    allUservalue = Array.isArray(allUsers)
      ? allUsers.filter(
          (user) => user?.role !== "admin" && user?.isOnline === true
        )
      : [];
  } else {
    allUservalue = Array.isArray(allUsers)
      ? allUsers.filter((user) => user?.isOnline === false)
      : [];
  }

  const all = Array.isArray(allUsers)
    ? allUsers.filter((user) => user?.role !== "admin")
    : [];

  const active = Array.isArray(allUsers)
    ? allUsers.filter(
        (user) => user?.isOnline === true && user?.role !== "admin"
      )
    : [];

  const inactiveLength = Array.isArray(allUsers)
    ? allUsers.filter(
        (user) => user?.isOnline === false && user?.role !== "admin"
      )
    : [];

  return (
    <>
      {isLoading || !user || pageLoading ? (
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
              title={"All Users"}
              subtitle={"List of all registered users in the platform "}
            />
            <Button
              startIcon={<ClockCounterClockwise size={22} />}
              variant="contained"
              size="small"
              sx={{ borderRadius: "30px", fontWeight: 700 }}
              onClick={() => {
                dispatch(getAllUsers());
              }}
            >
              Refresh
            </Button>
          </Stack>

          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} spacing={1.5} m={"20px"} mt={0}>
              <Button
                sx={{
                  borderColor: "orange",
                  fontSize: { xs: "12px", sm: "14px" },
                }}
                variant="outlined"
                startIcon={<Users size={25} color="orange" />}
                onClick={() => setValue("all")}
              >
                All ({all?.length})
              </Button>
              <Button
                sx={{
                  borderColor: "green",
                  fontSize: { xs: "12px", sm: "14px" },
                }}
                variant="outlined"
                startIcon={<CheckCircle size={25} color="green" />}
                onClick={() => setValue("active")}
              >
                Active ({active.length})
              </Button>
              <Button
                sx={{
                  borderColor: "grey",
                  fontSize: { xs: "12px", sm: "14px" },
                }}
                variant="outlined"
                startIcon={<XCircle size={25} color="grey" />}
                onClick={() => setValue("inactive")}
              >
                Inactive ({inactiveLength?.length})
              </Button>
              <Button
                sx={{
                  borderColor: "grey",
                  display: { xs: "none", sm: "flex" },
                  fontSize: { xs: "12px", sm: "14px" },
                }}
                variant="outlined"
                startIcon={<ClockCounterClockwise size={18} color="grey" />}
                onClick={() => {
                  dispatch(getAllUsers());
                  dispatch(getAllAdminTotalCounts());
                }}
              >
                ReFresh
              </Button>
            </Stack>
          </Stack>

          <Box mx={{ xs: "10px", md: "20px" }} overflow={"auto"} pb={"100px"}>
            {allUservalue && allUservalue.length > 0 ? (
              <AllUsersTable allUsers={allUservalue} />
            ) : (
              <Stack
                spacing={0.5}
                mt={5}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <XCircle size={52} />
                <Typography variant="h5">No User Found</Typography>
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AllUsers;
