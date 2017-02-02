var getApiAddress = function () {

    if(process.env.DASHVID_API_ADDRESS) {
        return process.env.DASHVID_API_ADDRESS
    }

    return "https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev"
}


export {getApiAddress};