import React from "react";

import { Button, CardBody, CardHeader, Divider, Link, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";

import useSelectedWallet from "../../modules/wallet/use-selected-wallet";

import { TabSetupPinningGateways } from "../tabs/tab-setup-pinning-gateways";

import { TabPinImage } from "../tabs/tab-pin-image";
import { TabHome } from "../tabs/tab-home";

import WalletProviders from "./wallet-providers";

import type { IWallet } from "../../modules/wallet/wallet-definitions";

import styles from "./wallet.module.scss";

export default function WalletConnect() {
    const selectedWalletResource = useSelectedWallet();

    const [ selectedWallet, setSelectedWallet ] = React.useState( selectedWalletResource.read() );

    const [ currentTab, setCurrentTab ] = React.useState( "home" );

    const handleWalletConnected = ( wallet: IWallet ) => {
        selectedWalletResource.write( wallet );
        setSelectedWallet( wallet );
    };

    const handleWalletLogout = () => {
        selectedWalletResource.delete();
        setSelectedWallet( null );
    };

    const TabNavbar = () => {
        const tabItems = [
            { name: "home", label: "Home" },
            { name: "setup-pinning-gateways", label: "Setup Pinning Gateways" },
            { name: "ping-image", label: "Pin Image" },
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
                        <Button onClick={ handleWalletLogout } as={ Link } color="primary" href="#" variant="flat">
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

            case "ping-image":
                return <TabPinImage/>;

            case "setup-pinning-gateways":
                return <TabSetupPinningGateways />;

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
