import decode from 'jwt-decode';

type JwtPayload = {
	exp: number;
	[i: string]: unknown;
};

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
			const decoded: JwtPayload = decode<JwtPayload>(token);
			if (decoded.exp < Date.now() / 1000) {
				return true;
			}
			return false;
		} catch {
			return false;
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
