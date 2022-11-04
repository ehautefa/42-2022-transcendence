import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ModalProvider } from './context/modal-context';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(<>
	<ModalProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ModalProvider>
</>
);

