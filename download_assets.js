const fs = require('fs');
const https = require('https');
const path = require('path');

const chains = [
    { name: 'cardano.png', url: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=029' },
    { name: 'solana.png', url: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029' },
    { name: 'tron.png', url: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029' },
    { name: 'cronos.png', url: 'https://cryptologos.cc/logos/cronos-cro-logo.png?v=029' },
    { name: 'stellar.png', url: 'https://cryptologos.cc/logos/stellar-xlm-logo.png?v=029' },
    { name: 'manta.png', url: 'https://cryptologos.cc/logos/manta-network-manta-logo.png?v=029' }, // might fail if redirects
    { name: 'bob.png', url: 'https://icons.llamao.fi/icons/chains/rsz_bob.jpg' },
    { name: 'sonic.png', url: 'https://icons.llamao.fi/icons/chains/rsz_sonic.jpg' },
    { name: 'midnight.png', url: 'https://icons.llamao.fi/icons/chains/rsz_midnight.jpg' },
    { name: 'plasma.png', url: 'https://icons.llamao.fi/icons/chains/rsz_plasma.jpg' }
];

const destDir = path.join(__dirname, 'src/assets/chains');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

chains.forEach(chain => {
    const file = fs.createWriteStream(path.join(destDir, chain.name));
    https.get(chain.url, function (response) {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Downloaded ' + chain.name);
            });
        } else {
            console.error(`Failed to download ${chain.name}: Status ${response.statusCode}`);
            file.close();
            fs.unlink(path.join(destDir, chain.name), () => { });
        }
    }).on('error', function (err) {
        fs.unlink(path.join(destDir, chain.name), () => { });
        console.error('Error downloading ' + chain.name, err.message);
    });
});
