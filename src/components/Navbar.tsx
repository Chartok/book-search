import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.js';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      <Link to="/saved">Saved Books</Link> |{' '}
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
