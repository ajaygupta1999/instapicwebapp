var middlewareobj = {}; 


//  CHECK WHETHER THE PERSON IS LOGGED-IN OR NOT.
middlewareobj.isloggedin = function(req ,res , next){
	 if(req.isAuthenticated()){
	  	return next();
	 } 
	
	 req.flash("error" , "You Need To Be Logged In To Do That");	
	 res.redirect("/login");	
}


// GETTING ANGLE OF IMAGE(ORIENTATION OF IMAGE)
middlewareobj.getAngle = function(number){
	switch(number){
		case "1" :
			return(0);
			
		case "8" :
			return(270);
			
		case "3" :
			return(180);
			
		case "6" :
			return(90);
	}	
}


module.exports = middlewareobj;