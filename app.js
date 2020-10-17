// hidden file
require('dotenv').config();
var express                 = require("express"),
    app                     = express(),
	helmet                  = require("helmet"),
	flash                   = require("connect-flash"),
	methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
	AuthRoutes              = require("./routes/Auth-routes"),
	mainroutes              = require("./routes/main"),
	AdminRoleRoutes         = require("./routes/admin"),
	apiRoutes               = require("./routes/api"),
	passport                = require("passport"),
	User                    = require("./models/user.js"),
	LocalStrategy           = require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
	Comments                = require("./models/comments.js"),
	compression             = require("compression"),
	async                   = require("async");
	

app.use(compression());
app.use(express.static("style"));
app.use(methodOverride("_method"));
app.use(flash());
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
// =====================================

// Helmet security =====================
app.use(helmet());

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js",
	"https://unpkg.com/axios/dist/axios.min.js",
	"https://code.jquery.com",
	"https://code.jquery.com",
	"https://cdnjs.cloudflare.com/ajax/libs/popper.js",
	"https://cdnjs.cloudflare.com/ajax/libs/moment.js",
    "https://api.tiles.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [
];

const fontSrcUrls = [
	"https://fonts.gstatic.com/s/muli/",
	"https://fonts.gstatic.com/s/raleway/",
	"https://fonts.gstatic.com/s/poppins/",
	"https://kit-free.fontawesome.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/instapic-heroku-app/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// ===============
// This will allow these variables to accessble to all pages
app.use(async function(req, res, next){
   res.locals.CurrentUser = req.user;
   res.locals.AdminRole = process.env.ADMIN_ROLE;
   if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate({
		  path : "notifications",
		  populate : { path : "from" }
	  }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log();
    }
   }
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// =============
// ROUTES
// =============

// Auth Related routes
app.use(AuthRoutes);

// Other Routes
app.use(mainroutes);

// Api routes
app.use(apiRoutes);

// Admin Routes
app.use(AdminRoleRoutes);

// Sitemap page
app.get("/sitemap.xml" , function(req , res){
	res.sendFile(__dirname +'/views/sitemap.xml');
});

// SSL Certificate
app.get("/.well-known/pki-validation/45797EF0012901992BDFA80F983861EC.txt" , function(req , res){
	res.sendFile(__dirname +'/views/45797EF0012901992BDFA80F983861EC.txt');
});

// Other than defined routers
app.get('*', function (req, res) { 
    res.redirect("/instapic"); 
});

// Port setup
app.listen(process.env.PORT || 9000 , function(){
	console.log("server started of instapic app......");
});