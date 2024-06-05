import { PinningApiBase } from "./pinning-api-base.ts";

import type { AxiosError, AxiosResponse } from "axios";
import type { IPFSPinningGatewayConfig } from "../ipfs-definitions";

const DEFAULT_DOLPHIN_API_TOKEN_STORAGE_KEY = "api-dolphin-tokens",
    DEFAULT_DOLPHIN_API_IDENTITY_STORAGE_KEY = "api-dolphin-identity";

type TTokens = {
    access: string;
    refresh: string;
};

export default class DolphinApi extends PinningApiBase {
    private tokens: TTokens | undefined;

    public static async handshake( config: IPFSPinningGatewayConfig = this.getConfig() ) {
        const api = new DolphinApi( config ),
            tokens = api.getLocalTokens() || api.getStorageTokens();

        const currentIdentityChecksum =
            await api.generateIdentityChecksum( config.fields.email!, config.fields.password! );


        if ( tokens ) {
            const storedIdentityChecksum = api.getStorageIdentityChecksum();

            const isIdentityChanged = config.fields.email?.length &&
                storedIdentityChecksum !== currentIdentityChecksum;

            // Since the api should blind against the user, and the method is simple "handshake",
            // In other words, the method used to log in and to determine if the user is `logged in`,
            if ( isIdentityChanged ) {
                api.clearStorage();
            } else if ( await api.refreshToken( tokens.refresh ).catch( () => false ) ) {
                api.setStorageTokens( api.getLocalTokens()! );

                return api;
            }
        }

        try {
            await api.login().then( ( response ) => {
                if ( 200 === response.status ) {
                    api.setStorageTokens( response.data );
                    api.setStorageIdentityChecksum( currentIdentityChecksum );
                }

                throw new Error( 'Internal error login failed' );
            } );
        } catch ( e ) {
            return e as AxiosError;
        }

        return api;
    }

    public static getConfig(): IPFSPinningGatewayConfig {
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

    protected getBaseCreateArgs( extend: any = {} ) {
        const tokens = this.getLocalTokens() || this.getStorageTokens();

        if ( ! tokens ) {
            return super.getBaseCreateArgs( extend );
        }

        return super.getBaseCreateArgs( {
            headers: {
                Authorization: `Bearer ${ tokens.access }`
            },
            ... extend
        } );

    }

    public pinFileImpl( file: File, metadata: any ): Promise<AxiosResponse | AxiosError> {
        const form = new FormData();

        form.append( "files", file );

        // Required by the api.
        form.append( "parent", "" );

        return this.client.post( '/documents/', form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        } );
    }

    protected listPinnedFilesImpl(): Promise<AxiosResponse | AxiosError> {
        return this.client.get( '/documents/?asc=false&is_api_directory=false&limit=0&offset=0&search=' );
    }

    public async login( email = this.config.fields.email, password = this.config.fields.password ) {
        const response = await this.client.post( '/auth/login/', {
            email,
            password
        } );

        if ( response.data.access ) {
            this.tokens = response.data;
        }

        return response;
    }

    public async refreshToken( refreshToken: string ) {
        const response = await this.client.post( '/auth/token/refresh/', {
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


