var router                 = require("express").Router(),
	flash                   = require("connect-flash"),
    mongoose                = require("mongoose"),
	passport                = require("passport"),
	middlewareobj           = require("../middleware"),
	User                    = require("../models/user.js"),
	Photos                  = require("../models/photos.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	async                   = require("async"),
	twilio                  = require("twilio");



// Twilio Setup 
var client = twilio( 
	process.env.TWILIO_SID,
	process.env.TWILIO_TOKEN
);

// GETTING USER'S DATA USING API.
router.get("/instapic/api/users" , async function(req ,res){
	try{
		let users = await User.find({"isApproved" : true ,"isEmailVerified":true , "fullname" : {$ne:null}}); 
	    res.json(users);
	}catch(err){
		console.log("something is went wrong with api");
	}
});

// sending image on whatsapp
router.get("/instapic/:id/sendimage", middlewareobj.isloggedin ,function(req,res){
	Photos.findById(req.params.id , function(err , foundphoto){
	if(foundphoto.author.id.equals(req.user._id)){
		if(err){
			console.log(err);
		}else{
			var userid = foundphoto.author.id;
			User.findById(userid , function(err , user){
				res.render("Navigation-pages/whatsapp.ejs" , {foundphoto : foundphoto , user : user});
			});
		}
	  }else{
		  req.flash("error" , "You don't have permission to share this image");
		  res.redirect("/instapic/" + foundphoto._id);
	  }
		
	});
});


// share image on whatsapp
router.post("/instapic/:id/sendimage" , middlewareobj.isloggedin, function(req,res){
 	 Photos.findById(req.params.id , function(err , foundphoto){
	  if(foundphoto.author.id.equals(req.user._id)){
		 var fullname = foundphoto.author.fullname;
		 var sendnum = req.body.sendnum;
		 for(let imgobj of foundphoto.imgdata){
			 var imgurl = imgobj.img;
			  client.messages
			  .create({
				 from : 'whatsapp:+14155238886',
				 to : 'whatsapp:+91' + sendnum,
				 body : "Image from " + fullname,
				 mediaUrl :  imgurl
			 }).then(message => {
				  console.log("message send");
			 }).catch(err => {
				 req.flash("error" , "Something Went wrong");
				 res.redirect("/instapic");
			 });
		 }
		 req.flash("success" , "Image send successfully");
		 res.redirect("/instapic");
	  }else{
		  req.flash("error" , "You don't have permission to share this image");
		  res.redirect("/instapic/" + foundphoto._id);
	  }	 
	 });
});


module.exports = router;