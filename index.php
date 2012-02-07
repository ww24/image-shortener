<?php
/**
 * Image-Shortener
 * index.php
 * http://img.ww24.jp/
 */

// setting
$default_api = 'p.tl';

$log = array(
	'date' => date(DATE_RFC1123),
	'type' => 'html',
	'path' => $_SERVER['PATH_INFO'],
	'status' => 200
);
$path = explode('/', $_SERVER['PATH_INFO']);
$api = isset($path[1]) ? $path[1] : null;
$data = isset($path[2]) ? $path[2] : null;
if (isset($api) && $api !== '') {
	$log['type'] = 'data';
	function expand($type, $api, $data) {
		$url = explode(',', $data);
		foreach ($url as $id => $val) {
			if ($type) {
				$html = file_get_contents('http://' . $api . '/' . $val);
				$html_s = mb_strpos($html, '<title');
				$html_e = mb_strpos($html, '</title>');
				$title = explode('>', mb_substr($html, $html_s, $html_e - $html_s));
				$html = explode(' ', $title[1]);
				$exp_url = $html[0];
			} else {
				$exp_url = file_get_contents('http://ux.nu/hugeurl?url=' . $api . '/' . $val);
			}
			$url[$id] = substr(parse_url($exp_url, PHP_URL_PATH), 1);
			
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
	}
	if (isset($data)) {
		expand(false, $api, $data);
	} else {
		$data_array = explode('/', substr(parse_url(file_get_contents('http://ux.nu/hugeurl?url=' . $default_api . '/' . $api), PHP_URL_PATH), 1));
		$api = $data_array[0];
		$data = $data_array[1];
		expand(true, $api, $data);
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
			<div id="header">
				<a href="/">
					<img src="logo.png" alt="Image Shortener - URL短縮サービスを利用したオンラインストレージ -" />
				</a>
			</div>
			<p>
				画像をBase64エンコードし、p.tlで短縮して短いURLに変換します。<br />
				保存した画像はp.tlでURLとして保管されます。<br />
			</p>
				主な用途
				<ul>
					<li>画像の共有</li>
					<li>ウェブサイトへ貼り付け</li>
				</ul>
			<p>
				※URLの生成はChrome, Safari, Firefoxで確認しています。(HTML5 File APIを使用します。)<br />
				ソースコードは<a href="https://github.com/ww24/image-shortener">こちら</a>
			</p>
			<strong>※保存した画像は削除できませんのでご注意下さい。</strong>
			<form id="form" action="#">
				<input id="file" type="file" /><br />
			</form>
		</div>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="generate.js"></script>
	</body>
</html>
EOD;
	echo $data;
}
// logging
file_put_contents('./access.log', json_encode($log) . ",\n", FILE_APPEND | LOCK_EX);

/* EOF index.php */