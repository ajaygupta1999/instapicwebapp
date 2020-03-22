var inputlogin  = document.querySelector("#login-login");
var eyelogin =  document.querySelector("#eye-button-2");

eyelogin.addEventListener("click" , function(){
	if(inputlogin.type === "password")
	{
	  inputlogin.setAttribute("type" , "text");
	  var eyebutton = document.querySelector("#fa-eye");
	  eyebutton.setAttribute("class" , "fas fa-eye-slash");
	}else {
	    inputlogin.setAttribute("type" , "password"); 
		var eyebutton = document.querySelector("#fa-eye");
	    eyebutton.setAttribute("class" , "fas fa-eye");
	 }
});

var eyelogin2 =  document.querySelector("#eye-button-1");
var inputlogin2  = document.querySelector("#register");
eyelogin2.addEventListener("click" , function(){
	if(inputlogin2.type === "password")
	{
	  inputlogin2.setAttribute("type" , "text");
	  var eyebutton2 = document.querySelector("#fa-eye-2");
	  eyebutton2.setAttribute("class" , "fas fa-eye-slash");
	}else {
	    inputlogin2.setAttribute("type" , "password"); 
		var eyebutton2 = document.querySelector("#fa-eye-2");
	    eyebutton2.setAttribute("class" , "fas fa-eye");
	 }
});
