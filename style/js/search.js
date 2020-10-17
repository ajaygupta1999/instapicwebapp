var search = document.querySelector("#search-input-box");
var matchlist = document.querySelector("#allmatches");
// search all the users from json file and filter.
   const searchStates = async searchText => {
	var res = await fetch("/instapic/api/users");
	var states = await res.json();

	// find all match..
	let matches = states.filter(state => {
		const regex = new RegExp(escapeRegex(searchText), 'gi');
		// const regex = new RegExp(`^${searchText}` , 'gi');
		console.log(regex);
		return state.fullname.match(regex);
	});
	   
	if(searchText.length === 0){
		matches = [];
		matchlist.innerHTML = '';
	}
	   
	updatesearchbox(matches);
}
   
var updatesearchbox  = matches => {
	if(matches.length > 0){
      var urllen = matches[0].length;
	  var html = matches.map(match => `
	<a href="/user/${match._id}">
		<div class="d-flex align-items-center flex-row" id="searchresult">
			<div id="imgsearchdiv">
			  <img class="searchedimages" src="https://res.cloudinary.com/instapic-heroku-app/image/upload/c_fill,w_46,h_46,g_auto,f_auto/${match.avatar.substr(60 , urllen)}" alt="simpleimagetag">
			</div>
			<div class="d-flex flex-column p-2"> 
			   <h5>${match.fullname}</h5>
			   <p class="each-search-users-description"> ${match.description} </p>
			</div>
		</div> 
    </a>
  ` ).join('');
		matchlist.innerHTML = html;
	}
}

// search.addEventListener("input" , () => searchStates(search.value));
var flag= true;
var pretime = "";
var nexttime = "";
var d = ""; 
search.addEventListener("input" , function(e){
	
	if(pretime === ""){
		pretime = new Date().getTime();
	}
	
	nexttime = new Date().getTime();
	if(nexttime - pretime > 1000){
		searchStates(search.value)
	} else {
		clearTimeout(d);
		d = setTimeout(function(){
		    searchStates(search.value)
		} , 1000); 
	}
	pretime = nexttime;
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
