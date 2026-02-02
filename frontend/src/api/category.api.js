import axiosInstance from "@/api/axiosInstance";

export const getCategories = async () => {
  try {
    return await axiosInstance.get("/categories");
  } catch (error) {
    throw new Error(
      error?.message || "Failed to fetch categories"
    );
  }
};
