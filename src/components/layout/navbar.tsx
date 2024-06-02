import React from "react";

import Brand from "../../assets/brand.png";

import {
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarItem,
    Link,
    NavbarBrand,
    Image,
    NavbarMenuItem,
    NavbarMenu,
    NavbarMenuToggle
} from "@nextui-org/react";

import styles from "./layout.module.scss";

type TTabNavbarProps = {
    selected: string;
    items: { name: string; label: string }[];

    endContentButton: React.ReactNode;

    onSelected: ( tabName: string ) => void;
};

const navbarBaseProps = {
    disableAnimation: true,
    classNames: {
        wrapper: styles.navbar,
        menu: styles.navbarMenu
    }
};

const TabsNavbar: React.FC<TTabNavbarProps> = ( { selected, items, onSelected, endContentButton } ) => {
    const [ isOpen, setIsOpen ] = React.useState( false );

    const onClickInternal = ( tabName: string ) => {
        setIsOpen( false );

        setTimeout( () => {
            onSelected( tabName );
        } );
    };

    const Menu = () => (
        <NavbarMenu className={ styles.navbar } portalContainer={ document.querySelector( "#layout-container" )! }>
            <div className={ styles.menuContainer }>
                { items.map( ( item, index ) => (
                    <NavbarMenuItem key={ `${ item }-${ index }` } isActive={ selected === item.name }>
                        <Link className="w-full" href="#" size="lg" onClick={ () => onClickInternal( item.name ) }>
                            { item.label }
                        </Link>
                    </NavbarMenuItem>
                ) ) }
            </div>
        </NavbarMenu>
    );

    return (
        <div>
            <NextUINavbar { ... navbarBaseProps } onMenuOpenChange={ setIsOpen } isMenuOpen={ isOpen }>
                <NavbarContent>
                    <NavbarBrand className="cursor-pointer" onClick={ () => onSelected( "default" ) }>
                        <Image src={ Brand } width={ 30 } height={ 30 } alt="NFT"/>
                        <p className="font-bold text-inherit ml-2">NFT</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        { endContentButton }
                    </NavbarItem>

                    <NavbarMenuToggle aria-label={ isOpen ? "Close menu" : "Open menu" } />
                </NavbarContent>

                <Menu/>
            </NextUINavbar>
        </div>
    );
};

export default TabsNavbar;
