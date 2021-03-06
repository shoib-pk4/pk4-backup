<?php 

/*  For wfw queue

	* Shoib: author
	
	* It adds an row to wfw_queue table, based on condtions
	
	* flow
		* connects to db
		* selects a proper tenant
		* then performs the operations and adds row to wfw_query table
	
	* GET params needed
		* tbl(str), pk(int), user(int), org(int), hashstr(str), notes(str), oper(str), mq(str)

	* Logic
		* selects rule if found create wfw_queue record and exits
		* if rule not found select org flag if found create wfw_queue record and  exit
		* if org flag not found select count of entt_column_id if found create wfw_queue record and exit
*/

/* For audit transaction

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


	class audit_and_wfw {

		var $conn_db_tennant, $srvLoginName, $ovArr, $nvArr, $requestorid = "kishore@impelcrm.in";
		var $tbl, $pk, $oper, $user, $dateTime, $org,   $startDate, $conn_string_tennant, $run_id, $my_pid, $orgname, $entity_name;
		var $old_values, $column_details=array(), $changedColDetails=array(), $count_column_details=0, $columns=array();

		//get neccessary params
		public function __construct($dbCon) {	

			$this->mc = $dbCon;
			$this->entity_name = trim($_POST['tbl']); //get entity name string
			$this->mq          = trim($_POST['mq']); //get mq
			$this->user        = trim($_POST['user']); //get user id integer
			$this->orgname     = trim($_POST['org']); //get org id integer
			$this->old_values  = trim($_POST['ov']); //old values 
			$this->new_values  = trim($_POST['nv']); // new values
			$this->pk          = trim($_POST['pk']); // pk
			$this->dbName      = trim($_POST['dbName']); // dbName
			$this->oper        = trim($_POST['oper']); // oper

			ini_alter('date.timezone','Asia/Calcutta'); //set the timezone

			$this->run_id = rand(1000000, 9999999);
			$this->my_pid = getmypid ();
			$this->dateTime = date('Y-m-d H:i:s'); //get the current date and time

			// //validate session
			// $this->validateSession();
			// //get tennant connection
			// $this->getTenantConnection();
			
		}

		//validate session
		public function validateSession() {

			$url = "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid;
			// $url = "http://data.impelcrm.in/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid;

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
				$url = "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq;
				// $url = "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq;
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
			$conn_db_master = @pg_connect($this->mc);

			// $this->logError($conn_db_master);
			// $this->logError(implode('----', $_POST));
			// $this->logError($this->mc);


			//connection check for db
			if (!$conn_db_master) {	
				$msg =  $this->dateTime . ' Connection to master db failed. Connection= '.$this->mc;
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
				//$musrid = $getTenantDtdata["user_id"];
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
				$msg =  $this->dateTime . ' Tenant connection failed. Tennant= '.$querygetTenantDtsSQL;
				$this->logError($msg);
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		/* 
			* log results in /tmp/destroy-session-debug.log
		*/
		protected function logError($msg) {
			$logFile = '/tmp/audit_trans.log';

			$str = $msg. "\n\r";

			//append str to file
			file_put_contents($logFile, $str, FILE_APPEND);
		}


	public function addWfwQueueRecToDb() {


		$query  = "select wfw_rule_id from wfw_rule,orgname where (wfw_rule.wfw_on_entity ilike '".$this->entity_name."') and ";
		$query .= "(wfw_rule.eval_criteria ilike '%".$this->oper."%') and ";
		$query .= "(wfw_rule.orgname = ".$this->orgname." or ";
		$query .= "wfw_rule.orgname is null) and ";
		$query .= "wfw_rule.orgname = orgname.orgname_id and ";
		$query .= "orgname.licexpirydate > '".$this->dateTime."'";

		// $result = pg_query($this->conn_db_tennant, $query);
		// if(!$result) {
		// 	$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
		// 	$this->closeTenantConnection(); //close connection if failed
		// 	exit;
		// }

		$cnt = pg_num_rows($result);
		if($cnt > 0) {
			//if rule found then insert into wfw queue, 1st param is status, 2nd is error msg if query failed				
			$this->makeEntryInWfwQueue('WFW exists', 'Failed to insert wfw queue found entry');
		} 
		else {	
			//if no rule found then select org name
			$query = "select orgname from org_flag where org_flag.orgname=$org and (org_flag.name = 'Lead_mapping') and (org_flag.inactive != '1')";
			$result = pg_query($this->conn_db_tennant, $query);
			
			if(!$result) {
				$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
			}
			else  {
				$cnt = pg_num_rows($result);
			}

			if($cnt > 0) {
				//if org name found found then insert into wfw queue 1st param is status 2nd is error msg if query fails
				$this->makeEntryInWfwQueue('WFW does not exist', 'Failed to insert wfw queue not found entry');
			}
			else {
				//if orgname also not found then select entt column
				$query = "select entt_column_id  from  entt_column where (entt_column.rollup_child_table_name = '".$this->entity_name."') and (entt_column.orgname_id = ".$this->orgname.") ";
				if(!pg_query($this->conn_db_tennant, $query)) {
					$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
				} 
				else {
					$result = pg_query($this->conn_db_tennant, $query);
					$cnt = pg_num_rows($result);
					if($cnt > 0) {
						//insert entry for entt_column_id found, 1st param is status, 2nd is error msg if query fails
						$this->makeEntryInWfwQueue('WFW exist', 'Failed to insert wfw queue found entry');
					}
				}
			}


		}

	}

	//close tenant connection
	protected function closeTenantConnection() {
		pg_close ($this->conn_db_tennant);
	}

		
	//inserts row into wfw_query
	protected function makeEntryInWfwQueue($status, $errMsg) {
		//insert entry for entt_column_id found
		$query = "insert into wfw_queue(wfw_queue_id, table_affected, pri_key_value, change_operation, change_by_user, change_time, wfw_status, orgname, notes, hash_str)";
		$query .= " values(nextval('seq_wfw_queue'),'".$this->entity_name."', ".$this->pk.", '".$this->oper."', ".$this->user.", '".$this->dateTime."', 'Pending', ".$this->orgname.", '".$status."',  '".$this->old_values."')";
		if(!pg_query($this->conn_db_tennant, $query)){
			$this->writeLogFile ("wfw", "wfw related", " ERROR", $errMsg, "Connection String: " . $this->conn_string_tennant, "");
		}		
	}

	protected function writeLogFile ($val01, $val02 = "", $val03 = "", $val04 = "", $val05 = "", $val06 = "") {
		
		$logFile = "/tmp/wfw_queue_debug.log";
		$stringData = "\r\n". date('Y-m-d H:i:s T') . " | Run: $this->run_id, Org $this->orgid, User $this->usrid, Proc $this->my_pid |  " . $val01 . " | " . $val02 . " | " . $val03 . " | " . $val04 . " | " . $val05 . " | " . $val06  . "\r\n";

		//append str to file
		file_put_contents($logFile, $stringData, FILE_APPEND);
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
				$msg =  $this->dateTime . ' No entry found to add in transaction. Terminating !!! ';
				$this->logError($msg.implode(',',$this->columns));
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
				$msg = 'user not found.';
				$this->logError($msg);
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
		protected function logError($msg) {
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




	//end of clas

	}

		//perform operation here
	$host = $_SERVER['SERVER_ADDR'];	
	//validate origin url
	if(preg_match('/^192.168/', $host) || preg_match('/^10/', $host)) {	
		//take connection string from constants file
		include('../constants/php_config.cfg');

		//get the data base connection
		$audit_and_queue = new audit_and_wfw($master_connection);
		$audit_and_queue->validateSession();
		$audit_and_queue->getTenantConnection();

		//add entry in wfw queue
		$audit_and_queue->addWfwQueueRecToDb();


		//audit trans operations here
		//these are public functions triggerd one after other
		$audit_and_queue->getAuditColumns();
		$audit_and_queue->matchOldAndNewValues();
		$audit_and_queue->addEntryInAuditTrans();

	}
?>