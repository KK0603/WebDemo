var page = (function(){
	var output = {};
	var pageSettings = {
		contentCount : {
			chapterCount:4,
			C1:4,
			C2:3,
			C3:5,
			C4:2,
			0:0,
			1:4,
			2:7,
			3:12,
			4:14
		},
		chapters : [],
	};
	var pageState = {
		currentPage :"1.1"
	}
	var allcontent = document.querySelectorAll(".content_page");
	var allChapterDiv = document.querySelectorAll(".chapter");
	var sidebar = document.querySelector("#sidebar");
	var subsidebar = document.querySelector("#subsidebar");
	var contentWrapper = document.getElementById("content_wrapper");
	var getNextIndex = function(index){
		var result = index;
		if(!validateIndex(index)){
			return result;
		}
		var aa = index.split(".");
		if(aa[1] == pageSettings.contentCount["C"+aa[0]] && aa[0]<pageSettings.contentCount.chapterCount){
			result = (+aa[0]+1)+".1";
		}else if(aa[1] == pageSettings.contentCount["C"+aa[0]] && aa[0] == pageSettings.contentCount.chapterCount){
			result = index;
		}else{
			result = aa[0] + "." + (+aa[1]+1);
		}
		return result;
	}
	var getPrevIndex = function(index){
		var result = index;
		if(!validateIndex(index)){
			return result;
		}
		var aa = index.split(".");
		if(aa[1] == "1" && aa[0]>1){
			result = (+aa[0]-1)+"." + pageSettings.contentCount["C"+(+aa[0]-1)];
		}else if(aa[1] == "1" && aa[0] == "1"){
			result = index;
		}else{
			result = aa[0] + "." + (+aa[1]-1);
		}
		return result;
	}
	var validateIndex = function(index){
		var result = false;
		var aa = index.split(".");
		if(aa.length<2 || (+aa[0])>pageSettings.contentCount.chapterCount || (+aa[1])>pageSettings.contentCount["C"+aa[0]]){
			return result;
		}
		return true;
	}
	var getBlockCount = function(index){
		var result = 0;
		if(!validateIndex(index)){
			return result;
		}
		var aa = index.split(".");
		result = pageSettings.contentCount[(aa[0]-1)] + (+aa[1]);
		return result;
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
	var navigateToPage = function(index){
		if(!validateIndex(index)){
			return;
		}
		var count = getBlockCount(index)-1;
		var height = document.documentElement.clientHeight;
		contentWrapper.style.top = -(count * height)+"px";
		pageState.currentPage = index;
	}
	var setHeight = function(){
		var totalHeight = 0;
		for(var i = 0,l = allcontent.length;i<l;i++){
			allcontent[i].style.height = document.documentElement.clientHeight+"px";
			allcontent[i].style.width =document.documentElement.clientWidth-250+"px";
			totalHeight += document.documentElement.clientHeight;
		}
		contentWrapper.style.height = totalHeight + "px";
	}
	var SetEvents = function(){
		window.onresize = function(){
			setHeight();
			navigateToPage(pageState.currentPage);
		}
		document.addEventListener("keydown",function(event){
			if(event.keyCode == 38){
				navigateToPage(getPrevIndex(pageState.currentPage));
			}else if(event.keyCode == 40){
				navigateToPage(getNextIndex(pageState.currentPage));
			}
		});
		sidebar.addEventListener("click",function(event){
			var chapter = event.target.dataset.chapter;
			if(!chapter){
				return;
			}
			var indexCount = pageSettings.contentCount["C"+chapter];
			var html = "";
			for(var i=0;i<indexCount;i++){
				var index = [chapter,'.',(i+1)].join("");
				html+=['<div class="index" data-index="',index,'">',index,'</div>'].join("");
			}
			subsidebar.innerHTML = html;
			subsidebar.classList.add("active");
		});
		subsidebar.addEventListener("click",function(event){
			var index = event.target.dataset.index;
			if(!index){
				return;
			}
			navigateToPage(index);
			subsidebar.classList.remove("active");
		});
	}
	var setChapters = function(){
		var indexTmp = "";
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
		var chapter = new Chapter();
		var isNewChapter = true;
		for(var i = 0, l = allcontent.length; i < l; i++){
			var currentContent = allcontent[i];
			var index = currentContent.dataset.index;
			currentContent.dataset.pn = (i+1);
			if(indexTmp && index.split(".")[0] != chapter.CN){
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