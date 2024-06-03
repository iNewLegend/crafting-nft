import { PinningApiBase } from './pinning-api-base.ts';

import type { AxiosError, AxiosResponse } from "axios";
import type { IPFSPinningGateway } from '../ipfs-definitions';

const DEFAULT_PINATA_API_TOKEN_STORAGE_KEY = 'api-pinata-token';

export default class PinataClient extends PinningApiBase {
    public static async handshake( gateway: IPFSPinningGateway = this.getDefaultGateway() ) {
        const api = new PinataClient( gateway );

        try {
            const response = await api.testAuthentication();

            if ( response.status === 200 ) {
                return api;
            }
        } catch ( e ) {
            return e as AxiosError;
        }

        throw new Error( 'Failed to authenticate with the gateway' );
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

    public pinFile( file: File, metadata: any ): Promise<AxiosResponse | AxiosError> {
        const form = new FormData();

        form.append("file", file);
        form.append("pinataMetadata", JSON.stringify(metadata));

        return this.client.post( '/pinning/pinFileToIPFS', form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        } );
    }

    protected listPinnedFilesImpl(): Promise<AxiosResponse | AxiosError> {
        return this.client.get( '/data/pinList' );
    }

    public async testAuthentication() {
        const response = await this.client.get( '/data/testAuthentication');

        if ( response.status === 200 ) {
            // Fine for the demo.
            this.setStorageToken(
                this.client.defaults.headers.Authorization!.toString().substring( 7 )
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
