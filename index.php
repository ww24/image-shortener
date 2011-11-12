<?php
/**
 * Image-Shortener
 * v0.2.0
 * index.php
 * http://img.ww24.jp/
 */

$log = array(
	'data' => date(DATE_RFC1123),
	'type' => 'html',
	'path' => $_SERVER['PATH_INFO'],
	'status' => 200
);
$path = explode('/', $_SERVER['PATH_INFO']);
$api = isset($path[1]) ? $path[1] : null;
$data = isset($path[2]) ? $path[2] : null;
if (isset($api) && $api !== '') {
	$log['type'] = 'data';
	if (isset($data)) {
		$url = explode(',', $data);
		foreach ($url as $id => $val) {
			$url[$id] = substr(parse_url(file_get_contents('http://ux.nu/hugeurl?url=' . $api . '/' . $val), PHP_URL_PATH), 1);
			if ($id === 0) {
				$val = explode(',', $url[$id]);
				if (isset($val[0], $val[1])) {
					$mime = $val[0];
					$url[$id] = $val[1];
				} else break;
			}
		}
		$data = base64_decode(implode($url), true);
		if ($data !== false && isset($mime)) {
			header('Content-Type: ' . $mime);
			header('Content-Length: ' . strlen($data));
			echo $data;
		} else {
			header('HTTP/1.1 404 Not Found');
			$log['status'] = 404;
		}
	} else {
		header('HTTP/1.1 404 Not Found');
		$log['status'] = 404;
	}
} else {
	$data = <<< EOD
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="style.css" />
		<title>Image Shortener</title>
	</head>
	<body>
		<div id="wrapper">
			<h1 class="title">URL短縮サービスを利用したオンラインストレージ</h1>
			<h2 class="title">- Image Shortener -</h2>
			<p>
				画像をBase64エンコードし、p.tlで短縮して短いURLに変換します。<br />
				保存した画像はp.tlでURLとして保管されます。<br />
				主な用途
				<ul>
					<li>画像の共有</li>
					<li>ウェブサイトへ貼り付け</li>
				</ul>
				※URLの生成はChrome, Safari, Firefoxで確認しています。(HTML5 File APIを使用します。)<br />
			</p>
			<strong>※保存した画像は削除できませんのでご注意下さい。</strong>
			<form action="#" id="form">
				<input id="file" type="file" /><br />
			</form>
		</div>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="generate.js"></script>
	</body>
</html>
EOD;
	echo $data;
}
// logging
file_put_contents('./access.log', json_encode($log) . ",\n", FILE_APPEND | LOCK_EX);

/* EOF index.php */