var mymainpageimg = document.querySelector("#my-all-images-of-main-page");
if(mymainpageimg){
	var count = 1;
	setInterval(function(){
		if(count > 9){
			count = 1;
		}
		var urlstr = "/Images/Home-page/photo" + count + ".jpg";
		mymainpageimg.src = urlstr;
		count++;
	} , 5000);
}
