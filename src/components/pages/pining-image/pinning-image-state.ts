import { AxiosError } from "axios";

import type { PinningApiBase } from "../../../modules/ipfs/apis/pinning-api-base.ts";
import type { IPFSPublicGateway } from "../../../modules/ipfs/ipfs-definitions";
import type { ipfsCatCidFromPublicGateways } from "../../../modules/ipfs/ipfs-public-gateways.ts";

type TPublicGatewaysResult = Awaited<ReturnType<typeof ipfsCatCidFromPublicGateways>>;

export type TPinningImageFormState = {
    name: string;
    image: ArrayBuffer | null;
    file: File | null;

    pinningGatewayApi: {
        api: typeof PinningApiBase;
        name: string;
    } | null;

    publicGateways: IPFSPublicGateway[];

    publicGatewaysResult: TPublicGatewaysResult | null;

    loadingState: string | false;
    errorResponse: AxiosError | Error | any | null;
};

export type TPinningImageFormActions =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_IMAGE_FILE'; payload: { image: ArrayBuffer; file: File } }

    | { type: 'SET_PINNING_GATEWAY_API'; payload: TPinningImageFormState['pinningGatewayApi'] }
    | { type: 'SET_PUBLIC_GATEWAYS'; payload: IPFSPublicGateway[] }
    | { type: 'SET_PUBLIC_GATEWAYS_RESULT'; payload: TPublicGatewaysResult }

    | { type: 'SET_IS_LOADING'; payload: false | string }
    | { type: 'SET_ERROR_RESPONSE'; payload: AxiosError | Error | any };

export function pinningImageFormReducer( state: TPinningImageFormState, action: TPinningImageFormActions ): TPinningImageFormState {
    switch ( action.type ) {
        case 'SET_NAME':
            return { ... state, name: action.payload };
        case 'SET_IMAGE_FILE':
            return { ... state, image: action.payload.image, file: action.payload.file, name: action.payload.file.name };

        case 'SET_PINNING_GATEWAY_API':
            return { ... state, pinningGatewayApi: action.payload };
        case 'SET_PUBLIC_GATEWAYS':
            return { ... state, publicGateways: action.payload };

        case 'SET_PUBLIC_GATEWAYS_RESULT':
            return { ... state, publicGatewaysResult: action.payload };

        case 'SET_IS_LOADING':
            return { ... state, loadingState: action.payload };

        case 'SET_ERROR_RESPONSE':
            return { ... state, errorResponse: action.payload };

        default:
            return state;
    }
}
