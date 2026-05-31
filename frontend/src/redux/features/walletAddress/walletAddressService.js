import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/walletAddress/`;

//Add addWalletAddress 
const  addWalletAddress = async (userData) => {
    const response = await axios.post(API_URL + "addWalletAddress", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllExpertTraders
const getAllWalletAddress = async () => {
    const response = await axios.get(API_URL + "getAllWalletAddress") 
    return response.data;
};


//updateWalletAddress
const updateWalletAddress = async (id, userData) => {
    const response = await axios.patch(API_URL + `updateWalletAddress/${id}`, userData);
    return response.data;
  };


  //updateWalletAddresIcon
const updateWalletAddresIcon = async (id, formData) => {
  const response = await axios.post(API_URL + `updateWalletAddresIcon/${id}`, formData);
  return response.data;
};

  //updateWalletAddresQrcode
const updateWalletAddresQrcode = async (id, formData) => {
  const response = await axios.post(API_URL + `updateWalletAddresQrcode/${id}`, formData);
  return response.data;
};


//deleteWalletAddress
const deleteWalletAddress = async (id, userData) => {
    const response = await axios.delete(API_URL + `deleteWalletAddress/${id}`, userData);
    return response.data;
  };



  




const walletAddressService = {
    addWalletAddress,
    getAllWalletAddress,
    updateWalletAddress,
    updateWalletAddresIcon,
    updateWalletAddresQrcode,
    deleteWalletAddress,
   
   
}

export default walletAddressService;