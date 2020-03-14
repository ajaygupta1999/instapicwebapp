function imagecal() {
	  var dataurl =  "https://res.cloudinary.com/instapic-heroku-app/image/upload/";
	  var image = document.querySelector("[datas-src]");
      imageset(image);
	  
	  var imgurlinput = document.querySelector("#imgurlsetup");
      var orientation = document.querySelector("#imgbox");
	  var img = document.querySelector("#check-img");
	  var firstShowImg = document.querySelector("#first-Show-Img");
	  var  showFirstImg = document.querySelector("#check-img").getAttribute("alt");
	  if(showFirstImg == 90 || showFirstImg == 270){
		     orientation.setAttribute("class" , "potrate");
		     var imgurl = firstShowImg.src;
		     var c_w = $("#imgbox").width()*5;
             var c_h = $("#imgbox").height()*5;
		     var lastdata = imgurl.substr(60 , imgurl.length);
		     var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
		     var showimageurl = dataurl + parameters + "/" + lastdata;
		     imgurlinput.setAttribute("value" , showimageurl);
	  }else if(firstShowImg.naturalWidth > firstShowImg.naturalHeight){
		  orientation.setAttribute("class" , "landscape");
		  singleimageset(img);
	  }else if (firstShowImg.naturalWidth < firstShowImg.naturalHeight){
		  orientation.setAttribute("class" , "potrate");
		  singleimageset(img);
	  }else{
		  orientation.setAttribute("class" , "square");
		  singleimageset(img);
	  }

    function singleimageset(image){
             var firstShowImg = document.querySelector("#first-Show-Img");
		     var imgurl = firstShowImg.src;
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = $("#imgbox").width()*5;
             var c_h = $("#imgbox").height()*5;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var showimageurl = dataurl + parameters + "/" + lastdata;
             imgurlinput.setAttribute("value" , showimageurl);
		     
	     }
	
	// This is whatsapp profile image
	
	function imageset(image){
             var imgurl = image.getAttribute("datas-src");
             var lastdata = imgurl.substr(60 , imgurl.length);
             var c_w = 130;
             var c_h = 130;
             var parameters = "c_fill,w_" + c_w + ",h_" +  c_h +",g_auto,f_auto";
             var url = dataurl + parameters + "/" + lastdata;
             image.setAttribute("src" , url); 
           };
	   
	
}
imagecal();