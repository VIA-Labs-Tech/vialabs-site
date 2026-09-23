import { build, defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// After the normal build, render every page to HTML at build time.
// Each page then ships as its own file with its words and its own title, description,
// and canonical tag, so crawlers that don't run JavaScript can read the whole site.
// Netlify serves 404.html, with a 404 status, for any address that has no file.
interface PageMeta {
    path: string
    file: string
    title: string
    description: string
    noindex?: boolean
}

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Fails the build if a tag is missing or duplicated, so wrong tags never ship.
function swapOnce(html: string, pattern: RegExp, replacement: string) {
    const matches = html.match(pattern) ?? []
    if (matches.length !== 1) throw new Error(`prerender: expected one match for ${pattern}, found ${matches.length}`)
    return html.replace(pattern, () => replacement)
}

function withMeta(template: string, page: PageMeta, siteUrl: string) {
    const title = escapeAttr(page.title)
    const description = escapeAttr(page.description)
    const url = siteUrl + (page.path === '/' ? '/' : page.path)
    let out = template
    out = swapOnce(out, /<title>[^<]*<\/title>/g, `<title>${title}</title>`)
    out = swapOnce(out, /<meta name="description" content="[^"]*"\s*\/?>/g, `<meta name="description" content="${description}" />`)
    out = swapOnce(out, /<meta property="og:title" content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${title}" />`)
    out = swapOnce(out, /<meta property="og:description" content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${description}" />`)
    out = swapOnce(out, /<meta name="twitter:title" content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${title}" />`)
    out = swapOnce(out, /<meta name="twitter:description" content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${description}" />`)
    if (page.noindex) {
        out = swapOnce(out, /<link rel="canonical" href="[^"]*"\s*\/?>/g, '<meta name="robots" content="noindex" />')
        out = swapOnce(out, /<meta property="og:url" content="[^"]*"\s*\/?>/g, '')
    } else {
        out = swapOnce(out, /<link rel="canonical" href="[^"]*"\s*\/?>/g, `<link rel="canonical" href="${url}" />`)
        out = swapOnce(out, /<meta property="og:url" content="[^"]*"\s*\/?>/g, `<meta property="og:url" content="${url}" />`)
    }
    return out
}

function prerender(): Plugin {
    let config: ResolvedConfig
    return {
        name: 'prerender',
        apply: 'build',
        enforce: 'post',
        configResolved(resolved) {
            config = resolved
        },
        async closeBundle() {
            // The server build below loads this same config; skip there.
            if (config.build.ssr || process.env.VIA_PRERENDER_SSR) return
            const root = config.root
            const outDir = path.resolve(root, config.build.outDir)
            const ssrDir = path.resolve(root, '.prerender')
            process.env.VIA_PRERENDER_SSR = '1'
            try {
                await build({
                    root,
                    configFile: config.configFile,
                    logLevel: 'warn',
                    build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true, copyPublicDir: false },
                })
            } finally {
                delete process.env.VIA_PRERENDER_SSR
            }

            const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
            const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
            const shell = '<div id="root"></div>'
            if (template.split(shell).length !== 2) throw new Error('prerender: expected one empty root element in index.html')

            const all: PageMeta[] = [...server.pages, server.notFoundMeta]
            for (const page of all) {
                const url = page.noindex ? '/__not-found__' : page.path
                const body: string = server.render(url)
                if (!body || body.length < 200) throw new Error(`prerender: ${page.path} rendered almost nothing`)
                const html = withMeta(template, page, server.SITE_URL).replace(shell, () => `<div id="root">${body}</div>`)
                fs.writeFileSync(path.join(outDir, page.file), html)
            }
            fs.rmSync(ssrDir, { recursive: true, force: true })
            config.logger.info(`prerender: wrote ${all.map((p) => p.file).join(', ')}`)
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), prerender()],
    // Keep images as separate files. Inlined logos would make the JavaScript bundle much larger.
    build: { assetsInlineLimit: 0 },
})
