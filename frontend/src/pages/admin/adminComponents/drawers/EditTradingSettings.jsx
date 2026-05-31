import  { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DOMPurify from "dompurify"; // Use DOMPurify to sanitize input
import {
  AppBar,
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Stack,
  TablePagination,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, Camera, MagnifyingGlass, Moon, Pen, PlusCircle, Sun, Trash, X, XCircle } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { addTradingPairs, DeleteArrayTradingPairs, updateTradingSetting, updateTradingSettingPhoto } from "../../../../redux/features/tradingSettings/tradingSettingsSlice";



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: "auto"
};

const EditTradingSettings = ({
  open,
  handleClose,
  handleOpen,
  tradeSettingsDrawerLoader,
  setTradeSettingsDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { isSemiLoading, exchange } = useSelector(
    (state) => state.tradingSettings
  );

  useEffect(() => {
    if (tradeSettingsDrawerLoader) {
      const timer = setTimeout(() => {
        setTradeSettingsDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tradeSettingsDrawerLoader, setTradeSettingsDrawerLoader]);

  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    exchangeType: exchange?.exchangeType || "",
    photo: exchange?.photo || "",
  };


   // Helper function to decode HTML entities
function decodeEntities(encodedString) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedString;
  return textarea.value;
}

  // Custom yup method to sanitize and check for malicious input
  yup.addMethod(yup.string, "sanitize", function () {
    return this.test("sanitize", "Invalid input detected!", function (value) {
      const decodedValue = decodeEntities(value);

      const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
      if (sanitizedValue !== decodedValue) {
        // toast.error('Input contains invalid or malicious content!');
        return false; // Fail the validation
      }
      return true; // Pass the validation
    });
  });

  const userSchema = yup.object().shape({
    exchangeType: yup
      .string()
      .sanitize()
      .required("exchangeType is required")
      .min(2, "exchangeType must be at least 2 characters long")
      .max(100, "exchangeType cannot exceed 100 characters"),
    
  });



  const [formData, setFormData] = useState(initialState);

  // console.log(formData)


  const { exchangeType, photo } =
    formData;

  useEffect(() => {
    if (exchange) {
      setFormData({
        exchangeType: exchange?.exchangeType || "",
        photo: exchange?.photo || "",
      });
    }
  }, [exchange]);



  const handleFormSubmit = async (values) => {

    const userData = values;

    const id = exchange?._id;


    await dispatch(updateTradingSetting({ id, userData }));
    // console.log(id, userData)

  };


  const [uploadLoading, setUploadLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };


  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  const savePhoto = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
  
    try {
      if (profileImage !== null) {
        // Check if the file is an allowed image type
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(profileImage.type)) {
          toast.error("Invalid file type. Only JPEG and PNG are allowed.");
          setUploadLoading(false);
          return;
        }
  
        // Check if the file size exceeds the limit
        if (profileImage.size > MAX_FILE_SIZE) {
          toast.error("File size exceeds the 5MB limit.");
          setUploadLoading(false);
          return;
        }
  
       
  
        // Check if the compressed file is a valid image by loading it
        const imageLoadCheck = new Promise((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(profileImage);
          img.onload = () => resolve(true);
          img.onerror = () => reject(false);
        });
  
        const isValidImage = await imageLoadCheck;
        if (!isValidImage) {
          toast.error("The file is not a valid image.");
          setUploadLoading(false);
          return;
        }
  
        // If all checks pass, proceed with the upload
        const formData = new FormData();
        formData.append("image", profileImage);
  
        const id = exchange?._id;
  
        dispatch(updateTradingSettingPhoto({ id, formData }));

        // console.log(id, formData)
  
        // Reset the image preview and loading state
        setImagePreview(null);
        setUploadLoading(false);
      } else {
        toast.error("No image selected.");
        setUploadLoading(false);
      }
    } catch (error) {
      setUploadLoading(false);
      toast.error(error.message);
    }
  };

  const [openPairs, setOpenPairs] = useState(false);
  const handleOpenPairs = () => setOpenPairs(true);
  const handleClosePairs = () => setOpenPairs(false);

  const [selectedAddPairs, setSelectedAddPairs] = useState(new Set());
  const [inputValue, setInputValue] = useState("");
  const [notification, setNotification] = useState("");
  const MAX_LIMIT = 50;

  const handleAddPair = () => {
    if (selectedAddPairs.size >= MAX_LIMIT) {
      setNotification(
        "Maximum limit reached. You can only add 50 pairs at a time."
      );
      setTimeout(() => setNotification(""), 10000); // Clear notification after 10 seconds
      return;
    }

    if (inputValue.trim()) {
      const trimmedInput = inputValue.trim().toUpperCase();

      // Check if the pair already exists in `exchange.tradingPairs` array
      if (exchange?.tradingPairs?.includes(trimmedInput)) {
        setNotification(
          `The pair "${trimmedInput}" already exists in the trading pairs database.`
        );
        setTimeout(() => setNotification(""), 10000); // Clear notification after 10 seconds
        return;
      }

      if (selectedAddPairs.has(trimmedInput)) {
        setNotification(
          `The pair "${trimmedInput}" is already added to the list of add pairs.`
        );
        setTimeout(() => setNotification(""), 10000); // Clear notification after 10 seconds
        return;
      }

      const updatedSelection = new Set(selectedAddPairs);
      updatedSelection.add(trimmedInput); // Add the input value to the set
      setSelectedAddPairs(updatedSelection);
      setInputValue(""); // Clear the input field after adding
    }
  };

  const handleClearAll = () => {
    setSelectedAddPairs(new Set()); // Clear all items from the set
  };

  const handleRemovePair = (pair) => {
    const updatedSelection = new Set(selectedAddPairs);
    updatedSelection.delete(pair); // Remove the specified pair from the set
    setSelectedAddPairs(updatedSelection);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUploadPairs = () => {
    const id = exchange?._id;
    // Convert the Set to an array
    const tradingPairsArray = [...selectedAddPairs];

    dispatch(addTradingPairs({ id, tradingPairsArray }));
    setSelectedAddPairs(new Set());
    handleClosePairs()
    // console.log({ id, tradingPairsArray });
  };


  const [selectedExchanges, setSelectedExchanges] = useState([]);
  // console.log(selectedExchanges)


  const handleSelectExchanges = (pair) => {
    const alreadySelected = selectedExchanges.includes(pair);
  
    if (alreadySelected) {
      // Remove from selection if already selected
      setSelectedExchanges(
        selectedExchanges.filter((id) => id !== pair)
      );
    } else {
      // Add to selection if not already selected
      setSelectedExchanges([...selectedExchanges, pair]);
    }
  };


  //Start Master check Delete
  // Determine if all trading pairs are selected
const isAllSelected = exchange?.tradingPairs?.length > 0 && 
exchange.tradingPairs.every((pair) => selectedExchanges.includes(pair));


// Handle master selection/deselection
const handleSelectAllExchanges = (e) => {
  if (e.target.checked) {
    // Select all trading pairs
    setSelectedExchanges(exchange.tradingPairs);
  } else {
    // Deselect all trading pairs
    setSelectedExchanges([]);
  }
};

const handleMasterDelete =  () => {
  const id = exchange?._id;
  const tradingPairsArray = [...selectedExchanges];

  dispatch(DeleteArrayTradingPairs({ id, tradingPairsArray }));
  setSelectedExchanges([]);
  // console.log({ id, tradingPairsArray });
};

 //End of Master check Delete


 
 const [pairList, setTradingBotsList] = useState([]);
 const [searchTerm, setSearchTerm] = useState("");

 const filteredExchangePairs = exchange?.tradingPairs &&  Array.isArray(pairList)
   ? exchange?.tradingPairs?.filter((exchange) =>
     exchange?.toLowerCase().includes(searchTerm.toLowerCase().trim())
     )
   : [];
   

 useEffect(() => {
   if (exchange?.tradingPairs !== 0) {
     setTradingBotsList(exchange?.tradingPairs);
   }
 }, [exchange]);


 //start of pagination
   // Define state for pagination
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(24); // Default rows per page
 
   // Handle page change
   const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };
 
   // Handle rows per page change
   const handleChangeRowsPerPage = (event) => {
     setRowsPerPage(parseInt(event.target.value, 10)); // Set rows per page
     setPage(0); // Reset to first page
   };
 
   // Calculate the current data slice
   const paginatedWallet = filteredExchangePairs.slice(
     page * rowsPerPage,
     page * rowsPerPage + rowsPerPage
   );
   //end of pagination





  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        setImagePreview(null);
        handleClose();
      }}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "550px" },
        },
      }}
    >
      {tradeSettingsDrawerLoader || isSemiLoading ? (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: `${
                theme.palette.mode === "light"
                  ? "lightgrey"
                  : colors.dashboardbackground[100]
              }`,
              top: 0,
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
              <IconButton
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, backgroundColor: "grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Edit Exchange
              </Typography>
            </Toolbar>
          </AppBar>

          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <CircularProgress />
          </Stack>
        </Box>
      ) : (
        <Box
          backgroundColor={colors.dashboardforeground[100]}
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
        >
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: `${
                theme.palette.mode === "light"
                  ? "lightgrey"
                  : colors.dashboardbackground[100]
              }`,
              top: 0,
              height: "56px",
            }}
            color="grey"
          >
            <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
              <IconButton
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, backgroundColor: "grey" }}
                onClick={handleClose}
                size="small"
              >
                <ArrowLeft size={26} />
              </IconButton>
              <Typography variant="body1" color="inherit" component="div">
                Edit Exchange
              </Typography>
            </Toolbar>
          </AppBar>

          <Box p={2}>
            <Stack direction={"row"} justifyContent={"space-between"} pb={2}>
              <Typography variant="body1" fontWeight={"bold"}>
                Edit this Exchange
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#009e4a", color: "white" }}
                onClick={() => setIsEditing(true)}
              >
                Edit Exchange
              </Button>
            </Stack>

            <Divider flexItem />

            <Stack
              direction={"row"}
              alignItems={"center"}
              p={"10px"}
              spacing={1}
            >
              <Badge
                onClick={handleButtonClick}
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }} // Hide the file input
                      onChange={handleImageChange}
                    />
                    <IconButton>
                      <Camera size={35} weight="bold" />
                    </IconButton>
                  </>
                }
              >
                <img
                  src={imagePreview === null ? photo : imagePreview}
                  alt="profileimage"
                  width={"120px"}
                  height={"120px"}
                  style={{
                    border: "4px solid grey",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Badge>

              <Stack>
                <Typography variant="h6" fontWeight={"600"}>
                  {exchangeType.toUpperCase()} Exchange
                </Typography>
                <Typography variant="subtitle2">
                  Click the image to change exchange icon image
                </Typography>
              </Stack>
            </Stack>
            {imagePreview !== null && (
              <Box spacing={0.5} mb={3}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={savePhoto}
                  disabled={uploadLoading && true}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "grey",
                      color: "white",
                    },
                  }}
                >
                  {uploadLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "UPLOAD PHOTO"
                  )}
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setImagePreview(null)}
                  sx={{ ml: 1 }}
                >
                  <X size={20} /> Cancel upload
                </Button>
              </Box>
            )}
            <Divider />
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={formData}
              validationSchema={userSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2} mt={2}>
                    <Stack direction={"row"} spacing={2}>
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        type="text"
                        label="Exchange Type"
                        name="exchangeType"
                        value={values.exchangeType}
                        error={!!touched.exchangeType && !!errors.exchangeType}
                        helperText={touched.exchangeType && errors.exchangeType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        disabled={!isEditing && true}
                        inputProps={{ maxLength: 101 }}
                      />
                    </Stack>

                    <Button
                      fullWidth
                      color="inherit"
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "text.primary",
                        borderRadius: "10px",
                        padding: "15px",
                        fontWeight: "600",
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "common.white"
                            : "grey.800",
                        "&:hover": {
                          bgcolor: "text.primary",
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "common.whitw"
                              : "grey.800",
                        },
                      }}
                      disabled={isSemiLoading || (!isEditing && true)}
                    >
                      {isSemiLoading ? (
                        <CircularProgress size={28} />
                      ) : (
                        "Make Changes"
                      )}
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Box>

          <Stack m={2} mt={1}>
            <Stack
              py={2}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              <Typography variant="h6">
                {exchangeType.toUpperCase()} PAIRS{" "}
              </Typography>

              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Tooltip title="Select" arrow>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllExchanges}
                  />
                </Tooltip>

                <IconButton
                  size="small"
                  sx={{ display: selectedExchanges.length === 0 && "none" }}
                  onClick={handleMasterDelete}
                >
                  <Trash size={28} />
                </IconButton>

                <Button
                  startIcon={<PlusCircle size={22} />}
                  size="small"
                  variant="outlined"
                  onClick={handleOpenPairs}
                >
                  Add
                </Button>
              </Stack>
            </Stack>

            <Box
              display={"flex"}
              border="1px solid grey"
              borderRadius={"20px"}
              height={"35px"}
              width={{ xs: "100%", md: "100%" }}
              // mx={2}
            >
              <IconButton type="button" sx={{ p: 1, pr: 0 }}>
                <MagnifyingGlass />
              </IconButton>
              <InputBase
                sx={{ ml: 2, width: "100%" }}
                placeholder={`Search ${exchangeType}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            <Grid container spacing={2} columns={12} py={2}>
              {paginatedWallet?.map((pair) => (
                <Grid item xs={6} md={4} key={pair}>
                  <Box
                    sx={{ flexGrow: 1 }}
                    backgroundColor={`${colors.dashboardbackground[100]}`}
                    boxShadow={
                      theme.palette.mode === "light" && `${theme.shadows[2]}`
                    }
                    p={"2px 5px"}
                    borderRadius={"10px"}
                  >
                    <Stack
                      direction={{ xs: "row", md: "row" }}
                      spacing={0.5}
                      alignItems={"center"}
                    >
                      <Checkbox
                        checked={!!selectedExchanges.includes(pair)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleSelectExchanges(pair)}
                      />

                      <Stack>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            hyphens: "auto", // Enables automatic hyphenation
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {pair}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Stack backgroundColor="green">
              <TablePagination
                rowsPerPageOptions={[12, 24, 48]}
                component="div"
                count={filteredExchangePairs.length} // Total count of items
                rowsPerPage={rowsPerPage} // Rows per page
                page={page} // Current page
                onPageChange={handleChangePage} // Handle page change
                onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
              />
            </Stack>
          </Stack>
        </Box>
      )}

      <Modal
        open={openPairs}
        onClose={handleClosePairs}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Pairs for {exchangeType.toUpperCase()} Exchange
          </Typography>
          <Typography variant="subtitle2" component="h2">
            You can add up to 50 per request
          </Typography>

          {/* Notification message */}
          {notification && (
            <Typography color="error" mt={2}>
              {notification}
            </Typography>
          )}

          {/* Display selected pairs */}
          <Box
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            flexWrap={"wrap"}
            mt={2}
          >
            {Array.from(selectedAddPairs).map((pair) => (
              <Stack
                key={pair}
                direction="row"
                alignItems="center"
                spacing={1}
                border={"1px solid grey"}
                p={0.5}
                borderRadius={"10px"}
              >
                <div>{pair}</div>

                <XCircle size={22} onClick={() => handleRemovePair(pair)} />
              </Stack>
            ))}
          </Box>

          <Stack
            mt={2}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={1}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="text"
              label="Exchange Type"
              name="exchangeType"
              value={inputValue}
              onChange={handleInputChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              inputProps={{ maxLength: 101 }}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddPair}
            >
              ADD
            </Button>
            <Button
              variant="contained"
              // color="secondary"
              onClick={handleClearAll}
            >
              Clear
            </Button>
          </Stack>

          <Stack mt={6}>
            <Button
              disabled={selectedAddPairs.size === 0}
              variant="contained"
              onClick={handleUploadPairs}
            >
              Upload Pairs
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default EditTradingSettings;
