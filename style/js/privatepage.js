var dataurl =  "https://res.cloudinary.com/instapic-heroku-app/image/upload/";

$("#pills-home-tab").click(function(){
	$("#pills-home-tab").css("color" , "#045fc0");
	$(".nav-items-1").css("border-bottom" , "2px solid #045fc0");
	$(".nav-items-2").css("border-bottom" , "none");
	$(".nav-items-3").css("border-bottom" , "none");
	$("#pills-profile-tab").css("color" , "#000000");
	$("#pills-contact-tab").css("color" , "#000000");
})


$("#pills-profile-tab").click(function(){
	$(".nav-items-1").css("border-bottom" , "none");
	$("#pills-profile-tab").css("color" , "#045fc0");
	$(".nav-items-2").css("border-bottom" , "2px solid #045fc0");
	$(".nav-items-3").css("border-bottom" , "none");
	$("#pills-home-tab").css("color" , "#000000");
	$("#pills-contact-tab").css("color" , "#000000");
	
	
	// for profile image
	 var list = document.querySelectorAll("[private-img-src]");
     var avatar = document.querySelectorAll("[private-profile-src]");
	 avatar.forEach(function(avatar){
	   var profUrl = avatar.getAttribute("private-profile-src");
	   var lastdata = profUrl.substr(60 , profUrl.length);
	   var c_w = 35;
       var c_h = 35;
	   var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
	   avatar.removeAttribute("private-profile-src");
	   var url = dataurl + parameters + "/" + lastdata;
	   axios.get(url).then(function(res){
	         avatar.setAttribute("src" , res.config.url);
	   }).catch(function(err){
	         console.log("something went wrong");
	   });  
	 });
       
	 
     // for all grid images
      list.forEach(function(img){
	   var ImageUrl = img.getAttribute("private-img-src");
	   var lastdata = ImageUrl.substr(60 , ImageUrl.length);
	   var c_w = 298;
       var c_h = 350;
	   var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
	   img.removeAttribute("private-img-src");
	   var url = dataurl + parameters + "/" + lastdata;
	   axios.get(url).then(function(res){
	         img.setAttribute("src" , res.config.url);
	   }).catch(function(err){
	         console.log("something went wrong");
	   });  
	   });
 });



$("#pills-contact-tab").click(function(){
	 $(".nav-items-1").css("border-bottom" , "none");
	 $("#pills-contact-tab").css("color" , "#045fc0");
	 $(".nav-items-3").css("border-bottom" , "2px solid #045fc0");
	 $(".nav-items-2").css("border-bottom" , "none");
	 $("#pills-home-tab").css("color" , "#000000");
	 $("#pills-profile-tab").css("color" , "#000000");
	
	  var likedimages  = document.querySelectorAll("[liked-img-src]");
      var likedavatar = document.querySelectorAll("[liked-profile-src]"); 
	  likedavatar.forEach(function(avatar){
	   var profUrl = avatar.getAttribute("liked-profile-src");
	   var lastdata = profUrl.substr(60 , profUrl.length);
	   var c_w = 35;
       var c_h = 35;
	   var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
	   avatar.removeAttribute("liked-profile-src");
	   var url = dataurl + parameters + "/" + lastdata;
	   axios.get(url).then(function(res){
	         avatar.setAttribute("src" , res.config.url);
	   }).catch(function(err){
	         console.log("something went wrong");
	   });  
	 });
       
     // for all grid liked images 
      likedimages.forEach(function(img){
	   var ImageUrl = img.getAttribute("liked-img-src");
	   var lastdata = ImageUrl.substr(60 , ImageUrl.length);
	   var c_w = 298;
       var c_h = 350;
	   var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
	   img.removeAttribute("liked-img-src");
	   var url = dataurl + parameters + "/" + lastdata;
	   axios.get(url).then(function(res){
	         img.setAttribute("src" , res.config.url);
	   }).catch(function(err){
	         console.log("something went wrong");
	   });  
	   }); 
 });	





