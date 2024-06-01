import { Button, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'

import useWalletProviders from "../../modules/wallet/use-wallet-providers.ts";

import WalletInfo from "./wallet-info.tsx";

import WalletList from "./wallet-list.tsx";

import styles from './wallet.module.scss';

import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";

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

                    <WalletInfo selectedWallet={ selectedWallet! } userAccount={ userAccount }/>
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
}
