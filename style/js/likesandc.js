var dataurl =  "https://res.cloudinary.com/instapic-heroku-app/image/upload/";
var profileimages = document.querySelectorAll("[likesprof-src]");
console.log(profileimages);
imageset(profileimages);


function imageset(profileimages){
		 profileimages.forEach(function(image){
             var imgurl = image.getAttribute("likesprof-src");
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = 40;
             var c_h = 40;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
             image.setAttribute("src" , url); 
           });
	}