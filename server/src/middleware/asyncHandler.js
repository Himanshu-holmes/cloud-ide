const asyncHandler = (requestHanler) => {
    return (req, res, next) => {
      Promise.resolve(requestHanler(req, res, next)).catch((err) =>
        next(err.message)
      );
    };
  };
  
  // const asyncHandler = (fn)=>async(req,res,next)=>{
  //   try {
  //     await fn(req,res,next)
  //   } catch (error) {
  //     res.status(err.code || 500).json({
  //         success:false,
  //         message:err.message || "Internal Server Error"
  //     })
  //   }
  // }
  
  module.exports = asyncHandler;