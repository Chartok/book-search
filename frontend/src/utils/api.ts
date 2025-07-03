import axios, { AxiosError } from 'axios';

// API base URL - could be changed based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('API Request Error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor for global error handling
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle session expiration
		if (error.response?.status === 401) {
			// Clear token and user data if unauthorized
			localStorage.removeItem('token');
			localStorage.removeItem('user');

			// Optional: Redirect to login page or show a notification
			// window.location.href = '/';
		}

		// Log errors for debugging
		console.error('API Response Error:', error.response?.data || error.message);

		return Promise.reject(error);
	}
);

export default api;
