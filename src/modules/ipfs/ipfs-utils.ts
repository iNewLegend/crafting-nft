import { createHeliaHTTP } from "@helia/http";
import { httpGatewayRouting } from "@helia/routers";
import { trustlessGateway } from "@helia/block-brokers";
import { importer } from 'ipfs-unixfs-importer';

import { MemoryBlockstore } from 'blockstore-core/memory'

import type { IPFSPublicGateway } from "./ipfs-definitions.ts";

export async function ipfsCreateHeliaWithinGateways( gateways: Array<IPFSPublicGateway> ) {
    return await createHeliaHTTP( {
        routers: [ httpGatewayRouting( { gateways: gateways.map( ( gateway ) => gateway.url ) } ) ],
        blockBrokers: [
            trustlessGateway( { allowLocal: true, allowInsecure: true } ),
        ],
    } );
}

export function ipfsCreateTimoutAbortController( timeout: number ) {
    return new class extends AbortController {
        constructor() {
            super();

            setTimeout( () => {
                this.abort();
            }, timeout );
        }
    }
}

/**
 * Generate cid that used in pinning services.
 */
export async function ipfsGenerateCidFromFile( file: File ) {
    return new Promise( ( resolve, reject ) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
            if ( reader.result ) {
                const fileCandidate = {
                    path: file.name,
                    content: new Uint8Array( reader.result as ArrayBuffer ),
                };

                // @ts-expect-error ts(2339)
                const result = importer( fileCandidate, new MemoryBlockstore(), {
                    cidVersion: 0,
                    onlyHash: true,
                    hashAlg: "sha2-256",
                } );

                const it = await result.next();

                resolve( it.value!.cid.toString() );
            } else {
                reject( new Error( 'FileReader result is null' ) );
            }
        };

        reader.onerror = () => {
            reject( new Error( 'Failed to read file' ) );
        };

        reader.readAsArrayBuffer( file );
    } );
};
