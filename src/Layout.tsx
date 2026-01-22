import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export function Layout() {
    return (
        <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-via-teal/20">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}
