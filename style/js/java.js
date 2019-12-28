function imgcal(){
	  var dataurl =  "https://res.cloudinary.com/instapic-heroku-app/image/upload/";
      var images = document.querySelectorAll(".AllSmallImages");
      imageset(images);
	
	  var orientation = document.querySelector("#img-box");
	  var img = document.querySelector("#checkimg");
	  orientation.setAttribute("class" , "none");
	  var  showFirstImg = document.querySelector("#checkimg").getAttribute("alt");
	  if(showFirstImg == 90 || showFirstImg == 270){
	   	     orientation.setAttribute("class" , "potrate");
             var imgurl = img.src;
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = img.clientWidth;
             var c_h = img.clientHeight;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
             img.setAttribute("src" , url);
		     img.style.setProperty("transform" , "rotate(0deg)");
	  }else if(img.naturalWidth > img.naturalHeight){
		  orientation.setAttribute("class" , "landscape");
		  imageset(img);
	  }else{
		  orientation.setAttribute("class" , "square");
		  imageset(img);
	  }
	
	  function imageset(images){
		 images.forEach(function(image){
             var imgurl = image.src;
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_h = image.clientWidth;
             var c_w = image.clientHeight;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
             image.setAttribute("src" , url); 
           });
	   }
	
  }


 
imgcal(); 
