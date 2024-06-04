
import { MemoryBlockstore } from 'blockstore-core/memory'

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
