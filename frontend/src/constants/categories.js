export const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'recommended', name: 'Recommended' },
  { id: 'men-clothes', name: 'Men\'s Fashion' },
  { id: 'women-clothes', name: 'Women\'s Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'home', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty & Care' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'accessories', name: 'Accessories' },
];

// Mapping from URL slugs to database category names
export const CATEGORY_MAPPING = {
  'men-clothes': 'Men\'s Fashion',
  'women-clothes': 'Women\'s Fashion',
  'electronics': 'Electronics',
  'footwear': 'Footwear',
  'home': 'Home & Living',
  'beauty': 'Beauty & Care',
  'sports': 'Sports & Fitness',
  'accessories': 'Accessories',
};

// Function to get database category name from slug
export const getCategoryName = (slug) => {
  return CATEGORY_MAPPING[slug] || slug;
};
