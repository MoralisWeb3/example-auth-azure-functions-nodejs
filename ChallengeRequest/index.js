const Moralis = require('moralis').default;

const ApiKey = process.env.MORALIS_API_KEY;

const NETWORK = 'evm'; // We assume it's we are using an EVM-compatible chain
const DOMAIN = 'moralis.io';
const STATEMENT = 'Please sign this message to confirm your identity.';
const URI = 'https://moralis.io/';
const EXPIRATION_TIME = '2023-01-01T00:00:00.000Z';
const TIMEOUT = 15;

Moralis.start({
    apiKey: ApiKey
})

module.exports = async function (context, req) {

    try {
        
        if (!req.body) {
            context.res = {
                status: 400,
                body: "Please pass a request body",
            };
        }

        const result = await Moralis.Auth.requestMessage({
            address: req.body.FunctionArgument.address, 
            chain: req.body.FunctionArgument.chainid, 
            network: NETWORK,
            domain: DOMAIN,
            statement: STATEMENT,
            uri: URI,
            expirationTime: EXPIRATION_TIME,
            timeout: TIMEOUT,
        })

        context.res = {
            body: result.raw.message // We just want to return the message
        };

    } catch (error) {

        console.log(error);
        context.res = {
            status: 500,
            body: JSON.stringify(error)
        }
    }
}   