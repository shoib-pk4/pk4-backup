<?php 
header('Access-Control-Allow-Origin: *');

// header('Access-Control-Allow-Headers: origin, content-type, accept');
// header('Content-type: text/xml');

	/* 
		* Aim, convert html to pdf and send as attachment via email and record activity in db

		* Flow
			* Getting html as string, converting html string to html file then converting html file to
			  pdf in user org/attachment dir
			* Then  sending pdf via attachment through email.
			* Recording activity entry in db

		* POST Params 
			1 html string
			2 to email addr
			3 from email addr
			4 subject
			5 message body
			6 name
			7 orgid
			8 enttname
			9 account id csv
			10 contact id csv
			11 user id
			12 file name

		* Tools using
			* wkhtmltopdf, by webkit #https://github.com/pdfkit/pdfkit/wiki/Installing-WKHTMLTOPDF
			* it is installed on server
	*/

	class sendPdfAsAttachment {
		
		var $dir, $htmlFileName, $pdfFileName, $to, $from, $msg, $sub, $htmlStr, $htmFile, $pdfFile, $pdfName, $bcc, $cc, $files=array();
		var $org, $guid,  $loop_flag='0', $actvt_type, $actvt_id, $lib_item, $pdfSize, $tmpHtmlDir, $userName;
		var $conn_db_tennant, $master_connection, $actv_id, $actvt_type_id;

		//get the necessary fields
		public function __construct($conn) {

			//set limits
			set_time_limit(3600);
			ini_set('memory_limit', '1000M');

			// $this->logError("\r\n".implode(',', $_POST)."\r\n");

			$this->orgName      = $_POST['orgId'];
			$this->dir          = '/home/sridhar/jetty1/webapps/atCRM/appData/org_'.$this->orgName.'/attachment/';
			$this->htmlFileName = $this->generateRandomString().'.html';
			$this->pdfName 		= $_POST['fileName'];
			$this->pdfFileName  = $_POST['fileName'].'.pdf'; //.'_'.$this->generateRandomString().'.pdf';
			$this->to      		= $_POST['toEmails']; //shoib@impelcrm.in';
			$this->from    		= $_POST['fromEmail'];
			$this->msg     		= $_POST['message']; //Sending pdf as attachment';
			$this->sub     		= $_POST['subject']; //'Pdf';
			$this->name    		= $_POST['fromName'];
			$this->replyTo 		= $this->from;
			$this->bcc     		= ''; //$_POST['bcc'];
			$this->cc      		= ''; //$_POST['cc'];
			$this->htmlStr 		= $this->returnHtmlStr($_POST['htmlString']); 
			// $this->path    		= $_SERVER['DOCUMENT_ROOT']."/html-to-pdf/".$this->dir;
			$this->createdBy    = $_POST['fromUserID'];
			$this->guid         = $this->generate_guid();
			$this->acc_id_csv   = $_POST['account_id_csv'];
			$this->cont_id_csv  = $_POST['cont_id_csv'];
			$this->tmpHtmlDir   = $_SERVER['DOCUMENT_ROOT']."/html-to-pdf/tmpPdfFolder/";
			// $this->userName     = 'kishore@impelcrm.in'; //$_POST['userName'];
			$this->master_connection = $conn;

			//validate fields
			$this->validateFields();

			// $this->actvt_type   = 'contact';
			//log post 
			// $postStr = "\r\n".'Post Params: '. 'org-'.$this->orgName.'pdfname:'.$this->pdfFileName."\r\n";
			// $this->logError($postStr);
		}


		//get tenanat connection
		public function getTenantConnection() {
			$conn_db_master = pg_connect($this->master_connection); 

			//connection check for db
			if (!$conn_db_master) {	
				$msg =  ' Connection to master db failed. Connection= '.$this->master_connection;
				$this->logError($msg);		
				echo 'Connection to master db failed';						
				exit;
			} 
			
			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$this->from."'";
			$getTenantDtsSQL = pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$msg =   ' Selecting tenant query failed. Query= '.$querygetTenantDtsSQL;
				$this->logError($msg);
				echo ' Selecting tennant failed';
				exit;
			}

			$getTenantDtsrows = pg_num_rows($getTenantDtsSQL);
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
				// $this->conn_string_tennant = "hostaddr=$db_server port=$db_port dbname=$db_name user=impelapi password=impel_2013";	 //prod
				
				//free results to free memory
				pg_free_result($getTenantDtsSQL);
			} else {
				$msg =  ' Empty results from tenant_master query= '.$querygetTenantDtsSQL;
				$this->logError($msg);
				echo 'Empty resoponse from tenant master';
				exit;
			}

			//tennant connection
			$this->conn_db_tennant = @pg_connect($this->conn_string_tennant);
			if (!$this->conn_db_tennant) {
				$msg = ' Connecting tenant failed= '.$conn_string_tennant;
				$this->logError($msg);
				echo 'Connecting to tenant failed';
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		private function returnHtmlStr($str) {
			$str = preg_replace("/[\r\n]+/", '',$str);
			$str = preg_replace("/'/", '"', $str);
			return $str;
		}

		//create tmp folder, where html, pdf files created and stored for a while
		public function createTmpFolder () {
			if(!file_exists($this->tmpHtmlDir)) {
				mkdir($this->tmpHtmlDir, 0777, true);
			}
		}

		//create unique html file with full permissions
		public function createHtmlFile() {
			while(file_exists($this->tmpHtmlDir.$this->htmlFileName) == true) {
				$this->htmlFileName = $this->generateRandomString().'.html';
			}
			$this->htmFile = $this->tmpHtmlDir.$this->htmlFileName;

			//create html file here
			file_put_contents($this->htmFile, $this->htmlStr); 
			//set full permission
			chmod($this->htmFile, 0777); //give full permission
		}

		//create unique pdf file with full permission and with desired contents
		public function createPdfFile() {
			while(file_exists($this->dir.$this->pdfFileName) == true) {
				$this->pdfFileName = $this->pdfName.'_'.$this->generateRandomString().'.pdf';
			}
			$this->pdfFile = $this->dir.$this->pdfFileName;
			ob_start();
			//run wkhtmltopdf  via shell using php
			$cmd    = "/wkhtmltopdf/wkhtmltopdf-i386 $this->htmFile $this->pdfFile > file.log";
			$result = exec($cmd);	 //execute

			//going for while because sometimes pdf wont be created the below lines will be executed because, empty pdf is sent as attachment
			// while(file_exists($this->pdfFile) == false) { }

			//give full permission
			chmod($this->pdfFile, 0777); 
			//get the pdf size
			$size = filesize($this->pdfFile);
			$this->pdfSize = (!$size)?0:$size;
			//add file path and name to array
			// array_push($this->files, array('name'=>$this->pdfFileName,'path'=>$this->pdfFile, 'type'=>'application/pdf'));

			ob_clean();
		}

		//this function takes the file path form $_FILES and stores it an array
		public function getAttachments() {
			$fileNames = $_FILES['files']['name'];
			$fileErr = $_FILES['files']['error'];
			$fileType = $_FILES['files']['type'];
			$fileDir = $_FILES['files']['tmp_name']; //contains file stored location  
			$fileCnt = count($fileDir); //you can take any thing like size, name etc all gives you total files being attached.for above
			for($i=0; $i<$fileCnt; $i++) {
				//means file contains no error
				if($fileErr[$i] == 0) {
					//add file path and name to array
					array_push($this->files, array('name'=>$fileNames[$i],'path'=>$fileDir[$i], 'type'=>$fileType[$i]));
				}
			}			
		}

		public function emailPdf() {
			if(!file_exists($this->pdfFile)) {
				$this->logError('File not found= '. $this->pdfFile);
				exit;
			} 
			$this->mail_attachment($this->pdfFileName, $this->dir, $this->to, $this->from, $this->name, $this->replyTo, $this->sub, $this->msg);
		}

		public function deleteFiles() {			
			//add html file path to files array and loop it and delete
			array_push($this->files, array('name'=>'','path'=>$this->htmFile));

			//once file has been sent delete thos files
			foreach ($this->files as $file) {
				$path = $file['path'];
				if(file_exists($path)) {
					unlink($path);
				}
			}
			
		}

		
		private function mail_attachment($filename, $path, $mailto, $from_mail, $from_name, $replyto, $subject, $message) {

			$file = $path.$filename;
		    $file_size = filesize($file);
		    $handle = fopen($file, "r");
		    $content = fread($handle, $file_size);
		    fclose($handle);
		    $content = chunk_split(base64_encode($content));
		    $uid = md5(uniqid(time()));
		    $name = basename($file);
		    $header = "From: ".$from_name." <".$from_mail.">\r\n";
		    $header .= "Reply-To: ".$replyto."\r\n";
		    $header .= "MIME-Version: 1.0\r\n";
		    $header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";
		    $header .= "This is a multi-part message in MIME format.\r\n";
		    $header .= "--".$uid."\r\n";
		   // $header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
		    $header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
		    $header .= $message."\r\n\r\n";
		    $header .= "--".$uid."\r\n";
		    $header .= "Content-Type: application/octet-stream; name=\"".$filename."\"\r\n"; // use different content types here
		    $header .= "Content-Transfer-Encoding: base64\r\n";
		    $header .= "Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n";
		    $header .= $content."\r\n\r\n";
		    $header .= "--".$uid."--";
		    if (mail($mailto, $subject, "", $header)) {
		        echo "mail send ... OK"; // or use booleans here
		    } else {
		        echo "mail send ... ERROR!";
		    }
		}

		
		//insert record in activity table
		public function recordActivity() {
			$actvt_type_id_query = "select actvt_type_id from actvt_type where orgname=$this->orgName and actvt_type='Sent Email' ";
			$resource = $this->execQueryAndReturnReso($actvt_type_id_query);
			$cnt = pg_num_rows($resource);
			if($cnt == 0) {
				$this->logError('Activity type id is empty query is:'.$actvt_type_id_query);
				exit;
			}
			$result = pg_fetch_assoc($resource); 
			//set lib item, its global to class
			$this->actvt_type_id = $result['actvt_type_id'];

			$query = "insert into activity(actvt_id,created_by_user,  subject, notes, actvt_exp_type, inactive, start_time, created_date, data_source, recent_date, recent_date_reason, eml_to, actvt_type, orgname)";
			$query .= " values(nextval('seq_activity'),$this->createdBy,  '$this->sub', '$this->htmlStr', 2, 0,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'From Email', CURRENT_TIMESTAMP, 'activity created', '$this->to', $this->actvt_type_id, $this->orgName) RETURNING actvt_id";
			$resource = $this->execQueryAndReturnReso($query);	
			$result = pg_fetch_assoc($resource); 
			//set lib item, its global to class
			$this->actvt_id = $result['actvt_id'];
				
		}

		//record entry in activity contact or account based on activity type
		public function recordActivity_In_contact_or_account() {
			$toArr = explode(',', $this->to); //split the email address if many
			$toArrCnt = count($toArr);

			if(strlen($this->acc_id_csv) > 0) {
				$accArr = explode(',', $this->acc_id_csv);
				$query = "insert into actvt_acct(actvt_acct_id, activity, account, inactive, created_date, modified_date, guid)";
				$values = '';
				//multiple insert row using single query
				for($i=0; $i<$toArrCnt; $i++) {
					if($i==0) {
						$values .= " values(nextval('seq_actvt_acct'), $this->actvt_id, $accArr[$i], 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '$this->guid'),";
					} else {
						$values .= "(nextval('seq_actvt_acct'), $this->actvt_id, $accArr[$i], 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '$this->guid'),";	
					}					
				}
				$query .= $values;
				if($toArrCnt > 0) {
					//remove last comma from the query string
					$query = rtrim($query, ','); //would cut trailing commas.
					//execute the query
					$this->execQueryAndReturnReso($query);
				}

			} 
			if(strlen($this->cont_id_csv) > 0)  {
				$contArr = explode(',', $this->cont_id_csv);
				$query = "insert into actvt_cont(actvt_cont_id, activity, contact, inactive, created_date, modified_date, guid)";
				$values = '';
				//multiple insert row using single query
				for($i=0; $i<$toArrCnt; $i++) {
					if($i==0) {
						$values .= " values((nextval('seq_actvt_cont')+1), $this->actvt_id, $contArr[$i], 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '$this->guid'),";
					} else {
						$values .= "((nextval('seq_actvt_cont')+1), $this->actvt_id, $contArr[$i], 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '$this->guid'),";	
					}					
				}
				$query .= $values;
				if($toArrCnt > 0) {
					//remove last comma from the query string
					$query = rtrim($query, ','); //would cut trailing commas.
					//execute the query
					$this->execQueryAndReturnReso($query);
				}
			}

		}

		//make an entry in lib_item table
		public function addEntryInLibItem() {
			$query = "insert into lib_item(lib_item_id, Name,  Description, Path, CreateDate, CreatedBy_Id, ItemOwner_Id, ContentType_Id, orig_file_name, orgname, download_status, size_in_bytes, data_source, created_by_portal_user)";
			$query .=" values(nextval('seq_lib_item'), '$this->pdfFileName', 'Pdf has attachment', '$this->pdfFile', CURRENT_TIMESTAMP, $this->createdBy, $this->createdBy, NULL, '$this->pdfName', $this->orgName, 'download_status', $this->pdfSize, '', NULL ) RETURNING lib_item_id";
			//execute the query
			$this->execQueryAndReturnReso($query);
			$lib_item = pg_fetch_assoc($resource); 

			//set lib item, its global to class
			$this->lib_item = $lib_item['lib_item_id'];
		}

		//make an entry in lib_item_for_acct table
		public function addEntryInLibItemForActvt() {
			$query = "insert into lib_item_for_actvt(lib_item_for_actvt_id, lib_item, activity, added_by_user, added_on_date)";
			$query .=" values(nextval('seq_lib_item_for_actvt'), $this->lib_item, $this->actvt_id, $this->createdBy, CURRENT_TIMESTAMP)";
			//execute the query
			$this->execQueryAndReturnReso($query);
		}

		/* 
			* validate query execution if failed then log err
		*/
		private function execQueryAndReturnReso($query) {
			//now execute query
			$resource = pg_query($this->conn_db_tennant, $query);
			//if failed to insert in lib_item, make a log entry & stop
			if(!$resource) { 
				$this->logError('Query Failed= '. $query);
				//log error in table
				$this->loop_flag = '1'; //it stops looping for entry in error table
				$arr = array(0, pg_last_error($resource), $this->name, '', '');
				$this->logErrorInTbl($arr);
				echo 'Query failed';
				exit;
			}
			return $resource;
		}

		/* 
			* log error msg in erro table
		*/
		private function logErrorInTbl($arr) {
			list($ec, $em, $ui, $st, $on) = $arr;
			//log error in error table
			$query = "insert into errormsgs(errormsgs_id, errorcode, errormessage, userid, created_date, errstacktrace, reqesturi, completed_by, completed_on, orgname) ";
			$query .= " values(nextval('seq_errormsgs_id'), $ec, $em, $ui, CURRENT_TIMESTAMP, $st, '/uploadfile/uploadfile.php', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $on)";
			if($this->loop_flag == '0') {
				$resource = $this->execQueryAndReturnReso($query);
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

		private function generateRandomString($length = 10) {
		    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZimpelcrmproductionserver';
		    $randomString = '';
		    for ($i = 0; $i < $length; $i++) {
		        $randomString .= $characters[rand(0, strlen($characters) - 1)];
		    }
		    return $randomString;
		}


		//log error
		private function logError($msg) {
			ini_alter('date.timezone','Asia/Calcutta'); //set the timezone
			$my_pid = getmypid ();
			$date = date('Y-m-d H:i:s');
			$msg = "\r\n\t\t----New Issue-----\r\n".$date. 'Error: '. $msg . ' Process Id: '.$my_pid."\r\n\t\t----Close Issue----\r\n";
			file_put_contents('/tmp/pdf_attachment.log', $msg, FILE_APPEND);
			exit;
		}

		//neccessory fields validation
		private function validateFields() {
			if($this->to == '' || $this->orgName == '' || $this->createdBy == '') {
				$this->logError("\r\n Required fields are empty To=".$this->to.'##'.'Org='.$this->org.'##'.'Created By='.$this->createdBy."\r\n");
				exit;
			}
		}

		//end of class

	}

	//allow from required ips only
	//perform operation here
	$host = $_SERVER['SERVER_ADDR'];	
	//validate origin url
	if(preg_match('/^192.168/', $host) || preg_match('/^10/', $host)) {	 
		
		//take connection string from constants file
		require('../constants/php_config.cfg');	

		//create a class obj
		$sendPdf = new sendPdfAsAttachment($master_connection);
		$sendPdf->createTmpFolder();
		$sendPdf->createHtmlFile();
		$sendPdf->createPdfFile();
		//execute this funciton if only attachments exists
		// if(isset($_FILES))  {
		// 	$sendPdf->getAttachments();
		// }
		$sendPdf->emailPdf();
		//get tennant connection
		$sendPdf->getTenantConnection();
		$sendPdf->recordActivity();
		$sendPdf->recordActivity_In_contact_or_account();
		$sendPdf->addEntryInLibItem();
		$sendPdf->addEntryInLibItemForActvt();

		echo 'Success';
		//finally delete html file created
		$sendPdf->deleteFiles();
	}
	
?>