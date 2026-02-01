import adminAxios from "./adminAxios";

export const loginAdmin = async (credentials) => {
  try {
    const response = await adminAxios.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    // Send backend error message to UI
    throw new Error(
      error.response?.data?.message || "Admin login failed"
    );
  }
};
