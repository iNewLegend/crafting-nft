/* eslint-disable @typescript-eslint/no-explicit-any */

const cache = new Map();

type WrappedPromise = {
    status: 'pending' | 'fulfilled' | 'rejected';
    value: any;
    reason: any;
} & Promise<any>;

export function handlePromise( promise: WrappedPromise, key: any ) {
    if ( promise.status === 'pending' ) {
        throw promise;
    }

    promise.status = 'pending';

    promise.then(
        result => onPromiseFulfilled( promise, key, result ),
        reason => onPromiseRejected( promise, key, reason ),
    );

    throw promise;
}

function onPromiseFulfilled( promise: WrappedPromise, key: any, result: any ) {
    cache.set( key, result );

    promise.status = 'fulfilled';
    promise.value = result;
}

function onPromiseRejected( promise: WrappedPromise, key: any, reason: any ) {
    cache.set( key, reason );

    promise.status = 'rejected';
    promise.reason = reason;
}

// Since `React.use` is still experimental, this is a workaround to use it.
export default function use( callback: () => Promise<any> ) {
    const promise = callback() as WrappedPromise,
        // Create checksum of the callback function.
        key = callback.toString().split( '' ).reduce( ( a, b ) =>
            ( ( a << 5 ) - a + b.charCodeAt( 0 ) ) | 0, 0 );


    if ( cache.has( key ) ) {
        const value = cache.get( key );

        promise.finally( () => cache.delete( key ) );

        return value;
    }

    if ( promise.status === 'fulfilled' ) {
        return promise.value;
    } else if ( promise.status === 'rejected' ) {
        throw promise.reason;
    } else {
        handlePromise( promise, key );
    }
}