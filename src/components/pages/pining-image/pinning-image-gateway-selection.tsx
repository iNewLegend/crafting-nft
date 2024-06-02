import React from "react";

import { Select, SelectItem, Tooltip } from "@nextui-org/react";

import { ipfsPingingApisGetActive } from "../../../modules/ipfs/apis";
import { ipfsGetPublicGateways } from "../../../modules/ipfs/ipfs-public-gateways";

import type { PinningApiClientBase } from "../../../modules/ipfs/apis/pinning-api-client-base";
import type { IPFSPublicGateway } from "../../../modules/ipfs/ipfs-definitions";

import use from "../../../utils/react-use";

type TFetchGatewaysProps<TTypeOfGateway> = {
    ui: ( { gateways }: { gateways: TTypeOfGateway } ) => React.ReactElement;
}

type TSelectPinningGatewayProps = {
    onSelect: ( pinningApiGateway: typeof PinningApiClientBase ) => void;
};

type TSelectPublicGatewaysProps = {
    onSelect: ( publicGateways: IPFSPublicGateway[] ) => void;
};

const FetchPinningGateways: React.FC<TFetchGatewaysProps<typeof PinningApiClientBase[]>> = ( { ui } ) => {
    const [ gateways ] = React.useState<typeof PinningApiClientBase[]>(
        use( ipfsPingingApisGetActive, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return ui( { gateways } );
};

/**
 * This component exist in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
const FetchPublicGateways: React.FC<TFetchGatewaysProps<IPFSPublicGateway[]>> = ( { ui } ) => {
    const [ gateways ] = React.useState<IPFSPublicGateway[]>(
        use( ipfsGetPublicGateways, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return ui( { gateways } );
};

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

export const SelectPublicGateways: React.FC<TSelectPublicGatewaysProps> = ( { onSelect } ) => {
    const [ selectedPublicGateways, setSelectedPublicGateways ] = React.useState<string[]>( [] );

    const onGatewaysChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        const selectedKeys = event.target.value.split( "," );

        setSelectedPublicGateways( selectedKeys );
    };

    const onGatewaysSet = ( gateways: IPFSPublicGateway[]  ) => {
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
