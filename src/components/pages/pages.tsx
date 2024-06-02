import React from "react";

import { Divider, Button, Link } from "@nextui-org/react";

import WalletContext from "../wallet/wallet-context";

import Navbar from "../layout/navbar";
import LoadingDots from "../loading/loading-dots";

const PageHome = React.lazy( () => import( "./home" ) ),
    PagePinningImage = React.lazy( () => import( "./pinning-image" ) ),
    PagePinningGateways = React.lazy( () => import( "./pinning-gateways" ) );

const pages = [
    { name: "home", label: "Home" },
    { name: "pinning-gateways", label: "Pinning Gateways" },
    { name: "ping-image", label: "Pinning Image" },
];

const Pages = () => {
    const [ currentPage, setCurrentPage ] = React.useState( "home" );

    const walletConnectContext = React.useContext( WalletContext );

    const getCurrentPage = ( page: string ) => {
        switch ( page ) {
            default:
            case "home":
                return <PageHome selectedWallet={ walletConnectContext.selected! }/>;

            case "ping-image":
                return <PagePinningImage/>;

            case "pinning-gateways":
                return <PagePinningGateways/>;
        }
    };

    function renderNavbar() {
        return <Navbar
            items={ pages }
            selected={ currentPage }
            onSelected={ setCurrentPage }
            endContentButton={
                <Button onClick={ () => walletConnectContext.logout() } as={ Link } color="primary" href="#"
                        variant="flat">
                    Logout
                </Button>
            }
        />;
    }

    return (
        <div id="pages">
            { renderNavbar() }

            <Divider id="pages-divider" className="mb-3 divider"/>

            <React.Suspense fallback={ <LoadingDots /> }>
                { getCurrentPage( currentPage ) }
            </React.Suspense>
        </div>
    )
};

export default Pages;
