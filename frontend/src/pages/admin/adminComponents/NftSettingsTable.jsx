import{ useEffect, useState } from "react";
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
import { deleteNft, getAllNfts, SETSELECTEDNFT } from "../../../redux/features/nftSettings/nftSettingsSlice";
import EditNft from "./drawers/EditNft";

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
  borderRadius: "15px"

}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export default function NftSettingsTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { allNfts } = useSelector((state) => state.nftSettings);



  const [nftList, setExpertTradersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllNfts = Array.isArray(nftList) ? nftList.filter((nft) =>
    nft.nftName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    nft.comment.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    nft.nftCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    String(nft.nftPrice).toLowerCase().includes(searchTerm.toLowerCase().trim()) 
  ) : [];
  

  useEffect(() => {
    if(allNfts.length !== 0) {
      setExpertTradersList(allNfts);
    }
  }, [allNfts]);



  // EditNft Drawer

  const [nftDrawerLoader, setNftDrawerLoader] =
    useState(false);

  const [openEditNftDrawer, setEditNftDrawer] =
    useState(false);

  const handleOpenEditNftDrawer = () => {
    setEditNftDrawer(true);
  };

  const handleCloseEditNftDrawer = () => {
    setEditNftDrawer(false);
  };

  // End EditExpertTrader Drawer



  // Delete Nft Drawer
  const [openDeleteNftDrawer, setDeleteNftDrawer] = useState(false);
  const [selectedNftID, setSelectedNftID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteNftDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteNftDrawer(false);
  };

  const deleteNftNow = () => {
    // console.log(selectedNftID.nftID)
    const id = selectedNftID?.nftID;
    dispatch(deleteNft({ id }));
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
            placeholder="Search Nfts"
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
            dispatch(getAllNfts());
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
                All Nfts
                {/* <IconButton size="small" sx={{ backgroundColor: "darkgreen" }}>
                  <ClockCounterClockwise />
                </IconButton> */}
              </TableCell>
              {/* <TableCell>Status</TableCell> */}
              {!isMobile && (
                <>
                  <TableCell>nftPrice</TableCell>
                  <TableCell>nftCode</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {allNfts &&
              filteredAllNfts.map((nft) => (
                <StyledTableRow key={nft?._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StyledAvatar
                        src={nft?.photo}
                        alt={nft?.nftName}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {nft?.nftName} 
                        </Typography>
                        {isMobile && (
                          <>
                           
                            <Typography variant="body1" color="textSecondary">
                              Price: {nft?.nftPrice} ETH
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              Nft Code: {nft?.nftCode}
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
                                  dispatch(SETSELECTEDNFT(nft));
                                  setNftDrawerLoader(true);
                                  handleOpenEditNftDrawer();
                                }}
                              >
                                <Pen color="green" />
                              </ActionButton>

                              <ActionButton
                                sx={{ border: "2px solid red" }}
                                aria-label="delete"
                                onClick={() => {
                                  setSelectedNftID({
                                    nftID: nft?._id,
                                    nftName: nft?.nftName,
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
                     
                      <TableCell>{nft?.nftPrice} ETH</TableCell>
                      <TableCell>{nft?.nftCode}</TableCell>
                      <TableCell>{nft?.comment}</TableCell>

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
                              dispatch(SETSELECTEDNFT(nft));
                              setNftDrawerLoader(true);
                              handleOpenEditNftDrawer();
                            }}
                          >
                            <Pen color="green" />
                          </ActionButton>

                          <ActionButton
                            sx={{ border: "2px solid red" }}
                            aria-label="delete"
                            onClick={() => {
                              setSelectedNftID({
                                nftID: nft?._id,
                                nftName: nft?.nftName,
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

      <EditNft
        open={openEditNftDrawer}
        handleClose={handleCloseEditNftDrawer}
        handleOpen={handleOpenEditNftDrawer}
        nftDrawerLoader={nftDrawerLoader}
        setNftDrawerLoader={setNftDrawerLoader}
      />

      <Dialog
        open={openDeleteNftDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this NFT ${
            selectedNftID?.nftName
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
              deleteNftNow();
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
