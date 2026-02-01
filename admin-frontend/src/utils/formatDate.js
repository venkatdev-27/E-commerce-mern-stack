import { format } from "date-fns";

/* ===============================
   DATE FORMATTER (SAFE)
================================ */
export const formatDate = (date) => {
  if (!date) return "-";

  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return "-";
  }
};

/* ===============================
   CURRENCY FORMATTER (₹ SAFE)
================================ */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount);
};
