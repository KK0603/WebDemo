(function() {
	var EventUtil = {
		addHandler: function(element, type, handler) {
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent) {
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		},
		removeHandler: function(element, type, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent) {
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		}
	};

	var as = document.getElementsByTagName("a");
	var i, j, k, m;
	for (i = 0; i < as.length; i++) {
		as[i].onclick = function(event) {
			event = EventUtil.getEvent(event);
			EventUtil.preventDefault(event);
			var a = EventUtil.getTarget(event);
			if (a.tagName.toLowerCase() == "span") {
				a = a.parentNode;
			}
			var aparent = a.parentNode.parentNode.parentNode.parentNode;
			var contents = aparent.querySelectorAll("div[data-tab-index]");
			for (j = 0; j < contents.length; j++) {
				var divparent = contents[j].parentNode.parentNode;

				if (contents[j].dataset.tabIndex == a.dataset.tabIndex) {
					contents[j].classList.remove("hidden");
				} else {
					contents[j].classList.add("hidden");
				}

			}
			var alla = aparent.querySelectorAll("a[data-tab-index]");
			for (j = 0; j < alla.length; j++) {
				var aparent2 = alla[j].parentNode.parentNode.parentNode.parentNode;

				if (alla[j].dataset.tabIndex == a.dataset.tabIndex) {
					alla[j].parentNode.classList.add("active");
				} else {
					alla[j].parentNode.classList.remove("active");
				}

			}
		};

		var allDiv = document.querySelectorAll("div.tab");
		for (k = 0; k < allDiv.length; k++) {
			allDiv[k].querySelector("a").click();
		}
	}
})();