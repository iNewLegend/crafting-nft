declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent
    }

    interface Window {
        ethereum: typeof Proxy;
    }
}

let providers: EIP6963ProviderDetail[] | null = null;

const store = {
    value: () => providers || [],
    subscribe: ( callback: () => void ) => {
        if ( ! window.ethereum ) {
            callback();
        }

        if ( providers ) {
            callback();

            return () => {}
        }

        providers = [];

        function onAnnouncement( event: EIP6963AnnounceProviderEvent ) {
            if ( providers!.map( p => p.info.uuid ).includes( event.detail.info.uuid ) ) return;
            providers = [ ... providers!, event.detail ];
            callback()
        }

        window.addEventListener( "eip6963:announceProvider", onAnnouncement );
        window.dispatchEvent( new Event( "eip6963:requestProvider" ) );

        return () => window.removeEventListener( "eip6963:announceProvider", onAnnouncement )
    }
};

export default store;
