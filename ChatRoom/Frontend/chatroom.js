;
(function($) {
	var websocket = {};
	// var websocket = new Websocket('');
	var user = '';

	/**
	 * 用户登录
	 */
	$('#submit').click(submitClickHandler);
	$('#loginName').focus();

	function submitClickHandler() {
		var name = $('#loginName').val();
		if (name) {
			$('#submit').text("登录中……");
			$("#submit").addClass('ing');
			$("#submit").unbind();
			$.ajax({
				url: 'register',
				method: 'POST',
				data: {
					userName: name
				},
				error: function() {
					$("#loginTips").text("服务器连接错误，请重试");
					$("#loginTips").addClass('show');
					$('#submit').text("进入聊天室");
					$("#submit").removeClass('ing');
					$('#submit').click(submitClickHandler);
					$('#submit').text("登录成功！");
					$("#submit").addClass('ok');
					setTimeout(function() {
						$("#loginDialog").addClass("fade")
					}, 600);
					setTimeout(function() {
						$("#mainWrapper").addClass("show");
						$('#inputText').focus();
					}, 1000);

				},
				success: function(result) {
					if (!result) {
						$("#loginTips").text("服务器返回错误，请重试");
						$("#loginTips").show();
					} else {
						switch (result.code) {
							case 0:
								/**
								 * 打开websocket！！！
								 */
								websocket.open();
								this.user = name;
								$("#loginDialog").hide();
								$("#mainWrapper").show();
								$("#submit").removeClass('ing');
								$('#submit').text("登录成功！");
								$("#submit").addClass('ok');
								if (result.userList && result.userList instanceof Array) {
									var itemString = '';
									for (var i = 0, length = result.userList.length; i < length; i++) {
										itemString += ['<li class="userItem">', result.userList[i], '</li>'].join('');
									}
									$("#userList").append(itemString);
								}
								setTimeout($("#loginDialog").addClass("fade"), 500);
							case -1:
								$("#loginTips").text(result.text);
								$("#loginTips").addClass('show');
								$('#submit').text("进入聊天室");
								$("#submit").removeClass('ing');
								$('#submit').click(submitClickHandler);
						}
					}

				}
			});
		} else {
			$("#loginTips").text("不能使用空昵称，请重新输入");
			$("#loginTips").addClass('show');
		}
	}

	$("#loginName").keydown(function(e) {
		$("#loginTips").removeClass('show');
		if(e.which == 13 || e.which == 10){
			$("#submit").trigger("click");
		}
	});

	$("#send").click(function() {
		var text = $("#inputText").val().trim();
		if (text) {
			json = {
				user: user,
				data: text,
				time: new Date().toString()
			}
			html = '<div class="messagebox"><div class="icon-l"></div><div class="message-l"><span class="user">useruseruseruseruseru1<span class="time">&nbsp;&nbsp;12:12</span></span><div class="contentwrapper"><pre class="content-l">'+text+'</pre></div></div></div>';
			$("#messageShown")[0].innerHTML += html; 
			var set = $('.messagebox');
			var height = set[set.length-1].offsetTop;
			$('#messageShown').animate({scrollTop: height}, 400); 
			// websocket.send(JSON.stringify(json));
		} else {
			$("#textTips").text("不能发空消息");
			$("#textTips").addClass('show');
		}
		$("#inputText").val('');
	});

	$("#inputText").keyup(function(e) {
		var text = $("#inputText").val();
		if(e.ctrlKey && e.which == 13 || e.which == 10){
			$("#textTips").removeClass('show');	
			$("#inputText").val(text+"\r\n");
		}else if(e.which == 13 || e.which == 10){
			$("#send").trigger("click");
		}else{
			$("#textTips").removeClass('show');			
		}

	});

	websocket.onmessage = function(event) {
		var data = event.data;
		var html = '';
		var style = '';
		if (data && data.mine) {
			style = '';
		}
		html = '<div class="messagebox"><div class="icon-r"></div><div class="message-r"><span class="user">useruseruseruseruseru1<span class="time">&nbsp;&nbsp;12:12</span></span><div class="contentwrapper"><pre class="content-r">sadfsadfasdfasdf</pre></div></div></div>';
$("#messageShown").innerHTML += html;     };

	$(window).unload(function() {
		websocket.colse();
		$.ajax({
			url: 'unregister',
			method: 'POST',
			data: {
				userName: name
			},
			error: function() {},
			success: function(result) {}
		});
	});

	function genernicIcon() {}

})(jQuery);

/* 	待实现
	1.用户密码登录
	2.用户头像设置
	3.查看用户信息
	4.历史消息
	5.刷新问题或者使用sessionStorage解决
*/