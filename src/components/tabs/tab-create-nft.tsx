import React from "react";

import detectEthereumProvider from "@metamask/detect-provider";

import { Button, Image, Input, Textarea } from "@nextui-org/react";

import use from "../../utils/react-use.ts";

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

            <Button onClick={ () => console.log( { name, description, image } ) }>
                Create NFT
            </Button>
        </div>
    );
}

export function TabCreateNFT() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [image, setImage] = React.useState<string | null>(null);

    // This will trigger the `Suspense` above...
    const provider = use( detectEthereumProvider );

    return (
        <CreateNFTForm
            setImage={setImage}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            image={image}
            provider={provider}
        />
    );
}
