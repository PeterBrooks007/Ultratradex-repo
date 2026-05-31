import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/expertTraders/`;

//Add ExpertTrader User
const  addExpertTraders = async (userData) => {
    const response = await axios.post(API_URL + "addExpertTrader", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllExpertTraders
const getAllExpertTraders = async () => {
    const response = await axios.get(API_URL + "getAllExpertTraders") 
    return response.data;
};


//updateExpertTrader
const updateExpertTrader = async (id, userData) => {
    const response = await axios.patch(API_URL + `updateExpertTrader/${id}`, userData);
    return response.data;
  };

//deleteExpertTrader
const deleteExpertTrader = async (id, userData) => {
    const response = await axios.delete(API_URL + `deleteExpertTrader/${id}`, userData);
    return response.data;
  };

//myExpertTrader
const myExpertTrader = async (expertTraderID) => {
    const response = await axios.patch(API_URL + `myExpertTrader/`, expertTraderID);
    return response.data;
  };

  //getMyExpertTrader
const getMyExpertTrader = async () => {
  const response = await axios.get(API_URL + "getMyExpertTrader") 
  return response.data;
};


//removeMyExpertTrader
const removeMyExpertTrader = async (id) => {
  const response = await axios.patch(API_URL + `removeFromMyExpertTrader/${id}`);
  return response.data;
};


//updateExpertTraderPhoto
const updateExpertTraderPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateExpertTraderPhoto/${id}`, formData);
  return response.data;
};


//admingetUserExpertTrader
const admingetUserExpertTrader = async (email) => {
  const response = await axios.get(API_URL + `admingetUserExpertTrader/${email}`);
  return response.data;
};


//adminRemoveUserExpertTraderCopied
const adminRemoveUserExpertTraderCopied = async (id, formData) => {
  const response = await axios.patch(API_URL + `adminRemoveUserExpertTraderCopied/${id}`, formData);
  return response.data;
};


//adminAddExpertTraderToUser
const adminAddExpertTraderToUser = async (formData) => {
  const response = await axios.patch(API_URL + `adminAddExpertTraderToUser/`, formData);
  return response.data;
};



  




const expertTradersService = {
    getAllExpertTraders,
    addExpertTraders,
    updateExpertTrader,
    deleteExpertTrader,
    myExpertTrader,
    getMyExpertTrader,
    removeMyExpertTrader,
    updateExpertTraderPhoto,
    admingetUserExpertTrader,
    adminRemoveUserExpertTraderCopied,
    adminAddExpertTraderToUser,
   
}

export default expertTradersService;