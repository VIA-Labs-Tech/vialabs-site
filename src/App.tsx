import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { UseCases } from './pages/UseCases';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

// Reset scroll on page change, or jump to the section named in the address.
function ScrollManager() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);
    return null;
}

// The router comes from the entry file: BrowserRouter in the browser, StaticRouter at build time.
function App() {
    return (
        <>
            <ScrollManager />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="overview" element={<HowItWorks />} />
                    <Route path="use-cases" element={<UseCases />} />
                    <Route path="about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
