/**
 * Главный файл приложения, отвечающий за рендеринг корневого компонента в DOM.
 * @module index
 */

import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App.tsx';

/**
 * Создает корневой элемент приложения и рендерит в него компонент `App`.
 * @function
 * @param {string} 
 * @returns {void}
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);
