const getBaseUrl = () => {
  const host = window.location.hostname;
  return `http://${host}:8080/auth`;
};

export async function login(username, password) {
    const response = await fetch(`${getBaseUrl()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Invalid credentials');
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem('user');
}

export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
