import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/totalCounts/`;

//getAllAdminTotalCounts
const getAllAdminTotalCounts = async () => {
    const response = await axios.get(API_URL + "getAllAdminTotalCounts") 
    return response.data;
};


//getAllUserTotalCounts
const getAllUserTotalCounts = async () => {
    const response = await axios.get(API_URL + "getAllUserTotalCounts") 
    return response.data;
};

const totalCountService = {
  getAllAdminTotalCounts,
  getAllUserTotalCounts
}

export default totalCountService;