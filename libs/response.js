function success(responseObj, message, request = '') {  
    let respData = {
        data: responseObj,
        message: message || 'success',
    };
    return respData;
}

function errors(errorObj,fullError = '', request = '') {

    let statusCode = '';
            
    if(fullError && fullError.response && fullError.response.status){
        statusCode = fullError.response.status;
    }

    if(fullError && fullError.code){
        statusCode = fullError.code;
    }

    if(fullError && fullError.statusCode){
        statusCode = fullError.statusCode;
    }

    let msgError = {};
    if (errorObj.errors && Object.keys(errorObj.errors).length > 0) {
        for (let er in errorObj.errors) {
            msgError[er] = [errorObj.errors[er].message]           
        }
    }
    let respData = {
        
        errors: msgError,
        message: errorObj.message || 'Something went wrong.'
    };
    return respData;
}


function pagination(responseObj, message,paginationData, request = '') {

    let total = (responseObj && responseObj[0] && responseObj[0].total && responseObj[0].total[0] && responseObj[0].total[0].total)?responseObj[0].total[0].total:0;

    let resultEnd = (paginationData.offset == 0)?paginationData.limit:paginationData.offset+paginationData.limit;
    if(resultEnd>total){
        resultEnd = total;
    }
    
    let respData = {
        message: message || 'success',
        data: responseObj[0].data,      
        pagination:{
            total:total,
            per_page:paginationData.limit,
            current_page:paginationData.page,
            result_start:(paginationData.offset ==0)?1:paginationData.offset+1,
            result_end:resultEnd
        }
    };
    return respData;
}

function validationPagination(page,perPage) { 
    if(!page){
        page = 1;
    }
    if(!perPage){
        perPage = 10;
    }
    page = Number(page);
    perPage = Number(perPage);

    let offset = (page-1)*perPage;

    return {
        page:page,
        limit:perPage,
        offset:offset
    }


}

function cleanEmptyValues(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || !obj[propName]) {
        delete obj[propName];
      }
    }
    return obj
  }


module.exports = {
    success,
    errors,
    pagination,
    validationPagination,
    cleanEmptyValues
}