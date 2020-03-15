var search = document.querySelector("#search-input-box");
var matchlist = document.querySelector("#allmatches");
// search all the users from json file and filter.
   const searchStates = async searchText => {
	var res = await fetch("/instapic/api/users");
	var states = await res.json();
	
	// find all match..
	let matches = states.filter(state => {
		const regex = new RegExp(`^${searchText}` , 'gi');
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
      <div class="d-flex flex-row" id="searchresult">
        <div id="imgsearchdiv">
          <img class="searchedimages" src="https://res.cloudinary.com/instapic-heroku-app/image/upload/c_fill,w_40,h_40,g_auto,f_auto/${match.avatar.substr(60 , urllen)}" alt="simpleimagetag">
        </div>
        <div class="p-2"> 
           <a href="/user/${match._id}"><h5>${match.fullname}</h5></a>
        </div>
      </div> 
  ` ).join('');
		matchlist.innerHTML = html;
	}
}

search.addEventListener("input" , () => searchStates(search.value));
