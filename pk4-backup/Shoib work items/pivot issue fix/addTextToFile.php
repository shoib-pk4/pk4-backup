/* 
	* this will add the text to file,
	* file is create if doesn't exists.
	* using get method
*/

<?php 

 //headers
print_r($_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
header('Content-type: text/xml');
header('Access-Control-Allow-Headers: origin, content-type, accept');

	
	class addTextToFile {
		var $reason, $filename, $txtfile='http://192.168.11.11:81/uploadProcess/fileinfo.txt', $finaltext;
		//get the data
		public function __construct() {
			$this->reason   = $_GET['reason'];
			$this->filename = $_GET['filename'];
		}

		public function addText() {
			//if file doesn't exist then create it
			if(!file_exists($this->txtfile)) {
				file_put_contents($this->filename, '');
			}

			//format the way you want to right text in a file
			$this->finaltext = $this->filename, ' = ', $reason, '\r\n';

			//now add the contents to file
			$status = file_put_contents($this->filename, $this->finaltext, FILE_APPEND | LOCK_EX);

			if($status) {
				echo json_encode('Information recorded.');
			} else {
				echo json_encode('Failed to record info, note it manually!!');
			}
		}
	}

	if(isset($_GET['recordInfo'])) {
		$addTxtObj = new addTextToFile();
		$addTxtObj->addText();
	}
?>