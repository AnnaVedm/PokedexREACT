import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import AppRoutes from './router';

/**
 * React-компонент приложения.
 * @function
 * @name App
 * @description Главный компонент приложения "".
 */
const App = () => {

  return (
    <div className='p-3 grid gap-5'>
      <BrowserRouter>
        <Suspense fallback={<div>Идет загрузка...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
      <Toaster position='bottom-center' />
    </div>
  );
};

export default App;
