import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;

//Register User
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData, {
    withCredentials: true,
  });
  return response.data;
};

//sendOTP
const sendOTP = async (userData) => {
  const response = await axios.post(API_URL + "sendOTP", userData, {
    withCredentials: true,
  });
  return response.data;
};

//verifyOTP
const verifyOTP = async (userData) => {
  const response = await axios.post(API_URL + "verifyOTP", userData, {
    withCredentials: true,
  });
  return response.data;
};

//kycSetup
const kycSetup = async (userData) => {
  const response = await axios.post(API_URL + "kycSetup", userData, {
    withCredentials: true,
  });
  return response.data;
};

//idVerificationUpload
const idVerificationUpload = async (userData) => {
  const response = await axios.post(API_URL + "idVerificationUpload", userData, {
    withCredentials: true,
  });
  return response.data;
};

//Login User
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    withCredentials: true,
  });
  return response.data;
};

//Logout User
const logout = async () => {
  const response = await axios.get(API_URL + "logout");
  return response.data.message;
};

//Get Login Status
const getLoginStatus = async () => {
  const response = await axios.get(API_URL + "getLoginStatus", {
    withCredentials: true,
  });
  return response.data;
};

//get User
const getUser = async () => {
  const response = await axios.get(API_URL + "getUser", {
    withCredentials: true,
  });
  return response.data;
};

//update User
const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + "updateUser", userData);
  return response.data;
};


//update User Photo
const updatePhoto = async (id, formData) => {
  // console.log(formData)
  const response = await axios.patch(API_URL + "updatePhoto", formData);
  return response.data;
};



//updatePinRequired
const updatePinRequired = async (userData) => {
  const response = await axios.patch(API_URL + "updatePinRequired", userData);
  return response.data;
};

//updateLastAccess
const updateLastAccess = async (userData) => {
  const response = await axios.patch(API_URL + "updateLastAccess", userData);
  return response.data;
};

//verifyPinRequired
const verifyPinRequired = async (userData) => {
  const response = await axios.patch(API_URL + "verifyPinRequired", userData);
  return response.data;
};


// get Coin details
const getAllCoins = async () => {
  const response = await axios.get(API_URL + "getAllCoins");
  return response.data;
};

// get trending coin
const getTrendingCoins = async () => {
  const response = await axios.get(API_URL + "getTrendingCoins");
  return response.data;
};

//update User
const changeCurrency = async (userData) => {
  const response = await axios.patch(API_URL + "changeCurrency", userData);
  return response.data;
};


// get all Users
const getAllUsers = async () => {
  const response = await axios.get(API_URL + "getAllUsers");
  return response.data;
};

//getSingleUser
const getSingleUser = async (id) => {
  const response = await axios.get(API_URL + "getSingleUser/" + id) 
  return response.data;
};

//Admin update User
const adminUpdateUser = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminUpdateUser/${id}`, userData);
  return response.data;
};

//adminFundTradeBalance
const adminFundTradeBalance = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminFundTradeBalance/${id}`, userData);
  return response.data;
};


//adminDebitTradeBalance
const adminDebitTradeBalance = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminDebitTradeBalance/${id}`, userData);
  return response.data;
};

//adminFundAssetBalance
const adminFundAssetBalance = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminFundAssetBalance/${id}`, userData);
  return response.data;
};

//adminDebitAssetBalance
const adminDebitAssetBalance = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminDebitAssetBalance/${id}`, userData);
  return response.data;
};


//adminAddNewAssetWalletToUser
const adminAddNewAssetWalletToUser = async (id, formData) => {
  // console.log("data server", id, formData)
  const response = await axios.post(API_URL + `adminAddNewAssetWalletToUser/${id}`, formData);
  return response.data;
};



const adminDeleteAssetWalletFromUser = async (id, userData) => {
  const response = await axios.delete(`${API_URL}adminDeleteAssetWalletFromUser/${id}`, {
    data: userData, // Pass walletSymbol in the request body
  });
  return response.data;
};

//adminSetIsManualAssetMode
const adminSetIsManualAssetMode = async (id) => {
  const response = await axios.patch(API_URL + `adminSetIsManualAssetMode/${id}`);
  return response.data;
};

//adminManualUpdateAssetBalance
const adminManualUpdateAssetBalance = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminManualUpdateAssetBalance/${id}`, userData);
  return response.data;
};

//adminApproveId
const adminApproveId = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminApproveId/${id}`, userData);
  return response.data;
};

//adminApproveResidency
const adminApproveResidency = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminApproveResidency/${id}`, userData);
  return response.data;
};


//adminVerifyEmail
const adminVerifyEmail = async (id) => {
  const response = await axios.patch(API_URL + `adminVerifyEmail/${id}`);
  return response.data;
};

//adminChangeUserCurrency
const adminChangeUserCurrency = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminChangeUserCurrency/${id}`, userData);
  return response.data;
};

//adminActivateDemoAccount
const adminActivateDemoAccount = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminActivateDemoAccount/${id}`, userData);
  return response.data;
};

//adminSetUserAutoTrade
const adminSetUserAutoTrade = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminSetUserAutoTrade/${id}`, userData);
  return response.data;
};

//adminSetUserWithdrawalLock
const adminSetUserWithdrawalLock = async (id, userData) => {
  const response = await axios.patch(API_URL + `adminSetUserWithdrawalLock/${id}`, userData);
  return response.data;
};

//updateCustomizeEmailLogo
const updateCustomizeEmailLogo = async (id, userData) => {
  const response = await axios.post(API_URL + `updateCustomizeEmailLogo/${id}`, userData);
  return response.data;
};


//adminSendCustomizedMail
const adminSendCustomizedMail = async (id, formData) => {
  const response = await axios.post(API_URL + `adminSendCustomizedMail/${id}`, formData);
  return response.data;
};

//adminAddGiftReward
const adminAddGiftReward = async (id, formData) => {
  const response = await axios.patch(API_URL + `adminAddGiftReward/${id}`, formData);
  return response.data;
};

//adminDeleteGiftReward
const adminDeleteGiftReward = async (id, formData) => {
  const response = await axios.patch(API_URL + `adminDeleteGiftReward/${id}`, formData);
  return response.data;
};

//UserClaimReward
const UserClaimReward = async (id, formData) => {
  const response = await axios.patch(API_URL + `UserClaimReward/${id}`, formData);
  return response.data;
};

//adminLockAccount
const adminLockAccount = async (id, formData) => {
  const response = await axios.patch(API_URL + `adminLockAccount/${id}`, formData);
  return response.data;
};



//changePassword
const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "changePassword", userData);
  return response.data;
};



//twofaAuthentication
const twofaAuthentication = async (userData) => {
  const response = await axios.patch(API_URL + "twofaAuthentication", userData);
  return response.data;
};


//adminDeleteUser
const adminDeleteUser = async (id, userData) => {
  const response = await axios.delete(API_URL + `adminDeleteUser/${id}`, userData);
  return response.data;
};

//contactUs
const contactUs = async (userData) => {
  const response = await axios.post(API_URL + "contactUs", userData);
  return response.data;
};


//requestCard
const requestCard = async (userData) => {
  const response = await axios.post(API_URL + "requestCard", userData);
  return response.data;
};


//changePin
const changePin = async (userData) => {
  const response = await axios.patch(API_URL + "changePin", userData);
  return response.data;
};

//forgotPassword
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgotPassword", userData);
  return response.data;
};

//resetPassword
const resetPassword = async (userData) => {
  const response = await axios.post(API_URL + "resetPassword", userData);
  return response.data;
};

//residencyVerification 
const residencyVerification = async (id, formData) => {
  // console.log(formData)
  const response = await axios.patch(API_URL + "residencyVerification", formData);
  return response.data;
};





const authService = {
  register,
  sendOTP,
  verifyOTP,
  kycSetup,
  idVerificationUpload,
  login,
  logout,
  getLoginStatus,
  getUser,
  updateUser,
  updatePhoto,
  updatePinRequired,
  updateLastAccess,
  verifyPinRequired,
  getTrendingCoins,
  changeCurrency,
  getAllCoins,
  getAllUsers,
  getSingleUser,
  adminUpdateUser,
  adminFundTradeBalance,
  adminDebitTradeBalance,
  adminFundAssetBalance,
  adminDebitAssetBalance,
  adminAddNewAssetWalletToUser,
  adminDeleteAssetWalletFromUser,
  adminSetIsManualAssetMode,
  adminManualUpdateAssetBalance,
  adminApproveId,
  adminApproveResidency,
  adminVerifyEmail,
  adminChangeUserCurrency,
  adminActivateDemoAccount,
  adminSetUserAutoTrade,
  adminSetUserWithdrawalLock,
  updateCustomizeEmailLogo,
  adminSendCustomizedMail,
  adminAddGiftReward,
  adminDeleteGiftReward,
  UserClaimReward,
  adminLockAccount,

  changePassword,
  twofaAuthentication,
  adminDeleteUser,
  contactUs,
  changePin,
  requestCard,
  forgotPassword,
  resetPassword,
  residencyVerification
  
  
};

export default authService;
