import axios, { type AxiosError, AxiosInstance, type AxiosResponse, type CreateAxiosDefaults } from "axios";

import type { IPFSPiningGateway } from "../ipfs-definitions.ts";

export abstract class APIClientBase {
    protected api!: AxiosInstance;

    // @ts-expect-error ts(2339)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static handshake( gateway: IPFSPiningGateway ): Promise<AxiosResponse | AxiosError | Error | boolean> {
        throw new Error( "ForceMethodImplementation" );
    }

    public constructor( protected gateway: IPFSPiningGateway ) {
        this.create();
    }

    protected getBaseCreateArgs( extend: CreateAxiosDefaults = {} ) {
        return {
            baseURL: this.gateway.fields.endpointUrl,
            ... extend,
        }
    }

    protected getProxyCreateArgs( extend: CreateAxiosDefaults = {} ) {
        const { gateway } = this,
            host = gateway.proxy.host === "{{location.host}}" ? window.location.host : gateway.proxy.host;

        return {
            baseURL: new URL( `${ location.protocol }//${ host }/${ gateway.proxy.pathname }/` ).toString(),
            ... extend,
        }
    }

    private create() {
        const args = this.gateway.proxy ? this.getProxyCreateArgs() : this.getBaseCreateArgs();

        this.api = axios.create( args );

        return this.api;
    }

    public getClientInstance() {
        return this.api;
    }
}
