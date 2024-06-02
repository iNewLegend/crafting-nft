import { Button, Divider } from '@nextui-org/react'

import useWalletProviders from "../../modules/wallet/use-wallet-providers";

import WalletInfo from "./wallet-info";
import WalletList from "./wallet-list";

import type { IWallet } from "../../modules/wallet/wallet-definitions";

import styles from "./wallet.module.scss";

export default function WalletProviders( props: { onWalletConnected: ( wallet: IWallet ) => void } ) {
    const { providers, selectedWallet, userAccount, onWalletSelected } = useWalletProviders();

    const onConnectClick = () => {
        props.onWalletConnected( {
            provider: selectedWallet!,
            account: userAccount
        } );
    };

    return (
        <div className={ styles.walletProviders }>
            <div className="">
                <WalletList providers={ providers || [] } onWalletSelected={ onWalletSelected }/>
            </div>

            <div>
                { userAccount && <>
                    <WalletInfo selectedWallet={ selectedWallet! } userAccount={ userAccount }/>
                </> }
            </div>

            { userAccount &&
                <div className="mt-3">
                    <Divider className="mb-3"/>

                    <Button className={styles.walletConnectButton} onClick={ onConnectClick } >
                        Connect Wallet
                    </Button>
                </div>
            }
        </div>
    )
}
