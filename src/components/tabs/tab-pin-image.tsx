import React from "react";

import { Button, Image, Input, Select, SelectItem, Textarea, Tooltip } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import use from "../../utils/react-use.ts";
import LoadingDots from "../loading/loading-dots.tsx";

import { ipfsGetPublicGateways } from "../../modules/ipfs/ipfs-public-gateways.ts";

import type { IPFSPublicGateway } from "../../modules/ipfs/ipfs-definitions.ts";

/**
 * This component exist in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
function FetchPublicGateways( props: {
    ui: ( { gateways }: { gateways: IPFSPublicGateway[] } ) => JSX.Element
} ) {
    const [ gateways ] = React.useState<IPFSPublicGateway[]>(
        use( ipfsGetPublicGateways, {
            cacheTTL: 1000 * 60 * 15,
        } )
    );

    return props.ui( { gateways } );
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
        <div>
            <FetchPublicGateways ui={
                ( { gateways } ) => (
                    <Tooltip closeDelay={ 100 } offset={ 10 }
                             content={
                                 <div className="px-1 py-2">
                                     <div className="text-small font-bold">Public IPFS Gateways</div>
                                     <div className="text-tiny">The selected gateways will be used<br/>to check when the
                                         pinned image is available over IPFS
                                     </div>
                                 </div>
                             }>
                        <Select
                            isRequired={ ! selectedPublicGateways }
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
                    </Tooltip>
                )
            }/>
        </div>
    );
}

function CreatePinImageForm( props: {
    provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null
} ) {
    const [ name, setName ] = React.useState( "" );
    const [ description, setDescription ] = React.useState( "" );
    const [ image, setImage ] = React.useState<ArrayBuffer | null>( null );
    const [ file, setFile ] = React.useState<File | null>( null );
    const [ gateways, setGateways ] = React.useState<IPFSPublicGateway[]>( [] );

    if ( ! props.provider ) {
        return <h1>To create an NFT, you need to have MetaMask installed.</h1>
    }

    const canSubmit = () => {
        return !! ( name.length && description.length && image && gateways.length && file?.name );
    };

    const handleImage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[ 0 ];

        if ( file ) {
            const reader = new FileReader();

            reader.onload = ( e ) => {
                setImage( e.target?.result as ArrayBuffer );
                setFile( file );
            };

            reader.readAsDataURL( file );
        }
    };

    const handleUpload = async () => {
        if ( ! canSubmit() ) {
            return;
        }

    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                isRequired={ ! name.length }
                label="Name"
                value={ name }
                onValueChange={ setName }
            />
            <Textarea
                isRequired={ ! description.length }
                label="Description"
                value={ description }
                onValueChange={ setDescription }
            />

            <input
                required
                type="file"
                onChange={ handleImage }
            />

            { image && <Image src={ URL.createObjectURL( file! ) }/> }

            <React.Suspense fallback={ <LoadingDots/> }>
                <SelectPublicGateway onSelect={ ( gateways ) => {
                    setGateways( gateways );
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
