/**
 * Image-Shortener
 * v0.2.0
 * generate.js
 * http://img.ww24.jp/
 */

$(function () {
	/* settings */
	var	proxy = "http://appcloud.info:8098/",
		site = "http://img.ww24.jp/",
		sep = ",",
		api = "p.tl";
	
	var	data = "",
		mime = "",
		submit = true;
	$("#file").change(function () {
		var	file = this.files[0];
		if (file.type.split("/")[0] === "image") {
			var fr = new FileReader();
			fr.onload = function () {
				data = fr.result;
				mime = file.type;
				var $data = $("#data");
				if ($data.size() > 0) {
					$data.remove();
				}
				$("#form").append('<div id="data"><img id="img" src="'+ fr.result +'" alt="image" /><br />'+
					'<span id="info">Source: '+ file.size +'byte, Base64: '+ data.length +'byte <span>'+
					'<input id="submit" type="submit" value="保存" /></div>');
				submit = false;
				if (file.size > 1000000) alert("画像のサイズが大きすぎるため、ブラウザがクラッシュする場合があります。");
			};
			fr.readAsDataURL(file);
		} else {
			if ($("#data").size() > 0) {
				$("#data").remove();
				submit = true;
			}
			$("#file").val("");
			alert("画像を選択して下さい");
		}
	});
	$("#form").submit(function () {
		if (submit) return false;
		submit = true;
		$("#submit").remove();
		$("#info").remove();
		var	$url = $("#data").append('Short URL :<input id="url" value="Now loading..." readonly="readonly" />').find("#url"),
			size = 32510,
			ajax = function (uri, callback) {
				$.ajax({
					type: "post",
					url: proxy + api,
					data: {
						q: site + uri
					},
					dataType: "text",
					error: function () {
						alert("URL短縮中にネットワークエラーが発生しました。");
					},
					success: function (result) {
						var shortURL = $(result).find("#shorturl").attr("value");
						callback(shortURL);
					}
				});
			},
			display = function (uri) {
				$url.val(uri);
				$url.focus(function () {
					$(this).select();
				}).click(function () {
					$(this).select();
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
		for (var j = 0; i > j; j++) {
			(function () {
				var	count = j,
					uri = split[j];
				ajax(uri, function (url) {
					split[count] = url.slice(api.length + 8);
					if (i === ++counter) {
						ajax(api + "/" + split.join(sep), function (url) {
							display(url);
						});
					}
				});
			})();
		}
		return false;
	});
});