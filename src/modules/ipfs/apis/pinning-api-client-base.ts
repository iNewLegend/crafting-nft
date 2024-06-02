import axios from "axios";

import type { AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";

import type { IPFSPinningGateway } from "../ipfs-definitions";

export abstract class PinningApiClientBase {
    protected api!: AxiosInstance;

    // @ts-expect-error ts(2339)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static handshake( gateway: IPFSPinningGateway = this.getDefaultGateway() ): Promise<AxiosResponse | AxiosError | Error | boolean> {
        throw new Error( "ForceMethodImplementation" );
    }

    public static getDefaultGateway(): IPFSPinningGateway {
        throw new Error( "ForceMethodImplementation" );
    }

    public static getName(): string {
        return this.getDefaultGateway().name;
    }

    public constructor( protected gateway: IPFSPinningGateway ) {
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
            host = gateway.proxy!.host === "{{location.host}}" ? window.location.host : gateway.proxy!.host;

        return {
            baseURL: new URL( `${ location.protocol }//${ host }/${ gateway.proxy!.pathname }/` ).toString(),
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

