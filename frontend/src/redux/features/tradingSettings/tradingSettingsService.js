import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/tradingSettings/`;

//addConnectWallet
const  addExchangeType = async (userData) => {
    const response = await axios.post(API_URL + "addExchangeType", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllTradingSetting
const getAllTradingSetting = async () => {
    const response = await axios.get(API_URL + "getAllTradingSetting") 
    return response.data;
};

//updateTradingSetting
const updateTradingSetting = async (id, userData) => {
  const response = await axios.patch(API_URL + `updateTradingSetting/${id}`, userData);
  return response.data;
};


//deleteConnectWallet
const deleteTradingSettingExchange = async (id, userData) => {
  const response = await axios.delete(API_URL + `deleteTradingSettingExchange/${id}`, userData);
  return response.data;
};

// deleteArrayOfTradingExchange
const deleteArrayOfTradingExchange = async (TradesExchangeIds) => {
  const response = await axios.delete(API_URL + `deleteArrayOfTradingExchange`, {
    data: { TradesExchangeIds }, // Ensure data is sent this way for DELETE requests
  });
  return response.data;
};

//updateTradingSettingPhoto
const updateTradingSettingPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateTradingSettingPhoto/${id}`, formData);
  return response.data;
};

//addTradingPairs
const addTradingPairs = async (id, tradingPairsArray) => {
  const response = await axios.patch(API_URL + `addTradingPairs/${id}`, { tradingPairsArray } );
  return response.data;
};

//DeleteArrayTradingPairs
const DeleteArrayTradingPairs = async (id, tradingPairsArray) => {
  const response = await axios.patch(API_URL + `DeleteArrayTradingPairs/${id}`, { tradingPairsArray } );
  return response.data;
};







const tradeSettingsService = {
    getAllTradingSetting,
    addExchangeType,
    updateTradingSetting,
    deleteTradingSettingExchange,
    deleteArrayOfTradingExchange,
    updateTradingSettingPhoto,
    addTradingPairs,
    DeleteArrayTradingPairs
}

export default tradeSettingsService;