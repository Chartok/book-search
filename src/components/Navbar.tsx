import {
	AppBar,
	Toolbar,
	Button,
	Dialog,
	DialogContent,
	Tab,
	Tabs,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AuthService from '../utils/auth';

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const handleClose = () => setOpen(false);

	return (
		<>
			<AppBar position='static'>
				<Toolbar>
					<Button color='inherit' component={RouterLink} to='/home'>
						Search
					</Button>
					{AuthService.loggedIn() ? (
						<>
							<Button color='inherit' component={RouterLink} to='/saved'>
								Saved Books
							</Button>
							<Button color='inherit' onClick={() => AuthService.logout()}>
								Logout
							</Button>
						</>
					) : (
						<Button color='inherit' onClick={() => setOpen(true)}>
							Login/Sign Up
						</Button>
					)}
				</Toolbar>
			</AppBar>
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
				<Tabs value={tab} onChange={(_e, val) => setTab(val)} centered>
					<Tab label='Login' />
					<Tab label='Sign Up' />
				</Tabs>
				<DialogContent>
					{tab === 0 ? (
						<LoginForm onSuccess={handleClose} />
					) : (
						<SignupForm onSuccess={handleClose} />
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
