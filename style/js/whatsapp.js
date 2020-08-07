var LOCAL_URL_LENGTH = 52;
var PROD_URL_LENGTH = 60;
var LOCAL_CLOUD_URL = "https://res.cloudinary.com/instapicapp/image/upload/";
var PROD_CLOUD_URL = "https://res.cloudinary.com/instapic-heroku-app/image/upload/";
 
function imagecal() {
	var image = document.querySelector("[datas-src]");
	if(image){
		imageset(image);
	
		// This is whatsapp profile image
		function imageset(image){
			var imgurl = image.getAttribute("datas-src");
			var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
			var c_w = 130;
			var c_h = 130;
			var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
			var url = PROD_CLOUD_URL + parameters + "/" + lastdata;
			image.setAttribute("src" , url); 
		};
	}
	
	var notificationimages = document.querySelectorAll("[data-notificationsrc]");
	for(let imgtag of notificationimages){
		var imgurl = imgtag.getAttribute("data-notificationsrc");
		var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
		var c_w = 52;
		var c_h = 52;
		var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
		var url = PROD_CLOUD_URL + parameters + "/" + lastdata;
		imgtag.setAttribute("src" , url); 
	}
    
}
imagecal();