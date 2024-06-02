import React from "react";

const WalletContext = React.createContext( {
    selected: undefined,

    logout: () => {},
} );

export default WalletContext;
