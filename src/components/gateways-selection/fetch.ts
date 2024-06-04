import React from "react";

import type { TFetchGatewaysProps } from "./definitions.ts";
import type { PinningApiBase } from "../../modules/ipfs/apis/pinning-api-base.ts";

import use from "../../utils/react-use.ts";

import { ipfsPingingApisGetActive } from "../../modules/ipfs/apis";
import { ipfsGetPublicGateways } from "../../modules/ipfs/ipfs-public-gateways.ts";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";

const IPFS_PUBLIC_GATEWAYS_CACHE_TTL = 1000 * 60 * 15,
    IPFS_PINNING_GATEWAYS_CACHE_TTL = 1000 * 60 * 15;

const IPFS_PUBLIC_GATEWAYS_CACHE_TTL_KEY = "ipfs-public-gateways-ttl",
    IPFS_PUBLIC_GATEWAYS_CACHE_KEY = "ipfs-public-gateways";

/**
 * Used in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
export const FetchPinningGateways: React.FC<TFetchGatewaysProps<typeof PinningApiBase[]>> = ( { ui } ) => {
    const [ gateways ] = React.useState<typeof PinningApiBase[]>(
        use( ipfsPingingApisGetActive, {
            cacheTTL: IPFS_PINNING_GATEWAYS_CACHE_TTL,
        } )
    );

    return ui( { gateways } );
};

export const FetchPublicGateways: React.FC<TFetchGatewaysProps<IPFSPublicGateway[]>> = ( { ui, useStorageCache } ) => {
    function getData() {
        if ( useStorageCache ) {
            const cacheTTL = localStorage.getItem( IPFS_PUBLIC_GATEWAYS_CACHE_TTL_KEY );

            if ( cacheTTL ) {
                const ttl = parseInt( cacheTTL );

                if ( ttl > Date.now() ) {
                    const cachedData = localStorage.getItem( IPFS_PUBLIC_GATEWAYS_CACHE_KEY );

                    if ( cachedData ) {
                        return JSON.parse( cachedData );
                    }
                }
            }

            const gateways = use( ipfsGetPublicGateways, {
                cacheTTL: IPFS_PUBLIC_GATEWAYS_CACHE_TTL,
            } );

            localStorage.setItem( IPFS_PUBLIC_GATEWAYS_CACHE_TTL_KEY, ( Date.now() + IPFS_PUBLIC_GATEWAYS_CACHE_TTL ).toString() );
            localStorage.setItem( IPFS_PUBLIC_GATEWAYS_CACHE_KEY, JSON.stringify( gateways ) );

            return gateways;
        }
    }

    const [ gateways ] = React.useState<IPFSPublicGateway[]>( getData() );

    return ui( { gateways } );
};
