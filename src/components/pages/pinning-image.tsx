import React from "react";

import { Button, Image, Input, Snippet } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import use from "../../utils/react-use";

import LoadingDots from "../loading/loading-dots";
import ErrorResponse from "../error-handling/error-response.tsx";

import { pinningImageFormReducer, type TPinningImageFormState } from "./pining-image/pinning-image-state";

import { SelectPublicGateways } from "../gateways-selection/select-public-gateways.tsx";
import { SelectPinningGateway } from "../gateways-selection/select-pinning-gateway.tsx";

import { ipfsCatCidFromPublicGateways } from "../../modules/ipfs/ipfs-public-gateways.ts";
import { ipfsGenerateCidFromFile } from "../../modules/ipfs/ipfs-utils.ts";

const initialState: TPinningImageFormState = {
    name: "",
    image: null,
    file: null,
    pinningGatewayApi: null,
    publicGatewaysResult: null,
    publicGateways: [],
    errorResponse: null,
    loadingState: false,
};

function usePinningImageForm() {
    const [ state, dispatch ] = React.useReducer( pinningImageFormReducer, initialState );

    const handleImage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[ 0 ];
        if ( file ) {
            const reader = new FileReader();
            reader.onload = ( e ) => {
                dispatch( {
                    type: "SET_IMAGE_FILE",
                    payload: { image: e.target?.result as ArrayBuffer, file },
                } );
            };
            reader.readAsDataURL( file );
        }
    };

    const canSubmit = () => {
        return !! (
            state.name.length &&
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

        dispatch( { type: "SET_ERROR_RESPONSE", payload: null } );
        dispatch( { type: "SET_IS_LOADING", payload: "Pinning file" } );

        try {
            if ( "TimeoutError" === state.errorResponse?.name ) {
                dispatch( {
                    type: "SET_IS_LOADING",
                    payload: "Retrying"
                } );

                const cid = await ipfsGenerateCidFromFile( state.file! );
                const seekResponse = await ipfsCatCidFromPublicGateways( cid, state.publicGateways );
                dispatch( { type: "SET_PUBLIC_GATEWAYS_RESULT", payload: seekResponse } );

                return;
            }

            const pinningApi = state.pinningGatewayApi?.api!.getCachedInstance();
            if ( ! pinningApi ) {
                return;
            }

            const pinResponse = await pinningApi.pinFile( state.file!, { name: state.name } );
            dispatch( {
                type: "SET_IS_LOADING",
                payload: "File pinned successfully, checking public gateways for content"
            } );

            const seekResponse = await ipfsCatCidFromPublicGateways( pinResponse.ipfsHash, state.publicGateways );
            dispatch( { type: "SET_PUBLIC_GATEWAYS_RESULT", payload: seekResponse } );
        } catch ( e ) {
            if ( ( e as Error ).message === "All promises were rejected" ) {
                const cid = await ipfsGenerateCidFromFile( state.file! );
                const err = new Error( "Timeout public gateways were available to check the content, " +
                    "it could be due to file size / speed of pinning service / speed of public gateways, " +
                    "if the error persists try to validate it manually via https://ipfs.io/ipfs/" + cid +
                    " if you cannot reach the file the pinning probably failed," +
                    "you can try to remove the pinning from the provider and try again with a different provider" );
                err.name = "TimeoutError";
                dispatch( { type: "SET_ERROR_RESPONSE", payload: err } );
            } else {
                dispatch( { type: "SET_ERROR_RESPONSE", payload: e } );
            }
        }

        dispatch( { type: "SET_IS_LOADING", payload: false } );
    };

    return { state, dispatch, handleImage, canSubmit, handleUpload };
}

const FormFields: React.FC<{
    state: TPinningImageFormState,
    dispatch: React.Dispatch<any>,
    handleImage: ( event: React.ChangeEvent<HTMLInputElement> ) => void,
    handleUpload: () => void,
    canSubmit: () => boolean
}> = ( { state, dispatch, handleImage, handleUpload, canSubmit } ) => {
    const LoadingFallback = <span className="pb-2 border-2 border-dotted">
        <LoadingDots message="Loading gateways"/>
    </span>;

    return (
        <>
            <Input
                isDisabled={ true }
                isRequired={ ! state.name.length }
                label="Name"
                value={ state.name }
                onValueChange={ ( value ) => dispatch( { type: "SET_NAME", payload: value } ) }
            />

            <input
                disabled={ !! state.loadingState || !! state.errorResponse }
                required
                type="file"
                onChange={ handleImage }
            />

            { state.image && <Image src={ URL.createObjectURL( state.file! ) }/> }

            <React.Suspense fallback={ LoadingFallback }>
                <SelectPinningGateway
                    isDisabled={ !! state.loadingState || !! state.errorResponse }
                    tooltipContent={ <span>The selected gateway will be used to pin the image to IPFS</span> }
                    onSelect={ ( api ) => {
                        dispatch( { type: "SET_PINNING_GATEWAY_API", payload: { api, name: api.getName() } } );
                    } }/>
            </React.Suspense>

            <React.Suspense fallback={ LoadingFallback }>
                <SelectPublicGateways
                    isDisabled={ !! state.loadingState && state.errorResponse?.name !== "TimeoutError" }
                    onSelect={ ( gateways ) => {
                        dispatch( { type: "SET_PUBLIC_GATEWAYS", payload: gateways } );
                    } }/>
            </React.Suspense>

            { state.loadingState ? (
                <span className="pb-2 border-2 border-dotted">
                    <LoadingDots message={ state.loadingState }/>
                </span>
            ) : (
                <Button variant="faded" color="primary" isDisabled={ ! canSubmit() } onClick={ handleUpload }>
                    { state.errorResponse?.name === "TimeoutError" ? "Retry" : "Pin Image" }
                </Button>
            ) }
        </>
    );
};

const ReplyFromPublicGateways: React.FC<{
    publicGatewaysResult: NonNullable<TPinningImageFormState["publicGatewaysResult"]>
}> = ( { publicGatewaysResult } ) => (
    <>
        <p className="mb-5 mt-5"><strong className="text-xl">Reply from IPFS network </strong></p>

        <Snippet hideSymbol={ true } hideCopyButton={ true } variant="bordered" color="default">
            <span><p><strong>Read Status:</strong> { publicGatewaysResult.status ? "Success" : "Failure" }</p></span>
            &nbsp;
            <span><p><strong>URLs Responded:</strong></p></span>

            { publicGatewaysResult.urlsResponded.map( ( url, index ) => (
                <p key={ index }>&nbsp;{ url }</p>
            ) ) }
            &nbsp;
            <span><p><strong>Progress:</strong></p></span>

            { publicGatewaysResult.progress.map( ( prog, index ) => (
                <p key={ index }>&nbsp;{ prog.type }: { JSON.stringify( prog.detail, ( _key, value: any | string ) =>
                    typeof value === "bigint" ? value.toString() : value
                ) }
                </p>
            ) ) }
            &nbsp;
            <span><p><strong>Blocks:</strong></p></span>

            <p>&nbsp;Count: { publicGatewaysResult.blocks.length }</p>
            <p>&nbsp;Total size: { publicGatewaysResult.blocks.reduce( ( a, b ) => a + b.byteLength, 0 ) } bytes</p>
            <p>&nbsp;Average size per
                block: { publicGatewaysResult.blocks.reduce( ( a, b ) => a + b.byteLength, 0 ) / publicGatewaysResult.blocks.length } bytes</p>
        </Snippet>
    </>
);

function PinningImageForm( { provider }: { provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null } ) {
    const { state, dispatch, handleImage, canSubmit, handleUpload } = usePinningImageForm();

    if ( ! provider ) {
        return <h1>To create an NFT, you need to have MetaMask installed.</h1>;
    }

    return (
        <div className="flex flex-col gap-4">
            { ! state.publicGatewaysResult ? (
                <>
                    <FormFields
                        state={ state }
                        dispatch={ dispatch }
                        handleImage={ handleImage }
                        handleUpload={ handleUpload }
                        canSubmit={ canSubmit }
                    />
                    { state.errorResponse && <ErrorResponse error={ state.errorResponse }/> }
                </>
            ) : (
                <ReplyFromPublicGateways publicGatewaysResult={ state.publicGatewaysResult }/>
            ) }
        </div>
    );
}

export default function PinningImage() {
    const provider = use( detectEthereumProvider );

    return (
        <PinningImageForm provider={ provider }/>
    );
}
