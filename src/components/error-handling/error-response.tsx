import React from "react";

import { AxiosError } from "axios";

const ErrorResponse: React.FC<{ error: AxiosError | Error | any }> = ( { error } ) => {
    console.debug( error );

    if ( error.response?.data ) {
        return (
            <pre className="text-black border border-red-400 rounded-md p-1 mt-3 mb-3">
                { "error.response.data = " + JSON.stringify( error.response.data, null, 2 ) }
            </pre>
        );
    } else if ( error.code ) {
        return (
            <pre className="text-black border border-red-400 rounded-md p-1 mt-3 mb-3">
                { "error.code = " + JSON.stringify( error.code, null, 2 ) }
                { "error.message = " + JSON.stringify( error.message, null, 2 ) }
            </pre>
        );
    } else if ( error instanceof Error ) {
        return (
            <div className="text-black border border-red-400 rounded-md p-1 mt-3 mb-3">
                { error.message }
            </div>
        );
    }

    return null;
};

export default ErrorResponse;
