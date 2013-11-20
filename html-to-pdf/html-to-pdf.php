<?php 
	/* 
		* Aim, convert html to pdf and send as attachment via email

		* Flow
			* Getting html as string, converting html string to html file then converting html file pdf
			* Finally  sending pdf via attachment through email.

		* POST Params 
			* html string
			* to email addr
			* from email addr
			* subject
			* message body

		* Tools using
			* wkhtmltopdf, by webkit #https://github.com/pdfkit/pdfkit/wiki/Installing-WKHTMLTOPDF
			* it is installed on server
	*/

	class sendPdfAsAttachment {
		var $dir, $htmlFileName, $pdfFileName, $to, $from, $msg, $sub, $htmlStr, $htmFile, $pdfFile;

		//get the necessary fields
		public function __construct() {

			//set limits
			set_time_limit(3600);
			ini_set('memory_limit', '1000M');

			$this->dir = 'tmpPdfFolder/';
			$this->htmlFileName = $this->generateRandomString().'.html';
			$this->pdfFileName = $this->generateRandomString().'.pdf';
			$this->to = 'shoib@impelcrm.in';
			$this->from = 'venkatesha@impelcrm.in';
			$this->msg = 'Sending pdf as attachment';
			$this->sub = 'Pdf';
			$this->name = 'Shoib Mohammed A';
			$this->replyTo = 'venkatesha@impelcrm.in';
			$this->htmlStr = '<html><body><table width="875px" cellspacing="0" cellpadding="5" border="0" align="left" style="border:#eaeaea solid 7px;margin-top:0px">    <tbody><tr><td width="405px" height="202px" align="right"><img width="405px" height="202px" src="http://prod.impelcrm.in/atCRM/custom/EmailTemplate/readImgFile.html?imgfilename=PRIN-LOGOS-Master-File.jpg&amp;mq=fLolsRkjaKG8UGYWofjTbzd4068nlXs1" alt=""></td><td width="470px" height="202px" align="left"><img width="470px" height="202px" src="images/image05.png" alt=""></td></tr><tr valign="top" bgcolor="#00232F"><td height="20px" colspan="2"><table width="95px" height="19px" cellspacing="0" border="0" align="right">    <tbody><tr><td width="93px"><div align="center"><a href="http://prod.impelcrm.in/atCRM/custom/govardhan/linkUpdaterEmail.html?urid=5558222&amp;mq=fLolsRkjaKG8UGYWofjTbzd4068nlXs1" target="#"><img width="163px" height="30px" src="images/contactUs.jpg" alt=""></a></div></td></tr>	    </tbody></table></td></tr><tr><td width="875px" colspan="2" style="padding-right:10px;padding-left:15px;text-align:justify;font-size:12px;background-color:#eaeaea;font-family:Century Gothic;margin-top:2px;border:none">	<p><span style="font-size:14px;font-family:Century Gothic"><strong>Location Map of Tricone Towers:</strong></span></p> </td></tr><tr style="padding-right:10px;padding-left:15px;text-align:justify;font-size:12px;background-color:#eaeaea;font-family:Century Gothic;margin-top:2px;border:none" >	<td height="219px" align="center" colspan="2"><img width="600px" height="300px" src="images/Map.png" alt=""></td></tr><tr><td width="875px" colspan="2" style="padding-right:10px;padding-left:15px;text-align:justify;font-size:12px;background-color:#eaeaea;font-family:Century Gothic;margin-top:2px;border:none">	<p><span style="font-size:14px;font-family:Century Gothic">PRIN offers you multiple opportunities to own luxury properties in India. From time to time, we also present you Structured Products that let you take advantage of the opportunity by making byte sized investments.  We are glad to present here an opportunity to invest in a fully secure Debenture with a quarterly interest payment of 18.65% (20% p.a. on an annualized basis). Principal  repayment on the 24th month.</span></p>    <p><span style="font-size:14px;font-family:Century Gothic"><strong>PRIN member advantage :</strong><br/>- Deal so exclusive that it is not available outside the Network.<br/>- Direct interaction with the Sponsor/ owner for deal closure.<br/>- A solution focused on the members with complete transparency.<br/>- End to end transaction assistance.<br/>- End to end mortgage advice and assistance.</span></p>   <table width="100%" cellspacing="2" cellpadding="2" border="0" align="center">    <tbody><tr>	<td height="20px" bgcolor="#00232F" colspan="2" style="padding-right:10px;padding-left:15px;text-align:justify;font-size:14px;background-color:#00232f;margin:0px;font-family:Century Gothic;margin-top:2px;border:none">	&nbsp;</td>	</tr>	<tr bgcolor="white" width="100%" align="right">	<td height="219px" align="center" colspan="2"><img align="center" width="555px" height="259px" src="images/image071.png" alt=""></td>	</tr>	<tr>	<td height="20px" bgcolor="white" colspan="2" style="padding-right:10px;padding-left:15px;text-align:justify;font-size:14px;background-color:#00232f;margin:0px;font-family:Century Gothic;margin-top:2px;border:none">	&nbsp;</td>	</tr>    </tbody>    </table><!-- ---------------------------------------------------------	 --><p><span style="font-size:14px;font-family:Century Gothic"><strong>Deal Summary – </strong><br/>Antartica Properties Company Ltd (APCL) is a subsidiary of Tricone Hospitality Singapore Pte Ltd.  <br/>Tricone Hospitality Singapore Pte Ltd in turn is a subsidiary of Tricone Development Singapore Pte Ltd (TDSPL) which is an investment holding company for making real estate and hospitality related investments in India.<br/>TDSPL is capitalized until the extent of USD 66 Million and key investor include Brevan HowardMaster Fund, UK, Simpson Financial, Hong Kong and other marquee HNIs<br/><br/>APCL is planning to raise funds upto Rs.40 cores through the issuance of Secured Non Convertible Debentures (NCDs) that re fully redeemable on maturity, unlisted and unrated.<br/><br/>The fund raised will be used:<br/>Upto INR 20 crores for business expansion and / or general business/corporate purposes.<br/>Upto INR 20 crores for retirement of credit obligations of Punjab National BankDuring the period the proceeds are not utilized fully, the Company may, during such interim period, keep the funds invested in mutual funds and/ or such other avenues as the board of the Company may approve.<br/><br/>The Total Debt of APCL is 68.88 crores as at 31.12.2012.</span></p> <p><span style="font-size:14px;font-family:Century Gothic"><strong>Key Highlights of the NCD offer:</strong></span></p>   <table border="1" width="100%" cellspacing="0" cellpadding="2" style="font-family:Century Gothic;font-size:12px;">    <tbody>	<tr><td width="40%">Issuer/Group</td><td width="60%">SPV of Tricone Group – Antartica Properties Company Ltd</td>	</tr><tr><td width="40%">Instrument</td><td width="60%">Secured, redeemable, unlisted NCD. Face Value (FV) Rs 50,00,000/- ( Rupees Fifty lacs only) Applicable only for Resident Indians</td>	</tr><tr><td width="40%">Size of Issue</td><td width="60%">35 Crores + (with a green shoe option of another Rs. 5 Crores)</td>	</tr><tr><td width="40%">Issue Price</td><td width="60%">Par</td>	</tr><tr><td width="40%">Coupon/ yield</td><td width="60%">Coupon of 18.65% payable quarterly. Effective yield – 20% p.a.</td>	</tr><tr><td width="40%">Tenor/ Maturity</td><td width="60%">2 Year / 24 months from the Allotment Date</td>	</tr><tr><td width="40%">Redemption price</td><td width="60%">Par ( one time in full repayment)</td>	</tr><tr><td width="40%">Trading</td><td width="60%">Unlisted and redeemable on maturity</td>	</tr><tr><td width="40%">Collateral</td><td width="60%">First Pari Passu equitable mortgage (Primary Collateral) on APCL property measuring 4536 Sq. Mtr located at Tricone Towers, Mayur Vihar, New Delhi.  The Super Structure constructed thereon (Immovable Property) already under equitable mortgage with Punjab National Bank.</td>	</tr><tr><td width="40%">Additional Security</td><td width="60%">Post Dated Cheques for the Redemption Price and Interest.</td>	</tr><tr><td width="40%">Escrow</td><td width="60%">Escrow arrange of sales realized from the security</td>	</tr><tr><td width="40%">Trustees</td><td width="60%">IDB I Trusteeship Services Ltd</td>	</tr><tr><td width="40%">Rating</td><td width="60%">Unrated</td>	</tr><tr><td width="40%">Form of Issue/ Holding</td><td width="60%">Dematerialised (Demat)</td>	</tr><tr><td width="40%">Documentation verification</td><td width="60%">Trilegal is legal advisor for the issue</td>	</tr><tr><td width="40%">Execution Risk</td><td width="60%">Minimal as Service apartments are ready to occupy or advance stage of completion.</td>	</tr></tbody></table><!-- ---------------------------------------------------------	 --> 	<p></p></td></tr><tr><td bgcolor="#EAEAEA" colspan="2" style="margin:2px 0px 0px;border:none;background-color:rgb(234,234,234);padding-right:10px"><p><span style="font-size:14px;font-family:Century Gothic"><strong>Contact</strong></span></p><p><span style="font-size:12px;font-family:Century Gothic">The potential investors and/or their representatives/ lawyers/ employees may not contact the Company directly until the MoU is executed. All queries regarding the transaction are to be directed to MBA. Please contact the following for any queries with respect to the transaction:</span></p><p><span style="font-size:12px;font-family:Century Gothic">Deepak S Varghese, Director, <span class="il">Moonbeam</span> Advisory Pvt Ltd<br>	Mobile: +91 8123000440 <br>Email: deepak@moonbeam.in <br>	Exclusive Transparent Trusted Network of Global Indian HNI\'s</span></p>	<p><span style="font-size:14px;font-family:Century Gothic"><strong>Portfolio companies:</strong></span></p></td></tr><tr bgcolor="#EAEAEA"><td height="45px" colspan="2"><p align="center"><a href="http://prod.impelcrm.in/atCRM/custom/govardhan/linkUpdaterEmail.html?urid=5558225&amp;mq=fLolsRkjaKG8UGYWofjTbzd4068nlXs1" target="_blank"><img width="840px" height="45px" src="http://prod.impelcrm.in/atCRM/custom/EmailTemplate/readImgFile.html?imgfilename=portfolio.jpg&amp;mq=fLolsRkjaKG8UGYWofjTbzd4068nlXs1" alt=""></a></p></td></tr>   <tr bgcolor="#EAEAEA"><td colspan="2"><p><span style="font-size:14px;font-family:Century Gothic"><strong>Disclaimer</strong></span></p><p align="justify"><span style="font-size:9px;font-family:Century Gothic">The confidential summary of the investment opportunity (\'Teaser\') contains information that is confidential and is prepared exclusively for the benefit and internal use of the recipients. The Teaser does not carry any right of publication or disclosure to any other party. Should this Teaser (through the act or default of the recipient) reach other persons without our written consent, the recipient will indemnify MBA and its group companies against any damage or loss or other liabilities (including all costs) which they may suffer as a result. In providing this Teaser, MBA undertake no obligation to invite the recipient to proceed with the further investigation of the investment opportunity, if any, nor to provide the recipient with any additional information, nor otherwise to negotiate with or treat with the recipient in respect of those opportunities. Neither this Teaser nor any of its contents may be used for any other purpose without prior written consent of MBA. The information in this Teaser reflects prevailing conditions as of this date, all of which are, accordingly, subject to change. No representation, warranty or undertaking (whether express or implied) is made or given by or on behalf of MBA. In preparing this Teaser, we have relied upon and assumed, without independent verification, the accuracy and completeness of information obtained from various sources. The information contained herein is based on subjective analysis. Accordingly, neither MBA nor any of its employees can be held liable for any error or misrepresentation and accordingly do not provide any assurance that the projected results will be attained in any such information and ACM and its employees do not accept any responsibility or liability with regard to the Teaser or its contents. MBA strongly advices its recipients to seek professional advice to assess suitability with regard to their specific circumstance before making a decision.</span></p></td></tr><tr valign="top" bgcolor="#000000" align="center"><td height="10px" colspan="2"><div align="center"><span style="color:#333333;font-size:9px;font-family:Century Gothic;color:#ffffff">(c) 2013 Copyright <span class="il">Moonbeam</span> Advisory. All Rights Reserved.</span></div></td></tr>    </tbody></table></body></html>';
			$this->path = $_SERVER['DOCUMENT_ROOT']."/html-to-pdf/".$this->dir;
		}

		//create tmp folder, where html, pdf files created and stored for a while
		public function createTmpFolder () {
			if(!file_exists($this->dir)) {
				mkdir($this->dir, 0777, true);
			}
		}

		//create unique html file with full permissions
		public function createHtmlFile() {
			while(file_exists($this->dir.$this->htmlFileName) == true) {
				$this->htmlFileName = $this->generateRandomString().'.html';
			}
			$this->htmFile = $this->dir.$this->htmlFileName;

			//create html file here
			file_put_contents($this->htmFile, $this->htmlStr); 
			//set full permission
			chmod($this->htmFile, 0777); //give full permission
		}

		//create unique pdf file with full permission and with desired contents
		public function createPdfFile() {
			while(file_exists($this->dir.$this->pdfFileName) == true) {
				$this->pdfFileName = $this->generateRandomString().'.pdf';
			}
			$this->pdfFile = $this->dir.$this->pdfFileName;
			ob_start();
			//run wkhtmltopdf  via shell using php
			$cmd    = "/wkhtmltopdf/wkhtmltopdf-i386 $this->htmFile /var/www/html/html-to-pdf/$this->pdfFile > file.log";
			$result = exec($cmd);	 //execute

			//because exec taking going asycrounous
			sleep(2); 
			//give full permission
			chmod($this->pdfFile, 0777); 
			ob_clean();
		}

		public function emailPdf() {
			if(!file_exists($this->pdfFile)) {
				$this->logError('File not found= '. $this->pdfFile);
				exit;
			} 
			$this->mail_attachment($this->pdfFileName, $this->path, $this->to, $this->from, $this->name, $this->replyTo, $this->sub, $this->msg);
		}

		public function deleteFiles() {
			//once file has been sent delete thos files
			if(file_exists($this->htmFile)) {
				unlink($this->htmFile);
			}
			if(file_exists($this->pdfFile)) {
				unlink($this->pdfFile);
			}
		}

		//code copied from http://www.finalwebsites.com/forums/topic/php-e-mail-attachment-script
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
		    $header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
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
			$msg = $date. 'Error: '. $msg . ' Process Id: '.$my_pid."\r\n";
			file_put_contents('/tmp/pdf_attachment.log', $msg);
		}

		//end of class

	}

	//allow from required ips only
	//perform operation here
	$host = $_SERVER['SERVER_ADDR'];	
	//validate origin url
	if(preg_match('/^192.168/', $host) || preg_match('/^10/', $host)) {	 

		//create a class obj
		$sendPdf = new sendPdfAsAttachment();
		$sendPdf->createTmpFolder();
		$sendPdf->createHtmlFile();
		$sendPdf->createPdfFile();
		$sendPdf->emailPdf();
		$sendPdf->deleteFiles();
	}
	
?>