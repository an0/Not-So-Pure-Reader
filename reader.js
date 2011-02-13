/* Utility functions */
Element.prototype.hasClass = function(className) { return this.className.split(" ").indexOf(className) != -1; }


/* Move search box to nav */
var searchBar = document.getElementById("search");
var nav = document.getElementById("nav");
nav.insertBefore(searchBar, nav.firstChile);

var searchBox = document.getElementById("search-input");
searchBox.type = "search";
searchBox.onkeypress = function(e) { e.stopPropagation() };

/* Add goto icon after blog title when expanding current entry */
function addGotoIcon(entry, collapsed) {
	if (collapsed && collapsed.className == "collapsed" && entry.id == "current-entry" && entry.hasClass("expanded")) {
		var entryMain = null;
		for (var i = 0; i < collapsed.childNodes.length; ++i) {
			if (collapsed.childNodes[i].className == "entry-main") {
				entryMain = collapsed.childNodes[i];
				break;
			}
		}
		if (!entryMain) return;

		var entrySource = null;
		for (var i = 0; i < entryMain.childNodes.length; ++i) {			
			if (entryMain.childNodes[i].className == "entry-source-title") {
				entrySource = entryMain.childNodes[i];
				break;
			}
		}
		if (!entrySource) return;

		var gotoLink = null;
		for (var i = 0; i < entrySource.childNodes.length; ++i) {
			var childLink = entrySource.childNodes[i];
			if (childLink.tagName == "A" && childLink.className == "goto") {
				gotoLink = childLink;
				break;
			}
		}						
		if (gotoLink) return;
		
		// Find the source link element.
		var entryContainer = null;
		for (var i = 0; i < entry.childNodes.length; ++i) {
			if (entry.childNodes[i].className == "entry-container") {
				entryContainer = entry.childNodes[i];
				break;
			}
		}
		if (!entryContainer) return;
		
		entryMain = null;
		for (var i = 0; i < entryContainer.childNodes.length; ++i) {
			if (entryContainer.childNodes[i].className == "entry-main") {
				entryMain = entryContainer.childNodes[i];
				break;
			}
		}
		if (!entryMain) return;
		
		var entryAuthor = null;
		for (var i = 0; i < entryMain.childNodes.length; ++i) {
			if (entryMain.childNodes[i].className == "entry-author") {
				entryAuthor = entryMain.childNodes[i];
				break;
			}
		}
		if (!entryAuthor) return;
		
		var links = entryAuthor.getElementsByTagName("a");
		for (var i = 0; i < links.length; ++i) {
			if (links[i].className == "entry-source-title") {
				// Reuse the source link element, because its click event listener is necessary for normally jumping to the entry list of the source blog.
				gotoLink = links[i];
				gotoLink.className = "goto";
				gotoLink.innerHTML = "";
			}
		}
		if (!gotoLink) return;

		// Remove entry-source-title-parent.
		entryAuthor.removeChild(gotoLink.parentNode);
		
		// Margin between source title and goto icon.
		var marginFiller = document.createTextNode(" ");
		entrySource.appendChild(marginFiller);

		entrySource.appendChild(gotoLink);
		
		var gotoIcon = document.createElement("img");
		gotoIcon.src = safari.extension.baseURI + "goto.png";
		gotoLink.appendChild(gotoIcon);
	}
}

document.addEventListener("click", function(e) {
	var target = e.target;
	while (target) {
		if (target.tagName == "DIV" && target.className == "collapsed")
			break;
		target = target.parentNode;
	}
	if (!target) return;
	
	var entry = target.parentNode;
	var collapsed = target;
	addGotoIcon(entry, collapsed);
}, false);


document.addEventListener("keypress", function(e) {
	if (!(e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 106 || e.keyCode == 111)) return;
	
	var entry = document.getElementById("current-entry");
	
	if (e.keyCode == 32 || e.keyCode == 106) { // Space and j activate the next entry.
		if (!entry) {
			entry = document.getElementById("entries").firstChild;		
		}	else { 
			entry = entry.nextSibling;		
		}
	}

	// The "expanded" class has not yet been attached/detached when the keypress event is caught.
	if (entry.hasClass("expanded")) return;

	var collapsed = null;
	for (var i = 0; i < entry.childNodes.length; ++i) {
		if (entry.childNodes[i].className == "collapsed") {
			collapsed = entry.childNodes[i];
			break;
		}
	}
	if (!collapsed) return;

	// addGotoIcon(entry, collapsed);

	// Monitor the class attribute change.
	// entry.addEventListener("DOMAttrModified", function(e) {
	// 	if (e.relatedNode == this && e.attrName == "class" && this.hasClass("expanded")) {
	// 		addGotoIcon(entry, collapsed);
	// 		this.removeEventListener("DOMAttrModified", arguments.callee, false);
	// 	}
	// }, false);
	var intervalID =  window.setInterval(function() {
		if (entry.hasClass("expanded")) {
			window.clearInterval(intervalID);
			addGotoIcon(entry, collapsed);
		}
	}, 10);
}, false);
