var mongoose               = require("mongoose");
var passportLocalMongoose  = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username : { type : String , unique : true },
	password : "string",
	avatar  :  "string",
	avatarId : "string",
	angle : "Number",
	fullname : "string" ,
	created: { type: Date, default: Date.now },
	description : "string",
	isadmin : {type : Boolean , default : false},
	resetPasswordToken : {type : String , default : undefined},
	resetPasswordExpires : {type : Date , default : undefined},
	isEmailVerified : {type : Boolean , default : false},
	emailverificationToken : {type : String , default : undefined},
	emailverificationTokenExpires : {type : Date , default : undefined},
	isApproved : {type : Boolean , default : false},
	notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: "Notification"
    	}
    ],
    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	}
    ],
	followings : [
		{
			type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
		}
	]
	
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , UserSchema);