import React from "react";

import { Button, Image, Input, Select, SelectItem, Textarea, Tooltip } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import { ipfsPingingApisGetActive } from "../../modules/ipfs/apis";
import { ipfsGetPublicGateways } from "../../modules/ipfs/ipfs-public-gateways.ts";

import use from "../../utils/react-use.ts";

import type { PiningApiClientBase } from "../../modules/ipfs/apis/pining-api-client-base.ts";
import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";

import { tabPinImageFormReducer, type TTabPinImageFormState } from "./tab-ping-image/tab-pin-image-state.ts";

function FetchPiningGateways( props: {
    ui: ( { piningApiGateways }: { piningApiGateways: typeof PiningApiClientBase[] } ) => React.ReactElement;
} ) {
    const [ gateways ] = React.useState<typeof PiningApiClientBase[]>(
        use( ipfsPingingApisGetActive, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return props.ui( { piningApiGateways: gateways } );
}

/**
 * This component exist in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
function FetchPublicGateways( props: {
    ui: ( { gateways }: { gateways: IPFSPublicGateway[] } ) => React.ReactElement;
} ) {
    const [ gateways ] = React.useState<IPFSPublicGateway[]>(
        use( ipfsGetPublicGateways, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return props.ui( { gateways } );
}

function SelectPiningGateway( props: {
    onSelect: ( piningApiGateway: typeof PiningApiClientBase ) => void
} ) {
    const [ selectedPiningGateway, setSelectedPiningGateway ] = React.useState( -1 );

    return (
        <Tooltip color="primary" closeDelay={ 100 } placement={ "right" } showArrow={ true }
                 content={
                     <div className="px-1 py-2">
                         <div className="text-small font-bold">Pining IPFS Gateways</div>
                         <div className="text-tiny">Select gateways for pinning the content on IPFS</div>
                     </div>
                 }>
            <div>
                <FetchPiningGateways ui={
                    ( { piningApiGateways } ) => (
                        <Select
                            color="primary"
                            isRequired={ selectedPiningGateway === -1 }
                            items={ piningApiGateways }
                            label="IPFS Pining Gateway"
                            placeholder="Select a gateway"
                            selectedKeys={ [ selectedPiningGateway.toString() ] }
                            onChange={ ( e ) => {
                                const selectedIndex = Number( e.target.value );

                                setTimeout( () => props.onSelect( piningApiGateways[ selectedIndex ] ) );

                                setSelectedPiningGateway( selectedIndex );
                            } }
                        >
                            { gateway => (
                                <SelectItem key={ piningApiGateways.indexOf( gateway ) }>
                                    { gateway.getName() }
                                </SelectItem>
                            ) }
                        </Select>
                    )
                }/>
            </div>
        </Tooltip>
    );
}

function SelectPublicGateway( props: {
    onSelect: ( gateways: IPFSPublicGateway[] ) => void
} ) {
    const [ selectedPublicGateways, setSelectedPublicGateways ] = React.useState<string[]>( [] );

    const onChange = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        const selectedKeys = event.target.value.split( "," );

        setSelectedPublicGateways( selectedKeys );
    };

    return (
        <Tooltip color="secondary" closeDelay={ 100 } placement={ "right" } showArrow={ true }
                 content={
                     <div className="px-1 py-2">
                         <div className="text-small font-bold">Public IPFS Gateways</div>
                         <div className="text-tiny">The selected gateways will be used<br/>to check when the
                             pinned image is available over IPFS
                         </div>
                     </div>
                 }>
            <div>
                <FetchPublicGateways ui={
                    ( { gateways } ) => (

                        <Select
                            color="secondary"
                            isRequired={ ! selectedPublicGateways.length }
                            selectionMode="multiple"
                            items={ gateways }
                            label="IPFS Public Gateway"
                            placeholder="Select a gateway"
                            selectedKeys={ selectedPublicGateways }
                            onChange={ onChange }
                            onClose={ () => {
                                const keysToGateways = gateways.filter( ( gateway ) =>
                                    selectedPublicGateways.includes( gateways.indexOf( gateway ).toString() )
                                );

                                props.onSelect( keysToGateways );
                            } }
                        >
                            { ( gateway =>
                                    <SelectItem key={ gateways.indexOf( gateway ) }
                                                endContent={ <span>{ gateway.responseTime }ms</span> }>
                                        { gateway.name }
                                    </SelectItem>
                            ) }
                        </Select>
                    )
                }/>
            </div>
        </Tooltip>

    );
}

function CreatePinImageForm( props: { provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null } ) {
    const initialState: TTabPinImageFormState = {
        name: '',
        description: '',
        image: null,
        file: null,
        piningGatewayApi: null,
        publicGateways: [],
    };

    const [ state, dispatch ] = React.useReducer( tabPinImageFormReducer, initialState );

    const handleImage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[ 0 ];
        if ( file ) {
            const reader = new FileReader();
            reader.onload = ( e ) => {
                dispatch( {
                    type: 'SET_IMAGE_FILE',
                    payload: { image: e.target?.result as ArrayBuffer, file },
                } );
            };
            reader.readAsDataURL( file );
        }
    };

    const canSubmit = () => {
        return !! (
            state.name.length &&
            state.description.length &&
            state.image &&
            state.piningGatewayApi &&
            state.publicGateways.length &&
            state.file?.name
        );
    };

    const handleUpload = async () => {
        if ( ! canSubmit() ) {
            return;
        }
        // Implement the upload logic
    };

    if ( ! props.provider ) {
        return <h1>To create an NFT, you need to have MetaMask installed.</h1>;
    }

    return (
        <div className="flex flex-col gap-4">
            <Input
                isRequired={ ! state.name.length }
                label="Name"
                value={ state.name }
                onValueChange={ ( value ) => dispatch( { type: 'SET_NAME', payload: value } ) }
            />
            <Textarea
                isRequired={ ! state.description.length }
                label="Description"
                value={ state.description }
                onValueChange={ ( value ) => dispatch( { type: 'SET_DESCRIPTION', payload: value } ) }
            />

            <input
                required
                type="file"
                onChange={ handleImage }
            />

            { state.image && <Image src={ URL.createObjectURL( state.file! ) }/> }

            <React.Suspense fallback={ <p>Loading...</p> }>
                <SelectPiningGateway onSelect={ ( api ) => {
                    dispatch( { type: "SET_PINING_GATEWAY_API", payload: { api, name: api.name } } );
                } }/>
            </React.Suspense>

            <React.Suspense fallback={ <p>Loading...</p> }>
                <SelectPublicGateway onSelect={ ( gateways ) => {
                    dispatch( { type: 'SET_PUBLIC_GATEWAYS', payload: gateways } );
                } }/>
            </React.Suspense>

            <Button isDisabled={ ! canSubmit() } onClick={ handleUpload }>
                Create NFT
            </Button>
        </div>
    );
}

export function TabPinImage() {
    // This will trigger the `Suspense` above...
    const provider = use( detectEthereumProvider );

    return (
        <CreatePinImageForm provider={ provider }/>
    );
}
