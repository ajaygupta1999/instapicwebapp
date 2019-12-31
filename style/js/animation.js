var foam = document.querySelector(".UploadFoam");

foam.addEventListener("submit" , function(){
	var submitButton = document.querySelector(".submitButton");
	var submitspan = document.querySelector("#submitSpan");
	submitspan.textContent = "";
	var loadanimation = document.querySelector("#lodinganimtion");
	loadanimation.setAttribute("class" , "loading");
});