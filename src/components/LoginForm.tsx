import { useState } from 'react';
import { TextField, Button, Alert, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import Auth from '../utils/auth';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formData, setFormData] = useState({ email: '', username: '', password: '' });
	const [login, { error }] = useMutation(AUTHENTICATE);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await login({ variables: { ...formData } });
			Auth.login(data.login.token);
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
					disabled={!(formData.email && formData.password)}
				>
					Submit
				</Button>
			</Stack>
		</form>
	);
}
