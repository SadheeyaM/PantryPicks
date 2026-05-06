// Category API service abstraction
const BFF_BASE_URL = "http://localhost:3000";

export async function fetchCategories(accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${BFF_BASE_URL}/api/v1/categories`, { headers });
  return res.json();
}
