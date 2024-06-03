import React from "react";

import { Table, TableHeader, TableColumn, TableRow, TableCell, TableBody } from "@nextui-org/react";

import { FetchPinningGateways } from "../gateways-selection/fetch.ts";

import LoadingSpinner from "../loading/loading-spinner.tsx";

import use from "../../utils/react-use.ts";

import type { PinningApiBase } from "../../modules/ipfs/apis/pinning-api-base.ts";
import type { CommonListStructure } from "../../modules/ipfs/apis/definitions.ts";

const PinningList: React.FC = () => {
    async function fetchPinnedFiles( gateways: typeof PinningApiBase[] ) {
        const result: { [ gateway: string ]: CommonListStructure[] } = {};

        for ( const gateway of gateways ) {
            const api = gateway.getCachedInstance();

            result[ gateway.getName() ] = await api.listPinnedFiles();
        }

        return result;
    }

    const renderPinnedFiles = ( gateways: typeof PinningApiBase[] ) => {
        if ( ! gateways.length ) {
            return <p>No gateways available</p>;
        }

        const pinnedFiles = use( () => fetchPinnedFiles( gateways ), {
            cacheTTL: 1000 * 60 * 15,
        } );

        return <>
            { Object.keys( pinnedFiles ).map( ( gateway ) => (
                <div key={ gateway }>
                    <p className="text-large mt-5">{ gateway }</p>
                    <Table
                        aria-label="Pinned Files Table"
                        className="mt-5"
                        isStriped={ true }
                        removeWrapper={ true }
                        fullWidth={ true }
                        layout="fixed"
                    >
                        <TableHeader>
                            <TableColumn className="w-[15%]">File Name</TableColumn>
                            <TableColumn className="w-[25%]">IPFS Hash</TableColumn>
                            <TableColumn className="w-[5%]">File Size</TableColumn>
                            <TableColumn className="w-[7.5%]">MIME Type</TableColumn>
                            <TableColumn className="w-[20%]">Date Pinned/Created</TableColumn>
                        </TableHeader>
                        <TableBody>
                            { pinnedFiles[ gateway ].map( ( file: CommonListStructure, index: number ) => (
                                <TableRow key={ index }>
                                    <TableCell>{ file.fileName }</TableCell>
                                    <TableCell>{ file.ipfsHash }</TableCell>
                                    <TableCell>{ file.fileSize }</TableCell>
                                    <TableCell>{ file.mimeType }</TableCell>
                                    <TableCell>{ file.datePinnedOrCreated }</TableCell>
                                </TableRow>
                            ) ) }
                        </TableBody>
                    </Table>
                </div>
            ) ) }
        </>
    };

    return (
        <React.Suspense fallback={ <LoadingSpinner/> }>
            <p className="text-2xl">Pinning List</p>
            <FetchPinningGateways ui={ ( { gateways } ) => renderPinnedFiles( gateways ) }/>
        </React.Suspense>
    )
};

export default PinningList;
