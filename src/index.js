import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';         
import 'primeicons/primeicons.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


reportWebVitals();
