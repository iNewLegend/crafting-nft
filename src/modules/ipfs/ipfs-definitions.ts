export const DEFAULT_IPFS_TEST_HASH: string = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    DEFAULT_IPFS_LIST_TIMEOUT: number = 5000,
    DEFAULT_IPFS_CAT_TIMEOUT: number = 60000;

export interface IPFSPublicGateway {
    url: string;
    name: string;
    responseTime: number;
}

export interface IPFSPinningGateway {
    /**
     * @internal
     */
    index?: number;

    name: string;

    fields: {
        endpointUrl: string;

        token?: string;
        email?: string;
        username?: string;
        password?: string;
    } & unknown;

    proxy?: {
        pathname: string,
        host: string,
    }
}
