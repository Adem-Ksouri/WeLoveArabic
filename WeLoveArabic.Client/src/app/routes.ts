import { createBrowserRouter } from 'react-router';
import RootLayout from './components/RootLayout';
import HomeNew from './pages/HomeNew';
import RootsPageNew from './pages/RootsPageNew';
import SchemasPageNew from './pages/SchemasPageNew';
import GeneratePageNew from './pages/GeneratePageNew';
import ValidatePageNew from './pages/ValidatePageNew';
import DerivedPageNew from './pages/DerivedPageNew';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomeNew,
      },
      {
        path: 'roots',
        Component: RootsPageNew,
      },
      {
        path: 'schemas',
        Component: SchemasPageNew,
      },
      {
        path: 'generate',
        Component: GeneratePageNew,
      },
      {
        path: 'validate',
        Component: ValidatePageNew,
      },
      {
        path: 'derived',
        Component: DerivedPageNew,
      },
    ],
  },
]);
