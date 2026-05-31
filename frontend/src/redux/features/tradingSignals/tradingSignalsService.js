import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/tradingSignals/`;

//addTradingBot
const  addTradingSignal = async (userData) => {
    const response = await axios.post(API_URL + "addTradingSignal", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllTradingSignals
const getAllTradingSignals = async () => {
    const response = await axios.get(API_URL + "getAllTradingSignals") 
    return response.data;
};

//updateTradingSignal
const updateTradingSignal = async (id, userData) => {
  const response = await axios.patch(API_URL + `updateTradingSignal/${id}`, userData);
  return response.data;
};

//deleteTradingBot
const deleteTradingSignal = async (id, userData) => {
  const response = await axios.delete(API_URL + `deleteTradingSignal/${id}`, userData);
  return response.data;
};


//updateTradingSignalPhoto
const updateTradingSignalPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateTradingSignalPhoto/${id}`, formData);
  return response.data;
};







const tradingBotsService = {
  getAllTradingSignals,
    addTradingSignal,
    updateTradingSignal,
    deleteTradingSignal,
    updateTradingSignalPhoto
}

export default tradingBotsService;