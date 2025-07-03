import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import SearchBook from '../components/SearchBook';

export default function Home() {
	const { user } = useAuth();
	const [guest, setGuest] = useState(false);

	return (
		<div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Search</h1>
      {user ? (
        <>
          <SearchBook />
          <div className="mt-4">
            <Link to="/library" className="text-blue-600">Go to My Library</Link>
          </div>
        </>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg borderspace-y-4">
          <p>Sign up or log in to save books to your library.</p>
          <div className="flex gap-4">
            <Link to="/signup" className="text-blue-600 outline rounded-sm border border-blue-600 px-1 py-1 m-1">Sign Up</Link>
            <Link to="/login" className="text-blue-600 outline rounded-sm border border-blue-600 px-1 py-1 m-1">Log In</Link>
          </div>
          {!guest && (
            <button onClick={() => setGuest(true)} className="text-sm text-blue-600 outline rounded-sm border border-blue-600 px-2 py-1">
              Continue as guest
            </button>
          )}
          {guest && <SearchBook />}
        </div>
      )}
    </div>
	);
}
