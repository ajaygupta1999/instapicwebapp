async function imgcal(){
	  var dataurl =  "https://res.cloudinary.com/instapic-heroku-app/image/upload/";
      var images = document.querySelectorAll("[data-src]");
      imageset(images);
	  
	  try{
		  var firstShowImg = document.querySelector("#firstShowImg");
		  let image_width = await firstShowImg.naturalWidth;
	      let image_height = await firstShowImg.naturalHeight;
		  
	  var orientation = document.querySelector("#img-box");
	  var img = document.querySelector("#checkimg");
	  var  showFirstImg = document.querySelector("#checkimg").getAttribute("alt");
	  if(showFirstImg == 90 || showFirstImg == 270){
		     orientation.setAttribute("class" , "potrate");
		     var imgurl = firstShowImg.src;
		     var lastdata = imgurl.substr( 60, imgurl.length);
		     var c_w = img.clientWidth;
		     var c_h = img.clientHeight;
		     var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
		     var url = dataurl + parameters + "/" + lastdata;
		     img.setAttribute("src" , url);
		     img.style.setProperty("transform" , "rotate(0deg)");
	  }else if(image_width > image_height){
		  orientation.setAttribute("class" , "landscape");
		  singleimageset(img);
	  }else if (image_width < image_height){
		  orientation.setAttribute("class" , "potrate");
		  singleimageset(img);
	  }else{
		  orientation.setAttribute("class" , "square");
		  singleimageset(img);
	  }
	  } catch(err){
		  console.log(err);
	  }
	
	  function imageset(images){
		 images.forEach(function(image){
             var imgurl = image.getAttribute("data-src");
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = image.clientWidth;
             var c_h = image.clientHeight;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
			 image.removeAttribute("data-src");
             image.setAttribute("src" , url); 
           });
	   }
	
	function singleimageset(image){
             var firstShowImg = document.querySelector("#firstShowImg");
		     var imgurl = firstShowImg.src;
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = image.clientWidth;
             var c_h = image.clientHeight;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
		     image.style.setProperty("transform" , "rotate(0deg)");
             image.setAttribute("src" , url);
	}
	
  }


imgcal(); 
