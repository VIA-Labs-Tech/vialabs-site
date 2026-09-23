import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

export { pages, notFoundMeta, SITE_URL } from './seo';

// Used only at build time: turns one page of the app into HTML.
export function render(url: string): string {
    return renderToString(
        <React.StrictMode>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </React.StrictMode>,
    );
}
