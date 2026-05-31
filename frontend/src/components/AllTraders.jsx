import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
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
import UseWindowSize from "../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAddExpertTraderToUser,
  getAllExpertTraders,
  myExpertTrader,
} from "../redux/features/expertTraders/expertTradersSlice";
import { shortenText } from "../utils";
const AllTraders = () => {
  const [loading, setLoading] = useState(true);

  const size = UseWindowSize();

  const dispatch = useDispatch();

  const { isLoading, expertTraders } = useSelector(
    (state) => state.expertTraders
  );

  const { singleUser, user } = useSelector(
    (state) => state.auth
  );


  useEffect(() => {
    if (expertTraders.length === 0) {
      dispatch(getAllExpertTraders());
    }
  }, [dispatch]);

  const [expertTradersList, setExpertTradersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(expertTradersList)
    ? expertTradersList.filter(
        (expertTraders) =>
          expertTraders.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (expertTraders.length !== 0) {
      setExpertTradersList(expertTraders);
    }
  }, [expertTraders]);

  const [selectedTrader, setSelectedTrader] = useState(null);

  const handleCopyTrader = (expertTraderID) => {
    if(user?.role === "admin") {
    const formData = {
        expertTraderID,
        UserId: singleUser?._id
      }

      dispatch(adminAddExpertTraderToUser(formData));
    } else
    dispatch(myExpertTrader({ expertTraderID }));
    // console.log(expertTraderID)
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                Top Traders
              </Typography>
              <Typography variant="subtitle2" px={1}>
                copy any of our top traders
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="small"
              startIcon={<ClockCounterClockwise size={20} />}
              onClick={() => dispatch(getAllExpertTraders())}
            >
              {" "}
              Refresh
            </Button>
          </Stack>

          {expertTraders.length < 1 ? (
            <Stack mt={2} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No Trader Available</Typography>
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
              {expertTraders &&
                filteredAllCoins.map((experttrader, index) => (
                  <>
                    <Stack key={experttrader?._id} mb={{ xs: 0, md: 5 }}>
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
                              color: "white"
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
                                  setSelectedTrader(experttrader);
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
                            src={experttrader?.photo}
                            alt=""
                            onLoad={() => setLoading(false)}
                            onError={() => setLoading(false)}
                            width={"100%"}
                            height={"100%"}
                            style={{
                              borderRadius: "10px",
                              objectFit: "cover",
                              objectPosition: "top",
                              border: "1px solid grey"
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                      >
                        {experttrader?.firstname} {experttrader?.lastname}
                      </Typography>
                      <Typography fontWeight={"bold"}>
                        {shortenText(
                          experttrader?.email,
                          size.width < 600 ? 16 : 22
                        )}
                      </Typography>
                      <Stack direction={"row"} spacing={1}>
                        <Typography fontWeight={"bold"}>Win rate:</Typography>
                        <Typography> {experttrader?.winRate}</Typography>
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        <Typography fontWeight={"bold"}>
                          Profit Share
                        </Typography>
                        <Typography>{experttrader?.profitShare}</Typography>
                      </Stack>
                    </Stack>
                  </>
                ))}
            </Box>
          )}
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
            maxWidth: {xs: "95%", sm: "60%" , md: 450},
            maxHeight: "100%",
            overflow: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius:"10px",
            p: 2,
           
          }}
        >
          <Stack>
            <Box position={"relative"} border={"1px solid grey"} borderRadius={"10px"} overflow={"hidden"}>
              <Stack position={"absolute"} bottom={0} left={0} backgroundColor="black" p={"4px 8px"} >
              <Typography
              sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              variant="h5"
              fontWeight={700}
              color={"white"}
            >
              {selectedTrader?.firstname} {selectedTrader?.lastname}
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
                      handleCopyTrader(selectedTrader?._id);
                      handleClose();
                    }}
                  >
                    {user?.role === "admin" ? "Add Trader to User" : "Copy Trader"} 
                    
                  </Button>
                )
                }
                <Box
                  sx={{
                    backgroundColor: "grey",
                    p: "3px 4px 0px 4px",
                    cursor: "pointer",
                    color: "white"
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
              <Box height={{xs:"320px", sm: "450px", md: "420px"}}>
                <img
                  src={selectedTrader?.photo}
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
            <Typography fontWeight={"bold"} mt={1}>
             
              Email: {selectedTrader?.email}
            </Typography>

            
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Win rate:</Typography>
                <Typography> {selectedTrader?.winRate}</Typography>
              </Stack>
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Profit Share</Typography>
                <Typography>{selectedTrader?.profitShare}</Typography>
              </Stack>
              <Divider />
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Bio: {selectedTrader?.comment}</Typography>
               
              </Stack>
            
            </Stack>
          </Stack>
          
        </Box>
      </Modal>
    </>
  );
};

export default AllTraders;
