import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <div className="flex-1">
      <Header />
      <main className="p-6"><Outlet /></main>
    </div>
  </div>
);

export default MainLayout;
