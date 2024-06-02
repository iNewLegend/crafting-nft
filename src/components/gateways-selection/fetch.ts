import React from "react";

import type { TFetchGatewaysProps } from "./definitions.ts";
import type { PinningApiClientBase } from "../../modules/ipfs/apis/pinning-api-client-base.ts";

import use from "../../utils/react-use.ts";

import { ipfsPingingApisGetActive } from "../../modules/ipfs/apis";
import { ipfsGetPublicGateways } from "../../modules/ipfs/ipfs-public-gateways.ts";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";

/**
 * Used in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
export const FetchPinningGateways: React.FC<TFetchGatewaysProps<typeof PinningApiClientBase[]>> = ( { ui } ) => {
    const [ gateways ] = React.useState<typeof PinningApiClientBase[]>(
        use( ipfsPingingApisGetActive, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return ui( { gateways } );
};

export const FetchPublicGateways: React.FC<TFetchGatewaysProps<IPFSPublicGateway[]>> = ( { ui } ) => {
    const [ gateways ] = React.useState<IPFSPublicGateway[]>(
        use( ipfsGetPublicGateways, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return ui( { gateways } );
};
