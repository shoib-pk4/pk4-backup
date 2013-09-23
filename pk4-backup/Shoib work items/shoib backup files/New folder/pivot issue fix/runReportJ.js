
function submitXLForm () {
	document.forms['xlForm'].elements['reptId'].value="${runReport.report.report_id}";
	document.forms['xlForm'].submit();
}

function clearVal(id)
{
  document.getElementById(id).value='';
  document.getElementById(id).style.backgroundColor="white";
  document.getElementById(id).focus();
  document.getElementById(id).style.color="#000000";
  
}


function listCouponPlan(divName,txtId,key,val)
{

	if(key==13)
	{
		return false;
	}
	else if(val.length>=1)
		{
			$.ajax({
			type: "GET",
			url: "${servlet_prefix}/custom/coupons/listCouponPlan.xml?str="+val,
			dataType: "xml",
			success: function (doc)
			{
				var CouponPlan = doc.getElementsByTagName("CouponPlan");
				var CouponPlanName=CouponPlan[0]?CouponPlan[0].getAttribute("CouponPlanName") : null;
				var temp = new Array();
				temp = CouponPlanName.split('~)');
				new AutoSuggest(divName,document.getElementById(txtId),temp);
				}
			});
		}
}

function validCharacters(e, goods)
{
	var key, keychar;
	key = (window.event) ? window.event.keyCode : ((e) ? e.which : null); 
	if (key == null) 
		return true;
		
	keychar = String.fromCharCode(key);
	keychar = keychar.toLowerCase();
	goods = goods.toLowerCase(); 
	if (goods.indexOf(keychar) != -1) 
		return true; 
	if (key==null || key==0 || key==8 || key==9 || key==13 || key==27 || key==32 || key==48 || key==49 || key==50 || key==51 || key==52 || key==53 || key==54 || key==55 || key==56 || key==57 || key==45 || key==33 || key==126 || key==64 || key==95)
		return true; 
	
	return false;
}

function checkMktgProgram(){
	var contactElements = '';
	var url = '';
	var mktgId = document.getElementById('mktList').value;
	var mktgName = document.getElementById('mktListtxt').value;
	
//	alert(mktgId);
//	alert(internId.length);

	if (mktgId!='' && internId!='')
	{	
		$.ajax({
				type: "POST",
				data: "mktgId="+mktgId+"&contCSV="+internId,
				url: "${servlet_prefix}/custom/marketing/linkContactsToMktgProgm.html",
				dataType: "html",				
				success: function (doc)
				{	
					var contCount = internId.length;		
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='Default'><br/><br/><b>"+contCount+"</b> contacts added to <b>"+mktgName+"</b> campaign.<br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("mktgPgm").innerHTML = convertDivContent;
					setTimeout("closemktgalert()",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Contacts are not added to Campaign. Please try again.<br/><br/></td></tr>"; 
					convertDivContent += "</table></center><br/>";
					document.getElementById("mktgPgm").innerHTML = convertDivContent;
					setTimeout("closemktgalert()",1000);
				}
				});	
	}

}
var contId;
var cpnNum;
function checkCouponPlan(){
	var contactElements = '';
	var url = '';
	var couponPlanId = document.getElementById('couponPlanList').value;
	var couponPlanName = document.getElementById('couponPlanListtxt').value;
	//document.getElementById("contactlistbtnForCoupon").disabled=true;
	//document.getElementById("contactlistbtnForCoupon").style.cursor="default";
//	alert(couponPlanId);
//	alert(internId.length);
    if(couponPlanId!='')
	{
	 document.getElementById("info").style.display="block";
	 $('#contactlistbtnForCoupon').attr("disabled", true);
	 document.getElementById("contactlistbtnForCoupon").style.cursor="default";
	 document.getElementById("contactlistbtnForCoupon").style.backgroundColor="#C8D3C0";
	 document.getElementById("couponPlanListtxt").disabled=true;
	if (internId!='')
	{	
		$.ajax({
				type: "POST",
				data: 'planId='+couponPlanId+'&<if runReport.report.entityName == "contacts">contactId<else>opptId</if>='+internId,
				url: "${servlet_prefix}/custom/coupons/generateCouponNumbers.html",
				dataType: "html",				
				success: function (doc)
				{	
					couponDetails=doc.split(',');
					var contCount = internId.length;
					var NoOfCpnsPerOppty;
					var NoOfCpnsPerCont;
					var totCpns;
					if(couponDetails[3]!=0)
						contCount=couponDetails[3];
					if(couponDetails[4]!=""){NoOfCpnsPerOppty=couponDetails[4];}
					if(couponDetails[5]!=""){NoOfCpnsPerCont=couponDetails[5];}
                    if(couponDetails[6]!=""){contId=couponDetails[6];}
					if(couponDetails[7]!=""){cpnNum=couponDetails[7];}
					NoOfCpnsPerOppty=NoOfCpnsPerOppty*contCount;
					NoOfCpnsPerCont=NoOfCpnsPerCont*contCount;
					totCpns='<if runReport.report.entityName == "contacts">'+NoOfCpnsPerCont+'<else>'+NoOfCpnsPerOppty+'</if>'
					var convertDivContent = "<table align='center' border='0'>";
					convertDivContent += "<tr><td class='Default'><b>"+totCpns+"</b> Coupons generated in <b>"+couponPlanName+"</b> Coupon plan.</td></tr></table>"; 
					document.getElementById("info").innerHTML = convertDivContent;
					document.getElementById("features").style.display="block";
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Contacts are not added to Campaign. Please try again.<br/><br/></td></tr>"; 
					convertDivContent += "<tr><td><input class='greenButton' type='button' value='Close' onclick=\"javascript:closeCouponPlanalert();\"/></td></tr></table></center><br/>";
					document.getElementById("couponPlan").innerHTML = convertDivContent;
					
				}
				});
	}
	}
	else
	{
	  alert("Please select the Coupon Plan");
	  document.getElementById("couponPlanListtxt").focus();
	}

}
function printCoupons()
{	
	//top.setUpPageParameters(zcServletPrefix+'/custom/JSON/view/coupon_plan360View.json~id*'+couponPlan,1);
	var couponPlanId = document.getElementById('couponPlanList').value;
	var tempId=document.getElementById('lst').value;
	var smsTemplateId=document.getElementById('lst1').value;
	var templateId=document.getElementById('lst2').value;
	var chkPrint=document.getElementById("chk1");
	var chkSMS=document.getElementById("chk2");
	var chkEmail=document.getElementById("chk3");
	var sendSms=0;
	var sendEmail=0;
	var flag=1;

    var urltxt="/atCRM/custom/coupons/getPrintDateNullCoupons.json?planId="+couponPlanId;
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{
                var CountMain = doc["couponCount"];	
				var Count=CountMain["count"];
				if((!chkPrint.checked)&&(!chkSMS.checked)&&(!chkEmail.checked))
				{
				  alert("Please select any of the option");
				}
				else if(chkPrint.checked&&tempId=='')
				{
				 alert("Please select the Print template");
				}
				else if(chkSMS.checked&&smsTemplateId=='')
				{
				  alert("Please select the SMS template");
				}
				else if(chkEmail.checked&&templateId=='')
				{
				   alert("Please select the E-mail template");
				}
				else if(Count!=0)
				{
						if(document.getElementById("chk1").checked==true && document.getElementById('lst').value!='')
						{
						//window.open("${servlet_prefix}/custom/coupons/printCoupons.html?planId="+couponPlanId);
						var printPage='${servlet_prefix}/custom/coupons/couponTemplateXpander.html?planId='+couponPlanId+'&tempId='+document.getElementById("lst").value+'&print=1&<if runReport.report.entityName == "contacts">contactId<else>opptId</if>='+internId+'&reprint=0';
							window.open(printPage);
						   /* $.ajax({
								type: "POST",
								url: '${servlet_prefix}/custom/coupons/updatePrintedOnDate.html?planId='+couponPlanId+'&print=1&reprint=0&<if runReport.report.entityName == "contacts">contactId<else>opptId</if>='+internId,
								dataType: "html",
								success: function (doc)
								{
								}
								});*/
						 
						}
						
						if(document.getElementById("chk2").checked==true && document.getElementById('lst1').value!='')
						{
							sendSms=1;

							if (couponPlanId!='' && internId!='')
							{	
								$.ajax({
										type: "POST",
										data: "couponPlanId="+couponPlanId+"&contactId="+internId+"&sendSms="+sendSms+"&flag="+flag+"&smsTmpltId="+smsTemplateId+"&sendEmail="+sendEmail+"&templateId="+templateId,
										url: "${servlet_prefix}/custom/coupons/emailCoupons.html",
										dataType: "html",				
										success: function (doc)
										{
											alert("SMS Sent")
										}
										});
								}
						}

						if(document.getElementById("chk3").checked==true && document.getElementById('lst2').value!='')
						{
								sendEmail=1;
								if (couponPlanId!='' && internId!='')
								{	
									$.ajax({
											type: "POST",
											data: "couponPlanId="+couponPlanId+"&contactId="+internId+"&sendEmail="+sendEmail+"&flag="+flag+"&templateId="+templateId+"&sendSms="+sendSms+"&smsTmpltId="+smsTemplateId,
											url: "${servlet_prefix}/custom/coupons/emailCoupons.html",
											dataType: "html",				
											success: function (doc)
											{
												alert("Email Sent")
											}
											});
										}

						}
						closeCouponPlanalert();
				}
							else
							{
							   if(document.getElementById("chk1").checked==true && document.getElementById('lst').value!='')
						           {
								        alert("All the coupons already printed.");
								   }
							}
						}
				});

}

function myKeyPressHandler(e) 
{
	//calcHeight();
	if(e==27)
	{
		closemktgalert();
	}
	else
	{
		return;
	}
}

function displayChart(chkboxId)
{
	if(document.getElementById(chkboxId).checked == true)
	{
		if(document.getElementById("placeholder"))
		{
			document.getElementById("placeholder").style.display = "block";
		}
		if(document.getElementById("choppedData"))
		{
			document.getElementById("choppedData").style.display = "block";
		}
		if(document.getElementById("choices"))
		{
			document.getElementById("choices").style.display = "block";		
		}
	}
	else
	{
		if(document.getElementById("placeholder"))
		{
			document.getElementById("placeholder").style.display = "none";
		}
		if(document.getElementById("choppedData"))
		{
			document.getElementById("choppedData").style.display = "none";
		}
		if(document.getElementById("choices"))
		{
			document.getElementById("choices").style.display = "none";		
		}
	}
}

function replaceVal(Name,id)
{  
	if(Name=='')
	{
		var str=id;
		len=str.length;
		var wordId=str.slice(0,len-3);
		document.getElementById(id).value='2 chars or **';
		document.getElementById(wordId).value='';
	}
}

function linkContactsWithMktgPrgm(){
	document.getElementById("mktgPgm").innerHTML = "";
	$("#mktgPgm").dialog({
			closeOnEscape:true,
			autoOpen:true,
			modal: true,
			title:'Add all these contacts to a Campaign',
			minHeight:120,
		    minWidth:120,	
		    width:300,
			draggable:false
	});		
	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3' width='280px'>";
	convertDivContent+="<tr><td align='center'><div style='border:0px solid red; margin-top:20px;text-align:center;'><font><b>Select existing Campaign</b></font><br/><font style='text-align:center;font-size:10px;color:#999999'>All contacts will be added to this campaign.</font><br /><input type='text'  value='2 chars or *' onfocus='javascript:clearVal(this.id);' style='margin-left:16px;margin-top:5px' onkeyup=\"javascript:listMarketingProgram('autosuggestUsers',this.id,event.keyCode,this.value)\"  onblur=\"javascript:replaceVal(this.value,this.id);\"  id='mktListtxt' name='mktListtxt' size='30'><input type='hidden' name='mktList' id='mktList' size='25' value=''><input type='hidden' name='existname' id='existname' size='25' value=''></div><input style='width:80px;margin-top:15px;margin-left:40px;' class='greenButton' type='button' value='Copy contacts' onclick=\"javascript:checkMktgProgram();\" id='contactlistbutton' name='contactlistbutton'></td></tr>"
	convertDivContent += "</table>";
	document.getElementById("mktgPgm").innerHTML = convertDivContent;	
}

function linkContactsWithCouponPlan(){
	document.getElementById("couponPlan").innerHTML = "";
		$("#couponPlan").dialog({
			closeOnEscape:true,
			autoOpen:true,
			modal: true,
			title:'Generate coupons',
			position:'top',
			minHeight:150,
		    minWidth:420,
		    width:720,
			draggable:true
		});	
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='8' width='680px' align='center'>";
		convertDivContent+="<tr><td align='center' colspan='4'><div style='border:0px solid red; margin-top:20px;text-align:center;'><font><b>Select existing Coupon plan&nbsp&nbsp</b></font><input type='text' style='color:#808080' value='2 chars or **' onfocus='javascript:clearVal(this.id);' style='margin-left:16px;margin-top:5px' onkeyup=\"javascript:listCouponPlan('autosuggestUsers',this.id,event.keyCode,this.value)\"  onblur=\"javascript:replaceVal(this.value,this.id);\"  id='couponPlanListtxt' name='couponPlanListtxt' size='30'><input type='hidden' name='couponPlanList' id='couponPlanList' size='25' value=''><input type='hidden' name='existname' id='existname' size='25' value=''><input style='width:80px;margin-top:15px;margin-left:40px;' class='greenButton' type='button' value='Generate' onclick=\"javascript:checkCouponPlan();\" id='contactlistbtnForCoupon' name='contactlistbtnForCoupon'></div><div id='info' class='default' style='display:none; position:absolute; top:100px; right:300px'>Processing your request...</div></td></tr><tr><td colspan='4'></td></tr></table><div id='features' style='display:none;'><table style='margin-top:5px; border:0px solid red;' cellpadding='8' width='680px' align='center'><tr><td width='7%' align='center'><input type='checkbox' id='chk1' onclick=\'javascript:printCheckbox();\'></td><td width='30%' align='left' style='font-size:15px'><b>Print Coupons</b></td><td width='33%' align='center'><div id='printList' style='display:none;'><select name='lst' id='lst' class='inputFieldClass' ><option value=''>--Select Template--</option><list  runReport.getPrintFormat as e1901><option value='${e1901.xn_template_id}' class='default'>${e1901.templt_name}</option></list></select></div></td><td width='30%' align='center'><div id='printPreview' style='display:none;'><a href=\'javascript:alertPrintPreview();\'>Preview</a></div></td></tr><tr><td colspan='4' style='font-size:12px'>You can print the coupons. Please select a template to print your Coupons.	</td></tr>  <tr><td align='center'><input type='checkbox' id='chk2' onclick=\'javascript:smsCheckbox();\'></td><td align='left' style='font-size:15px'><b>Send through SMS</b></td><td align='center'><div id='smsList' style='display:none;'><select name='lst1' id='lst1' class='inputFieldClass' ><option value=''>--Select Template--</option><list runReport.getSMSformat as e1801><option value='${e1801.mesg_format_id}' class='default'>${e1801.name}</option></list></select></div></td><td align='center'><div id='smsPreview' style='display:none;'><a href=\'javascript:alertSmsPreview();\'>Preview</a></div></td></tr><tr><td colspan='4' style='font-size:12px'>You can send the coupons through SMS. Please select a template to send the Coupons through SMS.</td></tr>  <tr><td align='center'><input type='checkbox' ' id='chk3' onclick=\'javascript:EmailCheckbox();\'></td><td align='left' style='font-size:15px'><b>Send through Email</b></td><td align='center'><div id='emailList' style='display:none;'><select name='lst2' id='lst2' class='inputFieldClass'><option value=''>--Select Template--</option><list runReport.getEmailTemplate as e1701><option value='${e1701.email_templt_id}' class='default'>${e1701.templt_name}</option></list></select></div></td><td align='center'><div id='emailPreview' style='display:none;'><a href=\'javascript:alertEmailPreview();\'>Preview</a></div></td></tr><tr><td colspan='4' style='font-size:12px'> You can send the coupons through E-Mail. Please select a template to send your Coupons through Email.</td></tr><tr><td colspan='4' align='center'><input style='width:80px;margin-top:15px;margin-left:40px;' class='greenButton' type='button' value='Go!!!'  id='goButton' name='goButton' onclick=\'javascript:printCoupons();\'><input style='width:80px;margin-top:15px;margin-left:40px;' class='greenButton' type='button' value='Cancel'  id='cancelButton' name='cancelButton' onclick=\'javascript:closeCouponPlanalert();\'></td></tr>"
		convertDivContent+= "</table></div>";		
		document.getElementById("couponPlan").innerHTML = convertDivContent;
}

function alertPrintPreview(){
var couponPlanId = document.getElementById('couponPlanList').value;
var tempId=document.getElementById('lst').value;
  var urltxt="/atCRM/custom/coupons/getPrintDateNullCoupons.json?planId="+couponPlanId;
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{
                var CountMain = doc["couponCount"];	
				var Count=CountMain["count"];
				if(tempId=='')
				{
				   alert("Please select the Template");
				}
				else if(Count!=0)
				{
					if(document.getElementById('lst').value!='')
					{
						var couponPlanId = document.getElementById('couponPlanList').value;
						document.getElementById("previewPrint").innerHTML = "";
							$("#previewPrint").dialog({
								closeOnEscape:true,
								autoOpen:true,
								modal: true,
								title:'Print Preview',
								minHeight:350,
								minWidth:350,
								width:850,
								draggable:true
							});
							var iframeSrc='${servlet_prefix}/custom/coupons/couponTemplateXpander.html?planId='+couponPlanId+'&tempId='+document.getElementById("lst").value+'&print=0&<if runReport.report.entityName == "contacts">contactId<else>opptId</if>='+internId+'&reprint=0';
							var convertDivContent="<iframe name='template' id='template' valign='top' frameborder='0' src="+iframeSrc+" width='95%' height='95%'></iframe>";
							document.getElementById("previewPrint").innerHTML = convertDivContent;
							//setTimeout("closeAlertPrintPreview()",100000);
						}
				}
					else
				{
					alert("All the coupons printed");
				}
			}
	});
	}
function alertEmailPreview(){

	if(document.getElementById('lst2').value!='')
	{
	  var templId=document.getElementById('lst2').value;
	document.getElementById("previewEmail").innerHTML = "";
		$("#previewEmail").dialog({
			closeOnEscape:true,
			autoOpen:true,
			modal: true,
			title:'Email preview',
			minHeight:350,
		    minWidth:350,
		    width:550,
			draggable:true
		});
		var iframeSrc="${servlet_prefix}/custom/sh1/na1/su1/EmailTemplateThruXpander.html?contId="+contId+"&tempId="+templId+"&couponNo="+cpnNum;
		var convertDivContent="<iframe name='template' id='template' valign='top' frameborder='0' src="+iframeSrc+" width='95%' height='95%'></iframe>";
		document.getElementById("previewEmail").innerHTML = convertDivContent;
		//setTimeout("closeAlertEmailPreview()",100000);
		}
		else
		{
		  alert("Please select the E-mail template");
		}
	}
function alertSmsPreview(){
if(document.getElementById('lst1').value!='')
{
	document.getElementById("previewSms").innerHTML = "";
		$("#previewSms").dialog({
			closeOnEscape:true,
			autoOpen:true,
			modal: true,
			title:'SMS preview',
			minHeight:350,
		    minWidth:350,
		    width:550,
			draggable:true
		});
		var iframeSrc="${servlet_prefix}/custom/SMSTemplate/getSMSTemplateContent.html?id="+document.getElementById('lst1').value+"&contactId="+couponDetails[0]+"&couponNo="+couponDetails[2];
		var convertDivContent="<iframe name='smsTemplate' id='smsTemplate' valign='top' frameborder='0' src="+iframeSrc+" width='95%' height='95%'></iframe>";
		document.getElementById("previewSms").innerHTML = convertDivContent;
		//setTimeout("closeAlertSmsPreview()",100000);
	}
	else
	{
	  alert("Please select the SMS template")
	}
}
function printCheckbox(){
	if(document.getElementById("chk1").checked==true)
	{
		document.getElementById("printList").style.display="block";
		document.getElementById("printPreview").style.display="block";
	}
	else
	{
		document.getElementById("printList").style.display="none";
		document.getElementById("printPreview").style.display="none";
	}
}
function EmailCheckbox(){
	if(document.getElementById("chk3").checked==true)
	{
		document.getElementById("emailList").style.display="block";
		document.getElementById("emailPreview").style.display="block";
	}
	else
	{
		document.getElementById("emailList").style.display="none";
		document.getElementById("emailPreview").style.display="none";
	}
}
function smsCheckbox(){
	if(document.getElementById("chk2").checked==true)
	{
		document.getElementById("smsList").style.display="block";
		document.getElementById("smsPreview").style.display="block";
	}
	else
	{
		document.getElementById("smsList").style.display="none";
		document.getElementById("smsPreview").style.display="none";
	}
}
function closemktgalert(){
	$("#mktgPgm").dialog('close');
}
function closeCouponPlanalert(){
	$("#couponPlan").dialog('close');
	//top.setUpPageParameters(zcServletPrefix+'/custom/JSON/view/coupon_plan360View.json~id*'+couponPlan,1);
}
function closeAlertPrintPreview(){
	$("#previewPrint").dialog('close');
}
function closeAlertEmailPreview(){
	$("#previewEmail").dialog('close');
}
function closeAlertSmsPreview(){
	$("#previewSms").dialog('close');
}
function getEODAlert(){
	$("#eodpopup").dialog('close');
	document.getElementById("eodalertpopup").style.display="block";
	document.getElementById("msg").style.display="none";
	document.getElementById("msg").innerHTML="";
	window.scrollTo(0,0);	
	$("#eodpopup").dialog({
		closeOnEscape:true,
		autoOpen:true,
		stack:true,
		modal:true,
		draggable:false
	});
	$("#eodpopup").dialog( "option", "width", 500 );
	$("#eodpopup").dialog( "option", "position", 'top' );
	$("#eodpopup").dialog('open');		
}
function onEodSubmit(msg){	
	document.getElementById("eodalertpopup").style.display="none";
	document.getElementById("msg").style.display="block";
	document.getElementById("msg").innerHTML = "<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>"+msg+"<span style='font-weight:bold;'>"+name+"</span></div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeEODalert()'/></span></div>";
}
function closeEODalert(){
	document.getElementById("eodalertpopup").style.display="block";
	document.getElementById("msg").style.display="none";
	document.getElementById("msg").innerHTML="";
	$("#eodpopup").dialog('close');
}

function calcHeight()
{
  //find the height of the internal page
  var the_height=parent.document.getElementById('htmlIframe').height;
  if(the_height.substr(-2,2) == "px")
	{
		var t_height = the_height.slice(0,the_height.length-2);
	}
	else
	{
		var t_height = the_height;
	}  
  var new_height = t_height-30;
  //change the height of the iframe
  parent.document.getElementById('htmlIframe').height=new_height+"px";
}
