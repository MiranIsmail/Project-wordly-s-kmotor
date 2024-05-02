import { getToken } from './authService';

const apiUrl = 'https://api.yoursite.com';

export const fetchData = async () => {
    const token = getToken();
    const response = await fetch(`${apiUrl}/data`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};
