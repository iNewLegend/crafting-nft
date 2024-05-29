import fetch from 'node-fetch';

// URL of the gateways list
const gatewaysUrl = 'https://raw.githubusercontent.com/ipfs/public-gateway-checker/main/gateways.json';

// IPFS hash to test with
const hash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';

async function checkGateways() {
    // Fetch the list of gateways
    const response = await fetch(gatewaysUrl);
    const gateways = await response.json();

    const results = [];

    for (const gateway of gateways) {
        const url = gateway.replace(':hash', hash);

        try {
            const start = Date.now();
            const response = await fetch(url);
            const elapsed = Date.now() - start;

            if (response.ok) {
                results.push({ gateway, responseTime: elapsed });
            } else {
                console.log(`${gateway} is offline.`);
            }
        } catch (error) {
            console.log(`${gateway} is offline.`);
        }
    }

    // Sort the results by response time (ascending order)
    results.sort((a, b) => a.responseTime - b.responseTime);

    // Print the sorted gateways
    console.log('Gateways sorted by response time');
    for (const result of results) {
        console.log(`${result.gateway} - Response time: ${result.responseTime} ms`);
    }

    return results;
}

checkGateways().then( console.log );
