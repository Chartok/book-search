import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import './index.css';
import App from './App.tsx';
import { client } from './apolloClient';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter basename='/'>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</BrowserRouter>
	</StrictMode>
);
