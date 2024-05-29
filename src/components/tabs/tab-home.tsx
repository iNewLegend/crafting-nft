import type { IWallet } from "../../modules/wallet/wallet-definitions.ts";

import WalletInfo from "../wallet/wallet-info.tsx";

export function TabHome( props: { selectedWallet: IWallet } ) {
    return <>
        <WalletInfo selectedWallet={ props.selectedWallet.provider! } userAccount={ props.selectedWallet.account }/>
    </>;
}
