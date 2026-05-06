// Product API service abstraction
const BFF_BASE_URL = "http://localhost:3000";

export async function fetchProducts(category?: string, accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  let url = `${BFF_BASE_URL}/api/v1/products`;
  if (category) url += `?category=${encodeURIComponent(category)}`;
  const res = await fetch(url, { headers });
  return res.json();
}

export async function fetchProductById(productId: number, accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${BFF_BASE_URL}/api/v1/products/${productId}`, { headers });
  return res.json();
}
