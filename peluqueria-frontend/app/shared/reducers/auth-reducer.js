const API_URL = process.env.REACT_APP_API_URL;

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error('Credenciales inválidas');

    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.token;
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}
