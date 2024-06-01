import { PinningApiClientBase } from './pinning-api-client-base.ts';

import type { AxiosError } from "axios";
import type { IPFSPinningGateway } from '../ipfs-definitions';

const DEFAULT_PINATA_API_TOKEN_STORAGE_KEY = 'api-pinata-token';

export default class PinataClient extends PinningApiClientBase {
    public static async handshake( gateway: IPFSPinningGateway = this.getDefaultGateway() ) {
        const api = new PinataClient( gateway );

        try {
            const response = await api.testAuthentication();

            if ( response.status === 200 ) {
                return true;
            }

            return response;
        } catch ( e ) {
            return e as AxiosError;
        }
    }

    public static getDefaultGateway(): IPFSPinningGateway {
        return {
            "name": "pinata.cloud",
            "fields": {
                "endpointUrl": "https://api.pinata.cloud",
                "token": ""
            }
        }
    }

    protected getBaseCreateArgs() {
        const fieldToken = this.gateway.fields.token,
            storageToken = this.getStorageToken(),
            token = fieldToken?.length && fieldToken !== storageToken ?
                fieldToken : storageToken;

        return super.getBaseCreateArgs( {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        } );
    }

    public async testAuthentication() {
        const response = await this.api.get( '/data/testAuthentication');

        if ( response.status === 200 ) {
            // Fine for the demo.
            this.setStorageToken(
                this.api.defaults.headers.Authorization!.toString().substring( 7 )
            );
        }

        return response;
    }

    public setStorageToken( token: string ) {
        localStorage.setItem( DEFAULT_PINATA_API_TOKEN_STORAGE_KEY, token );
    }

    public getStorageToken() {
        const raw = localStorage.getItem( DEFAULT_PINATA_API_TOKEN_STORAGE_KEY );

        return raw ?? undefined;
    }
}
