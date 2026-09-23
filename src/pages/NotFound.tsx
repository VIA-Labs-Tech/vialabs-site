import { Link } from 'react-router-dom';
import { PerspectiveFloor } from '../components/ui';

export function NotFound() {
    return (
        <main className="relative overflow-hidden min-h-[80vh] flex items-center">
            <PerspectiveFloor />
            <div className="container-x relative pt-32 pb-24 text-center">
                <h1 className="h-display text-4xl md:text-6xl">Page not found.</h1>
                <p className="mt-5 text-lg md:text-xl text-body">This address doesn't match a page on our site.</p>
                <Link to="/" className="btn-secondary mt-10">Back to home</Link>
            </div>
        </main>
    );
}
