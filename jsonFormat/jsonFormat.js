function jsonFormat(text,options){
	var initailOpt = { tab:"    " ,newLine:"\n",space:" "};
	for(var opt in options){
		initailOpt[opt] = options[opt];
	}
	options = initailOpt;
	var inString = false,
		level = 0,
		result = "";
	function repeat(times,c){
		return new Array(times).join(c);
	}
	for(var i=0,length=text.length;i<length;i++){
		var curChar = text[i];
		switch(curChar){
			case '{':
			case '[':
				if(inString){
					result+=curChar;
				}else{
					if(i!=0){
						result+=options.newLine;
					}
					result+=repeat(level,options.tab);
					result+=curChar;
					result+=options.newLine;
					level++;
				}
				break;
			case '}':
			case ']':
				if(inString){
					result+=curChar;
				}else{
					level--;
					result+=repeat(level,options.tab);
					result+=curChar;
					result+=options.newLine;
				}
				break;
			case '"':
				inString = !inString;
				result+=curChar;
				break;
			case ':':
				result+=curChar;
				break;
			case ',':
				result+=curChar;
				result+=options.newLine;
				break;
		}
	}
	return result;
}