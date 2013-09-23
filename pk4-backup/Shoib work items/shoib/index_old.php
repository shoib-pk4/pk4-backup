<?php 
  
	//text file contains url and name value pair data
	$dataFile = '/home/sridhar/jetty1/webapps/atCRM/sharedFiles/campaignData/'.$_GET['filename']; 

	if(!file_exists($dataFile)) 
		exit('No file by that name');

	$dataArr = file($dataFile); //reads file into array				
	unlink($dataFile); //delete the file after reading
		
	$count   = count($dataArr);
	//stop posting if array is empty
	if($count == 0)
		exit(' File has no data ');

	$urlToPost = $dataArr[0]; //by default first index contains url
	unset($dataArr[0]); //after reading url remove the index from array

	//form the post string 
	$fields_string = '';
	foreach($dataArr as $value) {
		list($k, $v) = explode('=', $value);
		$fields_string .= trim($k, ' ').'='.trim($v, ' ').'&';
	} 

	$fields_string = rtrim($fields_string, '&'); //remove & from string
				
	/* 
		** make sure curl is enabled on server
		post data using curl	
	*/
	$ch = curl_init(); //open connection
				
	curl_setopt( $ch, CURLOPT_URL, $urlToPost ); // set the url
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt( $ch, CURLOPT_POST, $count );  // no of post vars 
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $fields_string ); // set post data
				
	$result = curl_exec($ch); //execute post

	$result .= '--->'. date("Y-m-d H:i:s");
			
	$logFile = 'result.txt';

	//capture the return value
	$openLog = fopen($logFile, 'a');
	fwrite($openLog, $result);
	fclose($openLog);
				
	if(!$result) // print result					
		echo 'Failed no data posted<br />';
	
	curl_close($ch); //close connection
	

?>
