require('locus');
var router                 = require("express").Router(),
	flash                   = require("connect-flash"),
	methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
	passport                = require("passport"),
	middlewareobj           = require("../middleware"),
	User                    = require("../models/user.js"),
	Photos                  = require("../models/photos.js"),
	Notification            = require("../models/notification.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	Comments                = require("../models/comments.js"),
	multer                  = require('multer'),
	moment                  = require('moment'),
	async                   = require("async"),
    sendgridtransport       = require("nodemailer-sendgrid-transport"),
	streamifier				= require('streamifier'),
	nodemailer              = require("nodemailer"),
	crypto                  = require("crypto"),
	twilio                  = require("twilio"),
	sharp					= require("sharp"),
	mailgun                 = require('nodemailer-mailgun-transport'),
	Email                   = require("email-templates"),
    sizeOf 					= require('image-size');
	


// storage file name from multer 
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});


// checks and only allow images 
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});

// cloudinary config
var cloudinary = require('cloudinary');
cloudinary.config({ 
	  cloud_name: "instapic-heroku-app", 
	  api_key: process.env.CLOUDINARY_API_KEY, 
	  api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const mailgunauth = {
	auth: {
       api_key: process.env.MAILGUN_API_KEY,
       domain: process.env.MAILGUN_API_DOMAIN
  }
}
// To convert into array of photos
// router.get("/maintain" , async function(req,res){
// 	try{
// 		let allphotos = await Photos.find({});
// 		console.log(allphotos[0].img);
		
// 		for(let photo of allphotos){
// 			let dataobj = {};
// 			dataobj.img = photo.img;
// 			dataobj.imgId = photo.imgId;
// 			dataobj.angle = 0;
// 			photo.imgdata = dataobj;
// 			await photo.save();
// 		}
// 		eval(locus);
// 	}catch(err){
// 		console.log(err.message);
// 		res.redirect("/");
// 	}
// });

// router.get("/alltheusers" , async function(req , res){
// 	try{
// 		let allUsers = await User.find({});
// 		for(let user of allUsers){
// 			user.isApproved = true;
// 			await user.save();
// 		}
// 		eval(locus);
// 	}catch(err){
// 		console.log(err);
// 	}
// })


// To empty all notifications 
// router.get("/emptynotification" , async function(req , res){
// 	try{
// 		let allusers = await User.find({});
// 		for(let user of allusers){
// 			let length = user.notifications.length;
// 			user.notifications.splice(0 , length); 
// 			user.save();
// 	    }
// 		res.redirect("/");
// 	}catch(err){
// 		req.flash("error",  err.message);
// 		res.redirect("/");
// 	}
// });

// router.get("/updatefollwings" , async function(req,res){
// 	try{
// 	   let allusers = await User.find({});
	
// 	   for(let i = 0 ; i < allusers.length ;i++){
// 		   for(let j = 0 ; j < allusers[i].followers.length ; j++){
// 			   let user = await User.findById(allusers[i].followers[j]);
// 			   if(user){
// 				 user.followings.push(allusers[i]._id);
// 			     await user.save();
// 			   }
// 		   }
// 	   }
// 		req.flash("success" , "done successfully");
// 		res.redirect("/");
// 	}catch(err){
// 		req.flash("error" , err.message);
// 		res.redirect("/");
// 	}
// });


// router.get("/allimages" , async function(req , res){
// 	try{
// 		let photos = await Photos.find({});
// 		eval(locus);
// 	}catch(err){
// 		console.log(err);
// 	}
// });

// home page
router.get("/" ,  async function(req ,res){
	try{
		// Find all photos whose status is public
		let followersposts = [];
		let allPhotosdata = [];
		if(req.user){
			for(let following of req.user.followings){
				let photos = await Photos.find({"author.id" : following}).populate({
					path : "author.id comments",
					populate : { path : "author.id" }
				});
				let filteredphotos = photos.filter(photo => photo.status === "public");
				for(let pic of filteredphotos){
					if(pic.author.id.isApproved){
						await followersposts.push(pic);
					}
				}
			}
		}
		let allphotos = await Photos.find({status : "public"}).sort({_id: -1}).populate({
			path : "author.id comments",
		    populate : { path : "author.id" }
		}).exec();
		
        for(let photo of allphotos){
			if(photo.author.id.isApproved){
				await allPhotosdata.push(photo);
			}
		}
		res.render("Navigation-pages/index.ejs" , { photos : allPhotosdata , followingsposts : followersposts});
	} catch(err){
		req.flash("error" , "Something went wrong.");
		res.redirect("/");
	}
});


// Home page
router.get("/instapic" , async function(req ,res){	 
	try{
		let followersposts = [];
		let allPhotosdata = [];
		if(req.user){
			for(let following of req.user.followings){
				let photos = await Photos.find({"author.id" : following}).populate({
					path : "author.id comments",
					populate : { path : "author.id" }
				});
				let filteredphotos = photos.filter(photo => photo.status === "public");
				for(let photo of filteredphotos){
					if(photo.author.id.isApproved){
						await followersposts.push(photo);
					}
				}
			}
		}
		// Find all photos whose status is public
		let allphotos = await Photos.find({status : "public"}).sort({_id: -1}).populate({
			path : "author.id comments",
		    populate : { path : "author.id" }
		}).exec();
		
		for(let photo of allphotos){
			if(photo.author.id.isApproved){
				await allPhotosdata.push(photo);
			}
		}
		
		res.render("Navigation-pages/index.ejs" , { photos : allPhotosdata , followingsposts : followersposts });
	}catch(err){
		req.flash("error" , "Something went wrong.");
		res.redirect("/");
	}  
});


// New post page
router.get("/instapic/new" , middlewareobj.isloggedin , function(req,res){
    res.render("Navigation-pages/new.ejs");
});



// creating a new photo..
router.post("/instapic", middlewareobj.isloggedin , upload.array('image') , async function(req, res){
	try {
	    // get data from form and add to campgrounds array
		if(req.user.isApproved){
			let imgdata = [];
			if(req.files.length > 0){
				for(let file of req.files){
					let imgobj = {};
					if(file.size > 1000000){
						let buffdata;
						let dimensions = sizeOf(file.path);
						await sharp(file.path)
						.resize({
							width: Math.floor(dimensions.width*0.5),
							height: Math.floor(dimensions.height*0.5),
							fit: sharp.fit.cover,
							position: sharp.strategy.entropy
						})
						.withMetadata()
						.toFormat("jpeg")
						.jpeg({ quality: 95 })
						.toBuffer({ resolveWithObject: true })
						.then(({ data, info }) => { 
							buffdata = data; })
						.catch(err => {
							req.flash("error", "Something went wrong while compressing image");
							res.redirect("back");
							console.log(err); 
						});

						var result = await uploadFromBuffer(buffdata);
					}else{
						var result = await upload_get_url(file.path);
					}

					var angle = middlewareobj.getAngle(result.exif.Orientation);
					imgobj.img = result.secure_url;
					imgobj.imgId = result.public_id;
					imgobj.angle =  angle;
					imgdata.push(imgobj);
				}
			}

			var author = {
				id : req.user._id,
				username : req.user.username,
				fullname : req.user.fullname
			};


			var photo = {
				imgdata : imgdata,
				description : req.body.description,
				author : author,
				status : req.body.status
			};

			   let createdphoto = await Photos.create(photo);
			   if(createdphoto.status === "public"){
				   let user = await User.findById(req.user._id).populate("followers").exec();
				   let isAlbum = false;
				   if(createdphoto.imgdata.length > 1){
					   isAlbum = true;
				   }
				   let datetime = moment().add({hours: 5 , minutes : 30}).format("MMMM Do YYYY, h:mm a");
				   console.log(datetime);
				   let newNotification = {
					   type : "newpost",
					   photoId : createdphoto._id,
					   imgurl : createdphoto.imgdata[0].img,
					   isAlbum : isAlbum,
					   created : datetime,
					   description: createdphoto.description,
					   from : createdphoto.author.id
					}
				   for(const follower of user.followers){
					 let notification = await Notification.create(newNotification);
					 follower.notifications.push(notification);
					 follower.save();
				   }
				   //redirect back to image page
				   res.redirect("/instapic/" + createdphoto._id);
			  }else{
				  //redirect back to image page
				  res.redirect("/user/" +  createdphoto.author.id + "/private/" + createdphoto._id);
			  }
		}else{
			req.flash("error" , "This Account is blocked from the admim. You can not access this account");
			res.redirect("/instapic");
		}
    } catch(err) {
	  console.log(err);
      req.flash("error" , "Something went wrong. please try again later");
	  res.redirect("/instapic");
    } 
});



// SHOW PAGE ROUTE
router.get("/instapic/:id", async function(req,res){
	 // FIND PARTICULAR PHOTO FROM DATABASE
	  try{
		  // Find photo and populate likes and comments and author of comment
		  let foundphoto = await Photos.findById(req.params.id).populate({
			 path : "likes comments",
			  populate : {
				 path : "author.id"
			  }
		  }).exec();
	      let founduser = await User.findById(foundphoto.author.id);
		  if(founduser.isApproved){
			  let user = foundphoto.author.username;
			  let publicphotosofuser = []; 
			  let allphotosofuser = await Photos.find({"author.username" : user }).populate({
				  path : "author.id comments",
				  populate : { path : "author.id"}
			  }).exec();
			  let profimg = allphotosofuser[0].author.id.avatar;
			  for(const photo of allphotosofuser){
				  if(photo.status === "public" && (photo._id.toString() !== foundphoto._id.toString())){
					  publicphotosofuser.push(photo);
				  }
			  }
			 res.render("Navigation-pages/show.ejs" , {foundphoto : foundphoto , photos : publicphotosofuser , profimg :profimg});
		  }else{
			  req.flash("error" , "This Account is blocked from the admim. You can not access this account");
			  res.redirect("/instapic");
		  }
	 }catch(err){
		 req.flash("error" , "Something went wrong while rendering image");
		 res.redirect("/instapic");
	 }
});

 

// SHOWING PRIVATE IMAGE IN PRIVATE SESSION...
router.get("/user/:userid/private/:id" ,  middlewareobj.isloggedin ,  async function(req,res){
	try{
		// FIND PARTICULAR PHOTO FROM DATABASE
		if(req.user.isApproved){
			let foundphoto = await Photos.findById(req.params.id).populate({
				path : "likes comments",
				populate : {
					path : "author.id"
				}
			}).exec();
			let user = foundphoto.author.username;
			let allphotosofuser = await Photos.find({ "author.username" : user }).populate({
				path : "author.id comments",
				populate : { path : "author.id" }
			}).exec();
			let profimg = allphotosofuser[0].author.id.avatar;

			var privatephotosofuser = [];
			for(const photo of allphotosofuser){
				if(photo.status === "private" && (photo._id.toString() !== foundphoto._id.toString())){
					privatephotosofuser.push(photo);
				}
			}

			res.render("Navigation-pages/private-show.ejs" , {foundphoto : foundphoto , photos : privatephotosofuser , 
															 profimg : profimg});
		}else{
			req.flash("error" , "This Account is blocked from the admim. You can not access this account");
			res.redirect("back");
		}

	}catch(err){
		console.log(err);
		req.flash("error" , "Something went wrong while rendering private images");
		res.redirect("/user/" + req.params.userid);
	}
});



// Covert private image to public image
router.put("/user/:userid/private/:id/cpublic" , middlewareobj.isloggedin , async function(req,res){
	try{
		let foundphoto = await  Photos.findById(req.params.id);
		foundphoto.status = "public";
		foundphoto.save();
		req.flash("success" , "Image is added to public section.");
		res.redirect("/instapic/" + req.params.id);
		
	}catch(err){
		console.log(err);
		req.flash("error" , "Something went wrong while converting private to public image.");
		res.redirect("/user/" + req.params.userid);
	}
});


// Covert public image to private image
router.put("/user/:userid/private/:id/cprivate" , middlewareobj.isloggedin , async function(req,res){
	try{
		let foundphoto = await Photos.findById(req.params.id);
		foundphoto.status = "private";
		foundphoto.save();
		req.flash("success" , "Image is added to private section.");
		res.redirect("/user/" + req.params.userid + "/private/" + foundphoto._id);
		
	}catch(err){
		console.log(err);
		req.flash("error" , "Something went wrong while converting private to public image.");
		res.redirect("/user/" + req.params.userid);
	} 
});


// Delete post
router.delete("/instapic/:id" , middlewareobj.isloggedin ,  async function(req, res){
	// Is user logged in or not?
	try{
		let foundphoto = await Photos.findById(req.params.id);
		if(req.user._id.toString() === foundphoto.author.id.toString()){
			// Delete image from cloud
			cloudinary.v2.uploader.destroy(foundphoto.imgId);
			await Photos.findOneAndDelete({_id : req.params.id});
			
			// Delete notification from all followers
			let photocreator = await User.findById(foundphoto.author.id);
			
			for(let follower of photocreator.followers){
				var insideuser = await User.findById(follower).populate("notifications");
				for(let i = 0 ; i < insideuser.notifications.length ; i++){
					if(insideuser.notifications[i].photoId === foundphoto._id.toString()){
						if(insideuser.notifications[i].type === "newpost"){
							insideuser.notifications.splice(i , 1);
							insideuser.save();
							break;
						}
					}
				}
			}
			
			req.flash("success" , "Successfully deleted the post");
			res.redirect("/instapic");
		}else{
			req.flash("error" , "you don't have permission to delete other's image");
			res.redirect("/instapic/" + foundphoto._id);
		}
	}catch(err){
		req.flash("error" , "Something went wrong while deleting photo. please try again later");
		res.redirect("/instapic/" + req.params.id);
	}
	 
});	



// Getting new comment on photo
router.post("/instapic/:id/comments" , middlewareobj.isloggedin, async function(req ,res){
	// FIND THE PHOTO ON THAT WE ARE COMMENTING..
	try{
		if(req.user.isApproved){
			let [foundphoto , comment] = await Promise.all([Photos.findById(req.params.id) , Comments.create(req.body.comment)]);
			comment.author.id = req.user._id;
			comment.author.username = req.user.fullname;
			comment.save();
			// then save
			foundphoto.comments.push(comment._id);
			foundphoto.save();
			let user = await User.findById(foundphoto.author.id);
			if(user._id.toString() !== req.user._id.toString()){
				// Generate notification
				let isAlbum = false;
				if(foundphoto.imgdata.length > 1){
					isAlbum = true;
				}
				let datetime = moment().add({hours: 5 , minutes : 30}).format("MMMM Do YYYY, h:mm a");
				// Generate notification obj
				let notificationobj = {
					type:  "comment",
					photoId : foundphoto._id,
					created : datetime,
					commentid : comment._id,
					description: comment.text,
					imgurl : foundphoto.imgdata[0].img,
					isAlbum : isAlbum,
					from : req.user._id
				}
				// Create notification 
				let notification = await Notification.create(notificationobj);
				user.notifications.push(notification._id);
				user.save();
			}

			req.flash("success" , "Successfully added a new comment");
			res.redirect("back");
	}else{
		req.flash("error" , "This Account is blocked from the admim. You can not access this account");
	    res.redirect("back");
	}
	}catch(err){
		req.flash("error" , "Something went wrong while adding comment. Please try again later");
		res.redirect("/instapic/" + foundphoto._id);
	}
});



// Delete comment
router.delete("/instapic/:id/comments/:comment_id" , middlewareobj.isloggedin , async function(req,res){
	// FIRST CHECK USER IS LOGGED IN OR NOT
	try{
		let [foundphoto , comment] = await Promise.all([Photos.findById(req.params.id) , Comments.findById(req.params.comment_id)]);
		if(comment.author.id.toString() === req.user._id.toString() || req.user._id.toString() === foundphoto.author.id.toString()){
			// Find author of photo 
			// Transverse all notifications and find the notification associated with this comment
			// Using comment id then delete that notification
			let photocreater = await User.findById(foundphoto.author.id).populate("notifications");
			for(let i = 0 ; i < photocreater.notifications.length ; i++){
				if(photocreater.notifications[i].photoId === foundphoto._id.toString()){
					if(photocreater.notifications[i].type === "comment"){
						if(photocreater.notifications[i].commentid.toString() === comment._id.toString()){
							photocreater.notifications.splice(i , 1);
							photocreater.save();
						}
					}
				}
			}
			await Comments.findByIdAndRemove(req.params.comment_id);
			res.redirect("back");	
		}else{
			req.flash("error" , "You don't have permission to delete other's comment");
			res.redirect("back");
		}	
	}catch(err){
		req.flash("error" , "Something went wrong while deleting comment. Please try again later");
		res.redirect("/instapic/" + req.params.id);
	}
});



// LIKES ====================================
router.post("/instapic/:id/like" , middlewareobj.isloggedin , async function(req ,res){
	try{
		if(req.user.isApproved){
			let [foundphoto , foundphotoErr] = await handle(Photos.findById(req.params.id));
			if(foundphotoErr) throw new Error('Something went wrong with this post.')
			var foundUserLike = foundphoto.likes.some(function (like) {
				 return like.equals(req.user._id);
			});
			let user = await User.findById(foundphoto.author.id).populate("notifications").exec();
			// if user liked that photo
			if(foundUserLike){
				// useralready liked remove like
				foundphoto.likes.pull(req.user._id);
				// Remove notification
				for(let i = 0 ; i < user.notifications.length ; i++){
					if(user.notifications[i].photoId === foundphoto._id.toString()){
						if(user.notifications[i].type === "like"){
						   if(user.notifications[i].from.toString() === req.user._id.toString()){
							   user.notifications.splice(i,1);
							   user.save();
							   break;
						   }
						}
					}
				}
			} else {
				// user not liked that photo add like
				foundphoto.likes.push(req.user);
				// And Generate notifications
				if(user._id.toString() !== req.user._id.toString()){
					let isAlbum = false;
					if(foundphoto.imgdata.length > 1){
						isAlbum = true;
					}
					let datetime = moment().add({hours: 5 , minutes : 30}).format("MMMM Do YYYY, h:mm a");
					let notificationobj = {
						type:  "like",
						photoId : foundphoto._id,
						created : datetime,
						imgurl : foundphoto.imgdata[0].img,
						isAlbum : isAlbum,
						from : req.user._id
					}
					// Create notification 
					let notification = await Notification.create(notificationobj);
					user.notifications.push(notification._id);
					user.save();
				}

			}
			foundphoto.save();
			res.redirect("back");
		}else{
			req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		    res.redirect("back");
		}
		
	}catch(err){
		req.flash("error" , err.message);
		res.redirect("back");
	}
});

// Sign up route
router.get("/signup" , function(req ,res){
	res.render("Auth-related-pages/signup.ejs");
});


router.post("/signup" , async function(req , res){
	try{
		if(req.body.password === req.body.confirmpassword){
			var isadmin = true;
			var newUser = new User({ 
				username : req.body.username,
				isadmin : isadmin	
			 });
			// Create user  
			let [user , userErr] = await handle(User.register(newUser , req.body.password));
			if(userErr) throw new Error('User with this email address already exist');
              // Send email confirmation mail
				async.waterfall([
					function(done){
						crypto.randomBytes(20 , function(err , buf){
							if(err){
								req.flash("error" , "Something Went Wrong while registering user");
								return res.redirect("/instapic/forgot");
							}
							  var token = buf.toString('hex');
							  done(err , token);	
						});
					} ,
					function(token , done){
						User.findOne({username : req.body.username} , function(err , user){
							if(err){
								req.flash("error" , "Something Went Wrong while Reseting Password");
								res.redirect("/instapic/forgot");
							}else{
								if(!user){
								   req.flash("error" , "User with this Email Address does not exist");
								   return res.redirect("/instapic/forgot");
								}

								user.emailverificationToken = token;
								user.emailverificationTokenExpires = Date.now() + 5400000;
								user.save(function(err){
									done(err , token , user);
								});
							}
						})
					} , 
					function(token , user , done){
							let verificationlink = process.env.WEBSITE_URL +  '/instapic/signup/verify/' + token;
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
						    // let smtpTransport = nodemailer.createTransport(mailgun(mailgunauth));

							const email = new Email({
							  views : { root : "./views/Email-templates" , options : { extension : "ejs" }}, 
							  message: {
								from: process.env.PERSONAL_EMAIL
							  },
							  send: true,
							  transport: smtpTransport,
							});

							email.send({
								template: 'email-verification',
								message: {
								  to: req.body.username
								},locals: {
								  link: verificationlink
								}
							  } , function(err){
								done(err , "done");
							});
						 
						  done(null , "done");
					}
				], function(err){
					if(err){
						req.flash("error" , err.message);
						res.render("Auth-related-pages/signup.ejs");	
					}else{
						req.flash("success" , "An verification email has been send to " + req.body.username + " with the futher Instructions to create account.");
						res.redirect("/signup");
					}

			    });	
		}else{
			req.flash("error" , "Your confirm password and password do not match.");
			res.redirect("/signup");
		}
	}catch(err){
		req.flash("error" , err.message);
		res.redirect("/signup");
	}
});


// Register page request
router.get("/instapic/signup/verify/:token" , async function(req , res){
	try{
		let user = await User.findOne({ emailverificationToken : req.params.token, emailverificationTokenExpires: { $gt: Date.now() }});
		if(!user){
			 req.flash('error', 'Your email verification token has been expired. Please again create account.');
             return res.redirect('/signup');
		 }
		 user.isEmailVerified = true;
		 user.save();
		 res.render('Auth-related-pages/register.ejs', { token: req.params.token });
		
	}catch(err){
		req.flash("error" , err.message);
		res.redirect("/instapic");
	}
});

// For registering of user
router.post("/instapic/signup/verify/:token" , upload.single('image') , function(req ,res){
	try{
		async.waterfall([
			function(done){
			   User.findOne({ emailverificationToken : req.params.token , emailverificationTokenExpires: { $gt: Date.now() }} , async function(err, user){
				   if(err){
					   req.flash("error" , "Something went wrong while creating user.");
				   	   res.redirect("back");
				   }

				   if(!user){
					   req.flash('error', 'Password reset token is invalid or has expired.');
					   return res.redirect('back');
					  }
				   
				   try{
					 
					   if(req.file.size > 1000000){
						    console.log(">1mb");
							let buffdata;
							let dimensions = sizeOf(req.file.path);
							await sharp(req.file.path)
							.resize({
								width: Math.floor(dimensions.width*0.5),
								height: Math.floor(dimensions.height*0.5),
								fit: sharp.fit.cover,
								position: sharp.strategy.entropy
							})
							.withMetadata()
							.toFormat("jpeg")
							.jpeg({ quality: 95 })
							.toBuffer({ resolveWithObject: true })
							.then(({ data, info }) => { 
								buffdata = data; })
							.catch(err => {
								req.flash("error", "Something went wrong while compressing image");
								res.redirect("back");
								console.log(err); 
							});

							var result = await uploadFromBuffer(buffdata);
						}else{
							console.log("<1mb");
							var result = await upload_get_url(req.file.path);
						}

					   // let result = await upload_get_url(req.file.path);
					   user.angle = middlewareobj.getAngle(result.exif.Orientation);
				       user.fullname = req.body.fullname;
					   user.avatar = result.secure_url;
					   user.avatarId = result.public_id;
				       user.description = req.body.description;
					   user.isApproved = true;
					  await user.save();
				       req.login(user , function(err){
						   if(err) done(err , user);
					   });
					   done(null, user);
				    }catch(err){
						console.log(err.message);
						req.flash("error" , "Something went wrong while creating Account");
						res.redirect("back");
					}
				});	
			} , 
			function(user , done){
				
					let todaysDate = new Date().toDateString();
					let profilelink = process.env.WEBSITE_URL + "/user/" + req.user._id;
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
						template: 'New-User',
						message: {
						  to: process.env.PERSONAL_EMAIL
						},
						locals : {
							imgurl : req.user.avatar,
							fullname : req.user.fullname,
							date : todaysDate,
							description : req.user.description,
							profilelink : profilelink
						}
					  } , function(err){
						  if(err) done(err , "done");
					  });
					
					 done(null , "done");
			  }
			] , function(err){
				  if(err){
					  console.log(err.message);
					  req.flash("error" ,  "Something went wrong. Please again provide Account details");
					  return res.redirect("/instapic/signup/verify/" + req.params.token);
				  }
				  
			      req.user.emailverificationToken = undefined;
				  req.user.emailverificationTokenExpires = undefined;
				  req.user.save();
				  req.flash("success" , "Welcome " + req.user.fullname);
				  res.redirect("/instapic");
			   });	
	}catch(err){
		req.flash("error" , err.message);
		res.redirect("/instapic/signup/verify/"  + req.params.token);
	}
});



// User profile route
router.get("/user/:id", async function(req,res){
	try{
	   let user = await User.findById(req.params.id).populate("followers followings").exec();
	   if(user.isApproved || (req.user._id.toString() === user._id.toString())){
		   let [userphotos , allphotos ] = await Promise.all([
			   Photos.find().where("author.id").equals(req.params.id).populate({
				   path : "comments",
				   populate:  { path : "author.id" }
			   }).exec(),
			   Photos.find().populate({
				   path : "author.id comments",
				   populate : {path : "author.id"}
			   }).exec()
		   ]);

			let publicimages = [];
			let privateimages = []; 
			let likedimages = [];
			// All public images and private images	of user  
			for(let photo of userphotos){
			  if(photo.status === "public"){
				  await publicimages.push(photo);
			  }else{
				  await privateimages.push(photo);
			  }
			}

			// Liked images of user
			for(let photo of allphotos){
				if(photo.author.id.toString() !== user._id.toString()){
					for(let likeduser of photo.likes){
						if(likeduser.toString() === user._id.toString()){
							await likedimages.push(photo);
							break;
						}
					}
				}
			}
			// Render all data to profile page
			res.render("User-profile-pages/profile.ejs" , {user : user , publicfoundphotos : publicimages , priavteimages : privateimages , Alllikedimages : likedimages });
	   }else{
		   req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		   res.redirect("/instapic");
	   }		
	}catch(err){
		req.flash("error" , "Something went wrong while rendering profile page. Please try again later");
		res.redirect("/instapic");
    }
});



// Update profile data of user
router.put("/user/:id" , upload.single('image')  ,async function(req ,res){
	   // getting data for upadation of profile
	   try{
		    let founduser = await User.findById(req.params.id);
			if(founduser.isApproved){
					   let newuser = {}; 
					   if(req.file){
						   await cloudinary.v2.uploader.destroy(founduser.avatarId);
						   if(req.file.size > 1000000){
							 console.log(">1mb");
							 let buffdata;
							 let dimensions = sizeOf(req.file.path);
							 await sharp(req.file.path)
							 .resize({
								 width: Math.floor(dimensions.width*0.5),
								 height: Math.floor(dimensions.height*0.5),
								 fit: sharp.fit.cover,
								 position: sharp.strategy.entropy
							 })
							 .withMetadata()
							 .toFormat("jpeg")
							 .jpeg({ quality: 95 })
							 .toBuffer({ resolveWithObject: true })
							 .then(({ data, info }) => { 
								 buffdata = data; })
							 .catch(err => {
								 req.flash("error", "Something went wrong while compressing image");
								 res.redirect("back");
								 console.log(err); 
							 });

							 var result = await uploadFromBuffer(buffdata);
						}else{
							 console.log("<1mb");
							 var result = await upload_get_url(req.file.path);
						 }

						   let angle = middlewareobj.getAngle(result.exif.Orientation);
						   newuser.avatar = result.secure_url;
						   newuser.angle = angle;
						   newuser.avatarId = result.public_id;
						} 
						newuser.fullname = req.body.fullname;
						newuser.description = req.body.description;

						// find that user and then update data
						let updateduser = await User.findByIdAndUpdate(req.params.id , newuser);
						if(updateduser.fullname !== req.body.fullname){
							let foundusercomment = await Comments.find({"author.id" : req.params.id}); 
							foundusercomment.forEach(function(usercomment){
								console.log("updating comments");
								usercomment.author.username = req.body.fullname;
								usercomment.save();
							});
						}
						if(founduser.username !== req.body.email){
							if(founduser.isApproved){
								async.waterfall([
										function(done){
											crypto.randomBytes(20 , function(err , buf){
												if(err){
													req.flash("error" , "Something Went Wrong while registering user");
													return res.redirect("/user/" + updateduser._id);
												}
												  var token = buf.toString('hex');
												  done(err , token);	
											});
										} ,
										function(token , done){
											User.findById(updateduser._id , function(err , user){
												if(err){
													req.flash("error" , "Something Went Wrong while Reseting Password");
													res.redirect("/instapic");
												}else{
													if(!user){
													   req.flash("error" , "User with this Email Address does not exist");
													   return res.redirect("/instapic");
													}

													user.emailverificationToken = token;
													user.emailverificationTokenExpires = Date.now() + 5400000;
													user.save(function(err){
														done(err , token , user);
													});
												}
											})
										} , 
										function(token , user , done){
												let verificationlink = process.env.WEBSITE_URL +  '/instapic/changeEmail/verify/' + token + "/email/" + req.body.email;
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
													template: 'change-email',
													message: {
													  to: req.body.email
													},locals: {
													  link: verificationlink
													}
												  } , function(err){
													console.log(err);
													done(err , "done");
												});

											  done(null , "done");
										}
									], function(err){
										if(err){
											req.flash("error" , err.message);
											res.render("back");	
										}else{
											req.logout();
											req.flash("success" , "An verification email has been send to " + req.body.email + " with the futher Instructions to change your account email address.");
											res.redirect("/instapic");
										}

									});	
							}else{
								req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		   						res.redirect("/instapic");
							}
						}else{
							req.flash("success" , "Profile is Updated successfully");
				            res.redirect("/user/" + founduser._id);
						}       
			}else{
			  req.flash("error" , "This Account is blocked from the admim. You can not access this account");
			   res.redirect("/instapic"); 
			}
		}catch(err){
			req.flash("error" , "Something went wrong. User profile data is not able to updated");
			res.redirect("/user/" + req.params.id);
		}
});

// Change email request
router.get("/instapic/changeEmail/verify/:token/email/:email" , async function(req , res){
	try{
		let user = await User.findOne({ emailverificationToken : req.params.token , emailverificationTokenExpires: { $gt: Date.now() }});
		if(user.isApproved){
			if(!user){
				 req.flash('error', 'Your email verification token has been expired. Please again create account.');
				 return res.redirect('/instapic');
			 }
			 user.username = req.params.email;
			 user.save();
			 req.flash("success",  "Your Email has been changed successfully");
			 res.redirect("/login");
		}else{
			req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		    res.redirect("back");
		}
	}catch(err){
		req.flash("error" , err.message);
		res.redirect("/instapic");
	}
});


// Update user profile data
router.get("/user/:id/edit" , middlewareobj.isloggedin , async function(req , res){
		try{
			let founduser = await User.findById(req.params.id);
			if(founduser.isApproved){
				if(founduser._id.equals(req.user._id)){
					res.render("User-profile-pages/profile-edit.ejs" , {user : founduser});
				}else{
					req.flash("error" , "You Don't have permission to change others profile data");
					res.redirect("/user/" + req.params.id);
				}
			}else{
				req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		        res.redirect("/instapic");
			}
		}catch(err){
			req.flash("error" , "Not able to update profile page");
			res.redirect("/user/" + req.params.id);
		}
});


// Follow user
router.get("/follow/:id", middlewareobj.isloggedin , async function(req, res) {
  try {
	  if(req.user.isApproved){
		 let founduser = await User.findById(req.params.id);
		 var checkfollower = founduser.followers.some(function (follow) {
				return follow.equals(req.user._id);
		  });
		  if(checkfollower){
			// aleady have a same follower
			founduser.followers.pull(req.user._id);
			req.user.followings.pull(founduser._id);
		  }else {
			// Don't have a follower
			founduser.followers.push(req.user._id);
			req.user.followings.push(founduser._id);
		  }
		  await founduser.save();
		  req.user.save();
	      res.redirect("/user/" + req.params.id);
	  }else{
		  req.flash("error" , "This Account is blocked from the admim. You can not access this account");
		  res.redirect("/instapic");
	  }
  } catch(err) {
    req.flash('error', "Not able to follow user. Please try again later");
    res.redirect('back');
  }
});


// view all notifications
// router.get("/notifications", middlewareobj.isloggedin , async function(req, res) {
//   try {
//     let currentuser = await User.findById(req.user._id).populate({
//       path: 'notifications',
//       options: { sort: { "_id": -1 } }
//     }).exec();
//     let allNotifications = currentuser.notifications;
//     res.render("Navigation-pages/notifications.ejs", { allNotifications : allNotifications });
//   } catch(err) {
//     req.flash('error', "Something went wrong while getting notifications");
//     res.redirect('back');
//   }
// });



// handle notification
router.get("/notification/:id", middlewareobj.isloggedin , async function(req, res) {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    res.redirect("/instapic/" + notification.photoId);
  } catch(err) {
    req.flash("error", "Something went wrong.");
    res.redirect("back");
  }
});

// CREATOR ROUTE
router.get("/about" , function(req ,res){
	res.render("User-profile-pages/aboutus.ejs");
});


// UPLOAD IMAGE TO CLOUDINARY.COM SENDING OBJECT..
function upload_get_url(image){
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image , {exif : true} , (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
}


// Upload buffer image to cloudinary 
let uploadFromBuffer = (req) => {
   return new Promise((resolve, reject) => {
     let cld_upload_stream = cloudinary.v2.uploader.upload_stream({exif : true},
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
         }
       }
     );
     streamifier.createReadStream(req).pipe(cld_upload_stream);
   });
};


// Handle promise rejection
const handle = (promise) => {
  return promise
    .then(data => ([data, undefined]))
    .catch(error => Promise.resolve([undefined, error]));
}

module.exports = router;