import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/nftSettings/`;

//addNft
const  addNft = async (userData) => {
    const response = await axios.post(API_URL + "addNft", userData, {
      withCredentials: true,
    });
    return response.data;
  };

//getAllNfts
const getAllNfts = async () => {
    const response = await axios.get(API_URL + "getAllNfts") 
    return response.data;
};


//updateNft
const updateNft = async (id, userData) => {
    const response = await axios.patch(API_URL + `updateNft/${id}`, userData);
    return response.data;
  };

//deleteNft
const deleteNft = async (id, userData) => {
    const response = await axios.delete(API_URL + `deleteNft/${id}`, userData);
    return response.data;
  };

// //myExpertTrader
// const myExpertTrader = async (expertTraderID) => {
//     const response = await axios.patch(API_URL + `myExpertTrader/`, expertTraderID);
//     return response.data;
//   };

// //removeMyExpertTrader
// const removeMyExpertTrader = async (id) => {
//   const response = await axios.patch(API_URL + `removeFromMyExpertTrader/${id}`);
//   return response.data;
// };



  //getMyNfts
  const getMyNfts = async () => {
    const response = await axios.get(API_URL + "getMyNfts") 
    return response.data;
  };


//updateNftPhoto
const updateNftPhoto = async (id, formData) => {
  const response = await axios.post(API_URL + `updateNftPhoto/${id}`, formData);
  return response.data;
};


//admingetUserNfts
const admingetUserNfts = async (email) => {
  const response = await axios.get(API_URL + `admingetUserNfts/${email}`);
  return response.data;
};


//adminRemoveUserNft
const adminRemoveUserNft = async (id, formData) => {
  const response = await axios.patch(API_URL + `adminRemoveUserNft/${id}`, formData);
  return response.data;
};

//userReSellNft
const userReSellNft = async (id, formData) => {
  const response = await axios.patch(API_URL + `userReSellNft/${id}`, formData);
  return response.data;
};


//adminAddNftToUser
const adminAddNftToUser = async (formData) => {
  const response = await axios.patch(API_URL + `adminAddNftToUser/`, formData);
  return response.data;
};



  




const nftSettingsService = {
  getAllNfts,
    addNft,
    updateNft,
    updateNftPhoto,
    deleteNft,
    getMyNfts,
    userReSellNft,


    // myExpertTrader,
    // removeMyExpertTrader,

    admingetUserNfts,
    adminRemoveUserNft,
    adminAddNftToUser,
   
}

export default nftSettingsService;