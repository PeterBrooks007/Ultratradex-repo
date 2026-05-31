import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import {
  admingetUserExpertTrader,
  adminRemoveUserExpertTraderCopied,
  getAllExpertTraders,
  getMyExpertTrader,
  removeMyExpertTrader,
} from "../../../redux/features/expertTraders/expertTradersSlice";
import { useParams } from "react-router-dom";
import {
  admingetUserNfts,
  adminRemoveUserNft,
  getMyNfts,
  userReSellNft,
} from "../../../redux/features/nftSettings/nftSettingsSlice";
import UseWindowSize from "../../../hooks/UseWindowSize";

const MyNfts = () => {
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const size = UseWindowSize();

  const dispatch = useDispatch();

  const { isLoading, myNfts } = useSelector((state) => state.nftSettings);

  const { user } = useSelector((state) => state.auth);

  const { singleUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (singleUser && user?.role === "admin") {
      dispatch(admingetUserNfts(singleUser?.email));
    } else {
      dispatch(getMyNfts());
    }
  }, [dispatch, singleUser?.email, singleUser, user?.role]);

  const [nftList, setExpertTradersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(nftList)
    ? nftList.filter(
        (nft) =>
          nft.nftName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          nft.nftCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          String(nft.nftPrice)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (myNfts.length !== 0) {
      setExpertTradersList(myNfts);
    }
  }, [myNfts]);

  const handleRemovenft = (id) => {
    const formData = {
      email: singleUser?.email,
    };
    dispatch(adminRemoveUserNft({ id, formData }));
    // console.log({id})
  };

  const [selectedNft, setSelectedNft] = useState(null);
  const [openAddWalletMoodal, setOpenAddWalletModal] = useState(false);
  const handleOpenAddWalletModal = () => setOpenAddWalletModal(true);
  const handleCloseAddWalletModal = () => setOpenAddWalletModal(false);

  // console.log({ selectedNft });

  const [value, setValue] = useState(0);
  // console.log(value);

  const handleResell = () => {
    const formData = {
      email: user?.email,
      nftName: selectedNft?.nftName + " " + "ETH",
      nftPrice: selectedNft?.nftPrice + " " + "ETH",
      sellingPrice: value, 
    };
    dispatch(userReSellNft({ id, formData }));
    // console.log({formData})
  }

  return (
    <>
      {isLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <Stack mt={1}>
          <Box display={{ xs: "flex", md: "flex" }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="calculator" edge="end">
                      <MagnifyingGlass />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "20px",
                },
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack>
              <Typography
                variant={size.width < 600 ? "h5" : "h4"}
                fontWeight={800}
                mt={3}
                px={1}
              >
                User Nft
              </Typography>
              <Typography variant="subtitle2" px={1}>
                List of all Nft this user owned
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="small"
              startIcon={<ClockCounterClockwise size={20} />}
              onClick={() => {
                if (user?.role === "admin") {
                  dispatch(admingetUserNfts(singleUser?.email));
                } else {
                  dispatch(getMyNfts());
                }
              }}
            >
              Refresh
            </Button>
          </Stack>

          {myNfts.length < 1 ? (
            <Stack mt={2} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No Nft Available</Typography>
            </Stack>
          ) : (
           
              <Box
                mt={2}
                display={"flex"}
                gap={2}
                rowGap={{ xs: 1, sm: 24, md: 5 }}
                flexWrap={"wrap"}
                justifyContent={"center"}
                sx={{
                  "& > div": {
                    width: { xs: "47%", md: "230px" },
                    height: "330px",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {myNfts &&
                  filteredAllCoins.map((nft, index) => (
                    <>
                      <Stack key={nft?._id} mb={{ xs: 0, md: 5 }}>
                        <Box position={"relative"}>
                          <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"flex-start"}
                            position={"absolute"}
                            top={0}
                            width={"100%"}
                            height={"220px"}
                            p={0.5}
                          >
                            <Box
                              sx={{
                                backgroundColor: "rgba(0,0,0, 0.3)",
                                p: "1px 8px",
                                color: "white",
                              }}
                              borderRadius={"50%"}
                            >
                              {index + 1}
                            </Box>
                            {loading ? (
                              ""
                            ) : (
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "green",
                                  color: "white",
                                }}
                                onClick={() => {
                                  if (user?.role === "admin") {
                                    handleRemovenft(nft?._id);
                                  } else {
                                    setSelectedNft(nft);
                                    handleOpenAddWalletModal();
                                  }
                                }}
                              >
                                {user?.role === "admin" ? "Remove" : "Sell Nft"}
                              </Button>
                            )}
                          </Stack>
                          {/* {loading && (
                             <Skeleton
                               variant="rectangle"
                               height={"100%"}
                               sx={{ borderRadius: "10px" }}
                             />
                           )} */}
                          <Box
                            height={{ xs: "180px", sm: "370px", md: "250px" }}
                          >
                            <img
                              src={nft?.photo}
                              alt=""
                              onLoad={() => setLoading(false)}
                              onError={() => setLoading(false)}
                              width={"100%"}
                              height={"100%"}
                              style={{
                                borderRadius: "10px",
                                objectFit: "cover",
                                objectPosition: "top",
                                border: "1px solid grey",
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {nft?.nftName}
                        </Typography>
                        {/* <Typography fontWeight={"bold"}>
                             {shortenText(
                               experttrader?.email,
                               size.width < 600 ? 16 : 22
                             )}
                           </Typography> */}
                        <Stack direction={"row"} spacing={1}>
                          <Typography fontWeight={"bold"}>Code:</Typography>
                          <Typography> {nft?.nftCode}</Typography>
                        </Stack>
                        <Stack direction={"row"} spacing={1}>
                          <Typography fontWeight={"bold"}>Price</Typography>
                          <Typography>{nft?.nftPrice} ETH</Typography>
                        </Stack>
                      </Stack>
                    </>
                  ))}
              </Box>
            
          )}
        </Stack>
      )}

      <Modal
        open={openAddWalletMoodal}
        onClose={handleCloseAddWalletModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: { xs: "95%", sm: "60%", md: 450 },
            maxHeight: "100%",
            overflow: "auto",
            bgcolor: "background.paper",
            border: "2px solid grey",
            boxShadow: 24,
            borderRadius: "10px",
            // p: 2,
          }}
        >
          <Stack spacing={1}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              px={2}
              pt={2}
            >
              <Typography sx={{ pb: 0.5 }} variant="h6" fontWeight={"bold"}>
                Sell this Nft
              </Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <IconButton
                  size="small"
                  sx={{ border: "1px solid grey" }}
                  onClick={handleCloseAddWalletModal}
                >
                  <X />
                </IconButton>
              </Stack>
            </Stack>
            <Divider flexItem />

            <Stack p={2} alignItems={"center"} spacing={1}>
              <Typography textAlign={"center"}>
                I confirmed that i {`( ${user?.firstname} ${user?.lastname} )`}{" "}
                wants to resell my collection of nft.
              </Typography>

              <Stack alignItems={"center"}>
                <img width={160} src={selectedNft?.photo} alt="" />
                <Typography>Name: {selectedNft?.nftName}</Typography>
                <Typography>Price: {selectedNft?.nftPrice} ETH</Typography>
                <Typography>Code: {selectedNft?.nftCode}</Typography>
              </Stack>

              <Divider flexItem />

              <Stack spacing={1} alignItems={"center"}>
                <InputLabel htmlFor="my-input">Amount Selling for ?</InputLabel>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <OutlinedInput
                  fullWidth
                    name="close"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="ETH Amount"
                    size="small"
                    endAdornment={
                      <Typography>ETH</Typography>
                    }
                  
                  />
                  <Button variant="contained" onClick={() => {
                    handleCloseAddWalletModal()
                    handleResell()
                  } }>Sell</Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default MyNfts;
