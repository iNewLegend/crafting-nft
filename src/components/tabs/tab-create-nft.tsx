import React from "react";

import { Button, Image, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

import detectEthereumProvider from "@metamask/detect-provider";

import { ipfsGetGateways } from "../../modules/ipfs/ipfs-gateways.ts";

import use from "../../utils/react-use.ts";

/**
 * This component exist in order to utilize the `React.Suspense` feature in nested `React.Suspense` components
 * Without this it will trigger the `React.Suspense` in the component above.
 */
function FetchGateways( props: {
    ui: ( { gateways }: { gateways: Awaited<ReturnType<typeof ipfsGetGateways>> } ) => JSX.Element
} ) {
    const [ gateways ] = React.useState<Awaited<ReturnType<typeof ipfsGetGateways>>>( use( ipfsGetGateways ) );

    return props.ui( { gateways } );
}

function SelectGateway() {
    return (
        <div>
            <FetchGateways ui={
                ( { gateways } ) => (
                    <Select
                        items={ gateways }
                        label="IPFS Gateway"
                        placeholder="Select a gateway"
                        selectedKeys={ [ gateways[ 0 ].url ] }
                        required
                    >
                        { ( gateway =>
                                <SelectItem key={ gateway.url } endContent={<span>{ gateway.responseTime }ms</span>}>
                                { gateway.name }
                            </SelectItem>
                        ) }
                    </Select>
                )
            }/>
        </div>
    );
}

function CreateNFTForm( props: {
    setImage: ( value: ( ( ( prevState: ( string | null ) ) => ( string | null ) ) | string | null ) ) => void,
    name: string,
    setName: ( value: ( ( ( prevState: string ) => string ) | string ) ) => void,
    description: string,
    setDescription: ( value: ( ( ( prevState: string ) => string ) | string ) ) => void,
    image: string | null,
    provider: ReturnType<Awaited<typeof detectEthereumProvider>> | null
} ) {
    const { setImage, name, setName, description, setDescription, image, provider } = props;

    if ( ! provider ) {
        return <h1>To create an NFT, you need to have MetaMask installed.</h1>
    }

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
                label="Name"
                value={ name }
                onChange={ ( e ) => setName( e.target.value ) }
            />
            <Textarea
                label="Description"
                value={ description }
                onChange={ ( e ) => setDescription( e.target.value ) }
            />

            <input
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
                <SelectGateway/>
            </React.Suspense>


            <Button onClick={ () => console.log( { name, description, image } ) }>
                Create NFT
            </Button>
        </div>
    );
}

export function TabCreateNFT() {
    const [ name, setName ] = React.useState( "" );
    const [ description, setDescription ] = React.useState( "" );
    const [ image, setImage ] = React.useState<string | null>( null );

    // This will trigger the `Suspense` above...
    const provider = use( detectEthereumProvider );

    return (
        <CreateNFTForm
            setImage={ setImage }
            name={ name }
            setName={ setName }
            description={ description }
            setDescription={ setDescription }
            image={ image }
            provider={ provider }
        />
    );
}
