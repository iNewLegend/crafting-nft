import { ipfsPingingApisGetAll } from "./apis/";

import { type ProxyOptions } from 'vite';

const pinningGateways = ( await ipfsPingingApisGetAll() ).map( gateway => gateway.getDefaultGateway() );

export function ipfsExportProxyForVite() {
    const proxy: Record<string, string | ProxyOptions> = {};

    for ( const [ , gateway ] of Object.entries( pinningGateways ) ) {
        if ( ! gateway.proxy ) {
            continue;
        }

        proxy[ `/${ gateway.proxy.pathname }` ] = {
            target: gateway.fields.endpointUrl,
            changeOrigin: true,
            configure: ( proxy ) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                proxy.on( 'error', ( err, _req, _res ) => {
                    console.debug( 'proxy error', err );
                } );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                proxy.on( 'proxyReq', ( proxyReq, req, _res ) => {
                    console.debug( `Forwarding Request to the Target: ${ req.url } from the Proxy: ${ proxyReq.path }` );
                } );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                proxy.on( 'proxyRes', ( proxyRes, req, _res ) => {
                    console.debug( 'Received Response from the Target:', proxyRes.statusCode, req.url );
                } );
            },
            rewrite: ( path ) => path.replace( `/${ gateway.proxy!.pathname }`, '' ),
        };
    }

    console.debug( proxy );

    return proxy;
}
