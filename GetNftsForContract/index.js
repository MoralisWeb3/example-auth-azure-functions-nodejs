const Moralis = require('moralis').default;

const ApiKey = process.env.MORALIS_API_KEY;

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

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address: req.body.FunctionArgument.walletAddress,
            chain: req.body.FunctionArgument.chainid
        });

        context.res = {
            body: response
        };

    } catch (error) {

        console.log(error);
        context.res = {
            status: 500,
            body: JSON.stringify(error)
        }
    }
}   