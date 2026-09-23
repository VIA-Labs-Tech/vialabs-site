// Chain logos, one light-mode and one dark-mode file per chain, keyed by chain ID or name.
const lightFiles = import.meta.glob('./assets/chains/lightmode/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const darkFiles = import.meta.glob('./assets/chains/darkmode/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

const keyOf = (file: string) =>
    file.split('/').pop()!
        .replace(/\.webp$/, '')
        .toLowerCase()
        .replace(/-rgb_symbol-black$/, '')
        .replace(/_icon_(black|white)$/, '')
        .replace(/_(white|black)$/, '');

export interface ChainLogo {
    key: string;
    light: string;
    dark: string;
}

const dark = new Map(Object.entries(darkFiles).map(([file, url]) => [keyOf(file), url]));

export const chainLogos: ChainLogo[] = Object.entries(lightFiles).map(([file, url]) => {
    const key = keyOf(file);
    return { key, light: url, dark: dark.get(key) ?? url };
});

export function chainLogo(key: string): ChainLogo | undefined {
    return chainLogos.find((c) => c.key === key);
}
