import React from "react";

import Layout from "./components/layout/layout.tsx";
import Loading from "./components/loading/loading.tsx";
import WalletConnect from "./components/wallet/wallet-connect.tsx";

function App() {
    return (
        <Layout>
            <React.Suspense fallback={ <Loading/> }>
                <WalletConnect/>
            </React.Suspense>
        </Layout>
    );
}

export default App;
