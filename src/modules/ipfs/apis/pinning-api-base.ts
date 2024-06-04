import type { AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import axios from "axios";

import type { IPFSPinningGateway } from "../ipfs-definitions";
import type { CommonListStructure, CommonPinStructure } from "./definitions.ts";

export abstract class PinningApiBase {
    private static cachedInstance: PinningApiBase | undefined;

    protected client!: AxiosInstance;

    // @ts-expect-error ts(2339)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static handshake( gateway: IPFSPinningGateway = this.getDefaultGateway() ): Promise<AxiosError | Error | PinningApiBase> {
        throw new Error( "ForceMethodImplementation" );
    }

    public static getDefaultGateway(): IPFSPinningGateway {
        throw new Error( "ForceMethodImplementation" );
    }

    public static getName(): string {
        return this.getDefaultGateway().name;
    }

    public static getCachedInstance(): PinningApiBase {
        if ( ! this.cachedInstance ) {
            throw new Error( "No instance cached" );
        }

        return this.cachedInstance;
    }

    public constructor( protected gateway: IPFSPinningGateway ) {
        this.create();

        const staticThis = ( this.constructor as typeof PinningApiBase );

        staticThis.cachedInstance = this;
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

        return this.getBaseCreateArgs( {
            baseURL: new URL( `${ location.protocol }//${ host }/${ gateway.proxy!.pathname }/` ).toString(),
            ... extend,
        } );
    }

    protected abstract listPinnedFilesImpl(): Promise<AxiosResponse | AxiosError>;

    protected abstract pinFileImpl( file: File, metadata: any ): Promise<AxiosResponse | AxiosError>;

    private create() {
        const args = this.gateway.proxy ? this.getProxyCreateArgs() : this.getBaseCreateArgs();

        this.client = axios.create( args );

        return this.client;
    }

    private mapToCommonListStructure( response: any ): CommonListStructure[] {
        const commonStructureArray: CommonListStructure[] = [];

        ( response.data.data || response.data.rows ).forEach( ( dataItem: any ) => {
            const commonItem: CommonListStructure = {
                ipfsHash: dataItem.cid || dataItem.ipfs_pin_hash,
                fileName: dataItem.name || dataItem.metadata.name,
                fileSize: dataItem.size_in_bytes || dataItem.size,
                mimeType: dataItem.document_type || dataItem.mime_type,
                datePinnedOrCreated: dataItem.created || dataItem.date_pinned,
                userId: dataItem.created_by?.guid || dataItem.user_id,
                additionalFields: {}
            };

            // Add any additional fields to additionalFields
            Object.keys( dataItem ).forEach( ( key ) => {
                if ( ! [ 'cid', 'name', 'size_in_bytes', 'document_type', 'created', 'created_by', 'ipfs_pin_hash', 'metadata', 'size', 'mime_type', 'date_pinned', 'user_id' ].includes( key ) ) {
                    commonItem.additionalFields[ key ] = dataItem[ key ];
                }
            } );

            commonStructureArray.push( commonItem );
        } );

        return commonStructureArray;
    }

    private mapToCommonPinFileStructure( response: any ): CommonPinStructure {
        const dataItem = Array.isArray( response.data.data ) ? response.data.data[ 0 ] : response.data.data;

        const commonItem: CommonPinStructure = {
            ipfsHash: dataItem.IpfsHash || dataItem.cid,
            fileSize: dataItem.PinSize || dataItem.size_in_bytes,
            timestamp: dataItem.Timestamp || dataItem.created,
            additionalFields: {}
        };

        // Add any additional fields to additionalFields
        Object.keys( dataItem ).forEach( ( key ) => {
            if ( ! [ 'IpfsHash', 'cid', 'PinSize', 'size_in_bytes', 'Timestamp', 'created' ].includes( key ) ) {
                commonItem.additionalFields[ key ] = dataItem[ key ];
            }
        } );

        return commonItem;
    }

    public async listPinnedFiles() {
        const response = await this.listPinnedFilesImpl();

        if ( response.status === 200 ) {
            return this.mapToCommonListStructure( response );
        }

        throw new Error( "Failed to list pinned files" );
    }

    public async pinFile( file: File, metadata: any ) {
        const response = await this.pinFileImpl( file, metadata );

        if ( response.status === 200 ) {
            return this.mapToCommonPinFileStructure( response );
        }


        throw new Error( "Failed to pin file" );
    }

    public getClientInstance() {
        return this.client;
    }
}

