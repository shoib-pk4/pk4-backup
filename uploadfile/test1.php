<?php 
	$imgBinary  =  file_get_contents('rathna@impeltouch.com/imageFile.jpg/chunks.txt');
	$imgBinary  =  base64_decode($imgBinary);
	file_put_contents('newimage.jpg',$imgBinary);
?>