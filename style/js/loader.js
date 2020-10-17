var loaders = document.querySelectorAll(".preloader-all-pages");
var screenblockelm = document.querySelector(".screen-blocker"); 
var allforms = document.querySelectorAll(".submit-forms");

for(var i = 0 ; i < allforms.length ; i++){
	allforms[i].addEventListener("submit" , function(e){
		screenblock();
		startloader();
	});
}

function screenblock(){
	screenblockelm.classList.remove("hide-loader-div");
}

function startloader(){
	 loaders.forEach(function(loader){
		 loader.classList.remove("hide-loader-div");
	 });
}

