Image Shortener
===

画像をBase64エンコードしてURLに埋め込み短縮するプログラムです。  
URL短縮には外部のサービスを利用しています。
応用次第で他のURL短縮サービスでも動作すると思います。

##使用法
使用するには設定を変更する必要があります。  
proxyとsiteの変更は必須です。proxyの参考スクリプトは./example/proxy.jsを参照して下さい。  
generate.js: 9-12

	/* settings */
	var	proxy = "http://appcloud.info:8098/",// Access-Control-Allow-Originを付加するProxy
		site = "http://img.ww24.jp/",// 設置するサイトのURL
		api = "p.tl";// 短縮URLサービス

##アクセスログ
ログは下記のように記録されます。

	{"date":"Fri, 11 Nov 2011 11:11:11 +0900","type":"html","path":"\/","status":200},
	{"date":"Fri, 11 Nov 2011 11:11:11 +0900","type":"data","path":"\/images\/ptl_img1.gif","status":200},
	{"date":"Fri, 11 Nov 2011 11:11:11 +0900","type":"data","path":"\/images\/ptl_logo2.png","status":200},
	{"date":"Fri, 11 Nov 2011 11:11:11 +0900","type":"data","path":"\/p.tl\/c1yY","status":200},

これは、このようにJSONとして読み込むことができます。

	json_decode('[' . substr(trim(file_get_contents('./access.log')), 0, -1) . ']')

##更新履歴

###v0.2.0: 2011/11/12
- 公開