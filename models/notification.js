var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
	type:  "String",
	photoId : "string",
	created : "string",
	imgurl : "String",
	commentid : {
		type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
	},
	isAlbum : { type: Boolean , default: false },
	description: "String",
	from : {
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	},   
	isRead : { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);