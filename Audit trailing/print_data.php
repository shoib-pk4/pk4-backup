<?php 
	$str = '';

	foreach ($_POST as $key => $value) {
		$str .= $key.'---->'. $value."\n\r";
	}

	file_put_contents('getData.txt', $str);
?>