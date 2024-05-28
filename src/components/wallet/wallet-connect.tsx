import React from "react";

import {
    Image,
    Input,
    Button,
    CardBody,
    CardHeader,
    Divider,
    Link,
    Navbar,
    NavbarContent,
    NavbarItem,
    Textarea
} from "@nextui-org/react";

import useSelectedWalletResource from "../../modules/wallet/use-selected-wallet-resource.ts";

import WalletInfo from "./wallet-info.tsx";
import WalletProviders from "./wallet-providers.tsx";

import styles from "./wallet.module.scss";

import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";


function TabCreateNFT() {
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

function TabHome( props: { selectedWallet: IWallet } ) {
    return <>
        <WalletInfo selectedWallet={ props.selectedWallet.provider! } userAccount={ props.selectedWallet.account }/>
    </>;
}

export default function WalletConnect() {
    const selectedWalletResource = useSelectedWalletResource();

    const [ selectedWallet, setSelectedWallet ] = React.useState( selectedWalletResource.read() );

    const [ currentTab, setCurrentTab ] = React.useState( "home" );

    const handleWalletConnected = ( wallet: IWallet ) => {
        selectedWalletResource.write( wallet );
        setSelectedWallet( wallet );
    };

    const logout = () => {
        selectedWalletResource.delete();
        setSelectedWallet( null );
    };

    const TabNavbar = () => {
        const tabItems = [
            { name: "home", label: "Home" },
            { name: "create-nft", label: "Create NFT" },
        ];

        return (
            <Navbar>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    { tabItems.map( ( item ) => (
                        <NavbarItem key={ item.name }>
                            <Button
                                onClick={ () => setCurrentTab( item.name ) }
                                color={ currentTab === item.name ? "primary" : "default" }
                                variant="flat"
                            >
                                { item.label }
                            </Button>
                        </NavbarItem>
                    ) ) }
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button onClick={ logout } as={ Link } color="primary" href="#" variant="flat">
                            Logout
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        );
    };

    const getCurrentTab = ( currentTab: string ) => {
        switch ( currentTab ) {
            case "home":
                return <TabHome selectedWallet={ selectedWallet! }/>;
            case "create-nft":
                return <TabCreateNFT/>;

            default:
                return null; //404
        }
    };

    return selectedWallet ? (
        <div className={ styles.wallet }>
            <CardHeader className="header">
                <h2>Hi</h2>
            </CardHeader>

            <Divider/>

            <CardBody className="body">
                <TabNavbar/>

                <Divider className="mb-3"/>

                { getCurrentTab( currentTab ) }
            </CardBody>

        </div>
    ) : (
        <WalletProviders onWalletConnected={ handleWalletConnected }/>
    )
}
