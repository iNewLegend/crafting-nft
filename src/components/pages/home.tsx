import type { IWallet } from "../../modules/wallet/wallet-definitions";

import WalletInfo from "../wallet/wallet-info";

export default function Home( props: { selectedWallet: IWallet } ) {
    return <>
        <WalletInfo
            selectedWallet={ props.selectedWallet.provider! }
            userAccount={ props.selectedWallet.account }
        />
    </>;
}
