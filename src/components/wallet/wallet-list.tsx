import { Button, Image } from "@nextui-org/react";

import styles from "./wallet.module.scss";

export default function WalletList( props: {
    providers: EIP6963ProviderDetail[],
    onWalletSelected: ( providerWithInfo: EIP6963ProviderDetail ) => void
} ) {
    const { providers, onWalletSelected } = props;

    return (
        <div className={ styles.list }>
            { providers?.map( ( provider: EIP6963ProviderDetail ) => (
                <Button className={ styles.walletButton } key={ provider.info.uuid }
                        onClick={ () => onWalletSelected( provider ) }>

                    <Image src={ provider.info.icon } alt={ provider.info.name }/>

                    <span>{ provider.info.name }</span>
                </Button>
            ) ) }
        </div>
    );
}
