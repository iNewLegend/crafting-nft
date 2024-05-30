/* eslint-disable @typescript-eslint/no-explicit-any */

const cache = new Map();

type TUseOptions = {
    cacheTTL?: number;

    fakeDelay?: number;
}

type WrappedPromise = {
    status: 'pending' | 'fulfilled' | 'rejected';
    value: any;
    reason: any;
} & Promise<any>;

function onPromiseFulfilled( promise: WrappedPromise, key: any, result: any ) {
    promise.status = 'fulfilled';
    promise.value = result;

    cache.set( key, promise.value );
}

function onPromiseRejected( promise: WrappedPromise, key: any, reason: any ) {
    promise.status = 'rejected';
    promise.reason = new Error( reason );

    cache.set( key, promise.reason );
}

export function handlePromise( promise: WrappedPromise, key: any ) {
    if ( promise.status === 'pending' ) {
        throw promise;
    }

    promise.status = 'pending';

    promise
        .then( ( result ) => onPromiseFulfilled( promise, key, result ) )
        .catch( ( reason ) => onPromiseRejected( promise, key, reason ) );

    throw promise;
}

// Since `React.use` is still experimental, this is a workaround to use it.
export default function use( callback: () => Promise<any>, options: TUseOptions = {} ) {
    options = Object.assign( {
        cacheTTL: 1000,
        fakeDelay: 0,
    }, options );

    // Create checksum of the callback function.
    const key = callback.toString().split( '' ).reduce( ( a, b ) =>
        ( ( a << 5 ) - a + b.charCodeAt( 0 ) ) | 0, 0 );

    if ( cache.has( key ) ) {
        return cache.get( key );
    }

    const promise = (
        options.fakeDelay ?
            // Self calling async function to simulate a delay.
            ( async () => {
                await new Promise( resolve => setTimeout( resolve, options.fakeDelay ) );

                return await callback();
            } )() :
            callback()
    ) as WrappedPromise;

    promise.catch( () => {} ).finally( () => setTimeout( () => cache.delete( key ), options.cacheTTL ) );

    handlePromise( promise, key );
}
