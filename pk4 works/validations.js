function validateAddLead(formName,id)
{
  
	if(formName=="quickAdd-form")
	{		
		var leadForm =  document.forms[formName]; 
		//Lead Name = 'Lead:' + 'Contact Display name' + 'Account name'
		var contFN="";
		var contMN="";
		var contLN="";
		var acctNm="";
		if((document.getElementById('QA_0-201-209'))&&document.getElementById('QA_0-201-209').value!="2 chars or **")contFN = document.getElementById('QA_0-201-209').value;
		if(document.getElementById('QA_0-201-210'))contMN = " " + document.getElementById('QA_0-201-210').value;
		if(document.getElementById('QA_0-201-211'))contLN = " " + document.getElementById('QA_0-201-211').value;
		if(contMN.length > 1)
			contDN=contFN+contMN+contLN;
		else
			contDN=contFN+contLN;

		if((document.getElementById('QA_0-1-3'))&&document.getElementById('QA_0-1-3').value!="2 chars or **")acctNm = " " + document.getElementById('QA_0-1-3').value
		
		if(document.getElementById('QA_0-9001').value != "Email")
		{
			document.getElementById('QA_0-801-803').value='Lead: ' + contDN + acctNm;
		}

		if(document.getElementById('QA_0-801-842')&&document.getElementById('QA_0-5301'))
		{
			var srcId='';
			var opptySrc = document.getElementById('QA_0-801-842').value;
			var chkForColon = opptySrc.indexOf(':');
			if(chkForColon == -1)
			{
				document.getElementById('QA_0-5301').value = document.getElementById('QA_0-5301').value;
				document.getElementById('QA_0-801-842').value = document.getElementById('QA_0-801-842').value;
			}
			else
			{
				var srcId = opptySrc.split(':');
				document.getElementById('QA_0-801-842').value = srcId[0];
				document.getElementById('QA_0-5301').value = srcId[1];
			}
		}

		//Contact related
		if((document.getElementById('QA_0-201-202').value!="")&&(document.getElementById('QA_0-801-802').value==""))
		{
			document.getElementById('QA_0-201-209').value="";		
			document.getElementById('QA_0-601-609').value=document.getElementById('QA_0-201-202').value;
			document.getElementById('QA_0-5501-5509').value=document.getElementById('QA_0-201-202').value;
			document.getElementById('QA_0-201-202').value="";
		}
		//Account related
		if((document.getElementById('QA_0-1-2').value!="")&&(document.getElementById('QA_0-801-802').value==""))
		{
			if(document.getElementById('QA_0-1-3'))document.getElementById('QA_0-1-3').value="";
			document.getElementById('QA_0-601-603').value=document.getElementById('QA_0-1-2').value;
			document.getElementById('QA_0-1001-1003').value=document.getElementById('QA_0-1-2').value;
			document.getElementById('QA_0-1-2').value="";
		}

		if(((document.getElementById('QA_0-201-346')&&(document.getElementById('QA_0-201-346').value!="")) || (document.getElementById('QA_0-201-402')&&document.getElementById('QA_0-201-402').value!=""))&&(document.getElementById('QA_0-201-209').value!="")&&(document.getElementById('QA_0-2701-2881').value!=""))
		{
			var pri_email="";
			var mobile_phone="";
			if(document.getElementById('QA_0-201-346'))pri_email=document.getElementById('QA_0-201-346').value;		
			if(document.getElementById('QA_0-201-402'))mobile_phone=document.getElementById('QA_0-201-402').value;
			var strURL=zcServletPrefix+'/custom/JSON/system/checkContactForAddLead.html?pri_email='+pri_email+'&mobile_phone='+escape(mobile_phone);
			var confirmationMsg;
			$.ajax({
				type: "GET",
				url: strURL,
				dataType: "json",
				sync:true,
				success: function (doc)
				{
					var terrsOfExistingConts=doc['TerrDetailsOfCont']['TerrsOfCont'];
					if(terrsOfExistingConts!=0){
						confirmationMsg="A contact with the ";
						if(pri_email){
							confirmationMsg+="email id "+pri_email;
							if(mobile_phone){
								confirmationMsg+=",";
							}
						}
						if(mobile_phone){
							confirmationMsg+="mobile phone "+mobile_phone;
						}

						if(terrsOfExistingConts.length==1){
							confirmationMsg+=" already exists in the territory \""+terrsOfExistingConts+"\", ";
						}else{
							confirmationMsg+=" already exists in the territories: "+terrsOfExistingConts+", ";
						}
						var warnContFlag=document.getElementById('0-2701-2881').value;
						if(warnContFlag=="w")
						{
							confirmationMsg+=" you can add new contact if you wish with an existing email id or mobile phone. Click <a href='http://www.impelcrm.in/duplicate-contact' target='_blank' style='font-weight:bold;'>here</a> for more information.";
							confirmationMsg+=" \n Do you really wish to add new contact?";
							$.alerts.okButton="&nbsp;Yes&nbsp;";
							$.alerts.cancelButton="&nbsp;No&nbsp;";
							jConfirm(confirmationMsg, 'Alert:warning', function(r) {if(r==true)submitQAForm()});
						}
						else if(warnContFlag=="b")
						{
							$.alerts.okButton="&nbsp;OK&nbsp;";
							confirmationMsg+=" you cannot add a new contact with an existing email id or mobile phone unfortunately you may not have access to the territory where this contact exists. Please contact your Impel administrator to either give access to that territory or change your organization settings to allow duplications. Click <a href='http://www.impelcrm.in/duplicate-contact' target='_blank' style='font-weight:bold;>here</a> for more information.";
							jAlert(confirmationMsg, 'Alert:error');
						}
						else
						{
							submitQAForm();
						}
					}
					else
					{
						submitQAForm();
		
					}
				}
			});
		}
		else
		{
			return true;
		}
	}
	else
	{
		 if(document.getElementById('0-6201:0-6901-6911'))
		{
			
		  var vals=document.getElementById('0-6201:0-6901-6911').value;
		  if(document.getElementById('0-2601'))
			{  
				document.getElementById('0-2601').value=document.getElementById('0-6201:0-6901-6911').value;
				document.getElementById('0-6201:0-6901-6911').value="";
			}
		}
		 
		if(document.getElementById('0-6601:0-7001-7011'))
		{
			
		  var valsofP=document.getElementById('0-6601:0-7001-7011').value;
		  if(document.getElementById('0-7201'))
			{
				document.getElementById('0-7201').value=document.getElementById('0-6601:0-7001-7011').value;
				document.getElementById('0-6601:0-7001-7011').value="";
			}
		}

		var leadForm =  document.forms[formName]; 
		//Lead Name = 'Lead:' + 'Contact Display name' + 'Account name'
		var contFN="";
		var contMN="";
		var contLN="";
		var acctNm="";
		if((document.getElementById('0-201-209'))&&document.getElementById('0-201-209').value!="2 chars or **")contFN = document.getElementById('0-201-209').value;
		if(document.getElementById('0-201-210'))contMN = " " + document.getElementById('0-201-210').value;
		if(document.getElementById('0-201-211'))contLN = " " + document.getElementById('0-201-211').value;
		if(contMN.length > 1)
			contDN=contFN+contMN+contLN;
		else
			contDN=contFN+contLN;

		if((document.getElementById('0-1-3'))&&document.getElementById('0-1-3').value!="2 chars or **")acctNm = " " + document.getElementById('0-1-3').value
		if(document.getElementById('0-8001')==null)
		document.getElementById('0-801-803').value='Lead: ' + contDN + acctNm;

		if(document.getElementById('0-801-842')&&document.getElementById('0-5301')&&id==18)
		{
			var srcId='';
			var opptySrc = document.getElementById('0-801-842').value;
			var chkForColon = opptySrc.indexOf(':');
			if(chkForColon == -1)
			{
				if(document.getElementById('0-801-842').value!=""&&document.getElementById('0-5301').value!="")
				{
					document.getElementById('0-5301').value = document.getElementById('0-5301').value;
					document.getElementById('0-801-842').value = document.getElementById('0-801-842').value;
				}
				else if(document.getElementById('0-801-842').value!=""&&document.getElementById('0-5301').value=="")
				{
					document.getElementById('0-801-842').value = document.getElementById('0-801-842').value;
				}
				else
				{
					document.getElementById('0-5301').value = "";
					document.getElementById('0-801-842').value = "";
				}
			}
			else
			{
				var srcId = opptySrc.split(':');
				document.getElementById('0-801-842').value = srcId[0];
				document.getElementById('0-5301').value = srcId[1];
			}
		}

		//Contact related
		if((document.getElementById('0-201-202').value!="")&&(document.getElementById('0-801-802').value==""))
		{
			document.getElementById('0-201-209').value="";		
			document.getElementById('0-601-609').value=document.getElementById('0-201-202').value;
			document.getElementById('0-5501-5509').value=document.getElementById('0-201-202').value;
			document.getElementById('0-201-202').value="";
		}
		//Account related
		if((document.getElementById('0-1-2').value!="")&&(document.getElementById('0-801-802').value==""))
		{
			if(document.getElementById('0-1-3'))document.getElementById('0-1-3').value="";
			document.getElementById('0-601-603').value=document.getElementById('0-1-2').value;
			document.getElementById('0-1001-1003').value=document.getElementById('0-1-2').value;
			document.getElementById('0-1-2').value="";
		}
		
		if(((document.getElementById('0-201-346')&&(document.getElementById('0-201-346').value!="")) || (document.getElementById('0-201-402')&&document.getElementById('0-201-402').value!=""))&&(document.getElementById('0-201-209').value!="")&&(document.getElementById('0-2701-2881').value!=""))
		{
			var pri_email="";
			var mobile_phone="";
			if(document.getElementById('0-201-346'))pri_email=document.getElementById('0-201-346').value;		
			if(document.getElementById('0-201-402'))mobile_phone=document.getElementById('0-201-402').value;
			var strURL=zcServletPrefix+'/custom/JSON/system/checkContactForAddLead.html?pri_email='+pri_email+'&mobile_phone='+escape(mobile_phone);
			var confirmationMsg;
			$.ajax({
				type: "GET",
				url: strURL,
				dataType: "json",
				sync:true,
				success: function (doc)
				{
					var terrsOfExistingConts=doc['TerrDetailsOfCont']['TerrsOfCont'];
					if(terrsOfExistingConts!=0){
						confirmationMsg="A contact with the ";
						if(pri_email){
							confirmationMsg+="email id "+pri_email;
							if(mobile_phone){
								confirmationMsg+=",";
							}
						}
						if(mobile_phone){
							confirmationMsg+="mobile phone "+mobile_phone;
						}

						if(terrsOfExistingConts.length==1){
							confirmationMsg+=" already exists in the territory \""+terrsOfExistingConts+"\", ";
						}else{
							confirmationMsg+=" already exists in the territories: "+terrsOfExistingConts+", ";
						}
						var warnContFlag=document.getElementById('0-2701-2881').value;
						if(warnContFlag=="w")
						{
							confirmationMsg+=" you can add new contact if you wish with an existing email id or mobile phone. Click <a href='http://www.impelcrm.in/duplicate-contact' target='_blank' style='font-weight:bold;'>here</a> for more information.";
							confirmationMsg+=" \n Do you really wish to add new contact?";
							$.alerts.okButton="&nbsp;Yes&nbsp;";
							$.alerts.cancelButton="&nbsp;No&nbsp;";
							jConfirm(confirmationMsg, 'Alert:warning', function(r) {if(r==true)submitAddEditForm()});
						}
						else if(warnContFlag=="b")
						{
							$.alerts.okButton="&nbsp;OK&nbsp;";
							confirmationMsg+=" you cannot add a new contact with an existing email id or mobile phone unfortunately you may not have access to the territory where this contact exists. Please contact your Impel administrator to either give access to that territory or change your organization settings to allow duplications. Click <a href='http://www.impelcrm.in/duplicate-contact' target='_blank' style='font-weight:bold;>here</a> for more information.";
							jAlert(confirmationMsg, 'Alert:error');
						}
						else
						{
							submitAddEditForm();
						}
					}
					else
					{
						submitAddEditForm();
					}
				}
			});
		}
		else
		{
			return true;
		}
	}
}

function validateMobileNo(formName,obj){
	//var errorDiv=mnuItmId+'errorDiv';
	var errorDiv = 'addEditErrorDiv';
	if(formName=="quickAdd-form")
	{
		errorDiv="errorDivQuickAdd";
	}
	var msg='';
	var mobileNo=obj.value;
	mobileNo=mobileNo.trim();
	if(mobileNo.substr(0,3)=='+91' && mobileNo.length!=13){
		msg += "\n<li>Enter valid Mobile no (Ex: +919632925578 or 9632925578 or 919632925578)</li>";
		obj.style.border="1px solid #CC0000";
	}else if(mobileNo.substr(0,2)=='91' && mobileNo.length!=12){
		msg += "\n<li>Enter valid Mobile no (Ex: +919632925578 or 9632925578 or 919632925578)</li>";
		obj.style.border="1px solid #CC0000";
	}else if(mobileNo.substr(0,1)=='0' && mobileNo.length!=11){
		msg += "\n<li>Enter valid Mobile no (Ex: +919632925578 or 9632925578 or 919632925578 or 09632925578)</li>";
		obj.style.border="1px solid #CC0000";
	}else if(mobileNo.substr(0,3)!='+91' && mobileNo.substr(0,2)!='91'&& mobileNo.substr(0,1)!='0' && mobileNo.length!=10){
		if(mobileNo.length!=0){
			msg += "\n<li>Enter valid Mobile no (Ex: +919632925578 or 9632925578 or 919632925578)</li>";
			obj.style.border="1px solid #CC0000";
		}
	}
	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		obj.style.border="1px solid #CC0000";
		return false;
	}else{
		if(document.getElementById(errorDiv).style.display=="block"&&document.getElementById(errorDiv).innerHTML.indexOf("Enter valid Mobile no")>0)
		document.getElementById(errorDiv).style.display="none";
		obj.style.border="1px solid #DDDDDD";
		return true;
	}
}

function isValidEmail(formName,obj)
{
	var errorDiv = 'addEditErrorDiv';
	var msg='';
	if(obj)
	var sText = obj.value;
	if(sText != "")
	{
		var reEmail = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
		if(reEmail.test(sText) == false)
		{
			msg+="\n<li>Please enter a valid email address. </li>";
			if(obj)
			obj.style.border="1px solid #CC0000";
		}
		if(msg)
		{
			document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			document.getElementById(errorDiv).style.display="block";
		}else{
			document.getElementById(errorDiv).style.display="none";
			if(obj)
			obj.style.border="1px solid #DDDDDD";
		}
	}
	else{
			document.getElementById(errorDiv).style.display="none";
			if(obj)
			obj.style.border="1px solid #DDDDDD";
		}
}

function ValidateWebAddress(formName,obj)
{
	var errorDiv = 'addEditErrorDiv';
	var msg='';
    var webSite = obj.value; 
	if(webSite!="")
	{
		var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/; 
		if(RegExp.test(webSite) == false)
		{ 
			msg+="\n<li>Please enter a valid website address.(ex:www.impelcrm.in)</li>";
			obj.style.border="1px solid #CC0000";
		}
		if(msg)
		{
			document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			document.getElementById(errorDiv).style.display="block";
		}else{
			document.getElementById(errorDiv).style.display="none";
			obj.style.border="1px solid #DDDDDD";
		}	
	}
	else{
			document.getElementById(errorDiv).style.display="none";
			obj.style.border="1px solid #DDDDDD";
		}
} 

function validateAddContact(formName)
{
		
	if(formName=="quickAdd-form")
	{
		/*if((document.getElementById('QA_0-1901-1902').value!="")&&(document.getElementById('QA_0-401-402').value==""))
		{
			document.getElementById('QA_0-1901-1903').value="";		
			document.getElementById('QA_0-3201-3203').value=document.getElementById('QA_0-1901-1902').value; 		
			document.getElementById('QA_0-1901-1902').value="";
		}*/
		//Commented by Gautham 8-Dec-2011
	}
	else
	{
		
		if((document.getElementById('0-1901-1902')&&document.getElementById('0-1901-1902').value!="")&&(document.getElementById('0-401-402').value==""))
		{  		
			//if(document.getElementById('0-1901-1903'))			
			//document.getElementById('0-1901-1903').value="";			
			document.getElementById('0-3201-3203').value=document.getElementById('0-1901-1902').value;			
			//document.getElementById('0-1901-1902').value="";
			
		}
		if(document.getElementById('0-401-465')&&document.getElementById('0-401-465').value!="")
		if(validateMobileNo(formName,document.getElementById('0-401-465')))
			return true;
		else 
			return false;

	}
	   return true;
}


function validateAddSBEUser(formName){
	var msg='';
	var passwd1Obj;
	var passwd1="";
	var passwd2Obj;
	var passwd2="";
	var errorDiv = 'addEditErrorDiv';
	var userCreationFormObj=document.getElementById(formName);
	var inputElmnts=userCreationFormObj.getElementsByTagName('input');
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++){
		if(inputElmnts[eleCounter].type=='password'){
			if(inputElmnts[eleCounter].id=='0-1301'){
				passwd1=inputElmnts[eleCounter].value;
				passwd1Obj=inputElmnts[eleCounter];
			}else if(inputElmnts[eleCounter].id=='0-201-2001'){
				passwd2=inputElmnts[eleCounter].value;
				passwd2Obj=inputElmnts[eleCounter];
			}
		}
		else if(inputElmnts[eleCounter].type=='text' && inputElmnts[eleCounter].id=='0-201-203')
		{
			var loginNameObj=inputElmnts[eleCounter];
		}
	}
	if(passwd1&&passwd2){
		if(passwd1.length<6){
			msg += "\n<li>Password field should contain at least 6 chars</li>";
			passwd1Obj.style.border="1px solid #CC0000";
		}else{
			passwd1Obj.style.border="1px solid #DDDDDD";
		}
		if(passwd1!=passwd2){
			msg += "\n<li>\"Password\" and \"Confirm password\" fields should be same</li>";
			passwd2Obj.style.border="1px solid #CC0000";
		}else{
			passwd2Obj.style.border="1px solid #DDDDDD";
		}
		if(msg)
		{
			document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			document.getElementById(errorDiv).style.display="block";
			return false;
		}
	}
	if(loginNameObj)
	{
		if(!avilabiltyOfEmail(userCreationFormObj,loginNameObj,1))
		{
			return false;
		}
	}
	if(!checkForEmpMadatoryFields(formName))
	{
		return false;
	}
	if(document.getElementById('0-401-409')&&document.getElementById('0-401-402').value=="")
		document.getElementById('0-401-409').value = document.getElementById('0-401-409').value;
	return true;
}

function lockAccountRelatedFields()
{	
  if(document.getElementById('0-1901-1903'))
  blockObjectRelatedFields('0-1901-1903','0-1901-1903hdn')
}


function lockAccountContRelatedFields4addOpp(myForm,Id)
{
	if(document.getElementById('0-8301'))
	{
	   if(document.getElementById('0-8301').value)
		{
		   if(document.getElementById('0-201-209'))
		   blockObjectRelatedFields('0-201-209','0-201-209hdn')
		}
	}

		setTimeout("FillAccountFlds()",1000)
	if(Id)
	{
		var formName=document.getElementById('addEditForm');
			var layoutLinks=formName.getElementsByTagName('a');
			if(Id == 18)
			{
				for (i=0;i<layoutLinks.length;i++)
				{
					if(layoutLinks[i].id=='tab_Prefs')
						layoutLinks[i].style.display="none";
				}
			}
	}
}

function FillAccountFlds()
{ 
 if(document.getElementById('0-7801'))
	{
		if(document.getElementById('0-7801').value)
		{
		   if(document.getElementById('0-1-3'))
		   blockObjectRelatedFields('0-1-3','0-1-3hdn')
		}
	}
}

function writeTohidden()
{
	alert("Here");
}
function isValidEmailTest(sText)
{
	var reEmail = /^([\w\.-]{1,64}@[\w\.-]{1,252}\.\w{2,4})$/i;
	return reEmail.test(sText);
}

function avilabiltyOfEmail(myForm,obj,frmSmt){
	alert('1');
	var msg='';
	var isValid=isValidEmailTest(obj.value);
	alert(isValid)
	var errorDiv = 'addEditErrorDiv';
	
	if (obj.value.length >=1 && isValid)
	{
		alert('in if')
		var returnValidationValue=true;
		$.ajax({
			type: "GET",
			url: zcServletPrefix+"/custom/adminNew/checkAvailabilityOfEmail.xml?email="+obj.value,
			dataType: "xml",
			async:false,
			success: function(doc)
			{
				var login= doc.getElementsByTagName("loginid");
				var temp_org= doc.getElementsByTagName("temporg");
				var master_user=doc.getElementsByTagName("master_user");

				loginid = login[0] ? login[0].getAttribute("id") : null;
				temp_org_id = temp_org[0] ? temp_org[0].getAttribute("id") : null;
				master_id=master_user[0] ? master_user[0].getAttribute("id") : null;

				if((loginid) ||(temp_org_id) || (master_id))
				{
					msg+="\n<li>Entered Login name is not available</li>";
					obj.style.border="1px solid #CC0000";
					if(frmSmt!=1){
						obj.focus();
					}
					document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
					document.getElementById(errorDiv).style.display="block";
					returnValidationValue=false;
				}
				else
				{
					obj.style.border="1px solid #00CC00";
					document.getElementById(errorDiv).style.display="none";
					returnValidationValue=true;
				}
			 }
		 })
	}
	else
	{
		alert('in else')
		//if(msg)
		{
			msg+="\n<li>Enter valid email id for the field Login name</li>";
			obj.style.border="1px solid #CC0000";
			document.getElementById(errorDiv).style.display="block";
			document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			document.getElementById(errorDiv).style.display="block";
			returnValidationValue=false;
		}
	}
	return returnValidationValue;
}

function changePageCaption(form,obj,defCaption)
{
	if(defCaption)
	{
		var w = obj.selectedIndex;
		var selected_text = obj.options[w].text;
		document.getElementById('addEdit-Caption').innerHTML=defCaption+" : "+selected_text;
	}
	else
	{
		obj=obj.replace('~)',' : ')
		document.getElementById('addEdit-Caption').innerHTML=obj;
	}
}

function fillUpDefaultTerrList(terrId,terrName,isAdd,default_terr)
{
	var defaultTerrObj=document.getElementById('0-201-357');
	if(isAdd)
	{
		var optObj=CreateOptionBox(defaultTerrObj,'','',terrId,terrName);
		if(terrId==default_terr)
			optObj.selected=true;
	}
	else
	{
		DeleteOptionBox(defaultTerrObj,terrId,terrName)
	}
}

function DeleteOptionBox(selBoxObj,Seldvalue,text)
{
  var i;
  for (i = selBoxObj.length - 1; i>=0; i--) {
    if (selBoxObj.options[i].value==Seldvalue) {
      selBoxObj.remove(i);
    }
  }
}

function checkForEmpMadatoryFields(formName)
{
	var msg="";
	var empCodeEmptyMsg="";
	var noEmpCodeFldMsg="";
	var errorDiv = 'addEditErrorDiv';
	var userCreationFormObj=document.getElementById(formName);

	var inputElmnts=userCreationFormObj.getElementsByTagName('input');//all input elements
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++)
	{
		var inputElemId=inputElmnts[eleCounter].id;
		if(inputElemId.substr(0,7)=='0-1001-' && inputElmnts[eleCounter].value!="")
		{
			if(document.getElementById('0-1001-1003'))
			{
				if(document.getElementById('0-1001-1003').value=="")
				{
					empCodeEmptyMsg=true;
				}
			}
			else
			{
				noEmpCodeFldMsg=true;
			}		
		}
	}
	var inputElmnts=userCreationFormObj.getElementsByTagName('select');//all select box elements
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++)
	{
		var inputElemId=inputElmnts[eleCounter].id;
		if(inputElemId.substr(0,7)=='0-1001-' && inputElmnts[eleCounter].value!="")
		{
			if(document.getElementById('0-1001-1003'))
			{
				if(document.getElementById('0-1001-1003').value=="")
				{
					empCodeEmptyMsg=true;
				}
			}
			else
			{
				noEmpCodeFldMsg=true;
			}		
		}
	}
	var inputElmnts=userCreationFormObj.getElementsByTagName('textarea');//all textarea elements
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++)
	{
		var inputElemId=inputElmnts[eleCounter].id;
		if(inputElemId.substr(0,7)=='0-1001-' && inputElmnts[eleCounter].value!="")
		{
			if(document.getElementById('0-1001-1003'))
			{
				if(document.getElementById('0-1001-1003').value=="")
				{
					empCodeEmptyMsg=true;
				}
			}
			else
			{
				noEmpCodeFldMsg=true;
			}		
		}
	}
	if(empCodeEmptyMsg)
	{
		msg+="\n<li>Employee code should not be empty, to add employee details</li>";
		document.getElementById('0-1001-1003').style.border="1px solid #CC0000";
		document.getElementById('0-1001-1003').focus();
	}

	if(noEmpCodeFldMsg)
		msg+="\n<li>Employee code is mandatory, and is missing, please add it from layout</li>";

	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}
	return true;
}

function validateAddsalesAutomation(formName)
{  
	var errorDiv = 'addEditErrorDiv';
	var msg='';

	if(document.getElementById('0-801:0-901-909').value==""){
		msg += "\n<li>Please add contact first name</li>";
		document.getElementById('0-801:0-901-909').style.border="1px solid #CC0000";
	}else{
		document.getElementById('0-801:0-901-909').style.border="1px solid #DDDDDD";
	}
	if(document.getElementById('0-6601:0-7001-7011'))
	{
		if(document.getElementById('0-6601:0-7001-7011').value=="")
		{
			msg += "\n<li>Please select product category</li>";
			document.getElementById('0-6601:0-7001-7011txt').style.border="1px solid #CC0000";
		}else{document.getElementById('0-6601:0-7001-7011txt').style.border="1px solid #DDDDDD";}
	}
	if(msg){
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
	}

	 if(document.getElementById('0-6201:0-6901-6911'))
		{
			
		  var vals=document.getElementById('0-6201:0-6901-6911').value;	  

			if(document.getElementById('0-3101'))
			{  
				document.getElementById('0-3101').value=document.getElementById('0-6201:0-6901-6911').value;
				document.getElementById('0-6201:0-6901-6911').value="";
			}

		}
		  
		
		if(document.getElementById('0-6601:0-7001-7011'))
		{ 			
			 
		  var valsofP=document.getElementById('0-6601:0-7001-7011').value;
		 

			if(document.getElementById('0-3201'))
			{  	 
				document.getElementById('0-3201').value=document.getElementById('0-6601:0-7001-7011').value;
				document.getElementById('0-6601:0-7001-7011').value="";
			}

		}


		submitAddEditForm();

}


function validateOrders(formName){
	var errorDiv = 'addEditErrorDiv';
	var msg='';

	if(document.getElementById('0-1501:0-401-418').value==""){
		msg += "\n<li>Please select a product</li>";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #CC0000";
	}

	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #DDDDDD";
	}

	var orderNumObj;
	var addOrdersFormObj=document.getElementById(formName);
	var inputElmnts=addOrdersFormObj.getElementsByTagName('input');
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++){
		if(inputElmnts[eleCounter].type=='text' && inputElmnts[eleCounter].id=='0-1-153')
		{
			var orderNumObj=inputElmnts[eleCounter];
		}
	}
	if(orderNumObj)
	{
		if(!checkForExistingOrdNum(addOrdersFormObj,orderNumObj))
		{
			return false;
		}
	}
	document.getElementById('0-1-302').value = document.getElementById('totalPrice').value;
	document.getElementById('0-1-304').value = document.getElementById('grandTotalPrice').value;
	return true;
}

function validatePurchOrders(formName){
	var errorDiv = 'addEditErrorDiv';
	var msg='';
	if(document.getElementById('0-1501:0-401-418').value==""){
		msg += "\n<li>Please select a product</li>";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #CC0000";
	}

	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #DDDDDD";
	}

	var orderNumObj;
	var addOrdersFormObj=document.getElementById(formName);
	var inputElmnts=addOrdersFormObj.getElementsByTagName('input');
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++){
		if(inputElmnts[eleCounter].type=='text' && inputElmnts[eleCounter].id=='0-1-153')
		{
			var orderNumObj=inputElmnts[eleCounter];
		}
	}
	if(orderNumObj)
	{
		if(!checkForExistingOrdNum(addOrdersFormObj,orderNumObj))
		{
			return false;
		}
	}
	document.getElementById('0-1-302').value = document.getElementById('totalPrice').value?document.getElementById('totalPrice').value:0;
//	document.getElementById('0-1-18').value = document.getElementById('grandTotalPrice').value;
	return true;
}

function validateInvoices(formName,zcRank)
{
	var errorDiv = 'addEditErrorDiv';
	var msg='';

	if(!(document.getElementById('0-1001:0-1101-2201').disabled) && (document.getElementById('0-1001:0-1101-2201').value==""||document.getElementById('0-1001:0-1101-2201').value=="2 chars or **")){
		msg += "\n<li>Please select a product</li>";
			document.getElementById('0-1001:0-1101-2201').style.border="1px solid #CC0000";}

	for(var j=0; j<=zcRank; j++)
	{
		if(document.getElementById('0-1001:'+j+'-1101-2201')&&document.getElementById('0-1001:'+j+'-1101-2201').value!="2 chars or **" && !(document.getElementById('0-1001:'+j+'-1101-2201').disabled))
		{
			if(document.getElementById('0-1001:'+j+'-1101-1127'))
			if(document.getElementById('0-1001:'+j+'-1101-1127').value==""){
			msg += "\n<li>Please enter list price of product</li>";
			document.getElementById('0-1001:'+j+'-1101-1127').style.border="1px solid #CC0000";}
		
			if(document.getElementById('0-1001:'+j+'-1101-1103'))
			if(document.getElementById('0-1001:'+j+'-1101-1103').value==""){
			msg += "\n<li>Please enter quantity</li>";
			document.getElementById('0-1001:'+j+'-1101-1103').style.border="1px solid #CC0000";}
		}
	}

	if(document.getElementById('totalPrice')&&document.getElementById('totalPrice').value<=0&&document.getElementById('0-1-17')&&document.getElementById('0-1-17').value!="")
		msg += "\n<li>Sorry you have already invoiced, please click cancel to go back.</li>";

	if(document.getElementById('totalPrice')&&document.getElementById('totalPrice').value<=0)
		msg += "\n<li>Sorry price should be greater than zero.</li>";

	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1001:0-1101-2201').style.border="1px solid #CCCCCC";
		document.getElementById('0-1001:0-1101-1127').style.border="1px solid #CCCCCC";
		document.getElementById('0-1001:0-1101-1103').style.border="1px solid #CCCCCC";
	}
    
	/*var invoiceNumObj;
	var addInvoicesFormObj=document.getElementById(formName);
	var inputElmnts=addInvoicesFormObj.getElementsByTagName('input');
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++){
		if(inputElmnts[eleCounter].type=='text' && inputElmnts[eleCounter].id=='0-1-38')
		{
			var invoiceNumObj=inputElmnts[eleCounter];
		}
	}
	if(invoiceNumObj)
	{
		if(!checkForExistingInvNum(addInvoicesFormObj,invoiceNumObj))
		{
			return false;
		}
	}*/
	if(document.getElementById('0-1-850'))
		document.getElementById('0-1-850').value = document.getElementById('0-1-850').value;
	if(document.getElementById('0-1-851'))
		document.getElementById('0-1-851').value = document.getElementById('0-1-851').value;

	/*for(var i=0;i<=10;i++)
	{
		if(document.getElementById('0-1001:'+i+'-1101-1125')&&document.getElementById('0-1001:'+i+'-1101-1125').value!="")
		document.getElementById('0-1001:'+i+'-1101-1125').value = parseFloat(document.getElementById('0-1001:'+i+'-1101-1125').value);
	}*/

	
	if(document.getElementById('0-1001:0-1101-6301'))
	{
	for (var k=0;k<=zcRank;k++) 
	{
		var extndAmt=0;
		if(document.getElementById('0-1001:'+k+'-1101-1127') && document.getElementById('0-1001:'+k+'-1101-1127').value!="")
		{
			toGetTaxValues(k);
		/*	if(document.getElementById('0-1001:'+k+'-1101-2201hdn'))
				var product_id = document.getElementById('0-1001:'+k+'-1101-2201hdn').value;
		
			if(document.getElementById('0-1001:'+k+'-1101-1104')&&document.getElementById('0-1001:'+k+'-1101-1104').value)
				extndAmt = (document.getElementById('0-1001:'+k+'-1101-1104').value)*(document.getElementById('0-1001:'+k+'-1101-1103').value);
			
			var detUrl=zcServletPrefix+'/custom/JSON/system/getTaxDet4Prod.htm?product_id='+product_id;
			
			$.ajax(
			{
				type: "GET",
				url:detUrl,
				dataType: "json",
				async:false,
				success: function (doc)
				{
					var prodTaxInfo='';
					prodTaxInfo=doc['taxInfo'].split('~)');
					totalTaxAmt=0;
					if(prodTaxInfo.length>=1)
					{
						for(var taxTypeCntr=0;taxTypeCntr<prodTaxInfo.length;taxTypeCntr++)
						{
							var taxDetails=prodTaxInfo[taxTypeCntr].split('--');
							
							var taxTypeName=taxDetails[0];
							var taxTypePct=taxDetails[1];
							var taxAmt=0;
							taxAmt = parseFloat((taxTypePct/100)*parseFloat(extndAmt));
							if(taxAmt)
								totalTaxAmt=parseFloat(totalTaxAmt)+parseFloat(taxAmt);
						
							if(taxTypeCntr==0)
							{
							if(document.getElementById('0-1001:'+k+'-1101-1644')&&taxTypePct)
								document.getElementById('0-1001:'+k+'-1101-1644').value = taxTypePct;
							if(document.getElementById('0-1001:'+k+'-1101-1604')&&taxAmt)
								document.getElementById('0-1001:'+k+'-1101-1604').value = taxAmt.toFixed(2);
							}
							if(taxTypeCntr==1)
							{
							if(document.getElementById('0-1001:'+k+'-1101-1645')&&taxTypePct)
								document.getElementById('0-1001:'+k+'-1101-1645').value = taxTypePct;
							if(document.getElementById('0-1001:'+k+'-1101-1611')&&taxAmt)
								document.getElementById('0-1001:'+k+'-1101-1611').value = taxAmt.toFixed(2);
							}
							if(taxTypeCntr==2)
							{
							if(document.getElementById('0-1001:'+k+'-1101-1651')&&taxTypePct)
								document.getElementById('0-1001:'+k+'-1101-1651').value = taxTypePct;
							if(document.getElementById('0-1001:'+k+'-1101-1617')&&taxAmt)
								document.getElementById('0-1001:'+k+'-1101-1617').value = taxAmt.toFixed(2);
							}
							if(taxTypeCntr==3)
							{
							if(document.getElementById('0-1001:'+k+'-1101-1652')&&taxTypePct)
								document.getElementById('0-1001:'+k+'-1101-1652').value = taxTypePct;
							if(document.getElementById('0-1001:'+k+'-1101-1626')&&taxAmt)
								document.getElementById('0-1001:'+k+'-1101-1626').value = taxAmt.toFixed(2);
							}
							if(taxTypeCntr==4)
							{
								if(document.getElementById('0-1001:'+k+'-1101-1653')&&taxTypePct)
								document.getElementById('0-1001:'+k+'-1101-1653').value = taxTypePct;
								if(document.getElementById('0-1001:'+k+'-1101-1643')&&taxAmt)
								document.getElementById('0-1001:'+k+'-1101-1643').value = taxAmt.toFixed(2);
							}
							if(document.getElementById('0-1001:'+k+'-1101-1657'))
								document.getElementById('0-1001:'+k+'-1101-1657').value = parseFloat(totalTaxAmt) + parseFloat(document.getElementById('0-1001:'+k+'-1101-1125').value);
						}
					}
				}
			});*/
		}
	}
	}
	/*Assign Sum of extd tot amount to the invoice_amount field if there is no header level tax else assign grand total amount*/
    if(showHeaderTax=="0"&&document.getElementById('0-1-37')) document.getElementById('0-1-37').value = document.getElementById('totalPrice').value;
	else if(document.getElementById('0-1-37')) document.getElementById('0-1-37').value = document.getElementById('grandTotalPrice').value;
	/*If tax is at line level and not at header level then on submit of form, copy the sum of line level tax to the header taxtyp1_Amnt field*/
	if(showHeaderTax=="0")
	{
		var totVal=0;
		for(var j=0;j<25;j++)
		{
			var detTaxAmtId = "0-1001:"+j+"-1101-6301";
			if(document.getElementById(detTaxAmtId)&&document.getElementById(detTaxAmtId).value){
				totVal += parseFloat(document.getElementById(detTaxAmtId).value);
			}
		}
		if(document.getElementById('0-1-45')) document.getElementById('0-1-45').value=totVal;
	}
	/*If edit case, check for dtl ids to be deleted and updated and hit deleteDtlRows with the appropriate data*/
	if(priKeyVal&&priKeyVal!="")
	{
		var url2hit = "/atCRM/custom/JSON/system/deleteDtlRows.html";
	    $.ajax({
		  type:'GET',
		  url:url2hit,
		  dataType:'json',
		  async:false,
		  data:'hdrId='+priKeyVal+'&dtlIdsToDel='+dltDtlCSV+'&dtlIdsToUpd='+qtyUdtDtlCSV+'&enttFlg=invoice',
		  success: function (data)
		    { 
			    var rowIndexArray = dltDtlRowIndex;
				for(var i=0;i<rowIndexArray.length;i++)
				{
                   var rowIndex = rowIndexArray[i];
				   if(document.getElementById("0-1001:"+rowIndex+"-1101-1103")) document.getElementById("0-1001:"+rowIndex+"-1101-1103").value="";
				}
				dltDtlCSV = "";qtyUdtDtlCSV="";dltDtlRowIndex=[];invQtyArray=[];
                return true;
		    },
		  error:function()
			{
			   return false; 
			   alert("Could not delete or update detail rows");
			}
	    });
	}
	return true;
}

function validateQuotes(formName){
	var errorDiv = 'addEditErrorDiv';
	var msg='';
	if(document.getElementById('0-1501:0-401-418').value==""){
		msg += "\n<li>Please select a product</li>";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #CC0000";
	}
	if(document.getElementById('0-1501:0-401-410'))
		if(document.getElementById('0-1501:0-401-410').value==""){
		msg += "\n<li>Please enter list price of product</li>";
		document.getElementById('0-1501:0-401-410').style.border="1px solid #CC0000";}
	
	if(document.getElementById('0-1501:0-401-403'))
		if(document.getElementById('0-1501:0-401-403').value==""){
		msg += "\n<li>Please enter quantity</li>";
		document.getElementById('0-1501:0-401-403').style.border="1px solid #CC0000";}

	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1501:0-401-2201').style.border="1px solid #DDDDDD";
	}

	var quoteNumObj;
	var addQuotesFormObj=document.getElementById(formName);
	var inputElmnts=addQuotesFormObj.getElementsByTagName('input');
	for(eleCounter=0;eleCounter<inputElmnts.length;eleCounter++){
		if(inputElmnts[eleCounter].type=='text' && inputElmnts[eleCounter].id=='0-1-153')
		{
			var quoteNumObj=inputElmnts[eleCounter];
		}
	}
	if(quoteNumObj)
	{
		if(!checkForExistingQuotNum(addOrdersFormObj,orderNumObj))
		{
			return false;
		}
	}
	return true;
}


function checkForExistingQuotNum(myForm, Obj)
{
	var quotNum=Obj.value;
	var returnVal=true;
	var urlToHit=zcServletPrefix+'/custom/JSON/system/checkForExistingQuoteNum.htm?quotNum='+quotNum;
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		async: false,
		success: function (doc)
		{
			var errorDiv='addEditErrorDiv';
			if(doc.ordNum)
			{
				document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul><li>Sorry, Quote Number already exists.</li></ul>";
				document.getElementById(errorDiv).style.display="block";
				Obj.style.border="1px solid #CC0000";
				Obj.focus();
				returnVal=false;
			}
			else
			{
				document.getElementById(errorDiv).innerHTML="";
				document.getElementById(errorDiv).style.display="none";
				Obj.style.border="1px solid #DDDDDD";
				returnVal=true;
			}
		}
	});
	return returnVal;
}

function clearOtherColoumns(UDMName,elemId,section)
{ 
		 zcrank=new Array();
		 zcrank=elemId.split(":");
		 zcrankVal=zcrank[1];
		 zcrankVal= zcrankVal.split("-");		

	if(UDMName=="custom/JSON/add/Lead" || UDMName=="custom/JSON/add/salesAutomation")
	{		
		for(i=0;i<=zcrankVal[0];i++)
		{ 	
		  	  if(section=="Product")
				{
				  if(document.getElementById('0-6201:'+i+'-6901-6903'))						  
				  document.getElementById('0-6201:'+i+'-6901-6903').value=""; 			

				 
				   if(document.getElementById('0-6201:'+i+'-6901-6904'))
				   document.getElementById('0-6201:'+i+'-6901-6904').value=""; 

				
					 if(document.getElementById('0-6201:'+i+'-6901-6911'))
					 {			  
						 document.getElementById('0-6201:'+i+'-6901-6911').value="";  
						 document.getElementById('0-6201:'+i+'-6901-6911txt').value="2 chars or **"; 
						 document.getElementById('0-6201:'+i+'-6901-6911txt').className= "inputGrayTextClass"; 
					 }

					 if(document.getElementById('0-6201:'+i+'-6901-6917'))
					 document.getElementById('0-6201:'+i+'-6901-6917').value=""; 


					   if(document.getElementById('0-6201:'+i+'-6901-6923'))
					   document.getElementById('0-6201:'+i+'-6901-6923').value=""; 

					   if(document.getElementById('0-6201:'+i+'-6901-6924'))
					   document.getElementById('0-6201:'+i+'-6901-6924').value=""; 


					   if(document.getElementById('0-6201:'+i+'-6901-6931'))
					   document.getElementById('0-6201:'+i+'-6901-6931').value=""; 


					   if(document.getElementById('0-6201:'+i+'-6901-6937'))
					   document.getElementById('0-6201:'+i+'-6901-6937').value="";	
				}

				  if(section=="ProdCategory")
				{
					  if(document.getElementById('0-6601:'+i+'-7001-7003'))						  
					  document.getElementById('0-6601:'+i+'-7001-7003').value=""; 			

					 
					   if(document.getElementById('0-6601:'+i+'-7001-7004'))
					   document.getElementById('0-6601:'+i+'-7001-7004').value=""; 

					
						 if(document.getElementById('0-6601:'+i+'-7001-7011'))
						 {			  
							 document.getElementById('0-6601:'+i+'-7001-7011').value="";  
							 document.getElementById('0-6601:'+i+'-7001-7011txt').value="2 chars or **"; 
							 document.getElementById('0-6601:'+i+'-7001-7011txt').className= "inputGrayTextClass"; 
						 }

						 if(document.getElementById('0-6601:'+i+'-7001-7017'))
						 document.getElementById('0-6601:'+i+'-7001-7017').value=""; 


						   if(document.getElementById('0-6601:'+i+'-7001-7018'))
						   document.getElementById('0-6601:'+i+'-7001-7018').value=""; 

						   if(document.getElementById('0-6601:'+i+'-7001-7019'))
						   document.getElementById('0-6601:'+i+'-7001-7019').value=""; 


						   if(document.getElementById('0-6601:'+i+'-7001-7021'))
						   document.getElementById('0-6601:'+i+'-7001-7021').value=""; 


						   if(document.getElementById('0-6601:'+i+'-7001-7022'))
						   document.getElementById('0-6601:'+i+'-7001-7022').value="";	
				}



		}  
    }	
	
}




function getTemplatevalues()
{	
	if(document.getElementById('0-1-47'))
	{       
		//document.getElementById('0-1-47').value!="";
		//document.getElementById('0-1-4txt').value!="";
		//alert('0-1-4');
    //if(from_template=='') {}
	for(i=0;i<=9;i++)
		{
	  if(document.getElementById("0-701:"+i+"-801-809txt")){
				document.getElementById("0-701:"+i+"-801-809txt").value='2 chars or **';
			document.getElementById("0-701:"+i+"-801-809").value='';	
			}
	  if(document.getElementById("0-701:"+i+"-801-822")){
				document.getElementById("0-701:"+i+"-801-822").value='';
			}
	  if(document.getElementById("0-701:"+i+"-801-821")){
				document.getElementById("0-701:"+i+"-801-821").value='';
			}
	
	   }
    var tempId= document.getElementById("0-1-47").value; 	
	var url="system/getContractTemplatevalue.htm?id="+tempId;
	$.ajax({
	type: "GET",			
	dataType: "json",
	url: url,			
	success: function (data)
	{
		L_data = eval(data);
		var getval = data["getContractTemplatevalue"];
		var gd = getval["guarantee_desc"];
		var price = getval["ctrt_price"];	
		var type = getval["supp_ctrt_type"];	
		var tkt_prty =getval["def_tkt_prty"];
		var spare = getval["spares_value_free"];	
		var labour = getval["labour_value_free"];	
		var count=getval["count"];

			   document.getElementById("0-1-23").value=gd;
			   document.getElementById("0-1-25").value=price;
			   document.getElementById("0-1-41").value=type;
			   document.getElementById("0-1-53").value=tkt_prty;
			   document.getElementById("0-1-60").value=spare;
			   document.getElementById("0-1-61").value=labour;
	
	   for(i=0;i<count;i++)
		{ 
            var prodId=L_data.products[i].Product_Id;
		   	var prodName=L_data.products[i].Name;
		   	var Uom=L_data.products[i].defaultUOM_Id;
		   	var quantity=L_data.products[i].invt_qty;

			if(document.getElementById("0-701:"+i+"-801-809txt")){
				document.getElementById("0-701:"+i+"-801-809txt").value=prodName;
				document.getElementById("0-701:"+i+"-801-809").value=prodId;
			}
			if(document.getElementById("0-701:"+i+"-801-822")){
				document.getElementById("0-701:"+i+"-801-822").value=Uom;
			}
			if(document.getElementById("0-701:"+i+"-801-821")){
				document.getElementById("0-701:"+i+"-801-821").value=quantity;
			}
        }
	   
	 }
	})
}
}

/*function deleteProd()
{  		
		for(i=0;i<10;i++)
		{ 	
			//alert(document.getElementById("0-701:"+i+"-801-809txt").value)
			
			if((document.getElementById("0-701:"+i+"-801-809txt").value=='2 chars or **') || (document.getElementById("0-701:"+i+"-801-809txt").value==''))
			{		//alert(i)
				//alert(document.getElementById("0-701:"+i+"-801-802").value);
				document.getElementById("0-701:"+i+"-801-802").value='';
				document.getElementById("0-701:"+i+"-801-838").value='';
			}	
		//alert(i)
		}
		return true;
}*/

// THIS JAVASCRIPT WILL HELP TO CONVERT NUMBER TO WORDS
function convertWords(val) {

	//alert(val)
	var NumberVal=val;
	NumberVal = NumberVal.replace(",","");
	NumberVal=Math.floor(NumberVal);
	var obStr=new String(NumberVal);
	numReversed=obStr.split("");
	actnumber=numReversed.reverse();

	if(Number(NumberVal) >=0){
		//do nothing
	}
	else{
		alert('wrong Number cannot be converted');
		return false;
	}
	if(Number(NumberVal)==0){
		document.getElementById('container').innerHTML=obStr+''+'Rupees Zero Only';
		return false;
	}
	if(actnumber.length>9){
		alert('Oops!!!! the Number is too big to covertes');
		return false;
	}

	var iWords=["Zero", " One", " Two", " Three", " Four", " Five", " Six", " Seven", " Eight", " Nine"];
	var ePlace=['Ten', ' Eleven', ' Twelve', ' Thirteen', ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', ' Nineteen'];
	var tensPlace=['dummy', ' Ten', ' Twenty', ' Thirty', ' Forty', ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety' ];

	var iWordsLength=numReversed.length;
	var totalWords="";
	var inWords=new Array();
	var finalWord="";
	j=0;
	for(i=0; i<iWordsLength; i++){
		switch(i)
		{
		case 0:
			if(actnumber[i]==0 || actnumber[i+1]==1 ) {
				inWords[j]='';
			}
			else {
				inWords[j]=iWords[actnumber[i]];
			}
			inWords[j]=inWords[j]+' Only';
			break;
		case 1:
			tens_complication();
			break;
		case 2:
			if(actnumber[i]==0) {
				inWords[j]='';
			}
			else if(actnumber[i-1]!=0 && actnumber[i-2]!=0) {
				inWords[j]=iWords[actnumber[i]]+' Hundred and';
			}
			else {
				inWords[j]=iWords[actnumber[i]]+' Hundred';
			}
			break;
		case 3:
			if(actnumber[i]==0 || actnumber[i+1]==1) {
				inWords[j]='';
			}
			else {
				inWords[j]=iWords[actnumber[i]];
			}
			if(actnumber[i+1] != 0 || actnumber[i] > 0){
				inWords[j]=inWords[j]+" Thousand";
			}
			break;
		case 4:
			tens_complication();
			break;
		case 5:
			if(actnumber[i]==0 || actnumber[i+1]==1 ) {
				inWords[j]='';
			}
			else {
				inWords[j]=iWords[actnumber[i]];
			}
			inWords[j]=inWords[j]+" Lakh";
			break;
		case 6:
			tens_complication();
			break;
		case 7:
			if(actnumber[i]==0 || actnumber[i+1]==1 ){
				inWords[j]='';
			}
			else {
				inWords[j]=iWords[actnumber[i]];
			}
			inWords[j]=inWords[j]+" Crore";
			break;
		case 8:
			tens_complication();
			break;
		default:
			break;
		}
		j++;
	}

	function tens_complication() {
		if(actnumber[i]==0) {
			inWords[j]='';
		}
		else if(actnumber[i]==1) {
			inWords[j]=ePlace[actnumber[i-1]];
		}
		else {
			inWords[j]=tensPlace[actnumber[i]];
		}
	}
	inWords.reverse();
	for(i=0; i<inWords.length; i++) {
		finalWord+=inWords[i];
	}
	document.getElementById('container').innerHTML=finalWord;
}

function validateInvoicesWiz(formName)
{
	var errorDiv = 'addEditErrorDiv';
	var msg='';
	if(document.getElementById(errorDiv).style.display=="block")
	document.getElementById(errorDiv).style.display="none";
	
	if(document.getElementById('0-1001:0-1101-1128').value==""){
		msg += "\n<li>Please select a product</li>";
		document.getElementById('0-1001:0-1101-2201').style.border="1px solid #CC0000";
	}
	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1001:0-1101-2201').style.border="1px solid #DDDDDD";
		return true;
	}
}

function validateInvoicesWizCreditCardDetails(formName)
{
	var errorDiv = 'addEditErrorDiv';
	var msg='';
	if(document.getElementById(errorDiv).style.display=="block")
	document.getElementById(errorDiv).style.display="none";

	if(document.getElementById('creditCardNumberId')&&document.getElementById('creditCardNumberId').value==""){
			msg += "\n<li>Please enter credit card number.</li>";
		document.getElementById('creditCardNumberId').style.border="1px solid #CC0000";
	}

	if(document.getElementById('nameOnCrd')&&document.getElementById('nameOnCrd').value==""){
		msg += "\n<li>Please enter name as on credit card number.</li>";
		document.getElementById('nameOnCrd').style.border="1px solid #CC0000";
	}

	if(document.getElementById('cvvNumber')&&document.getElementById('cvvNumber').value==""){
		msg += "\n<li>Please enter CVV number.</li>";
		document.getElementById('cvvNumber').style.border="1px solid #CC0000";
	}
	if(msg)
	{
		document.getElementById(errorDiv).innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
		document.getElementById(errorDiv).style.display="block";
		return false;
	}else{
		document.getElementById(errorDiv).style.display="none";
		document.getElementById('0-1001:0-1101-2201').style.border="1px solid #DDDDDD";
		return true;
	}
}
