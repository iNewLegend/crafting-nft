import React from "react";

import { SelectItem, Select, Tooltip } from "@nextui-org/react";
import { FetchPinningGateways } from "./fetch.ts";

import type { TSelectPinningGatewayProps } from "./definitions.ts";
import type { PinningApiBase } from "../../modules/ipfs/apis/pinning-api-base.ts";

export const SelectPinningGateway: React.FC<TSelectPinningGatewayProps> = ( {
    onSelect,
    isDisabled = false,
    color = "primary",
    tooltipContent,
} ) => {
    const [ selectedPinningGateway, setSelectedPinningGateway ] = React.useState( -1 );

    const onGatewayChange = ( e: React.ChangeEvent<HTMLSelectElement>, gateways: typeof PinningApiBase[] ) => {
        const selectedIndex = Number( e.target.value );

        setTimeout( () => onSelect( gateways[ selectedIndex ] ) );

        setSelectedPinningGateway( selectedIndex );
    };

    const renderGateway = ( { gateway, key }: { gateway: typeof PinningApiBase, key: string } ) => (
        <SelectItem key={ key }>
            { gateway.getName() }
        </SelectItem>
    );

    const renderGateways = ( { gateways }: { gateways: typeof PinningApiBase[] } ) => (
        <Select
            color={ color }
            label="IPFS Pinning Gateway"
            placeholder="Select a gateway"
            items={ gateways }
            selectedKeys={ [ selectedPinningGateway.toString() ] }
            onChange={ ( e ) => onGatewayChange( e, gateways ) }
            isRequired={ selectedPinningGateway === -1 }
            isDisabled={ isDisabled }
        >
            { gateway => renderGateway( { gateway, key: gateways.indexOf( gateway ).toString() } ) }
        </Select>
    );

    const Wrapper: React.FC<React.PropsWithChildren> = ( { children } ) => (
        tooltipContent ?
            <Tooltip color="primary" closeDelay={ 100 } placement={ "right" } showArrow={ true }
                     content={ <div className="px-1 py-2">
                         <div className="text-small font-bold">Pinning Gateways</div>
                         <div className="text-tiny">{ tooltipContent } </div>
                     </div> }>
                { children }
            </Tooltip> : <>{ children }</>
    );

    return (
        <Wrapper>
            <div><FetchPinningGateways ui={ ( { gateways } ) => renderGateways( { gateways } ) }/></div>
        </Wrapper>
    );
};
