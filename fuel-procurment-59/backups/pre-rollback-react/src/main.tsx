import {createRoot} from 'react-dom/client';
import App,{ErrorBoundary} from './App';
import '../styles.css';
import '../driver-sales.css';
import './styles.css';
createRoot(document.getElementById('root')!).render(<ErrorBoundary><App/></ErrorBoundary>);
