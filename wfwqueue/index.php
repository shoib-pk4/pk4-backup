<?php 
/* 
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

class addWfwQueueRec {
	var $usrid, $conn_db_tennant;
	//$mq='KZQGVNs7DRMAWT7Rov+fmA==', $orgid, $requestorid='kishore@impelcrm.in', $master_connection='host=192.168.11.11 port=5432 dbname=immaster user=postgres password=postgres'; //dev
	$mq=$_GET['mq'], $orgid, $requestorid='kishore@impelcrm.in', $master_connection='host=10.33.200.239 port=5432 dbname=impelmaster user=impelapi password=impel_2013'; //prod
	var $srvLoginName;
	var $tbl, $pk, $oper, $user, $dateTime, $org, $hashstr, $notes, $startDate, $conn_string_tennant, $run_id, $my_pid;

	public function validateSession() {

		ini_alter('date.timezone','Asia/Calcutta'); //set the timezone

		$this->run_id = rand(1000000, 9999999);
		$this->my_pid = getmypid ();
		$this->dateTime = date('Y-m-d H:i:s'); //get the current date and time

		$curl = curl_init();
	    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid); //dev
	    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$this->requestorid); //prod
	    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
		curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
		curl_setopt ($curl, CURLOPT_HEADER, false);	
		
	    $enttsResult1 = curl_exec ($curl);
	    
		if($enttsResult1 == "") {
			$this->writeLogFile ("wfw", "wfw related", " ERROR", "Empty session", "" . "", "");
			exit;
		} else {
			$usermq = $enttsResult1;
			$curl = curl_init();
			//curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq); //dev
			curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$this->mq."&mq=".$usermq); //prod
			curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
			curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
			curl_setopt ($curl, CURLOPT_HEADER, false);	
			
			$enttsResult = curl_exec ($curl);
			curl_close ($curl);	

			if($enttsResult == "") {
				$this->writeLogFile ("wfw", "Session related", " ERROR", 'Invalid session', "" . "", "");
				exit;
			}	
			$json_entts = json_decode($enttsResult,true);
			$this->usrid = $json_entts[0]["usrid"]; 	
			$this->orgid = $json_entts[0]["orgid"]; 
			$this->srvLoginName = $json_entts[0]["LoginName"]; 		
			
		}
	}


		public function getTenantConnection() {
			$conn_db_master = pg_connect($this->master_connection); 

			//connection check for db
			if (!$conn_db_master) {	
				$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Connection to master db failed', "Connection String: " . $conn_db_master, "");
				exit;
			} 

			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$this->srvLoginName."'";
			$getTenantDtsSQL = @pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Selecting tenant query failed: '.$querygetTenantDtsSQL, "Connection String: " . $conn_db_master, "");
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
				$error = 1;
				$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Tenant connection failed ', "Connection String: " . $this->conn_string_tennant, "");
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		public function addWfwQueueRecToDb() {

			$this->pk        = $_GET['pk'];
			$this->tbl       = $_GET['tbl'];
			$this->oper      = $_GET['oper'];
			$this->user      = $_GET['user'];
			$this->org       = $_GET['org'];
			$this->this->hashstr   = $_GET['hashstr'];
			$notes     = $_GET['notes'];
			$this->startDate = date('Y-m-d'). ' 00:00:00';	

			// echo $this->org_id;

			$query  = "select wfw_rule_id from wfw_rule,orgname where (wfw_rule.wfw_on_entity ilike '".$this->tbl."') and ";
			$query .= "(wfw_rule.eval_criteria ilike '%".$this->oper."%') and ";
			$query .= "(wfw_rule.orgname = ".$this->org." or ";
			$query .= "wfw_rule.orgname is null) and ";
			$query .= "wfw_rule.orgname = orgname.orgname_id and ";
			$query .= "orgname.licexpirydate > '".$this->startDate."'";

			$result = pg_query($this->conn_db_tennant, $query);
			if(!$result) {
				$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
				$this->closeTenantConnection(); //close connection if failed
				exit;
			}

			$cnt = pg_num_rows($result);
			if($cnt > 0) {
				//if rule found then insert into wfw queue, 1st param is status, 2nd is error msg if query failed				
				$this->makeEntryInWfwQueue('WFW exists', 'Failed to insert wfw queue found entry');
				$this->closeTenantConnection(); //close connection if failed
			} 
			else {	
				//if no rule found then select org name
				$query = "select orgname from org_flag where org_flag.orgname=$org and (org_flag.name = 'Lead_mapping') and (org_flag.inactive != '1')";
				$result = pg_query($this->conn_db_tennant, $query);
				
				if(!$result) {
					$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
					$this->closeTenantConnection(); //close connection if failed
					exit;
				}
				else  {
					$cnt = pg_num_rows($result);
				}

				if($cnt > 0) {
					//if org name found found then insert into wfw queue 1st param is status 2nd is error msg if query fails
					$this->makeEntryInWfwQueue('WFW does not exist', 'Failed to insert wfw queue not found entry');
					$this->closeTenantConnection();//close connection if failed
				}
				else {
					//if orgname also not found then select entt column
					$query = "select entt_column_id  from  entt_column where (entt_column.rollup_child_table_name = '".$this->tbl."') and (entt_column.orgname_id = ".$this->org.") ";
					if(!pg_query($this->conn_db_tennant, $query)) {
						$this->writeLogFile ("wfw", "wfw related", " ERROR", 'Query failed: '.$query, "Connection String: " . $this->conn_string_tennant, "");
						$this->closeTenantConnection(); //close connection if failed
						exit;
					} 
					else {
						$result = pg_query($this->conn_db_tennant, $query);
						$cnt = pg_num_rows($result);
						if($cnt > 0) {
							//insert entry for entt_column_id found, 1st param is status, 2nd is error msg if query fails
							$this->makeEntryInWfwQueue('WFW exist', 'Failed to insert wfw queue found entry');
							$this->closeTenantConnection(); //close connection if failed
						}
					}
				}


			}

	}

	//close tenant connection
	private function closeTenantConnection() {
		pg_close ($this->conn_db_tennant);
	}

		
	//inserts row into wfw_query
	private function makeEntryInWfwQueue($status, $errMsg) {
		//insert entry for entt_column_id found
		$query = "insert into wfw_queue(wfw_queue_id, table_affected, pri_key_value, change_operation, change_by_user, change_time, wfw_status, orgname, notes, hash_str)";
		$query .= " values(nextval('seq_wfw_queue'),'".$this->tbl."', ".$this->pk.", '".$this->oper."', ".$this->user.", '".$this->dateTime."', 'Pending', ".$this->org.", '".$status."',  '".$this->hashstr."')";
		if(!pg_query($this->conn_db_tennant, $query)){
			$this->writeLogFile ("wfw", "wfw related", " ERROR", $errMsg, "Connection String: " . $this->conn_string_tennant, "");
			$this->closeTenantConnection(); //close connection if failed
			exit;
		}		
	}

	public function writeLogFile ($val01, $val02 = "", $val03 = "", $val04 = "", $val05 = "", $val06 = "") {
		
		$myFile = "/tmp/wfw_queue_debug.log";
		$fh = fopen($myFile, 'a') or die("Can't open api_internals log file");
		$stringData = date('Y-m-d H:i:s T') . " | Run: $this->run_id, Org $this->orgid, User $this->usrid, Proc $this->my_pid |  " . $val01 . " | " . $val02 . " | " . $val03 . " | " . $val04 . " | " . $val05 . " | " . $val06  . "\n";
		fwrite($fh, $stringData);
		fclose($fh);
	}

		/* end of class */
}

$host = $_SERVER['SERVER_ADDR'];

$awqr = new addWfwQueueRec(); //create class object

//validate origin url
if(preg_match('/^192.168/', $host) || preg_match('/^10/', $host)) {		
	$awqr->validateSession();
	$awqr->getTenantConnection();
	$awqr->addWfwQueueRecToDb();
} else {
	$awqr->writeLogFile ("wfw", "wfw related", " ERROR", "Invalid host address.", "Access denied", "");
}





?>