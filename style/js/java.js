var LOCAL_URL_LENGTH = 52;
var PROD_URL_LENGTH = 60;
var LOCAL_CLOUD_URL = "https://res.cloudinary.com/instapicapp/image/upload/";
var PROD_CLOUD_URL = "https://res.cloudinary.com/instapic-heroku-app/image/upload/";

function imgcal(){
	  var dataurl = PROD_CLOUD_URL;
      var images = document.querySelectorAll("[data-src]");
      imageset(images);
	  
	  // For main image of show page === 
	  var showmainimgboxes = document.querySelectorAll(".show-img-type-box");
	  for(let box of showmainimgboxes){
		  
		  var imgtag = box.firstElementChild;
		  var imgurl = imgtag.dataset.imgsrc;
		  box.getElementsByTagName("img")[1].src = imgurl;
		  
		  box.getElementsByTagName("img")[1].addEventListener("load" , function(){
			  // Find img tag and get imgurl and orientation
			  var imgtag = box.firstElementChild;
			  var imgurl = imgtag.dataset.imgsrc;
			  var orientation = imgtag.getAttribute("data-imgorientation");
			  // Get img width and height
			  var imgwidth  = box.getElementsByTagName("img")[1].naturalWidth;
		      var imgheight = box.getElementsByTagName("img")[1].naturalHeight;
			  if(orientation == 90 || orientation == 270){
				  box.setAttribute("class" , "potrate");
				  var imgurl = imgtag.dataset.imgsrc;
				  var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
				  var parameters = "c_fill,w_" + 395 + ",h_" + 540 +",g_auto,f_auto";
				  var showimageurl = dataurl + parameters + "/" + lastdata;
				  imgtag.setAttribute("src" , showimageurl);
				  imgtag.style.setProperty("transform" , "rotate(0deg)");
			  }else if(imgwidth > imgheight){
				  box.setAttribute("class" , "landscape");
				  singleimageset(imgurl , imgtag , 810 , 540);
			  }else if (imgwidth < imgheight){
				  box.setAttribute("class" , "potrate");
				  singleimageset(imgurl , imgtag , 395 , 540);
			  }else{
				  box.setAttribute("class" , "square");
				   singleimageset(imgurl , imgtag , 510 , 510);
			  }
		  }); 
	  }
	

	  function imageset(images){
		 images.forEach(function(image){
             var imgurl = image.getAttribute("data-src");
             var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
			 console.log("I am at here");
             var c_w = image.clientWidth;
             var c_h = image.clientHeight;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
			 image.removeAttribute("data-src");
             image.setAttribute("src" , url); 
           });
	   }
	
	    function singleimageset(imgurl , imgtag , width , height){
			  var lastdata = imgurl.substr(PROD_URL_LENGTH , imgurl.length);
			  var parameters = "c_fill,w_" + width + ",h_" + height +",g_auto,f_auto";
			  var showimageurl = dataurl + parameters + "/" + lastdata;
			  imgtag.setAttribute("src" , showimageurl);
			  imgtag.style.setProperty("transform" , "rotate(0deg)");
	     }
  }


imgcal(); 
