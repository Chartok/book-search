import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/authUtils';

export default function Navbar() {
	const {
		user,
		logout,
		login,
		register,
		loading: authLoading,
		error: authError,
	} = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

	const handleAuthSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (authMode === 'login') {
				await login(username, password);
			} else {
				await register(email, password, username);
			}
			// Reset form and close modal if successful
			setEmail('');
			setPassword('');
			setUsername('');
			setShowAuthModal(false);
		} catch (err) {
			console.error('Auth error:', err);
		}
	};

	return (
		<>
			<nav className='bg-white dark:bg-gray-800 shadow-md'>
				<div className='container mx-auto px-4 py-3 flex justify-between items-center'>
					<Link
						to='/'
						className='text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center'
					>
						📚 BookSearch
					</Link>
					<div className='flex space-x-4 items-center'>
						<Link
							to='/'
							className='hover:text-blue-600 dark:hover:text-blue-400'
						>
							Home
						</Link>
						{user && (
							<Link
								to='/library'
								className='hover:text-blue-600 dark:hover:text-blue-400'
							>
								My library
							</Link>
						)}
					</div>
					{authLoading ? (
						<span className='text-sm'>Loading...</span>
					) : user ? (
						<div className='flex items-center gap-3'>
							<span className='text-sm'>
								Welcome, {user.username || user.email}
							</span>
							<button
								onClick={logout}
								className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm'
							>
								Logout
							</button>
						</div>
					) : (
						<button
							onClick={() => setShowAuthModal(true)}
							className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm'
						>
							Login / Register
						</button>
					)}
				</div>
			</nav>

			{/* Auth Modal */}
			{showAuthModal && (
				<div
					className='fixed inset-0 bg-black text-white bg-opacity-50 flex items-center justify-center p-4 z-50'
					onClick={() => setShowAuthModal(false)}
				>
					<div
						className='bg-white text-black dark:bg-gray-800 dark:text-gray-50 rounded-lg p-6 w-full max-w-md'
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className='text-xl font-bold mb-4'>
							{authMode === 'login' ? 'Log in' : 'Register'}
						</h2>
						<form onSubmit={handleAuthSubmit} className='space-y-4'>
							<div>
								<input
									type='username'
									placeholder='Username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							{authMode === 'register' && (
								<div>
									<input
										type='text'
										placeholder='Username'
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									/>
								</div>
							)}

							<div>
								<input
									type='password'
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className='w-full bg-white text-black dark:bg-gray-800 dark:text-gray-50 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>

							{authError && <p className='text-red-500 text-sm'>{authError}</p>}

							<button
								type='submit'
								disabled={authLoading}
								className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md'
							>
								{authLoading
									? 'Please wait...'
									: authMode === 'login'
									? 'Log in'
									: 'Create account'}
							</button>
						</form>

						<p className='mt-4 text-sm text-center'>
							{authMode === 'login'
								? "Don't have an account?"
								: 'Have an account?'}{' '}
							<button
								type='button'
								className='text-blue-600 hover:underline'
								onClick={() =>
									setAuthMode(authMode === 'login' ? 'register' : 'login')
								}
							>
								{authMode === 'login' ? 'Register' : 'Log in'}
							</button>
						</p>
					</div>
				</div>
			)}
		</>
	);
}
