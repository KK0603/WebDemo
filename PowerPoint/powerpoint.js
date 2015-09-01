var page = (function(){
	var output = {};
	var pageSettings = {
		chapters : [],
		totalPage : 0,
	};
	var pageState = {
		currentPage :"TT",
		currentIndex :"",
		currentChapter:"",
		subSidebarActive:false,
		subSidebarChapter:"",
	}
	var allcontent = document.querySelectorAll(".content_page");
	var allChapterDiv = document.querySelectorAll(".chapter");
	var sidebar = document.querySelector("#sidebar");
	var subsidebar = document.querySelector("#subsidebar");
	var contentWrapper = document.getElementById("content_wrapper");
	var mainWrapper = document.getElementById("main_wrapper");
	var titlePage = document.getElementById("title_page");
	var indexPage = document.getElementById("index_page");
	var thankPage = document.getElementById("thank_page");
	function Chapter(){
		this.CN=0;
		this.totalPN=0;
		this.totalIndex=0;
		this.startPN=0;
		this.endPN=0;
		this.startIndex=0;
		this.endIndex=0;
		this.indexPN=[];
	}
	var getTotalPage = function(){
		var l = pageSettings.chapters.length;
		return pageSettings.chapters[l-1].endPN;
	}
	var getIndexPage = function(index){
		if(!validateIndex(index)){
			return pageState.currentPage;
		}
		var ia = index.split(".");
		var chapter = pageSettings.chapters[(+ia[0]-1)];
		var page = chapter.indexPN[(+ia[1]-chapter.startIndex)];
		return page;
	};
	var getPageIndex = function(page){
		var result = "1.1";
		if(page == "TT" || page == "TC" || page=="TY"){
			return result;
		}
		return document.querySelector('.content_page[data-pn="'+ page +'"]').dataset.index;
	}
	var validateIndex =function(index){
		if(!index){
			return false;
		}
		var ia = index.split(".");
		if(ia.length != 2 || (+ia[0])>pageSettings.chapters.length){
			return false;
		}
		var chapter = pageSettings.chapters[(+ia[0]-1)];
		if((+ia[1])< chapter.startIndex || (+ia[1])>chapter.endIndex){
			return false;
		}
		return true;
	};
	var getNextPage = function(page){
		var result = 1;
		switch(page){
			case "TT":
				return "TC";
			case "TY":
				return "TY";
			case "TC":
				return 1;
			case pageSettings.totalPage:
				return "TY";
			default:
				return (+page + 1);
		}
	}
	var getPrevPage = function(page){
		var result = 1;
		switch(page){
			case "TT":
				return "TT";
			case "TY":
				return pageSettings.totalPage;
			case "TC":
				return "TT";
			case 1:
				return "TC";
			default:
				return (+page - 1);
		}
	}
	var compareIndex = function(a,b){
		var aa = a.split(".");
		var bb = b.split(".");
		if(!validateIndex(a) || !validateIndex(b) || aa.length != bb.length){
			return "umComparable";
		}
		for(var i = 0, l = aa.length;i<l;i++){
			if(aa[i] == bb[i]){
				continue;
			}else{
				return (aa[i]>bb[i]?1:-1);
			}
		}
		return 0;
	}
	var navigateToPage = function(page){
		var height = document.documentElement.clientHeight;
		if(page == "TT"){
			mainWrapper.style.top = -(0 * height)+"px";
		}else if(page == "TC"){
			mainWrapper.style.top = -(1 * height)+"px";
		}else if(page == "TY"){
			mainWrapper.style.top = -(3 * height)+"px";
		}else if(page<1 || page > pageSettings.totalPage){
			return;
		}else{
			mainWrapper.style.top = -(2 * height)+"px";
			contentWrapper.style.top = -((page-1) * height)+"px";
		}
		pageState.currentPage = page;
		pageState.currentIndex = getPageIndex(page);
		pageState.currentChapter = pageState.currentIndex.substring(0,1);
		var allSidebarItem = document.querySelectorAll(".sidebar_item");
		for(var i = 0,l=allSidebarItem.length;i<l;i++){
			allSidebarItem[i].classList.remove("active");
		}
		document.querySelector('#sidebar .sidebar_item[data-chapter="'+ pageState.currentChapter +'"]').classList.add("active");
	}
	var setHeight = function(){
		var totalHeight = 0;
		var height = document.documentElement.clientHeight;
		var width = document.documentElement.clientWidth;
		for(var i = 0,l = allcontent.length;i<l;i++){
			allcontent[i].style.height = height+"px";
			allcontent[i].style.width = width-250+"px";
			totalHeight += height;
		}
		sidebar.style.height = height+"px";
		subsidebar.style.height = height+"px";
		titlePage.style.height = height+"px";
		indexPage.style.height = height+"px";
		thankPage.style.height = height+"px";
		titlePage.style.width = width+"px";
		indexPage.style.width = width+"px";
		thankPage.style.width = width+"px";
		contentWrapper.style.height = totalHeight + "px";
	}
	var SetEvents = function(){
		window.onresize = function(){
			setHeight();
			navigateToPage(pageState.currentPage);
		}
		document.addEventListener("keydown",function(event){
			if(event.keyCode == 38){
				navigateToPage(getPrevPage(pageState.currentPage));
			}else if(event.keyCode == 40){
				navigateToPage(getNextPage(pageState.currentPage));
			}
		});
		sidebar.addEventListener("click",function(event){
			var cp = event.target.dataset.chapter;
			if(!cp){
				return;
			}
			if(cp == pageState.subSidebarChapter){
				subsidebar.classList.toggle("active");
				pageState.subSidebarActive = !pageState.subSidebarActive;
				return;
			}
			subsidebar.classList.remove("active");
			var chapter = pageSettings.chapters[+cp-1];
			var html = "";
			for(var i=0;i<chapter.totalIndex;i++){
				var index = [chapter.CN,'.',(+i+(+chapter.startIndex))].join("");
				var active = "";
				if(index == pageState.currentIndex){
					active = "active";
				}
				html+=['<div class="index sidebar_item ', active ,'" data-index="',index,'">',index,'</div>'].join("");
			}
			function render(){
				subsidebar.classList.add("active");
				pageState.subSidebarActive = true;
				pageState.subSidebarChapter = cp;
				subsidebar.innerHTML = html;
			}
			if(pageState.subSidebarActive){
				setTimeout(render,400);
			}else{
				render();
			}
		});
		subsidebar.addEventListener("click",function(event){
			var index = event.target.dataset.index;
			if(!index){
				return;
			}
			navigateToPage(getIndexPage(index));
			subsidebar.classList.remove("active");
			pageState.subSidebarActive = false;
			pageState.subSidebarChapter = "";
		});
	}
	var setChapters = function(){
		var indexTmp = "";
		var chapter = new Chapter();
		var isNewChapter = true;
		for(var i = 0, l = allcontent.length; i < l; i++){
			var currentContent = allcontent[i];
			var index = currentContent.dataset.index;
			currentContent.dataset.pn = (i+1);
			if(indexTmp && index.split(".")[0] != chapter.CN){
				chapter.indexPN.push(i);
				pageSettings.chapters.push(chapter);
				chapter = new Chapter();
				isNewChapter = true;
			}
			var ia = index.split(".");
			chapter.CN = ia[0];
			chapter.totalPN += 1;
			if(ia[1] != indexTmp.split(".")[1] || isNewChapter){
				chapter.totalIndex += 1;	
				chapter.indexPN.push((i+1));
			}
			if(isNewChapter){
				chapter.startPN = (i+1);
				chapter.startIndex = ia[1];
			}
			chapter.endPN = (i+1);
			chapter.endIndex = ia[1];
			indexTmp = index;
			isNewChapter = false;
			if(i == l-1){
				pageSettings.chapters.push(chapter);
			}
		}
		var l = pageSettings.chapters.length;
		pageSettings.totalPage = pageSettings.chapters[l-1].endPN;
	}
	var initialize = function(){
		setChapters();
		setHeight();
		SetEvents();
	}
	initialize();
	return output;
})();
//todo : support 0 index！Change contentCount! too complicated! support multiple pages for 1 index!