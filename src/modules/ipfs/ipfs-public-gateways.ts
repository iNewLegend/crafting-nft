import { trustlessGateway } from "@helia/block-brokers";
import { createHeliaHTTP } from "@helia/http";

import { httpGatewayRouting } from "@helia/routers";
import { unixfs, type GetEvents } from "@helia/unixfs";
import { CID } from 'multiformats/cid';

import publicGateways from "./assets/public-gateways.json"

import {
    type IPFSPublicGateway,
    DEFAULT_IPFS_TEST_HASH,
    DEFAULT_IPFS_LIST_TIMEOUT,
    DEFAULT_IPFS_CAT_TIMEOUT
} from "./ipfs-definitions";
import { ipfsCreateHeliaWithinGateways, ipfsCreateTimoutAbortController } from "./ipfs-utils.ts";

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
                signal: ipfsCreateTimoutAbortController( DEFAULT_IPFS_LIST_TIMEOUT ).signal
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


export async function ipfsCatCidFromPublicGateways( cid: string, gateways: Array<IPFSPublicGateway> ) {
    const result: {
        status: boolean,
        urlsResponded: Array<string>,
        blocks: Array<Uint8Array>,
        progress: Array<GetEvents>
    } = {
        status: false,
        urlsResponded: [],
        blocks: [],
        progress: [],
    };

    const ipfs = await ipfsCreateHeliaWithinGateways( gateways );

    const originalFetch = fetch;

    /**
     * Since helia does not provide way to get statistics, or any "valid" way to get more information
     * we hook into fetch to determine which gateways returned OK.
     */
    window.fetch = async ( url, init ) => {
        const response = await originalFetch( url, init );

        // Check if url is within gateways.
        for ( const gateway of gateways ) {
            if ( gateway.url.includes( new URL( url.toString() ).hostname ) ) {
                result.urlsResponded.push( url.toString() );
            }
        }

        return response;
    };

    const unixFs = unixfs( ipfs );

    const it = unixFs.cat( CID.parse( cid ), {
        signal: ipfsCreateTimoutAbortController( DEFAULT_IPFS_CAT_TIMEOUT ).signal,
        onProgress: ( e ) => result.progress.push( e )
    } )[ Symbol.asyncIterator ]();


    let current;
    do {
        current = await it.next();
        if ( current.value ) {
            result.blocks.push( current.value );
        }

    } while ( current.done === false );

    await ipfs.stop();

    // Restore fetch.
    window.fetch = originalFetch;

    result.status = !! current.done;

    return result;
}


