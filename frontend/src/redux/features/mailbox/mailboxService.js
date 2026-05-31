import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/mailbox/`;



//Withdraw Fund
const addmail = async (formData) => {
    const response = await axios.post(API_URL + "addmail", formData) 
    return response.data;
};

//getAllMail
const getAllMail = async () => {
  const response = await axios.get(API_URL + "getAllMail") 
  return response.data;
};

//getAllMailInbox
const getAllMailInbox = async () => {
  const response = await axios.get(API_URL + "getAllMailInbox") 
  return response.data;
};

//getAllMailInbox
const getAllMailIsStarred = async () => {
  const response = await axios.get(API_URL + "getAllMailIsStarred") 
  return response.data;
};

//getAllMailSent
const getAllMailSent = async () => {
  const response = await axios.get(API_URL + "getAllMailSent") 
  return response.data;
};

//getUserMail
const getUserMail = async () => {
  const response = await axios.get(API_URL + "getUserMail") 
  return response.data;
};

// get all Users
const getAllUsers = async () => {
  const response = await axios.get(API_URL + "getAllUsers");
  return response.data;
};

const adminDeleteMail = async (messageData) => {
  const response = await axios.delete(API_URL + `adminDeleteMail`, {
    data:  messageData  // Correctly formatted request to send data
  });
  return response.data;
};


  //adminMarkMailAsRead
  const adminMarkMailAsRead = async (messageData) => {
    const response = await axios.patch(API_URL + "adminMarkMailAsRead", messageData);
    return response.data;
  };

  //adminStarredMail
  const adminStarredMail = async (messageData) => {
    const response = await axios.patch(API_URL + "adminStarredMail", messageData);
    return response.data;
  };







//user userDeleteMail
const userDeleteMail = async (id, messageData) => {
  const response = await axios.delete(API_URL + `userDeleteMail/${id}`, messageData);
  return response.data;
};





const mailboxService = {
  addmail,
  getAllMail,
  getAllMailInbox,
  getAllMailSent,
  getAllMailIsStarred,
  getUserMail,
  getAllUsers,
  adminDeleteMail,
  userDeleteMail,
  adminMarkMailAsRead,
  adminStarredMail
    
}

export default mailboxService;