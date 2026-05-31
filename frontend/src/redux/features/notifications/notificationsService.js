import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/notifications/`;



//addNotification
const addNotification = async (formData) => {
    const response = await axios.post(API_URL + "addNotification", formData) 
    return response.data;
};


//adminGetAllUserNotifications
const adminGetUserNotifications = async (id) => {
  const response = await axios.get(API_URL + `adminGetUserNotifications/${id}`);
  return response.data;
};


//getUserNotifications
const getUserNotifications = async () => {
  const response = await axios.get(API_URL + `getUserNotifications`);
  return response.data;
};


//adminUpdateUserNotification
const adminUpdateUserNotification = async (id, formData) => {
  // console.log(id, formData)
  const response = await axios.patch(API_URL + `adminUpdateUserNotification/${id}`, formData);
  return response.data;
};


//getAllAdminNotifications
const getAllAdminNotifications = async () => {
  const response = await axios.get(API_URL + `getAllAdminNotifications`);
  return response.data;
};





//deleteNotification
const deleteNotification = async (id, formData) => {
  const response = await axios.delete(`${API_URL}deleteNotification/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};


//adminClearNotification
const adminClearNotification = async (id, formData) => {
  const response = await axios.delete(`${API_URL}adminClearNotification/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};

//userClearNotification
const userClearNotification = async (id, formData) => {
  const response = await axios.delete(`${API_URL}userClearNotification/${id}`, {
    data: formData, // Pass in the request body
  });
  return response.data;
};



const notificationService = {
  addNotification,
  getUserNotifications,
  adminGetUserNotifications,
  adminUpdateUserNotification,
  deleteNotification,
  getAllAdminNotifications,
  adminClearNotification,
  userClearNotification

}

export default notificationService;