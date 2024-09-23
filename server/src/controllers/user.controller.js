const asyncHandler = require("../middleware/asyncHandler");

const registerUser = asyncHandler(async(req,res)=>{
    try {
        res.status(200).json({
            message:"ok"
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

module.exports = registerUser;