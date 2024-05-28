import React from "react";

import { Button, Image, Input, Textarea } from "@nextui-org/react";

export function TabCreateNFT() {
    const [ name, setName ] = React.useState( "" );
    const [ description, setDescription ] = React.useState( "" );
    const [ image, setImage ] = React.useState<string | null>( null );

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
