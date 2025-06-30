import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useAuth } from '../context/authUtils';

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const { login, register, loading, error } = useAuth();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (mode === 'login') {
				await login(email, password);
			} else {
				await register(email, password, username);
			}
			// Only close if successful
			onClose();
			// Reset form
			setEmail('');
			setPassword('');
			setUsername('');
		} catch (err) {
			// Error is handled by the auth context
			console.error('Auth error:', err);
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<h2>{mode === 'login' ? 'Log in' : 'Register'}</h2>
			<form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
				<Input
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					type='email'
				/>
				{mode === 'register' && (
					<Input
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				)}
				<Input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				{error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

				<Button type='submit' disabled={loading}>
					{loading
						? 'Please wait...'
						: mode === 'login'
						? 'Log in'
						: 'Create account'}
				</Button>
			</form>
			<p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
				{mode === 'login' ? "Don't have an account?" : 'Have an account?'}{' '}
				<button
					type='button'
					style={{
						color: '#2563eb',
						background: 'none',
						border: 0,
						cursor: 'pointer',
					}}
					onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
				>
					{mode === 'login' ? 'Register' : 'Log in'}
				</button>
			</p>
		</Modal>
	);
}
