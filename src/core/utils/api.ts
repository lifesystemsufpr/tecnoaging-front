export const buildQueryString = (params: Record<string, any>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") {
      search.set(key, String(value));
    }
  });
  const queryString = search.toString();
  return queryString ? `?${queryString}` : "";
};
