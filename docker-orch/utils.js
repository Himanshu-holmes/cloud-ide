function formattedResponse(status,data,message){
    return {
        status,data,message
    }
};


function sendResponse(res, statusCode, data, message) {
    return res.status(statusCode).json({
      status: statusCode,
      data: data,
      message: message,
    });
  }

  
module.exports = {
    formattedResponse,
    sendResponse
}