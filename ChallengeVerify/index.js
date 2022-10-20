const Moralis = require('moralis').default;
var PlayFab = require("playfab-sdk/Scripts/PlayFab/PlayFab.js");
var PlayFabServer = require("playfab-sdk/Scripts/PlayFab/PlayFabServer.js");

const PlayFabTitleId = process.env.PLAYFAB_TITLE_ID
const PlayFabDeveloperKey = process.env.PLAYFAB_DEV_SECRET_KEY 

const NETWORK = 'evm'; // We assume it's we are using an EVM-compatible chain

module.exports = async function (context, req) {

    try {
        
        if (!req.body) {
            context.res = {
                status: 400,
                body: "Please pass a request body",
            };
        }

        const verifiedData = await Moralis.Auth.verify({
            message: req.body.FunctionArgument.message,
            signature: req.body.FunctionArgument.signature,
            network: NETWORK,
        })

        // When do we consider that the authentication is completed? Before or After updating user data in PlayFab??
        // Maybe here we should already return if the data has been verified or not.
        
        context.res = {
            body: verifiedData.raw
        };

        //TODO Set PlayFab player data with some of the verified data!
        PlayFab.settings.titleId = PlayFabTitleId;
        PlayFab.settings.developerSecretKey = PlayFabDeveloperKey;

        // Preparing request
        var updateUserDataRequest = {
            PlayFabId: req.body.CallerEntityProfile.Lineage.MasterPlayerAccountId,
            Data: {
                "MoralisProfileId": verifiedData.raw.id,
                "Address": verifiedData.raw.address,
                "ChainId": verifiedData.raw.chainId
            }
        }

        context.log(PlayFabServer);
        
        PlayFabServer.UpdateUserReadOnlyData(
            updateUserDataRequest,
            (error, result) => {
                if (result !== null) {
                    context.log("API call was successful.");
                    context.res = {
                        status: 200,
                        body: result
                    };
                    context.done();
    
                } else if (error !== null) {
                    context.log("Something went wrong with the API call.");
                    context.res = {
                        status: 500,
                        body: JSON.stringify(error)
                    };
                    context.done();
                }
            }
        )

    } catch (error) {

        context.log(error);
        context.res = {
            status: 500,
            body: JSON.stringify(error)
        }
    }
}   