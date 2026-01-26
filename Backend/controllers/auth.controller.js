const { default: admin } = require("../config/FirebaseAuth");
const { ApiResponse } = require("../utils/ApiResponse");
const {User} = require("../models/user.model");
const loginUser = async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "User logged in successfully")
    )
}

const GoogleLogin = async (req,res) => {
    const { token } = req.body;
    if(!token) {
        return res.status(400).json({message:"Token missing"});
    }
try{
    const decoded = await admin.auth().verifyIdToken(token);

    const {name,email} = decoded;
    let user = await User.findOne({email});

    if(!user){
        user = await User.create({name,email
        })
    }
    const jwtToken = jwt.sign(
        { id : user._id},
        process.env.JWT_SECRET,
        { expiresIn : "7d" }
    ) ;
   res.status(200).json({
    token : jwtToken,
    user,
   })
} catch (error) {
    console.error(error);
    res.status(401).json({ message : "Invalid Google Token" })
}

};

const logoutUser = async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
}

module.exports = {
    loginUser,
    logoutUser,
    GoogleLogin
}
