<?php 
	
	/* 
		if post request the store result in txt file
	*/
	if(isset($_POST)) { 

		$file = 'result.txt';

		file_put_contents($file, $_POST); //write data into file
	}
?>