import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import type { User, AuthResponse } from './types';
import api from '../utils/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Load user and token from localStorage on initial render
		const savedToken = localStorage.getItem('token');
		const savedUser = localStorage.getItem('user');

		if (savedToken && savedUser) {
			setToken(savedToken);
			setUser(JSON.parse(savedUser));
		}
	}, []);

	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.post<AuthResponse>('/auth/login', {
				email,
				password,
			});

			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			setToken(token);
			setUser(user);
		} catch (err: Error | unknown) {
			console.error('Login error:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || 'Failed to login');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const register = async (
		email: string,
		password: string,
		username: string
	) => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.post<AuthResponse>('/auth/register', {
				email,
				password,
				username,
			});

			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			setToken(token);
			setUser(user);
		} catch (err: Error | unknown) {
			console.error('Registration error:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || 'Failed to register');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, token, loading, error, login, register, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
