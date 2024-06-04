import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

import { ipfsExportProxyForVite } from "./src/modules/ipfs/ipfs-proxy-for-vite"

const proxy = ipfsExportProxyForVite();

export default defineConfig( {
    plugins: [ react() ],
    server: {
        proxy
    }
} );

