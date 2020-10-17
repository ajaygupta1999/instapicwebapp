var button = document.querySelectorAll("#getstarted-button");
var emaillockbutton = document.querySelector("#email-lock");
var falock = document.querySelector("#fa-lock");

emaillockbutton.addEventListener("click"  , function(){
	   if(falock.getAttribute("class") === "fas fa-lock"){
		 var inputfield = document.querySelector("#Email");
	     inputfield.setAttribute("id" , "Email-2");
		 falock.setAttribute("class" , "fas fa-lock-open");  
	   }else{
		 var inputfield = document.querySelector("#Email-2");
	     inputfield.setAttribute("id" , "Email");
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
