const BASE_URL = "/api";

async function fetchProperties(params = {}) {
  const query = new URLSearchParams();

  if (params.city) query.append("city", params.city);
  if (params.zipcode) query.append("zipcode", params.zipcode);
  if (params.minPrice) query.append("minPrice", params.minPrice);
  if (params.maxPrice) query.append("maxPrice", params.maxPrice);
  if (params.beds) query.append("beds", params.beds);
  if (params.baths) query.append("baths", params.baths);
  if (params.limit) query.append("limit", params.limit);
  if (params.offset) query.append("offset", params.offset);

  const response = await fetch(`${BASE_URL}/properties?${query.toString()}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to fetch properties");
  }

  return response.json();
}

async function fetchPropertyDetail(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Property not found");
  }

  return response.json();
}

export { fetchProperties, fetchPropertyDetail };