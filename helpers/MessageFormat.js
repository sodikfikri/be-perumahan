const responses = require("../config/responses")

class MessageFormat {

    SetMessage(code, message) {
        let apiResult = {}
        switch (code) {
            case '200':
                apiResult = {...responses[200]}
                break;
            case '201':
                apiResult = {...responses[201]}
                break;
            case '400':
                apiResult = {...responses[400]}
                break;
            case '404':
                apiResult = {...responses[404]}
                break;
            case '401':
                apiResult = {...responses[401]}
                break;
            case '500':
                apiResult = {...responses[500]}
                break;
            default:
                apiResult = {...responses[400]}
                break;
        }
        apiResult.meta.message = message
        return apiResult
    }

}

module.exports = new MessageFormat()