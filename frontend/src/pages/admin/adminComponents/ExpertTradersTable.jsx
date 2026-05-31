import React, { useEffect, useState } from "react";
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
  styled,
  Button,
  Stack,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  Pen,
  Trash,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { shortenText } from "../../../utils";
import EditExpertTrader from "./drawers/EditExpertTrader";
import {
  deleteExpertTrader,
  getAllExpertTraders,
  SETSELECTEDEXPERTTRADER,
} from "../../../redux/features/expertTraders/expertTradersSlice";

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
  width: 150,
  height: 150,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function ExpertTradersTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { expertTraders } = useSelector((state) => state.expertTraders);



  const [expertTradersList, setExpertTradersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(expertTradersList) ? expertTradersList.filter((expertTraders) =>
    expertTraders.firstname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    expertTraders.lastname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    expertTraders.email.toLowerCase().includes(searchTerm.toLowerCase().trim())
  ) : [];
  



  useEffect(() => {
    if(expertTraders.length !== 0) {
      setExpertTradersList(expertTraders);
    }
  }, [expertTraders]);








  // EditExpertTrader Drawer

  const [expertTraderDrawerLoader, setExpertTraderDrawerLoader] =
    useState(false);

  const [openEditExpertTraderDrawer, setEditExpertTraderDrawer] =
    useState(false);

  const handleOpenEditExpertTraderDrawer = () => {
    setEditExpertTraderDrawer(true);
  };

  const handleCloseEditExpertTraderDrawer = () => {
    setEditExpertTraderDrawer(false);
  };

  // End EditExpertTrader Drawer

  // Delete Trader Drawer
  const [openDeleteTraderDrawer, setDeleteTraderDrawer] = useState(false);
  const [selectedTraderID, setSelectedTraderID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteTraderDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteTraderDrawer(false);
  };

  const deleteTrader = () => {
    // console.log(selectedTraderID.traderID)
    const id = selectedTraderID?.traderID;
    dispatch(deleteExpertTrader({ id }));
  };

  // End Delete Trader Drawer

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={1} mb={1}>
        <Box
          display={"flex"}
          border="2px solid grey"
          borderRadius={"20px"}
          height={"35px"}
          width={{ xs: "70%", md: "200px" }}
        >
          <IconButton type="button" sx={{ p: 1, pr: 0 }}>
            <MagnifyingGlass />
          </IconButton>
          <InputBase
            sx={{ ml: 2, width: "100%" }}
            placeholder="Search Trader"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Button
          startIcon={<ClockCounterClockwise size={22} />}
          variant="contained"
          size="small"
          sx={{ borderRadius: "30px", fontWeight: 700 }}
          onClick={() => {
            dispatch(getAllExpertTraders());
          }}
        >
          {" "}
          Refresh
        </Button>
      </Stack>
      <StyledTableContainer component={Paper}>
        <Table aria-label="stylish user table">
          <StyledTableHead>
            <TableRow>
              <TableCell>
                Expert Trader
                <IconButton size="small" sx={{ backgroundColor: "darkgreen" }}>
                  <ClockCounterClockwise />
                </IconButton>
              </TableCell>
              {/* <TableCell>Status</TableCell> */}
              {!isMobile && (
                <>
                  <TableCell>Email</TableCell>
                  <TableCell>Win Rate</TableCell>
                  <TableCell>Profit Share</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {expertTraders &&
              filteredAllCoins.map((trader) => (
                <StyledTableRow key={trader?._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StyledAvatar
                        src={trader?.photo}
                        alt={trader?.firstname}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {trader?.firstname} {trader?.lastname}
                        </Typography>
                        {isMobile && (
                          <>
                            <Typography variant="body1" color="textSecondary">
                              {shortenText(trader?.email, 18)}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Win Rate: {trader?.winRate}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Profit Share: {trader?.profitShare}
                            </Typography>
                            <Stack
                              direction={"row"}
                              justifyContent={"flex-start"}
                              spacing={1}
                              mt={1}
                            >
                              <ActionButton
                                sx={{ border: "2px solid green" }}
                                aria-label="edit"
                                onClick={() => {
                                  // dispatch(RESET_SETEXPERTTRADER());
                                  dispatch(SETSELECTEDEXPERTTRADER(trader));
                                  setExpertTraderDrawerLoader(true);
                                  handleOpenEditExpertTraderDrawer();
                                }}
                              >
                                <Pen color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedTraderID({
                                    traderID: trader?._id,
                                    traderFirstname: trader?.firstname,
                                    traderLastname: trader?.lastname,
                                  });
                                  handleClickDelete();
                                }}
                              >
                                <Trash color="red" />
                              </ActionButton>
                            </Stack>
                          </>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                  <Chip
                    label={user?.status}
                    color={user?.status === 'online' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell> */}
                  {!isMobile && (
                    <>
                      <TableCell>
                        <Typography variant="body1">{trader?.email}</Typography>
                      </TableCell>
                      <TableCell>{trader?.winRate}</TableCell>
                      <TableCell>{trader?.profitShare}</TableCell>
                      <TableCell>{trader?.comment}</TableCell>

                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          justifyContent={"flex-end"}
                          spacing={1}
                        >
                          <ActionButton
                            sx={{ border: "2px solid green" }}
                            aria-label="edit"
                            // onClick={() => {
                            //   dispatch(RESETSETSELECTEDUSER());
                            //   handleEdit(trader?._id);
                            // }}

                            onClick={() => {
                              // dispatch(RESET_SETEXPERTTRADER());
                              dispatch(SETSELECTEDEXPERTTRADER(trader));
                              setExpertTraderDrawerLoader(true);
                              handleOpenEditExpertTraderDrawer();
                            }}
                          >
                            <Pen color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedTraderID({
                                traderID: trader?._id,
                                traderFirstname: trader?.firstname,
                                traderLastname: trader?.lastname,
                              });
                              handleClickDelete();
                            }}
                          >
                            <Trash color="red" />
                          </ActionButton>
                        </Stack>
                      </TableCell>
                    </>
                  )}
                </StyledTableRow>
              ))}
            <Box p={2}>Pagination</Box>
          </TableBody>
        </Table>
      </StyledTableContainer>

      <EditExpertTrader
        open={openEditExpertTraderDrawer}
        handleClose={handleCloseEditExpertTraderDrawer}
        handleOpen={handleOpenEditExpertTraderDrawer}
        expertTraderDrawerLoader={expertTraderDrawerLoader}
        setExpertTraderDrawerLoader={setExpertTraderDrawerLoader}
      />

      <Dialog
        open={openDeleteTraderDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete Trader ${
            selectedTraderID?.traderFirstname +
            " " +
            selectedTraderID?.traderLastname
          } ?`}
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
