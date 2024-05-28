import type { IWallet } from "./wallet-definitions.ts";
import walletHandleConnect from "./wallet-handle-connect.ts";
import store from './wallet-store.ts';

const SELECTED_WALLET_STORAGE_KEY = 'selected-wallet';

const DEFAULT_FAKE_TIMEOUT = 0;

let status: 'pending' | 'success' | 'error' = 'pending';
let result: IWallet;

const suspender: Promise<IWallet | undefined> = new Promise( ( resolve, reject ) => {
    const walletFromStorage = localStorage.getItem( SELECTED_WALLET_STORAGE_KEY );

    if ( ! walletFromStorage ) {
        reject();

        return;
    }

    store.subscribe( async () => {
        const providers = store.value();

        const {
            provider: providerFromStorage,
            account: accountFromStorage
        } = JSON.parse( walletFromStorage );

        const providerInfo = providers.find(
            ( i ) => i.info.name === providerFromStorage.info.name
        );

        if ( providerInfo ) {
            const connected = await walletHandleConnect( providerInfo );

            if ( connected?.account === accountFromStorage ) {
                setTimeout( () => resolve( connected ), DEFAULT_FAKE_TIMEOUT );

                return;
            }
        }

        reject();
    } );
} );

suspender.then(
    wallet => {
        status = 'success';
        result = wallet!;
    },
    error => {
        status = 'error';
        result = error;
    }
);

export default function useSelectedWalletResource() {
    return {
        read: () => {
            if ( status === 'pending' ) {
                throw suspender;
            } else if ( status === 'error' ) {
                return null;
            } else if ( status === 'success' ) {
                return result;
            }
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
        }
    };
}
