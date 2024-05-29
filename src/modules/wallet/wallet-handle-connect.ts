export default async function walletHandleConnect( providerWithInfo: EIP6963ProviderDetail ) {
    const accounts = await providerWithInfo.provider.request( {
        method: 'eth_requestAccounts'
    } );

    return {
        provider: providerWithInfo,
        account: ( accounts as Array<never> )?.[ 0 ]
    }
}

