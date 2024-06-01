import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

import { ipfsExportProxyForVite } from "./src/modules/ipfs/ipfs-utils"

const proxy = ipfsExportProxyForVite();

export default defineConfig( {
    plugins: [ react() ],
    server: {
        proxy
    }
} );

