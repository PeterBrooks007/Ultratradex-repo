import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/tradingBots/`;

//addTradingBot
const  addTradingBot = async (userData) => {
    const response = await axios.post(API_URL + "addTradingBot", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllTradingBots
const getAllTradingBots = async () => {
    const response = await axios.get(API_URL + "getAllTradingBots") 
    return response.data;
};

//updateTradingBot
const updateTradingBot = async (id, userData) => {
  const response = await axios.patch(API_URL + `updateTradingBot/${id}`, userData);
  return response.data;
};

//deleteTradingBot
const deleteTradingBot = async (id, userData) => {
  const response = await axios.delete(API_URL + `deleteTradingBot/${id}`, userData);
  return response.data;
};

//updateTradingBotPhoto
const updateTradingBotPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateTradingBotPhoto/${id}`, formData);
  return response.data;
};







const tradingBotsService = {
    getAllTradingBots,
    addTradingBot,
    updateTradingBot,
    deleteTradingBot,
    updateTradingBotPhoto
}

export default tradingBotsService;