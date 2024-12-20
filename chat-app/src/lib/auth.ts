// src/lib/auth.ts

import { jwtDecode } from 'jwt-decode';

export const API_BASE_URL = 'http://127.0.0.1:5000';

interface User {
  id: number;
  username: string;
  role: string;
}

interface LoginResponse {
  message: string;
  user?: User;
  token?: string;
}

// src/lib/auth.ts
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store token and user data
    if (data.token) {
      document.cookie = `session=${data.token}; path=/; secure; samesite=strict`;
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}