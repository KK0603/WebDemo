var subbar = document.getElementById("subsidebar");
var contentPage = document.getElementById("content_page");
var mainPage = document.getElementById("main_page");
var titlePage = document.getElementById("title_page");
setInterval(function(){
	// subbar.classList.toggle("active");
	titlePage.classList.toggle("before");
	titlePage.classList.toggle("hidden");
	mainPage.classList.toggle("after");
	contentPage.classList.toggle("before");
},3000);