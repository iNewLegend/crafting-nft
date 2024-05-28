import { Image } from "@nextui-org/react";

import styles from "./wallet.module.scss";

export default function WalletInfo( { selectedWallet, userAccount }: { selectedWallet: EIP6963ProviderDetail, userAccount: string } ) {
    return (
        <div className={ styles.walletInfo }>
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
    );
}
