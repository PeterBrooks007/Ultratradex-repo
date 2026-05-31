import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/trades/`;



//add Fund
const addTrade = async (formData) => {
    const response = await axios.post(API_URL + "addTrade", formData) 
    return response.data;
};


//adminGetAllUserTrades
const adminGetAllUserTrades = async (id) => {
  const response = await axios.get(API_URL + `adminGetAllUserTrades/${id}`);
  return response.data;
};


//adminUpdateUserTrade
const adminUpdateUserTrade = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `adminUpdateUserTrade/${id}`, formData);
  return response.data;
};


//cancelTrade
const cancelTrade = async (id, formData) => {
  const response = await axios.delete(`${API_URL}cancelTrade/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};

//deleteTrade
const deleteTrade = async (id, formData) => {
  const response = await axios.delete(`${API_URL}deleteTrade/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};


//adminApproveUserTrade
const adminApproveUserTrade = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `adminApproveUserTrade/${id}`, formData);
  return response.data;
};

//autoTradeUpdate
const autoTradeUpdate = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `autoTradeUpdate/${id}`, formData);
  return response.data;
};

//userUpdateAdminTrade
const userUpdateAdminTrade = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `userUpdateAdminTrade/${id}`, formData);
  return response.data;
};





const tradesService = {
  addTrade,
  adminGetAllUserTrades,
  adminUpdateUserTrade,
  cancelTrade,
  deleteTrade,
  adminApproveUserTrade,
  autoTradeUpdate,
  userUpdateAdminTrade
}

export default tradesService;