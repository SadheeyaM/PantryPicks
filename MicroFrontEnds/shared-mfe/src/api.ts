import { API_ENDPOINTS } from './constants';
import { ApiResponse } from './types';

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getProducts(): Promise<any[]> {
  return fetchAPI(API_ENDPOINTS.products);
}

export async function getCart(): Promise<any> {
  return fetchAPI(API_ENDPOINTS.cart);
}

export async function getOrders(): Promise<any[]> {
  return fetchAPI(API_ENDPOINTS.orders);
}

export async function getUser(): Promise<any> {
  return fetchAPI(API_ENDPOINTS.user);
}

export async function getCategories(): Promise<string[]> {
  return fetchAPI(API_ENDPOINTS.categories);
}
