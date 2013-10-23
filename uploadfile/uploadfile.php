<?php 
	class uploadFile {

		var $mq, $orig_filename, $guid, $unique_filename, $entity_name, $master_connection, $org_id;
		var $filepath = '/atCRM/appData/org_', $entity_list_id, $col_prikey, $col_prikey_val_for_entity;
		var $user_id;

		//get the post values
		public function __construct($m_con) {

			$this->mq            	 = 'KZQGVNs7DRMAWT7Rov+fmA=='; //$_POST['mq']; //get mq
			$this->orig_filename 	 = 'abc.png'; //$_POST['fileName']; //get file name
			$this->guid          	 = 'KZQGVNs7DRMAWT7Rov+fmA=='; //$_POST['guid']; //get guid
			$this->userName      	 = 'kishore@impelcrm.in'; //$_POST['userName']; //get user name
			$this->entity_name       = 'contact'; //$_POST['entity']; //get entity name
			$this->filesize   	     = 1000; //$_FILES['file']['size'];
			$this->master_connection = $m_con;
			ini_alter('date.timezone','Asia/Calcutta'); //set the timezone

			$this->run_id = rand(1000000, 9999999);
			$this->my_pid = getmypid ();
			$this->dateTime = date('Y-m-d H:i:s'); //get the current date and time
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
			
			$querygetTenantDtsSQL = "SELECT tenant_master.org_name, tenant_master.jdbc_url, mt_user_master.user_id FROM tenant_master,mt_user_master WHERE mt_user_master.tenant_id = tenant_master.tenant_id AND mt_user_master.user_name = '".$this->userName."'";
			$getTenantDtsSQL = pg_query($conn_db_master, $querygetTenantDtsSQL);
			if($getTenantDtsSQL === FALSE) {
				$msg =  $this->dateTime . ' Selecting tenant query failed. Query= '.$querygetTenantDtsSQL;
				$this->logError($msg);
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
				exit;
			}

			//tennant connection
			$this->conn_db_tennant = @pg_connect($this->conn_string_tennant);
			if (!$this->conn_db_tennant) {
				$msg =  $this->dateTime . ' Connecting tenant failed= '.$conn_string_tennant;
				$this->logError($msg);
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
			$file       = $_FILES['file']['tmp_name'];
			$file_error = $_FILES['file']['error'];			

			if(!move_uploaded_file($this->unique_filename, "$uploadPath/$this->unique_filename")){
				//log err
				$msg = 'move_uploaded_file failed: ';
				foreach ($_FILES["file"]["error"] as $key => $error) { 
					$msg .= $key.'-->'.$error;					
				}
				$this->logError('File upload failed= '. $msg);
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
			$attachment_path = '/'.$org_path.'/attachment';

			//create dir if not exits
			if(!file_exists($org_path)) {	
				//create org recursive dir with full permission
				if(!mkdir($org_path, 0777, true)) {
					//log err
					$this->logError('Org directory creation failed= '. $org_path);
					exit;
				}
				//create attachment recursive dir with full permission
				if(!mkdir($attachment_path, 0777, true)) {
					//log err
					$this->logError('Attachment directory creation failed= '. $attachment_path);
					exit;
				}

				return $attachment_path; //dont go further just return
			} 

			//check whether attachment dir exists
			if(!file_exists($attachment_path)) { 
				//create recursive dir with full permission
				if(!mkdir($attachment_path, 0777, true)) {
					//log err
					$this->logError('Attachment directory creation failed= '. $attachment_path);
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
			if($count > 0) {
				$this->entity_list_id = $result['EntityList_Id'];
				$this->col_prikey = $result['col_prikey'];
			} else { //then create entit list id and return created entity list id
				list($this->entity_list_id, $this->col_prikey) = $this->createEntity();
			}

		}

		/* 
			* insert record in LELI = lnk_entity_lib_items
		*/
		private function insertRecordInLELI() {
			$query  = "insert into lnk_entity_lib_items(lnk_entity_lib_items_id, entitylist, lib_item, primay_key_value, orgname, inactive, created_date, created_by, modified_date, modified_by, type) ";
			$query .= "values('', $this->entity_list_id, $this->lib_item, $this->lnk_entity_lib_items, $this->orgname, 0, CURRENT_TIMESTAMP, '', CURRENT_TIMESTAMP, '', '')";
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
				$col_prikey_val_for_entity = $result[$this->col_prikey];
			} 

			$this->col_prikey_val_for_entity;
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
			$query  = "insert into lib_item(lib_item_Id, Name,  Description, Path, CreateDate, CreatedBy_Id, ItemOwner_Id, ContentType_Id, orig_file_name, orgname, download_status, size_in_bytes, data_source, created_by_portal_user) ";
			$query .= "values(nextval('seq_lib_item'), '$this->unique_filename', '$this->unique_filename', '$this->filepath$this->org_id', CURRENT_TIMESTAMP, $this->userid, 0,0 , '$this->orig_filename', $this->org_id, 'download_status', $this->filesize, 'data_source', 0)"; 
			$resource = $this->execQueryAndReturnReso($query);

			$lib_item = pg_fetch_assoc($resource); 

			//set lib item, its global to class
			$this->lib_item = $entity_id['lib_item'];

		}

		/* 
			* create a entity , and return the created list id
		*/
		private function createEntity() {
			$query = "insert into EntityList  select * from EntityList where EntityName='".$this->entity_name."' and orgname is null";
			// $query .= "values(EntityList_Id, $this->entity_name, Description, Icon, 0, desc_name, is_custom_object, cust_obj_of_entt, $this->orgname, supports_udef, CURRENT_TIMESTAMP, api_name, include_on_impeltouch, renamed_plural, col_prikey, col_most_significant, col_orgname, col_inactive, col_territory, $this->guid, entt_usage_type, short_name, sync_order, related_entt_csv, detail_entity, impel_touch_driver_col_api_name, cols_for_search, col_created_by, col_created_date, col_modified_by, col_modified_date, col_recent_date, col_recent_date_reason, col_data_source, col_default_fk, col_additional_condition, col_addtl_cond_for_view, impel_touch_sync_immediate)";
			$resource = $this->execQueryAndReturnReso($query);

			//get the inserted record details
			$result = pg_fetch_assoc($resource); 
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

		/* 
			* validate query execution if failed then log err
		*/
		private function execQueryAndReturnReso($query) {
			//now execute query
			$resource = pg_query($this->conn_db_tennant, $query);
			//if failed to insert in lib_item, make a log entry & stop
			if(!$resource) { 
				$this->logError('Query Failed= '. $query);
				exit;
			}
			return $resource;
		}


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