var mongoose = require("mongoose");

var photosSchema = new mongoose.Schema({
	img:"string",
	description:"string",
	author : {
		     id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		     },
		    username : "string"
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