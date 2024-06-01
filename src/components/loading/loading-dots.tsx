export default function LoadingDots() {
    return (
        <p className="text-center">
            Loading gateways&nbsp;
            <span className="animate-ping text-2xl">.</span>
            <span className="animate-ping-delay-200 text-2xl">.</span>
            <span className="animate-ping-delay-400 text-2xl">.</span>
        </p>
    );
}
