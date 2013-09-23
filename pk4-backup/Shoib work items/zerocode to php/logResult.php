<?php
//writes entry in api_log table
function logResult($conn_db_tennant, $soapresult)
{
	global $mq, $requestortype, $requestorid, $clienttime, $verb, $req_time, $usrid, $error, $soaprequsetxml, $objectname, $conn_string_tennant, $orgid, $run_id, $my_pid;	
	//log entry in api_log table

	/*  Changed to writing in Tenant table instead of Master   - Kishore, 26 Jul 2013  */
	/* Check if the tenant database connection is valid - i.e. not null; if not valid, open a connection to close it later  */
	$close_connection = 0;
	if (is_null($conn_db_tennant)) {
		$conn_db_tennant = @pg_connect($conn_string_tennant);
		$close_connection = 1;
	}
	 
	if($error == 0)
	{
		$result_code = 'Ok';		
	}
	if($error == 1)
	{
		$result_code = 'Error';		
	}
	if($error == 2)
	{
		$result_code = 'Info';		
	}
	$error_msg = pg_escape_string($soapresult);
	$request_msg = pg_escape_string($soaprequsetxml);
	$timenow = date('Y-m-d H:i:s');
	
	$apiLogSql = "INSERT INTO api_log (api_log_id, req_mq, req_time, req_complete_at, requestor_type, result_code, error_message, created_by, created_date, inactive, requestor_id, api_verb, last_sync_server_time, last_sync_client_time, request_message, objectname, srvr_proc_dtls) VALUES(nextval('api_log_api_log_id_seq'), '".$mq."', '".$req_time."', '".$timenow."','".$requestortype."', '".$result_code."', '{$error_msg}', $usrid, '".$timenow."', '0', '".$requestorid."', '".$verb."', '".$timenow."', '".$clienttime."', '{$request_msg}','$objectname','" . "Run: $run_id; PID: $my_pid" . "')";
	
	$apiLogSqlRes = @pg_query($conn_db_tennant, $apiLogSql);		
	@pg_query($conn_db_tennant, "COMMIT");

	if ($close_connection == 1) {
		@pg_close($conn_db_tennant);
	}
	
	//print soap results
	printSoapResults($soapresult);
}

//prints result
function printSoapResults($soapresult) {
	global $mq, $requestortype, $requestorid, $clienttime, $verb;
?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header>
      <soap:apiHeader>
      		<?php if($mq != "") { ?><soap:sessionid><?php echo $mq; ?></soap:sessionid><?php } ?>
       	<soap:requestortype><?php echo $requestortype; ?></soap:requestortype>
		<soap:requestorid><?php echo $requestorid; ?></soap:requestorid>
        <soap:verb><?php echo $verb; ?></soap:verb>
        <soap:clienttime><?php if($clienttime != "1970-01-01 00:00:00") { echo $clienttime; } ?></soap:clienttime>
      </soap:apiHeader>
    </soapenv:Header>
    <soapenv:Body>
    	<result>
    		<?php echo $soapresult; ?>
    	</result>
    </soapenv:Body>
</soapenv:Envelope>
<?php
}

//writes entry in api_log table
function synclogResult($conn_db_tennant, $soapresult) {
	global $mq, $requestortype, $requestorid, $clienttime, $objectname, $verb, $req_time, $usrid, $error, $synclist, $lastsynctime, $returnfields, $objectname, $api_log_id, $soaprequsetxml, $syncListError, $orgid, $conn_string_master, $conn_string_tennant, $run_id, $my_pid;	
	
	$timenow = date('Y-m-d H:i:s');
	if($clienttime == "") { $clienttime = "1970-01-01 00:00:00"; }

	/*  Changed to writing in Tenant table instead of Master   - Kishore, 26 Jul 2013  */
	/* Check if the tenant database connection is valid - i.e. not null; if not valid, open a connection to close it later  */
	$close_connection = 0;
	if (is_null($conn_db_tennant)) {
		$conn_db_tennant = @pg_connect($conn_string_tennant);
		$close_connection = 1;
		writeLogFile ("logR00081: synclogResult", "Opened a new connection to the tenant database:", "$conn_string_tennant", "", "", "");
	}
	 
	//log entry in api_log table
	if($api_log_id) {
		if($error == 0) {
			$result_code = 'Ok';		
		}
		if($error == 1) {
			$result_code = 'Error';		
		}
		if($error == 2) {
			$result_code = 'Info';		
		}
		
		$error_msg = "Client-to-Server ".pg_escape_string($soapresult);
		if($syncListError == 1) {
			$synclist = pg_escape_string($synclist);
			$error_msg .= "Server-to-Client ".$synclist; 
		}

		$apiLogSQl = "UPDATE api_log SET req_complete_at = '$timenow', result_code = '$result_code', error_message = '{$error_msg}', created_by = $usrid, modified_by = $usrid, modified_date = '$timenow', last_sync_server_time = '$timenow', orgname = $orgid WHERE api_log_id = $api_log_id";

		$apiLogSQLQuery = @pg_query($conn_db_tennant, $apiLogSQl);
		if ($apiLogSQLQuery === FALSE) {
			$pgerror = @pg_last_error();
			write_debug ("lR0087: synclogResult: Failed SQL: $apiLogSQl; Error: $pgerror");
		}
		@pg_query($conn_db_tennant, "COMMIT");	
		
		//print soap results
		if($verb == "sync") {
			syncprintSoapResults($soapresult);			
		} else {
			createRupdateprintSoapResults($soapresult);			
		}
	} else {
		$xml_len = strlen($soaprequsetxml);
		if ($xml_len > 500000) {
			$request_msg = "Request string too long to store - more than 500,000 bytes";
		} else {
			$request_msg = pg_escape_string($soaprequsetxml);
		}
		$apiLogSql = "INSERT INTO api_log (api_log_id, req_mq, req_time, requestor_type, created_by, created_date, inactive, requestor_id, api_verb, last_sync_client_time, objectname, request_message, srvr_proc_dtls) VALUES(nextval('api_log_api_log_id_seq'), '".$mq."', '".$req_time."', '".$requestortype."', null, '".$timenow."', '0', '".$requestorid."', '".$verb."', '".$clienttime."', '".$objectname."', '{$request_msg}','" . "Run: $run_id; PID: $my_pid" . "') RETURNING api_log_id";

		write_debug ("logR00119: synclogResult", "API INSERT SQL", "$apiLogSql", "", "", "");
		// writeLogFile ("logR00119: synclogResult", "API INSERT SQL", "$apiLogSql", "", "", "");

		$apiLogSqlRes = @pg_query($conn_db_tennant, $apiLogSql);		
		if($apiLogSqlRes === FALSE) {
			$pgerror = @pg_last_error();
			$api_log_id = "";
			write_debug ("logR00132: synclogResult: Failed SQL: $apiLogSql; Error: $pgerror", "", "", "", "", "");
			writeLogFile ("logR00133: synclogResult: Failed SQL: $apiLogSql; Error: $pgerror", "", "", "", "", "");
		} else {
			$get_api_rows = @pg_num_rows($apiLogSqlRes);
			if($get_api_rows > 0) {
				@pg_query($conn_db_tennant, "COMMIT");	
				$select_row = pg_fetch_row($apiLogSqlRes);
				$api_log_id = $select_row[0];
			} else {
				write_debug ("logR00141: synclogResult: API INSERT returned $get_api_rows rows: $apiLogSql", "", "", "", "", "");
				writeLogFile ("logR00142: synclogResult: API INSERT returned $get_api_rows rows: $apiLogSql", "", "", "", "", "");
			}
		}	
	}

	if ($close_connection == 1) {
		@pg_close($conn_db_tennant);
	}

}

//prints result
function createRupdateprintSoapResults($soapresult) {
	global $mq, $requestortype, $requestorid, $clienttime, $objectname, $synclist, $lastsynctime, $returnfields, $verb;
?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header>
      <soap:apiHeader>
      	<soap:sessionid><?php echo $mq; ?></soap:sessionid>
       	<soap:requestortype><?php echo $requestortype; ?></soap:requestortype>
		<soap:requestorid><?php echo $requestorid; ?></soap:requestorid>
        <soap:objectname><?php echo $objectname; ?></soap:objectname>     
        <soap:verb><?php echo $verb; ?></soap:verb>
      </soap:apiHeader>
    </soapenv:Header>
    <soapenv:Body>
    	<result>
    		<?php echo $soapresult; ?>
    	</result>            
    </soapenv:Body>
</soapenv:Envelope>
<?php
}

function syncprintSoapResults($soapresult) {
	global $mq, $requestortype, $requestorid, $clienttime, $objectname, $synclist, $lastsynctime, $returnfields, $verb, $returnheaderfields, $returndetailfields;
?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header>
      <soap:apiHeader>
      	<soap:sessionid><?php echo $mq; ?></soap:sessionid>
       	<soap:requestortype><?php echo $requestortype; ?></soap:requestortype>
		<soap:requestorid><?php echo $requestorid; ?></soap:requestorid>
        <soap:objectname><?php echo $objectname; ?></soap:objectname>
        <soap:verb><?php echo $verb; ?></soap:verb>
        <soap:lastsynctime><?php echo $lastsynctime; ?></soap:lastsynctime>
        <soap:clienttime><?php echo $clienttime; ?></soap:clienttime>
	    <?php if($returnfields != "") { ?><soap:returnfields><?php echo $returnfields; ?></soap:returnfields><?php } ?>  
		<?php if($returnheaderfields != "") { ?><soap:returnheaderfields><?php echo $returnheaderfields; ?></soap:returnheaderfields><?php } ?>
		<?php if($returndetailfields != "") { ?><soap:returndetailfields><?php echo $returndetailfields; ?></soap:returndetailfields><?php } ?>
      </soap:apiHeader>
    </soapenv:Header>
    <soapenv:Body>
    	<result>
    		<?php echo $soapresult; ?>
    	</result>
    	<sync>
        	<?php echo $synclist; ?>
        </sync>
    </soapenv:Body>
</soapenv:Envelope>
<?php
}
?>