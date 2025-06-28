import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/mutations'; // Make sure this mutation exists and is for signup
import AuthService from '../utils/auth';

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});
	const [register, { error }] = useMutation(REGISTER);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await register({ variables: { ...formData } });
			AuthService.login(data.register.token); // Adjust according to your mutation's return value
			onSuccess?.();
		} catch (err) {
			console.error(err);
		}
	};

	return (
                <form onSubmit={handleSubmit} className='space-y-4'>
                        {error && <p className='text-red-600'>Something went wrong!</p>}
                        <input
                                name='username'
                                placeholder='Username'
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className='w-full border rounded p-2'
                        />
                        <input
                                name='email'
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full border rounded p-2'
                        />
                        <input
                                name='password'
                                type='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className='w-full border rounded p-2'
                        />
                        <button
                                type='submit'
                                className='w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50'
                                disabled={!(formData.username && formData.email && formData.password)}
                        >
                                Submit
                        </button>
                </form>
        );
}
