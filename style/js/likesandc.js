var LOCAL_URL_LENGTH = 52;
var PROD_URL_LENGTH = 60;

var LOCAL_CLOUD_URL = "https://res.cloudinary.com/instapicapp/image/upload/";
var PROD_CLOUD_URL = "https://res.cloudinary.com/instapic-heroku-app/image/upload/";

var dataurl =  PROD_CLOUD_URL;
var profileimages = document.querySelectorAll("[likesprof-src]");

imageset(profileimages);

function imageset(profileimages){
		 profileimages.forEach(function(image){
             var imgurl = image.getAttribute("likesprof-src");
             var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
             var c_w = 50;
             var c_h = 50;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
             image.setAttribute("src" , url); 
           });
	}