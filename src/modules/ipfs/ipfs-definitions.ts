export interface IPFSGateway {
    url: string;
    name: string;
    responseTime: number;
}

export interface IPFSPiningGateway {
    index: number;
    name: string;

    fields: {
        endpointUrl: string;

        token?: string;
        email?: string;
        username?: string;
        password?: string;
    } & unknown;

    proxy: {
        pathname: string,
        host: string,
    }
}
