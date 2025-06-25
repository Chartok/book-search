import { useState } from 'react';
import { TextField, Button, Alert, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations'; // Make sure this mutation exists and is for signup
import AuthService from '../utils/auth';

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});
	const [addUser, { error }] = useMutation(ADD_USER);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await addUser({ variables: { ...formData } });
			AuthService.login(data.addUser.token); // Adjust according to your mutation's return value
			onSuccess?.();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack spacing={2}>
				{error && <Alert severity='error'>Something went wrong!</Alert>}
				<TextField
					name='username'
					label='Username'
					value={formData.username}
					onChange={handleChange}
					required
				/>
				<TextField
					name='email'
					label='Email'
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<TextField
					name='password'
					label='Password'
					type='password'
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<Button
					type='submit'
					variant='contained'
					disabled={!(formData.username && formData.email && formData.password)}
				>
					Submit
				</Button>
			</Stack>
		</form>
	);
}
