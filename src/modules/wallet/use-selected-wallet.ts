import use from "../../utils/react-use";

import walletHandleConnect from "./wallet-handle-connect";

import store from './wallet-store.ts';

import type { IWallet } from "./wallet-definitions";

const SELECTED_WALLET_STORAGE_KEY = 'selected-wallet';

function getSelectedWallet() {
    return new Promise( ( resolve, reject ) => {
        const walletFromStorage = localStorage.getItem( SELECTED_WALLET_STORAGE_KEY );

        if ( ! walletFromStorage ) {
            reject( "No wallet in the storage" );

            return;
        }

        store.subscribe( async () => {
            const providers = store.value();
            const {
                provider: providerFromStorage,
                account: accountFromStorage
            } = JSON.parse( walletFromStorage );

            const providerInfo = providers?.find(
                ( i ) => i.info.name === providerFromStorage.info.name
            );

            if ( providerInfo ) {
                const connected = await walletHandleConnect( providerInfo );

                if ( connected?.account === accountFromStorage ) {
                    resolve( connected );

                    return;
                }
            }

            reject( "No providers found" );
        } );
    } );
}

export default function useSelectedWallet() {
    const result = use( getSelectedWallet );

    return {
        read: () => {
            if ( result instanceof Error ) {
                console.error( result );

                return null;
            }

            return result;
        },
        write: ( wallet: IWallet ) => {
            localStorage.setItem( SELECTED_WALLET_STORAGE_KEY, JSON.stringify( {
                provider: {
                    info: wallet.provider.info
                },
                account: wallet.account
            } ) );
        },
        delete: () => {
            localStorage.removeItem( SELECTED_WALLET_STORAGE_KEY );
        },
    };
}
