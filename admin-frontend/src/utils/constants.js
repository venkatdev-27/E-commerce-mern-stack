/* ================================
   ORDER STATUSES
================================ */
export const ORDER_STATUSES = Object.freeze([
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled"
]);

/* ================================
   CATEGORIES
================================ */
export const CATEGORIES = [
  { id: 'men-clothes', name: 'Men\'s Fashion' },
  { id: 'women-clothes', name: 'Women\'s Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'home', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty & Care' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'accessories', name: 'Accessories' },
];

/* ================================
   API BASE URL (SAFE FALLBACK)
================================ */
export const API_BASE_URL =
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  "http://localhost:5000/api/admin";
