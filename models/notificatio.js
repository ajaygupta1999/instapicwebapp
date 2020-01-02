var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
	username: String,
	fullname : String,
	photoId: String,
	isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);