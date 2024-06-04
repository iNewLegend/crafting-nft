import React from "react";

import { type SelectProps } from "@nextui-org/react";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";
import type { PinningApiBase } from "../../modules/ipfs/apis/pinning-api-base.ts";

export type TFetchGatewaysProps<TTypeOfGateway> = {
    ui: ( { gateways }: { gateways: TTypeOfGateway } ) => React.ReactElement;

    useStorageCache?: boolean;
}

export type TSelectPinningGatewayProps = {
    onSelect: ( pinningApiGateway: typeof PinningApiBase ) => void;

    isDisabled?: boolean;

    /**
     * @default "primary"
     */
    color?: SelectProps[ 'color' ];

    tooltipContent?: React.ReactNode;
};

export type TSelectPublicGatewaysProps = {
    isDisabled?: boolean;

    onSelect: ( publicGateways: IPFSPublicGateway[] ) => void;
};
