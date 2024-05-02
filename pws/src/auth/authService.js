
const tokenKey = 'userToken';

export const getToken = () => localStorage.getItem(tokenKey);

export const setToken = token => {
    localStorage.setItem(tokenKey, token);
};

export const removeToken = () => {
    localStorage.removeItem(tokenKey);
};

export const isTokenExpired = token => {
    // Implementation to check if the token is expired
    // For instance, decode JWT and check exp field
};
