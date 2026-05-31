import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;


//getSingleCoinPrice
const getSingleCoinPrice = async (userData) => {
    const response = await axios.get(API_URL + "getSingleCoinPrice", {
      params: userData, // Pass userData as query parameters
    });
    return response.data;
  };

  // get Coin details
const getAllCoinpaprikaCoinPrices = async () => {
  const response = await axios.get(API_URL + "getAllCoinpaprikaCoinPrices");
  return response.data;
};


//adminGetAllCoinpaprikaCoinPrices
const adminGetAllCoinpaprikaCoinPrices = async (id) => {
  const response = await axios.get(API_URL + `adminGetAllCoinpaprikaCoinPrices/${id}`);
  return response.data;
};



const authService = {
  getSingleCoinPrice,
  getAllCoinpaprikaCoinPrices,
  adminGetAllCoinpaprikaCoinPrices
};

export default authService;
