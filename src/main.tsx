import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './sentry'

createRoot(document.getElementById("root")!).render(<App />);
