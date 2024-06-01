import React from "react";

import Layout from "./components/layout/layout.tsx";
import LoadingSpinner from "./components/loading/loading-spinner.tsx";
import WalletConnect from "./components/wallet/wallet-connect.tsx";

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
