
const responseCode = {
    en: {
        "RECORD_CREATED": "Record has been created successfully",
        "RECORD_UPDATED": "Record has been updated successfully",
        "RECORD_DELETED": "Record has been deleted successfully",
        "SUCCESS": "Success",
        "SOMETHING_WRONG": "Something went wrong.",
        "ID_MISSING": "Id is missing",
        "NO_RECORD_FOUND": "No record found",
        "USER_NOT_FOUND":"User not found",
        "TOKEN_IS_EXPIRED":"Token is expired, Please try to login again",
        "TOKEN_VERIFICATON_FAILED":"Token Verificaton failed",
        "INACTIVE_ACCOUNT":"Inactive account",
        "INVALID_TOKEN":"Invalid token",          
        "VENDOR_NOT_EXISTS":"Please add vendors"          
    }
   }



function responseMessage(lang, type, value = "") {
    try {
        if (!lang) {
            lang = 'en';
        }

        let message = (responseCode[lang] && responseCode[lang][type])?responseCode[lang][type]:"";
        message = message ? message : responseCode[lang]['SUCCESS'];
        message = (value) ? message.replace("{DYNAMIC_VALUE}", value) : message;
        return message;
    } catch (error) {
        let message = (responseCode[lang] && responseCode[lang][type])?responseCode[lang]['SUCCESS']:"";
        return message;
    }
}



module.exports = {
    responseMessage,
    responseCode
}
