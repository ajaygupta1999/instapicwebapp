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