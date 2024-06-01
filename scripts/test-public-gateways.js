import { createHeliaHTTP } from "@helia/http";

import { httpGatewayRouting } from "@helia/routers";
import { exporter } from "ipfs-unixfs-exporter";

const gatewaysUrl = 'https://raw.githubusercontent.com/ipfs/public-gateway-checker/main/gateways.json';
const knownCID = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';

// Override the Error constructor
const originalError = Error;

// eslint-disable-next-line no-global-assign
Error = function ( ...args ) {
    const error = new originalError( ...args );

    if ( error.message === "socket idle timeout" ) {
        return error;
    }

    throw error;

};

Error.captureStackTrace = function ( error, stackTraceLimit ) {
    return originalError.captureStackTrace( error, stackTraceLimit );
};

async function testPublicGateways() {
    // Fetch the list of gateways
    const response = await fetch( gatewaysUrl );
    const gateways = await response.json();

    const results = [];

    for ( const gateway of gateways ) {
        const heliaHttp = await createHeliaHTTP( {
            routers: [ httpGatewayRouting( { gateways: [ gateway ] } ) ],
        } );

        try {
            const start = Date.now();

            await exporter( knownCID, heliaHttp.blockstore, {} );

            const elapsed = Date.now() - start;

            results.push( { url: gateway, responseTime: elapsed } );
        } catch ( error ) {
            console.log( `${ gateway } errored` );
        }

        await heliaHttp.stop();
    }
    // Sort the results by response time (ascending order)
    results.sort( ( a, b ) => a.responseTime - b.responseTime );

    console.log( 'Gateway test results:' );

    results.forEach( result => {
        console.log( `${ result.url }: ${ result.responseTime } ms` );
    } );

}

testPublicGateways();
