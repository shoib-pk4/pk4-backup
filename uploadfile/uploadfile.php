<?php 
	class uploadFile {

		var $mq, $orig_filename, $filecontent, $guid, $requestorid, $filepath, $unique_filename, $entity_name;

		//get the post values
		public function __construct() {

			$this->mq            = $_POST['mq']; //get mq
			$this->orig_filename = $_POST['filename']; //get file name
			$this->filecontent   = base64_decode($_POST['filecotents']); //decode to base 64 content
			$this->guid          = $_POST['guid']; //get file name
			$this->filepath      = $_POST['filepath']; //get file path
			$this->entity_name   = $_POST['entity_name']; //get entity name
		}

		//validate session
		public function validateSession() {
			// $url = "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid;
			$url = "http://data.impelcrm.in/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid;

			$curl = curl_init();
		    curl_setopt ($curl, CURLOPT_URL, $url); 
		    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
			curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
			curl_setopt ($curl, CURLOPT_HEADER, false);	
			
		    $enttsResult1 = curl_exec ($curl);
		    
			if($enttsResult1 == "") {
				$msg =  $this->dateTime . ' While validating session. EnttsResult came  empty for user session = '.$url;
				$this->logError($msg);
				exit;
			} else {
				$usermq = $enttsResult1;
				//$url = "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq;
				$url = "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq;
				$curl = curl_init();
				curl_setopt ($curl, CURLOPT_URL, $url); 
				curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
				curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
				curl_setopt ($curl, CURLOPT_HEADER, false);	
				
				$enttsResult = curl_exec ($curl);
				curl_close ($curl);	

				if($enttsResult == "") {
					$msg =  $this->dateTime . ' While validating session. EnttsResult came  empty requester id = '.$url;
					$this->logError($msg);
					exit;
				}	
				$json_entts = json_decode($enttsResult,true);
				// $this->usrid = $json_entts[0]["usrid"]; 	
				// $this->orgid = $json_entts[0]["orgid"]; 
				$this->srvLoginName = $json_entts[0]["LoginName"]; 	
			}		
				
		}

		//get tenanat connection
		public function getTenantConnection() {
			$conn_db_master = pg_connect($this->master_connection); 

			//connection check for db
			if (!$conn_db_master) {	
				$msg =  $this->dateTime . ' Connection to master db failed. Connection= '.$this->master_connection;
				$this->logError($msg);
				exit;
			} 
			
			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url FROM tenant_master WHERE tenant_master.name = '".$this->dbName."'";
			$getTenantDtsSQL = @pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$msg =  $this->dateTime . ' Selecting tenant query failed. Query= '.$querygetTenantDtsSQL;
				$this->logError($msg);
				exit;
			}

			$getTenantDtsrows = @pg_num_rows($getTenantDtsSQL);
			if($getTenantDtsrows > 0) {
				$getTenantDtdata = pg_fetch_assoc($getTenantDtsSQL);
				$tennantDB = $getTenantDtdata["org_name"];
				$musrid = $getTenantDtdata["user_id"];
				$jdbc_url = $getTenantDtdata["jdbc_url"];
				$db_server = substr($jdbc_url,18);

				$db_name = preg_replace('/\?.+/', '', $db_server);
				$db_name = preg_replace('/.+\//', '', $db_name);

				$db_server = preg_replace('/\/.+/', '', $db_server);

				$db_port = substr($db_server, -4, 4);

				$db_server = substr($db_server, 0,strlen($db_server) - 5);

				//$this->conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=postgres password=postgres";	 //dev
				$this->conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=impelapi password=impel_2013";	 //prod
				
				//free results to free memory
				pg_free_result($getTenantDtsSQL);
			}

			//tennant connection
			$this->conn_db_tennant = @pg_connect($this->conn_string_tennant);
			if (!$this->conn_db_tennant) {
				$msg =  $this->dateTime . ' Tenant connection failed. Tennant= '.$jdbc_url;
				$this->logError($msg);
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		//this file take binary data and convert into file in to particular location
		public function createFileInLocation() {
			//returns the extension
			$arr = explode('.', $this->orig_filename);
			$ext = array_pop($arr);

			$name = $this->generateFileName($ext); //returns unique name
			
			//create file with name
			file_put_contents($name, $this->filecontent);
		}	

		//this will inserts record in lib tbl and linking tbl
		public function insertRecord() {
			//first insert record into lib tbl and get the primary key
			$query = "insert into lib_item(lib_item_Id, Name, Description, Path, CreateDate, CreatedBy_Id, ItemOwner_Id, ContentType_Id, orig_file_name, orgname, download_status, size_in_bytes, data_source, created_by_portal_user)";
			$query .= "values(nextval(), '','','',CURRENT_TIMESTAMP,'','','','$this->orig_filename','','','','','')";
			//now execute query
			$resource = pg_query($this->conn_db_tennant, $query);
			//if failed to insert in lib_item, make a log entry & stop
			if(!$resource) { 
				$this->logError('Insert faile in lib_item query= '. $query);
				exit;
			}
			//returns primary key of inserted record
			$pk_id = pg_fetch_array($resource); 
			$pk_id = $pk_id['lib_item_Id'];

			//now insert this primary key entry into lib_item_for_acct
			$query = "insert into lib_item_for_acct(lib_item_for_acct_id, lib_item, account, added_by_user, added_on_date)";
			$query .= "values($pk_id, '', '', '', CURRENT_TIMESTAMP)";
			//if failed then make log entry & stop
			if(!pg_query($this->conn_db_tennant, $query)) { 
				$this->logError('Insert faile in lib_item_for_acct query= '. $query);
				exit;
			}
			

		}

		//generate unique file name
		private function generateFileName($ext) {
			//generate random file name with given extension
			$this->unique_filename = md5(uniqid(rand(), true)) . '.'.$ext; 

			//loop until to get unique file name
			while(file_exists($this->filepath.'/'.$this->unique_filename) == true) {
				$this->unique_filename = md5(uniqid(rand(), true)) . '.'.$ext; 
			}

			return $this->unique_filename;
		}

		/* 
			* log results in /tmp/destroy-session-debug.log
		*/
		private function logError($msg) {
			$logFile = '/tmp/uploadFile.log';

			$str = $msg. "\n\r";

			//append str to file
			file_put_contents($logFile, $str, FILE_APPEND);
		}


	}

	//run the class functionalites 
	//create the  obj first
	$uploadObj = new uploadFile();
	//validate sesssion
	$uploadFile->validateSession();
	//get tenant connection
	$uploadFile->getTenantConnection();
	//now create file
	$uploadFile->createFileInLocation();
	//insert record
	$uploadFile->insertRecord();
?>