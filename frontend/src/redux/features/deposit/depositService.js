import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/deposit/`;

//getUserWithdrawalhistory
const getUserDeposithistory = async () => {
    const response = await axios.get(API_URL + "getUserDeposithistory") 
    return response.data;
};

//requestDepositDetails
const requestDepositDetails = async (formData) => {
    const response = await axios.post(API_URL + "requestDepositDetails", formData) 
    return response.data.message;
};

//deposit Fund
const depositFund = async (formData) => {
    const response = await axios.post(API_URL + "depositFund", formData) 
    return response.data.message;
};

//adminAddTradeHistoryToUser
const adminAddTradeHistoryToUser = async (formData) => {
    const response = await axios.post(API_URL + "adminAddTradeHistoryToUser", formData) 
    return response.data.message;
};

// getAllPendingDepositRequest
const getAllPendingDepositRequest = async () => {
    const response = await axios.get(API_URL + "getAllPendingDepositRequest");
    return response.data;
  };

  //approveDepositRequest
const approveDepositRequest = async (id, userData) => {
    const response = await axios.patch(API_URL + `approveDepositRequest/${id}`, userData);
    return response.data;
  };

  //deleteDepositRequest
const deleteDepositRequest = async (id, userData) => {
    const response = await axios.delete(API_URL + `deleteDepositRequest/${id}`, userData);
    return response.data;
  };

  //adminGetUserDeposithistory
const adminGetUserDeposithistory = async (id) => {
    const response = await axios.get(API_URL + `adminGetUserDeposithistory/${id}`);
    return response.data;
  };

const depositService = {
    getUserDeposithistory,
    depositFund,
    requestDepositDetails,
    getAllPendingDepositRequest,
    approveDepositRequest,
    deleteDepositRequest,
    adminGetUserDeposithistory,
    adminAddTradeHistoryToUser,
}

export default depositService;