<?PHP 
	// if(isset($_POST['upload'])) {
		$str = '';
		echo '<pre>';
		print_r($_FILES);
		echo '</pre>';
		foreach ($_FILES as $key => $value) {
			$str .= $key . '----'. implode(',', $value);
		}
		echo 'success';
		file_put_contents('post.txt', $str);
	// }
?>

<form method='post' enctype='multipart/form-data' action="http://sys.impelcrm.in:81/uploadfile/testupload.php" > 
	<input type='file' name='file' />
	<input type='submit' name='upload' />
</form>