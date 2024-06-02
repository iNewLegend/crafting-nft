import React from "react";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";
import type { PinningApiClientBase } from "../../modules/ipfs/apis/pinning-api-client-base.ts";

export type TFetchGatewaysProps<TTypeOfGateway> = {
    ui: ( { gateways }: { gateways: TTypeOfGateway } ) => React.ReactElement;
}

export type TSelectPinningGatewayProps = {
    onSelect: ( pinningApiGateway: typeof PinningApiClientBase ) => void;
};

export type TSelectPublicGatewaysProps = {
    onSelect: ( publicGateways: IPFSPublicGateway[] ) => void;
};
