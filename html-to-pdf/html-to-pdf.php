<?php 
/*
	* Aim
		#.Convert html data to pdf and send it to mail
		#.Gets data via post.
	* Params
		#.Html data, mail id to which pdf to be sent.
*/
	// class htmlToPdf extends DOMPDF() {

	// 	var $htmlData, $toAddr, $old_limit;

	// 	//get the form data here
	// 	public function __construct() {

	// 		//formatted html string
	// 		$this->htmlData = stripslashes('<h1> shoib mohammed </h1>'); //stripslashes($_POST['html']);
			
	// 		//pdf to be sent
	// 		$this->toAddr   = 'shoib@impelcrm.in';

	// 		//set memmory limit
	// 		$this->old_limit = ini_set("memory_limit", "16M");
	// 	}

				

	// }

	//get the data from form post
	// $html = '<table width="500%" height="500%"><tbody><tr><th> Shoib</th> <th> Mohammed A </th></tr><tr><td>First Name</td><td>Last Name</td></tr></tbody></table>'; //stripslashes($_POST['html']);

// $html = '<table width="50%" height="50%" border="1"><tr><th>Shoib Mohammed A</th></tr></table>';

	set_time_limit(3600);
	
	$html ='<table width="50%" height="50%" border="1"> <tbody> <tr> <td width="100%" height="100%"> <table width="100%" height="35%" align="center" class="tableBorder"> <tbody> <tr> <td width="60%" class="tdStyle" rowspan="7"><b>ERKADI SYSTEMS</b><br> PLOT NO. 109,1 PHASE, ELECTRONIC CITY<br> HOSUR ROAD,BANGLORE-560 100<br> KARNATAKA,INDIA<br> TEL : 91 80 2852 2442/3<br> FAX : 91 80 2852 2441<br> E-Mail : logistics@erkadi.com</td> <td width="20%" class="tdTop">Invoice No.</td> <td width="20%" class="tdTop">Dated</td> </tr> <tr> <td width="20%" class="tdBottom"></td> <td width="20%" class="tdBottom"></td> </tr> <tr> <td width="20%" class="tdTop">Delivey Note</td> <td width="20%" class="tdTop">Mode/Terms of payment</td> </tr> <tr> <td width="20%" class="tdBottom"></td> <td width="20%" class="tdBottom"> Rs.</td> </tr> <tr> <td width="20%" class="tdTop">Suppliers Ref.</td> <td width="20%" class="tdTop">Other Reference(s)</td> </tr> <tr> <td width="20%" class="tdBottom" rowspan="2"></td> <td width="20%" class="tdBottom" rowspan="2"></td> </tr> <tr> </tr> <tr> <td width="60%" class="tdStyle" rowspan="10">Buyer<br> <b></b><br> <br> ,-<br> Mob : </td> <td width="20%" class="tdTop">Buyers Order No.</td> <td width="20%" class="tdTop">Dated</td> </tr> <tr> <td width="20%" class="tdBottom"></td> <td width="20%" class="tdBottom"></td> </tr> <tr> <td width="20%" class="tdTop">Despatch Document No.</td> <td width="20%" class="tdTop">Dated</td> </tr> <tr> <td width="20%" class="tdBottom"></td> <td width="20%" class="tdBottom"> </td> </tr> <tr> <td width="20%" class="tdTop">Despatched through</td> <td width="20%" class="tdTop">Destination</td> </tr> <tr> <td width="20%" class="tdBottom"></td> <td width="20%" class="tdBottom"></td> </tr> <tr> <td class="tdStyle" colspan="2" rowspan="4">Terms of Delivery<br> </td> <td width="20%"> </td> </tr> </tbody> </table> <table width="100%" height="35%" class="tableBorder" style="page-break-before: always;"> <tbody> <tr> <th width="7%" class="tdStyle">Sl.No</th> <th width="25%" class="tdStyle">Description of Goods</th> <th width="9%" class="tdStyle">Product Id</th> <th width="12%" class="tdStyle">Part No.</th> <th width="12%" class="tdStyle">Quantity</th> <th width="13%" class="tdStyle">Rate</th> <th width="8%" class="tdStyle">Disc %</th> <th width="14%" class="tdStyle">Amount</th> </tr> <tr> <td align="right" class="tdleft"></td> <td align="left" class="tdleft"></td> <td align="right" class="tdleft"></td> <input type="hidden" value="" name="0-401:-402"> <input type="hidden" value="" name="0-401:-419"> <td align="right" class="tdleft"></td> <td align="right" class="tdleft"></td> <td align="right" class="tdleft"></td> <td align="right" class="tdleft"></td> <td align="right" class="tdleft"></td> </tr> <tr> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> </tr> <tr> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> </tr> <tr> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> </tr> <tr> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> </tr> <tr> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" class="tdleft"> </td> <td class="tdleft"> </td> <td align="right" style="font-weight:bold" class="tdleft"></td> </tr> <tr> <td class="tdStyle"> </td> <td align="right" style="font-weight:bold" class="tdStyle">Total</td> <td class="tdStyle"> </td> <td class="tdStyle"> </td> <td class="tdStyle"> </td> <td class="tdStyle"> </td> <td class="tdStyle"> </td> <td align="right" style="font-weight:bold" class="tdStyle"></td> </tr> </tbody> </table> <table width="100%" height="30%" class="tableBorder" style="page-break-before: always;"> <tbody> <tr> <td width="50%" style="font-size:14px">Amount Chargeable(In words)</td> <td width="50%" align="right" style="font-size:14px">E. &amp; O.E</td> </tr> <tr> <td width="50%" id="rupeesWord"> </td> <script> var total=; amtInWords(total); </script> <td width="50%"> </td> </tr> <tr> <td width="50%"></td> <td width="50%"> </td> </tr> <tr> <td width="50%"> </td> <td width="50%"> </td> </tr> <tr> <td align="left" style="font-size:12px" colspan="2">Remarks</td> </tr> <tr> <td style="font-size:12px" colspan="2">On account of above item sold to ,</td> </tr> <tr> <td style="font-size:12px" colspan="2">Invoice No. , dated </td> </tr> <tr> <td width="50%" style="font-size:12px">Companys VAT TIN : 29600135482</td> <td width="50%"> </td> </tr> <tr> <td width="50%" style="font-size:12px">Companys CST No. : 90361740</td> <td width="50%" style="font-size:12px"> </td> </tr> <tr> <td style="font-size:12px">Companys Service Tax No. : AAAFE7621HST001</td> <td width="50%"> </td> </tr> <tr> <td style="font-size:12px">Companys PAN: AAAFE7621H</td> <td width="50%"> </td> </tr> <tr> <td width="50%" style="font-size:12px" rowspan="2">Declaration<br> 1.Payment on delivery.Bills not paid within 7 days of issue will carry interest @2% per month with monthly rests. 2.All payments should be by Cheque orDraft payable to ERKADI SYSTEMS, Banglore.3)For cheques/drafts drawn on banks outside Banglore collecting charges are extra at 0.5%(minmum rs.20/-).</td> <td width="50%"> </td> </tr> <tr> <td width="50%"> <table style="page-break-before: always;" width="100%" height="50%" style="border-collapse:collapse"> <tbody> <tr> <td width="-" 100%""=""> </td> </tr> </tbody> </table> <table style="page-break-before: always;" width="100%" height="50%" style="border-collapse:collapse" class="tdStyle"> <tbody> <tr> <td width="-" 100%""="" valign="top" height="50%" align="right">For ERKADI SYSTEMS</td> </tr> <tr> <td width="100%" valign="bottom" height="50%" align="right">Authorised Signatory</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table  style="page-break-before: always;" width="100%" height="2%" align="center" style="border:0px;border-collapse:collapse"> <tbody> <tr> <td width="100%" align="center"><font size="3px" face="Arial">SUBJECTS TO ONLY THE HIGHCOURT AT BANGLORES JURISDICTION</font></td> </tr> </tbody> </table> </td> </tr> </tbody> </table>';
	$to   = 'shoib@impelcrm.in';

	//include dompdf convertion  class
	require_once("dompdf_config.inc.php");

	//convert html to pdf
	$dompdf = new DOMPDF();
	$dompdf->load_html($html);
	$dompdf->render();
	 
	// $output = $dompdf->output();
	// file_put_contents("/path/to/file.pdf", $output);
	$dompdf->stream("sample.pdf");


?>