import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/authUtils';
import AuthModal from './AuthModal';
import Button from './Button';
import styles from './Navbar.module.css';

export default function Navbar() {
	const { user, logout, loading } = useAuth();
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav className={styles.nav}>
				<Link to='/' className={styles.brand}>
					📚 BookSearch
				</Link>
				<div className={styles.links}>
					<Link to='/'>Home</Link>
					{user && <Link to='/library'>My library</Link>}
				</div>
				{loading ? (
					<span>Loading...</span>
				) : user ? (
					<div className={styles.userBox}>
						<span>Welcome, {user.username || user.email}</span>
						<Button onClick={logout}>Logout</Button>
					</div>
				) : (
					<Button onClick={() => setOpen(true)}>Login / Register</Button>
				)}
			</nav>
			<AuthModal open={open} onClose={() => setOpen(false)} />
		</>
	);
}
