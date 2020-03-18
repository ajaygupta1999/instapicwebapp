var mongoose               = require("mongoose");
var passportLocalMongoose  = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username : { type : String , unique : true },
	password : "string",
	avatar  :  "string",
	avatarId : "string",
	angle : "Number",
	fullname : { type : String , unique : true },
	created: { type: Date, default: Date.now },
	description : "string",
	isadmin : {type : Boolean , default : false},
	resetPasswordToken : {type : String , default : undefined},
	resetPasswordExpires : {type : Date , default : undefined},
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
    ]
	
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , UserSchema);