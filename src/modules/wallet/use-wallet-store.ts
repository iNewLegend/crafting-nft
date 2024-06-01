import { useSyncExternalStore } from "react";

import WalletStore from "./wallet-store";

const useWalletStore = () => useSyncExternalStore(
    WalletStore.subscribe,
    WalletStore.value,
    WalletStore.value
);

export default useWalletStore;
