<?php 

	/* 
		It will take file name from url and reads the url and csv from file and
		it posts the data to url file
	*/
	class postData {
		var $dataFile, $dataArr, $fields_string = '', $count, $urlToPost;
		
		public function __construct() {
			
			$this->dataFile = '/home/sridhar/jetty1/webapps/atCRM/sharedFiles/campaignData/'.'campaignPostData.txt';//$_GET['filename'];
		}


		public function postFileData() {

			$this->checkFileExists();

			$this->readFileAndDelete();

			$this->preparePostParams();

			$this->triggerUrlAndStoreResultInLog();
		}

		private function checkFileExists() {
			
			//check for file existens
			if(!file_exists($this->dataFile)) 
				$this->updateLog("\nNo file by that name"); 
		}

		private function readFileAndDelete() {
			$this->dataArr = file($this->dataFile); //reads file into array				
			unlink($this->dataFile); //delete the file after reading
				
			$this->count   = count($this->dataArr);
			//stop posting if array is empty
			if($this->count == 0)
				$this->updateLog("\nFile has no data");
		}

		private function preparePostParams() {
			
			$this->urlToPost = $this->dataArr[0]; //by default first index contains url
			unset($this->dataArr[0]); //after reading url remove the index from array

			//form the post string 
			foreach($this->dataArr as $value) {
				list($k, $v) = explode('=', $value);
				$this->fields_string .= trim($k, ' ').'='.trim($v, ' ').'&';
			} 

			$this->fields_string = rtrim($this->fields_string, '&'); //remove & from string
	
		}

		private function triggerUrlAndStoreResultInLog() {
			/* 
				** make sure curl is enabled on server
				post data using curl	
			*/
			$ch = curl_init(); //open connection
						
			curl_setopt( $ch, CURLOPT_URL, $this->urlToPost ); // set the url
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt( $ch, CURLOPT_POST, $this->count );  // no of post vars 
			curl_setopt( $ch, CURLOPT_POSTFIELDS, $this->fields_string ); // set post data
						
			$result = curl_exec($ch); //execute post

			$result .= '--->'. date("Y-m-d H:i:s")."\n";

			curl_close($ch); //close connection		
						
			if(!$result) // print result					
				$this->updateLog("\nFailed no data posted"); 
			
			$this->updateLog($result); //write to log
			
		}

		//write to log what ever message came
		private function updateLog($result) {
			$logFile = 'result.txt';
			//capture the return value
			$openLog = fopen($logFile, 'a');
			fwrite($openLog, $result);
			fclose($openLog);

			print_r($result);
			exit(); //dont go further
		}

	}


	/* post file data using curl */
	$postDataObj = new postData();
	$postDataObj->postFileData();

?>