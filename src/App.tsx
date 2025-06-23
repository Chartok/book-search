import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import HomePage from './pages/HomePage.js';
import SavedBooks from './pages/SavedBooks.js';
import LoginForm from './components/LoginForm.js';
import SignupForm from './components/SignupForm.js';

export default function App() {
	return (
		<div>
			<Navbar />
			<Routes>
				<Route path='/' element={<Navigate to='/home' />} />
				<Route path='/home' element={<HomePage />} />
				<Route path='/saved' element={<SavedBooks />} />
				<Route path='/login' element={<LoginForm />} />
				<Route path='/signup' element={<SignupForm />} />
			</Routes>
		</div>
	);
}
