var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
	text : "string",
	author : {
		     id: {
				type : mongoose.Schema.Types.ObjectId,
				ref : "User"
		     },
		     username : "string"
	    }
    }); 

module.exports = mongoose.model("Comments" , CommentSchema);