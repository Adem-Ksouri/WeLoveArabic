import { Outlet } from 'react-router';
import Layout from './Layout';

export default function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
