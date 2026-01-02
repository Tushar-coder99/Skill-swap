const USER_URL = '/api/users';
const SWAP_URL = '/api/swaps';

// --- Auth & User ---
export const register = async (userData) => {
  const res = await fetch(USER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (res.ok) localStorage.setItem('user', JSON.stringify(data));
  else throw new Error(data.message || 'Registration failed');
  return data;
};

export const login = async (userData) => {
  const res = await fetch(`${USER_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (res.ok) localStorage.setItem('user', JSON.stringify(data));
  else throw new Error(data.message || 'Login failed');
  return data;
};

export const getProfile = async (token) => {
  const res = await fetch(`${USER_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Profile error');
  return data;
};

export const updateProfile = async (userData, token) => {
  const res = await fetch(`${USER_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
};

// --- Explore ---
export const getAllUsers = async (search, token) => {
  const query = search ? `?search=${search}` : '';
  const res = await fetch(`${USER_URL}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetch users failed');
  return data;
};

// --- Swaps ---
export const getSwaps = async (token) => {
  const res = await fetch(SWAP_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetch swaps failed');
  return data;
};

export const sendSwap = async (swapData, token) => {
  const res = await fetch(SWAP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(swapData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Send swap failed');
  return data;
};

export const updateSwap = async (id, status, token) => {
  const res = await fetch(`${SWAP_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update swap failed');
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
};
