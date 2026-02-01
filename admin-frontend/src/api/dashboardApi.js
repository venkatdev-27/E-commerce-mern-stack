import adminAxios from "./adminAxios";

export const getDashboardData = async () => {
  try {
    const response = await adminAxios.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    // Axios error
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to load dashboard data"
      );
    }

    // Network / unknown error
    throw new Error("Server not reachable");
  }
};
