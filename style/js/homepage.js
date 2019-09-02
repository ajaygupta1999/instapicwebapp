var button = document.querySelectorAll("#getstarted-button");

for(var i = 0 ; i < button.length ; i++){
	button[i].addEventListener("click" , function() {
		window.scroll({
          top: 607, 
          left: 0, 
        behavior: 'smooth'
         });
});
}

