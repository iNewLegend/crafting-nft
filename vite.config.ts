import react from '@vitejs/plugin-react';

import * as request from 'sync-request';

import { defineConfig } from 'vite';

// Fetch the gateways.json file synchronously
const res = request.default( 'GET', 'https://raw.githubusercontent.com/ipfs/public-gateway-checker/main/gateways.json' );
const gateways = JSON.parse( res.getBody( 'utf8' ) );

// Set up the proxy configuration
const proxy = gateways.reduce( ( acc: { [x: string]: { target: any; changeOrigin: boolean; rewrite: (path: string) => string; }; }, gateway: string ) => {
    const path = gateway.replace( 'https://', '/' );
    acc[ path ] = {
        target: gateway,
        changeOrigin: true,
        rewrite: ( path: string) => path.replace( new RegExp( `^${path}` ), '' )
    };
    return acc;
}, {} );

export default defineConfig( {
    plugins: [ react() ],
    server: {
        proxy
    }
} );

console.log( 'Gateways:', proxy );
