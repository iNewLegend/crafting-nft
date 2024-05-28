import { Button, CardBody, CardFooter, CardHeader, Divider, Image } from '@nextui-org/react'

import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";

import useWalletProviders from "../../modules/wallet/use-wallet-providers.ts";

import WalletList from "./wallet-list.tsx";

import styles from './wallet.module.scss';

export default function WalletProviders( props: { onWalletConnected: ( wallet: IWallet ) => void } ) {
    const { providers, selectedWallet, userAccount, onWalletSelected } = useWalletProviders();

    return (
        <div className={ styles.wallet }>
            <CardHeader className="header">
                <h2>Select Wallet</h2>
            </CardHeader>

            <Divider/>

            <CardBody className="body">
                <div className="">
                    <WalletList providers={ providers } onWalletSelected={ onWalletSelected }/>
                </div>

                { userAccount && <>
                    <Divider/>

                    <div className={ styles.selected }>
                        <Image
                            src={ selectedWallet!.info.icon }
                            alt={ selectedWallet!.info.name }
                        />

                        <div>
                            { selectedWallet!.info.name }
                        </div>

                        <div>
                            { userAccount.slice( 0, 6 ) }...{ userAccount.slice( -4 ) }
                        </div>
                    </div>
                </> }
            </CardBody>

            { userAccount && <CardFooter className="footer">
                <Button className={ styles.confirmButton }
                        onClick={ () => props.onWalletConnected( {
                            provider: selectedWallet!,
                            account: userAccount
                        } ) }
                >
                    Connect Wallet
                </Button>
            </CardFooter> }
        </div>
    )
};
