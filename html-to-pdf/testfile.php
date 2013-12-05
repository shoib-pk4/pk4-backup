<form enctype='multiplar/form-data' method='post' action='testfile.php'>
	<input type='file' name='files[]' />
	<input type='file' name='files[]' />
	<input type='file' name='files[]' />
	<input type='file' name='files[]' />
	<input type='submit' name='submit' value='upload' />
</form>

<?php 
	if(isset($_POST['submit'])) {
		print_r($_FILES['files']);
	}
?>