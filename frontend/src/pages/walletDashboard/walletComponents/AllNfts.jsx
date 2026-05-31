import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NftImage1 from "../../../assets/Ape_Monkey_king_2.jpg";
import NftImage2 from "../../../assets/Ape_Monkey_king_3.jpg";
import NftImage3 from "../../../assets/Ape_Monkey_king_4.jpg";
import { useEffect, useState } from "react";
import {
  adminAddNftToUser,
  getAllNfts,
} from "../../../redux/features/nftSettings/nftSettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import UseWindowSize from "../../../hooks/UseWindowSize";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import DepositDrawer from "../../../components/drawers/DepositDrawer";
import NftDepositDrawer from "../../../components/drawers/NftDepositDrawer";
const AllNfts = () => {
  const [loading, setLoading] = useState(true);

  const size = UseWindowSize();

  const dispatch = useDispatch();

  const { isLoading, allNfts } = useSelector((state) => state.nftSettings);

  const { singleUser, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (allNfts.length === 0) {
      dispatch(getAllNfts());
    }
  }, [dispatch]);

  const [nftList, setNftList] = useState([]);
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
    if (allNfts.length !== 0) {
      setNftList(allNfts);
    }
  }, [allNfts]);

  const [selectedNft, setSelectedNft] = useState(null);

  const handleAddNft = (nftID) => {
    if (user?.role === "admin") {
      const formData = {
        nftID,
        UserId: singleUser?._id,
      };

      // console.log(formData)

      dispatch(adminAddNftToUser(formData));
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Deposit Drawer

  const [depositLoader, setdepositLoader] = useState(false);
  const [openDepositDrawer, setOpenDepositDrawer] = useState(false);

  const handleOpenDepositDrawer = () => {
    setOpenDepositDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseDepositDrawer = () => {
    setOpenDepositDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  return (
    <>
      {isLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          height={size.height - 100}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <Stack mt={0}>
          <Box display={{ xs: "flex", md: "flex" }} mb={2} mt={1}>
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
                mt={2}
                px={1}
              >
                Top Nfts
              </Typography>
              <Typography variant="subtitle2" px={1}>
                List of all Nft
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="small"
              startIcon={<ClockCounterClockwise size={20} />}
              onClick={() => dispatch(getAllNfts(singleUser?.email))}
            >
              Refresh
            </Button>
          </Stack>

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
            {allNfts &&
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
                            sx={{ backgroundColor: "green", color: "white" }}
                            onClick={
                              () => {
                                setSelectedNft(nft);
                                handleOpen();
                              }
                              // handleCopyTrader(experttrader?._id)
                            }
                          >
                            View
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
                      <Box height={{ xs: "180px", sm: "370px", md: "250px" }}>
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
                      sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
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
        </Stack>
      )}

      <Modal
        open={open}
        onClose={handleClose}
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
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: "10px",
            p: 2,
          }}
        >
          <Stack>
            <Box
              position={"relative"}
              border={"1px solid grey"}
              borderRadius={"10px"}
              overflow={"hidden"}
            >
              <Stack
                position={"absolute"}
                bottom={0}
                left={0}
                backgroundColor="black"
                p={"4px 8px"}
              >
                <Typography
                  sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                  variant="h5"
                  fontWeight={700}
                  color={"white"}
                >
                  {selectedNft?.nftName}
                </Typography>
              </Stack>
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
                {loading ? (
                  ""
                ) : (
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "green", color: "white" }}
                    onClick={() => {
                      if (user?.role === "admin") {
                        handleAddNft(selectedNft?._id);
                      } else {
                        setdepositLoader(true);
                        handleOpenDepositDrawer();
                      }

                      handleClose();
                    }}
                  >
                    {user?.role === "admin"
                      ? "Add Nft to this User"
                      : "Buy Now"}
                  </Button>
                )}
                <Box
                  sx={{
                    backgroundColor: "grey",
                    p: "3px 4px 0px 4px",
                    cursor: "pointer",
                    color: "white",
                  }}
                  borderRadius={"50%"}
                  onClick={handleClose}
                >
                  <X size={28} />
                </Box>
              </Stack>
              {/* {loading && (
                        <Skeleton
                          variant="rectangle"
                          height={"100%"}
                          sx={{ borderRadius: "10px" }}
                        />
                      )} */}
              <Box height={{ xs: "320px", sm: "450px", md: "420px" }}>
                <img
                  src={selectedNft?.photo}
                  alt=""
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  width={"100%"}
                  height={"100%"}
                  style={{
                    borderRadius: "10px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {/* <Stack mb={1}>
              <Typography variant="h6" sx={{color: "springgreen", fontWeight: 600}}>About this trader</Typography>
            </Stack> */}

            <Divider />
            <Stack spacing={1}>
              {/* <Typography fontWeight={"bold"} mt={1}>
             
              Email: {selectedNft?.email}
            </Typography> */}

              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Price:</Typography>
                <Typography> {selectedNft?.nftPrice} ETH</Typography>
              </Stack>
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Nft Code</Typography>
                <Typography>{selectedNft?.nftCode} </Typography>
              </Stack>
              <Divider />
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>
                  Bio: {selectedNft?.comment}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <NftDepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
        selectednftPrice={selectedNft?.nftPrice}
      />
    </>
  );
};

export default AllNfts;
