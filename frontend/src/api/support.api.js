import axiosInstance from '@/api/axiosInstance';

export const submitSupportMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post('/support/submit', messageData);
    return response.data;
  } catch (error) {
    console.error('Error submitting support message:', error);
    throw error;
  }
};

export const getUserSupportMessages = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/support/my-messages', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user support messages:', error);
    throw error;
  }
};
