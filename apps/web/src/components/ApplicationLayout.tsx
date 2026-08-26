import { Outlet } from 'react-router-dom';
import RetractableSidebar from './utilities/RetractableSidebar';

export default function ApplicationLayout({ setIsLoggedIn }: { setIsLoggedIn: (val: boolean) => void }) {
  

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: '0 auto', padding: '0px' }}>
      <RetractableSidebar setIsLoggedIn={setIsLoggedIn}/>

      {/* 2. The Dynamic Content Window */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>

    </div>
  );
}