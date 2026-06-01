
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider } from './context/authContext.tsx';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
    <CartProvider>
     <App />
  </CartProvider>
  </AuthProvider>
  
   
  </BrowserRouter>,
)
