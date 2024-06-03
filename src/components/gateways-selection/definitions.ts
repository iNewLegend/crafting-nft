import React from "react";

import { type SelectProps } from "@nextui-org/react";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";
import type { PinningApiBase } from "../../modules/ipfs/apis/pinning-api-base.ts";

export type TFetchGatewaysProps<TTypeOfGateway> = {
    ui: ( { gateways }: { gateways: TTypeOfGateway } ) => React.ReactElement;
}

export type TSelectPinningGatewayProps = {
    onSelect: ( pinningApiGateway: typeof PinningApiBase ) => void;

    /**
     * @default "primary"
     */
    color?: SelectProps[ 'color' ];

    tooltipContent?: React.ReactNode;
};

export type TSelectPublicGatewaysProps = {
    onSelect: ( publicGateways: IPFSPublicGateway[] ) => void;
};
