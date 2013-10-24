<?php

$serverURL = "http://data.impelcrm.in";

//soaprequest XML
function xml_encode( $requestDataArray, $indent = false, $i) {
    if ( !$i ) {
        $soapRequestXML = '<soaprequest>' . ( $indent ? "\r\n" : '' );
    } else {
        $soapRequestXML = '';   
	}

    foreach ( $requestDataArray as $k => $v ) {
        $soapRequestXML .= ( $indent ? str_repeat( "\t", $i ) : '' ) . '<' . htmlentities( $k );

        if($v == "") {
            $soapRequestXML .= ' />';
        } else {
            $soapRequestXML .= '>';
            if ( is_array( $v ) ) {		
                $soapRequestXML .= ( $indent ? "\r\n" : '' ) . xml_encode( $v, $indent, ($i + 1) ) . ( $indent ? str_repeat("\t", $i) : '' );
            } else if( is_object( $v ) ) {
                $soapRequestXML .= ( $indent ? "\r\n" : '' ) . xml_encode( json_decode( json_encode( $v ), true ), $indent, ($i + 1)) . ($indent ? str_repeat("\t", $i) : '');
            } else {
                $soapRequestXML .= htmlentities( $v );
            }
            $soapRequestXML .= '</'.htmlentities( $k ).'>';
        }

        $soapRequestXML .= ($indent ? "\r\n" : '');
    }

    if ( !$i ) {
        $soapRequestXML .= '</soaprequest>';
    }

    return $soapRequestXML;
}

//stdclass objects to array
function object2array($object) {
	if (is_object($object) || is_array($object)) {
		foreach ($object as $key => $value) {
			// echo "Obj Key " . $key . ", Obj value " . $value . "\n";
			$array[$key] = object2array($value);
		}
	} else {
		$array = $object;
	}
	return $array;
}

function parseToXML($htmlStr) 
{ 
   $xmlStr=str_replace('<','&lt;',$htmlStr); 
   $xmlStr=str_replace('>','&gt;',$xmlStr); 
   $xmlStr=str_replace('"','&quot;',$xmlStr); 
   $xmlStr=str_replace("'",'&apos;',$xmlStr); 
   $xmlStr=str_replace("&",'&amp;',$xmlStr); 
   $temp_xml = $xmlStr;
   $xmlStr=preg_replace('/[^a-zA-Z0-9_\(\) ~!@#$%^&*_+-=;:?{}\[\]\.]/s', '', $xmlStr);
   // write_debug ("parseToXML: Given $temp_xml, got $xmlStr");

   return $xmlStr; 
} 

//writes result
function soapResult($soapresult) {
	global $mq, $requestortype, $requestorid, $objectname;
	if ($soapresult == "") {
		$soapresult = "No error set by calling function";
	}

?>
<soapenv:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header>
      <soap:apiHeader>      		
         	<soap:sessionid><?php echo $mq; ?></soap:sessionid>            
        	<soap:requestorType><?php echo $requestortype; ?></soap:requestorType>
			<soap:requestorId><?php echo $requestorid; ?></soap:requestorId>
            <?php if($objectname) { ?>
       		<soap:objectname><?php echo $objectname; ?></soap:objectname>
            <?php } ?>
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

function New_Ident() { 
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

//this function will get all validate mq from UDM and returns userid and orgid (This is used only for loaddata)
function sessionValidate($mq) {
 	
 	
	global $usrid, $orgid, $srvLoginName, $srvurl, $srvusr, $srvpwd, $srvdbn, $errorSession, $default_territory,$csv_territory,$taluka_csv,$actualUserMq, $userEmail, $userDisplayName,$requestorid;
	$requestorid='kishore@impelcrm.in';
	//$pk4mq = "hLmoEySx1QcJJoNdRbX7fg%3D%3D";
	//$pk4mq = "VM9C2QWgDIzUWYYbb%2BhFwGo3evwcKhFB";	
	$curl = curl_init();
    // curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$requestorid);
    curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/impelMobile/custom/giveMQForGivenLogin.html?loginName=".$requestorid);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);	
	
    $enttsResult1 = curl_exec ($curl);
    
	if($enttsResult1 == "") {
		soapResult($errorSession);
		exit;
	} else {
		$usermq = $enttsResult1;
		$curl = curl_init();
		// curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/readServers.html?sessionId=".$mq."&mq=".$usermq);
		curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.11:9090/atCRM/custom/soapAPI/readServers.html?sessionId=".$mq."&mq=".$usermq);
		curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
		curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
		curl_setopt ($curl, CURLOPT_HEADER, false);	
		
		$enttsResult = curl_exec ($curl);
		curl_close ($curl);	

		if($enttsResult == "") {
			soapResult($errorSession);
			exit;
		}	
		$json_entts = json_decode($enttsResult,true);
		$usrid = $json_entts[0]["usrid"]; 	
		$orgid = $json_entts[0]["orgid"]; 
		$srvLoginName = $json_entts[0]["LoginName"]; 		
		$default_territory = $json_entts[0]["default_territory"];
		$csv_territory = $json_entts[0]["csv_territory"];
		$taluka_csv = $json_entts[0]["taluka_csv"];
		$actualUserMq = $json_entts[0]["mq"]; 
		$userDisplayName = $json_entts[0]["displayName"]; 
		$userEmail = $json_entts[0]["userEmail"]; 
	}	
}

//this function will get all the entts from UDM and stores it in a array(This is used only for loaddata)
function getAllEntitiesForUserMq($mq) {
	global $stdentities, $errorSession, $actualUserMq, $usrid, $orgid;
	$curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/trulyApplicableEntities.json?mq=".$actualUserMq."&usrid=".$usrid."&orgid=".$orgid);
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/trulyApplicableEntities.json?mq=".$actualUserMq."&usrid=".$usrid."&orgid=".$orgid);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);

    $enttsResult = curl_exec ($curl);
	curl_close ($curl);

	if($enttsResult == "") {
		soapResult($errorSession);
		exit;
	}	
	$json_entts = json_decode($enttsResult,true);
	$stdentities = array();
	$stdentities = explode('$', $json_entts[0]["entity"]); 	
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name is_custom_object custom_object_for_entt
}

//this function will get all the entt cols from UDM and stores it in a array(This is used only for loaddata)
function getAllEnttColsForUserMq($mq) {
	global $stdenttCols, $errorSession, $actualUserMq, $usrid, $orgid;
    $curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/trulyApplicableColumns.json?mq=".$actualUserMq."&usrid=".$usrid."&orgid=".$orgid);
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/trulyApplicableColumns.json?mq=".$actualUserMq."&usrid=".$usrid."&orgid=".$orgid);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);

    $stdenttColsResult = curl_exec ($curl);
    curl_close ($curl);
	if($stdenttColsResult == "") {
		soapResult($errorSession);
		exit;
	}	
	$json_stdenttCols = json_decode($stdenttColsResult,true);
	$stdenttCols = array();
	$stdenttCols = explode('$', $json_stdenttCols[0]["entityCols"]); 	
	//print_r($stdenttCols);
	//pattern:-  entt_column_id entt_column derefValue entt_ref_to desc_name field_type entt_name is_udef is_extended_attr api_field_name
	// write_debug ("soapFunctions", "getAllEnttColsForUserMq", "Entity Columns: $json_stdenttCols[0]['entityCols']", "Original URL Result: $stdenttColsResult", "", "");
}

//this function will get all validate mq from UDM and returns userid and orgid
function validateSession($mq) {
	global $usrid, $orgid, $srvLoginName, $srvurl, $srvusr, $srvpwd, $srvdbn, $errorSession, $default_territory,$csv_territory,$taluka_csv;
	$curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/validateMq.json");
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/validateMq.json");
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_COOKIE, 'zeroCode.atCRM=' .$mq. '; path=/' );
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_COOKIESESSION, false);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);
	
    $enttsResult = curl_exec ($curl);
	$curl_err = curl_error($curl);
    curl_close ($curl);	
	// echo "Validating mq " . $mq . ", error " . $curl_err . "\n";
	if($enttsResult == "") {
		if ($curl_err == "") {$curr_err = "URL returned NULL; submitted session ID is NULL or invalid";}
		else {$curr_err = $curl_err;}
		if ($errorSession == "") { $errorSession = "validateMq JSON failed - " . $curr_err;}
		soapResult($errorSession);
		exit;
	}
	$json_entts = json_decode($enttsResult,true);
	$usrid = $json_entts[0]["usrid"]; 	
	$orgid = $json_entts[0]["orgid"]; 
	$srvLoginName = $json_entts[0]["LoginName"]; 		
	$default_territory = $json_entts[0]["default_territory"];
	$csv_territory = $json_entts[0]["csv_territory"];
	$taluka_csv = $json_entts[0]["taluka_csv"];
}

//this function will get all the entts from UDM and stores it in a array
function getAllEntities($mq)
{
	global $stdentities, $errorSession;
	$curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/trulyApplicableEntities.json");
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/trulyApplicableEntities.json");
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_COOKIE, 'zeroCode.atCRM=' .$mq. '; path=/' );
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_COOKIESESSION, false);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);

    $enttsResult = curl_exec ($curl);
    curl_close ($curl);
	if($enttsResult == "")
	{
		soapResult($errorSession);
		exit;
	}	
	$json_entts = json_decode($enttsResult,true);
	$stdentities = array();
	$stdentities = explode('$', $json_entts[0]["entity"]); 	
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name is_custom_object custom_object_for_entt
}

//this function will get all the entt cols from UDM and stores it in a array
function getAllEnttCols($mq)
{
	global $stdenttCols, $errorSession;
    $curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/trulyApplicableColumns.json");
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/trulyApplicableColumns.json");
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_COOKIE, 'zeroCode.atCRM=' .$mq. '; path=/' );
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_COOKIESESSION, false);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);

    $stdenttColsResult = curl_exec ($curl);
    curl_close ($curl);
	if($stdenttColsResult == "") {
		soapResult($errorSession);
		exit;
	}	
	$json_stdenttCols = json_decode($stdenttColsResult,true);
	$stdenttCols = array();
	$stdenttCols = explode('$', $json_stdenttCols[0]["entityCols"]);
	// $my_std_entt_cols = implode(",", $stdenttCols);
	// print_r("Std Entt Cols: " . $my_std_entt_cols);
	//pattern:-  entt_column_id entt_column derefValue entt_ref_to desc_name field_type entt_name is_udef is_extended_attr api_field_name
}

//this function will get all the entt cols from UDM and stores it in a array
function getEnttCols($mq, $entt)
{
	global $stdenttCols, $errorSession;
	$entt = getExactEntityName($entt);
    $curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/soapAPI/trulyApplicableColumns.json?enttNames=".$entt);
    //curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/soapAPI/trulyApplicableColumns.json?enttNames=".$entt);
    curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_COOKIE, 'zeroCode.atCRM=' .$mq. '; path=/' );
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_COOKIESESSION, false);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_HEADER, false);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);

    $stdenttColsResult = curl_exec ($curl);
    curl_close ($curl);
	if($stdenttColsResult == "")
	{
		soapResult($errorSession);
		exit;
	}	
	$json_stdenttCols = json_decode($stdenttColsResult,true);
	$stdenttCols = array();
	$stdenttCols = explode('$', $json_stdenttCols[0]["entityCols"]); 	
	//print_r($stdenttCols);
	//pattern:-  entt_column_id entt_column derefValue entt_ref_to desc_name field_type entt_name is_udef is_extended_attr api_field_name
}

function getEntityName($enttName) {
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$e_name = "";
	foreach ($stdentities as $key => $value) {
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[3]) == strtolower($enttName) || strtolower($split_stdentities[1]) == strtolower($enttName)) {
			$e_name = strtolower($split_stdentities[1]);
			break;
		}
	}		
	if($e_name == "") {
		write_debug ("getEntityName: Was passed $enttName; not found in " . serialize ($stdentities), "", "", "", "", "");
		return ;	
	} else {
		return $e_name;
	}
}

function validateEntity($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$is_valid_entt = 0;
	foreach ($stdentities as $key => $value) {
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName)) {
			$is_valid_entt = 1;
			break;
		}
	}		
	if($is_valid_entt == 0) {
		return 0;	
	} else {
		return 1;
	}
}

//get exact entt name (case sensitive)
function getExactEntityName($enttName) {
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$exact_ennt_name = 0;
	foreach ($stdentities as $key => $value) {
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName)) {
			$exact_ennt_name = $split_stdentities[1];
			break;
		}				
	}		
	if($exact_ennt_name == 0) {
		return $exact_ennt_name;	
	} else {
		return $exact_ennt_name;
	}
}

//get exact entt id (case sensitive)
function getExactEntityId($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$exact_ennt_id = 0;
	foreach ($stdentities as $key => $value) {
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName)) {
			$exact_ennt_id = $split_stdentities[0];
			break;
		}				
	}		
	if($exact_ennt_id == 0)
	{
		return $exact_ennt_id;	
	}
	else
	{
		return $exact_ennt_id;
	}
}

//get exact entt name (case sensitive)
function getExactEntityDescName($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$exact_ennt_name = 0;
	foreach ($stdentities as $key => $value) 
	{
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName))
		{
			$exact_ennt_name = $split_stdentities[3];
			break;
		}				
	}		
	if($exact_ennt_name == 0)
	{
		return $exact_ennt_name;	
	}
	else
	{
		return $exact_ennt_name;
	}
}

//get the cust object for entt
function customObjetForEntity($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$cust_obj_for_entt = "";
	foreach ($stdentities as $key => $value) 
	{
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName))
		{
			if($split_stdentities[5])
			{
				foreach ($stdentities as $keyt => $valuet) 
				{
					$split_stdentities_t = explode('#', $valuet);
					if($split_stdentities_t[0] == $split_stdentities[5])
					{
						$cust_obj_for_entt = strtolower($split_stdentities_t[1]);
						break;
					}
				}
				if($cust_obj_for_entt)
				{
					break;
				}
			}			
		}				
	}		
	if($cust_obj_for_entt == "")
	{
		return "";	
	}
	else
	{
		return $cust_obj_for_entt;
	}
}

//chks whtr the entity is custom object
function isCustomObject($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$is_custom_obj = 0;
	foreach ($stdentities as $key => $value) 
	{
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName))
		{
			if($split_stdentities[4] == 1)
			{
				$is_custom_obj = 1;
				break;
			}
			
		}				
	}		
	if($is_custom_obj == 0)
	{
		return 0;	
	}
	else
	{
		return 1;
	}	
}

//chks whtr the entity is custom object
function isRefrenceObject($enttName)
{
	global $stdentities;
	//print_r($stdentities);
	//pattern:-  EntityList_Id  EntityName inactive  desc_name
	$is_custom_obj = 0;
	foreach ($stdentities as $key => $value) {
		$split_stdentities = explode('#', $value); 
		if(strtolower($split_stdentities[1]) == strtolower($enttName)) {
			if($split_stdentities[6] == 'Reference') {
				$is_ref_obj = 1;
				break;
			}
			
		}				
	}		
	if(isset($is_ref_obj)) {
		if ($is_ref_obj === 0) {
			return 0;
		}
	} else {
		return 1;
	}	
}

function getPrikey($enttName)
{
	global $dbase_cols;
	$enttName = strtolower($enttName);
	$pkeyresult = "";
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "pk")	{
			$pkeyresult = $split_dbaseColsEntt[1];
		}	
	}
	//returns primary key for entity
	return $pkeyresult;
}

function getbaseFieldsNValues($enttName, $entitycols, $is_update) {
	global $stdenttCols;
	//print_r($stdenttCols);
	$enttName = strtolower($enttName);
	$resultArray = array();
	
	foreach ($entitycols as $keyh => $valueh) {
		if($valueh != "") {
			foreach ($stdenttCols as $keystd => $valuestd) {
				$split_stdenttCols = explode('#', $valuestd); 	
				//$split_stdenttCols pattern:-  0:entt_column_id 1:entt_column 2:derefValue 3:entt_ref_to 4:desc_name 5:field_type 6:entt_name 7:is_udef 8:is_extended_attr 9:api_field_name
				//4566749#for_branch#Account#branch#Branch##Account#0#0#account_branch
				//0			1			2		3		4		6	7		9
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName) {
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($keyh) && $split_stdenttCols[3] == "" && $split_stdenttCols[8] != 1 && $split_stdenttCols[5] != 'virtual_img' && $split_stdenttCols[5] != 'virtual') {
						if($is_update == 1 && strtolower($split_stdenttCols[1]) == 'guid') {
							//this is to not include guid in update statement cols
						} else {
							//base column
							$exactColName = strtolower($split_stdenttCols[1]);
							$resultArray[$exactColName] = ($valueh == "" || $valueh == 'null' || $valueh == 'NULL')?'NULL':("'".pg_escape_string($valueh)."'");	
						}
					}
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

//for sync purpose
function getbaseFields($enttName, $entitycols) {
	global $stdenttCols,$returnErrorFields;
	$enttName = strtolower($enttName);
	$resultArray = array();
	$fields_in_err = '';
	
	foreach ($entitycols as $keyh => $valueh) {
		$valueh = trim($valueh);
		if($valueh != "") {
			foreach ($stdenttCols as $keystd => $valuestd) {
				$split_stdenttCols = explode('#', $valuestd);
				//echo "Split entt: " . $split_stdenttCols[2] . ", " . $enttName . ", Col: " . $split_stdenttCols[1] . "\n";
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName) {
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($valueh) && $split_stdenttCols[8] != 1 && $split_stdenttCols[5] != 'virtual' && $split_stdenttCols[5] != 'virtual_img') {
							$exactColName = strtolower($split_stdenttCols[1]);
							$resultArray[$valueh] = $exactColName;
					} else {
						$fields_in_err = $fields_in_err . "," . $split_stdenttCols[1];
					}
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

function getudefdataFieldsNValues($enttName, $entitycols)
{
	global $stdenttCols;
	$enttName = strtolower($enttName);
	$resultArray = array();
	
	foreach ($entitycols as $keyh => $valueh) 
	{
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($keyh) && $split_stdenttCols[8] == 1 && $split_stdenttCols[3] == "" && $split_stdenttCols[5] != 'virtual_img' && $split_stdenttCols[5] != 'virtual')
					{
						//udef column
						$exactColName = strtolower($split_stdenttCols[1]);
						$resultArray[$exactColName] = ($valueh == "" || $valueh == 'null' || $valueh == 'NULL')?'NULL':("'".pg_escape_string($valueh)."'");															
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

//for sync purpose
function getudefFields($enttName, $entitycols)
{
	global $stdenttCols,$returnErrorFields;
	$enttName = strtolower($enttName);
	$resultArray = array();
	
	foreach ($entitycols as $keyh => $valueh) 
	{
		$valueh = trim($valueh);
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($valueh))
					{
						if($split_stdenttCols[8] == 1 && $split_stdenttCols[5] != 'virtual' && $split_stdenttCols[5] != 'virtual_img')
						{
							//udef column
							$exactColName = strtolower($split_stdenttCols[1]);
							$resultArray[$valueh] = $exactColName;													
						}						
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}
//for sync purpose
function getvirtualFields($enttName, $entitycols)
{
	global $stdenttCols,$returnErrorFields;
	$enttName = strtolower($enttName);
	$resultArray = array();

	foreach ($entitycols as $keyh => $valueh) 
	{
		$valueh = trim($valueh);
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($valueh))
					{
						if($split_stdenttCols[5] == 'virtual')
						{
							//udef column
							$exactColName = strtolower($split_stdenttCols[1]);
							$resultArray[$valueh] = $exactColName;													
						}						
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}
//for sync purpose
function getvirtualImgFields($enttName, $entitycols)
{
	global $stdenttCols,$returnErrorFields;
	$enttName = strtolower($enttName);
	$resultArray = array();
	$i = 0;
	foreach ($entitycols as $keyh => $valueh) 
	{
		$valueh = trim($valueh);
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($valueh))
					{
						if($split_stdenttCols[5] == 'virtual_img')
						{
							$resultArray[$i] = $valueh;		
							$i++;
						}						
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

function getdefaultFieldsNValues($enttName, $usrid, $orgid, $defaultfkeyval, $dataSource,$default_territory)
{
	global $dbase_cols;
	$enttName = strtolower($enttName);
	$position = stripos($enttName, "_");
	if ($position === false) 
	{
		$rdreasonstr = trim($enttName);			
	}
	else
	{
		$rdreasonstrarray = explode("_", $enttName);
		$rdreasonstr = $rdreasonstrarray[0];			
	}
	$resultArray = array();
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "pk")
		{
			$nextval = "nextval('seq_".$enttName."')";
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $nextval;	
			$pkey = $split_dbaseColsEntt[1];
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "cby")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $usrid;	
		}
		if(strtolower($split_dbaseColsEntt[0]) == "cdate")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".date('Y-m-d H:i:s')."'";
		}
		if(strtolower($split_dbaseColsEntt[0]) == "orgname")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $orgid;
		}
		if(strtolower($split_dbaseColsEntt[0]) == "inactive")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'0'";	
		}			
		if(strtolower($split_dbaseColsEntt[0]) == "defaultfk")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $defaultfkeyval;	
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "datasrc")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".$dataSource."'";
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "rdate")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".date('Y-m-d H:i:s')."'";
		}
		if(strtolower($split_dbaseColsEntt[0]) == "rdreason")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".ucfirst($rdreasonstr)." Created from Tablet'";	
		}
		if(strtolower($split_dbaseColsEntt[0]) == "ident")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$ident = New_Ident();
			$resultArray[$exactdeafultColName] = "'".$ident."'";
		}
		if(strtolower($split_dbaseColsEntt[0]) == "terr")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $default_territory;
		}
	}
	//returns array of default fields and values 
	return $resultArray;
}

function getGuidWhereClause($enttName, $entitycols)
{
	global $stdenttCols;
	$enttName = strtolower($enttName);
	$resultArray = array();
	//print_r($stdenttCols);
	foreach ($entitycols as $keyh => $valueh) 
	{
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($keyh) && $split_stdenttCols[1] == "guid")
					{
						//base column
						$exactColName = strtolower($split_stdenttCols[1]);
						$resultArray[$exactColName] = ($valueh == "" || $valueh == 'null' || $valueh == 'NULL')?'NULL':("'".pg_escape_string($valueh)."'");															
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

function getExtGuidWhereClause($enttName, $entitycols)
{
	global $stdenttCols;
	$enttName = strtolower($enttName);
	$resultArray = array();
	
	foreach ($entitycols as $keyh => $valueh) 
	{
		if($valueh != "")
		{
			foreach ($stdenttCols as $keystd => $valuestd) 
			{
				$split_stdenttCols = explode('#', $valuestd); 	
				//compare entity from stdenttCols
				if(strtolower($split_stdenttCols[2]) == $enttName)
				{
					//compare desc_name and check for base column of entity
					if(strtolower($split_stdenttCols[9]) == strtolower($keyh) && $split_stdenttCols[1] == "external_guid")
					{
						//base column
						$exactColName = strtolower($split_stdenttCols[1]);
						$resultArray[$exactColName] = ($valueh == "" || $valueh == 'null' || $valueh == 'NULL')?'NULL':("'".pg_escape_string($valueh)."'");															
					}				
				}
			}
		}
	}
	//returns array of base fields and values 
	return $resultArray;
}

function getdefaultFNVForWhereClause($enttName, $usrid, $orgid, $defaultfkeyval, $dataSource) {
	global $dbase_cols;
	$enttName = strtolower($enttName);
	$position = stripos($enttName, "_");
	if ($position === false) {
		$rdreasonstr = trim($enttName);			
	} else {
		$rdreasonstrarray = explode("_", $enttName);
		$rdreasonstr = $rdreasonstrarray[0];			
	}
	$resultArray = array();
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if($defaultfkeyval) {
			if(strtolower($split_dbaseColsEntt[0]) == "defaultfk") {
				$exactdeafultColName = $split_dbaseColsEntt[1];
				$resultArray[$exactdeafultColName] = $defaultfkeyval;	
			}
		}
		if(strtolower($split_dbaseColsEntt[0]) == "orgname") {
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $orgid;
		}
		/*if(strtolower($split_dbaseColsEntt[0]) == "inactive")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'0'";	
		}*/					
	}
	//returns array of default fields and values 
	// write_debug ("soapFunctions", "getdefaultFNVForWhereClause", "Returning: " . serialize($resultArray) . " from " . serialize($dbase_cols_for_entt), "", "", "");						
	return $resultArray;
}

function getdefaultFNVForUpdate($enttName, $usrid, $orgid, $defaultfkeyval, $dataSource)
{
	global $dbase_cols;
	$enttName = strtolower($enttName);
	$position = stripos($enttName, "_");
	if ($position === false) 
	{
		$rdreasonstr = trim($enttName);			
	}
	else
	{
		$rdreasonstrarray = explode("_", $enttName);
		$rdreasonstr = $rdreasonstrarray[0];			
	}
	$resultArray = array();
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mby")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $usrid;
		}
		if(strtolower($split_dbaseColsEntt[0]) == "mdate")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".date('Y-m-d H:i:s')."'";
		}						
		if(strtolower($split_dbaseColsEntt[0]) == "rdate")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".date('Y-m-d H:i:s')."'";
		}
		if(strtolower($split_dbaseColsEntt[0]) == "rdreason")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".ucfirst($rdreasonstr)." Updated from Tablet'";	
		}		
	}
	//returns array of default fields and values 
	return $resultArray;
}

function getModDateFieldNValue($enttName, $entitycols)
{
	global $dbase_cols;
	global $stdenttCols;
	$resultArray = array();	
	$moddatecolname = "";
	$enttName = strtolower($enttName);
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mdate")
		{
			$moddatecolname = $split_dbaseColsEntt[1];			
		}						
	}
	if($moddatecolname)
	{
		foreach ($entitycols as $keyh => $valueh) 
		{
			if($valueh != "")
			{
				foreach ($stdenttCols as $keystd => $valuestd) 
				{
					$split_stdenttCols = explode('#', $valuestd); 	
					//compare entity from stdenttCols
					if(strtolower($split_stdenttCols[2]) == $enttName)
					{
						//compare entt_column for the mdate column
						if(strtolower($split_stdenttCols[1]) == $moddatecolname  && $split_stdenttCols[3] == "" && strtolower($split_stdenttCols[9]) == strtolower($keyh))
						{
							//base column
							$exactColName = strtolower($split_stdenttCols[1]);
							$resultArray[$exactColName] = ($valueh == "" || $valueh == 'null' || $valueh == 'NULL')?'NULL':("'".pg_escape_string($valueh)."'");								
						}				
					}
				}
			}
		}		
	}
	//returns array of base fields and values 
	return $resultArray;	
}

function getfkFieldsNValues($enttName, $entitycols, $usrid, $orgid, $conn_db_tennant) {
	global $ms_cols, $stdenttCols, $dbase_cols, $fieldErrors, $headerError, $result, $errorHeader, $errorHeaderField, $orgid;
	$msCols = array();
	$enttName = strtolower($enttName);
	$msCols = $ms_cols[$enttName];	
	$resultArray = array();

	//print_r($stdenttCols);
	//$split_stdenttCols pattern:-  0:entt_column_id 1:entt_column 2:derefValue 3:entt_ref_to 4:desc_name 5:field_type 6:entt_name 7:is_udef 8:is_extended_attr 9:api_field_name
	//4566749#for_branch#Account#branch#Branch##Account#0#0#account_branch
	//0			1			2		3		4		6	7		9
	
	// write_debug ("sF01041: getfkFieldsNValues (during Sync Submission, not Sync Retrieval): Entt: $enttName; Cols: " . print_r($entitycols, true), "", "", "", "", "");
	
	foreach ($entitycols as $keyh => $valueh) {
		foreach ($stdenttCols as $keystd => $valuestd) {
			$split_stdenttCols = explode('#', $valuestd);
			//compare entity from stdenttCols
			if(strtolower($split_stdenttCols[2]) == $enttName) {
				//compare desc_name and check for base column of entity				
				if(strtolower($split_stdenttCols[9]) == strtolower($keyh) && $split_stdenttCols[3] && $split_stdenttCols[5] != 'virtual' && $split_stdenttCols[5] != 'virtual_img') {
					// write_debug ("sF01038: getfkFieldsNValues: Not pickList $split_stdenttCols[3]", "", "", "", "", "");
					if($split_stdenttCols[5] == 'pickList') {
						$exactfkColName = strtolower($split_stdenttCols[1]);
						$resultArray["fields"][$exactfkColName] = "'".$valueh."'";
					} else {
                        // write_debug ("sF01043: getfkFieldsNValues: Not pickList", "", "", "", "", ""); 
						//check for the virtual entt_column record for the fk.
						$virtualkeyh = $keyh."_guid";
						$virtualkeyhexistswithvalue = 0;
						if (array_key_exists($virtualkeyh, $entitycols)) {
							//virtual entt_column record for the fk exists
							if($entitycols[$virtualkeyh] != "" && !is_null($entitycols[$virtualkeyh])) {
								$virtualkeyhexistswithvalue = 1;
								$virtualvalueh = $entitycols[$virtualkeyh];
							}
						}
						//if virtual entt_column record for the fk exists with value
						if ($virtualkeyhexistswithvalue == 1) {
							//query entt_ref_to table using guid
							//to get orgname for where clause
							$dbase_cols_for_enttCondt = $dbase_cols[strtolower($split_stdenttCols[3])];
							$tblmsfield = "";
							$pkfield = "";
							$where = "";
							foreach ($dbase_cols_for_enttCondt as $keydbase => $valuedbase) { 
								$split_dbaseCols = explode('#', $valuedbase);
								if (strtolower($split_stdenttCols[3]) == 'district') {
									$where.="";
								} elseif (strtolower($split_stdenttCols[3]) == 'location_lat_long') {
									$where.="";
								} else {
									if (strtolower($split_dbaseCols[0]) == "orgname") {
										$where.= "AND ".$split_dbaseCols[1]." = ".$orgid;
									}
									if(strtolower($split_dbaseCols[0]) == "inactive") {
										$where.= " AND ".$split_dbaseCols[1]." = '0'";
									}
								}
								if(strtolower($split_dbaseCols[0]) == "pk") {
									$pkfield = $split_dbaseCols[1];
								}
								if(strtolower($split_dbaseCols[0]) == "msfield") {
									$tblmsfield.= $split_dbaseCols[1];
								}
							}						
							//check for udef_fkey
							//echo $keyh;
							$chkudef = "udef_fkey";
							$substring = substr($split_stdenttCols[1], 0, 9);
							if($chkudef == $substring) {
								$dynamicSql = "SELECT ".$pkfield.",".$tblmsfield." FROM ".strtolower($split_stdenttCols[3])." WHERE guid = '".$virtualvalueh."' ".$where." LIMIT 1";
								$resdynamicSql = @pg_query($conn_db_tennant, $dynamicSql);
								if($resdynamicSql === FALSE) {
									//return "";			
									$resultArray["errors"] .= " ".$keyh.",";
								} else {
									$exactfkColName = strtolower($split_stdenttCols[1]);
									$resdynamicSqlrows = @pg_num_rows($resdynamicSql);
									if($resdynamicSqlrows > 0) {							
										$resData = pg_fetch_row($resdynamicSql);
										$fkvalue = $resData[0];
										$fkmsvalue = $resData[1];
										$resultArray["fields"][$exactfkColName] = $fkvalue;
										$str_udef_field = "str_".$exactfkColName;
										$resultArray["fields"][$str_udef_field] = "'".$fkmsvalue."'";		
									} else {
										$fkvalue = 'NULL';
										$fkmsvalue = 'NULL';
										$resultArray["fields"][$exactfkColName] = $fkvalue;
										$str_udef_field = "str_".$exactfkColName;
										$resultArray["fields"][$str_udef_field] = $fkmsvalue;	
									}
								}						
							} else {	
								foreach ($msCols as $keyms => $valuems) {
									$fkvalue = "";
									$split_msCols = explode('#', $valuems); 
									//echo $split_stdenttCols[1];
									//echo $split_msCols[1];
									// write_debug ("sF01125: getfkFieldsNValues: Entt: $enttName; stdEnttCols 1: $split_stdenttCols[1], splitmsCols 1: $split_msCols[1]", "", "", "", "", "");
									if(strtolower($split_stdenttCols[1]) == strtolower($split_msCols[1])) {									
										$dynamicSql = "SELECT ".$split_msCols[3]." FROM ".$split_msCols[2]." WHERE guid = '".$virtualvalueh."' ".$where." LIMIT 1";
										$resdynamicSql = @pg_query($conn_db_tennant, $dynamicSql);
										if($resdynamicSql === FALSE) {
											//return "";
											$pgerror = @pg_last_error();
										    $resultArray["errors"] .= " ".$keyh.",";
										    write_debug ("sF01122: getfkFieldsNValues: Failed SQL: $dynamicSql; Error: $pgerror", "", "", "", "", "");
											$resultArray["errors"] .= " ".$keyh.",";
										} else {
											$exactfkColName = strtolower($split_msCols[1]);
											$resdynamicSqlrows = @pg_num_rows($resdynamicSql);
											if($resdynamicSqlrows > 0) {							
												$resData = pg_fetch_row($resdynamicSql);
												$fkvalue = $resData[0];
												$resultArray["fields"][$exactfkColName] = $fkvalue;					
											} else {
												$fkvalue = 'NULL';
												$resultArray["fields"][$exactfkColName] = $fkvalue;
												write_debug ("sF01134: getfkFieldsNValues: SQL got 0 records: $dynamicSql;", "", "", "", "", "");
											}
										}														
									}
								}
							}//ends
                            // write_debug ("sF01140: getfkFieldsNValues: SQL got 0 records", "", "", "", "", "");
						} else {
							// write_debug ("sF01157: getfkFieldsNValues: NOT virtualkeyexists; valueh: $valueh", "", "", "", "", "");
							if($valueh != "") {
								//query entt_ref_to table using mscol name
								$dbase_cols_for_enttCondt = $dbase_cols[strtolower($split_stdenttCols[3])];
								// write_debug ("sHND01157 | What's in dbase_cols? " . print_r($dbase_cols, true));	
								$tblmsfield = "";
								$pkfield = "";
								$where = "";							
								foreach ($dbase_cols_for_enttCondt as $keydbase => $valuedbase) {
									$split_dbaseCols = explode('#', $valuedbase);
									if(strtolower($split_stdenttCols[3]) == 'district') {
										$where.="";
									} elseif(strtolower($split_stdenttCols[3]) == 'location_lat_long') {
										$where.="";
									} elseif(strtolower($split_stdenttCols[3]) == 'state') {
										$where.="";
									} else {
										if(strtolower($split_dbaseCols[0]) == "orgname") {
											$where.= "AND ".$split_dbaseCols[1]." = ".$orgid;
										} 
										if(strtolower($split_dbaseCols[0]) == "inactive") {
											$where.= " AND ".$split_dbaseCols[1]." = '0'";
										}
									}
									if(strtolower($split_dbaseCols[0]) == "pk") {
										$pkfield = $split_dbaseCols[1];
									}
									if(strtolower($split_dbaseCols[0]) == "msfield") {
										$tblmsfield.= $split_dbaseCols[1];
									}
								}						
								//check for udef_fkey
								//echo $keyh;												
								$chkudef = "udef_fkey";
								$substring = substr($split_stdenttCols[1], 0, 9);
								if($chkudef == $substring) {
									$is_ref_obj = 0;
									$is_ref_obj = isRefrenceObject($split_stdenttCols[3]);
									if($is_ref_obj == 1) {
										$dynamicSql = "SELECT ".$pkfield.",".$tblmsfield." FROM ".strtolower($split_stdenttCols[3])." WHERE (".$tblmsfield." ilike '".$valueh."') ".$where." LIMIT 1";
									} else {
										$dynamicSql = "SELECT ".$pkfield.",".$tblmsfield." FROM ".strtolower($split_stdenttCols[3])." WHERE (guid = '".$valueh."' or ".$tblmsfield." ilike '".$valueh."') ".$where." LIMIT 1";
									}	
									write_debug ("sF01182: getfkFieldsNValues: SQL got 0 records: $dynamicSql;", "", "", "", "", "");
									$resdynamicSql = @pg_query($conn_db_tennant, $dynamicSql);
									if($resdynamicSql === FALSE) {
										$pgerror = @pg_last_error();
										$resultArray["errors"] .= " ".$keyh.",";
										write_debug ("sF01184: getfkFieldsNValues: Failed SQL: $dynamicSql; Error: $pgerror", "", "", "", "", "");
									} else {
										$exactfkColName = strtolower($split_stdenttCols[1]);
										$resdynamicSqlrows = @pg_num_rows($resdynamicSql);
										if($resdynamicSqlrows > 0) {							
											$resData = pg_fetch_row($resdynamicSql);
											$fkvalue = $resData[0];
											$fkmsvalue = $resData[1];
											$resultArray["fields"][$exactfkColName] = $fkvalue;
											$str_udef_field = "str_".$exactfkColName;
											$resultArray["fields"][$str_udef_field] = "'".$fkmsvalue."'";	
										} else {
											$fkvalue = 'NULL';
											$fkmsvalue = 'NULL';
											$resultArray["fields"][$exactfkColName] = $fkvalue;
											$str_udef_field = "str_".$exactfkColName;
											$resultArray["fields"][$str_udef_field] = $fkmsvalue;
										}
									}													
								} else {	
									foreach ($msCols as $keyms => $valuems) {
										$fkvalue = "";
										$split_msCols = explode('#', $valuems);
										// write_debug ("sF01228: getfkFieldsNValues: Entt: $enttName; stdEnttCols 1: $split_stdenttCols[1], splitmsCols 1: $split_msCols[1]", "", "", "", "", "");
										if(strtolower($split_stdenttCols[1]) == strtolower($split_msCols[1])) {
											/*  Upgrade, KM, 30 Jul 2013: read entitylist to get most-significant column of an fkey table, if present  */
											$entt_list_fkey_sql = "select col_most_significant from entitylist where entityname ilike '$split_msCols[2]' and orgname = $orgid and inactive != '1' limit 1";
											write_debug ("sF01227: getfkFieldsNValues: Getting most-sig from entitylist with SQL: $entt_list_fkey_sql", "", "", "", "", "");
											$entt_list_fkey_result = @pg_query($conn_db_tennant, $entt_list_fkey_sql);
											if($entt_list_fkey_result === FALSE) {
												$pgerror = @pg_last_error();
												write_debug ("sF01231: getfkFieldsNValues: EntityList for most-sig failed - SQL: $entt_list_fkey_sql; Error: $pgerror", "", "", "", "", "");
											} else {
												$exactfkColName = strtolower($split_msCols[1]);
												$entt_list_fkey_rows = @pg_num_rows($entt_list_fkey_result);
												$most_sig_col = '';
												if($entt_list_fkey_rows > 0) {
													$most_sig = pg_fetch_row($entt_list_fkey_result);
													$most_sig_col = $most_sig[0];
												}
												write_debug ("sF01240: getfkFieldsNValues: Most Sig from db: $most_sig_col from $entt_list_fkey_rows rows", "", "", "", "", "");
											}
											if ($most_sig_col == '') {
												$most_sig_col = $split_msCols[4];
											}
											$is_ref_obj = 0;
											$is_ref_obj = isRefrenceObject($split_msCols[2]);
											if($is_ref_obj == 1) {
												$dynamicSql = "SELECT $split_msCols[3] FROM $split_msCols[2] WHERE ($most_sig_col ilike '$valueh') $where LIMIT 1";
											} else {
												$dynamicSql = "SELECT $split_msCols[3] FROM $split_msCols[2] WHERE (guid = '$valueh' or $most_sig_col ilike '$valueh') $where LIMIT 1";
											}
											
											/*											}  */
											$resdynamicSql = @pg_query($conn_db_tennant, $dynamicSql);
											if($resdynamicSql === FALSE) {
												$pgerror = @pg_last_error();
												$resultArray["errors"] .= " ".$keyh.",";
												write_debug ("sF01258: getfkFieldsNValues: Failed SQL: $dynamicSql; Error: $pgerror", "", "", "", "", "");
											} else {
												$exactfkColName = strtolower($split_msCols[1]);
												$resdynamicSqlrows = @pg_num_rows($resdynamicSql);
												if($resdynamicSqlrows > 0) {							
													$resData = pg_fetch_row($resdynamicSql);
													$fkvalue = $resData[0];
													$resultArray["fields"][$exactfkColName] = $fkvalue;
												} else {
													$fkvalue = 'NULL';
													$resultArray["fields"][$exactfkColName] = $fkvalue;
													write_debug ("sF01269: getfkFieldsNValues: SQL returned 0 rows: $dynamicSql", "", "", "", "", "");
													$headerError = 1;
													$checkError = $errorHeaderField;
													$checkError = preg_replace('/refField/', $split_msCols[4], $checkError);
													$checkError = preg_replace('/refValue/', $valueh, $checkError);
													$checkError = preg_replace('/refError/', "fSHND01252: Record not found in Impel", $checkError);
													$result .= $checkError;
												}
											}														
										}
									}
								}//ends
							} else {
								$fkvalue = "";
							}
						}			
					}
				}
			}
		}
	}
	//returns array of base fields and values 
	// write_debug ("sF01268: getfkFieldsNValues: Returning for entt $enttName: " . print_r($resultArray,true), "", "", "", "", "");
	return $resultArray;
}

//Make sure all mandatory fields have been submitted
function mandatoryBaseFields($enttName, $entitybasecols) {
	global $dbase_cols, $missing_mandatory_base_cols;
	//check for mandatory base fields
	$mfield = array();
	$dbase_cols_for_entt = $dbase_cols[strtolower($enttName)];
	$str_dbase_cols_config = print_r($dbase_cols_for_entt, true);
	// write_debug ("sF1274: mandatoryBaseFields: Checking for entity $enttName; Configured Base Cols: $str_dbase_cols_config", "", "", "", "", "");
	$i = 0;
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mbasefield") {
			$mfield[$i] = $split_dbaseColsEntt[1];
			$i = $i+1;
		}	
	}
	$mfcount = count($mfield);
	$condtncount = 0;
	if($mfcount > 0) {
		foreach ($mfield as $keymf => $valuemf) {
			if (array_key_exists($mfield[$keymf], $entitybasecols)) {
				if($entitybasecols[$valuemf] != 'NULL') {
					$condtncount = $condtncount+1;
				}
			} else {
				// write_debug ("sF1292: mandatoryBaseFields: Looping - Mandatory Base Column missing: $mfield[$keymf]", "", "", "", "", "");
				$missing_mandatory_base_cols = $missing_mandatory_base_cols . ',' . $mfield[$keymf];
			}
		}
		if($condtncount == $mfcount) {
			return 1;
		} else {
			if (strtolower($enttName) == 'order_header') {
				$missing_cols = explode(",", $missing_mandatory_base_cols);
				foreach ($missing_cols as &$col_name) {
					if ($col_name == 'contact_id') {
						$cont_missing = 1;
					} elseif ($col_name == 'account_id') {
						$acct_missing = 1;
					} else {
						write_debug ("sF1302: mandatoryBaseFields: Missing mandatory Base columns: $missing_mandatory_base_cols", "", "", "", "", "");
						return 0;
					}
					if ($cont_missing == 1 && $acct_missing == 1) {
						write_debug ("sF1305: mandatoryBaseFields: Missing both account_id and contact_id on order_header: $missing_mandatory_base_cols", "", "", "", "", "");
						return 0;
					} else {
						write_debug ("sF1305: mandatoryBaseFields: Missing only account_id OR contact_id on order_header, so OK: $missing_mandatory_base_cols", "", "", "", "", "");
						return 1;
					}
				}  
				return 0;
			} else {
				return 0;
			}
			return 0;
		}	
	} else {
		write_debug ("sF1305: mandatoryBaseFields: No Mandatory base Fields configured at all for $enttName?!", "", "", "", "", "");
		return 1;
	}
}

//Make sure all mandatory FKeys have been submitted
function onemandatoryFkFields ($enttName, $entityfkcols) {
	global $dbase_cols, $missing_mandatory_base_fkeys;
	//check for mandatory fk fields
	$mfkfield = array();
	$dbase_cols_for_entt = $dbase_cols[strtolower($enttName)];
	// write_debug ("sF1312: onemandatoryFkFields: Checking Mandatory Base FKeys for entity $enttName; FKCols: " . preg_replace('/\s+/', ' ', trim(print_r($entityfkcols,true))), "", "", "", "", "");
	$i = 0;
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mfkfield") {
			$mfkfield[$i] = $split_dbaseColsEntt[1];
			$i = $i+1;
		}	
	}	
	$mfkcount = count($mfkfield);
	$condtncount = 0;
	if($mfkcount > 0) {
		foreach ($mfkfield as $keymfk => $valuemfk) {
			if (array_key_exists($mfkfield[$keymfk], $entityfkcols)) {
				// write_debug ("sF1354: onemandatoryFkFields: Exists in Array: $mfkfield[$keymfk]; Key: $keymfk; Value: $valuemfk; What's this:>$entityfkcols[$valuemfk]<", "", "", "", "", "");
				if($entityfkcols[$valuemfk] != 'NULL') {
					$condtncount = $condtncount+1;
				}
			} else {
				// write_debug ("sF1327: onemandatoryFkFields: Looping - Mandatory Base FKey missing: $mfkfield[$keymfk]", "", "", "", "", "");
				$missing_mandatory_base_fkeys = $missing_mandatory_base_fkeys . ',' . $mfkfield[$keymfk];
			}
		}
		/*  Special processing for order_header, since it can include FKey to contact OR to account, not necessarily to both  
		    -  Check if contact AND account are in $missing_mandatory_base_fkeys */
		if($condtncount > 0 && is_null($missing_mandatory_base_fkeys)) {
			// write_debug ("sF1360: onemandatoryFkFields: Condition Counts: $condtncount, $mfkcount", "", "", "", "", "");
			return 1;
		} else {
			if (strtolower($enttName) == 'order_header' || strtolower($enttName) == 'invoice_header') {
				// write_debug ("sF1362: onemandatoryFkFields: Special processing for order / invoice header with missing columns $missing_mandatory_base_fkeys", "", "", "", "", "");
				$missing_fkeys = explode(",", $missing_mandatory_base_fkeys);
				foreach ($missing_fkeys as &$fkey_name) {
					if ($fkey_name == 'contact_id') {
						$cont_missing = 1;
					} elseif ($fkey_name == 'account_id') {
						$acct_missing = 1;
					} elseif ($fkey_name != '') {
						write_debug ("sF1371: onemandatoryFkFields: Missing mandatory columns: $missing_mandatory_base_fkeys ($fkey_name)", "", "", "", "", "");
						return 0;
					}
					if ($cont_missing == 1 && $acct_missing == 1) {
						write_debug ("sF1375: onemandatoryFkFields: Missing both account and contact on header: $missing_mandatory_base_fkeys", "", "", "", "", "");
						return 0;
					} else {
						write_debug ("sF1385: onemandatoryFkFields: Missing only account OR contact on header, so OK: $missing_mandatory_base_fkeys", "", "", "", "", "");
						return 1;
					}
				}
				return 0;
			} else {
				return 0;
			}
		}
	} else {
		return 1;
	}			
}

function allmandatoryFkFields($enttName, $entityfkcols) {
	global $dbase_cols, $missing_mandatory_fkeys;
	//check for mandatory fk fields
	$mfkfield = array();
	$dbase_cols_for_entt = $dbase_cols[strtolower($enttName)];
	// write_debug ("sF1404: allmandatoryFkFields: Checking Mandatory FKeys for entity $enttName; FKCols: " . preg_replace('/\s+/', ' ', trim(print_r($entityfkcols,true))), "", "", "", "", "");
	$i = 0;
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mfkfield") {
			$mfkfield[$i] = $split_dbaseColsEntt[1];
			$i = $i+1;
		}	
	}	
	$mfkcount = count($mfkfield);
	$condtncount = 0;
	if($mfkcount > 0) {
		foreach ($mfkfield as $keymfk => $valuemfk) {
			if (array_key_exists($mfkfield[$keymfk], $entityfkcols)) {
				// write_debug ("sF1416: allmandatoryFkFields: Exists in Array: $mfkfield[$keymfk]; Key: $keymfk; Value: $valuemfk; What's this:>$entityfkcols[$valuemfk]<", "", "", "", "", "");
				if($entityfkcols[$valuemfk] != 'NULL') {
					// write_debug ("sF1416: allmandatoryFkFields: Looping - Not Null: $entityfkcols[$valuemfk]", "", "", "", "", "");
					$condtncount = $condtncount + 1;
				}
			} else {
				write_debug ("sF1416: allmandatoryFkFields: Looping - Mandatory FKey: $mfkfield[$keymfk]", "", "", "", "", "");
				$missing_mandatory_fkeys = $missing_mandatory_fkeys . ',' . $mfkfield[$keymfk];
			}
		}
		
		if($condtncount == $mfkcount) {
			return 1;
		} else {
			write_debug ("sF1428: allmandatoryFkFields: Missing mandatory FKeys: $missing_mandatory_fkeys; Conditions: $condtncount; FKeys: $mfkcount", "", "", "", "", "");
			return 0;
		}		
	} else {
		return 1;
	}	
}

function allMandatoryFields($enttName, $entitybasecols, $entityfkcols) {
	global $dbase_cols;
	//check for all mandatory fields
	$mfield = array();
	$dbase_cols_for_entt = $dbase_cols[strtolower($enttName)];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mbasefield") {
			array_push($mfield, $split_dbaseColsEntt[1]);
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "mfkfield") {
			array_push($mfield, $split_dbaseColsEntt[1]);
		}
	}

	$mfcount = count($mfield);
	$condtncount = 1;

	if(!is_array($entitybasecols)) {
		$entitybasecols = array();
	}
	if(!is_array($entityfkcols)) {
		$entityfkcols = array();
	}
	$combinedArray = array_merge($entitybasecols, $entityfkcols);
	if(is_array($combinedArray)) {
		if($mfcount > 0) {
			foreach ($mfield as $keymf => $valuemf) {
				if (array_key_exists($mfield[$keymf], $combinedArray)) {
					if (isset($entitybasecols[$valuemf])) {
						if($entitybasecols[$valuemf] == 'NULL') { 
							$condtncount = 0;						
						}
					}
				}
			}
			if($condtncount == 0) {
				return 0;
			} else {
				return 1;
			}
		} else {
			return 1;
		}		
	} else {
		return 0;
	}
}

function recordExistsrNot($enttName, $entitycols, $pkey, $usrid, $orgid, $conn_db_tennant) {
	global $stdenttCols;
	global $dbase_cols;
	$enttName = strtolower($enttName);
	$returnid = 0;
	//print_r($entitycols);
	$dbase_cols_for_entt = $dbase_cols[$enttName];	
	foreach ($entitycols as $keyh => $valueh) {			
		foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
			$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
			if(strtolower($split_dbaseColsEntt[0]) == "msfield") {
				if(strtolower($split_dbaseColsEntt[1]) == $keyh) {
					$enttmsFieldName = strtolower($keyh);
					$enttmsFieldValue = $valueh;
					break;
				}
			}	
		}
	}
	
	if($enttmsFieldName != "" && $enttmsFieldValue != "") {
		$where = "";
		foreach ($dbase_cols_for_entt as $keydbase => $valuedbase) {
			$split_dbaseCols = explode('#', $valuedbase); 
			if(strtolower($split_dbaseCols[0]) == "orgname") {
				$where.= "AND ".$split_dbaseCols[1]." = ".$orgid;
			}
			if(strtolower($split_dbaseCols[0]) == "inactive") {
				$where.= " AND ".$split_dbaseCols[1]." = '0'";
			}
		}
		$dynamicSql = "SELECT ".$pkey." FROM ".$enttName." WHERE ".$enttmsFieldName." = ".$enttmsFieldValue." ".$where." LIMIT 1";		
		$resdynamicSql = @pg_query($conn_db_tennant, $dynamicSql);
		if($resdynamicSql === FALSE) {
			return $returnid;			
		} else {					
			$resdynamicSqlrows = @pg_num_rows($resdynamicSql);
			if($resdynamicSqlrows > 0) {							
				$resData = pg_fetch_row($resdynamicSql);
				$returnid = $resData[0];
				return $returnid;
			} else {
				return $returnid;
			}
		}
	} else {
		return $returnid;
	}
}

function selectSQL($table_name, $default_fields, $where_fields, $pkey)
{
	$firstkey = "";
	$limitstmt = "LIMIT 1";	
	$sql='SELECT '.$pkey.' FROM '.pg_escape_string($table_name).' WHERE ';
	$sql1='';
	if(count($where_fields) == 0)
	{
		return;
	}
	else
	{
		if(!is_array($default_fields))
		{
			$default_fields = array();
		}
		if(!is_array($where_fields))
		{
			$where_fields = array();
		}
		$combinedArray = array_merge($default_fields, $where_fields);
		if(is_array($combinedArray))
		{
			foreach($combinedArray as $key=>$val)
			{
				if($firstkey)
				{
					$sql1.=' AND ';
				}
				else
				{
					$firstkey=1;
				}				
				$fieldName = pg_escape_string($key);
				$fieldValue = $combinedArray["$key"];
				$sql1.= $fieldName.' = '.$fieldValue;
			}
		}
	}	
	$sql.= $sql1." ".$limitstmt;	
	return $sql;
}

function selectUdefSQL($table_name, $primay_key_value)
{
	global $orgid, $udef_table;	
	$reftablename = "'".$table_name."'";
	$limitstmt = "LIMIT 1";	
	$sql = 'SELECT udef_data_id FROM '.pg_escape_string($udef_table).' WHERE primay_key_value = '.$primay_key_value.' AND tbl_name ilike '.$reftablename.' AND orgname = '.$orgid.' '.$limitstmt;		
	return $sql;
}

function selectUdeffieldsSQL($table_name, $entt_cols, $primay_key_value)
{
	global $orgid, $udef_table;	
	$firstkey = 0;
	$reftablename = "'".$table_name."'";
	$sql='SELECT ';
	$sql1='';	
	foreach($entt_cols as $key=>$val)
	{
		if($firstkey)
		{
			$sql1.=', ';
		}
		else
		{
			$firstkey=1;
		}				
		$fieldName = pg_escape_string($val);
		$sql1.= $fieldName;
	}	
	$wherestmt = ' WHERE primay_key_value = '.$primay_key_value.' AND tbl_name ilike '.$reftablename.' AND orgname = '.$orgid.' LIMIT 1';
	$sql.=' '.$sql1.' FROM '.pg_escape_string($udef_table).' '.$wherestmt;
	return $sql;
}

function selectSQLForSync($table_name, $default_fields, $where_fields, $pkey)
{
	global $dbase_cols;
	$enttName = strtolower($table_name);
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "mdate")
		{
			$moddatecolname = $split_dbaseColsEntt[1];			
		}						
	}
	if($moddatecolname)
	{
		$sql='SELECT '.$pkey.','.$moddatecolname.' FROM '.pg_escape_string($table_name).' WHERE ';
	}
	else
	{
		$sql='SELECT '.$pkey.' FROM '.pg_escape_string($table_name).' WHERE ';
	}
	$firstkey = "";
	$limitstmt = "LIMIT 1";	
	
	$sql1='';
	if(count($where_fields) == 0)
	{
		return;
	}
	else
	{
		if(!is_array($default_fields))
		{
			$default_fields = array();
		}
		if(!is_array($where_fields))
		{
			$where_fields = array();
		}
		$combinedArray = array_merge($default_fields, $where_fields);
		if(is_array($combinedArray))
		{
			foreach($combinedArray as $key=>$val)
			{
				if($firstkey)
				{
					$sql1.=' AND ';
				}
				else
				{
					$firstkey=1;
				}				
				$fieldName = pg_escape_string($key);
				$fieldValue = $combinedArray["$key"];
				$sql1.= $fieldName.' = '.$fieldValue;
			}
		}
	}	
	$sql.= $sql1." ".$limitstmt;	
	return $sql;	
}

function insertSql($table_name, $default_fields, $base_fields, $fk_fields, $pkey)
{
	$primarykey = 0;
	$returnstmt = "";
	if($pkey)
	{
		$returnstmt.= "RETURNING ".$pkey.", guid";
	}	
	$sql='INSERT INTO '.pg_escape_string($table_name).' (';
	$sql1='';
	if(!is_array($default_fields))
	{
		$default_fields = array();
	}
	if(!is_array($base_fields))
	{
		$base_fields = array();
	}
	if(!is_array($fk_fields))
	{
		$fk_fields = array();
	}
	$combinedArray = array_merge($default_fields, $base_fields, $fk_fields);
	if(is_array($combinedArray))
	{
		foreach($combinedArray as $key=>$val)
		{
			if($primarykey)
			{
				$sql.=', '; 
				$sql1.=', ';
			}
			else
			{
				$primarykey=1;
			}				
			$sql.= pg_escape_string($key);
			$sql1.= $combinedArray["$key"];
		}
	}
	$sql.=') VALUES('.$sql1.') '.$returnstmt;
	return $sql;
}

function updateSql($table_name, $default_fields, $base_fields, $fk_fields, $pkeyfield, $pkeyvalue) {
	$firstkey = 0;
	$wherstmt = "";
	if($pkeyvalue) {
		$wherstmt.= "WHERE ".$pkeyfield." = ".$pkeyvalue;
		$sql='UPDATE '.pg_escape_string($table_name).' SET';
		$sql1='';
		if(!is_array($default_fields)) {
			$default_fields = array();
		}
		if(!is_array($base_fields)) {
			$base_fields = array();
		}
		if(!is_array($fk_fields)) {
			$fk_fields = array();
		}
		$combinedArray = array_merge($default_fields, $base_fields, $fk_fields);
		
		if(is_array($combinedArray)) {
			foreach($combinedArray as $key=>$val) {
				if($firstkey) {
					$sql1.=', ';
				} else {
					$firstkey=1;
				}				
				$fieldName = pg_escape_string($key);
				$fieldValue = $combinedArray["$key"];
				$sql1.= $fieldName.' = '.$fieldValue;
			}
		}
		$sql.=' '.$sql1.' '.$wherstmt;
		return $sql;
	} else {
		return;
	}
}

function selectedFieldsSql($table_name, $combinedArray, $pkeyfield, $pkeyvalue)
{
	global $orgid, $udef_table;
	$firstkey = 0;
	if($pkeyvalue)
	{
		$wherstmt.= "WHERE ".$pkeyfield." = ".$pkeyvalue;
				
		$sql='SELECT ';
		$sql1='';	
	
		if(is_array($combinedArray))
		{
			foreach($combinedArray as $key=>$val)
			{
				if($firstkey)
				{
					$sql1.=', ';
				}
				else
				{
					$firstkey=1;
				}				
				$fieldName = pg_escape_string($key);				
				$sql1.= $fieldName;
			}
		}
		$sql.=' '.$sql1.' FROM '.pg_escape_string($table_name).' '.$wherstmt;
		return $sql;
	}	
	else
	{
		return;
	}
}

function insertintoUdefData($table_name, $ref_table_name, $base_fields, $default_fields)
{
	$primarykey = 0;
	$returnstmt = "";
	$pkey = getPrikey($table_name);
	if($pkey)
	{
		$returnstmt.= "RETURNING ".$pkey;
	}	
	$sql='INSERT INTO '.pg_escape_string($table_name).' (';
	$sql1='';
	$ref_table_name = getExactEntityName($ref_table_name);
	$reftblnamearray = array();
	$reftblnamearray['tbl_name'] = "'".$ref_table_name."'";
	$combinedArray = array_merge($default_fields, $base_fields, $reftblnamearray);
	
	if(is_array($combinedArray))
	{
		foreach($combinedArray as $key=>$val)
		{
			if($primarykey)
			{
				$sql.=', '; 
				$sql1.=', ';
			}
			else
			{
				$primarykey=1;
			}				
			$sql.= pg_escape_string($key);
			$sql1.= $combinedArray["$key"];
		}
	}
	$sql.=') VALUES('.$sql1.') '.$returnstmt;
	return $sql;
}

function insertintoUdefObjectData($table_name, $ref_table_name, $base_fields, $default_fields, $fk_fields, $udef_obj_name)
{
	$primarykey = 0;
	$returnstmt = "";
	$pkey = getPrikey($table_name);
	if($pkey)
	{
		$returnstmt.= "RETURNING ".$pkey.", guid";
	}	
	$sql='INSERT INTO '.pg_escape_string($table_name).' (';
	$sql1='';
	$ref_table_name = getExactEntityName($ref_table_name);
	$udef_obj_name = getExactEntityDescName($udef_obj_name);
	$reftblnamearray = array();
	$reftblnamearray['base_tbl_name'] = "'".$ref_table_name."'";
	$reftblnamearray['udef_obj_name'] = "'".$udef_obj_name."'";
	$reftblnamearray['udef_obj_seq_nbr'] = 0;
	
	if(!is_array($default_fields))
	{
		$default_fields = array();
	}
	if(!is_array($base_fields))
	{
		$base_fields = array();
	}
	if(!is_array($fk_fields))
	{
		$fk_fields = array();
	}
	
	$combinedArray = array_merge($default_fields, $base_fields, $fk_fields, $reftblnamearray);
	
	if(is_array($combinedArray))
	{
		foreach($combinedArray as $key=>$val)
		{
			if($primarykey)
			{
				$sql.=', '; 
				$sql1.=', ';
			}
			else
			{
				$primarykey=1;
			}				
			$sql.= pg_escape_string($key);
			$sql1.= $combinedArray["$key"];
		}
	}
	$sql.=') VALUES('.$sql1.') '.$returnstmt;
	return $sql;
}

function insertSqlForRelTbl($base_entt, $rel_entt, $entt_base_id, $entt_rel_id, $usrid, $orgid, $is_pri)
{	
	global $dbase_cols;
	global $rel_entties;
	$base_entt = strtolower($base_entt);
	$rel_entt = strtolower($rel_entt);
	$rel_entties_base_array = $rel_entties[$base_entt];
	foreach ($rel_entties_base_array as $keyrelbaseentt => $valuerelbaseentt) 
	{
		$split_relEntt = explode('#', $valuerelbaseentt); 	
		if(strtolower($split_relEntt[0]) == $base_entt && strtolower($split_relEntt[1]) == $rel_entt)
		{
			$rel_entt_tbl_name = strtolower($split_relEntt[2]);
			break;
		}
	}
	
	$resultArray = array();
	$dbase_cols_for_entt = $dbase_cols[$rel_entt_tbl_name];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "pk")
		{
			$nextval = "nextval('seq_".$rel_entt_tbl_name."')";
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $nextval;	
			$pkey = $split_dbaseColsEntt[1];
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "cby")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $usrid;	
		}
		if(strtolower($split_dbaseColsEntt[0]) == "cdate")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".date('Y-m-d H:i:s')."'";
		}
		if(strtolower($split_dbaseColsEntt[0]) == "orgname")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $orgid;
		}
		if(strtolower($split_dbaseColsEntt[0]) == "inactive")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'0'";	
		}						
		if(strtolower($split_dbaseColsEntt[0]) == "baseid")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $entt_base_id;
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "relid")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $entt_rel_id;
		}		
		if(strtolower($split_dbaseColsEntt[0]) == "ispri")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'".$is_pri."'";
		}
	}
	$primarykey = 0;
	$returnstmt = "";
	$sql='INSERT INTO '.pg_escape_string($rel_entt_tbl_name).' (';
	$sql1='';
	
	if(is_array($resultArray))
	{
		foreach($resultArray as $key=>$val)
		{
			if($primarykey)
			{
				$sql.=', '; 
				$sql1.=', ';
			}
			else
			{
				$primarykey=1;
			}				
			$sql.= pg_escape_string($key);
			$sql1.= $resultArray["$key"];
		}
	}
	$sql.=') VALUES('.$sql1.')';
	return $sql;
}
function checkispri($conn_db_tennant, $bentt, $relentt, $bentt_id, $relentt_id, $usrid, $orgid)
{
	global $dbase_cols;
	global $rel_entties;
	$is_sql = 0;
	$base_entt = strtolower($base_entt);
	$rel_entt = strtolower($rel_entt);
	$rel_entties_base_array = $rel_entties[$base_entt];
	foreach ($rel_entties_base_array as $keyrelbaseentt => $valuerelbaseentt) 
	{
		$split_relEntt = explode('#', $valuerelbaseentt); 	
		if(strtolower($split_relEntt[0]) == $base_entt && strtolower($split_relEntt[1]) == $rel_entt)
		{
			$rel_entt_tbl_name = strtolower($split_relEntt[2]);
			break;
		}
	}	
	$dbase_cols_for_entt = $dbase_cols[$rel_entt_tbl_name];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 			
		if(strtolower($split_dbaseColsEntt[0]) == "baseid")
		{
			$basewhere = " ".$split_dbaseColsEntt[1]." = ".$entt_base_id;			
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "ispri")
		{
			$is_sql = 1;
			$ispriwhere = " ".$split_dbaseColsEntt[1]." = '1'";				
		}
	}
	if($is_sql == 1)
	{
		$chksql='SELECT count(*) FROM '.pg_escape_string($rel_entt_tbl_name).' WHERE '.$basewhere.' AND '.$ispriwhere;		
		$resultchkSql = @pg_query($conn_db_tennant, $chksql);
		$selectchk_row = @pg_fetch_row($resultchkSql);
		$chkispricount = $selectchk_row[0];
		return $chkispricount;
	}
	else
	{
		return 0;
	}
}

function selectSrvSyncRecords( $conn_db_tennant, $table_name, $combinedArray, $csv_territory, $taluka_csv) {
	global $dbase_cols, $maxrecsperentity;
	global $orgid, $udef_table, $lastsynctime, $usrid, $dataSource;
	$enttName = strtolower($table_name);
	$pkey = getPrikey($enttName);
	$wherstmt = "";
	if($enttName == 'district' || $enttName == 'location_lat_long') {
		$dbase_cols_for_entt = $dbase_cols[$enttName];
		foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
			$split_dbaseColsEntt = explode('#', $valuedbaseentt); 		
			if(strtolower($split_dbaseColsEntt[0]) == "cdate") {
				$cdatefield = $split_dbaseColsEntt[1];
			}
			if(strtolower($split_dbaseColsEntt[0]) == "orgname") {
				$orgnamefield = $split_dbaseColsEntt[1];			
			}
			if(strtolower($split_dbaseColsEntt[0]) == "inactive") {
				$inactivefield = $split_dbaseColsEntt[1];			
			}
			if(strtolower($split_dbaseColsEntt[0]) == "mdate") {
				$mdatefield = $split_dbaseColsEntt[1];
			}			
		}	
		$wherstmt = " WHERE ";
		$chkforand = 0;
		if($orgnamefield != "") {
			$wherstmt.= " ".$orgnamefield." is null";
			$chkforand = 1;
		}
		if($inactivefield != "") {
			if($chkforand == 1) {
				if($enttName == 'district') {
					$wherstmt.= " AND ".$inactivefield." = '0' AND parent_district is not null AND district_id in ".$taluka_csv;
					$chkforand = 1;
				} else {
					$wherstmt.= " AND ".$inactivefield." is null AND taluka_id in ".$taluka_csv;
					$chkforand = 1;
				}
			} else {
				if($enttName == 'district') {
					$wherstmt.= " ".$inactivefield." = '0' AND parent_district is not null AND district_id in ".$taluka_csv;
					$chkforand = 1;
				} else {
					$wherstmt.= " ".$inactivefield." is null AND taluka_id in ".$taluka_csv;
					$chkforand = 1;
				}
			}
		}
		if($cdatefield != "" && $mdatefield != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ((".$cdatefield." > '".$lastsynctime."') OR (".$mdatefield." > '".$lastsynctime."'))";
				$chkforand = 1;
			} else {
				$wherstmt.= " ((".$cdatefield." > '".$lastsynctime."') OR (".$mdatefield." > '".$lastsynctime."'))";
				$chkforand = 1;
			}
		}						
	} else {
		$dbase_cols_for_entt = $dbase_cols[$enttName];
		foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
			$split_dbaseColsEntt = explode('#', $valuedbaseentt); 		
			if(strtolower($split_dbaseColsEntt[0]) == "cby") {
				$cbyfield = $split_dbaseColsEntt[1];			
			}
			if(strtolower($split_dbaseColsEntt[0]) == "cdate") {
				$cdatefield = $split_dbaseColsEntt[1];
			}
			if(strtolower($split_dbaseColsEntt[0]) == "orgname") {
				$orgnamefield = $split_dbaseColsEntt[1];			
			}
			if(strtolower($split_dbaseColsEntt[0]) == "inactive") {
				$inactivefield = $split_dbaseColsEntt[1];			
			}
			if(strtolower($split_dbaseColsEntt[0]) == "mby") {
				$mbyfield = $split_dbaseColsEntt[1];		
			}
			if(strtolower($split_dbaseColsEntt[0]) == "mdate") {
				$mdatefield = $split_dbaseColsEntt[1];
			}
			// Commented by Vadiraj. Reason:- If we add data_source column in AND clause, records which are added from client to the server in the previous sync will be filtered. These records though modified on the server will not be downloaded to the client.
			/*if(strtolower($split_dbaseColsEntt[0]) == "datasrc")
			{
				$datasrcfield = $split_dbaseColsEntt[1];
			}*/		
			if(strtolower($split_dbaseColsEntt[0]) == "terr") {
				$terrfield = $split_dbaseColsEntt[1];
			}
			if(strtolower($split_dbaseColsEntt[0]) == "extcondt") {
				$where_ext_condt = $split_dbaseColsEntt[1];
				$where_ext_condt = str_replace("::", "$", $where_ext_condt);
				//$where_ext_condt = str_replace("~~", ".'", $where_ext_condt);
				eval ("\$where_ext_condt = \"$where_ext_condt\";");
			}
			if(strtolower($split_dbaseColsEntt[0]) == "msfield" && $enttName == "udef_obj_data") {
				$msfield = $split_dbaseColsEntt[1];		
				$msfieldVal = "'".$objectname."'";
			}
		}
		$wherstmt = " WHERE ";
		$chkforand = 0;
		if($orgnamefield != "" && $orgid != "") {
			$wherstmt.= " ".$orgnamefield." = ".$orgid;
			$chkforand = 1;
		}
		if($inactivefield != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ".$inactivefield." = '0'";
				$chkforand = 1;
			} else {
				$wherstmt.= " ".$inactivefield." = '0'";
				$chkforand = 1;
			}
		}
		if($cdatefield != "" && $mdatefield != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ((".$cdatefield." > '".$lastsynctime."') OR (".$mdatefield." > '".$lastsynctime."'))";
				$chkforand = 1;
			} else {
				$wherstmt.= " ((".$cdatefield." > '".$lastsynctime."') OR (".$mdatefield." > '".$lastsynctime."'))";
				$chkforand = 1;
			}
		}
		if($cbyfield != "" && $mbyfield != "" && ($enttName == 'activity' || strrpos($enttName, "udef") !== false)) {
			if($chkforand == 1) {
				$wherstmt.= " AND ((".$cbyfield." = ".$usrid.") OR (".$mbyfield." = ".$usrid."))";
				$chkforand = 1;
			} else {
				$wherstmt.= " ((".$cbyfield." = ".$usrid.") OR (".$mbyfield." = ".$usrid."))";
				$chkforand = 1;
			}
		}
		if($datasrcfield != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ".$datasrcfield." != '".$dataSource."'";
				$chkforand = 1;
			} else {
				$wherstmt.=  " ".$datasrcfield." != '".$dataSource."'";
				$chkforand = 1;
			}
		}
		if($terrfield != "") {
			if($chkforand == 1) {
				if($csv_territory == "null") {
					$wherstmt.= " AND ".$terrfield." is null";
					$chkforand = 1;
				} else {
					$wherstmt.= " AND (".$terrfield." IN (".$csv_territory.") OR ".$terrfield." is null)";
					$chkforand = 1;
				}
			} else {
				if($csv_territory == "null") {
					$wherstmt.= " AND ".$terrfield." is null";
					$chkforand = 1;
				} else {
					$wherstmt.= " AND (".$terrfield." IN (".$csv_territory.") OR ".$terrfield." is null)";
					$chkforand = 1;
				}			
			}
		}
		if($where_ext_condt != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ".$where_ext_condt;
				$chkforand = 1;
			} else {
				$wherstmt.=  " ".$where_ext_condt;
				$chkforand = 1;
			}
		}

		if($msfield != "") {
			if($chkforand == 1) {
				$wherstmt.= " AND ".$msfield." = ".$msfieldVal;
				$chkforand = 1;
			} else {
				$wherstmt.=  " ".$msfield." = ".$msfieldVal;
				$chkforand = 1;
			}
		}

	}
					
	$sql='SELECT ';
	$sql1 = $pkey;
	
	if(is_array($combinedArray)) {
		foreach($combinedArray as $key=>$val)
		{
			$sql1.=', ';
			$fieldName = pg_escape_string($val);				
			$sql1.= $fieldName;
		}
	}
	
	/*  Check for user- or user-group-specific filter-condition; getting rec for user OR for most recent user-group  */
	$api_filt_str_sql = "select fltr_cond from filter_string,terrusergrp where filter_type = 'API' and for_api_verb ilike 'sync' and entity_name ilike '$enttName' and ($usrid = for_user or for_user_group in (select usergroup from terrusergrp where sbeuser = $usrid) or (for_user is null and for_user_group is null)) order by for_user desc, for_user_group desc limit 1";
	write_debug ("sF02218: selectSrvSyncRecords: Looking for API filter-string: $api_filt_str_sql", "", "", "", "", "");
	$get_filt_str_sql = @pg_query($conn_db_tennant, $api_filt_str_sql);
	if($get_filt_str_sql === FALSE) {
		$pgerror = pg_last_error();
		write_debug ("sF02221: selectSrvSyncRecords: Failed to get filter-string: $api_filt_str_sql; Error: $pgerror", "", "", "", "", "");
	} else {
		// write_debug ("sF02224: selectSrvSyncRecords: Found " . pg_num_rows($get_filt_str_sql) . " filter-string rows", "", "", "", "", "");
		if (pg_num_rows($get_filt_str_sql) > 0) {
			$select_row = @pg_fetch_row($get_filt_str_sql);
			$where_cond = str_replace('$#user_id', $usrid, $select_row[0]);
			$where_cond = str_replace('$#org_id', $orgid, $where_cond);
			$wherstmt.=  " and " . $where_cond . " ";
			write_debug ("sF02229: selectSrvSyncRecords: Added expanded API filter-string: $where_cond", "", "", "", "", "");
		}
	}
  
	$sql.=' '.$sql1.' FROM '.pg_escape_string($enttName).' '.$wherstmt.' ORDER BY '.$pkey.' DESC LIMIT '.$maxrecsperentity;
	//$sql.=' '.$sql1.' FROM '.pg_escape_string($enttName).' '.$wherstmt.' ORDER BY '.$pkey.' DESC';
	//echo $sql;
	//exit;
	write_debug ("sF02229: selectSrvSyncRecords: Returning SQL: $sql", "", "", "", "", "");
	return $sql;
}

//server conflict records
function selectSrvSyncConfictRecords($table_name, $combinedArray)
{
	global $orgid, $udef_table, $lastsynctime, $usrid, $dataSource, $api_log_id;
	$enttName = strtolower($table_name);
	$pkey = getPrikey($enttName);
	$wherstmt = " WHERE ".$pkey." IN (SELECT primary_key FROM api_conflict_log WHERE api_log_id = ".$api_log_id.")";
	$sql='SELECT ';
	$sql1 = $pkey;
	
	if(is_array($combinedArray))
	{
		foreach($combinedArray as $key=>$val)
		{
			$sql1.=', ';
			$fieldName = pg_escape_string($key);				
			$sql1.= $fieldName;
		}
	}
	
	$sql.=' '.$sql1.' FROM '.pg_escape_string($enttName).' '.$wherstmt;
	return $sql;	
}

//server libitem records
function selectSrvSyncLibItemRecords($table_name, $combinedArray,$primay_key_value)
{
	global $orgid, $udef_table, $lastsynctime, $usrid, $dataSource, $api_log_id;
	$entityListId = getExactEntityId($table_name);
	$countForlimit = count($combinedArray);
	$sql="SELECT lib_item.name FROM lib_item,lnk_entity_lib_items WHERE lnk_entity_lib_items.lib_item = lib_item.lib_item_id AND lnk_entity_lib_items.entitylist = ".$entityListId." AND lnk_entity_lib_items.orgname = ".$orgid." AND lnk_entity_lib_items.primay_key_value = ".$primay_key_value." ORDER BY lnk_entity_lib_items.created_date DESC LIMIT ".$countForlimit;	
	return $sql;	
}

//server records for detail objects
function selectSrvSyncDetailRecords($table_name, $combinedArray, $pkeyvalue)
{
	global $dbase_cols;
	global $orgid, $udef_table, $lastsynctime, $usrid, $dataSource;
	$enttName = strtolower($table_name);
	$pkey = getPrikey($enttName);

	$wherstmt = "";
	$dbase_cols_for_entt = $dbase_cols[$enttName];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) {
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 		
		if(strtolower($split_dbaseColsEntt[0]) == "defaultfk") {
			$defaultfkfield = $split_dbaseColsEntt[1];			
		}										
	}
	if($defaultfkfield == "") {
		return("Error: Default FK not set in Impel for " . $enttName);
	} else {
		$wherstmt = " WHERE ".$defaultfkfield." = ".$pkeyvalue;
		$sql='SELECT ';
		$sql1 = $pkey;
		
		if(is_array($combinedArray)) {
			foreach($combinedArray as $key=>$val) {
				$sql1.=', ';
				$fieldName = pg_escape_string($val);				
				$sql1.= $fieldName;
			}
		}
		$sql.=' '.$sql1.' FROM '.pg_escape_string($enttName).' '.$wherstmt;
		return $sql;
	}
}

/************functions for loaddata *******/
function selectSQLFroUnqCondt($table_name, $entity_cols, $default_fields, $where_condtn, $pkey) {
	$firstkey = "";
	$limitstmt = "ORDER BY ".$pkey." LIMIT 1";	
	$sql='SELECT '.$pkey.' FROM '.pg_escape_string($table_name).' WHERE ';
	$sql1='';
	if(!is_array($default_fields)) {
		$default_fields = array();
	}	
	if(is_array($default_fields)) 	{
		foreach($default_fields as $key=>$val) {
			if($firstkey) {
				$sql1.=' AND ';
			} else {
				$firstkey=1;
			}				
			$fieldName = pg_escape_string($key);
			$fieldValue = $default_fields["$key"];
			$sql1.= $fieldName.' = '.$fieldValue;
		}
	}
	if(is_array($entity_cols)) {
		foreach($entity_cols as $key=>$val) {
			$where_condtn = str_replace("#".$key."#", $val, $where_condtn);
		}
	}
	$where_condtn = trim(preg_replace('/\s+/', ' ', $where_condtn));
	if ($where_condtn) {
		if($sql1) {
			$sql.= $sql1." AND ".$where_condtn;	
		} else {
			$sql.= $where_condtn;	
		}
	}
	// write_debug ("fLE: selectSQLFroUnqCondt: Table: $table_name; entt cols: " . serialize ($entity_cols) . "; def flds: " . $default_fields . " Where:--$where_condtn--; PK: $pkey", "", "", "", "", "");
	return $sql;
}

//check for the link between two entities
function selectSqlForRelTbl($base_entt, $rel_entt, $entt_base_id, $entt_rel_id, $usrid, $orgid)
{	
	global $dbase_cols;
	global $rel_entties;
	$base_entt = strtolower($base_entt);
	$rel_entt = strtolower($rel_entt);
	$rel_entties_base_array = $rel_entties[$base_entt];
	foreach ($rel_entties_base_array as $keyrelbaseentt => $valuerelbaseentt) 
	{
		$split_relEntt = explode('#', $valuerelbaseentt); 	
		if(strtolower($split_relEntt[0]) == $base_entt && strtolower($split_relEntt[1]) == $rel_entt)
		{
			$rel_entt_tbl_name = strtolower($split_relEntt[2]);
			break;
		}
	}

	$resultArray = array();
	$dbase_cols_for_entt = $dbase_cols[$rel_entt_tbl_name];
	foreach ($dbase_cols_for_entt as $keydbaseentt => $valuedbaseentt) 
	{
		$split_dbaseColsEntt = explode('#', $valuedbaseentt); 
		if(strtolower($split_dbaseColsEntt[0]) == "pk")
		{
			$pkey = $split_dbaseColsEntt[1];
		}
		if(strtolower($split_dbaseColsEntt[0]) == "inactive")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = "'0'";	
		}						
		if(strtolower($split_dbaseColsEntt[0]) == "baseid")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $entt_base_id;
		}	
		if(strtolower($split_dbaseColsEntt[0]) == "relid")
		{
			$exactdeafultColName = $split_dbaseColsEntt[1];
			$resultArray[$exactdeafultColName] = $entt_rel_id;
		}
	}

	$primarykey = 0;
	$returnstmt = "";
	$sql='SELECT '.$pkey.' FROM '.pg_escape_string($rel_entt_tbl_name).' WHERE ';
	$sql1='';
	
	if(is_array($resultArray))
	{
		foreach($resultArray as $key=>$val)
		{
			if($primarykey)
			{
				$sql1.=' AND ';
			}
			else
			{
				$primarykey=1;
			}				
			$sql1.= pg_escape_string($key).' = '.$resultArray["$key"];
		}
	}
	$sql.=' '.$sql1;
	return $sql;
}

//this function will hit apiInvoice UDM for Inventory update based on org_flag(This is used only for create, update and sync)
function inventoryUpdate($mq, $h_id) {
	$curl = curl_init();
	curl_setopt ($curl, CURLOPT_URL, "http://data.impelcrm.in/atCRM/custom/JSON/add/apiInvoice.html?invHeadrId=".$h_id);
	//curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/custom/JSON/add/apiInvoice.html?invHeadrId=".$h_id);
	curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($curl, CURLOPT_COOKIE, 'zeroCode.atCRM=' .$mq. '; path=/' );
	curl_setopt ($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt ($curl, CURLOPT_COOKIESESSION, true);
	curl_setopt ($curl, CURLOPT_FRESH_CONNECT, true);
	curl_setopt ($curl, CURLOPT_FOLLOWLOCATION, true);
	curl_exec ($curl);
	curl_close ($curl);		
}

function writeLogFile ($val01, $val02 = "", $val03 = "", $val04 = "", $val05 = "", $val06 = "") {
	global $run_id, $usrid, $orgid, $my_pid;
	$myFile = "/tmp/api_internals.log";
	$fh = fopen($myFile, 'a') or die("Can't open api_internals log file");
	$stringData = date('Y-m-d H:i:s T') . " | Run: $run_id, Org $orgid, User $usrid, Proc $my_pid |  " . $val01 . " | " . $val02 . " | " . $val03 . " | " . $val04 . " | " . $val05 . " | " . $val06  . "\n";
	fwrite($fh, $stringData);
	fclose($fh);
}

function write_debug ($val01, $val02 = "", $val03 = "", $val04 = "", $val05 = "", $val06 = "") {
	global $debug_log_needed, $run_id, $usrid, $orgid, $my_pid, $verb, $debug_verb;
	$myFile = "/tmp/api_debug.log";
	if ($debug_log_needed == true && (!isset($debug_verb) || strtolower($debug_verb) === strtolower($verb))) {
		$fh = fopen($myFile, 'a') or die("Can't open API Debug Log file");
		$stringData = date('Y-M-d H:i:s T') . " | Run: $run_id, Org $orgid, User $usrid, Proc $my_pid | " . $val01 . " | " . $val02 . " | " . $val03 . " | " . $val04 . " | " . $val05 . " | " . $val06 . "\n";
		fwrite($fh, $stringData);
		fclose($fh);
	}
}


?> 