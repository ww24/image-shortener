/**
 * Image-Shortener
 * generate.js
 * http://img.ww24.jp/
 */

$(function () {
	/* settings */
	var	proxy = "http://imgpx.cloudfoundry.com/",
		site = "http://img.ww24.jp/",
		api = "p.tl",
		fakeurl = "http://base64.test/";
	
	var	data = "",
		mime = "",
		submit = true,
		addImage = function (files) {
			var	file = files[0];
			if (file.type.split("/")[0] === "image") {
				var fr = new FileReader();
				fr.onload = function () {
					data = fr.result;
					mime = file.type;
					$("#data").remove();
					$("#form").css({padding: 0}).append('<div id="data"><img id="img" src="'+ fr.result +'" alt="image" /><br />'+
						'<span id="info">Source: '+ file.size +'byte, Base64: '+ data.length +'byte <span>'+
						'<input id="submit" type="submit" value="保存" /></div>');
					submit = false;
					if (file.size > 1000000) alert("画像のサイズが大きすぎるため、ブラウザがクラッシュする場合があります。");
				};
				fr.readAsDataURL(file);
			} else {
				if ($("#data").size() > 0) {
					$("#data").remove();
					$("#form").css({padding: "120px"});
					submit = true;
				}
				$("#file").val("");
				alert("画像を選択して下さい");
			}
		};
	$("#file").change(function () {
		addImage(this.files);
	});
	$("#form").bind("drop", function (e) {
		addImage(e.originalEvent.dataTransfer.files);
		return false;
	}).bind("dragenter", function () {
		return false;
	}).bind("dragover", function () {
		$(this).css({"border-color": "#4169e1"});
		return false;
	}).bind("dragleave", function () {
		$(this).css({"border-color": "#6495ed"});
		return false;
	}).submit(function () {
		if (submit) return false;
		submit = true;
		$("#submit").remove();
		$("#info").remove();
		var	$url = $("#data").append('Short URL :<input id="url" value="Now loading..." readonly="readonly" /> <a id="link" href="#">Link</a>').find("#url"),
			size = 32510,
			display = new function () {
				var able = true;
				this.alert = function (message) {
					if (able) {
						able = false;
						alert(message);
					}
				};
				this.show = function (uri) {
					$("#link").css({display: "inline"}).attr({href: uri}).click(function () {
						window.open(uri);
						return false;
					});
					$url.val(uri).click(function () {
						$(this).select();
					});
				};
			}(),
			ajax = function (site, uri, callback) {
				$.ajax({
					type: "post",
					url: proxy + api,
					data: {
						q: site + uri
					},
					dataType: "text",
					error: function () {
						display.alert("URL短縮中にネットワークエラーが発生しました。");
					},
					success: function (result) {
						var shortURL = $(result).find("#shorturl").attr("value");
						callback(shortURL);
					}
				});
			},
			split = [],
			counter = 0;
		// (data:image/~~~;base64,)を除去
		data = mime + "," + data.split(",")[1];
		for (var i = 0; data.length > 0; i++) {
			split[i] = (data.length > size) ? data.slice(0, size) : data;
			data = data.slice(size);
		}
		var shorten = function (i, j) {
			var	count = j,
				uri = split[j];
			ajax(fakeurl, uri, function (url) {
				split[count] = url.slice(api.length + 8);
				if (i === ++counter) {
					ajax(fakeurl, api + "/" + split.join(","), function (url) {
						display.show(site + url.split('/').pop());
					});
				}
			});
		};
		for (var j = 0; i > j; j++) {
			shorten(i, j);
		}
		return false;
	});
});