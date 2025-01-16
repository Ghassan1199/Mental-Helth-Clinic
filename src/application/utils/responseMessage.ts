type ResponseMessage = {
    status: boolean;
    data?: object;
    message?: string;
    error?: string;
  }



const successfulResponse =(message: string, data?: object):ResponseMessage =>{

    return {
        status: true,
        message: message,
        data: data
    };
}


const failedResponse =(error: string):ResponseMessage =>{

    return {
        status: false,
        error: error,
    }
}

export {successfulResponse, failedResponse};
