import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  Chip,
  styled,
  Stack,
  Grid,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  InputBase,
  TablePagination,
} from "@mui/material";
import {
  CheckCircle,
  GlobeHemisphereEast,
  Lock,
  MagnifyingGlass,
  Pen,
  Phone,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { shortenText, timeAgo } from "../../../utils";
import {
  adminDeleteUser,
  RESETSETSELECTEDUSER,
} from "../../../redux/features/auth/authSlice";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import StyledBadge from "../../../components/StyledBadge";
import { useEffect, useState } from "react";
import { getAllAdminTotalCounts } from "../../../redux/features/totalCounts/totalCountsSlice";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "green",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 60, // Default width for xs breakpoint
  height: 60, // Default height for xs breakpoint
  marginRight: theme.spacing(0),
  border: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.up("md")]: {
    width: 100,
    height: 100,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function AllUsersTable({ allUsers }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const size = UseWindowSize();

  // const { allUsers } = useSelector((state) => state.auth);

  const handleEdit = (id) => {
    navigate(`/admin/user-details/${id}`);
  };

  // Delete Trader Drawer
  const [openDeleteUserDrawer, setDeleteUserDrawer] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteUserDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteUserDrawer(false);
  };

  const deleteTrader = async () => {
    // console.log(selectedUserID.userID)
    // const id = selectedUserID?.userID;
    await dispatch(adminDeleteUser({ id: selectedUserID?.userID }));
    dispatch(getAllAdminTotalCounts());
  };

  const [userList, setTradingBotsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = Array.isArray(userList)
    ? allUsers.filter(
        (user) =>
          user?.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          user?.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          user?.email.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (allUsers.length !== 0) {
      setTradingBotsList(allUsers);
    }
  }, [allUsers]);

  //start of pagination
  // Define state for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12); // Default rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 12)); // Set rows per page
    setPage(0); // Reset to first page
  };

  // Calculate the current data slice
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  //end of pagination

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={{ xs: 2, md: 0 }}
      >
        <Box
          display={"flex"}
          border="0.5px solid grey"
          borderRadius={"20px"}
          height={"35px"}
          width={{ xs: "100%", md: "300px" }}
        >
          <InputBase
            sx={{ ml: 2, width: "100%" }}
            placeholder="Search User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <MagnifyingGlass />
          </IconButton>
        </Box>

        <Box display={{ xs: "none", md: "flex" }}>
          <TablePagination
            rowsPerPageOptions={[8, 12, 25]}
            component="div"
            count={filteredUsers.length} // Total count of items
            rowsPerPage={rowsPerPage} // Rows per page
            page={page} // Current page
            onPageChange={handleChangePage} // Handle page change
            onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          />
        </Box>
      </Stack>

      {size.width > 899 && (
        <Grid container spacing={2} columns={12} pt={2} px={1}>
          {paginatedUsers &&
            paginatedUsers
              .filter((user) => user?.role !== "admin")
              .map((user) => (
                <Grid item xs={6} md={4} xl={3} key={user?._id}>
                  <Box
                    sx={{ flexGrow: 1 }}
                    backgroundColor={`${colors.dashboardbackground[100]}`}
                    boxShadow={
                      theme.palette.mode === "light" && `${theme.shadows[2]}`
                    }
                    p={"10px 5px"}
                    borderRadius={"10px"}
                  >
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      mb={2}
                    >
                      <Stack direction={"row"} alignItems={"center"}>
                        <Checkbox
                          checked={() => {}}
                          // onClick={(e) => {
                          //   e.stopPropagation(); // Stop the click event from bubbling up
                          // }}
                          // onChange={() => handleSelectWallet(wallet?._id)}
                        />
                        <Chip
                          size="small"
                          icon={
                            user?.isOnline ? (
                              <CheckCircle
                                color={user?.isOnline ? undefined : "white"}
                                size={20}
                              />
                            ) : (
                              <XCircle
                                color={user?.isOnline ? undefined : "white"}
                                size={20}
                              />
                            )
                          }
                          label={user?.isOnline ? "Online" : "Offline"}
                          color={user?.isOnline ? "success" : "default"}
                          sx={{
                            backgroundColor: user?.isOnline
                              ? undefined
                              : "grey.800",
                            color: user?.isOnline ? undefined : "white",
                          }}
                        />
                      </Stack>

                      <Stack direction={"row"} spacing={1}>
                        <ActionButton
                          sx={{ border: "2px solid green" }}
                          aria-label="edit"
                          onClick={() => {
                            dispatch(RESETSETSELECTEDUSER());
                            handleEdit(user?._id);
                          }}
                        >
                          <Pen color="green" />
                        </ActionButton>

                        <ActionButton
                          sx={{ border: "2px solid red" }}
                          aria-label="delete"
                          onClick={() => {
                            setSelectedUserID({
                              userID: user?._id,
                              userFirstname: user?.firstname,
                              userLastname: user?.lastname,
                            });
                            handleClickDelete();
                          }}
                        >
                          <Trash color="red" />
                        </ActionButton>
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"column"}
                      spacing={1}
                      alignItems={"center"}
                      p={0.5}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant={user?.isOnline && "dot"}
                      >
                        <StyledAvatar
                          src={user?.photo}
                          alt={user?.firstnamename}
                          sx={{
                            border: user?.isOnline
                              ? "2px solid green"
                              : "2px solid grey",
                          }}
                        />
                      </StyledBadge>

                      <Stack alignItems={"center"}>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            hyphens: "auto", // Enables automatic hyphenation
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {user?.firstname} {user?.lastname}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            hyphens: "auto", // Enables automatic hyphenation
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {user?.email}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "#f2f2f2"
                          : "rgba(239, 239, 240, 0.1)"
                      }
                      mx={1}
                      mt={2}
                      p={1}
                      px={2}
                      borderRadius={2}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            hyphens: "auto", // Enables automatic hyphenation
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          <GlobeHemisphereEast /> Country:{" "}
                          {user?.address?.country}
                        </Typography>
                        <Avatar
                          src={`https://flagcdn.com/w80/${user?.address?.countryFlag}.png`}
                          alt={user?.address?.country}
                          sx={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          hyphens: "auto", // Enables automatic hyphenation
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <Phone /> Phone: {user?.phone}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          hyphens: "auto", // Enables automatic hyphenation
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <Lock /> Password: {user?.password}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          hyphens: "auto", // Enables automatic hyphenation
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <CheckCircle /> Last seen:{" "}
                        {user?.lastSeen === null
                          ? "now"
                          : timeAgo(new Date(user?.lastSeen).getTime())}
                      </Typography>
                    </Stack>

                    <Box m={1}>
                      Joined on{" "}
                      {(() => {
                        const date = new Date(user?.createdAt);
                        return date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                      })()}
                    </Box>
                  </Box>
                </Grid>
              ))}
        </Grid>
      )}

      {size.width < 899 && (
        <StyledTableContainer component={Paper}>
          <Table aria-label="stylish user table">
            <StyledTableHead>
              <TableRow>
                <TableCell>
                  Users{" "}
                  {/* <Button size="small" variant="contained" startIcon={<ClockCounterClockwise size={18} />} sx={{borderRadius: "15px", height: "25px", display: {xs: "inline-fle", md: "none"}}}  onClick={() => dispatch(getAllUsers())}>REFRESH</Button> */}
                </TableCell>
                {/* <TableCell>Status</TableCell> */}
                {!isMobile && (
                  <>
                    <TableCell>Contact</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Status</TableCell>
                  </>
                )}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedUsers &&
                paginatedUsers
                  .filter((user) => user?.role !== "admin")
                  .map((user) => (
                    <StyledTableRow key={user?._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <StyledAvatar
                            src={user?.photo}
                            alt={user?.firstname}
                          />
                          <Box ml={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {user?.firstname} {user?.lastname}
                            </Typography>
                            {isMobile && (
                              <Typography variant="body2" color="textSecondary">
                                {shortenText(user?.email, 18)} | {user?.phone}
                              </Typography>
                            )}
                            {isMobile && (
                              <Chip
                                size="small"
                                icon={
                                  user?.isOnline ? (
                                    <CheckCircle
                                      color={
                                        user?.isOnline ? undefined : "white"
                                      }
                                      size={20}
                                    />
                                  ) : (
                                    <XCircle
                                      color={
                                        user?.isOnline ? undefined : "white"
                                      }
                                      size={20}
                                    />
                                  )
                                }
                                label={user?.isOnline ? "Online" : "Offline"}
                                color={user?.isOnline ? "success" : "default"}
                                sx={{
                                  backgroundColor: user?.isOnline
                                    ? undefined
                                    : "grey.800",
                                  color: user?.isOnline ? undefined : "white",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      {/* <TableCell>
                    
                  </TableCell> */}
                      {!isMobile && (
                        <>
                          <TableCell>
                            <Typography variant="body2">
                              {user?.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user?.phone}
                            </Typography>
                          </TableCell>
                          <TableCell>{user?.address?.country}</TableCell>
                          <TableCell>{12345}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={
                                user?.isOnline ? (
                                  <CheckCircle
                                    color={user?.isOnline ? undefined : "white"}
                                    size={20}
                                  />
                                ) : (
                                  <XCircle
                                    color={user?.isOnline ? undefined : "white"}
                                    size={20}
                                  />
                                )
                              }
                              label={user?.isOnline ? "Online" : "Offline"}
                              color={user?.isOnline ? "success" : "default"}
                              sx={{
                                backgroundColor: user?.isOnline
                                  ? undefined
                                  : "grey.800",
                                color: user?.isOnline ? undefined : "white",
                              }}
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          justifyContent={"flex-end"}
                          spacing={1}
                        >
                          <ActionButton
                            sx={{ border: "2px solid green" }}
                            aria-label="edit"
                            onClick={() => {
                              dispatch(RESETSETSELECTEDUSER());
                              handleEdit(user?._id);
                            }}
                          >
                            <Pen color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedUserID({
                                userID: user?._id,
                                userFirstname: user?.firstname,
                                userLastname: user?.lastname,
                              });
                              handleClickDelete();
                            }}
                          >
                            <Trash color="red" />
                          </ActionButton>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
          <Box display={{ xs: "flex", md: "flex" }} p={1} width={"100%"}>
            <TablePagination
              rowsPerPageOptions={[8, 12, 25]}
              component="div"
              count={filteredUsers.length} // Total count of items
              rowsPerPage={rowsPerPage} // Rows per page
              page={page} // Current page
              onPageChange={handleChangePage} // Handle page change
              onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
            />
          </Box>
        </StyledTableContainer>
      )}

      <Dialog
        open={openDeleteUserDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this user ${
            selectedUserID?.userFirstname + " " + selectedUserID?.userLastname
          } and all related data ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              deleteTrader();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
