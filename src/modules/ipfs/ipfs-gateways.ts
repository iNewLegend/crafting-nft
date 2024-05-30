// TODO: Those should be in .ENV file
// URL of the gateways list
import type { IPFSGateway } from "./ipfs-definitions.ts";

const gatewaysUrl: string = 'https://raw.githubusercontent.com/ipfs/public-gateway-checker/main/gateways.json';

// IPFS hash to test with
const hash: string = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';


export async function ipfsGetGateways( options = {
    sortByResponseTime: true,
    filterByOnline: true,
    useCorsProxy: true
} ) {
    // Fetch the list of gateways
    const response = await fetch( gatewaysUrl );
    const gateways: string[] = await response.json();

    const results: IPFSGateway[] = [];

    for ( const gateway of gateways ) {
        const baseURL = gateway.replace( ':hash', hash ),
            url: string = options.useCorsProxy ? baseURL.replace( "https://", "" ) : baseURL;

        const name: string = new URL( gateway ).hostname;

        try {
            const start: number = Date.now();
            const response = await fetch( url );
            const elapsed: number = Date.now() - start;

            if ( options.filterByOnline && ! response.ok ) {
                continue;
            }

            results.push( { url: gateway, responseTime: elapsed, name } );
        } catch ( error ) {
            if ( options.filterByOnline ) {
                continue;
            }

            results.push( { url: gateway, responseTime: Infinity, name } );
        }
    }

    // Sort the results by response time (ascending order)
    if ( options.sortByResponseTime ) {
        results.sort( ( a, b ) => a.responseTime - b.responseTime );
    }


    return results;
}

