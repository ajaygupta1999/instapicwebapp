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
	sendgridtransport       = require("nodemailer-sendgrid-transport"),
	crypto                  = require("crypto");
	

router.get("/login" , function(req,res){
	 res.render("Auth-related-pages/login.ejs");
});

router.post("/login" , passport.authenticate("local" , {
    successRedirect : "/instapic",
	failureRedirect : "/login",
	failureFlash: true
}),  function(req,res){
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
router.post("/instapic/forgot" , function(req ,res ,next){
	async.waterfall([
		function(done){
			crypto.randomBytes(20 , function(err , buf){
				if(err){
					req.flash("error" , "Something Went Wrong while Reseting Password");
					return res.redirect("/instapic/forgot");
				}
				  var token = buf.toString('hex');
				  done(err , token);	
			});
		} ,
		function(token , done){
			User.findOne({username : req.body.email} , function(err , user){
				if(err){
					req.flash("error" , "Something Went Wrong while Reseting Password");
					res.redirect("/instapic/forgot");
				}else{
					if(!user){
					   req.flash("error" , "User with this Email Address does not exist");
					   return res.redirect("/instapic/forgot");
					}
					
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 5400000;
					user.save(function(err){
						done(err , token , user);
					})
				}
			})
		} , 
		function(token , user , done){
			let verificationlink = process.env.WEBSITE_URL +  '/instapic/forgot/' + token;
			// let smtpTransport = nodemailer.createTransport(sendgridtransport({
			// 	auth : {
			// 		api_key : process.env.SENDGRID_APIKEY
			// 	},
			// }));
			
			let smtpTransport = nodemailer.createTransport({
				service : "Gmail",
					auth : {
						user : process.env.PERSONAL_EMAIL,
						pass  : process.env.EMAIL_PASS
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

				email.send({
					template: 'reset-password',
						message: {
							to:  req.body.email
						},locals: {
							link: verificationlink
						 }
				} , function(err){
					if(err){
						console.log(err.message)
					} else{
						done(err , "done");
					}
					
				});
						 
				done(null , "done");
		}
	], function(err){
			if(err){
				req.flash("error" , err.message);
				res.render("Auth-related-pages/forgotpass.ejs");	
			}else{
			    req.flash("success" , "An email has been send to " + req.body.email + " with the futher Instructions to reset your password.");
				res.redirect("/instapic/forgot");
			}
			
		});
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
router.post("/instapic/forgot/:token" , function(req ,res){
	async.waterfall([
		function(done){
		   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
			   if(err)
				   return console.log(err);
			  
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
			   done(null , user);
		    });	
		} , 
		function(user , done){
			// let smtpTransport = nodemailer.createTransport(sendgridtransport({
			// 	auth : {
			// 		api_key : process.env.SENDGRID_APIKEY
			// 	},
			// }));
			let smtpTransport = nodemailer.createTransport({
				service : "Gmail",
					auth : {
						user : process.env.PERSONAL_EMAIL,
						pass  : process.env.EMAIL_PASS
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

				email.send({
					template: 'confirm-password',
				    message: {
							to:  user.username
				    }
				} , function(err){
					done(err , "done");
				});
						 
				done(null , "done");
		  }] , function(err){
				if(err){
			       req.flash("error" , "Something went wrong while reseting your password. please try again later.");
					res.redirect("/instapic");
				}else{
					req.flash("success" , "Password reset is successful. Please login with new credentials")
					res.redirect("/login");
				}
	});	
});


module.exports = router;