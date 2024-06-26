import React from "react";

import { Button, Code, Input, Select, SelectItem } from "@nextui-org/react";

import { AxiosError } from "axios";

import { ipfsPingingApisGetAll } from "../../modules/ipfs/apis";

import type { IPFSPinningGatewayConfig } from "../../modules/ipfs/ipfs-definitions";

const pinningGatewayApis = await ipfsPingingApisGetAll();

const mappedPinningGateways = ( ( await ipfsPingingApisGetAll() ) ).map( ( gateway, index ) => ( {
    index,
    ... gateway.getConfig(),
} ) );

export default function PinningGateways() {
    const [ selectedGateway, setSelectedGateway ] = React.useState<IPFSPinningGatewayConfig | null>( null );
    const [ shouldDisableFields, setShouldDisableFields ] = React.useState( false );
    const [ isConnected, setIsConnected ] = React.useState( false );
    const [ apiError, setApiError ] = React.useState<AxiosError | Error | null>( null );

    const handlePinningGatewaySelection = ( index: number ) => {
        const gateway = mappedPinningGateways[ index ];

        setSelectedGateway( gateway );
    };

    const handleFieldChange = ( fieldKey: string, value: string ) => {
        selectedGateway && setSelectedGateway( {
            ... selectedGateway,
            fields: {
                ... selectedGateway.fields,
                [ fieldKey ]: value,
            },
        } );
    };

    const handleTestConnection = async () => {
        try {
            const api = pinningGatewayApis.find( ( api ) => api.getName() === selectedGateway!.name )!;

            const response = await api.handshake( selectedGateway! );

            if ( response instanceof AxiosError ) {
                // noinspection ExceptionCaughtLocallyJS
                throw response;
            }

            setApiError( null );
            setShouldDisableFields( true );
            setIsConnected( true );
        } catch ( e ) {
            setApiError( e as ( Error | AxiosError ) );
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatErrorResponse = ( error: AxiosError | Error | any ) => {
        if ( error && error.response?.data ) {
            return (
                <pre className="text-black border border-red-400 rounded-md p-1 m-3">
                    { "error.response.data = " + JSON.stringify( error.response.data, null, 2 ) }
                </pre>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col gap-4 pt-[30px]">
            <Select
                items={ mappedPinningGateways }
                selectionMode={ "single" }
                placeholder="Select a Gateway"
                selectedKeys={ selectedGateway ? [ selectedGateway.index!.toString() ] : [] }
                onChange={ ( e ) => handlePinningGatewaySelection( Number( e.target.value ) ) }
                isDisabled={ shouldDisableFields }
            >
                { ( gateway =>
                        <SelectItem key={ gateway.index }>
                            { gateway.name }
                        </SelectItem>
                ) }
            </Select>

            { selectedGateway && (
                <>
                    { selectedGateway && Object.entries( selectedGateway.fields ).map( ( [ key, value ] ) => (
                        <Input
                            key={ key }
                            label={ key }
                            value={ value }
                            onChange={ ( e ) => handleFieldChange( key, e.target.value ) }
                            isDisabled={ shouldDisableFields }
                            fullWidth
                        />
                    ) ) }

                    { apiError && (
                        <Code color="danger">
                            { apiError.message }
                            { formatErrorResponse( apiError ) }
                        </Code>
                    ) }

                    { isConnected && (
                        <Code color="success" className="text-large">
                            Connected to { selectedGateway.name } successfully! you can start use it.
                        </Code>
                    ) }

                    { ( selectedGateway && ! isConnected ) && (
                        <Button onClick={ handleTestConnection } color={ "primary" } >
                            Test Connection
                        </Button>
                    ) }
                </>
            ) }
        </div>
    );
}
