import axiosInstance from './adminAxios';

export const getAllSupportMessages = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/support', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching support messages:', error);
    throw error;
  }
};

export const getSupportMessageStats = async () => {
  try {
    const response = await axiosInstance.get('/support/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching support message stats:', error);
    throw error;
  }
};

export const updateSupportMessageStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/support/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating support message status:', error);
    throw error;
  }
};

export const sendSupportReply = async (messageId, replyText) => {
  try {
    const response = await axiosInstance.post(`/support/${messageId}/reply`, { replyText });
    return response.data;
  } catch (error) {
    console.error('Error sending support reply:', error);
    throw error;
  }
};
