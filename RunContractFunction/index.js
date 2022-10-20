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

        const abi = JSON.parse(req.body.FunctionArgument.functionAbi);
        const params = JSON.parse(req.body.FunctionArgument.functionParams);

        const response = await Moralis.EvmApi.utils.runContractFunction({
            abi,
            functionName: req.body.FunctionArgument.functionName,
            address: req.body.FunctionArgument.contractAddress,
            chain: req.body.FunctionArgument.chainid,
            params
        });

        context.res = {
            body: response.result
        };

    } catch (error) {

        console.log(error);
        context.res = {
            status: 500,
            body: JSON.stringify(error)
        }
    }
}   