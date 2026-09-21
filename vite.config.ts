import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Each route gets its own HTML file at build time, so crawlers and link
// previews read that page's title, description, and canonical URL.
// The app itself is unchanged: every file loads the same bundle.
const routePages = [
    {
        file: 'overview.html',
        url: 'https://vialabs.tech/overview',
        title: 'Platform Overview | VIA Labs',
        description: 'How VIA works: your contract sends a message, signers check and sign it, and the contract on the other chain receives it.',
    },
    {
        file: 'use-cases.html',
        url: 'https://vialabs.tech/use-cases',
        title: 'Use Cases | VIA Labs',
        description: 'VIA is built for any application. Some examples: cross-chain games, DeFi, identity, NFTs, governance, and live data feeds.',
    },
]

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

// Fails the build if a tag is missing or duplicated, so wrong tags never ship.
function swapOnce(html: string, pattern: RegExp, replacement: string) {
    const matches = html.match(pattern) ?? []
    if (matches.length !== 1) throw new Error(`route-html: expected one match for ${pattern}, found ${matches.length}`)
    return html.replace(pattern, replacement)
}

function routeHtml(): Plugin {
    return {
        name: 'route-html',
        apply: 'build',
        enforce: 'post',
        generateBundle(_, bundle) {
            const index = bundle['index.html']
            if (!index || index.type !== 'asset') throw new Error('route-html: index.html not found in bundle')
            const html = String(index.source)

            for (const page of routePages) {
                const title = escapeAttr(page.title)
                const description = escapeAttr(page.description)
                let out = html
                out = swapOnce(out, /<title>[^<]*<\/title>/g, `<title>${title}</title>`)
                out = swapOnce(out, /<meta name="description" content="[^"]*"\s*\/?>/g, `<meta name="description" content="${description}" />`)
                out = swapOnce(out, /<link rel="canonical" href="[^"]*"\s*\/?>/g, `<link rel="canonical" href="${page.url}" />`)
                out = swapOnce(out, /<meta property="og:url" content="[^"]*"\s*\/?>/g, `<meta property="og:url" content="${page.url}" />`)
                out = swapOnce(out, /<meta property="og:title" content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${title}" />`)
                out = swapOnce(out, /<meta property="og:description" content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${description}" />`)
                out = swapOnce(out, /<meta name="twitter:title" content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${title}" />`)
                out = swapOnce(out, /<meta name="twitter:description" content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${description}" />`)
                this.emitFile({ type: 'asset', fileName: page.file, source: out })
            }
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), routeHtml()],
})
