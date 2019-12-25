var mongoose               = require("mongoose");
var passportLocalMongoose  = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username : "string",
	password : "string",
	avatar  :  "string",
	avatarId : "string",
	fullname : "string",
	created: { type: Date, default: Date.now },
	description : "string",
	isadmin : {type : Boolean , default : false},
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