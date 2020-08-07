require('locus');
var router                 = require("express").Router(),
	flash                   = require("connect-flash"),
	methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
	passport                = require("passport"),
	moment                  = require("moment"),
	middlewareobj           = require("../middleware"),
	User                    = require("../models/user.js"),
	Photos                  = require("../models/photos.js"),
	Notification            = require("../models/notification.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	Comments                = require("../models/comments.js"),
	multer                  = require('multer'),
	async                   = require("async"),
	nodemailer              = require("nodemailer"),
	crypto                  = require("crypto"),
	Email                   = require("email-templates");


router.get("/instapic/admin/:userid" , middlewareobj.isloggedin , async function(req , res){
	try{
		if(req.user.username === process.env.ADMIN_ROLE){
			let todaysDateTime = new Date().getTime();
			let allUsers = await User.find({});
			
			// New Accounts
			let newAccounts = [];
			let approvedAccounts = [];
			let unapprovedAccounts = [];
			
			
			allUsers.forEach(function(user){
				 // New Accounts
				 var accountCreated = moment.utc(user.created).valueOf();
				 if(todaysDateTime - accountCreated <= 24*60*60*1000){
					newAccounts.push(user);
				 }
				
				if(user.isApproved === true){
					// Approved Accounts
					approvedAccounts.push(user);
				}else{
					// Unapproved Accounts
					unapprovedAccounts.push(user);
				}
			});
			res.render("Admin-pages/admin.ejs" , { newAccounts : newAccounts , approvedAccounts : approvedAccounts , 
												  unapprovedAccounts :unapprovedAccounts , allaccounts : allUsers  });
		}else{
			req.flash("error" , "You don't have permission to get this page");
			res.redirect("/instapic");
		}
	}catch(err){
		req.flash("error" , "Something went wrong. Your are not admin");
		res.redirect("back");
	}
});

router.get("/user/:id/Account/:baduserid/unapprove" , middlewareobj.isloggedin , async function(req , res){
	try{
		// let adminuser = await User.findById(req.params.id);
		if(req.user.username === process.env.ADMIN_ROLE){
			let baduser = await User.findById(req.params.baduserid);
			baduser.isApproved = false;
			baduser.save();
			req.flash("success" , baduser.fullname + " account is unapproved.");
			res.redirect("/instapic/admin/"  + req.user._id);
		}else{
			req.flash("error" , "You don't have permission to channge others data");
			res.redirect("/instapic");
		}
	} catch(err){
		req.flash("error" , "Something went wrong. please try again later.")
	}
});

router.get("/user/:id/Account/:baduserid/approve" , middlewareobj.isloggedin , async function(req , res){
	try{
		// let adminuser = await User.findById(req.params.id);
		if(req.user.username === process.env.ADMIN_ROLE){
			let baduser = await User.findById(req.params.baduserid);
			baduser.isApproved = true;
			baduser.save();
			req.flash("success" , baduser.fullname + " account is approved.");
			res.redirect("/instapic/admin/"  + req.user._id);
		}else{
			req.flash("error" , "You don't have permission to channge others data");
			res.redirect("/instapic");
		}
	} catch(err){
		req.flash("error" , "Something went wrong. please try again later.")
	}
});



module.exports = router;


