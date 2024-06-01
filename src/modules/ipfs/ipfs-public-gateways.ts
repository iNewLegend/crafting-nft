import { trustlessGateway } from "@helia/block-brokers";
import { createHeliaHTTP } from "@helia/http";

import { httpGatewayRouting } from "@helia/routers";
import { unixfs } from "@helia/unixfs";
import { CID } from 'multiformats/cid';

import publicGateways from "./assets/public-gateways.json"

import type { IPFSPublicGateway } from "./ipfs-definitions";

const DEFAULT_IPFS_TEST_HASH: string = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    DEFAULT_IPFS_GATEWAY_TIMEOUT: number = 5000;

export async function ipfsGetPublicGateways( options = {
    sortByResponseTime: true,
    useCorsProxy: false,
} ) {
    const results: Array<IPFSPublicGateway> = [];

    const testCid = CID.parse( DEFAULT_IPFS_TEST_HASH );

    for ( const gateway of publicGateways ) {
        const gatewayURL = options.useCorsProxy ?
            location.origin + "/" + gateway.replace( "https://", "" ) :
            gateway;

        const heliaHttp = await createHeliaHTTP( {
            routers: [ httpGatewayRouting( { gateways: [ gatewayURL ] } ) ],
            blockBrokers: [
                trustlessGateway( { allowLocal: true, allowInsecure: true } ),
            ],
        } );

        const unixFs = unixfs( heliaHttp );

        const name: string = new URL( gateway ).hostname;

        try {
            const start = Date.now();

            const result = await unixFs.ls( testCid, {
                signal: ( new class extends AbortController {
                    constructor() {
                        super();

                        setTimeout( () => {
                            this.abort();
                        }, DEFAULT_IPFS_GATEWAY_TIMEOUT );
                    }
                } ).signal
            } )[ Symbol.asyncIterator ]().next();

            // TODO: Find better way to check result.
            if ( result.value.name === "about" ) {
                const elapsed = Date.now() - start;

                results.push( { url: gateway, responseTime: elapsed, name } );
            }
        } catch ( error ) { /* empty */
        } finally {
            await heliaHttp.stop();
        }
    }

    // Sort by response time.
    if ( options.sortByResponseTime ) {
        results.sort( ( a, b ) => a.responseTime - b.responseTime );
    }

    return results;
}

