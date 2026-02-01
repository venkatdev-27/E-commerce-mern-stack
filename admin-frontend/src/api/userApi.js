import adminAxios from './adminAxios';

/**
 * @desc    Get all users with their last purchase date and activity status
 * @returns Promise with users data
 */
export const getUsers = async () => {
  try {
    const response = await adminAxios.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data?.message || 'Failed to fetch users';
  }
};

/**
 * @desc    Get user statistics summary
 * @returns Promise with user statistics
 */
export const getUserStats = async () => {
  try {
    const response = await adminAxios.get('/users/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error.response?.data?.message || 'Failed to fetch user statistics';
  }
};

/**
 * @desc    Get a specific user by ID with their order history
 * @param   {string} userId - The ID of the user to fetch
 * @returns Promise with user data and order history
 */
export const getUserById = async (userId) => {
  try {
    const response = await adminAxios.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error.response?.data?.message || 'Failed to fetch user';
  }
};

/**
 * @desc    Delete a user and their associated orders
 * @param   {string} userId - The ID of the user to delete
 * @returns Promise with success message
 */
export const deleteUser = async (userId) => {
  try {
    const response = await adminAxios.delete(`/users/${userId}`);
    return response.data.message;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

/**
 * @desc    Format date for display in the table
 * @param   {Date|string} date - The date to format
 * @returns Formatted date string or 'No purchases'
 */
export const formatDate = (date) => {
  if (!date) return 'No purchases';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * @desc    Check if a user is active in the last 7 days
 * @param   {Date|string} lastPurchaseDate - The last purchase date
 * @returns Boolean indicating if user is active in last 7 days
 */
export const isActiveInLast7Days = (lastPurchaseDate) => {
  if (!lastPurchaseDate) return false;
  
  const purchaseDate = new Date(lastPurchaseDate);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return purchaseDate >= sevenDaysAgo;
};

/**
 * @desc    Get status badge class based on activity
 * @param   {boolean} isActive - Whether user has orders
 * @param   {boolean} activeInLast7Days - Whether user is active in last 7 days
 * @returns String with CSS class name
 */
export const getStatusBadgeClass = (isActive, activeInLast7Days) => {
  if (!isActive) return 'status-inactive';
  if (activeInLast7Days) return 'status-active';
  return 'status-inactive';
};

/**
 * @desc    Get status badge text based on activity
 * @param   {boolean} isActive - Whether user has orders
 * @param   {boolean} activeInLast7Days - Whether user is active in last 7 days
 * @returns String with status text
 */
export const getStatusBadgeText = (isActive, activeInLast7Days) => {
  if (!isActive) return 'Inactive';
  if (activeInLast7Days) return 'Active';
  return 'Inactive';
};