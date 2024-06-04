import React from "react";

export const LoadingDots: React.FC<{ message?: string }> = ( { message } ) => {
    return (
        <p className="text-center">
            { message }&nbsp;
            <span className="animate-ping text-2xl">.</span>
            <span className="animate-ping-delay-200 text-2xl">.</span>
            <span className="animate-ping-delay-400 text-2xl">.</span>
        </p>
    );
};

export default LoadingDots;
