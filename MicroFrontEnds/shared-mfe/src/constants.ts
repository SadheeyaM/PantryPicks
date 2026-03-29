// API Base URL
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

// Colors
export const COLORS = {
  primary: '#003da5',
  primaryLight: '#0050d8',
  primaryLightest: '#f0f7ff',
  secondary: '#e8f0ff',
  dark: '#1a1a1a',
  gray: '#666666',
  lightGray: '#f0f0f0',
  border: '#e0e0e0',
  white: '#ffffff',
};

// Common API endpoints
export const API_ENDPOINTS = {
  products: `${API_BASE}/api/products`,
  cart: `${API_BASE}/api/cart`,
  orders: `${API_BASE}/api/orders`,
  user: `${API_BASE}/api/user`,
  categories: `${API_BASE}/api/categories`,
};
