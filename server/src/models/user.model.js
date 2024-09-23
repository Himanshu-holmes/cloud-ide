const mongoose= require('mongoose');
const {Schema} = mongoose;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require('../constant');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
       
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    avatar:{
        type: String, // cloudinary url
        required: true,  
    },
    coverImage:{
        type: String, //cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Reel'
        }
    
    ],
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken:{
        type: String,
    },


},{timestamps: true});

userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
 return jwt.sign({
        id: this._id,
        username: this.username,
  },ACCESS_TOKEN_SECRET,{
    expiresIn:ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign({
        id: this._id,
        username: this.username,
  },REFRESH_TOKEN_SECRET,{
    expiresIn:REFRESH_TOKEN_EXPIRY
  })
}

const User = mongoose.model('User', userSchema);

module.exports = User;