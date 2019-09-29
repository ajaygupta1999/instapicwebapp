var eyebutton =  document.querySelector("#eye-button");
var eyebutton1 =  document.querySelector("#eye-button-1");
var inputpassword = document.querySelector("#password");
var inputsecurity = document.querySelector("#key");

eyebutton.addEventListener("click" , function(){
	if(inputpassword.type === "password")
	{
	  inputpassword.setAttribute("type" , "text");
	}else
	{
	  inputpassword.setAttribute("type" , "password"); 
	}
	
});

eyebutton1.addEventListener("click" , function(){
	if(inputsecurity.type === "password")
	{
	  inputsecurity.setAttribute("type" , "text");
	}else
	{
	 inputsecurity.setAttribute("type" , "password"); 
	}
});