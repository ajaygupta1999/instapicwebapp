var modal = document.getElementById("prof-img-modal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("profile_img");
var modalImg = document.getElementById("img");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-span")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}