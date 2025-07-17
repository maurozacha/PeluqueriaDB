export const verifyToken = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token); 
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};