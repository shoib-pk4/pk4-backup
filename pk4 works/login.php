<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: origin, content-type, accept');
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
$soaprequsetxml = "";

$errorapiheader = htmlspecialchars_decode("<error>Not a valid api header</error>\r\n");
$errorService = htmlspecialchars_decode("<error>Invalid email/password</error>\r\n");
$successService = htmlspecialchars_decode("<sessionid>refValue</sessionid>\r\n");
$badRequest = htmlspecialchars_decode("<error>Bad Request</error>\r\n");

//log wirte and print result
require_once "../functions/logResult.php";
require_once "../functions/soapFunctions.php";

function apiHeader($data)
{
	global $mq, $requestortype, $requestorid, $clienttime, $verb, $req_time, $musrid, $error, $errorapiheader, $errorService, $successService, $badRequest;
	$requestortype = $data->requestortype;
	$requestorid = $data->requestorid;
	$verb = $data->verb;
	$clienttime = $data->clienttime;	
}
//function to get soap  body
function login($data)
{
	global $mq, $requestortype, $requestorid, $clienttime, $verb, $req_time, $musrid, $error, $errorapiheader, $errorService, $successService, $badRequest, $soaprequsetxml;
	
	$data_array = object2array($data);
	$soaprequsetxml = xml_encode( $data_array, $indent = false, $i = 0 );	
			
	//connection to master database
	$conn_string_master = "host=localhost port=6432 dbname=IMMASTER";
	$conn_db_master = @pg_connect($conn_string_master); 
	if (!$conn_db_master) 
	{	
		printSoapResults($errorService);
		exit;
	}		
	
	if($requestorid == "" || $requestortype == "" || $clienttime == "" || $verb == "" || strtolower($verb) != "login")
	{
		if($clienttime == "") { $clienttime = "1970-01-01 00:00:00"; }
		$error = 1;	
		logResult($conn_db_master, $errorapiheader);
		exit;
	}
	else
	{		
		//$data_array = object2array($data);
		if(is_array($data_array) && count($data_array) == 2)
		{
			$loginName = $data_array['email'];
			$password = $data_array['password'];
			
			if($loginName != "" && $password != "")
			{
				$curl = curl_init();
				curl_setopt ($curl, CURLOPT_URL, "http://192.168.11.126:9090/atCRM/homePage.html?email=".$loginName."&password=".$password."&iT=1");
				curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($curl, CURLOPT_HEADER, true);
				curl_setopt($curl, CURLOPT_NOBODY, true);
				$curlResult = curl_exec ($curl);
				curl_close ($curl);
				if($curlResult != "")
				{				
					if(strpos($curlResult, 'index.html') != 0)
					{
						$error = 1;	
						logResult($conn_db_master, $errorService);
						exit;
					}
					else
					{
						if(strpos($curlResult, 'Set-Cookie: zeroCode.atCRM=') == 0)
						{
							$error = 1;	
							logResult($conn_db_master, $errorService);
							exit;
						}
						else
						{
							$apikey = substr($curlResult, strpos($curlResult, 'Set-Cookie: zeroCode.atCRM=')+27, 20);
							$checkresp = $successService;
							$checkresp = preg_replace('/refValue/', $apikey, $checkresp);	
							$getUsridSql = "SELECT user_id FROM mt_user_master WHERE user_name = '".$loginName."'";
							$getUsridSqlRes = @pg_query($conn_db_master, $getUsridSql);		
							if($getUsridSqlRes === FALSE) 
							{
								$musrid = "null";
								$error = 1;						
								logResult($conn_db_master, $errorService);
								exit;
							}
							else
							{
								$select_row = pg_fetch_row($getUsridSqlRes);
								$musrid = $select_row[0];
								$error = 0;						
								logResult($conn_db_master, $checkresp);
								exit;
							}				
							
						}
					}
				}
				else
				{
					$error = 1;	
					logResult($conn_db_master, $errorService);
					exit;
				}
			}
			else
			{
				$error = 1;	
				logResult($conn_db_master, $errorService);
				exit;
			}
		}
		else
		{
			$error = 1;	
			logResult($conn_db_master, $badRequest);
			exit;
		}
	}	
}
// disabling WSDL cache 
ini_set("soap.wsdl_cache_enabled", "0"); 
$server = new SoapServer("soapServiceLogin.wsdl"); 
$server->addFunction("apiHeader");
$server->addFunction("login"); 
$server->handle();
?>