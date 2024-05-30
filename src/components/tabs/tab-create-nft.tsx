import React from "react";

import { Button, Image, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import type { IPFSGateway } from "../../modules/ipfs/ipfs-definitions.ts";

import { ipfsGetGateways } from "../../modules/ipfs/ipfs-gateways.ts";

import use from "../../utils/react-use.ts";

/**
 * This component exist in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
function FetchGateways( props: {
    ui: ( { gateways }: { gateways: IPFSGateway[] } ) => JSX.Element
} ) {
    const [ gateways ] = React.useState<IPFSGateway[]>(
        use( ipfsGetGateways, {
            // 5 Minutes
            cacheTTL: 1000 * 60 * 5,
        } )
    );

    return props.ui( { gateways } );
}

function SelectGateway( props: {
    onSelect: ( gateway: IPFSGateway ) => void
} ) {
    const [ selectedGateway, setSelectedGateway ] = React.useState<IPFSGateway | null>( null );

    const onChange = ( gateways: IPFSGateway[], event: React.ChangeEvent<HTMLSelectElement> ) => {
        const selectedGateway = gateways.find( gateway => gateway.url === event.target.value );

        if ( selectedGateway ) {
            setSelectedGateway( selectedGateway );

            props.onSelect( selectedGateway );
        }
    };

    return (
        <div>
            <FetchGateways ui={
                ( { gateways } ) => (
                    <Select
                        isRequired={ ! selectedGateway }
                        items={ gateways }
                        label="IPFS Gateway"
                        placeholder="Select a gateway"
                        selectedKeys={ [ selectedGateway?.url ?? 0 ] }
                        onChange={ ( e ) => onChange( gateways, e ) }
                    >
                        { ( gateway =>
                            <SelectItem key={ gateway.url } endContent={ <span>{ gateway.responseTime }ms</span> }>
                                { gateway.name }
                            </SelectItem> ) }
                    </Select>
                )
            }/>
        </div>
    );
}

function CreateNFTForm( props: {
    provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null
} ) {
    const [ name, setName ] = React.useState( "" );
    const [ description, setDescription ] = React.useState( "" );
    const [ image, setImage ] = React.useState<string | null>( null );
    const [ gateway, setGateway ] = React.useState<IPFSGateway | null>( null );

    if ( ! props.provider ) {
        return <h1>To create an NFT, you need to have MetaMask installed.</h1>
    }

    const canSubmit = () => {
        return !! ( name.length && description.length && image && gateway );
    };

    const handleImageUpload = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[ 0 ];

        if ( file ) {
            const reader = new FileReader();

            reader.onload = ( e ) => {
                setImage( e.target?.result as string );
            };

            reader.readAsDataURL( file );
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
                onChange={ handleImageUpload }
            />

            { image && <Image src={ image } alt="Preview"/> }

            <React.Suspense fallback={
                <p className="text-center">
                    Loading gateways&nbsp;
                    <span className="animate-ping text-2xl">.</span>
                    <span className="animate-ping-delay-200 text-2xl">.</span>
                    <span className="animate-ping-delay-400 text-2xl">.</span>
                </p>
            }>
                <SelectGateway onSelect={ setGateway }/>
            </React.Suspense>


            <Button isDisabled={ ! canSubmit() } onClick={ () => console.log( { name, description, image, gateway } ) }>
                Create NFT
            </Button>
        </div>
    );
}

export function TabCreateNFT() {
    // This will trigger the `Suspense` above...
    const provider = use( detectEthereumProvider );

    return (
        <CreateNFTForm provider={ provider }/>
    );
}
