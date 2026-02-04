import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Manejo de errores global
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Error no manejado:', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('No se encontró el elemento root');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error al renderizar la aplicación:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Error al cargar la aplicación</h1>
      <p>${error.message}</p>
      <p>Por favor, abre la consola del navegador (F12) para ver más detalles.</p>
    </div>
  `;
}
