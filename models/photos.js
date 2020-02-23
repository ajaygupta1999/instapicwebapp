var mongoose = require("mongoose");

var photosSchema = new mongoose.Schema({
	img:"string",
	imgId : "string",
	angle : "Number",
	description:"string",
	status : "string",
	author : {
		     id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		     },
		    username : "string",
		    fullname : "string"
	    },
	comments : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : "Comments"
	}],
	likes : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : "User"
	}],
	
});

module.exports = mongoose.model("Photos" , photosSchema);