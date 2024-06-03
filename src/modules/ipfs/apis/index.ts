import type { PinningApiBase } from "./pinning-api-base.ts";

const apis: { [ name: string ]: () => Promise<typeof PinningApiBase> } = {
    "dolphin.io": async () => ( await import( "./dolphin.io.ts" ) ).default,
    "pinata.cloud": async () => ( (await import( "./pinata.cloud" ) ).default),
};

let cache: typeof PinningApiBase[] | undefined;

export async function ipfsPingingApisLoad( apiName: string ): Promise<typeof PinningApiBase> {
    if ( cache ) {
        return cache.find( ( api ) => api.name === apiName )!;
    }

    if ( ! apis[ apiName ] ) {
        throw new Error( `Unknown API name: ${ apiName }` );
    }

    return await apis[ apiName ]();
}

export async function ipfsPingingApisGetAll( options = {
    cache: true,
} ) {
    if ( options.cache && cache ) {
        return cache;
    }

    cache = await Promise.all( Object.entries( apis ).map( async ( [ name ] ) => await ipfsPingingApisLoad( name ) ) );

    return cache!;
}

export async function ipfsPingingApisGetActive() {
    return Promise.all(
        ( await ipfsPingingApisGetAll() ).filter( async ( api ) => await api.handshake() )
    );
}
