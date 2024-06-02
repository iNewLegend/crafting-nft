import React from "react";

import WalletContext from "./wallet-context";

import WalletProviders from "./wallet-providers";

import useSelectedWallet from "../../modules/wallet/use-selected-wallet";

import type { IWallet } from "../../modules/wallet/wallet-definitions";

type TWalletConnectProps = React.PropsWithChildren<{
    onConnect?: ( wallet: IWallet ) => void;
    onLogout?: () => void;
    onSync?: ( wallet: IWallet | null) => void;
}>;

const WalletConnect: React.FC<TWalletConnectProps> = ( { children, onConnect, onLogout, onSync } ) => {
    const selectedWalletResource = useSelectedWallet();

    const [ selectedWallet, setSelectedWallet ] = React.useState( selectedWalletResource.read() );

    React.useEffect( () => {
        if ( onSync ) {
            setTimeout( () => onSync( selectedWallet ?? null ) );
        }
    }, [ selectedWallet, onSync ] );

    const handleWalletConnected = ( wallet: IWallet ) => {
        selectedWalletResource.write( wallet );
        setSelectedWallet( wallet );

        if ( onConnect ) {
            setTimeout( () => onConnect( wallet ) );
        }
    };

    const handleWalletLogout = () => {
        selectedWalletResource.delete();
        setSelectedWallet( null );

        if ( onLogout ) {
            setTimeout( () => onLogout() );
        }
    };

    return (
        <WalletContext.Provider value={ { selected: selectedWallet, logout: handleWalletLogout } }>
            { selectedWallet ? children : <WalletProviders onWalletConnected={ handleWalletConnected }/> }
        </WalletContext.Provider>
    );
};

export default WalletConnect;
