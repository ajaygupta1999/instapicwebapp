function imgcal(){
	  var orientation = document.querySelector(".img-container");
	  var img = document.querySelector("#checkimg");
	  orientation.removeAttribute("class");
	  orientation.setAttribute("class" , "none");
	 if(img.naturalWidth > img.naturalHeight)
		 {
		   orientation.removeAttribute("class");
		   orientation.setAttribute("class" , "landscape");
		 } else if(img.naturalWidth < img.naturalHeight)
	   {
	   	   orientation.removeAttribute("class");
		   orientation.setAttribute("class" , "potrate");
		   
	   } else {
		  orientation.removeAttribute("class");
		  orientation.setAttribute("class" , "square");
	   }   
  }


 
imgcal(); 
