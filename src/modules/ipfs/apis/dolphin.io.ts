import { APIClientBase } from "./api-client-base.ts";

import type { AxiosError } from "axios";
import type { IPFSPiningGateway } from "../ipfs-definitions.ts";

const DEFAULT_DOLPHIN_API_TOKEN_STORAGE_KEY = "api-dolphin-tokens",
    DEFAULT_DOLPHIN_API_IDENTITY_STORAGE_KEY = "api-dolphin-identity";

type TTokens = {
    access: string;
    refresh: string;
};

export default class DolphinClient extends APIClientBase {
    private tokens: TTokens | undefined;

    public static async handshake( gateway: IPFSPiningGateway = this.getDefaultGateway() ) {
        const api = new DolphinClient( gateway ),
            tokens = api.getLocalTokens() || api.getStorageTokens();

        const currentIdentityChecksum =
            await api.generateIdentityChecksum( gateway.fields.email!, gateway.fields.password! );


        if ( tokens ) {
            const storedIdentityChecksum = api.getStorageIdentityChecksum();

            const isIdentityChanged = gateway.fields.email?.length && storedIdentityChecksum !== currentIdentityChecksum;

            // Since the api should blind against the user, and the method is simple "handshake",
            // In other words, the method used to log in and to determine if the user is `logged in`,
            if ( isIdentityChanged ) {
                api.clearStorage();
            } else if ( await api.refreshToken( tokens.refresh ).catch( () => false ) ) {
                api.setStorageTokens( api.getLocalTokens()! );

                return true;
            }
        }

        try {
            return await api.login().then( ( response ) => {
                if ( 200 === response.status ) {
                    api.setStorageTokens( response.data );
                    api.setStorageIdentityChecksum( currentIdentityChecksum );

                    return true;
                }

                throw new Error( 'Internal error login failed' );
            } );
        } catch ( e ) {
            return e as AxiosError;
        }
    }

    public static getDefaultGateway(): IPFSPiningGateway {
        return {
                "name": "dolphin.io",
                "fields": {
                    "endpointUrl": "https://gateway.dolpin.io/api/v1/",
                    "email": "",
                    "password": ""
                },
                "proxy": {
                    "host": "{{location.host}}",
                    "pathname": "dolphin"
                }
            }
    }

    public async login( email = this.gateway.fields.email, password = this.gateway.fields.password ) {
        const response = await this.api.post( '/auth/login/', {
            email,
            password
        } );

        if ( response.data.access ) {
            this.tokens = response.data;
        }

        return response;
    }

    public async refreshToken( refreshToken: string ) {
        const response = await this.api.post( '/auth/token/refresh/', {
            refresh: refreshToken,
        } );

        if ( 200 === response.status ) {
            this.tokens = response.data;
        }

        return response;
    }

    public async generateIdentityChecksum( email: string, password: string ) {
        const encoder = new TextEncoder(),
            data = encoder.encode( email + password ),
            hash = await crypto.subtle.digest( 'SHA-256', data );

        return Array.from( new Uint8Array( hash ) )
            .map( b => b.toString( 16 ).padStart( 2, '0' ) ).join( '' )
    }

    public clearStorage() {
        localStorage.removeItem( DEFAULT_DOLPHIN_API_TOKEN_STORAGE_KEY );
        localStorage.removeItem( DEFAULT_DOLPHIN_API_IDENTITY_STORAGE_KEY );
        this.tokens = undefined;
    }

    public setStorageTokens( tokens: TTokens ) {
        localStorage.setItem( DEFAULT_DOLPHIN_API_TOKEN_STORAGE_KEY, JSON.stringify( tokens ) );
    }

    public setStorageIdentityChecksum( checksum: string ) {
        localStorage.setItem( DEFAULT_DOLPHIN_API_IDENTITY_STORAGE_KEY, checksum );
    }

    public getStorageIdentityChecksum() {
        return localStorage.getItem( DEFAULT_DOLPHIN_API_IDENTITY_STORAGE_KEY );
    }

    public getStorageTokens() {
        const raw = localStorage.getItem( DEFAULT_DOLPHIN_API_TOKEN_STORAGE_KEY );

        return raw ? JSON.parse( raw ) : null;
    }

    public getLocalTokens() {
        return this.tokens;
    }
}


