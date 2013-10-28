<?php 
	/* 
		Aim
			* Image, or video is upload via impel touch, and move that particular file
			  in user org directory, with proper entries in database.
		Flow
			* Params requested by post method.
			* It checks whether the file name exists in lib_item, if yes then exit. else
			* Generate unique file name, create lib item if everything goes proper then move file in a org dir.
			* Then make an entry in lnk_entity_lib_items tbl
	*/


	class uploadFile {

		var $mq, $orig_filename, $guid, $unique_filename, $entity_name, $master_connection, $org_id;
		var $filepath = '/home/sridhar/jetty6/webapps/atCRM/appData/org_', $entity_list_id, $col_prikey, $col_prikey_val_for_entity;
		var $user_id, $loop_flag='0';
		//file upload status codes
		var  $fileUploadErrors = array( 
		        0=>"There is no error, the file uploaded with success", 
		        1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini", 
		        2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form" ,
		        3=>"The uploaded file was only partially uploaded", 
		        4=>"No file was uploaded", 
		        6=>"Missing a temporary folder" 
			); 

		//get the post values
		public function __construct($m_con) {
			
			//set time zone
			ini_alter('date.timezone','Asia/Calcutta'); //set the timezone
			$this->run_id = rand(1000000, 9999999);
			$this->my_pid = getmypid ();
			$this->dateTime = date('Y-m-d H:i:s'); //get the current date and time

			$fileErrNo = $_FILES['file']['error'];
			//make entry in log if file contains error
			if($fileErrNo != 0) {
				$str = 'Post Params: '.implode(',', $_POST);
				$str .= "\r\n File Upload Error: ".isset($this->fileUploadErrors[$fileErrNo])?$this->fileUploadErrors[$fileErrNo]:$fileErrNo;
				$this->logError("\r\n\r\n $this->dateTime - New Process. \r\n\r\n".$str);
				echo ' -- File upload error. Number: '.$fileErrNo;
				exit;
			} 

			$this->mq            	 = $_POST['mq']; //get mq
			$this->orig_filename 	 = $_POST['fileName']; //get file name
			$this->guid          	 = $_POST['guid']; //get guid
			$this->userName      	 = $_POST['userName']; //get user name
			$this->entity_name       = $_POST['entity']; //get entity name
			$this->filesize   	     = $_FILES['file']['size']; //file size
			$this->tmp_name   	     = $_FILES['file']['tmp_name']; //file size
			$this->master_connection = $m_con;			
			


		}

		//get tenanat connection
		public function getTenantConnection() {
			$conn_db_master = pg_connect($this->master_connection); 

			//connection check for db
			if (!$conn_db_master) {	
				$msg =  $this->dateTime . ' Connection to master db failed. Connection= '.$this->master_connection;
				$this->logError($msg);		
				echo '2';						
				exit;
			} 
			
			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$this->userName."'";
			$getTenantDtsSQL = pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$msg =  $this->dateTime . ' Selecting tenant query failed. Query= '.$querygetTenantDtsSQL;
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
				$msg =  $this->dateTime . ' Empty results from tenant_master query= '.$querygetTenantDtsSQL;
				$this->logError($msg);
				echo 'Empty resoponse from tenant master';
				exit;
			}

			//tennant connection
			$this->conn_db_tennant = @pg_connect($this->conn_string_tennant);
			if (!$this->conn_db_tennant) {
				$msg =  $this->dateTime . ' Connecting tenant failed= '.$conn_string_tennant;
				$this->logError($msg);
				echo 'Connecting to tenant failed';
				exit;
			} else {
				pg_close ($conn_db_master);
			}
		}

		//this file take binary data and convert into file in to particular location
		private function moveFile() {
			
			//create dir if not exists and returns attachment path
			$uploadPath = $this->checkDirIfExistElseRetPath();

			//finally move file to directory
			// $file  = $_FILES['file']['tmp_name'];
			ob_start();
			$move  = move_uploaded_file($this->tmp_name, "$uploadPath/$this->unique_filename");
			ob_flush();
			if(!$move){
				//log err
				$error = error_get_last();
				$error =  $error['message'];	

				$msg = 'move_uploaded_file failed: '.$uploadPath.'/'.$this->unique_filename;
				
				$this->logError("File upload failed = $error ". $msg. ' File = '.$file. ' move ='.$move);
				echo 'File moving failed';
				exit;
			}

		}

		//generate unique file name
		private function generateFileName() {
			//returns the extension
			$arr = explode('.', $this->orig_filename);
			$ext = array_pop($arr);

			//generate random file name with given extension
			$this->unique_filename = md5(uniqid(rand(), true)) . '.'.$ext; 

			//loop until to get unique file name
			while(file_exists($this->filepath.'/'.$this->unique_filename) == true) {
				$this->unique_filename = md5(uniqid(rand(), true)) . '.'.$ext; 
			}
			
		}

		/* 
			* get org id
		*/
		private function getOrgid() {

			//get the user id first from SBEUser tbl
			$query    = "select User_Id from SBEUser where LoginName = '$this->userName'";
			$resource = $this->execQueryAndReturnReso($query);
			
			$count  = pg_num_rows($resource);
			if($count == 0) {
				//log issue
				$this->logError('User_Id is null= '. $query);
				echo 'User id is null';
				exit;
			}
			$result = pg_fetch_assoc($resource);
			$this->userid = $result['user_id'];
			// $this->created_by_id = 0; //$result['created_by'];
		

			//get org id from LnkUsrOrg tbl using user id
			$query    = "select OrgName from LnkUsrOrg where SBEUser = $this->userid";
			$resource = $this->execQueryAndReturnReso($query);
			
			$count  = pg_num_rows($resource);
			if($count == 0) {
				//log issue
				$this->logError('OrgName is null= '. $query);
				echo 'OrgName is null';
				exit;
			}

			//global to class
			$result   = pg_fetch_assoc($resource);			
			$this->org_id   = $result['orgname'];			

		}

		/* 
			* here it org dir and org_(any num)/attachment exist,
			* if know then it creates
		*/
		private function checkDirIfExistElseRetPath() {
			//final dir path ex: /atCRM/appData/org_(any num)
			$org_path = $this->filepath.$this->org_id; 
			//attachment dir where file is being uploaded
			$attachment_path = $org_path.'/attachment';

			//create dir if not exits
			if(!file_exists($org_path.'/')) {	
				//create org recursive dir with full permission
				if(!mkdir($org_path, 0777, true)) {
					//log err
					$error = error_get_last();
					$error =  $error['message'];	
					$this->logError("Org directory creation failed, $error path =". $org_path);
					echo 'Org directory creation failed';
					exit;
				}
				//create attachment recursive dir with full permission
				if(!mkdir($attachment_path, 0777, true)) {
					//log err
					$error = error_get_last();
					$error =  $error['message'];	
					$this->logError("Attachment directory creation failed, $error path:". $attachment_path);
					echo 'Attachment directory creation failed';
					exit;
				}

				return $attachment_path; //dont go further just return
			} 

			//check whether attachment dir exists
			if(!file_exists($attachment_path.'/')) { 
				//create recursive dir with full permission
				if(!mkdir($attachment_path, 0777, true)) {
					//log err
					$error = error_get_last();
					$error =  $error['message'];	
					$this->logError("Attachment directory creation failed, $error path::". $attachment_path);
					echo 'Attachment directory creation failed';
					exit;
				}					

				return $attachment_path; 
			}
			
			return $attachment_path;
		}	

		/* 
			* get entity id, if doesn't exist then create and get
		*/
		private function getEntityIdAndPriKey() {
			//check first wheter it exists
			$query = "select EntityList_Id, col_prikey from EntityList where EntityName='".$this->entity_name."' and orgname = '".$this->org_id."' and inactive='0'  ";
			$resource = $this->execQueryAndReturnReso($query);

			//returns primary key of inserted record
			$result = pg_fetch_assoc($resource); 
			$count  = pg_num_rows($resource);
			//$this->logFile(implode(',', $result));
			if($count > 0) {
				$this->entity_list_id = $result['entitylist_id'];
				$this->col_prikey = $result['col_prikey'];
			} else { //then create entit list id and return created entity list id
				list($this->entity_list_id, $this->col_prikey) = $this->createEntity();
			}

		}

		/* 
			* insert record in LELI = lnk_entity_lib_items
		*/
		private function insertRecordInLELI() {
			$query  = "insert into lnk_entity_lib_items(lnk_entity_lib_items_id, entitylist, lib_item, primay_key_value, orgname, inactive, created_date, created_by,  type) ";
			$query .= "values(((select max(lnk_entity_lib_items_id) from lnk_entity_lib_items )+1), $this->entity_list_id, $this->lib_item, $this->col_prikey_val_for_entity, $this->org_id, 0, '$this->dateTime', $this->userid, 'Profile Picture')";
			$resource = $this->execQueryAndReturnReso($query);
		}

		/* 
			* get col prikey value	
		*/
		private function getColPriKeyValFromEntity() {

			$query = "select $this->col_prikey from $this->entity_name where guid = '$this->guid' ";
			$resource = $this->execQueryAndReturnReso($query);

			$result = pg_fetch_assoc($resource); 
			$count  = pg_num_rows($resource);
			$col_prikey_val = '';
			if($count > 0) {
				$this->col_prikey_val_for_entity = $result[$this->col_prikey];
			} 
			else
			{
				$this->col_prikey_val_for_entity = "NULL";
				$arr = array(0, "Could not find a record with the GUID passed.", $this->userName, '', '');
				$this->logErrorInTbl($arr);
			}
			
		}

		/* 
			* get lib items id if exists else
			* make entry in lnk_entity_lib_items and get insert lib id
		*/
		public function checkFileExistsElseCreate() {
			//get and set org id in a var
			$this->getOrgid();
			
			//check entity list id exist, if then get lib item id and return
			$query = "select lib_item_Id from lib_item where orig_file_name='".$this->orig_filename."' and orgname = $this->org_id";
			$resource = $this->execQueryAndReturnReso($query);

			$result = pg_fetch_assoc($resource); 
			$count  = pg_num_rows($resource);
			if($count > 0) { 	
				$this->logError('File already exists. '. $this->orig_filename);
				echo 'File already exists= '.$this->orig_filename;		
				exit; //stop execution
			} 
			//generate unique file name
			$this->generateFileName();
			//create lib item
			$this->createLibItem();			
			//move file
			$this->moveFile();			
			
		}

		/* 
			* creates a lib item
		*/
		private function createLibItem() {
			$path = $this->filepath.$this->org_id.'/attachment/'.$this->unique_filename;
			$query  = "insert into lib_item(lib_item_Id, Name,  Description, Path, CreateDate, CreatedBy_Id, ItemOwner_Id, ContentType_Id, orig_file_name, orgname, download_status, size_in_bytes, data_source, created_by_portal_user) ";
			$query .= "values(nextval('seq_lib_item'), '$this->unique_filename', '$this->unique_filename', '$path', '$this->dateTime', $this->userid, $this->userid,NULL , '$this->orig_filename', $this->org_id, 'download_status', $this->filesize, 'From Touch', NULL) RETURNING  lib_item_Id"; 
			$resource = $this->execQueryAndReturnReso($query);

			$lib_item = pg_fetch_assoc($resource); 

			//set lib item, its global to class
			$this->lib_item = $lib_item['lib_item_id'];

		}

		/* 
			* create a entity , and return the created list id
		*/
		private function createEntity() {
			$query = "insert into EntityList  select * from EntityList where EntityName='".$this->entity_name."' and orgname is null";
			$resource = $this->execQueryAndReturnReso($query);

			//get the inserted record details
			$lid = pg_last_oid($resource); 

			$query = "select EntityList_Id, col_prikey from EntityList where EntityList_Id= $lid";
			$resource = $this->execQueryAndReturnReso($query);

			$result = pg_fetch_assoc($result);

			$entity_id  = $result['EntityList_Id'];
			$col_prikey = $result['col_prikey'];
			//update the org id for the inserted record
			$query = "update EntityList set orgname = $this->org_id";
			$resource = $this->execQueryAndReturnReso($query);

			return array($entity_id, $col_prikey);
		}

		//this will inserts record in lib tbl and linking tbl
		public function recordDetails() {			
			//get the entity id and col prikey
			$this->getEntityIdAndPriKey();
			
			//get col pri value for particula entitey
			$this->getColPriKeyValFromEntity();

			//insert record in leli
			$this->insertRecordInLELI();

			echo 'success'; //means successfull completion of process
		}
		

		/* 
			* log results in /tmp/destroy-session-debug.log
		*/
		private function logError($msg) {
			$logFile = '/tmp/uploadFile.log';

			$str = $this->dateTime.'-'.$msg. "\n\r";

			//append str to file
			file_put_contents($logFile, $str, FILE_APPEND);

		}

		/* 
			* log error msg in erro table
		*/
		private function logErrorInTbl($arr) {
			list($ec, $em, $ui, $st, $on) = $arr;
			//log error in error table
			$query = "insert into errormsgs(errormsgs_id, errorcode, errormessage, userid, created_date, errstacktrace, reqesturi, completed_by, completed_on, orgname) ";
			$query .= " values(nextval('seq_errormsgs_id'), $ec, $em, $ui, '$this->dateTime', $st, '/uploadfile/uploadfile.php', '$this->dateTime', '$this->dateTime', $on)";
			if($this->loop_flag == '0') {
				$resource = $this->execQueryAndReturnReso($query);
			}
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
				$arr = array(0, pg_last_error($resource), $this->userName, '', '');
				$this->logErrorInTbl($arr);
				echo 'Query failed';
				exit;
			}
			return $resource;
		}



		// public function moveFileTest() {
			
		// 	//create dir if not exists and returns attachment path
		// 	// $uploadPath = $this->checkDirIfExistElseRetPath();

		// 	//finally move file to directory
		// 	$move  = move_uploaded_file($this->tmp_name, "$this->filepath6124/attachment/check.mp4");
		// 	if(!$move){
		// 		//log err
		// 		$error = error_get_last();
		// 		$error =  $error['message'];	

		// 		$msg = 'move_uploaded_file failed: '.$uploadPath.'/'.$this->unique_filename;
				
		// 		$this->logError("Upload check.mp4 failed -> $this->filepath6124/attachment/check.mp4");
		// 		exit;
		// 	}

		// }


	}

	//take connection string from constants file
	require('../constants/php_config.cfg');	

	//run the class functionalites 
	//create the  obj first
	$uploadObj = new uploadFile($master_connection);
	//get tenant connection
	$uploadObj->getTenantConnection();
	//check if already exists if so then exit
	$uploadObj->checkFileExistsElseCreate();
	//record entries 
	$uploadObj->recordDetails();

?>