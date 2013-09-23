<?php 
	/* 
		* Aim: posting comma separated data to delete session

		* Only file access is allowed from cron, cmd line or 192.168... or 10.. ips

		* Flow:
			* Hits the url and gets the comma separated value, which will be key value pair.
			* Then its post those values to another url.
			* If fails in either of above case error is logged in /tmp/destroy-session-debug.log file.

		* Triggering to following servers, this array is in ../constants/php_config.cfg
		$impel_servers = array(
			array('name'=>'i1947.impelcrm.in','localIp'=>'10.228.171.79'),
			array('name'=>'i1948.impelcrm.in','localIp'=>'10.228.90.4'),
			array('name'=>'data.impelcrm.in','localIp'=>'10.234.42.250'),
			array('name'=>'sys.impelcrm.in','localIp'=>'10.228.237.204')
		);

	*/

	class deleteSessions
	{
		var $mailIds, $curl_error_msgs; 
		
		/* 
			* this will authenticate, valid access type for file
		*/
		public function __construct()
		{
			//set time zone
			ini_alter('date.timezone','Asia/Calcutta');

			//set mail ids
			// $this->mailIds = array('vadiraj@impelcrm.in','kishore@impelcrm.in', 'arun@impelcrm.in', 'shoib@impelcrm.in');
			$this->mailIds = 'vadiraj@impelcrm.in,kishore@impelcrm.in, arun@impelcrm.in, shoib@impelcrm.in';

			//validate file access type
			if(php_sapi_name() != 'cli') { //means request from webserver
				//check for authenticate host 
				$host = $_SERVER['SERVER_ADDR'];
				if(!preg_match('/^192.168/', $host) && !preg_match('/^10/', $host)) {		
					echo '<h1>Access denied.</h1>';
					// log error and exit
					$dt = date('Y-m-d, H:i:s');
					$msg = $host.' - Access denied '. $dt. "\n\r";
					$this->logError($msg);
					exit();
				} 
			}

			//set some curl error messages
			$this->curl_error_msgs = array('1'=>'Unsupported protocol','6'=>' name lookup timed out', '7'=>'Could not connect to host', '52'=>'Empty reply from server');
			
		}

		/* 
			* This will hit a url via curl and gets the comma separated values
		*/ 
		public function getCommaSepratedValuesAndPost($host, $serverName) {
			$url = $host.'/atCRM/custom/ki1/listExpSess.html?mq=EPwnQuMyQcMJJoNdRbX7fg=='; //dev
			//$url = $host.'/atCRM/custom/ki1/listExpSess.html?mq=EPwnQuMyQcMJJoNdRbX7fg=='; //prod

			/* set curl mechanism here */
			//initialize curl
			$curl = curl_init(); 
			//set trigger url
			curl_setopt($curl, CURLOPT_URL, $url);
			//header sent as part of http headers
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
			//tell curl that we need result as string instead of dumping on screen
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); 
			//get the data
			$data = curl_exec($curl);
			$data = trim($data, " \t\n\r\0\x0B");

			$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			$curlErr = curl_errno($curl);
			if(isset($this->curl_error_msgs[$curlErr]))
				$curlErr .= '('.$this->curl_error_msgs[$curlErr].')';

			//close the curl
			curl_close($curl);


			if($curlErr || $statusCode==404) { //error occured

				$dt = date('Y-m-d, H:i:s');
				$msg =  $dt. ' Php curl error no = '.$curlErr. ', Status code = '. $statusCode. ' while getting session '. ', Server name = '.$serverName. ', host = '. $url;
				// log error
				$this->logError($msg);

				if($statusCode ==  404)
					$reason = 'File not found for getting session';
				else
					$reason = 'Curl error while getting session';

				//send mail				
					$this->sendMail($this->mailIds, $curlErr, $statusCode, $dt, $reason, $serverName, $url);	

			}  else  { //if no errors found
				echo $msg = "Killing sessions: <br /> $data <br />";
				//post the comma separated values, if not null 
				if(strlen($data) > 0)	{
					$postData = $this->formPostParams($data); 
					$fields = explode('&', $postData);
					$fieldCount = count($fields);
					// print_r($postData);
					//form the proper key value pair
					$this->postData($host, $postData, $serverName, $fieldCount);
				}
			}	

		}

		/* 
			* this will return a post parameters
		*/
		private function formPostParams($str) {
			
			$newStr = rtrim($str, ','); //remove extra comma

			$fields = explode(',', $newStr);
			$params = '';
			foreach($fields as $param) {
				list($k, $v) = explode('|', $param);
				//trim unwanted chars
				$params .= trim($k, " \t\n\r\0\x0B") . '='. trim($v, " \t\n\r\0\x0B").'&';
			}
			
			$params = rtrim($params, '&');	//remove extra ampersand
			
			return $params;	

		}


		/* 
			* post comma separated values to url via curl
		*/
		private function postData($host, $data, $serverName, $fieldCount) {
			//url to post data
			$url = $host.'/atCRM/custom/ki1/dSess/deleteAction'; // dev
			//$url = $host.'/atCRM/custom/ki1/dSess/deleteAction'; // prod


			//init curl
			$curl = curl_init();
			//set url
			curl_setopt($curl, CURLOPT_URL, $url);
			// curl_setopt($curl, CURLOPT_URL, 'http://192.168.11.11:81/addCampaign/readPostData.php'); //test post

			//header sent as part of http headers
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
			//set curl to return result, instead dumping on screen
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			//set number of post params
			curl_setopt($curl, CURLOPT_POST, $fieldCount);
			//set post parameters
			curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
			//exec curl
			curl_exec($curl);
			$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			$curlErr = curl_errno($curl);
			if(isset($this->curl_error_msgs[$curlErr]))
				$curlErr .= '('.$this->curl_error_msgs[$curlErr].')';

			//close the curl
			curl_close($curl);

			if($curlErr || $statusCode==404) { //error occured

				$dt = date('Y-m-d, H:i:s');
				$msg = $dt.' Php curl error no = '.$curlErr. ', Status code = '. $statusCode. ' while posting session'.' Server name = '. $serverName. ', host = '. $url;

				// log error
				$this->logError($msg);


				if($statusCode ==  404)
					$reason = 'File not found for posting session';
				else
					$reason = 'Curl error while posting session';

				//send mail
					$this->sendMail($this->mailIds, $curlErr, $statusCode, $dt, $reason, $serverName, $url);	

			} 

		}


		/* 
			* log results in /tmp/destroy-session-debug.log
		*/
		private function logError($msg) {
			$logFile = '/tmp/destroy-session-debug.log';

			$str = $msg. "\n\r";

			//append str to file
			file_put_contents($logFile, $str, FILE_APPEND);
		}


		private function sendMail($to, $cr, $sc, $dt, $reason, $sn, $host) {

			$subject = 'Error destroying expired sessions - '.$dt;
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			$headers .= 'From: donotreply@impelcrm.in' . "\r\n" . 'Reply-To: support@impelcrm.in';
			$message = "<html><p><table border='1' cellspacing='5' cellpadding='5' style='text-align:left;'><tr style='color:white;background-color:black;'><th>Curl error no</th><th>Status code</th><th>Reason</th><th>Server Name</th><th>Host</th></tr>";
			$message .= "<tr><td>".$cr."</td><td>".$sc."</td><td>".$reason."</td><td>".$sn."</td><td>".$host."</td></tr></table></p></html>";
			mail($to, $subject, $message, $headers);			
		}
	}

	/* 
		* object is created
		* constructor is called and it validates the host and exits if un authorized
	*/
	$delSesObj = new deleteSessions();


	//include contants file
	require_once('../constants/php_config.cfg');

	/* 
		* hits the url, if data found then posts the data to delete session
	*/

	foreach ($impel_servers as  $key=>$value) {
			$host = 'http://'.$value['localIp'];
			$name = $value['name'];
			$delSesObj->getCommaSepratedValuesAndPost($host, $name);
		}	
	
	
?>