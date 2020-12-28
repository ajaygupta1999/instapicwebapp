// AUTH RELATED ROUTES =================
var router                  = require("express").Router(),
	flash                   = require("connect-flash"),
    mongoose                = require("mongoose"),
	passport                = require("passport"),
	User                    = require("../models/user.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	nodemailer              = require("nodemailer"),
	async                   = require("async"),	
	Email                   = require("email-templates"),
	crypto                  = require("crypto");


// Google Oauth Setup ====================================
const { google }            = require("googleapis");
const oAuth2Client  = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID , 
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL
)

oAuth2Client.setCredentials({ refresh_token : process.env.GOOGLE_REFRESH_TOKEN });
// =======================================================

router.get("/login" , function(req,res){
	 res.render("Auth-related-pages/login.ejs");
});

router.post("/login" , passport.authenticate("local" , {
    successRedirect : "/instapic",
	failureRedirect : "/login",
	failureFlash: true
}),  function(req,res){
	console.log("you are trying to login");
	console.log(req.user);
});

router.get("/logout" , function(req,res){
	req.logout();
	res.redirect("/instapic");
});

// FORGOT PASSWORD SESSION
router.get("/instapic/forgot" , function(req , res){
	res.render("Auth-related-pages/forgotpass.ejs");
});

// GETTING DATA FROM FORGOT ROUTES
router.post("/instapic/forgot" , async function(req ,res ,next){
	try{
		
		let token = await crypto.randomBytes(20).toString('hex'); 
		let user = await User.findOne({username : req.body.email});
		if(user){
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 5400000;
			user.save();
		}else{
			req.flash("error" , "Something Went Wrong while Reseting Password");
			res.redirect("/instapic/forgot");
		}
		
		
		// Send mail to client
		let verificationlink = process.env.WEBSITE_URL +  '/instapic/forgot/' + token;
		const accessToken = await oAuth2Client.getAccessToken();
		
		let smtpTransport = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			service: 'gmail',
			auth : {
				    type : "OAUTH2",
					user : process.env.PERSONAL_EMAIL,
					clientId: process.env.GOOGLE_CLIENT_ID,
					clientSecret : process.env.GOOGLE_CLIENT_SECRET,
					refreshToken : process.env.GOOGLE_REDIRECT_URL,
					accessToken : accessToken.token
			}
		});
		const email = new Email({
				views : { root : "./views/Email-templates" , options : { extension : "ejs" }}, 
				message: {
				     from: process.env.PERSONAL_EMAIL
				},
				send: true,
				transport: smtpTransport,
		});

		let result = await email.send({
			template: 'reset-password',
				message: {
					to:  req.body.email
				},locals: {
					link: verificationlink
				}
				}); 
		req.flash("success" , "An email has been send to " + req.body.email + " with the futher Instructions to reset your password.");
		res.redirect("/instapic/forgot");
		
		
	}catch(err){
		console.log(err.message);
		req.flash("error" , "Something Went Wrong while Reseting Password");
		return res.redirect("/instapic/forgot");
	}
});

// HANDLE TOKEN WHEN EMAIL IS SENDING
router.get("/instapic/forgot/:token" , function(req,res){
   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }},     function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/instapic/forgot');
       }
       res.render('Auth-related-pages/resetpass.ejs', {token: req.params.token});
      });
});


// GETTING DATA FROM CONFORM PASSWORD
router.post("/instapic/forgot/:token" , async function(req ,res){
	
	try{
		
		let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
		if(!user){
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('back');
		}
		if(req.body.newpassword === req.body.conpassword){
			user.setPassword(req.body.newpassword , function(err){
				 user.resetPasswordToken = undefined;
				 user.resetPasswordExpires = undefined;
				 user.save(function(err){
					 if(err) done(err, user);
				 });
			});
		}else{
			req.flash("error" , "passwords do not match.");
			return res.redirect("back");
		}

		const accessToken = await oAuth2Client.getAccessToken();

		let smtpTransport = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			service: 'gmail',
			auth : {
					type : "OAUTH2",
					user : process.env.PERSONAL_EMAIL,
					clientId: process.env.GOOGLE_CLIENT_ID,
					clientSecret : process.env.GOOGLE_CLIENT_SECRET,
					refreshToken : process.env.GOOGLE_REDIRECT_URL,
					accessToken : accessToken.token
			}
		});

		const email = new Email({
			 views : { root : "./views/Email-templates" , options : { extension : "ejs" }}, 
			 message: {
			   from: process.env.PERSONAL_EMAIL
			 },
			 send: true,
			 transport: smtpTransport,
		});

		let response = await email.send({
			template: 'confirm-password',
			message: {
					to:  user.username
			}
		});
		req.flash("success" , "Password reset is successful. Please login with new credentials")
		res.redirect("/login");
		
	}catch(err){
		console.log(err);
		req.flash("error" , "Something went wrong while reseting your password. please try again later.");
		res.redirect("/instapic");
	}
	
});


module.exports = router;