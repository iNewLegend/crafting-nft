import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import useSelectedWalletResource from "../../modules/wallet/use-selected-wallet-resource.ts";
import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";
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
                <div className={ styles.selected }>
                    <img src={ selectedWallet.provider.info.icon } alt={ selectedWallet.provider.info.name }/>

                    <div>
                        { selectedWallet.provider.info.name }
                    </div>

                    <div>
                        { selectedWallet.account.slice( 0, 6 ) }...{ selectedWallet.account.slice( -4 ) }
                    </div>
                </div>
            </CardBody>

        </div>
    ) : (
        <WalletProviders onWalletConnected={ handleWalletConnected }/>
    )
}
