var uploadform = document.querySelector(".upload-loader-form");
console.log(uploadform);
var screenblockelm = document.querySelector(".screen-blocker"); 
if(uploadform){
	uploadform.addEventListener("submit" , function(e){
		screenblock();
		startuploadloader();
		var loadertriggerbutton = document.querySelector("#upload-new-img-modal");
		loadertriggerbutton.click();
		
	});
}

function startuploadloader(){
	 var uploadloader = document.querySelector(".preloader-upload-pages"); 
	 uploadloader.classList.remove("hide-loader-div");
}

function screenblock(){
	screenblockelm.classList.remove("hide-loader-div");
}

// Attachment name system
var inputfiled  = document.querySelector("#Image-uplode");
if(inputfiled){
	inputfiled.addEventListener("change" , function(e){
		var textfile = document.querySelector("#attachment-text");
	       if(e.target.files.length > 0){
			var filename = "";
			for(var i = 0 ; i < e.target.files.length ; i++){
				if(filename){
					filename = filename + " , " +  e.target.files[i].name;
				}else{
					filename = filename +  e.target.files[i].name;
				}
			}
		    textfile.innerHTML = filename;
	    }else{
			textfile.innerHTML = "No file Choosen, Yet";
		}
   });
}