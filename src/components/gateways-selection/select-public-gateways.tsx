import React from "react";

import { SelectItem, Select, Tooltip } from "@nextui-org/react";
import { FetchPublicGateways } from "./fetch.ts";

import type { TSelectPublicGatewaysProps } from "./definitions.ts";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";

export const SelectPublicGateways: React.FC<TSelectPublicGatewaysProps> = ( { onSelect } ) => {
    const [ selectedPublicGateways, setSelectedPublicGateways ] = React.useState<string[]>( [] );

    const onGatewaysChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        const selectedKeys = event.target.value.split( "," );

        setSelectedPublicGateways( selectedKeys );
    };

    const onGatewaysSet = ( gateways: IPFSPublicGateway[] ) => {
        const keysToGateways = gateways.filter( ( gateway ) =>
            selectedPublicGateways.includes( gateways.indexOf( gateway ).toString() )
        );

        onSelect( keysToGateways );

        setSelectedPublicGateways( keysToGateways.map( ( gateway ) => gateways.indexOf( gateway ).toString() ) );
    };

    const renderGateway = ( { gateway, key }: { gateway: IPFSPublicGateway, key: string } ) => (
        <SelectItem key={ key }>
            { gateway.name }
        </SelectItem>
    );

    const renderGateways = ( { gateways }: { gateways: IPFSPublicGateway[] } ) => (
        <Select
            selectionMode="multiple"
            color="secondary"
            label="IPFS Public Gateway"
            placeholder="Select a gateway"
            items={ gateways }
            selectedKeys={ selectedPublicGateways }
            onChange={ onGatewaysChange }
            onClose={ () => onGatewaysSet( gateways ) }
            isRequired={ ! selectedPublicGateways.length }
        >
            { gateway => renderGateway( { gateway, key: gateways.indexOf( gateway ).toString() } ) }
        </Select>
    );

    const TooltipContents = (
        <div className="px-1 py-2">
            <div className="text-small font-bold">Public IPFS Gateways</div>
            <div className="text-tiny">The selected gateways will be used to check when the pinned image is available
                over IPFS
            </div>
        </div>
    );

    return (
        <Tooltip color="secondary" closeDelay={ 100 } placement={ "right" } showArrow={ true }
                 content={ TooltipContents }>
            <div><FetchPublicGateways ui={ ( { gateways } ) => renderGateways( { gateways } ) }/></div>
        </Tooltip>
    );
};
