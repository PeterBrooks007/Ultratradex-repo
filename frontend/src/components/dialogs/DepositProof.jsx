import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Stack,
} from "@mui/material";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import {
  depositFund,
  getUserDeposithistory,
} from "../../redux/features/deposit/depositSlice";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Camera, Image, X } from "@phosphor-icons/react";
import proofIcon from "../../assets/proof_image.jpg"
import zIndex from "@mui/material/styles/zIndex";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const initialState = {
  amount: "",
  depositProof: "",
};

const DepositProof = ({ open, handleClose, amount, Wallet, handleOpen, savedSession }) => {
  const size = UseWindowSize();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialState);
  const { depositProof } = formData;
  const { user } = useSelector((state) => state.auth);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      amount: savedSession?.amountFiat,
      method: savedSession?.walletName,
      typeOfDeposit: savedSession?.typeOfDeposit,
      methodIcon: savedSession?.walletPhoto,

    };
    // setFormData(values);

    if (!profileImage) {
      return toast.error("Please add a proof of depost photo");
    }

    console.log("form data", userData);
    //  console.log("photo", profileImage);

    if (userData && profileImage !== null) {
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

          // // Check if the image is valid by loading it
          // const imageLoadCheck = new Promise((resolve, reject) => {
          //   const img = new Image();
          //   img.src = URL.createObjectURL(profileImage);
          //   img.onload = () => resolve(true);
          //   img.onerror = () => reject(false);
          // });

          // const isValidImage = await imageLoadCheck;
          // if (!isValidImage) {
          //   toast.error("The file is not a valid image.");
          //   setUploadLoading(false);
          //   return;
          // }

          // If all checks pass, proceed with the upload
          const formData = new FormData();
          formData.append("image", profileImage); // Use the original image
          formData.append("userData", JSON.stringify(userData));

          // Dispatch the formData including both image and userData
          await dispatch(depositFund(formData));
          await dispatch(getUserDeposithistory());

          // console.log(formData)

          // Reset the image preview and loading state
          setFormData(initialState);
          handleClose()
          setUploadLoading(false);
        } else {
          toast.error("No image selected.");
          setUploadLoading(false);
        }
      } catch (error) {
        setUploadLoading(false);
        toast.error(error.message);
        // console.log(error)
      }
    } else {
      setUploadLoading(false);
      toast.error("An error occurred");
    }
  };

  return (
    <Modal open={open} onClose={() => {
      handleClose()
      setImagePreview(null)
      

    }}
    sx={{zIndex: 1402}}
    >
      <Stack
        spacing={1.5}
        component={Paper}
        // border={"1px solid grey"}
        borderRadius={"10px"}
        p={"16px 16px"}
        sx={{ wordWrap: "break-word" }}
        style={style}
        width={size.width <= 899 ? "95%" : 600}
        maxHeight={size.width <= 899 ? "90vh" : "95%"}
        overflow={"auto"}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={1}>
            <Stack justifyContent={"center"}>
              <Image size={34} />
            </Stack>
            <Typography variant="h6" fontWeight={"600"}>
              Proof of deposit
            </Typography>
          </Stack>
          <IconButton
          size="small"
            sx={{ border: "1px solid grey"}}
            onClick={handleClose}
          >
            <X size={20} color="grey" />
          </IconButton>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography color={"orange"}>Upload a proof of your deposit.</Typography>

          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">Type of deposit</InputLabel>
            <OutlinedInput
              readOnly
              type="text"
              name="trade"
              value={savedSession?.typeOfDeposit + " Account Deposit "}
              // onChange={handleInputChange}
              placeholder="Trade"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "10px",
                },
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input"> Method</InputLabel>
            <OutlinedInput
              readOnly
              type="text"
              name="amount"
              value={savedSession?.walletName}
              onChange={handleInputChange}
              placeholder="amount"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "10px",
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Box
                    component="img"
                    src={savedSession?.walletPhoto} // Replace with the actual image path
                    alt="Wallet Icon"
                    sx={{
                      width: 30,
                      height: 30,
                      marginRight: 1, // Adjust spacing
                      border: "2px solid grey",
                      borderRadius: "50%"
                    }}
                  />
                </InputAdornment>
              }
            />
          </Stack>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">Amount</InputLabel>
            <OutlinedInput
              readOnly
              type="text"
              name="amount"
              value={savedSession?.amountFiat}
              onChange={handleInputChange}
              placeholder="0"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "10px",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Typography>{user?.currency?.code}</Typography>
                </InputAdornment>
              }
            />
          </Stack>

          {/* <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">Image</InputLabel>
            <OutlinedInput
              type="text"
              name="depositProof"
              value={depositProof}
              onChange={handleInputChange}
              placeholder="Enter Wallet Address"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "10px",
                },
              }}
            />
          </Stack> */}

          <Stack
            direction={"column"}
            alignItems={"center"}
            p={"8px"}
            pt="30px"
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
                  <IconButton sx={{border: "2px solid grey"}}>
                    <Camera size={35} weight="bold" color="grey" />
                  </IconButton>
                </>
              }
            >
              <img
                src={imagePreview === null ? proofIcon : imagePreview}
                alt="proofImage"
                width={"100%"}
                // height={"120px"}
                style={{
                  border: "2px solid grey",
                  // borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Badge>

            <Stack alignItems={"center"}>
              <Typography variant="h6" fontWeight={"600"}>
                Add Proof of Deposit
              </Typography>
              <Typography variant="subtitle2" textAlign={"center"}>
                Click the image to add an image proof
              </Typography>
            </Stack>
          </Stack>

          <Button disabled={uploadLoading} sx={{backgroundColor: "green", color: "white"}} onClick={handleFormSubmit} variant="contained" size="large">
            {
              uploadLoading ? <CircularProgress size={30} /> : "Click to Upload Image" 
            }
            
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default DepositProof;
