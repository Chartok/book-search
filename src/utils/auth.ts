import {jwtDecode as decode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

class AuthService {
	getProfile() {
		return decode(this.getToken() as string);
	}

	loggedIn() {
		const token = this.getToken();
		return !!token && !this.isTokenExpired(token as string);
	}

	isTokenExpired(token: string) {
		try {
			const decoded = decode<JwtPayload>(token);

			return !decoded.exp || decoded.exp < Date.now() / 1000;
		} catch {
			return true;
		}
	}

	getToken() {
		return localStorage.getItem('token');
	}

	login(idToken: string) {
		localStorage.setItem('token', idToken);
		window.location.assign('/');
	}

	logout() {
		localStorage.removeItem('token');
		window.location.assign('/');
	}
}

export default new AuthService();
