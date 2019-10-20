var express                 = require("express"),
    app                     = express(),
	flash                   = require("connect-flash"),
	methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
	passport                = require("passport"),
	User                    = require("./models/user.js"),
	Notification            = require("./models/notificatio.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	Comments                = require("./models/comments.js");
	    
app.use(express.static("style"));
app.use(methodOverride("_method"));
app.use(flash());
var Photos = require("./models/photos.js");
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true  , useCreateIndex : true });
app.use(bodyParser.urlencoded({ extended : true}));

// AUTH CONFIG ==================================
app.use(require("express-session")({
	secret: "I am Ajay Gupta",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(function(req ,res ,next){
// 	res.locals.CurrentUser = req.user;
// 	res.locals.error     = req.flash("error"); 
// 	res.locals.success     = req.flash("success"); 
// 	next();
// });

app.use(async function(req, res, next){
   res.locals.CurrentUser = req.user;
   if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate("notifications", null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


// ================================================

// =============
// ROUTES
// =============

// HOME PAGE
app.get("/" ,  function(req ,res){
	// FIND ALL THE PHOTO 
	Photos.find({}).sort({_id: -1}).populate({path : "author.id"}).exec(function(err , allphoto){
		if(err){
			console.log(err);
		} else {
			res.render("index.ejs" , { photos : allphoto });
		}
	}); 
});

// HOME PAGE
app.get("/instapic" , function(req ,res){
	 if(req.query.search){
		 // variable for holding search
		 var regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// finding all photo and populating users
				  // find all photo having description === search
				 Photos.find({"author.fullname" : regex}).populate({path : "author.id"}).exec(function(err , foundphotos){
					 if(err){
						 console.log(err);
					 } else {
						 res.render("index.ejs" , { photos : foundphotos});
					 }
				 });
	 } else {
		 // FIND ALL THE PHOTO    
		  Photos.find({}).sort({_id: -1}).populate({path : "author.id"}).exec(function(err , allphoto){
			if(err){
			console.log(err);
		     }else {
			   res.render("index.ejs" , { photos : allphoto});
				}
		});	
	 }
	
});

//===================

// CREATING NEW POST
app.get("/instapic/new" , isloggedin , function(req,res){
    res.render("new.ejs");	
});


app.post("/instapic", isloggedin , async function(req, res){
    // get data from form and add to campgrounds array
    var img = req.body.img;
	var description = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username,
		fullname : req.user.fullname
	};
	var photos = {
		img : img,
		description : description,
		author : author
	};
    try {
      let createdphoto = await Photos.create(photos);
      let user = await User.findById(req.user._id).populate("followers").exec();
      let newNotification = {
        username: req.user.username,
        photoId: createdphoto.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }
      //redirect back to campgrounds page
      res.redirect("/instapic");
    } catch(err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
});

// AUTH RELATED ROUTES =================

app.get("/register" , function(req,res){
	 res.render("register.ejs");
});

app.post("/register" , function(req,res){
	if(req.body.isadmin === "ajay@9136276661")
	{
	 var isadmin = true;
	    var newUser = new User({ 
		username : req.body.username,
		fullname : req.body.fullname,
		avatar : req.body.avatar,
		description : req.body.description,
		isadmin : isadmin
	   });
	} else {
	 isadmin = false;
	}
	if(isadmin === true) 
		{
	    User.register(newUser , req.body.password , function(err , user){
		 if(err){
			 req.flash("error" , err.message);
			 return res.redirect("back");
		 } else {
			passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Welcome to Instapic App " + req.user.fullname );
			res.redirect("/instapic");
			});	 
			 }
	 });
		} else {
			req.flash("error" , "You must required security key for registeration as a new user.");
			res.redirect("/register");
		}
	
});

app.get("/login" , function(req,res){
	 res.render("login.ejs");
});

app.post("/login" , passport.authenticate("local" , {
    successRedirect : "/instapic",
	failureRedirect : "/login"
}),  function(req,res){
});

app.get("/logout" , function(req,res){
	req.logout();
	req.flash("success" , "You Successfully Logged out");
	res.redirect("/instapic");
});

// SHOW ROUTE
app.get("/instapic/:id", function(req,res){
	 // FIND PARTICULAR PHOTO FROM DATABASE
	 Photos.findById(req.params.id).populate("comments likes").exec(function(err , foundphoto){
	    if(err){
	      console.log(err);
	    } else {
			// FIND ALL THE PHOTOS RELATED TO LOGGEDIN USER
			// POPULATE ALL THE DATA OF USER
		 var user = foundphoto.author.username;
	     Photos.find({ "author.username" : user }).populate({
			 path : "author.id",
		 }).exec(function(err , photos){
			  if(err){
				console.log(err);
			} else {
				res.render("show.ejs" , {foundphoto : foundphoto , photos : photos});
			} 
		 });
	 }
	 });
});

// DELETE PHOTO ROUTE
app.delete("/instapic/:id" , function(req, res){
	// Is user logged in or not?
	if(req.isAuthenticated()){
		Photos.findById(req.params.id , function(err , foundphoto){
			if(foundphoto.author.id.equals(req.user._id)){
				Photos.findOneAndDelete({_id : req.params.id} , function(err){
					if(err){
						console.log(err);
					} else {
					 req.flash("success" , "Successfully deleted the post");
					 res.redirect("/instapic");
					}
				});
			} else {
				res.send("you don't have permission to do that");
			}
		});
	} else {
	    res.send("first looged in");
	}   
});	
	

// GETTING COMMENTS DATA FROM COMMENT FORM
app.post("/instapic/:id/comments" , isloggedin, function(req ,res){
	//FIND THE PHOTO ON THAT WE ARE COMMENTING..
	Photos.findById(req.params.id , function(err , foundphoto){
		if(err)
			{
				console.log(err);
			} else {
				Comments.create(req.body.comment  , function(err , comment){
					if(err){
						console.log(err);
					} else {
						// ADD USERNAME AND USERID TO COMMENTS
						comment.author.id = req.user._id;
						comment.author.username = req.user.fullname;
						comment.save();
						// then save
						foundphoto.comments.push(comment);
						foundphoto.save();
						req.flash("success" , "Successfully added a new comment");
						res.redirect("/instapic/" + foundphoto._id);
					}
				});
			}
	});
});

// DELETE COMMENTS
app.delete("/instapic/:id/comments/:comment_id" , function(req,res){
	// FIRST CHECK USER IS LOGGED IN OR NOT
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id , function(err , comment){
			if(err){
				console.log(err);
			} else {
				if(comment.author.id.equals(req.user._id)){
		          Comments.findByIdAndRemove(req.params.comment_id , function(err){
		           if(err){
			             console.log(err);
			             req.flash("error" , "Something Went Wrong");
			             res.redirect("back");
		              } else {
			              //REDIRECT TO PREVIOUS PAGE
				          req.flash("success" , "Successfully Deleted Comment");
		   	              res.redirect("back");
		                }
			         });
				}
			   else {
			    req.flash("error" , "You don't have permission to do that");
				res.redirect("back");
		         }	
		}
		});	
	} else {
		req.flash("err" , "Plz login first to Delete comment");
		res.redirect("/login");
	}
});


// LIKES ==============
app.post("/instapic/:id/like" ,isloggedin, function(req ,res){
	// find Photo
	Photos.findById(req.params.id , function(err, foundphoto){
		if(err){
			console.log(err);	
		} else {
		
			// check if req.user._id exists in foundphoto.likes	
			var foundUserLike = foundphoto.likes.some(function (like) {
            return like.equals(req.user._id);
           });
        
			 // if user liked that photo
			if(foundUserLike){
				// useralready liked remove like
				foundphoto.likes.pull(req.user._id);
			} else {
				// user not liked that photo add like
				foundphoto.likes.push(req.user);
			}
			foundphoto.save(function(err){
				if(err){
					console.log(err);
				} else {
					res.redirect("/instapic/" + foundphoto._id);
				}
			});	
		}
	});
});

// USERS PROFILE
app.get("/user/:id", function(req,res){
	User.findById(req.params.id).populate("followers").exec(function(err , founduser){
		if(err){
			console.log(err);
		} else {
			Photos.find().where("author.id").equals(founduser._id).exec(function(err , photo){
				if(err){
					console.log(err);	
				}else {
					res.render("profile.ejs" , {user : founduser , photo : photo});
				}
			});	
		}
	});
});

// follow user
app.get("/follow/:id", isloggedin , async function(req, res) {
  try {
     let founduser = await User.findById(req.params.id);
	 var checkfollower = founduser.followers.some(function (follow) {
            return follow.equals(req.user._id);
           });
	  if(checkfollower)
		  {
			  // aleady have a same follower
			 founduser.followers.pull(req.user._id);
		  }else {
			  // Don't have a follower
			 founduser.followers.push(req.user._id);
		  }
    founduser.save();
    res.redirect("/user/" + req.params.id);
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});


// view all notifications
app.get("/notifications", isloggedin , async function(req, res) {
  try {
    let currentuser = await User.findById(req.user._id).populate({
      path: 'notifications',
      options: { sort: { "_id": -1 } }
    }).exec();
    let allNotifications = currentuser.notifications;
    res.render("notifications.ejs", { allNotifications : allNotifications });
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

// handle notification
app.get("/notifications/:id", isloggedin , async function(req, res) {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    res.redirect("/instapic/" + notification.photoId);
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("back");
  }
});


// CREATOR ROUTE
app.get("/creator" , function(req ,res){
	res.render("creator.ejs");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}; 

 
function isloggedin(req ,res , next){
	if(req.isAuthenticated()){
	return	next();
	} 
	req.flash("error" , "You Need To Be Logged In To Do That");	
	res.redirect("/login");	
}


app.listen(process.env.PORT || 9000 , function(){
	console.log("server started of instapic app......");
});