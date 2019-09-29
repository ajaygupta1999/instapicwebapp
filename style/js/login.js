var inputlogin  = document.querySelector("#login-login");
var eyelogin =  document.querySelector("#eye-button-2");

eyelogin.addEventListener("click" , function(){
	if(inputlogin.type === "password")
	{
	  inputlogin.setAttribute("type" , "text");
	}else
	{
	 inputlogin.setAttribute("type" , "password"); 
	}
});