<?php
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
header('Content-type: text/xml');
//no time limit for this script execution
set_time_limit(0);
//timezone
date_default_timezone_set('Asia/Calcutta');

$error = 0;
$verb = "";
$musrid = "null";
$mq = "";
$req_time = date('Y-m-d H:i:s');
$usrid = "";
$orgid = "";
$srvLoginName = "";
$stdentities = array();
$stdenttCols = array();
$udef_table = "udef_data";
$syncFlag = "";
$default_territory = "null";
$process_status_id = "";
$actualUserMq = "";
$soaprequsetxml = "";
$returnErrorFields = array();
$userEmail = "";
$userDisplayName = "";

$errorSession = htmlspecialchars_decode("<error>Not a valid Session ID on this server</error>\r\n");
$errorapiheader = htmlspecialchars_decode("<error>Not a valid API Header</error>\r\n");
$errorService = htmlspecialchars_decode("<error>Service problem</error>\r\n");
$errorHeader = htmlspecialchars_decode("<objects><status>Failed</status><error>refError</error></objects>\r\n");
$errorHeaderField = htmlspecialchars_decode("<objects><refField>refValue</refField><status>Failed</status><error>refError</error></objects>\r\n");
$successResponse = htmlspecialchars_decode("<objects><refField>refValue</refField><status>statusVal</status></objects>\r\n");

//Files to include via require
require_once "../functions/logResult.php";
require_once "../functions/soapFunctions.php";
require_once "../constants/mostSignificantCols.php";
require_once "../constants/defaultbaseCols.php";
require_once "../constants/relationalEntities.php";
require_once "../functions/functionsLE.php";
require_once "../../constants/php_config.cfg";

function apiheader($data) {
	global $mq, $requestortype, $requestorid, $objectname, $verb, $req_time, $musrid, $error, $errorSession, $errorapiheader, $errorService, $errorHeader, $successResponse, $ifduplicate, $userEmail, $userDisplayName;
	$mq = $data->sessionid;
	$requestortype = $data->requestortype;
	$requestorid = $data->requestorid;
	$objectname = $data->objectname;
	$verb = $data->verb;	
	$ifduplicate = $data->ifduplicate;
}

//function to get soap  body
function loaddata($data) {
	global $mq, $requestortype, $requestorid, $objectname, $verb, $req_time, $musrid, $error, $errorSession, $errorapiheader, $errorService, $errorHeader, $successResponse, $stdentities, $stdenttCols, $ms_cols, $dbase_cols, $rel_entties, $headerError, $fieldErrors, $colKey, $colValue, $udef_table, $result, $syncFlag, $dataSource, $usrid, $orgid, $srvLoginName, $result, $guid, $recstatus, $api_log_id,$default_territory,$csv_territory,$process_status_id,$actualUserMq,$taluka_csv, $soaprequsetxml,$returnErrorFields, $ifduplicate, $userEmail, $userDisplayName, $debug_log_needed, $debug_verb, $run_id, $tennantDB, $conn_string_master, $my_pid, $insert_count, $update_count, $delete_count, $started_at_time,$master_connection;
	
	/*  Generate Run ID, for debug logging  */
	$run_id = rand(1000000, 9999999);
	$my_pid = getmypid ();
	$insert_count = 0;
	$update_count = 0;
	$delete_count = 0;

	/*  Session needs to  be valid, for usrid and orgid to be available  */
	sessionValidate($mq);

	$debug_log_needed = false;
	$myFile = '/tmp/php_debug_log_for_org_cfg.txt';
	if (file_exists($myFile) && is_readable ($myFile)) {
		$fh = fopen($myFile, 'r');
		$theData = fgets($fh);
		fclose($fh);
		$arr = explode(",", $theData, 2);
		$debug_org = $arr[0];
		$debug_verb = $arr[1];
	// writeLogFile ("Load Data API", "Debug Org and Verb: $debug_org, $debug_verb", "", "", "", "", "");
		if ($debug_org == $orgid) {
			$debug_log_needed = true;
		} else {
			$debug_log_needed = false;
		}
	}

	write_debug ("lE00072: loaddata: Beginning Load Data API", "Debug Log: $debug_log_needed", "My PID: $my_pid", "", "", "", "");
	writeLogFile ("Beginning Load Data API", "Debug Log: $debug_log_needed", "My PID: $my_pid", "", "", "");

	$result = "";
	$api_log_id = "";
	
	//connection to master database
	// $conn_string_master = "host=10.228.237.204 port=9999 dbname=impelmaster user=impelapi password=impel_2013";
	/*  Using master connection details specified in ../../constants/php_config.cfg  */
    $conn_string_master = $master_connection;

	$conn_db_master = @pg_connect($conn_string_master); 
	if (!$conn_db_master) {	
		printSoapResults($errorService);
		exit;
	}

	if($mq == "" || $requestorid == "" || $requestortype == "" || $objectname == "" || $verb == "" || strtolower($verb) != "loaddata") {
		$error = 1;	
		writeLogFile ("loaddataE", "loaddata", "System Error", "$errorapiheader", "", "");
		exit;		
	} else {
		if($usrid == "" && $orgid == "" && $srvLoginName == "") {
			$error = 1;
			writeLogFile ("loaddataE", "loaddata", "ld01: ERROR", "sessionValidate failed", "Is this a new server we rolled out but did not add in data:config/servers.txt?", "");
			write_debug ("lE00093: loaddata: sessionValidate failed; is this a new server we rolled out but did not add in data:config/servers.txt?");
			exit;
		} else {
			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$srvLoginName."'";
			$getTenantDtsSQL = @pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$pgerror = @pg_last_error();
				write_debug ("lE00101: loaddata: Error getting Tenant Info with SQL $querygetTenantDtsSQL, error $pgerror");
				$error = 1;	
				writeLogFile ("loaddataE", "loaddata", "ld01: Getting org and user details failed", "SQL: " . $querygetTenantDtsSQL, "SQL Result: " . $getTenantDtsSQL, "From Master Db", "");
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

				$conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=impelapi password=impel_2013";	
				
				//free results to free memory
				pg_free_result($getTenantDtsSQL);
			}
			
			//tennant connection
			$conn_db_tennant = @pg_connect($conn_string_tennant);
			if (!$conn_db_tennant) {
				$error = 1;
				writeLogFile ("loaddataE", "loaddata", "ld00125: ERROR", "Connection to tenant db failed:", "Connection String: " . $conn_string_tennant, "");
				exit;
			} else {
				pg_close ($conn_db_master);
				//write record in api log - writing to tenant database
				synclogResult($conn_db_tennant, "");
				
				if($api_log_id == "") {
					$error = 1;	
					synclogResult($conn_db_tennant, $errorService);
					exit;
				}
				$conn_db_master = null;
				// writeLogFile ("loaddataE", "loaddata", "ld01: INFO", "Tenant Db: " . $tennantDB, "Tenant Connection String: " . $conn_string_tennant, "Will insert into Process Status", "");
				$timenow = date('Y-m-d H:i:s');
				$started_at_time = $timenow;
				$process_name = $objectname." Import";
				$process_type = "CSV Upload";
				$process_status_sql = "insert into process_status (process_status_id, process_name, started_by_user, started_at_time, status, upload_id, inactive, orgname, process_type) values (nextval('seq_process_status'), '$process_name', $usrid, '$timenow','In progress ($my_pid)', '$srvLoginName', '0', $orgid, '$process_type') returning process_status_id";
				$process_status_sqlRes = @pg_query($conn_db_tennant, $process_status_sql);		
				write_debug ("lE00134: loaddata: Inserting Process Status with SQL $process_status_sql", "", "", "", "", "");

				/*  Check Debug Log setting for orgname  */
				if($process_status_sqlRes === FALSE) {
					$pgerror = @pg_last_error();
					@pg_query($conn_db_tennant, "ROLLBACK");
					$process_status_id = "";	
					$error = 1;	
					synclogResult($conn_db_tennant, $errorService);
					//writeLogFile ("loaddataE", "loaddata", "ld01: ERROR", "Process Status INSERT failed: $process_status_sql", "Error: $pgerror", "");
					exit;
				} else {
					@pg_query($conn_db_tennant, "COMMIT");	
					$select_row = pg_fetch_row($process_status_sqlRes);
					$process_status_id = $select_row[0];					
				}	
			}
			
			$logDate = date("d-M-Y H:i:s e");
			// $dataSource = "API-" . substr($requestortype, 0, 19) . ' - ' . $logDate . ' - ' . $run_id;
			$dataSource = "LOADDATA $run_id";
			
			//get all entities
			getAllEntitiesForUserMq($mq);
			//get all entitiy columns
			getAllEnttColsForUserMq($mq);
			
			//get syncFlag for loaddata is always client
			$syncFlag = 'client';
						
			$data_array = object2array($data);
			$t1 = print_r($data_array, true);
			// writeLogFile ("loaddataE", "loaddata", "Data Array: $t1", "", "", "");
			//to get objects
			foreach ($data_array as $key1 => $val1) {
				//if multiple objects
				if(!is_array($val1[0])) {
					$emptyarray = array();
					$actualobjectArray = array_merge($emptyarray, array($val1));			
				} else {
					$actualobjectArray = $val1;
				}
				$num_elements = count($actualobjectArray);
							
				foreach ($actualobjectArray as $askey => $asvalue) {
					/*  Close the tenant-db connection, sleep for a second, so that other things in Impel can continue; leave open at end of loop  */
					pg_close ($conn_db_tennant);
					$conn_db_tennant = null;
					usleep(1500000);
					$conn_db_tennant = @pg_connect($conn_string_tennant);

					/*  Update the process_status table with counts every 100 rows */
					if (($insert_count > 0 || $update_count > 0) && (($insert_count + $update_count) % 100) == 0) {
						$process_status_sql = "update process_status set no_of_records_inserted = $insert_count, no_of_records_updated = $update_count, no_of_lines_of_data  = $num_elements where  process_status_id = $process_status_id";
						$process_status_sqlRes = @pg_query($conn_db_tennant, $process_status_sql);
						@pg_query($conn_db_tennant, "COMMIT");
					}

					$headerError = 0;
					$fieldErrors = "";
					$colKey = "";
					$colValue = "";
					$guid = "";
					
					//process base object
					$base_array = $asvalue['baseobject'];			
					if(is_array($base_array)) {
						/*******************base*******************************/
						//get base entityname
						$base_entityname = $base_array['entityname'];	
						$base_condition = $base_array['condition'];	
						// write_debug ("lE: loaddata: Before processing Base Obj $base_entityname; Condition: $base_condition; Base Array: " . serialize ($base_array));
						$baseentt_inserted_id = processBaseObj($conn_db_tennant, $base_array, $base_entityname, $base_condition);

						//last inserted base entity pkvalue
						if($baseentt_inserted_id) {
							/*******************addorlinkobject*******************************/
							//process addorlinkobject object
							if (isset($asvalue['addorlinkobject'])) {
								$addrlink_array = $asvalue['addorlinkobject'];
								if(is_array($addrlink_array)) {
									//if multiple addorlinkobject 
									if(!is_array($addrlink_array[0])) {
										$emptyarray = array();
										$actualaddrlinkarray = array_merge($emptyarray, array($addrlink_array));			
									} else {
										$actualaddrlinkarray = $addrlink_array;
									}
									//print_r($actualaddrlinkarray);
									foreach ($actualaddrlinkarray as $keyaddrlink => $valaddrlink) {
										$addrlink_obj_array = $valaddrlink;
										//get addorlinkobject entityname
										$addrlink_entityname = $addrlink_obj_array['entityname'];	
										$addrlink_condition = $addrlink_obj_array['condition'];	
										$addrlinkentt_id = processRelatedObj($conn_db_tennant, $addrlink_obj_array, $addrlink_entityname, $addrlink_condition, 'addorlink');
										//last inserted addandlinkobject entity pkvalue
										if($addrlinkentt_id) {
											//process Intermediate to base and addorlinkobject 
											processIntermediate($conn_db_tennant, $base_entityname, $addrlink_entityname, $baseentt_inserted_id, $addrlinkentt_id, 'addorlink');	
										}							
									}										
								}
							}
						}				
					} else {
						//error no base object found
						$headerError = 1;
						$checkError = $errorHeader;
						$checkError = preg_replace('/refError/', "Base object not found", $checkError);
						$result .= $checkError;					
					}	
					//if all success for object
					if($headerError == 0) {
						@pg_query($conn_db_tennant,"COMMIT");		
						$checksuccess = $successResponse;
						if($guid) {
							$checksuccess = preg_replace('/refField/', "guid", $checksuccess);
							$checksuccess = preg_replace('/refValue/', $guid, $checksuccess);
							$checksuccess = preg_replace('/statusVal/', $recstatus, $checksuccess);							
						} else {
							$checksuccess = preg_replace('/refField/', $colKey, $checksuccess);
							$checksuccess = preg_replace('/refValue/', $colValue, $checksuccess);	
							$checksuccess = preg_replace('/statusVal/', $recstatus, $checksuccess);				
						}
						$result .= $checksuccess;
					}	
				}
				if (preg_match("/Failed/i", $result)) {
					$error = 1;	
				} else {
					if (preg_match("/No records submitted/i", $result)) {
						$error = 2;	
					} else {
						$error = 0;
					}
				}

				if(strtolower($verb) == "loaddata" && $process_status_id > 0) {
					$timenow = date('Y-m-d H:i:s');

					/*  takes a lloooooookknnnngggg time to update, if this is included, so removed   - KM, 8 Aug 2013
					$reponseMsg = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header><soap:apiHeader><soap:sessionid>'.$mq.'</soap:sessionid>       	<soap:requestortype>'.$requestortype.'</soap:requestortype><soap:requestorid>'.$requestorid.'</soap:requestorid><soap:objectname>'.$objectname.'</soap:objectname><soap:verb>'.$verb.'</soap:verb></soap:apiHeader></soapenv:Header><soapenv:Body><result>'.pg_escape_string($result).'</result></soapenv:Body></soapenv:Envelope>';
					$reponseMsg = pg_escape_string($reponseMsg);
					$process_status_sql = "update process_status set ended_at_time =  '$timenow', status = 'Completed', modified_date = '$timenow', modified_by = $usrid, soap_response = '{$reponseMsg}', no_of_records_inserted = $insert_count, no_of_records_updated = $update_count where process_status_id= $process_status_id";  */

					$process_status_sql = "update process_status set ended_at_time =  '$timenow', status = 'Completed', modified_date = '$timenow', modified_by = $usrid, no_of_records_inserted = $insert_count, no_of_records_updated = $update_count where process_status_id= $process_status_id";
					$process_status_sqlRes = @pg_query($conn_db_tennant, $process_status_sql);
					
					if($process_status_sqlRes === FALSE) {
						@pg_query($conn_db_tennant, "ROLLBACK");
						$process_status_id = "";	
						$error = 1;	
						synclogResult($conn_db_tennant, $errorService);
						exit;
					} else {
						@pg_query($conn_db_tennant, "COMMIT");										
					}	
				}
				synclogResult($conn_db_tennant, $result);
				
				if($userDisplayName == "") { $userDisplayName = "Impel User"; }
				if($userEmail != "") {
					$to = $userEmail;
					$subject = 'Data upload acknowledgment email from Impel - '.$req_time;
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
					$headers .= 'From: donotreply@impelcrm.in' . "\r\n" . 'Reply-To: support@impelcrm.in';
					$message = "<html><p>Dear ".$userDisplayName.", your recent Data Import into Impel, started at $started_at_time, is now complete. To view the detailed statistics of your import, please look at the Process Status page in Impel.</p><p>Regards,</p><p>Team Impel</p></html>";
					mail($to, $subject, $message, $headers);
				}
				exit;
			}
		}
	}
}
// disabling WSDL cache 
ini_set("soap.wsdl_cache_enabled", "0"); 
$server = new SoapServer("loaddataEntity.wsdl"); 
$server->addFunction("apiheader");
$server->addFunction("loaddata"); 
$server->handle();
?>