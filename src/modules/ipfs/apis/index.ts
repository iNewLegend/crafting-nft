import type { APIClientBase } from "./api-client-base.ts";

export default async function ( apiName: string ): Promise<typeof APIClientBase> {
    let module;
    switch ( apiName ) {
        case "dolphin.io":
            module = await import( "./dolphin.io.ts" );
            break;
        case "pinata.cloud":
            module = await import( "./pinata.cloud.ts" );
            break;

        default:
            throw new Error( `Unknown API: ${ apiName }` );
    }

    return module.default;
}
