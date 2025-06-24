import axios from 'axios';

export const searchGoogleBooks = (query: string) => {
	return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
