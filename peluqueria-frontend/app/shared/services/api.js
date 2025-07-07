// api.js
export const apiCall = async (url, method, data, headers) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include' 
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Algo salió mal');
  }

  return responseData;
};