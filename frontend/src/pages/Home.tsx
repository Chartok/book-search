import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import SearchBook from '../components/SearchBook';

export default function Home() {
	const { user } = useAuth();
	const [showGuestSearch, setShowGuestSearch] = useState(false);

	return (
		<div className='max-w-4xl mx-auto px-4 py-8'>
			<h1 className='text-3xl md:text-4xl font-bold text-center mb-8'>
				Book Search
			</h1>

			{user ? (
				// Authenticated user view
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
					<div className='text-center mb-6'>
						<h2 className='text-2xl font-semibold mb-2'>
							Welcome back, {user.username}!
						</h2>
						<p className='text-gray-600 dark:text-gray-400'>
							Search for new books to add to your library
						</p>
					</div>

					<SearchBook />

					<div className='mt-8 text-center'>
						<Link to='/library'>
							<button className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300'>
								Go to My Library
							</button>
						</Link>
					</div>
				</div>
			) : (
				// Guest user view
				<div className='bg-white dark:bg-gray rounded-lg shadow-lg p-8 mb-8'>
					<div className='text-center mb-8'>
						<h2 className='text-2xl font-semibold mb-2'>
							Welcome to Book Search!
						</h2>
						<p className='text-gray-600 dark:text-gray-400 mb-6'>
							Sign up or log in to save books to your personal library.
						</p>

						<div className='flex justify-center space-x-4 mb-8'>
							<Link to='/signup'>
								<button className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300'>
									Sign Up
								</button>
							</Link>
							<Link to='/login'>
								<button className='bg-gray-400 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300'>
									Log In
								</button>
							</Link>
						</div>

						{!showGuestSearch ? (
							<button
								onClick={() => setShowGuestSearch(true)}
								className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline'
							>
								Continue as guest
							</button>
						) : null}
					</div>

					{showGuestSearch && <SearchBook />}
				</div>
			)}
		</div>
	);
}
