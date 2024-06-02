import React from "react";

import Layout from "./components/layout/layout";
import Pages from "./components/pages/pages";
import LoadingSpinner from "./components/loading/loading-spinner";
import WalletConnect from "./components/wallet/wallet-connect";

import type { IWallet } from "./modules/wallet/wallet-definitions";

import "./app.scss";

function App() {
    const [ wallet, setWallet ] = React.useState<IWallet | null>( null );

    const Header: React.FC<{ wallet: IWallet | null }> = ( { wallet } ) => {
        if ( wallet ) {
            return <h1>Welcome</h1>;
        }

        return <>Select Wallet</>;
    };

    return (
        <Layout header={ <Header wallet={ wallet }/> }>
            <React.Suspense fallback={ <LoadingSpinner/> }>
                <WalletConnect onSync={ setWallet }>
                    <Pages/>
                </WalletConnect>
            </React.Suspense>
        </Layout>
    );
}

export default App;
