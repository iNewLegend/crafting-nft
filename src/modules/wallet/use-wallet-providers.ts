import React from "react";

import useWalletStore from "./use-wallet-store.ts";

import walletHandleConnect from "./wallet-handle-connect.ts";

import type { IWallet } from "./wallet-definitions.ts";

export default function useWalletProviders() {
    const [ selectedWallet, setSelectedWallet ] = React.useState<EIP6963ProviderDetail>();
    const [ userAccount, setUserAccount ] = React.useState( '' );

    const providers = useWalletStore();

    const onWalletSelected = async ( providerWithInfo: EIP6963ProviderDetail ) => {
        walletHandleConnect( providerWithInfo ).then( ( r: IWallet ) => {
            setSelectedWallet( r.provider );
            setUserAccount( r.account );
        } );
    };

    return {
        providers,
        selectedWallet,
        userAccount,
        onWalletSelected
    }
};
