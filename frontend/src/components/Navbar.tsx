import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold bg-neutral-300 border border-neutral-400 px-2 py-1 rounded-md">BookSearch</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="bg-gray-300 rounded-md border border-gray-400 px-2 py-1">Home</Link>
          {user && <Link to="/library" className="bg-gray-300 rounded-md border border-gray-400 px-2 py-1">My Library</Link>}
          {user ? (
            <button onClick={logout} className="text-sm bg-gray-300 rounded-md border border-gray-400 px-2 py-1">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-sm bg-gray-300 rounded-md border border-gray-400 px-2 py-1">Login</Link>
              <Link to="/signup" className="text-sm bg-gray-300 rounded-md border border-gray-400 px-2 py-1">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
