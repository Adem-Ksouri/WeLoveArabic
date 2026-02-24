import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MorphologyProvider } from './context/MorphologyContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <MorphologyProvider>
      <RouterProvider router={router} />
      <Toaster />
    </MorphologyProvider>
  );
}
