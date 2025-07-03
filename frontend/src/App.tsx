import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { useAuth } from './context/authUtils';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

// Lazy-load the Library page for better performance
const Library = lazy(() => import('./pages/Library'));

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return <div className='p-4'>Loading...</div>;

	if (!user) {
		return <Navigate to='/' replace />;
	}

	return <>{children}</>;
}

// Guest route component
function GuestRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return <div className='p-4'>Loading...</div>;

	if (user) {
		return <Navigate to='/' replace />;
	}

	return <>{children}</>;
}

// App content component that uses hooks
function AppContent() {
	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />
			<div className='container mx-auto px-4 py-6 flex-grow'>
				<Suspense
					fallback={
						<div className='flex-grow p-4'>
							Loading page...
						</div>
					}
				>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route
							path='/signup'
							element={
								<GuestRoute>
									<SignupPage />
								</GuestRoute>
							}
						/>
						<Route
							path='/login'
							element={
								<GuestRoute>
									<LoginPage />
								</GuestRoute>
							}
						/>
						<Route
							path='/library'
							element={
								<ProtectedRoute>
									<Library />
								</ProtectedRoute>
							}
						/>
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</Suspense>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<LibraryProvider>
				<AppContent />
			</LibraryProvider>
		</AuthProvider>
	);
}
