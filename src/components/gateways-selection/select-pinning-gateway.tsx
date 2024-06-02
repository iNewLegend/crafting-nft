import React from "react";
import type { TSelectPinningGatewayProps } from "./definitions.ts";
import type { PinningApiClientBase } from "../../modules/ipfs/apis/pinning-api-client-base.ts";
import { SelectItem, Select, Tooltip } from "@nextui-org/react";
import { FetchPinningGateways } from "./fetch.ts";

export const SelectPinningGateway: React.FC<TSelectPinningGatewayProps> = ( { onSelect } ) => {
    const [ selectedPinningGateway, setSelectedPinningGateway ] = React.useState( -1 );

    const onGatewayChange = ( e: React.ChangeEvent<HTMLSelectElement>, gateways: typeof PinningApiClientBase[] ) => {
        const selectedIndex = Number( e.target.value );

        setTimeout( () => onSelect( gateways[ selectedIndex ] ) );

        setSelectedPinningGateway( selectedIndex );
    };

    const renderGateway = ( { gateway, key }: { gateway: typeof PinningApiClientBase, key: string } ) => (
        <SelectItem key={ key }>
            { gateway.getName() }
        </SelectItem>
    );

    const renderGateways = ( { gateways }: { gateways: typeof PinningApiClientBase[] } ) => (
        <Select
            color="primary"
            label="IPFS Pinning Gateway"
            placeholder="Select a gateway"
            items={ gateways }
            selectedKeys={ [ selectedPinningGateway.toString() ] }
            onChange={ ( e ) => onGatewayChange( e, gateways ) }
            isRequired={ selectedPinningGateway === -1 }
        >
            { gateway => renderGateway( { gateway, key: gateways.indexOf( gateway ).toString() } ) }
        </Select>
    );

    const TooltipContents = (
        <div className="px-1 py-2">
            <div className="text-small font-bold">Pinning Gateways</div>
            <div className="text-tiny">The selected gateway will be used to pin the image to IPFS</div>
        </div>
    );

    return (
        <Tooltip color="primary" closeDelay={ 100 } placement={ "right" } showArrow={ true }
                 content={ TooltipContents }>
            <div><FetchPinningGateways ui={ ( { gateways } ) => renderGateways( { gateways } ) }/></div>
        </Tooltip>
    );
};
