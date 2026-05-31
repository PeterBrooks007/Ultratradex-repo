import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/walletTransactions/`;



//addTransaction
const addTransaction = async (formData) => {
    const response = await axios.post(API_URL + "addTransaction", formData) 
    return response.data;
};


//adminGetAllUserWalletTransactions
const adminGetAllUserWalletTransactions = async (id) => {
  const response = await axios.get(API_URL + `adminGetAllUserWalletTransactions/${id}`);
  return response.data;
};

//getUserWalletTransactions
const getUserWalletTransactions = async () => {
  const response = await axios.get(API_URL + `getUserWalletTransactions`);
  return response.data;
};


//adminUpdateUserWalletTransaction
const adminUpdateUserWalletTransaction = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `adminUpdateUserWalletTransaction/${id}`, formData);
  return response.data;
};



//deleteTransaction
const deleteTransaction = async (id, formData) => {
  const response = await axios.delete(`${API_URL}deleteTransaction/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};



const walletTransactionsService = {
  addTransaction,
  getUserWalletTransactions,
  adminGetAllUserWalletTransactions,
  adminUpdateUserWalletTransaction,
  deleteTransaction,

}

export default walletTransactionsService;