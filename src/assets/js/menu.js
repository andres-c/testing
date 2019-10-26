$(document).ready(function () {
 
  console.log('touch: Load');

  $("#toggle").on('click ontouchend', function() {
    console.log('touch');
    //on click, the hamburger menu elements get the toggle-active class and the overlay gets the nav-active class
    $(this).toggleClass("toggle-active");
    $("#overlay").toggleClass("nav-active");
  
    //the h1 element toggles between visibility and invisibility
    $("h1").toggleClass("hidden");
  });



  // document.addEventListener("DOMContentLoaded", function(){
  //   // Handler when the DOM is fully loaded
  // });
  // document.querySelector(".ant-modal").onscroll = function(e) {
  //   console.log(this);
  // }

  
  $("#homepage-input").on("change", function() {
    
    var textLength = this.val().length;
    console.log(this);
    
    if(textLength < 12) {
      //Do nothing
    } else if (textLength < 14) {
        this.style.fontSize = "6.5em";
    } else if (textLength < 17) {
      this.style.fontSize = "5.5em"
    } else if (textLength < 21) {
      this.style.fontSize = "4.5em"
    } else if (textLength < 27) {
      this.style.fontSize = "3.5em"
    } else if (textLength < 32) {
      this.style.fontSize = "3em"
    }
  
    
    
  });




}); // End of use strict