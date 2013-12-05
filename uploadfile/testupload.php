<?PHP 

	class chunkUpload {
		var $fileName, $chunkCount, $org, $userId, $userFolder, $chunkFolder, $chunkStorage;
		var $chunk;

		public function __construct() {
			$this->fileName   = $_POST['fileName'];
			$this->chunkCount = $_POST['fileNum'];
			$this->org        = $_POST['org'];
			$this->userId     = $_POST['userId'];
			$this->chunk      = $_POST['image'];
		}

		public function chunks() {
			//create a user folder folder by user id 
			if(!file_exists($this->userId)) {
				mkdir($this->userId, 0777, true);
				// chmod($this->userId, 0777);
			}

			$this->userFolder = $this->userId.'/';

			//check if folder exists by file name else create one
			//actuall chunks are stored here
			if(!file_exists($this->userFolder.$this->fileName)) {
				mkdir($this->userFolder.$this->fileName, 0777, true);
			}

			$this->chunkFolder =  $this->userFolder.$this->fileName. '/';

			//create chunk storage file
			$this->chunkStorage = $this->chunkFolder.'chunks.txt';
			if(!file_exists($this->chunkStorage)) {
				file_put_contents($this->chunkStorage, '');
			}

		}

		//conver chunk to image if finished else append to chunk file
		//if converted to file then record activity
		public function converToImageIfFinished() {

			file_put_contents($this->chunkStorage, $this->chunk, FILE_APPEND);

			if($this->chunkCount == 1) {
				rename($this->chunkStorage, $this->fileName);
				//do rest of task, think about this later	
			} 
		}
	}

?>
