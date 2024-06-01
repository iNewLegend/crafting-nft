import React from "react";

import Layout from "./components/layout/layout";
import LoadingSpinner from "./components/loading/loading-spinner";
import WalletConnect from "./components/wallet/wallet-connect";

function App() {
    return (
        <Layout>
            <React.Suspense fallback={ <LoadingSpinner/> }>
                <WalletConnect/>
            </React.Suspense>
        </Layout>
    );
}

export default App;
