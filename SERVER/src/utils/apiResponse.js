class ApiResponse {
    constructor(status, message, data = null) {
      this.status = status;
      this.message = message;
      if (data !== null) {
        this.data = data;
      }
    }
  }
  
  module.exports = {
    successResponse: (message, data = null) => {
      return new ApiResponse(200, message, data);
    },
  
    createdResponse: (message, data = null) => {
      return new ApiResponse(201, message, data);
    },
  
    badRequestResponse: (message, data = null) => {
      return new ApiResponse(400, message, data);
    },
  
    unauthorizedResponse: (message, data = null) => {
      return new ApiResponse(401, message, data);
    },
  
    forbiddenResponse: (message, data = null) => {
      return new ApiResponse(403, message, data);
    },
  
    notFoundResponse: (message, data = null) => {
      return new ApiResponse(404, message, data);
    },
  
    serverErrorResponse: (message, data = null) => {
      return new ApiResponse(500, message, data);
    },
  };
  