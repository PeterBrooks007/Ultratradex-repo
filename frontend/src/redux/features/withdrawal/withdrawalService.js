import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/withdrawal/`;

//getUserWithdrawalhistory
const getUserWithdrawalhistory = async () => {
    const response = await axios.get(API_URL + "getUserWithdrawalhistory") 
    return response.data;
};

//Withdraw Fund
const withdrawFund = async (formData) => {
    const response = await axios.post(API_URL + "withdrawFund", formData) 
    return response.data.message;
};

// getAllPendingWithdrawalRequest
const getAllPendingWithdrawalRequest = async () => {
    const response = await axios.get(API_URL + "getAllPendingWithdrawalRequest");
    return response.data;
  };

    //approveWithdrawalRequest
const approveWithdrawalRequest = async (id, userData) => {
    const response = await axios.patch(API_URL + `approveWithdrawalRequest/${id}`, userData);
    return response.data;
  };


    //deleteWithdrawalRequest
const deleteWithdrawalRequest = async (id, userData) => {
    const response = await axios.delete(API_URL + `deleteWithdrawalRequest/${id}`, userData);
    return response.data;
  };

    //adminGetUserWithdrawalhistory
const adminGetUserWithdrawalhistory = async (id) => {
  const response = await axios.get(API_URL + `adminGetUserWithdrawalhistory/${id}`);
  return response.data;
};




const transactionService = {
    getUserWithdrawalhistory,
    withdrawFund,
    getAllPendingWithdrawalRequest,
    approveWithdrawalRequest,
    deleteWithdrawalRequest,
    adminGetUserWithdrawalhistory
}

export default transactionService;