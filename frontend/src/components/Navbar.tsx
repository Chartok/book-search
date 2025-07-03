import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold">BookSearch</Link>
        <div className="flex gap-4 items-center">
          <Link to="/">Home</Link>
          {user && <Link to="/library">My Library</Link>}
          {user ? (
            <button onClick={logout} className="text-sm">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/signup" className="text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
