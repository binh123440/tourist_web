import axios from 'axios';

const API_URL = 'https://tourist-web-noln.onrender.com/api';


// Tours
export const getTours = async (destination = null) => {
  try {
    let url = `${API_URL}/tours`;
    if (destination && destination !== 'all') {
      url += `?destination=${destination}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

// Tour Details
export const getTourDetail = async (tourId) => {
  try {
    const response = await axios.get(`${API_URL}/tourDetails/${tourId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour details:', error);
    return null;
  }
};


