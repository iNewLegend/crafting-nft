import type { PinningApiBase } from "../../../modules/ipfs/apis/pinning-api-base.ts";
import type { IPFSPublicGateway } from "../../../modules/ipfs/ipfs-definitions";

export type TPinningImageFormState = {
    name: string;
    description: string;
    image: ArrayBuffer | null;
    file: File | null;
    pinningGatewayApi: {
        api: typeof PinningApiBase;
        name: string;
    } | null;
    publicGateways: IPFSPublicGateway[];
};

export type TPinningImageFormActions =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_IMAGE_FILE'; payload: { image: ArrayBuffer; file: File } }
    | { type: 'SET_PINNING_GATEWAY_API'; payload: TPinningImageFormState['pinningGatewayApi'] }
    | { type: 'SET_PUBLIC_GATEWAYS'; payload: IPFSPublicGateway[] };

export function pinningImageFormReducer( state: TPinningImageFormState, action: TPinningImageFormActions ): TPinningImageFormState {
    switch ( action.type ) {
        case 'SET_NAME':
            return { ... state, name: action.payload };
        case 'SET_DESCRIPTION':
            return { ... state, description: action.payload };
        case 'SET_IMAGE_FILE':
            return { ... state, image: action.payload.image, file: action.payload.file };
        case 'SET_PINNING_GATEWAY_API':
            return { ... state, pinningGatewayApi: action.payload };
        case 'SET_PUBLIC_GATEWAYS':
            return { ... state, publicGateways: action.payload };
        default:
            return state;
    }
}
