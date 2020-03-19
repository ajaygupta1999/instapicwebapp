var button = document.querySelectorAll("#getstarted-button");
var emaillockbutton = document.querySelector("#email-lock");
var falock = document.querySelector("#fa-lock");
var isdisabled = document.getElementById("Email").disabled;
console.log(isdisabled);
emaillockbutton.addEventListener("click"  , function(){
	if(isdisabled === true){
		document.getElementById("Email").disabled = false;
		isdisabled = false;
		falock.setAttribute("class" , "fas fa-lock-open");
	}else{
		document.getElementById("Email").disabled = true;
		isdisabled = true;
		falock.setAttribute("class" , "fas fa-lock");
	}
	
});

for(var i = 0 ; i < button.length ; i++){
	button[i].addEventListener("click" , function() {
		window.scroll({
          top: 607, 
          left: 0, 
        behavior: 'smooth'
         });
});
}

