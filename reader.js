var searchBar = document.getElementById("search");
var nav = document.getElementById("nav");
nav.insertBefore(searchBar, nav.firstChile);

var searchBox = document.getElementById("search-input");
searchBox.type = "search";
searchBox.onkeypress = function (e) { e.stopPropagation() };
