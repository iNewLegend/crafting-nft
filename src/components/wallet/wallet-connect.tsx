import React from "react";

import { CardBody, CardHeader, Divider } from "@nextui-org/react";

import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";

import useSelectedWalletResource from "../../modules/wallet/use-selected-wallet-resource.ts";

import WalletInfo from "./wallet-info.tsx";
import WalletProviders from "./wallet-providers.tsx";

import styles from "./wallet.module.scss";

export default function WalletConnect() {
    const selectedWalletResource = useSelectedWalletResource();

    const [ selectedWallet, setSelectedWallet ] = React.useState( selectedWalletResource.read() );

    const handleWalletConnected = ( wallet: IWallet ) => {
        selectedWalletResource.write( wallet );
        setSelectedWallet( wallet );

    };

    return selectedWallet ? (
        <div className={ styles.wallet }>
            <CardHeader className="header">
                <h2>Your wallet</h2>
            </CardHeader>

            <Divider/>

            <CardBody className="body">
                <WalletInfo selectedWallet={ selectedWallet.provider! } userAccount={ selectedWallet.account }/>
            </CardBody>

        </div>
    ) : (
        <WalletProviders onWalletConnected={ handleWalletConnected }/>
    )
}
