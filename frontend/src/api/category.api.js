import axiosInstance from './axiosInstance';


export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get('/categories');
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch categories'
    );
  }
};
