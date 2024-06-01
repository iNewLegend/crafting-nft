import React from "react";

import { Button, Image, Input, Textarea } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import use from "../../utils/react-use";

import LoadingDots from "../loading/loading-dots";

import { tabPinImageFormReducer, type TTabPinImageFormState } from "./tab-pin-image/tab-pin-image-state";
import { SelectPinningGateway, SelectPublicGateways } from "./tab-pin-image/tab-pin-image-gateway-selection";

function CreatePinImageForm( props: { provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null } ) {
    const initialState: TTabPinImageFormState = {
        name: '',
        description: '',
        image: null,
        file: null,
        pinningGatewayApi: null,
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
            state.pinningGatewayApi &&
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

            <React.Suspense fallback={ <span className="pb-2 border-2 border-dotted"><LoadingDots/></span> }>
                <SelectPinningGateway onSelect={ ( api ) => {
                    dispatch( { type: "SET_PINNING_GATEWAY_API", payload: { api, name: api.name } } );
                } }/>
            </React.Suspense>

            <React.Suspense fallback={ <span className="pb-2 border-2 border-dotted"><LoadingDots/></span> }>
                <SelectPublicGateways onSelect={ ( gateways ) => {
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
