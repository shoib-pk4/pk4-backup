<?php 

	/* 
		* Flow and Aim
			* Aim
				* When ever any tracking column entry is been modified then track that details into audit_transaction tbl
			* Flow
				* Connects to db
				* Gets the column's to be tracked, if not found terminates
				* If found then it matches the value of old column and new column, if 
				  changes found then it adds an entry in audit_transaction tbl;
			* Post params
				* tbl as entity_name, mq, user, org as orgname, ov, nv, pk
	*/
	
	class audit_trailing {

		var $conn_db_tennant, $srvLoginName, $master_connection, $ovArr, $nvArr, $requestorid = "vinutha@pk4.in";
		var $tbl, $pk, $oper, $user, $dateTime, $org,   $startDate, $conn_string_tennant, $run_id, $my_pid, $orgname, $entity_name;
		var $old_values, $column_details=array(), $changedColDetails=array(), $count_column_details=0, $columns=array();

		//get neccessary params
		public function __construct($db_conn) {			
			$this->master_connection = $db_conn;
			$this->entity_name = trim($_POST['tbl']); //get entity name string
			$this->mq          = trim($_POST['mq']); //get mq
			$this->user        = trim($_POST['user']); //get user id integer
			$this->orgname     = trim($_POST['org']); //get org id integer
			$this->old_values  = trim($_POST['ov']); //old values 
			$this->new_values  = trim($_POST['nv']); // new values
			$this->pk          = trim($_POST['pk']); // pk

			ini_alter('date.timezone','Asia/Calcutta'); //set the timezone

			$this->run_id = rand(1000000, 9999999);
			$this->my_pid = getmypid ();
			$this->dateTime = date('Y-m-d H:i:s'); //get the current date and time
			
		}

		//validate session
		public function validateSession() {

			$curl = curl_init();
		    curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid); //dev
		    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid); //prod
		    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
			curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
			curl_setopt ($curl, CURLOPT_HEADER, false);	
			
		    $enttsResult1 = curl_exec ($curl);
		    
			if($enttsResult1 == "") {
				$msg =  $this->dateTime . ' While validating session. EnttsResult came  empty. = ';
				$this->logError($msg);
				exit;
			} else {
				$usermq = $enttsResult1;
				$curl = curl_init();
				curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq); //dev
				//curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq); //prod
				curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
				curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
				curl_setopt ($curl, CURLOPT_HEADER, false);	
				
				$enttsResult = curl_exec ($curl);
				curl_close ($curl);	

				if($enttsResult == "") {
					$msg =  $this->dateTime . ' While validating session. EnttsResult came  empty. = ';
					$this->logError($msg);
					exit;
				}	
				$json_entts = json_decode($enttsResult,true);
				// $this->usrid = $json_entts[0]["usrid"]; 	
				// $this->orgid = $json_entts[0]["orgid"]; 
				$this->srvLoginName = $json_entts[0]["LoginName"]; 	
			}		
				
				// $devUrl = "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$this->mq;
				// $prodUrl = "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$this->mq;
				// $curl = curl_init();
				// curl_setopt ($curl, CURLOPT_URL, $devUrl); //dev				
				// curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
				// curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
				// curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
				// curl_setopt ($curl, CURLOPT_HEADER, false);	
				
				// $enttsResult = curl_exec ($curl);
				// curl_close ($curl);	



				// if($enttsResult == "") {
				// 	$msg =  $this->dateTime . ' While validating session. EnttsResult came  empty.'. $devUrl;
				// 	$this->logError($msg);
				// 	exit;
				// }	
				// $json_entts = json_decode($enttsResult,true);
				// //take the login name
				// $this->srvLoginName = $json_entts[0]["LoginName"]; 		
				
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

			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$this->srvLoginName."'";
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

				$this->conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=postgres password=postgres";	 //dev
				//$this->conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=impelapi password=impel_2013";	 //prod
				
				//free results to free memory
				pg_free_result($getTenantDtsSQL);
			}

			//tennant connection
			$this->conn_db_tennant = @pg_connect($this->conn_string_tennant);
			if (!$this->conn_db_tennant) {
				$msg =  $this->dateTime . ' Tenant connection failed. Tennant= '.$this->conn_string_tennant;
				$this->logError($msg);
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		/* 
			* Gets the columns to be monitored along with pk id of row
		*/
		public function getAuditColumns() {
			$query = "select column_name, audit_master_id from audit_master where orgname =".$this->orgname." and entity_name ilike '".$this->entity_name."' and inactive != '1'";
			$result = pg_query($this->conn_db_tennant, $query);
			if(!$result) {
				$msg =  $this->dateTime . ' Failed to select columns names. Query= '.$query;
				$this->logError($msg);
				exit;
			}
			$this->count_column_details = pg_num_rows($result);			
			if($this->count_column_details == 0) {
				$msg =  $this->dateTime . ' No columns found to audit transaction. Query= '.$query;
				$this->logError($msg);
				exit;
			}
			//proceed only if columns to monitor exists			
			while ($row = pg_fetch_assoc($result)) { 
				array_push($this->column_details, $row); //store complete array
				array_push($this->columns, strtolower($row['column_name'])); //store only name
			}
			
		}

		//performs match on old values and new values array
		public function matchOldAndNewValues() {
			
			//explode old values
			$this->ovArr = explode('#~', $this->old_values);
			//explode new values
			$this->nvArr = explode('#~', $this->new_values);

			//take count of both array's
			$ovCnt = count($this->ovArr);
			$nvCnt = count($this->nvArr);

			//if any of array's are empty, then just back out
			if($ovCnt == 0 || $nvCnt == 0) {
				$msg =  $this->dateTime . ' Count of ov array or nv array empty. ov='.$ovCnt.' nv='.$nvCnt;
				$this->logError($msg);
				exit;
			}
			//match count first
			if($ovCnt != $nvCnt) {
				$msg =  $this->dateTime . ' Old values and New values length does not match. Terminating. ov='.$ovCnt.' nv='.$nvCnt;
				$this->logError($msg);
				exit;
			}
			
			//check for columns changes
			//looping any one array, for each loop taking column name and checking whether that exist
			//in columns array, if yes then matching its values with old value
			//if value is changed then adding  old value,new value and pk of column id changedColDetails array
			// $matchStr = '';  //this is for debug remove when done
			for($i=0, $valInd=1, $ovCnt = $ovCnt-1; $i<$ovCnt; $i++, $valInd++) { 
				$key = strtolower($this->ovArr[$i]);
				// $matchStr .= $key.'-'.$ovArr[$valInd].'-'.$this->nvArr[$valInd]."\n\r";
				//if column name exists then only match				
				if(in_array($key, $this->columns)) {
					// $matchStr .= 'Match found'."\r\n";
					if($this->ovArr[$valInd] != $this->nvArr[$valInd]) {											
						// $matchStr .= 'Should entry '."\r\n";						
						$this->changedColDetails[$key] = $this->ovArr[$valInd]. '##' .$this->nvArr[$valInd] . '##'. $key;
					}
				}

			}

			
		}

		//this will add changes entry in audit transaction table
		public function addEntryInAuditTrans() {
			$totalEntry = count($this->changedColDetails);
			if($totalEntry == 0 ) {
				$msg =  $this->dateTime . ' No entry found to add in transaction. Terminating.';
				$this->logError($msg);
				exit;
			}

			//get most significant column
			$query  = "select col_most_significant from entitylist where entityname ilike '".$this->entity_name."' and orgname is null or orgname = ".$this->orgname." order by orgname desc limit 1";
			$this->logError("\r\n".$query."\r\n");
			$result = pg_query($this->conn_db_tennant, $query);
			if(!$result) {
				$msg =  $this->dateTime . ' Failed to select most significant column. Query= '.$query;
				$this->logError($msg);
				exit;
			}
			$cnt    = pg_num_rows($result);
			if($cnt == 0 ) {						
				$msg =  $this->dateTime . ' Most significant column not found. Terminating.';
				$this->logError($msg);
				exit;
			}			
			$data   = pg_fetch_assoc($result);
			$col_most_significant = $data['col_most_significant'];

			//get ov and nv val
			list($ovNew, $nvNew) =  $this->getOvAndNv(strtolower($col_most_significant));

			//get user name from sbeuser tbl
			$query = "select loginname from sbeuser where user_id =".$this->user;
			$result = pg_query($this->conn_db_tennant, $query);
			if(!$result) {
				$msg =  $this->dateTime . ' Failed to select login name. Query= '.$query;
				$this->logError($msg);
				exit;
			}
			$cnt    = pg_num_rows($result);
			if($cnt == 0 ) {		
				echo 'user not found.';
				exit;
			}			
			$data   = pg_fetch_assoc($result);
			$user_name  = $data['loginname'];

			//generates guid
			$guid = $this->generate_guid();

			//now loop through each changedColDetails entry extract row and make an entry in tbl
			foreach ($this->changedColDetails as $key => $value) {
				//here you get ov,nv, audit master column id, key is column name
				list($ov, $nv, $col_name) = explode('##', $value);
				//get column id using column name
				$am_id = '';
				foreach ($this->column_details as $col) {
					if(strtolower($col['column_name']) == $col_name) {
						$am_id = $col['audit_master_id'];
					}
				}
				$query = "insert into audit_transaction(audit_transaction_id, audit_master, change_by_user, change_date, past_value, pri_key_value, inactive, guid, created_date, entity_name, most_sig_col_name, most_sig_col_value , new_value, user_name, remarks ) ";
				$query .= "values(nextval('seq_audit_transaction'), $am_id, '$this->user', CURRENT_TIMESTAMP , '$ov', $this->pk, '0', '$guid', CURRENT_TIMESTAMP , '$this->entity_name', '$col_most_significant', '$nvNew', '$nv', '$user_name', 'Impel Background Audit')";

				// echo $query.'<br />';

				if(!pg_query($this->conn_db_tennant, $query)) {
					echo 'Query failed for '. $key.'-'.$value.'<br />';
					$msg =  $this->dateTime . ' Query failed for adding entry in audit transaction tbl. query= '.$query;
					$this->logError($msg);
				}
			}
		}

		//this generates guid
		private function generate_guid() {
			//taken from http://stackoverflow.com/questions/2040240/php-function-to-generate-v4-uuid
			return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		        // 32 bits for "time_low"
		        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

		        // 16 bits for "time_mid"
		        mt_rand( 0, 0xffff ),

		        // 16 bits for "time_hi_and_version",
		        // four most significant bits holds version number 4
		        mt_rand( 0, 0x0fff ) | 0x4000,

		        // 16 bits, 8 bits for "clk_seq_hi_res",
		        // 8 bits for "clk_seq_low",
		        // two most significant bits holds zero and one for variant DCE1.1
		        mt_rand( 0, 0x3fff ) | 0x8000,

		        // 48 bits for "node"
		        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
		    );
		}

		/* 
			* log results in /tmp/destroy-session-debug.log
		*/
		private function logError($msg) {
			$logFile = '/tmp/audit_trans.log';

			$str = $msg. "\n\r";

			//append str to file
			file_put_contents($logFile, $str, FILE_APPEND);
		}

		//returns ov and nv value
		private function getOvAndNv($colName) {
			//get ov and nv
			$ov = '';
			$nv = '';
			$ovCnt = count($this->ovArr);
			for($i=0, $valInd=1, $ovCnt = $ovCnt-1; $i<$ovCnt; $i++, $valInd++) { 
				$key = strtolower($this->ovArr[$i]);
				if($key == $colName) {
					$ov = $this->ovArr[$valInd];
					$nv = $this->nvArr[$valInd];
					break;
				}

			}
			return array($ov, $nv);
		}
		
		// end of class
	}


	//take server address	
	$host = $_SERVER['SERVER_ADDR'];
	
	//validate origin url
	if(preg_match('/^192.168/', $host) || preg_match('/^10/', $host)) {		

		//take connection string from constants file
		require('../constants/php_config.cfg');		
		//create class object	and taking master conn from php config file
		$audit_obj = new audit_trailing($master_connection); 
		//these are public functions triggerd one after other
		$audit_obj->validateSession();
		$audit_obj->getTenantConnection();
		$audit_obj->getAuditColumns();
		$audit_obj->matchOldAndNewValues();
		$audit_obj->addEntryInAuditTrans();
		
	} else {
		//invalid access to file
		echo 'Invalid ip';		
	}

?>