
function callCallCenter(pkVal,rowName,rowId,savedQuery)
{
//	var phone = 9896321158;
	if(savedQuery)
		url=zcServletPrefix+'/custom/LZ/CallCenter/CallCenterView_update.html?market='+pkVal+"&"+savedQuery;
//Do not knowwhy primPhone was being hardcoded and passed as a paramter. So removed it 19/10/2011 7:09 PM Vadiraj
//		url=zcServletPrefix+'/custom/LZ/CallCenter/CallCenterView_update.html?market='+pkVal+"&"+savedQuery+"&primPhone="+phone;
	else
//Do not knowwhy primPhone was being hardcoded and passed as a paramter. So removed it 19/10/2011 7:09 PM Vadiraj
		url=zcServletPrefix+'/custom/LZ/CallCenter/CallCenterView_update.html?market='+pkVal;
//		url=zcServletPrefix+'/custom/LZ/CallCenter/CallCenterView_update.html?market='+pkVal+"&primPhone="+phone;
	setUpPageParameters(url,entityDiv)
}

function displayCalendar(pkVal,rowName,loginId,date)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Choose Appointment slot for '+rowName+'',
		//minWidth:250,
		minHeight:100,
		width:700,
		beforeclose: function() {}
	});		
	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='calendarFrame' frameborder='0' width='700' height='500' src='"+zcServletPrefix+"/custom/calendar/Test/weeksEvents.html?ui="+loginId+"&dateParam="+date+"&ci="+pkVal+"'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

function executeContextualMenu()
{
	hideFullContent();
}	
function showAddActivity(pk)
{
	showAQDialog('APTMT','/atCRM/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&Contact_id='+pk);
}
function addEmailTemplate(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addActivity4Lead(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+activityId+"&is_Appointment=1&is_DetailedAdd=1&Opportunity_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=1&Opportunity_Id="+pkVal;

	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addActivity4Ticket(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.json?id="+activityId+"&is_Appointment=1&is_DetailedAdd=1&Ticket_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.json?is_Appointment=1&is_DetailedAdd=1&Ticket_Id="+pkVal;
	
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addActivity4Opportunity(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+activityId+"&is_Appointment=1&is_DetailedAdd=1&Opportunity_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=1&Opportunity_Id="+pkVal;	

	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addActivity4Contact(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+activityId+"&is_Appointment=1&is_DetailedAdd=1&Contact_id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=1&Contact_id="+pkVal;

	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addActivity4Account(pkVal,rowName,rowId,entity,errordiv,activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+activityId+"&is_Appointment=1&is_DetailedAdd=1&acct_id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=1&acct_id="+pkVal;

	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");

	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function QaddActivity4Lead(pkVal)
{
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&is_Lead=1&Opportunity_Id="+pkVal;
	showAQDialog("APTMT",vURL)
}

function QaddActivity4Opportunity(pkVal)
{
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&Opportunity_Id="+pkVal;
	showAQDialog("APTMT",vURL)
}

function QaddActivity4Contact(pkVal,ui,Strtdate,EndDate)
{	
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&Contact_id="+pkVal+"&for_user="+ui+"&strt_time="+Strtdate+"&end_time="+EndDate;
	showAQDialog("APTMT",vURL);
}
function QaddActivity4ContactWithActvt(pkVal,ui,Strtdate,EndDate,contId,dispName,qWindwPos)
{	
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+pkVal+"&is_Appointment=1&is_DetailedAdd=0&Contact_id="+contId+"&for_user="+ui+"&strt_time="+Strtdate+"&end_time="+EndDate+"&prefsName=forCallqkAddAppointmentPrefs";
	showAQDialog("APTMT",vURL,"","","","","",dispName,qWindwPos);
}

function QaddAdd4Activity(pkVal,ui,date,dispName){
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&id="+pkVal+"&for_user="+ui+"&strt_time="+date+"&prefsName=forCallqkAddAppointmentPrefs";
	showAQDialog("APTMT",vURL,"","","","","",dispName);
}

/*function QaddAdd4Activity(pkVal,ui,Strtdate,EndDate){
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&id="+pkVal+"&for_user="+ui+"&strt_time="+Strtdate+"&end_time="+EndDate;
	showAQDialog("APTMT",vURL);
}*/

function QaddActivity4Account(pkVal)
{
	var vURL=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=1&is_DetailedAdd=0&acct_id="+pkVal;
	showAQDialog("APTMT",vURL)
}

function addTaskFromCalendar(activityId)
{
	if(activityId)
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?id="+activityId+"&is_Appointment=0&is_DetailedAdd=1";
	else
		var url=zcServletPrefix+"/custom/JSON/add/Activity.htm?is_Appointment=0&is_DetailedAdd=1";
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addInvtTransBetwnBrnches(pkVal,rowName,rowId,entity,errordiv,brchId)
{
	if(brchId)
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=betwnwhse&id="+pkVal+"&branch_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=betwnwhse&branch_Id="+pkVal;
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addInvtTransShipGoods(pkVal,rowName,rowId,entity,errordiv,brchId)
{
	if(brchId)
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=whsecust&id="+pkVal+"&branch_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=whsecust&branch_Id="+pkVal;
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function addInvtTransReceiveGoods(pkVal,rowName,rowId,entity,errordiv,brchId)
{
	if(brchId)
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=inward&id="+pkVal+"&branch_Id="+pkVal;
	else
		var url=zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=inward&branch_Id="+pkVal;
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function loadAddContact(usrPrefsMnuId,parentId)
{
	 var url ="custom/JSON/add/Contact.htm?userEnt=Contact";
	   window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#subMenu?mnuId=mnuList_"+usrPrefsMnuId+"&url="+url+"&LZValue=yes";

	   // window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+parentId+"-DataDiv&shownSubMenu=mnuList_"+usrPrefsMnuId+"&sid="+Math.random()+"&LZValue=yes";
	  // alert(loadUrl+" function alert1");
	  // alert(window.parent.location);
	 //  alert(top.location);
	 //  alert(window.parent.location.href+" alert2");
}

/*function toAEContact4rm360View(pkVal)
{
	if(pkVal)
	{
		var url=zcServletPrefix+"/custom/JSON/add/Contact.htm?id="+pkVal;
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	}
	else
	{
		parent.getAddDataFrmCache(zcServletPrefix+"/custom/JSON/add/Contact.htm");
	}
}
function toAEAccount4rm360View(pkVal)
{
	if(pkVal)
	{
		var url=zcServletPrefix+"/custom/JSON/add/Account.htm?id="+pkVal;
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	}
	else
	{
		parent.getAddDataFrmCache(zcServletPrefix+"/custom/JSON/add/Account.htm");
	}
}
function toAEOpportunity4rm360View(pkVal,contId)
{
	if(pkVal)
	{
		var url=zcServletPrefix+"/custom/JSON/add/Opportunity.htm?id="+pkVal;
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
	}
	else
		var url=zcServletPrefix+"/custom/JSON/add/Opportunity.htm?Contact_id="+contId;

		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();

}*/

function toAETypeBased4rm360View(pkVal,entityName,flagVal,id,idParam)
{	
	if(flagVal=="")
		flagVal=parent.type_based_layouts_supported_flag;
	if(pkVal)
	{
		var url=zcServletPrefix+"/custom/JSON/add/"+entityName+".htm?id="+pkVal;
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	}
	else
	{
		if(flagVal&&flagVal==1)
		{
			var JSONURL="/atCRM/custom/JSON/add/"+entityName+".htm?"+idParam+"="+id;
			$.ajax({
				type: "GET",
				url: JSONURL,
				async:false,
				dataType: "json",
				success: function (data){
					if(entityName=="Opportunity") parent.G_jsonresponse_Opportunity = eval(data);
					else if(entityName=="Account") parent.G_jsonresponse_Account = eval(data);
					else if(entityName=="Contact") parent.G_jsonresponse_Contact = eval(data);
				}
			});
			parent.getAddDataFrmCache(zcServletPrefix+"/custom/JSON/add/"+entityName+".htm");
		}
		else
		{
		var url=zcServletPrefix+"/custom/JSON/add/"+entityName+".htm?"+idParam+"="+id;
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
		window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
		//setUpPageParameters(zcServletPrefix+'/custom/JSON/add/'+entityName+'.htm?'+idParam+'='+id,entityDiv);

		}
	}
}


//for lifecell edit stage wise opportunity
function editOpptyLc(pkVal,contId,entity)
{
	var currentStageId;
	var currentStageName;

	var JSONURL=zcServletPrefix+"/custom/JSON/smartSuggest/leadInfo.htm?id="+pkVal;
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function (doc)
	{
		currentStageId=doc.LeadInfo.currentStageId;
		currentStageName=doc.LeadInfo.currentStageName;
		if(pkVal)
		 url=zcServletPrefix+"/custom/JSON/add/Lead.htm?id="+pkVal+"&stageId="+currentStageId+"&userEnt="+currentStageName;
		else
		 url=zcServletPrefix+"/custom/JSON/add/Lead.htm";
			
			url = url.replace(/\?/g,"~");
			url = url.replace(/&/g,"@");
			url = url.replace(/=/g,"*");
			window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	}
	});
}


function assignLead(pkVal,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	var JSONURL=zcServletPrefix+"/custom/JSON/smartSuggest/leadInfo.htm?id="+pkVal;
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		closeOnEscape:true,
		minHeight:120,
		minWidth:120,	
		width:280,		
		beforeclose: function() {putrowClass(rowId);}
	});
	if(rowId)
    document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
	document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Lead Assignment";
	
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function (doc)
	{
		var contactName=doc.LeadInfo.ContactName;
		var accName=doc.LeadInfo.AccName;
		var priEmail=doc.LeadInfo.PriEmail;
		var priPhone=doc.LeadInfo.PriPhone;
		var priCity=doc.LeadInfo.PriCity;
		var createdDate=doc.LeadInfo.CreatedDate;
		var contId=doc.LeadInfo.contId;
		var accId=doc.LeadInfo.accId;
		var userTerrs=doc.LeadInfo.users;
		var userData=userTerrs.split('~)');

		var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
		if (contactName!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Person</td><td>: " + contactName + "</td></tr>"; }
		if (accName!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Company</td><td>: " + accName + "</td></tr>"; }
		if (priEmail!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Email</td><td>: " + priEmail + "</td></tr>"; }
		if (priPhone!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Phone</td><td>: " + priPhone + "</td></tr>"; }
		if (priCity!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>City</td><td>: " + priCity + "</td></tr>"; }
		if (createdDate!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Created date</td><td>: " + createdDate + "</td></tr>"; }
		convertDivContent += "<tr><td width='100px' class='flexigrid'>Assign to</td><td>: ";
		var tempSelectTerr = "<input type='hidden' name='hiddenToBeAssignedTerr' id='hiddenToBeAssignedTerr'><input type='hidden' name='hiddenToBeAssignedUsers' id='hiddenToBeAssignedUsers'><select name='toBeAssignedUsers' id='toBeAssignedUsers' class='default' onchange='terrUserSelectedForIndAssign(this)'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>"
		for(var i=0; i<userData.length;i++)
		{
			var id=userData[i].split("--")[0];
			var val=userData[i].split("--")[1];
			tempSelectTerr += "<option value='"+id+"'>"+val+"</option>";
		}
		tempSelectTerr += "</select>";
		convertDivContent+= tempSelectTerr;
		convertDivContent+= "</td></tr>";
		convertDivContent += "<tr><td colspan='2' style='text-align:right'><br/><input type='button' value='Assign' align='center' style='margin-right:70px;width:55px' class='greenButton' onclick='javascript:assignTerrToIndividualUser("+pkVal+");'></td></tr>"; 
		convertDivContent += "</table></center><br/>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}
	});		
}

function terrUserSelectedForIndAssign(obj)
{
	var selectedUserId = obj.value.split("#TerrId#")[0];
	var selectedTerrId = obj.value.split("#TerrId#")[1];
	document.getElementById('hiddenToBeAssignedUsers').value=selectedUserId;
	document.getElementById('hiddenToBeAssignedTerr').value=selectedTerrId;
}

function assignTerrToIndividualUser(OppId)
{
	if (document.getElementById("toBeAssignedUsers").value=="" || document.getElementById('hiddenToBeAssignedUsers').value=="")
	{
		alert("Please select a user for assignment.");
		return;
	}
	var jsonUrl=zcServletPrefix+"/custom/leadManagement/leadAssignmentTruRR.html?terrCSV="+document.getElementById("hiddenToBeAssignedTerr").value+"&userCSV="+document.getElementById("hiddenToBeAssignedUsers").value+"&opptyCSV="+OppId
	$.ajax({
	type: "GET",
	url: jsonUrl,
	success: function ()
	{
		var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='0'>";
		convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Assignment successfull</b><br/><br/></td></tr>"; 
		convertDivContent += "</table>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup(1)",1000);
	},
	error: function() 
	{
		var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Assignment failed. Please try again.<b><br/><br/></td></tr>"; 
		convertDivContent += "</table></center><br/>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup()",1000);
	}
	});	
}

function closeCommonPopup(reload)
{
	try
	{		
		if(reload==1)	
		{
			if(!document.getElementById('360ViewDiv')||(document.getElementById('360ViewDiv')&&document.getElementById('360ViewDiv').style.display=="none"))
			{
				setUpPageParameters (document.getElementById(mnuItmId+"-URL").value,entityDiv);
			}
			else
			{
			rewriteViewPage();
			}
		}
	}
	catch (e){}
	$('#commonPopupDiv').dialog('close');
}

function convertToNextStage(pkVal,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	var JSONURL=zcServletPrefix+"/custom/JSON/smartSuggest/leadInfo.htm?id="+pkVal;
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:160,	
		width:380,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});
	if(rowId)
    document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
	
	$.ajax({
		type: "GET",
		url: JSONURL,
		dataType: "json",
		success: function (doc)
		{
			var opptyName = doc.LeadInfo.OpptyName;
			var opptyId = doc.LeadInfo.OpptyId;
			var contactName=doc.LeadInfo.ContactName;
			var accName=doc.LeadInfo.AccName;
			var priEmail=doc.LeadInfo.PriEmail;
			var priPhone=doc.LeadInfo.PriPhone;
			var priCity=doc.LeadInfo.PriCity;
			var createdDate=doc.LeadInfo.CreatedDate;
			var contId=doc.LeadInfo.contId;
			var accId=doc.LeadInfo.accId;
			var nextStage=doc.LeadInfo.nextStage;
			var nextStageId=doc.LeadInfo.nextStageId;
			var userTerrs=doc.LeadInfo.users;
			var userData=userTerrs.split('~)');	
		
		document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Convert to stage "+nextStage;

		var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
		if (opptyName!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Opportunity</td><td>: " + opptyName + "</td></tr>"; }
		if (contactName!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Person</td><td>: " + contactName + "</td></tr>"; }
		if (accName!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Company</td><td>: " + accName + "</td></tr>"; }
		if (priEmail!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Email</td><td>: " + priEmail + "</td></tr>"; }
		if (priPhone!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Phone</td><td>: " + priPhone + "</td></tr>"; }
		if (priCity!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>City</td><td>: " + priCity + "</td></tr>"; }
		if (createdDate!=""){ convertDivContent += "<tr><td width='100px' class='flexigrid'>Created date</td><td>: " + createdDate + "</td></tr>"; }
		convertDivContent += "</table></center><br/>";
		convertDivContent+="<div align='center'><input style='width:70px;margin-bottom:10px;' class='greenButton' type='button' value='Convert' onclick='moveOppToNextStage("+pkVal+",\""+contId+"\",\""+accId+"\",\""+nextStageId+"\",\""+nextStage+"\",\""+rowName+"\")' /></div>"

		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		}
	});		
}

function moveOppToNextStage(id,contId,accId,stageId,stageName,rowName)
{
	var jsonUrl=zcServletPrefix+"/custom/advancedAdd/AddEditLeadConvert/editAction?0-1-2="+id+"&0-201-202="+contId+"&0-401-402="+accId+"&0-1-34="+stageId+"&0-201-349=0&0-401-543=0&oppId="+id+"&contId="+contId+"&accId="+accId+"&oldStage="+stageId;

	$.ajax({
	type: "GET",
	url: jsonUrl,
	success: function ()
	{
		var convertDivContent = "<table align='center' style='margin-top:20px' cellpadding='3'>";
		convertDivContent += "<tr style='border:0px solid red'><td width='400px'  class='flexigrid' style='text-align:center'><b>'"+rowName+"'</b> converted to stage '"+stageName+"'.</td></tr></table></center><br/>"; 
		convertDivContent += "<div style='border:0px solid green;width:100px;margin-top:5px;margin-left:18px;'><input type='button' class='greenButton' style='width:120px;' onclick='javascript:setUpPageParameters(\"view/opportunity360View.htm?id="+id+"\",entityDiv,1)' value='View opportunity'></div><div style='border:0px solid red;margin-left:260px;width:120px;margin-top:-24px;'><input class='greenButton' type='button' style='width:120px;' onclick=\"javascript:gotoCallcenterPage('"+contId+"')\"  value='Go to Call-Center'></div><div style='border:0px solid red;margin-left:150px;width:100px;margin-top:-22px;'><input class='greenButton' type='button' style='width:100px;' onclick=\"javascript:gotoEditLeadPage('"+stageId+"','"+id+"')\"  value='Edit'></div><br/>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		//setTimeout("closeCommonPopup(1)",1000);
		},
	error: function() 
	{
		var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Lead conversion failed.</b></td></tr></table></center><br/>"; 
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup()",1000);
	}
	});	
}

function gotoCallcenterPage(contId)	
{
  setUpPageParameters (zcServletPrefix+"/custom/LZ/CallCenter/CallCenterView_update.html?id="+contId,entityDiv)
}

 function gotoEditLeadPage(stageId,id)
 {
	setUpPageParameters (zcServletPrefix+"/custom/JSON/add/Lead.htm?id="+id+"&stageId="+stageId+"&userEnt=Prospect",entityDiv)
 }


function multiAddOpp(url4add,url4list,addCaption,listCaption)
	{	
		document.getElementById('addpopUp').style.display="block";		
		document.getElementById('listCaption').style.display="block";		
		document.getElementById('listCaption').innerHTML=listCaption;		
		//document.getElementById('listPopUp').style.marginLeft="130px";	
		document.getElementById('listPopUp').style.display="block";	
		$('#addEntitytitlediv').dialog('open');
		$('#addEntitytitlediv').dialog({
			autoOpen:true,
			modal: true,
			width:900,			
			minHeight:500,
			minWidth:1000,
			title:addCaption,
			closeOnEscape:true
		});	
	
		mainUrl4add=zcServletPrefix+"/custom/JSON/"+url4add;
		$.ajax({
		type: "GET",
		url: mainUrl4add,
		success: function (dataAdd)
			{
			
				myData = JSON.parse(dataAdd, function (key, value) 
				{	var type;
					if (value && typeof value === 'object') 
						{
							type = value.type;
							if (typeof type === 'string' && typeof window[type] === 'function') 
							{
								return new (window[type])(value);
							}
						}
						return value;
				}); 
				
				handleAddEditJsonData(myData,'addpopUp','#addEntitytitlediv',url4add,url4list,addCaption,listCaption);		
			}
		})		

		mainUrl4list=zcServletPrefix+"/custom/JSON/"+url4list;
		$.ajax({
		type: "GET",
		url: mainUrl4list,
		success: function (datalist)
			{
			doclst = JSON.parse(datalist, function (key, value) 
				{
					var type;
					if (value && typeof value === 'object') 
						{
							type = value.type;
							if (typeof type === 'string' && typeof window[type] === 'function') 
							{
								return new (window[type])(value);
							}
						}
						return value;
				}); 
			
				handleJsonList(doclst,'listPopUp',500,$('#addEntitytitlediv').dialog.height);		
			}
		})

 }

 function LeadHistory(pkVal,rowName,rowId)
 {
	  document.getElementById("commonPopupDiv").innerHTML = "";
	  if(rowId)
	  document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
	  var JSONURL=zcServletPrefix+"/custom/JSON/system/historyassignment4lead.htm?id="+pkVal;
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			minHeight:120,
		    minWidth:120,	
		    width:280,
			title:'Assignment history',
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		$.ajax({
			type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			{			
				var allHistoryassignments = doc["allHistoryassignments"];
				var allHistoryassignmentsLength = allHistoryassignments.length;			
				
				if(allHistoryassignmentsLength>0)
				{

					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
						convertDivContent += "<tr><th width='10'>#</th><th width='100'>Assigned to</th><th width='150'>Assigned on</th></tr>"; 
						for(k=0,l=0;k<allHistoryassignmentsLength;k++,l++)
						{					
							serialNo = allHistoryassignments[l]["#"];					
							assignedTo =  allHistoryassignments[l]["AssignedTo"];				
							assignedOn =  allHistoryassignments[l]["AssignedOn"];				
							if (serialNo!=""){ convertDivContent += "<tr><td width='10' class='flexigrid' style='border:0px solid red' align='right'>"+ serialNo +"</td><td width='150'  class='flexigrid' style='border:0px solid red' align='left'>" + assignedTo + "</td><td width='150'  class='flexigrid' style='border:0px solid red' align='left'>" + assignedOn + "</td></tr>"; }
					
						}

						convertDivContent += "</table></center>";
				}
				else
				{		
			      var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' class='flexigrid'><br/><br/><b>Not yet assigned...</b><br/><br/></td></tr>"; 
					convertDivContent += "</table></center>";
					
				}
				
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
				
			}
	  });	
 }

 function DeactivateEntity(pk,rowName,rowId,entity,inactive)
 {
	   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			minHeight:120,
		    minWidth:120,	
		    width:280,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
		
		if(inactive)
		$('#commonPopupDiv').dialog({ title:'Activate '});
		else
		$('#commonPopupDiv').dialog({ title:'Deactivate '});
		 if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		if(inactive)
		 {
			convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center> Are you sure you want to activate <b>"+rowName+"?</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:deactivateOnConfirm('"+pk+"','"+entity+"','"+inactive+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+pk+"','"+entity+"')\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>"
		 }
	 else
		 {
			   inactive=0;
			   convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center> Are you sure you want to deactivate <b>"+rowName+"?</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:deactivateOnConfirm('"+pk+"','"+entity+"','"+inactive+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+pk+"','"+entity+"')\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>"
		 
		 }
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
		document.getElementById("commonPopupOK").focus(); 
 }

 function closePopup()
 {
   $('#commonPopupDiv').dialog('close');
 
 }

 function putrowClass(rowId)
	{ 	
		if(rowId)
		{if(document.getElementById(rowId)) document.getElementById(rowId).setAttribute("class", "rowClass"); }
	}

 function deactivateOnConfirm(primaryKey,entityName,inactive)
 {  
	
   var JSONURL=zcServletPrefix+"/custom/JSON/system/deactivateEntity/editAction?0-1="+primaryKey+"&0-101="+entityName+"&0-201="+inactive;
     $.ajax({
		type: "GET",
			url: JSONURL,			
			success: function (doc)
			   {
			
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					if(inactive==0)
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>"+entityName+" deactivated successfully</b><br/><br/></td></tr>";
					else
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>"+entityName+" Activated successfully</b><br/><br/></td></tr>";
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					if(inactive==0)
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Deactivate failed. Please try again.</b><br/><br/></td></tr>"; 
					else
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Activation failed. Please try again.</b><br/><br/></td></tr>";
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});	
 
 }
 
function AddNotesToEntity(pk,rowName,rowId,entity,errordiv,noteId)
{  	
	//alert(pk+","+rowName+","+rowId+","+entity)
	document.getElementById("commonPopupDiv").innerHTML = "";
	if(noteId) var title='Edit Notes'; else { var title='Add Note to '+rowName; noteId="";}
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:title,
		minHeight:250,
		minWidth:400,	
		width:400,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});

	if(rowId)
	document.getElementById(rowId).setAttribute("class", "rowSelectedClass");

	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<tr><td colspan='2' ><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;' vertical-align:text-top> <font align='center' >Non-empty value needed for 'Notes'.</font></div><div align='center' ><textarea rows='10' cols='80' align='center' style='margin-top:4px;text-align:left' class='inputFieldClass' id='noteArea' maxlength='2000'></textarea><input style='width:70px;margin-top:5px;' class='greenButton' type='button' value='Save' onclick=\"javascript:addNoteOnConfirmforNote('"+pk+"','"+entity+"','"+noteId+"')\"/></div></td><tr>"
	convertDivContent += "</table></center>";

	if(noteId)
	{
		JSONURL=zcServletPrefix+"/custom/JSON/system/getNotesforEntity.htm?tableName="+entity+"&id="+noteId;
		$.ajax({
		type: "GET",			
		dataType: "json",
		url: JSONURL,			
		success: function (data)
		{
			var Notes = data["Notes"];
			var Content= Notes["Content"];	
			document.getElementById("noteArea").value=Content;
		}});	 
	}
	if(errordiv)
	{
		$('#commonPopupDiv').dialog.height="250"
		document.getElementById("errorDiv").innerHTML="Note field cannot be blank.";   
	}
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}

function ViewNotesOfEntity(entity,noteId)
{	 	
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'View Notes',
		minHeight:150,
		minWidth:450,	
		width:450,
		closeOnEscape:true
	});

	JSONURL=zcServletPrefix+"/custom/JSON/system/getNotesforEntity.htm?tableName="+entity+"&id="+noteId;
	$.ajax({
	type: "GET",			
	dataType: "json",
	url: JSONURL,			
	success: function (data)
	{
		var Notes = data["Notes"];
		var Content= Notes["Content"];	
		var notedOn= Notes["notedOn"];	
		var notedBy= Notes["notedBy"];	

		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr><td style='height:120px' valign='top'><p style='margin-top:0px' align='justify'>"+Content+"</p></td></tr><tr><td style='font-size:10px'>Noted on: "+notedOn+"&nbsp;&nbsp;Noted by: "+notedBy+"</td></tr>"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}});	 	
	
}

function addNoteOnConfirmforNote(pk,entity,noteId)
{
	var val=document.getElementById("noteArea").value;
	if(val.length>2000)
	{
	   document.getElementById("errorDiv").style.display="block";
	   document.getElementById("errorDiv").innerHTML="Note should be less than 2000 characters.";
	}
	else
	{
	if(val=='')
	 {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	 }
		 else
		{
			addNoteOnConfirm(pk,entity,noteId)
		}
	}
}
 function addNoteOnConfirm(pk,entity,noteId)
 {
    var val=document.getElementById("noteArea").value; 
	if(parseInt(noteId)!=NaN&&parseInt(noteId))var JSONURL=zcServletPrefix+"/custom/JSON/system/addNoteToEntity.html?tableName="+entity+"&entityId="+pk+"&content="+val+"&id="+noteId;else var JSONURL=zcServletPrefix+"/custom/JSON/system/addNoteToEntity.html?tableName="+entity+"&entityId="+pk+"&content="+val;
     $.ajax({
		type: "POST",
			url: JSONURL,			
			success: function (doc)
			   {
			
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					if(noteId)convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Note edited successfully</b><br/><br/></td></tr>";else convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Note added successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					if(noteId)convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Note is not edited. Please try again.</b><br/><br/></td></tr>"; else convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Note is not added. Please try again.</b><br/><br/></td></tr>";
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});	 
 }



 function ReassignTerritory(pkVal,rowName,rowId)
 {

  var JSONURL=zcServletPrefix+"/custom/JSON/system/Territory4Account.htm?id="+pkVal;
   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Reassign Territory for '+rowName,
			minHeight:120,
		    minWidth:120,	
		    width:500,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");

		$.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			{
				
				var allTerritories = doc["allTerritories"];
				var allTerritoriesLength = allTerritories.length;			
				var convertDivContent = "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='420' align='center' style='vertical-align:middle;background-color:#dddddd;margin-top:5px; border:0px solid red;' >";
		
		          convertDivContent += "<tr valign='middle' class='TblBdy' cellspacing='3'  border='1'><th border='1' width='115' cellspacing='3'>Territory</th><th border='1' width='100' cellspacing='3' >Owned by user</th><th border='1' width='75' cellspacing='3' >Rights</th></tr>"; 
				 
						for(k=0,l=0;k<allTerritoriesLength;k++,l++)
						{	
							
							Name = allTerritories[l]["Name"];					
							OwnedByUsers =  allTerritories[l]["OwnedByUsers"];				
							Rights =  allTerritories[l]["Rights"];	
							terrId=   allTerritories[l]["terrId"];	
							if (Name!=""){ convertDivContent += "<tr valign='middle' border='1' cellspacing='3'  cellpadding='3'><td valign='middle' border='1' width='115' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3'  cellpadding='3'><a href='javascript:updateTerritory("+terrId+","+pkVal+")' style='color:blue'>"+ Name +"</a></td><td valign='middle' border='1' cellspacing='3'  cellpadding='3' width='100'  class='TblBdy' style='border:0px solid red' align='left'>" + OwnedByUsers + "</td><td valign='middle' border='1' width='75'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>" + Rights + "</td></tr>"; }
							
						}

				convertDivContent += "</table></center><br/>";
               document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			
			}
			});	
 }

 function updateTerritory(terrId,pkVal)
 {

	 var JSONURL=zcServletPrefix+"/custom/JSON/system/Territory4Account/editAction?0-201="+pkVal+"&0-101="+terrId;
     $.ajax({
		type: "GET",
			url: JSONURL,			
			success: function (doc)
			   {
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Territory assigned</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Territory assignment failed. Please try again.<br/><br/></td></tr>"; 
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});	
 }


  function printEntityView(Id,rowName,rowId,entity)
  {  
	
	if (entity=="Ticket")
    {		
		var url = zcServletPrefix+"/custom/print/printTicket.html?id="+Id;		
		window.open(url,"PrintWindow",'top=50,left=50,height=500,width=600,resizable=yes,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes'); 
	}
	else if(entity=='Activity')
	{
		   window.open(zcServletPrefix+"/custom/entityView/printActivity.html?id="+Id+"&page__size__201=0&page__size__301=0&page__size__401=0&page__size__501=0&page__size__1301=0","","top=50,left=50,height=700,width=800,toolbar=yes, location=yes, directories=no, status=yes, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes");
	}
	 else
	 {		
		   var url = zcServletPrefix+"/custom/print/print"+entity+".html?"+entity+"Id="+Id;  		 window.open(url,"PrintWindow",'top=50,left=50,height=500,width=600,resizable=yes,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes');  
	 }
  }


function sendEmail2Contact(contactid,rowName,rowId,email)
{			 
	var JSONURL=zcServletPrefix+"/custom/JSON/system/verifyEmail4Contact.htm?id="+contactid;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			   {  
			      var contactInfo = data["Contact"];
				  var priEmail= contactInfo["priEmail"];
				  if(priEmail=='')
					{
						document.getElementById("commonPopupDiv").innerHTML = "";
						$('#commonPopupDiv').dialog({
							autoOpen:true,
							modal: true,
							title:'Send Email to '+rowName,
							minHeight:120,
							minWidth:120,	
							width:280,
							beforeclose: function() {putrowClass(rowId);}
						});
					  if(rowId)
					  document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
						var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>No Primary email address..</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
					  
					}			 
				 
					else
					{
						document.getElementById("commonPopupDiv").innerHTML = "";
						$('#commonPopupDiv').dialog({
							autoOpen:true,
							modal: true,
							title:'Send Email to '+rowName,
							minWidth:300,
							minHeight:550,
							width:770,
							beforeclose: function() {putrowClass(rowId);}
						});						
						if(rowId)	
						document.getElementById(rowId).setAttribute("class", "rowSelectedClass");	
						var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
						convertDivContent+="<iframe id='emailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/EmailTemplate/sendEmail_FromTemplate.html?entity=Contact&id="+contactid+"&toEmail="+email+"&frmPgLvl=1' width='750px' style='border:0px solid red' > </iframe>"
						convertDivContent += "</table></center>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
					}

             }
	 });

}

//9/8/2010
//Vadiraj this function is used to show email pop up from Opportunity view screen
function sendEmailBids(opptyId)
{			 
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Invite Bids',
		minWidth:300,
		minHeight:550,
		width:770
	});						
		
	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='emailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/EmailTemplate/sendEmail_FromTemplate.html?entity=Contact&opptyId="+opptyId+"&fromBid=yes&frmPgLvl=1' width='750px' style='border:0px solid red' > </iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

function sendEmailToPrintOrder(HeaderId,rowName,filename)
{
	var url=zcServletPrefix+"/custom/Quote/getAjaxRespons4ViewQuote.htm?HeaderId="+HeaderId+"&fileName="+filename
	$.ajax({
				type: "GET",
				url: url,
				dataType: "json",
				async: false,
				success: function (doc)
				{	
				  var contId = doc["contId"];
                  //var attachfileVal = quoteIdentVal[0]?quoteIdentVal[0].getAttribute("identVal") : null;
				  alert("contactId"+contId)
				 // document.getElementById('0-1-88').value=attachfileVal;
				  //document.mainForm.action="${servlet_prefix}/custom/Quote/viewQuote.html?flag=2&headerId="+headerId+"&fileName="+attachfileVal,

				  document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog({
						autoOpen:true,
						modal: true,
						title:'Send Email to '+rowName,
						minWidth:300,
						minHeight:550,
						width:770
					});		

					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
					var test = zcServletPrefix+"/custom/mails/finalSendMail.html?is_compose=1&exterAttchFile="+filename+"&contId="+contId;
					convertDivContent+="<iframe id='emailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/mails/finalSendMail.html?is_compose=1&exterAttchFile="+filename+"&contId="+contId+"' width='750px' style='border:0px solid red' > </iframe>"
					convertDivContent += "</table></center>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
				}
		});
}

function sendSMS2Contacts(contactid,rowName,rowId)
{
   	 var JSONURL=zcServletPrefix+"/custom/JSON/system/verifyPhoneNo4Contact.htm?id="+contactid;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			   {  
			      var contactInfo = data["Contact"];
				  var priPhone= contactInfo["priPhone"];
				  if(priPhone=='')
					{					  
					document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog({
						autoOpen:true,
						modal: true,
						title:'Send SMS',
						minHeight:120,
						minWidth:120,	
						width:280,
						beforeclose: function() {putrowClass(rowId);}
					});
					    if(rowId)
						document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
						var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>No phone number to send SMS</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
					  
					}
					else
				   {	
						document.getElementById("commonPopupDiv").innerHTML = "";
						$('#commonPopupDiv').dialog({
							autoOpen:true,
							modal: true,
							title:'Send SMS to '+rowName,
							minHeight:250,
							minWidth:325,	
							width:325,
							beforeclose: function() {putrowClass(rowId);}
						});
					   /* document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
						document.getElementById("nonJsoncommonPopupDiv").innerHTML = "";						
						document.getElementById("nonJsoncommonPopupDiv").style.display="block";					
						document.getElementById("nonJsoncommonPopupDiv").style.width="260px";					
						document.getElementById("nonJsoncommonPopupDiv").style.height="490px";					
						document.getElementById("nonJsoncommonPopupDiv").style.position="absolute";				
						document.getElementById("nonJsoncommonPopupDiv").style.top="80px";
						document.getElementById("nonJsoncommonPopupDiv").style.left="500px";	*/
					
						var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
						convertDivContent+="<iframe id='SMSFrame' style='display:block'  frameborder='0' src='"+zcServletPrefix+"/custom/SMSTemplate/sendSMSUsingTemplates.htm?contactId="+contactid+"' width='320' height='240'></iframe>"
						convertDivContent += "</table></center>";	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				  }
			}
	 });
	
}

function hideSMSDiv()
{
	document.getElementById("nonJsoncommonPopupDiv").style.position="relative";	 
	document.getElementById("nonJsoncommonPopupDiv").style.top="0px";	 
	document.getElementById("nonJsoncommonPopupDiv").style.left="0px";	 
	document.getElementById("nonJsoncommonPopupDiv").style.display="none";	 
}


function sendMassEmail2Contacts(id,rowName,rowId)
{
   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Send mass Email to Contacts',
			minHeight:120,
		    minWidth:120,	
		    width:800,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
        document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<iframe id='emailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/sh1/na1/su1/Mktg_Program.html?Flag=1&Mktg_ProgramId="+id+"&fromPglvl=1' width='750px' height='400'> </iframe>"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}


function sendMassSMS2Contacts(id,rowName,rowId)
{
 document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Send mass SMS to Contacts',			
			minHeight:120,
		    minWidth:120,	
		    width:630,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
        var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<iframe id='massEmailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/marketing/composeSMS.html?mktgPrgmId="+id+"&fromPglvl=1' width='570px' height='400' style='margin-top:10px;margin-left:20px;border:0px solid red;'> </iframe>"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	
}


function copyContacts(pk,rowName,rowId)
{
  document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Copy Contacts from '+rowName,
			minHeight:120,
		    minWidth:120,	
		    width:300,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
        document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr><td colspan='2'><div id='autosuggestMktgList' name='autosuggestMktgList' style='position:fixed;z-index:10;left:375px;' class='autosuggest' ><ul></ul></div><div style='border:0px solid red; margin-top:20px;text-align:center;'><font><b>Select Marketing Program</b></font><br/><font style='text-align:center;font-size:10px;color:#999999'> All the contacts will be copied to the selected Marketing program.</font><input type='text' style='margin-left:16px;margin-top:5px' value='2 chars or *' onfocus='javascript:clearMessage(this.id);' onkeypress=\"javascript:listMarketingProgram('smartSuggestDiv',this.id,event.keyCode,this.value,'"+pk+"')\"  onblur=\"javascript:checknReplaceVal(this.value,this.id);\" class='inputFieldClass' id='mktgPgmtxt' name='mktgPgmtxt' ><input type='hidden' name='mktgPgm' id='mktgPgm' size='25' value=''><input type='hidden' name='existname' id='existname' size='25' value=''></div><input style='width:100px;margin-top:15px;margin-left:110px;' class='greenButton' type='button' value='Copy contacts' onclick=\"javascript:copyAllContacts('1','"+pk+"')\"><td></tr>"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;		

}

function moveContacts(pk,rowName,rowId)
{
  document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Move Contacts from '+rowName,
			minHeight:120,
		    minWidth:120,	
		    width:300,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
       document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr><td colspan='2'><div id='autosuggestMktgList' name='autosuggestMktgList' style='position:fixed;z-index:10;left:375px;' class='autosuggest' ><ul></ul></div><div style='border:0px solid red; margin-top:20px;text-align:center;'><font><b>Select Marketing Program</b></font><br/><font style='text-align:center;font-size:10px;color:#999999'> All the contacts will be copied to the selected Marketing program.</font><input type='text' value='2 chars or *' onfocus='javascript:clearMessage(this.id);' style='margin-left:16px;margin-top:5px' onkeypress=\"javascript:listMarketingProgram('smartSuggestDiv',this.id,event.keyCode,this.value,'"+pk+"')\"  onblur=\"javascript:checknReplaceVal(this.value,this.id);\" class='inputFieldClass' id='mktgPgmtxt' name='mktgPgmtxt' ><input type='hidden' name='mktgPgm' id='mktgPgm' size='25' value=''><input type='hidden' name='existname' id='existname' size='25' value=''></div><input style='width:100px;margin-top:15px;margin-left:110px;' class='greenButton' type='button' value='Move contacts' onclick=\"javascript:copyAllContacts('0','"+pk+"')\">"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;		

}

function addContactToMarketingPgm(pk,rowName,rowId)
{
  document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Add '+rowName+' to Marketing pgm',
			minHeight:120,
		    minWidth:120,	
		    width:300,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<div align='center' id='errorDivcontmktg' class='errorDiv' name='errorDivcontmktg' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;' vertical-align:text-top><font align='center' style='margin-top:0px'>Contact is already linked to selected Marketing pgm.</font></div><span style='float:right'><div id='autosuggestMktgList' name='autosuggestMktgList' style='position:fixed;z-index:10;left:375px;' class='autosuggest' ><ul></ul></div><div style='border:0px solid red; margin-top:20px;text-align:center;'><font><b>Select Marketing Program</b></font><br/><font style='text-align:center;font-size:10px;color:#999999'>Chosen Marketing program will be linked to this Contact.</font>    <input type='text'  value='2 chars or *' onfocus='javascript:clearMessage(this.id);' style='margin-left:16px;margin-top:5px' onkeyup=\"javascript:listMarketingProgram('smartSuggestDiv',this.id,event.keyCode,this.value,'')\"  onblur=\"javascript:checknReplaceVal(this.value,this.id);\" class='inputFieldClass' id='addmktgPgmtxt' name='addmktgPgmtxt' ><input type='hidden' name='addmktgPgm' id='addmktgPgm' size='25' value=''><input type='hidden' name='ename' id='ename' size='25' value=''></div><input style='width:70px;margin-top:15px;margin-left:110px;' class='greenButton' type='button' value='Next' onclick=\"javascript:checkforContmtgId('"+pk+"')\"></span>"
		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
       
}

function checkforContmtgId(pk)
{
  var contId=pk;
  var MktgId=document.getElementById("addmktgPgm").value;
  var contId=pk;
  var MktgId=document.getElementById("addmktgPgm").value;
  var JSONURL=zcServletPrefix+"/custom/JSON/system/checkContMktgPgm.htm?contId="+contId+"&MktgId="+MktgId
	 $.ajax({
	 type: "GET",
	 dataType: "json",
	 url: JSONURL,			
	 success: function (data)
		 {
			
			  var contMktgInfo = data["ContactMktgPgm"];		
			  var ContactMktgPgmId= contMktgInfo["ContactMktgPgmId"];
			  if(ContactMktgPgmId)
				{
					document.getElementById('errorDivcontmktg').style.display="block";
					return;
				}
				else
				{
				linkContactToMktgPgm(pk);
				}

		}

  });

}

function linkContactToMktgPgm(pk)
{
	var contId=pk;
	var MktgId=document.getElementById("addmktgPgm").value;
    var JSONURL=zcServletPrefix+"/custom/JSON/system/checkContMktgPgm.htm?contId="+contId+"&MktgId="+MktgId
	
				var JSONURL=zcServletPrefix+"/custom/JSON/system/addToMktgProgram/editAction?0-1="+contId+"&0-101="+MktgId
				 $.ajax({
					type: "GET",
						url: JSONURL,			
						success: function (doc)
						   {			
								var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
								convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Marketing program linked to the Contact </b><br/><br/></td></tr>"; 
								convertDivContent += "</table>";
								document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
								setTimeout("closeCommonPopup(1)",1000);
							},
							error: function() 
							{
								var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
								convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Marketing program is not linked to the Contact. Please try again.<br/><br/></td></tr>"; 
								convertDivContent += "</table></center><br/>";
								document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
								setTimeout("closeCommonPopup()",1000);
							}
						});			
		
}

function listMarketingProgram(divName,txtId,key,val,pk)
{
	
   var fromId=pk;
	
	if(key==13)
	{
		return false;
	}
	else if(val.length>=1)
		{
		    $.ajax({
			type: "GET",
			url: zcServletPrefix+"/custom/CallCenter/listMarketingProgram.xml?str="+val+"&fromId="+fromId,
			dataType: "xml",
			success: function (doc)
			{				
				var MarketingProgram = doc.getElementsByTagName("MarketingProgram");
				var marketingProgramName=MarketingProgram[0]?MarketingProgram[0].getAttribute("marketingProgramName") : null;
				var temp = new Array();
				temp = marketingProgramName.split('~)');
				
				new AutoSuggest(divName,document.getElementById(txtId),temp);
				
				}
			});
		}
}

function copyAllContacts(copyOrMove,pk)
{
  var fromMktgId=pk;
  var toMktgId=document.getElementById("mktgPgm").value;
  var toMktName=document.getElementById("mktgPgmtxt").value;
  var existValue=document.getElementById("existname").value;
  
  

 if (fromMktgId == toMktgId)
  {
    alert("From marketing program and To marketing program should be different");
	document.getElementById("mktgPgmtxt").value='';
	document.getElementById("mktgPgmtxt").focus();
	return;
  }
   else if((toMktgId == '') && (toMktName=="2 chars or *"))
  {
    alert("Non empty value needed for the field TO Marketing Program");
	document.getElementById("mktgPgmtxt").focus();
	return;
  }
   else if((toMktgId == '') && (toMktName==""))
  {
    alert("Non empty value needed for the field TO Marketing Program");
	document.getElementById("mktgPgmtxt").focus();
	return;
  }
  else if (existValue)
  {
    alert("Marketing Program already exists");
	document.getElementById("mktgPgmtxt").focus();
	document.getElementById('autosuggestMktgList').style.display="none";
	return;
  }
   else if (fromMktgId != toMktgId)
  {
    copyMoveContacts(copyOrMove,pk,toMktgId,toMktName);
  }

}

function copyMoveContacts(copyOrMove,pk,toMktgId,toMktName)
{
 
  var fromMktgId=pk;
 
  //var noOfContact=document.getElementById("contactno").value;
  //var noOfToMktgContacts=document.getElementById("0-201").value;

   
  if(copyOrMove == '1')
  {
     
		if(toMktgId != '')
		{
		            
		 $.ajax({
					type: "POST",
					url: zcServletPrefix+"/custom/CallCenter/marketingContactDetails.xml?isCopy="+copyOrMove+"&fromMktgId="+fromMktgId+"&toMktgId="+toMktgId+"&toMktName="+toMktName,
					dataType: "xml",
					async: "false",
					success: function (doc){
						var count = doc.getElementsByTagName("count");
						var contactCount = count[0]?count[0].getAttribute("contactCount") : null;
						var copiedContCount = doc.getElementsByTagName("copiedContCount");
						var copiedContactCount = copiedContCount[0]?copiedContCount[0].getAttribute("copiedContactCount") : null;
						
						var movedContCount = doc.getElementsByTagName("movedContCount");
						var movedContactCount = movedContCount[0]?movedContCount[0].getAttribute("movedContactCount") : null;
		   				
						
 				       var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contacts Copied Successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);						
					}
					,
					error: function() 
					{
						var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Contacts not Copied. Please try again.</b><br/><br/></td></tr>"; 
						convertDivContent += "</table></center><br/>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup()",1000);
					}
					 
				});
				toMktName=unescape(toMktName);
		        
				document.getElementById('mktgPgmtxt').value="";	
				document.getElementById('mktgPgm').value="";	
				
				
                        
		}
		else if(toMktgId == '')
		{
		 
		  $.ajax({
					type: "POST",
					url: zcServletPrefix+"/custom/CallCenter/marketingContactDetails.xml?isCopy="+copyOrMove+"&fromMktgId="+fromMktgId+"&toMktName="+toMktName,
					dataType: "xml",
					success: function (doc){
					  var count = doc.getElementsByTagName("count");
						var contactCount=count[0]?count[0].getAttribute("contactCount") : null;
		   				var copiedContCount = doc.getElementsByTagName("copiedContCount");
						var copiedContactCount = copiedContCount[0]?copiedContCount[0].getAttribute("copiedContactCount") : null;
						
						var movedContCount = doc.getElementsByTagName("movedContCount");
						var movedContactCount = movedContCount[0]?movedContCount[0].getAttribute("movedContactCount") : null;
		   				/*document.getElementById('0-201').value=contactCount;
		   				document.getElementById('0-301').value=copiedContactCount;
						
		   				document.getElementById('0-401').value=movedContactCount;*/
						
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contacts Copied Successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);						
					}
					,
					error: function() 
					{
						var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Contacts not Copied. Please try again.</b><br/><br/></td></tr>"; 
						convertDivContent += "</table></center><br/>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup()",1000);
					}
				});
              document.getElementById('mktgPgmtxt').value="";	
			  document.getElementById('mktgPgm').value="";	
		}
}
else
  {
  if(copyOrMove == '0')
  {
		 if(toMktgId != '')
		 {
		   $.ajax({
					type: "POST",
					url: zcServletPrefix+"/custom/CallCenter/marketingContactDetails.xml?isCopy="+copyOrMove+"&fromMktgId="+fromMktgId+"&toMktgId="+toMktgId+"&toMktName="+toMktName,
					dataType: "xml",
					success: function (doc){
					   var count = doc.getElementsByTagName("count");
						var contactCount=count[0]?count[0].getAttribute("contactCount") : null;
		   				var copiedContCount = doc.getElementsByTagName("copiedContCount");
						var copiedContactCount = copiedContCount[0]?copiedContCount[0].getAttribute("copiedContactCount") : null;
						
						var movedContCount = doc.getElementsByTagName("movedContCount");
						var movedContactCount = movedContCount[0]?movedContCount[0].getAttribute("movedContactCount") : null;
						
		   				/*document.getElementById('0-201').value=contactCount;
		   				document.getElementById('0-301').value=copiedContactCount;
		   				document.getElementById('0-401').value=movedContactCount;*/
						

					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contacts moved Successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);						
					}
					,
					error: function() 
					{
						var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Contacts not moved. Please try again.</b><br/><br/></td></tr>"; 
						convertDivContent += "</table></center><br/>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup()",1000);
					}
				});
				document.getElementById('mktgPgm').value="";	
				document.getElementById('mktgPgm').value="";	
				
		 }
		 else if(toMktgId == '')
		{
		 
		  $.ajax({
					type: "POST",
					url: zcServletPrefix+"/custom/CallCenter/marketingContactDetails.xml?isCopy="+copyOrMove+"&fromMktgId="+fromMktgId+"&toMktName="+toMktName,
					dataType: "xml",
					success: function (doc){
					  var count = doc.getElementsByTagName("count");
						var contactCount=count[0]?count[0].getAttribute("contactCount") : null;
		   				var copiedContCount = doc.getElementsByTagName("copiedContCount");
						var copiedContactCount = copiedContCount[0]?copiedContCount[0].getAttribute("copiedContactCount") : null;
						
						var movedContCount = doc.getElementsByTagName("movedContCount");
						var movedContactCount = movedContCount[0]?movedContCount[0].getAttribute("movedContactCount") : null;
		   				document.getElementById('0-201').value=contactCount;
		   				document.getElementById('0-301').value=copiedContactCount;
		   				document.getElementById('0-401').value=movedContactCount;
						
						
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contacts moved Successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);						
					}
					,
					error: function() 
					{
						var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>Contacts not moved.Please try again.</b><br/><br/></td></tr>"; 
						convertDivContent += "</table></center><br/>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup()",1000);
					}
				});
               document.getElementById('mktgPgmtxt').value="";	
			   document.getElementById('mktgPgm').value="";	
			   
		 }
	}
      
  } 

}

function checknReplaceVal(mktgName,id)
{  

	if(mktgName=='')
		{
		var str=id;
		len=str.length;
		var wordId=str.slice(0,len-3);
		document.getElementById(id).value='2 chars or *';
		document.getElementById(wordId).value='';
	}
   	 if(mktgName)
		{
		   
			$.ajax({
			type: "GET",
			url: zcServletPrefix+"/custom/CallCenter/getToMarketingProgram.xml?toMktName="+mktgName,
			dataType: "xml",
			success: function (doc)
			{
				var toMktgName = doc.getElementsByTagName("toMktgName");
				var marketingName = toMktgName[0]?toMktgName[0].getAttribute("marketingName") : null;
				if(document.getElementById('existname'))document.getElementById('existname').value=marketingName;			
				}
			});
		}
}

function clearMessage(id)
{

  document.getElementById(id).value='';
  document.getElementById(id).style.backgroundColor="white";
  document.getElementById(id).focus();
  
}


function markComplete(pk,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Mark Complete - '+rowName,
			minHeight:120,
		    minWidth:120,	
		    width:300,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
 if(rowId)
document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
  var JSONURL=zcServletPrefix+"/custom/JSON/system/VerifyActvtStatus.htm?id="+pk;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			   {  
			      var statusInfo = data["Activity"];
				  var status= statusInfo["activityStatus"];
				  if(status=='Completed')
					{
						var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>This Activity is already marked as 'Completed'</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
					  
					}
				    else
				    {				  
						var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
						convertDivContent+="<span align='center' style='float:right; border:0px solid blue'><div align='center' style='margin-top:30px;border:0px solid red'> Are you sure to Mark <b>"+rowName+"</b> as Complete?</div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:MarkCompleteOnConfirm('"+pk+"')\"  class='greenButton' type='button' value='OK'/></div></span>"
						convertDivContent += "</table></center>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				    }
		       }
	 });
		
}

function MarkCompleteOnConfirm(pk,Status)
{	
	if(Status)
		//var JSONURL=zcServletPrefix+"/custom/JSON/system/MarkActivityStatus.html?0-1="+pk+"&Status="+Status;
		var JSONURL="/atCRM/custom/JSON/system/MarkActivityStatus.html?id="+pk+"&Status="+Status;
	else
		//var JSONURL=zcServletPrefix+"/custom/JSON/system/MarkActivityStatus.html?0-1="+pk+"&Status=Completed";
		var JSONURL="/atCRM/custom/JSON/system/MarkActivityStatus.html?id="+pk+"&Status=Completed";
     $.ajax({
		type: "GET",
			url: JSONURL,			
			success: function (doc)
			   {			
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Marked as Completed</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Activity not marked as Completed. Please try again.<br/><br/></td></tr>"; 
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});	
}

function sendContact(pk,rowName,rowId)
{

     document.getElementById("commonPopupDiv").innerHTML = "";  
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			minHeight:165,
		    minWidth:120,	
		    width:285,
			title:'Send as Contact',
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
	 if(rowId)
	document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
    var JSONURL=zcServletPrefix+"/custom/JSON/system/sendContactAsSMS.htm?contId="+pk;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			   {                

			    var contInfo = data["ContactInfo"];
								
				var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
				name = contInfo["displayName"];					
				workPhone =  contInfo["workPhone"];				
				emailId =  contInfo["emailId"];	
				mobilePhone =  contInfo["mobilePhone"];	
				convertDivContent += "<tr><th width='450' colspan='2' align='left' style='border:0px solid red'><font style='text-align:center;font-size:10px;color:#999999'>This Contact will be sent to you as an SMS</font></th></tr>";
				convertDivContent += "<tr><th width='450' colspan='2' align='left' style='border:0px solid red'>"+name+"</th></tr>";
				if (workPhone!=""){ convertDivContent += "<tr><td width='180' align='left' style='color:#999999'><b>Work phone:</b></td><td width='180' align:'left' class='flexigrid' style='border:0px solid red;'>"+ workPhone +"</td></tr>"; }						
				if (mobilePhone!=""){ convertDivContent += "<tr><td width='180' align='left' style='border:0px solid red;color:#999999'><b>Mobile phone:</b></td><td width='180'  class='flexigrid' style='border:0px solid red' align='left'>" + mobilePhone + "</td></tr>"; }		
				if (emailId!=""){ convertDivContent += "<tr><td width='180' align='left' style='color:#999999'><b>Email address:</b></td><td width='180'  class='flexigrid' style='border:0px solid red;' align='left'>" + emailId + "</td></tr>"; }	
				if (name!=""){ convertDivContent += "<tr><td width='180' align='left' style='color:#999999'></td><td width='180'  class='flexigrid' style='border:0px solid red;' align='left'></td></tr>"; }						
				convertDivContent += "</table></center>";
				if (name!=""){ convertDivContent += "<div style='border:0px solid red;position:absolute;left:120px;width:50px;bottom:5px;'><input style='width:70px;margin-left:70px;' onclick=\"javascript:sendContAsSMS('"+pk+"')\"  class='greenButton' type='button' value='Send'></div>"; }						
				convertDivContent += "</table></center>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;				    	
					
				}

           })
}


function sendContAsSMS(pk)
{
   var JSONURL=zcServletPrefix+"/custom/JSON/system/sendSMS.html?id="+pk;
     $.ajax({
		type: "GET",
			url: JSONURL,			
			success: function (doc)
									{
		                               	var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
										convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contact sent successfully</b><br/><br/></td></tr>"; 
										convertDivContent += "</table>";
										document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
										setTimeout("closeCommonPopup(1)",1000);
									},
									error: function() 
									{
										var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
										convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Contact not sent.Please try again later.<br/><br/></td></tr>"; 
										convertDivContent += "</table></center><br/>";
										document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
										setTimeout("closeCommonPopup()",1000);	
		
		                            }
					  })						  
						 

}



function cont2contRelated(pk,contName)
{     
   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Link Contact'+contName,
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		});  

		
	 $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/getContRelatesAs.xml",
			dataType: "xml",
			success: function (doc)
			{
				var joinall = doc.getElementsByTagName("joinall");	
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;			
				var temp = new Array();				
				temp = allInfo.split('~)');						
				var contRelatedList=document.createElement('select');
				
				contRelatedList.setAttribute("id","relatedasList");
				contRelatedList.setAttribute("width","100");
 				contRelatedList.className="inputFieldClass";
				document.getElementById('selectboxtd').appendChild(contRelatedList);					
				for(i=0; i<temp.length; i++)
						{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];						
						 var relatedTempList=relatedTemp[0];						
						 if(relatedTempList)
						 {
						   contRelatedList[i]=new Option(relatedTempList,relatedId);
                           contRelatedList[i].selected = true
						 }
						 else                              
						     contRelatedList[i]=new Option(relatedTempList,relatedId);
						     
						 }
//				 contRelatedList[0]=new Option("<None>","");  
				 contRelatedList[0].selected = true;			
			
				}
			});				
    
   var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
	convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Contact'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Contact to link</td><td class='flexigrid'><div id='autosuggestcontactList' name='autosuggestcontactList' style='position:fixed;z-index:10;left:525px;' class='autosuggest' ><ul></ul></div><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callmartsugg('autosuggestcontactList',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td>Related as</td><td id='selectboxtd' colspan='1'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "</table>";
	convertDivContent += "<div align='center' style='margin-left:20px;margin-top:10px;'><input type='button' value='Link Contact' align='center' style='width:100px' class='greenButton' onclick='javascript:linkcontacttoselectedcont("+pk+");'></div>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}  

function callmartsugg(divName,txtId,key,val,pk)
{   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Contact",
			dataType: "xml",
			success: function (doc)
			{				
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
				
				}
			});
}

function linkcontacttoselectedcont(pk)
{
	if (document.getElementById('smartsuggest').value)
	{
		var secondContact=document.getElementById('smartsuggest').value;
		var relatedAs=document.getElementById('relatedasList').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_cont_to_cont/editAction?0-1-3="+pk+"&0-1-9="+secondContact+"&0-1-15="+relatedAs;
	    	$.ajax({
			type:"GET",			
			url:jsonUrl,			
			success: function (doc)
				{				
					 var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contact linked successfully</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
						},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking contact failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
		});
	}
	else
	{
		document.getElementById("errorDiv").style.display="block";
		return;
	}
	    
}
var templtEmailDoc="";
var TmpltIdAndName="";
function assignTicket2user(pk,rowName,rowId)
{  
	
		document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Assign Ticket',
			minHeight:155,
		    minWidth:400,	
		    width:300,
			closeOnEscape:true			
		}); 

			if(rowName)
			var enttName = rowName.split('-')[0];
			
			if(enttName)
				var entityName=enttName;
			else
			   var entityName='ticket';
			
			var JSONURL=zcServletPrefix+"/custom/JSON/system/getEmailTemplatesForTkt.htm?entt="+entityName;
			 $.ajax({
			type: "GET",
			async: false,
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			 {  
				templtEmailDoc=doc.getAllTemplates.Templates;
			 }
			 });
			
			var JSONURL=zcServletPrefix+"/custom/JSON/system/VerifyTicketStatus.htm?tktId="+pk;
            $.ajax({
		    type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			 {  
				var statusInfo = data["Ticket"];
				var status= statusInfo["ticketStatus"];
				var statusId= statusInfo["ticketStatusId"];
				
				  if(status=='Closed')
					{  
						var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td></td><td></td></tr>"; 
						convertDivContent += "<tr><td><br/><b>Cannot assign. Ticket is already closed .</b><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
					}
				    else			
				    {
						var convertDivContent = "<table border='0' style='margin-top:3px' cellpadding='3' width='100%'>";
						 convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:11px;border:0px;background-color:transparent;'> <font align='center' size='2px'; style='font-family:Verdana,Arial,sans-serif'>Please select user to assign ticket.</font></div></td></tr>";
						convertDivContent += "<tr><td>Assign Ticket to<br><input type='text' id='userNametxt' name='userNametxt' class='cls_txt_string' style='font-size: 12px; width: 98%; color: gray;border: 1px solid #AAAAAA;border-radius:5px 5px 5px 5px;' onfocus='clickTextBox(this,\"Key in first 2 characters of user name.\")' onblur='blurTextBox(this,\"Key in first 2 characters of user name.\")' value='Key in first 2 characters of user name.' onkeypress='getUsers(\"autosuggestUsers\",this.id,event,this.value);'><input type='hidden' id='userName' name='userName'><div id='autosuggestUsers' name='autosuggestUsers' class='autosuggest' style='z-index:999999'></div></td></tr>"; 
						convertDivContent += "<tr><td><textarea type='text' id='notesArea' name='notesArea' class='cls_txt_string' style='font-size: 12px; width: 98%; color: gray;border: 1px solid #AAAAAA;border-radius:5px 5px 5px 5px;' onfocus='clickTexarea(this,\"Add note.\")' onblur='blurTextarea(this,\"Add note.\")' value='Add note.' maxlenght='100'>Add note.</textarea></td></tr>"; 
						convertDivContent += "<tr><td><input type='checkbox' name='smsCheckBox' id='smsCheckBox' class='input'> Send SMS</td></tr>";
						var dropDwn = "<tr><td id='templateList'>Select email template<select name='toSendEmail' id='toSendEmail' class='Selectbox' style='border: 1px solid #AAAAAA;border-radius:5px 5px 5px 5px;'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>";
						TmpltIdAndName = templtEmailDoc.split('~)');
						if(TmpltIdAndName&&TmpltIdAndName!="")
						{
							for(var i=0; i<TmpltIdAndName.length;i++)
							{
								var id=TmpltIdAndName[i].split("--")[0];
								var val=TmpltIdAndName[i].split("--")[1];
								dropDwn+= "<option value='"+id+"'>"+val+"</option>";
							}
						}
						dropDwn+= "</select>";
						convertDivContent+=dropDwn;
						convertDivContent += "</td></tr>";
						convertDivContent += "</table>";
						convertDivContent += "<div align='center' style='margin-left:20px;margin-top:10px;'><input type='button'  value='Assign ticket' onclick='javascript:assignTicket2UsrOnAssign("+pk+",\""+statusId+"\",\"toSendEmail\")' align='center' style='width:100px' class='bigButton'></div>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					} 
			  }
	   });
}

function getEmailTemplatesForQuotes(pk,rowName,rowId,entity)
{
	if(rowName)
			var enttName = rowName.split('-')[0];
	if(enttName)
		var entityName=enttName;
	else if(entity)
		var entityName=entity;
	else
		var entityName="quote_header";

	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Email Quote',
			minHeight:155,
		    minWidth:400,	
		    width:300,
			closeOnEscape:true			
		}); 

		var JSONURL1 = zcServletPrefix+"/custom/JSON/system/getQuoteContact.htm?qId="+pk;
		$.ajax({
		type: "GET",
		async: false,
		url: JSONURL1,
		dataType: "json",
		success: function (data)
		 {  
			var contactId = data.ContInfo.contId;
			var contName = data.ContInfo.Name;
			var contEmail = data.ContInfo.primEmail;
			if(contEmail!="")
			{
				var convertDivContent = "<table border='0' style='margin-top:3px' cellpadding='3' width='100%'>";
				convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:11px;border:0px;background-color:transparent;'> <font align='center' size='2px'; style='font-family:Verdana,Arial,sans-serif'>Please select any email template.</font></div></td></tr>";
				convertDivContent += "<tr><td>Email will be sent to : "+contName+"'s email id "+contEmail+".</td></tr>";
				convertDivContent += "<tr><td align='center'>Choose Email Template</td></tr>";
				var dropDwn = "<tr><td id='templateQutList' align='center'><select name='toSendQutEmail' id='toSendQutEmail' class='Selectbox' style='border: 1px solid #AAAAAA;border-radius:5px 5px 5px 5px;'><option value=''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;</option>";
				var JSONURL=zcServletPrefix+"/custom/JSON/system/getEmailTemplatesForQuote.htm?entt="+entityName;
				 $.ajax({
				type: "GET",
				async: false,
				url: JSONURL,
				dataType: "json",
				success: function (doc)
				 {  
					var emailTmpltsFrQuote=doc.getAllTemplates.Templates;
					TmpltIdAndName = emailTmpltsFrQuote.split('~)');
					if(TmpltIdAndName&&TmpltIdAndName!="")
					{
						for(var i=0; i<TmpltIdAndName.length;i++)
						{
							var id=TmpltIdAndName[i].split("--")[0];
							var val=TmpltIdAndName[i].split("--")[1];
							dropDwn+= "<option value='"+id+"'>"+val+"</option>";
						}
					}
				 }
				 });
				dropDwn+= "</select>";
				convertDivContent+=dropDwn;
				convertDivContent += "</td></tr>";
				convertDivContent += "</table>";
				convertDivContent += "<div align='center' style='margin-left:20px;margin-top:10px;'><input type='button' id='QutEmlButn' value='Send Email' onclick='javascript:SendQuoteEmail("+pk+","+contactId+",\"toSendQutEmail\")' align='center' style='width:100px' class='bigButton'></div>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			 }
			 else
			 {
				var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
				convertDivContent += "<tr><td class='flexigrid' align='center'><br/><br/><b>No Primary email address of "+contName+".</b><br/><br/></td></tr>"; 
				convertDivContent += "</table>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				setTimeout("closeCommonPopup(1)",3000);
			 }
		 }
		});
}

function SendQuoteEmail(pk,contId,emailTmpltId)
{
	var etmpltId = document.getElementById(emailTmpltId).value;
	if(etmpltId==""||etmpltId=="undefined")etmpltId=null;

	if(etmpltId==null||etmpltId=="")
	{	
		document.getElementById("errorDiv").style.display="block";
		return;
	}

	if(etmpltId!=""&&etmpltId!="undefined")
	{
		document.getElementById("commonPopupDiv").innerHTML="<div class='HeadingVariable' style='text-align:center;padding-top:20px'>Sending Email..<img src='/atCRM/images/JSON/loading.gif'></div>";
		var JSONURL=zcServletPrefix+"/custom/JSON/system/sendQuoteEmail/editAction?qtId="+pk+"&cId="+contId+"&tmpltId="+etmpltId;

		$.ajax({
		type: "POST",
		url: JSONURL,
		success: function (doc)
		{ 
			document.getElementById("commonPopupDiv").innerHTML = "<div class='HeadingVariable' style='text-align:center;padding-top:20px'>Email sent successfully.</div>";
			setTimeout("closeCommonPopup(1)",1000);
		}
		});
	}
}


function clickTextBox(elem)
{
	if(elem.value == "Key in first 2 characters of user name.")
	{
		elem.style.color='black';
		elem.value = "";
	}
}

function blurTextBox(elem)
{
	if($.trim(elem.value) == "")
	{
		elem.style.color='gray';
		elem.value = "Key in first 2 characters of user name.";
	}
}

function clickTexarea(elem)
{
	if(elem.value == "Add note.")
	{
		elem.style.color='black';
		elem.value = "";
	}
}

function blurTextarea(elem)
{
	if($.trim(elem.value) == "")
	{
		elem.style.color='gray';
		elem.value = "Add note.";
	}
}
function getUsers(divName,txtId,L_event,val)
{
   key =  (window.event) ? window.event.keyCode : ((L_event) ? L_event.which : null);
   if(key==13)
	{
		return false;
	}
	else
	{
		if(val.length>=1)
		{
			L_SearchStr = val + String.fromCharCode(key);
			$.ajax({
						type: "GET",
						url: "/atCRM/custom/JSON/smartSuggest/users.htm?str="+L_SearchStr,
						dataType: "json",
						success: function (docCont)
						{
							data = eval(docCont)
							L_usersArray =  data["PickListItems"];
							L_usersArray= L_usersArray.split("~)");
							new AutoSuggest(divName,document.getElementById(txtId),L_usersArray,'','no',100,122,4);
						}
				 });
			}
	   }
 }

function assignTicket2UsrOnAssign(pk,status,templtSelBoxId)
{	
	if(document.getElementById("userNametxt")&&document.getElementById("userNametxt").value==""||document.getElementById("userNametxt").value=="Key in first 2 characters of user name.")
	{document.getElementById("errorDiv").style.display="block";return;}
	
	sbeusr=document.getElementById("userName").value;

	var tmpltId = document.getElementById(templtSelBoxId).value;
	if(tmpltId==""||tmpltId=="undefined")tmpltId=null;
	if(document.getElementById("notesArea").value!='' && document.getElementById("notesArea").value!='Add note.')
		var noteVal=document.getElementById("notesArea").value;
	else
		var noteVal='';

	var sendEmailFlag=false;
	var sendSMSFlag=false;

	if(document.getElementById('smsCheckBox').checked==true)sendSMSFlag=true;else sendSMSFlag=false;
	if(tmpltId!=null&&tmpltId!="undefined")sendEmailFlag=true;else sendEmailFlag=false;

	if((document.getElementById('smsCheckBox').checked==true)||(tmpltId!=""&&tmpltId!="undefined"))
	{
        var JSONURL=zcServletPrefix+"/custom/JSON/system/assignTicket/editAction?0-201-224="+pk+"&0-201-223="+noteVal+"&0-201-203="+sbeusr+"&0-201-217="+status+"&0-1="+sendSMSFlag+"&sendEmail="+sendEmailFlag+"&sUId="+sbeusr+"&tmpltId="+tmpltId;
	}
	
	 $.ajax({
		type: "POST",
			url: JSONURL,			
			success: function (doc)
			   { 
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Ticket assigned successfully</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				}
		  });
}

//Code added by Parimala for PageTop-menu items..
//Code for Change-Stage
var pk1;
var reason='';
function changeOpportunityStage(pk)
				{
                document.getElementById("stageChangeDiv").style.display="block";
				var IE = document.all?true:false
    if (IE) //if browser is IE 5.5 onwards...
	{ 
		var assignDivContent ="<!--[if lte IE 6]><table><tr><td><a><![endif]--><ul id='mdiv' cellspacing='0' onmouseleave='hideMenu()' onmouseenter='showMenu()'><li class='fly' id='stageValue' style='height:14px;'><a style='cursor:pointer' href='javascript:listStages("+pk+");' >Stage...</a></li><li class='fly' id='statWon'><a style='cursor:pointer' href='javascript:updateStatusWON("+pk+");' Onmouseenter='hide()'>Won</a></li><li class='fly' id='statFuture'><a style='cursor:pointer' href='javascript:updateStatusFuture("+pk+");' Onmouseenter='hide()'>Future</a></li><li class='fly' id='lostReasons' ><a style='cursor:pointer' href='javascript:popLostReasons("+pk+");'>Lost...</a></li><li class='fly' id='popHist'><a style='cursor:pointer' href='javascript:popHistory("+pk+");' Onmouseenter='hide()'>History</a></li></ul><!--[if lte IE 6]></td></tr></table></a><![endif]-->";	
    } 
	else 
	{  // if browser is non-IE
		var assignDivContent ="<!--[if lte IE 6]><table><tr><td><a><![endif]--><ul id='mdiv' cellspacing='0' onmouseout='hideMenu()' onmouseover='showMenu()'><li class='fly' id='stageValue' style='height:14px;'><a style='cursor:pointer' href='javascript:listStages("+pk+");' >Stage...</a></li><li class='fly' id='statWon'><a style='cursor:pointer' href='javascript:updateStatusWON("+pk+");' Onmouseover='hide()'>Won</a></li><li class='fly' id='statFuture'><a style='cursor:pointer' href='javascript:updateStatusFuture("+pk+");' Onmouseover='hide()'>Future</a></li><li class='fly' id='lostReasons' ><a style='cursor:pointer' href='javascript:popLostReasons("+pk+");'>Lost...</a></li><li class='fly' id='popHist'><a style='cursor:pointer' href='javascript:popHistory("+pk+");' Onmouseover='hide()'>History</a></li></ul><!--[if lte IE 6]></td></tr></table></a><![endif]-->";
	}  
				document.getElementById("stageChangeDiv").innerHTML = assignDivContent;
				document.getElementById("stageChangeDiv").style.zIndex="2000";
				document.getElementById("stageChangeDiv").style.position="absolute";
				document.getElementById("stageChangeDiv").style.marginTop="-2px";
			    }

function hideMenu(){
   document.getElementById('mdiv').style.display="none";
}

function showMenu(){
	if(document.getElementById('mdiv').style.display=="none")
	   document.getElementById('mdiv').style.display="block";
}

function listStages(pk){
	   $.ajax({
	   type: "GET",
	   url:zcServletPrefix+"/custom/JSON/system/listStages.xml",
	   data: "opptyId="+pk,
	   timeout: "30000",
	   dataType: "xml",
	   success: function displayStages(doc)             
		     {
		var temp=doc.getElementsByTagName("stage");
		var temp1=temp[0]?temp[0].getAttribute("stageName") : null;
		var splitStages = new Array();		
		splitStages = temp1.split('~)');
		var content='<input type="hidden" id="pk" name="pk"><input type="hidden" id="val" name="val"><a href="javascript:listStages('+pk+');" style="color:black;text-decoration:none">Stage...<!--[if IE 7]><!--></a><!--<![endif]--><!--[if lte IE 6]><table><tr><td><![endif]--><div id="ftop" style="position:absolute;"><ul>';
		if(temp1==""){
			content+='<li class="flytop"><a style="cursor:pointer" href="javascript:void(0);">No stages</a></li>';
		}else{
			for(i=0;i<splitStages.length;i++)
		    {
			content+='<li class="flytop"><a style="cursor:pointer" href="javascript:changeStage('+pk+','+splitStages[i].split(":")[0]+',\''+splitStages[i].split(":")[1]+'\')">'+splitStages[i].split(":")[1]+'</a></li>';
		    }
		}
		content+='</ul></div><!--[if lte IE 6]></td></tr></table></a><![endif]-->';
		document.getElementById('stageValue').innerHTML="";
		document.getElementById('stageValue').innerHTML=content; 
				}
       		});
		 } 
   
	var val;   
	function changeStage(pk,stageId,value){
	val=value;
	 document.getElementById('stageValue').innerHTML='<a href="javascript:listStages('+pk+');">Stage...</a>';
	   $.ajax({
	   type: "GET",
	   url:zcServletPrefix+"/custom/JSON/system/updateStage.xml",
	   data: "stageId="+stageId+"&opptyId="+pk,
	   timeout: "30000",
	   dataType: "xml",
	   success: displayStageMessage
	   });
	   }
       
	function displayStageMessage(newVal){
    var newStage=newVal.getElementsByTagName("stgid");
	var temp1=newStage[0]?newStage[0].getAttribute("stageId") : null;
	var stage=newVal.getElementsByTagName("stage");
	var stageName=stage[0]?stage[0].getAttribute("stageName") : null;
	var id=newVal.getElementsByTagName("id");
	var statusId=id[0]?id[0].getAttribute("statusId") : null;
	var status=newVal.getElementsByTagName("status");
	var statusName=status[0]?status[0].getAttribute("statusName") : null;
	var modified=newVal.getElementsByTagName("modified");
	var modifiedBy=modified[0]?modified[0].getAttribute("modifiedBy") : null;
	var date=newVal.getElementsByTagName("date");
	var modifiedDate=date[0]?date[0].getAttribute("modifiedDate") : null;
	var reason=newVal.getElementsByTagName("reason");
	var lostReason=reason[0]?reason[0].getAttribute("lostReason") : null;

   	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Change stage '+val,
			minHeight:120,
		    minWidth:120,	
		    width:280,
			closeOnEscape:true
		});
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center>Stage changed Successfully as <b>"+val+"</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'></div></td></tr></table>";		
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
                setTimeout("closeCommonPopup(1)",1000);
}


function hide(){
	if(document.getElementById('ftop'))
	{
	   document.getElementById('ftop').style.display="none";
	}
	if(document.getElementById('ftop2'))
	{
	   document.getElementById('ftop2').style.display="none";
	}
}
var status;
function updateStatusWON(pk){
	           status="Won";
		       $.ajax({
		   type: "GET",
		   url:zcServletPrefix+"/custom/JSON/system/updateWon.xml",
		   data: "opptyId="+pk,
		   timeout: "30000",
		   dataType: "xml",
		  success: displaySuccess()
		        });
  		}

function updateStatusFuture(pk){
	    try{
		 updateStat.innerHTML="Future";
		 updateRsn.innerHTML=null;}
		 catch(e){}
	   status="Future";
       $.ajax({
       type: "GET",
       url:zcServletPrefix+"/custom/JSON/system/updateFuture.xml",
       data:"opptyId="+pk,
       timeout: "30000",
       dataType: "xml",
	   success: displaySuccess()
         });
      }

function popLostReasons(pk){
	   pk1=pk;
       $.ajax({
       type: "GET",
       url:zcServletPrefix+"/custom/JSON/system/listLostReas.xml",
       data: "opptyId="+pk,
       timeout: "30000",
       dataType: "xml",
       success:displayLostReasons
     });
	 }

		function displayLostReasons(reasons)
		{  
		var temp=reasons.getElementsByTagName("reason");
		var temp1=temp[0]?temp[0].getAttribute("reasonName") : null;
		var splitReasons = new Array();
		splitReasons = temp1.split('~)');
		var content='<a href="javascript:popLostReasons('+pk1+');" style="color:black;text-decoration:none">Lost...<!--[if IE 7]><!--></a><!--<![endif]--><!--[if lte IE 6]><table><tr><td><a><![endif]--><div id="ftop2" style="position:absolute;"><ul>';
		for(i=0;i<splitReasons.length;i++)
			{   //alert(splitReasons[i].split(":")[1].length)
				var splitValue = splitReasons[i].split(":");
				if(splitReasons[i].split(":")[1].length > 30)
					content+='<li class="flytop2" title="'+splitValue[1]+'"><a style="text-decoration:none" href="javascript:updateReason('+splitReasons[i].split(":")[0]+',\''+splitReasons[i].split(":")[1]+'\')">'+splitValue[1].substr(0,25)+'...</a></li>';
				else
					content+='<li class="flytop2" title="'+splitValue[1]+'"><a style="text-decoration:none" href="javascript:updateReason('+splitReasons[i].split(":")[0]+',\''+splitReasons[i].split(":")[1]+'\')">'+splitValue[1]+'</a></li>';
		}
		content+='</ul></div><!--[if lte IE 6]></td></tr></table></a><![endif]-->';
		document.getElementById('lostReasons').innerHTML="";
		document.getElementById('lostReasons').innerHTML=content;
		document.getElementById("ftop2").style.display="block";
		}


		function updateReason(reasonId,reasonValue){
         try{
		 updateStat.innerHTML="Lost";
		 updateRsn.innerHTML=null;}
		 catch(e){}
		document.getElementById('lostReasons').innerHTML='<a href="javascript:popLostReasons('+pk1+');" style="color:black;text-decoration:none">Lost...</a>';
		status="Lost";
		$.ajax({
		   type: "GET",
		   url: zcServletPrefix+"/custom/JSON/system/updateLostReas.xml",
		   data:"reasonId="+reasonId+"&opptyId="+pk1,
		   timeout: "30000",
		   dataType: "xml",
		   success: displaySuccess
		   });
	   }

       function displaySuccess()
	   {
		document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Status Changed as '+val,
			minHeight:120,
		    minWidth:120,	
		    width:280,
			closeOnEscape:true
		});
			
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center>Status changed Successfully as <b>"+status+"</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'></div></td></tr></table>";		
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
                setTimeout("closeCommonPopup(1)",1000);
				try
				{
				if(status=="Won"||status=="Future")  document.getElementById('lostReasons').innerHTML=reason;	
				}
				catch (e){}
	   }

function popHistory(pk)
{   document.getElementById("commonPopupDiv").innerHTML = "";
	var JSONURL=zcServletPrefix+"/custom/JSON/system/historyOfOpptyStages.htm?opptyId="+pk;
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
        title:'History of Opportunity Change-stages',
		minHeight:160,
		minWidth:300,	
		width:480,
		closeOnEscape:true
	});
			$.ajax({
			type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			{			
				var allHistoryOpportunities = doc["allHistoryOpportunities"];
				var allHistoryOppLength = allHistoryOpportunities.length;	
				if(allHistoryOppLength>0)
				{
                		var convertDivContent = "<!--<![endif]--><!--[if lte IE 6]><table><tr><td><a><![endif]--><table  width='460' cellspacing='1'  cellpadding='2' border='0' class='TblBdy'  align='center' style='vertical-align:middle;background-color:#dddddd;margin-top:5px; border:0px solid red;' >";
						convertDivContent += "<tr valign='middle' class='TblBdy' cellspacing='3'  border='1'><th border='1' cellspacing='3' width='20'>#</th><th border='1' cellspacing='3' width='100'>Changed by user</th><th border='1' cellspacing='3' width='150'>Changed date</th><th border='1' cellspacing='3' width='90'>Previous Stages</th></tr>"; 
						for(k=0,l=0;k<allHistoryOppLength;k++,l++)
						{					
							serialNo = allHistoryOpportunities[l]["#"];					
							changeByUser = allHistoryOpportunities[l]["Change by user"];				
							changeTime =  allHistoryOpportunities[l]["Change time"];
							pastValue=  allHistoryOpportunities[l]["Past Stage"];
							if (serialNo!=""){ convertDivContent += "<tr  valign='middle' border='1' cellspacing='3'  cellpadding='3'><td valign='middle' border='1' class='TblBdy' width='20' style='border:0px solid red' align='right'>"+ serialNo +"</td><td valign='middle' border='1' class='TblBdy' width='100' style='border:0px solid red;' align='left'>" +changeByUser + "</td><td valign='middle' border='1' class='TblBdy' width='150' style='border:0px solid red' align='left'>" + changeTime + "</td><td valign='middle' border='1' class='TblBdy' width='90' style='border:0px solid red' align='left'>" + pastValue + "</td></tr>"; }
						}
						convertDivContent += "</table><!--[if lte IE 6]></td></tr></table></a><![endif]-->";
				}
				else
				{		
			        var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' class='flexigrid'><br/><br/><b>No logs exists for Stage-Change...</b><br/><br/></td></tr>"; 
					convertDivContent += "</table></center>";
					
				 }
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
			}
	    });
    }//End of Change-Stage code.
	
//Link Contact on Opportunity tab
function OpptoContRelated(pk,recName)
{  
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Relate Contact to '+recName,
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 

			
   		    $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/getOpptyContactRelatdTyp.xml",
			dataType: "xml",
			success: function (doc)
			{				
				var joinall = doc.getElementsByTagName("joinall");	
												
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				
				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var opptRelatedList=document.createElement('select');
				opptRelatedList.setAttribute("id","relatedasList");
				opptRelatedList.setAttribute("width","100");
 				opptRelatedList.className="inputFieldClass";
				document.getElementById('selectboxtd').appendChild(opptRelatedList);					
				for(i=0; i<temp.length; i++)
						{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];	
						 if(relatedTempList)
						 {						 							
						   opptRelatedList[i]=new Option(relatedTempList,relatedId);
                           opptRelatedList[i].selected = true
						 }
						 else    
						     opptRelatedList[i]=new Option(relatedTempList,relatedId);
					      }
						     opptRelatedList[0].selected = true;	
				 		  }
			});	
				
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Contact'</font></div></td></tr>";
	convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv1' class='errorDiv1' name='errorDiv1' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'relatedAs'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Contact To Link</td><td class='flexigrid'><div id='autosuggestOppList' name='autosuggestOppList' style='position:fixed;z-index:10;' class='autosuggest' ><ul></ul></div><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsmartsugg('autosuggestOppList',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td>Related As</td><td id='selectboxtd' colspan='1'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Contact'  onclick='javascript:linkOpptoselectedcont("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}  


function callsmartsugg(divName,txtId,key,val,pk)
{   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Contact",
			dataType: "xml",
			success: function (doc)
			{	
				document.getElementById("autosuggestOppList").style.Left="0px";		
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
			}
			});
}

function linkOpptoselectedcont(pk)
{
	    var relatedAs=document.getElementById('relatedasList').value;
		var contId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_opp_to_cont/editAction?0-1-3="+pk+"&0-1-9="+contId+"&0-1-25="+relatedAs;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td></tr>"
		DivContent += "</table></center>";
		if((contId=='')||(contId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
		if(relatedAs=='')
	     {
			document.getElementById("errorDiv1").style.display="block";
		    return;
		 }
		 
		$.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function (doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contact linked successfully</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
						},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Opportunity to contact failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
							
				}
			});
		}

   //On Account tab link contact
	function ContoAcctRelated(pk,AcctName)
	{  
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Relate Contact to '+AcctName,
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 

	
   		    $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/getAcctContactRelatdTyp.xml",
			dataType: "xml",
			success: function (doc)
			{	
				
				var joinall = doc.getElementsByTagName("joinall");	
				
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				
				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var AcctRelatedList=document.createElement('select');
				AcctRelatedList.setAttribute("id","relatedasList");
				AcctRelatedList.setAttribute("width","100");
 				AcctRelatedList.className="inputFieldClass";
				document.getElementById('selectboxtd').appendChild(AcctRelatedList);					
				for(i=0; i<temp.length; i++)
						{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];  
						 if(relatedTempList)
						 {		
						   AcctRelatedList[i]=new Option(relatedTempList,relatedId);
                           AcctRelatedList[i].selected = true;
						 }
						 else    
						     AcctRelatedList[i]=new Option(relatedTempList,relatedId);
					      }
						     AcctRelatedList[0].selected = true;	
				 		  }
			});	
				
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Contact'</font></div></td></tr>";
	convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv1' class='errorDiv1' name='errorDiv1' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'relatedAs'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Contact To Link</td><td class='flexigrid'><div id='autosuggestContList' name='autosuggestContList' style='position:fixed;z-index:10;' class='autosuggest' ><ul></ul></div><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsmrtsugg('autosuggestContList',this.id,event.keyCode,this.value)\" value='2 chars or *' onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td>Related As</td><td id='selectboxtd' colspan='1'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Contact'  onclick='javascript:linkAcctoselectedcont("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}  


function callsmrtsugg(divName,txtId,key,val,pk)
{   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Contact",
			dataType: "xml",
			success: function (doc)
			{	
				document.getElementById("autosuggestContList").style.Left="0px";		
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
			}
			});
}



function linkAcctoselectedcont(pk)
{
	    var relatedAs=document.getElementById('relatedasList').value;
		var contId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_acct_to_cont/editAction?0-1-3="+pk+"&0-1-9="+contId+"&0-1-15="+relatedAs;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td><tr>"
		DivContent += "</table></center>";
		if((contId=='')||(contId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
        if(relatedAs=='')
	     {
			document.getElementById("errorDiv1").style.display="block";
		    return;
		 }
 
		$.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function(doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contact linked successfully..</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
						},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Account to contact failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});
		}//End of link contact


   //Link account on Contact tab
    function AcctoContRelated(pk,ContName)
	{  
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Relate Account to '+ContName,
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 

   		    $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/getAcctContactRelatdTyp.xml",
			dataType: "xml",
			success: function (doc)
			{	
				
				var joinall = doc.getElementsByTagName("joinall");	
				
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				
				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var AcctRelatedList=document.createElement('select');
				AcctRelatedList.setAttribute("id","relatedasList");
				AcctRelatedList.setAttribute("width","100");
 				AcctRelatedList.className="inputFieldClass";
				document.getElementById('selectboxtd').appendChild(AcctRelatedList);					
				for(i=0; i<temp.length; i++)
						{	
					     var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];  							
						 if(relatedTempList)
						 {		
							
						   AcctRelatedList[i]=new Option(relatedTempList,relatedId);
                           AcctRelatedList[i].selected = true;
						 }
						 else    
						     AcctRelatedList[i]=new Option(relatedTempList,relatedId);
					      }
						     AcctRelatedList[0].selected = true;	
				 		  }
			});	
				
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Account'</font></div></td></tr>";
	convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv1' class='errorDiv1' name='errorDiv1' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'relatedAs'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Account To Link</td><td class='flexigrid'><div id='autosuggestAcctList' name='autosuggestAcctList' style='position:fixed;z-index:10;' class='autosuggest' ><ul></ul></div><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsrtsugg('autosuggestAcctList',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td>Related As</td><td id='selectboxtd' colspan='1'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Account'  onclick='javascript:linkContoselectedacct("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}  

/*function callsrtsugg(divName,txtId,key,val,pk)
{   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Account",
			dataType: "xml",
			success: function (doc)
			{	
				document.getElementById("autosuggestAcctList").style.Left="0px";		
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
			}
			});
} */

function linkContoselectedacct(pk)
{
	    var relatedAs=document.getElementById('relatedasList').value;
		var acctId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_acct_to_cont/editAction?0-1-9="+pk+"&0-1-3="+acctId+"&0-1-15="+relatedAs;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td><tr>"
		DivContent += "</table></center>";
		if((acctId=='')||(acctId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
		 if(relatedAs=='')
	     {
			document.getElementById("errorDiv1").style.display="block";
		    return;
		 }
 		 
		$.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function(doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Account linked successfully..</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
						},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Contact to Account failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});
}//End of link account


function OpptoAcctRelated(pk,OppName)
{  
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Relate Account to '+OppName,
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 

	 $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/getOpptoAcctRelatdTyp.xml",
			dataType: "xml",
			success: function (doc)
			{	
				
				var joinall = doc.getElementsByTagName("joinall");	
				
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				

				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var AcctRelatedList=document.createElement('select');
				AcctRelatedList.setAttribute("id","relatedasList");
				AcctRelatedList.setAttribute("width","100");
 				AcctRelatedList.className="inputFieldClass";
				document.getElementById('selectboxtd').appendChild(AcctRelatedList);					
				for(i=0; i<temp.length; i++)
						{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];  							
						 if(relatedTempList)
						 {		
							
						   AcctRelatedList[i]=new Option(relatedTempList,relatedId);
                           AcctRelatedList[i].selected = true;
						 }
						 else    
						     AcctRelatedList[i]=new Option(relatedTempList,relatedId);
					      }
						     AcctRelatedList[0].selected = true;	
				 		  }
			});	
				
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Account'</font></div></td></tr>";
	convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv1' class='errorDiv1' name='errorDiv1' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'relatedAs'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Account To Link</td><td class='flexigrid'><div id='autosuggestAcctList' name='autosuggestAcctList' style='position:fixed;z-index:10;border:1px solid red;' class='autosuggest' ><ul></ul></div><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsrtsugg('autosuggestAcctList',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td>Related As</td><td id='selectboxtd' colspan='1'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Account'  onclick='javascript:linkOpptoselectedacct("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
}  

function callsrtsugg(divName,txtId,key,val,pk)
    {   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Account",
			dataType: "xml",
			success: function (doc)
			{	
				document.getElementById(divName).style.Left="0px";		
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
			}
			});
    }


function linkOpptoselectedacct(pk)
{
	    var relatedAs=document.getElementById('relatedasList').value;
		var acctId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_opp_to_acct/editAction?0-1-9="+pk+"&0-1-3="+acctId+"&0-1-17="+relatedAs;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td><tr>"
		DivContent += "</table></center>";
		if((acctId=='')||(acctId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
		 if(relatedAs=='')
	     {
			document.getElementById("errorDiv1").style.display="block";
		    return;
		 }
 
		$.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function (doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Account linked successfully</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Opportunity to Account failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				  }
			});
		}
		
   //Link Account on Marketing Program
    function Acct2MktgPrg(pk,AcctName)
	{ 
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Link Account to Marketing',
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Account'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Account To Link</td><td class='flexigrid'><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsrtsugg('smartSuggestDiv',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Account'  onclick='javascript:linkAcc2MktgPrg("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}
		
function linkAcc2MktgPrg(pk)
{
	    var acctId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_acct_to_Mktg/editAction?0-1-9="+pk+"&0-1-3="+acctId;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td><tr>"
		DivContent += "</table></center>";
		if((acctId=='')||(acctId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
       $.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function (doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Account linked successfully</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Account to Marketing Program failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				  }
			});
}//End of Link account	

//Link Contact to Marketing Program
function Cont2MktgPrg(pk,ContName)
{  
	document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Link Contact to Marketing',
			minHeight:155,
		    minWidth:330,	
		    width:300,
			closeOnEscape:true			
		}); 
    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
    convertDivContent +="<tr><td colspan='2'><div align='center' id='errorDiv' class='errorDiv' name='errorDiv' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;'> <font align='center' >Non-empty value needed for 'Contact'</font></div></td></tr>";
	convertDivContent += "<tr><td nowrap>Select Contact To Link</td><td class='flexigrid'><input type'text' id='smartsuggesttxt' name='smartsuggesttxt' size='110px' class='inputFieldClass' onkeypress=\"callsugg('smartSuggestDiv',this.id,event.keyCode,this.value)\" value='2 chars or *' onblur=\"javascript:checknReplaceVal(this.value,this.id);\" onfocus='javascript:clearMessage(this.id);'><input type='hidden' id='smartsuggest' name='smartsuggest'></td><td class='flexigrid'></td></tr>"; 
	convertDivContent += "<tr><td></td><td></td></tr>"; 	 
	convertDivContent += "<tr><td colspan='4'><input type='button' class='greenButton' value='Link Contact'  onclick='javascript:linkCont2MktgPrg("+pk+");'  style='width:100px;margin-left:90px'></td></tr>"; 	 
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}
 		
   function callsugg(divName,txtId,key,val,pk)
   {   
	$.ajax({
			type: "GET",			
			url:zcServletPrefix+"/custom/JSON/smartSuggest/genericPicklist.xml?str="+val+"&pckListName=Contact",
			dataType: "xml",
			success: function (doc)
			{	
				document.getElementById(divName).style.Left="0px";		
				var getentityName = doc.getElementsByTagName("details");				
				var entityName=getentityName[0]?getentityName[0].getAttribute("dets") : null;				
				var temp = new Array();
				temp = entityName.split('~)');			
				new AutoSuggest(divName,document.getElementById(txtId),temp);
			}
			});
}

function linkCont2MktgPrg(pk)
{
	    var contId=document.getElementById('smartsuggest').value;
		var jsonUrl=zcServletPrefix+"/custom/JSON/system/link_cont_to_Mktg/editAction?0-1-9="+pk+"&0-1-3="+contId;
    	var DivContent = "<center><table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		DivContent+="<tr><td colspan='2' ></td><tr>"
		DivContent += "</table></center>";
		if((contId=='')||(contId=='2 chars or *'))
	    {
		 document.getElementById("errorDiv").style.display="block";
		 return;
	    }
       $.ajax({
			type:"GET",			
			url:jsonUrl,			
				success: function (doc)
				{			
					    var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Contact linked successfully</b><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);	
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Linking Contact to Marketing Program failed.</b></td></tr></table></center><br/>"; 
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				  }
			});
}//End of Link Contact	
//End of code by Parimala


function deleteAttachment(entity,pkVal,enttPKVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Delete Attachment',
		minHeight:150,
		minWidth:350,	
		width:350,
		closeOnEscape:true,
		beforeclose: function() {}

	});

	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Are you sure you want to Delete the attachment?<br><br><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;deleteAttach("+pkVal+",\""+entity+"\","+enttPKVal+")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
}	

function deleteAttach(pkVal,entity,enttPKVal){

	var JSONURL=zcServletPrefix+"/custom/JSON/system/deleteAttachment.htm?id="+pkVal+"&entity="+entity+"&enttPKVal="+enttPKVal;
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function (data)
	{  
		setTimeout("closeCommonPopup(1)",2000);
		
    }

	});
}

function addAttachment(entity,pkVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Add Attachment',
		minHeight:260,
		minWidth:420,	
		width:420,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='attachmentFrame' frameborder='0' src='"+zcServletPrefix+"/custom/Documents/"+entity+".html?id="+pkVal+"' width='400px' style='border:0px solid red' height='250px'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}	

/*
function addAttachment(entity,pkVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Add Attachment',
		minHeight:260,
		minWidth:420,	
		width:420,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='attachmentFrame' frameborder='0' src='"+zcServletPrefix+"/custom/Documents/allAttachments.html?entityId="+pkVal+"&entity="+entity+"' width='400px' style='border:0px solid red' height='250px'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}*/

//This function will open Hint Question pop up upon first time login
//9/28/2010 Vadiraj


 

function hideFullContent()
{
	document.getElementById("commonHoverDiv").style.display = "none";
	try{
	if(document.getElementsByClassName("rowSelectedClass")[0])
	document.getElementsByClassName("rowSelectedClass")[0].className="rowClass";
	}
	catch(e){}
}

//Vadiraj Below mentioend two functions (written specifically for Medassist) will update the status of the ticket to either Closed ot Resolved, depending on the current status.
function isResolvedOrClosed(pk,org,isSME,status){

	if (org == 283 && (status == "Resolved" || status == "Closed"))
	{
		closeTicket(pk,' Ticket',org);
	}
	else
	{
		resolveTicket(pk);
	}

}

function resolveTicket(pk)
{
	var val = 29417;
	var colmn = 'tkt_status';
	var tblNm = 'ticket';
	var pkVal = pk;
	var pkCol = "ticket_id";

	var url2Hit = zcServletPrefix+"/custom/JSON/system/updateOnClick/editAction";
	var post_val = { "colVal": val, "colName": colmn, "tblName": tblNm, "pkVal": pkVal, "pkCol": pkCol};

		$.ajax(
		{
			type: "POST",
			contentType: "application/x-www-form-urlencoded",
			url: url2Hit,
			data: post_val,
			async: false,
			success: function (doc)
			{
				document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').dialog('open');
				$('#commonPopupDiv').dialog({
					autoOpen:true,
					modal: true,
					title:'Acknowledge ticket',
					minHeight:155,
					minWidth:400,	
					width:400,
					closeOnEscape:true			
				}); 
				var convertDivContent = "<table align='center' style='margin-top:50px' cellpadding='3'>";
				convertDivContent += "<tr style='border:1px solid red'><td width='400px'  class='flexigrid' style='text-align:center'><b>Ticket</b> marked as Resolved successfully</td></tr></table></center><br/>"; 
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				setTimeout("closeCommonPopup(1)",1000);
			}
		});
}


// Vadiraj -- Below function is written for MediAssist. This function will be invoked if the keyed in MAID is not found in Impel DB and will invoke mediassist API, get the related info from, add them to into Impel and display in the UI.
var flag='0';
// Vadiraj -- Below function is written for MediAssist. This function will be invoked if the keyed in MAID is not found in Impel DB and will invoke mediassist API, get the related info from, add them to into Impel and display in the UI.
var flag='0';
function getSmartSuggDiv(){
	
	var divContent = document.getElementById("smartSuggestDiv").innerHTML;
	var searcStr = document.getElementById('0-1-26txt').value;
	if (searcStr.length>10)
	{
		searcStr = searcStr.substring(0,9);
	}
	if (divContent.indexOf("No matches")>-1 && searcStr.length==10)
	{
		document.getElementById("smartSuggestDiv").style.display="none";
		document.getElementById("addEditErrorDiv").style.display="block";
		document.getElementById("addEditErrorDiv").innerHTML = 'Fetching data from your server, please wait...';
		document.getElementById("0-1-116").focus();
		//alert('i am in - '+searcStr);
		//var searcStr = 1151803263;
		//var searcStr = 5009359143;
		var JSONURL="http://mediassistindia.com/CRMServices/Default.aspx?MAID="+searcStr;
		$.ajax({
		type: "GET",
		url: JSONURL,
		dataType: "jsonp",
		crossDomain:true,
		async:false,
		jsonp : "callback",
		jsonpCallback: "parseRequest",  
		success: function (data)
		{  
			var myString = JSON.stringify(data);
			myString = jQuery.parseJSON(myString);
			var resp = myString["Head"];
			if (resp)
			{
				var maid = resp[0]["maid"];
				var	primary_beneficiary = resp[0]["primary_beneficiary"];
				var relation = resp[0]["relation"];
				var	date_of_birth = resp[0]["date_of_birth"];	
				var	sum_insured = resp[0]["sum_insured"];	
				var	beneficiary = resp[0]["beneficiary"];	
				var	employee_code = resp[0]["employee_code"];	
				var	gender = resp[0]["gender"];	
				var	age = resp[0]["age"];
				var	policy_number = resp[0]["policy_number"];
				var	policy_details = resp[0]["policy_details"];	
				var	policy_type = resp[0]["policy_type"];
				var	policy_description = resp[0]["policy_description"];
				var	policy_holder_name = resp[0]["policy_holder_name"];
				var	start_date = resp[0]["start_date"];
				var	end_date = resp[0]["end_date"];		
				var	response_timestamp = resp[0]["response_timestamp"];
				var	insurer = resp[0]["insurer"];
				
				var JSONURL=zcServletPrefix+"/custom/JSON/system/createContactFromAPI.json?maid="+maid+"&primary_beneficiary="+primary_beneficiary+"&relation="+relation+"&date_of_birth="+date_of_birth+"&sum_insured="+sum_insured+"&beneficiary="+beneficiary+"&employee_code="+employee_code+"&gender="+gender+"&age="+age+"&policy_number="+policy_number+"&policy_details="+policy_details+"&policy_type="+policy_type+"&policy_description="+policy_description+"&policy_holder_name="+policy_holder_name+"&start_date="+start_date+"&end_date="+end_date+"&response_timestamp="+response_timestamp+"&insurer="+insurer;
				$.ajax({
				type: "GET",
				url: JSONURL,
				dataType: "json",
				async:false,
				success: function (data)
				{
					sleep(5000);
					document.getElementById("addEditErrorDiv").innerHTML = 'Fetching data from your server, please wait...';
					var url2Hit = zcServletPrefix+"/custom/JSON/system/getPolicyDetFromMAID.json?maid="+maid;
					$.ajax({
						type: "GET",
						url: url2Hit,
						dataType: "json",
						success: function (doc)
						{
						   var policynum= doc["policynum"];
						   var policytype = doc["policytype"];
						   var insurer = doc["insurer"];
						   var corpId = doc["corpId"];
						   var corpstr = doc["corpstr"];
						   var mobile = doc["mobile"];
						   var email = doc["email"];
						   var policyDet = doc["policyDet"];
						   if (document.getElementById("0-1-113")) { document.getElementById("0-1-113").value = policytype; document.getElementById("0-1-113").disabled = "true"; }
						   if (document.getElementById("0-1-114")) { document.getElementById("0-1-114").value = insurer; document.getElementById("0-1-114").disabled = "true"; }
						   if (document.getElementById("0-1-32txt")) { document.getElementById("0-1-32txt").value = corpstr; document.getElementById("0-1-32txt").disabled = "true"; }
						   if (document.getElementById("0-1-32")) { document.getElementById("0-1-32").value = corpId; document.getElementById("0-1-32").disabled = "true"; }
						   if (document.getElementById("0-1-121")) { document.getElementById("0-1-121").value = policynum; document.getElementById("0-1-121").disabled = "true" ; }
						   if (document.getElementById("0-1-116")) document.getElementById("0-1-116").value = mobile;
						   if (document.getElementById("0-1-115")) document.getElementById("0-1-115").value = email;
						   if (document.getElementById("0-1-120")) { document.getElementById("0-1-120").value = policyDet; document.getElementById("0-1-120").disabled="true"; }
						   if (document.getElementById("0-1-123")) { document.getElementById("0-1-123").value = searcStr; document.getElementById("0-1-123").disabled="true"; }
						}
					});
					document.getElementById("smartSuggestDiv").innerHTML = "";
					document.getElementById("smartSuggestDiv").style.display="none";
					document.getElementById("addEditErrorDiv").innerHTML = "";
					document.getElementById("addEditErrorDiv").style.display="none";
				}
				});
			}
			else
			{
				alert('Sorry... No details for the MAID you have keyed in.');
			}
		},
		error: function() 
		{
			alert('Sorry... No details for the MAID you have keyed in.');
		}
		});
	}
}


function sleep(milliSeconds){
var startTime = new Date().getTime(); // get the current time
while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}


// Accepts a url and a callback function to run.  
function requestCrossDomain( site, callback ) {  
      
    // If no url was passed, exit.  
    if ( !site ) {  
        alert('No site was passed.');  
        return false;  
    }  
      
    // Take the provided url, and add it to a YQL query. Make sure you encode it!  
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=json&callback=cbFunc';  
      
    // Request that YSQL string, and run a callback function.  
    // Pass a defined function to prevent cache-busting.  
    $.getJSON( yql, cbFunc );  
      
    function cbFunc(data) {  
    // If we have something to work with...  
    if ( data.results[0] ) {  
        // Strip out all script tags, for security reasons.  
        // BE VERY CAREFUL. This helps, but we should do more.   
        data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');  
          
        // If the user passed a callback, and it  
        // is a function, call it, and send through the data var.  
        if ( typeof callback === 'function') {  
            callback(data);  
        }  
    }  
    // Else, Maybe we requested a site that doesn't exist, and nothing returned.  
    else throw new Error('Nothing returned from getJSON.');  
    }  
}


function parseRequest(response,status,xhr){
	try
	{
		respObj=response.PersonResult;   
		alert(respObj.age);
	}
   catch(an_exception)    {
	alert("Error");   }
}


function closeTicket(pk,recName,org)
{
	 document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Close'+recName,
			minHeight:155,
		    minWidth:400,	
		    width:300,
			closeOnEscape:true			
		});

	var JSONURL=zcServletPrefix+"/custom/JSON/system/VerifyTicketStatus.htm?tktId="+pk;
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function (data)
	   {  
		  var statusInfo = data["Ticket"];
		  var status= statusInfo["ticketStatus"];
		  var statusId= statusInfo["ticketStatusId"];
		  var cont= statusInfo["repByCont"];
		  var org= statusInfo["org"];
		  if(status=='Closed')
			{  
				var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
				convertDivContent += "<tr><td></td><td></td></tr>"; 
				convertDivContent += "<tr><td><br/><b>Ticket is already closed .</b><br/></td></tr>"; 
				convertDivContent += "</table>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				setTimeout("closeCommonPopup()",3000);
			  
			}
			else			
			{
				var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";					
				convertDivContent+="<tr ><td colspan='2'><div align='left' id='errorDivSolution' class='errorDiv' name='errorDivSolution' style='display:none;margin-top:0px;margin-left:10px;width:252px;height:9px;' vertical-align:text-top> <font align='center' >Non-empty value needed for 'Solution'.</font></div><div align='left' style='margin-top:0px;'><left>Please key in the solution you have figured out to close this ticket.</left></div><div align='left' style='margin-top:10px;border:0px solid red'>Solution:<textarea id='solutionId' rows='5' cols='30' class='inputFieldClass'></textarea></div></td></tr>";
				convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:-15px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:closeTicketOnConfirm('"+pk+"','"+recName+"')\"  class='greenButton' type='button' value='OK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+pk+"','"+recName+"')\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>" 		
				convertDivContent+="</table></center>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
     }

	});
}

function closeTicketOnConfirm(pk,recName)
{
	var val=document.getElementById("solutionId").value;
	
	if(val=='')
	    {
			 document.getElementById("errorDivSolution").style.display="block";
			 return;
	    }
	else
		{
		   if(val.length>1000)
			{
			   document.getElementById("errorDivSolution").style.display="block";
			   document.getElementById("errorDivSolution").innerHTML="Solution should be less than 1000 characters.";
			}
			else
			{
				    var JSONURL=zcServletPrefix+"/custom/JSON/system/closeTicket/editAction?0-301="+pk+"&0-401="+val; 	
					$.ajax({
					type: "GET",
					url: JSONURL,
					success: function ()
					{
						var convertDivContent = "<table align='center' style='margin-top:50px' cellpadding='3'>";
						convertDivContent += "<tr style='border:1px solid red'><td width='400px'  class='flexigrid' style='text-align:center'><b>"+recName+"</b> closed successfully</td></tr></table></center><br/>"; 
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",1000);
					},
					error: function() 
					{
						var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td width='400px'  class='flexigrid' style='text-align:center;color:red'><b>Ticket close failed.</b></td></tr></table></center><br/>"; 
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup()",1000);
					}
					});	
			}			  
		}
}	

   
//This function will open Hint Question pop up upon first time login
//9/28/2010 Vadiraj
function uploadCoupon(id)
{	
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Coupon Upload',
		minHeight:260,
		minWidth:420,	
		width:535,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='uploadCoupon' frameborder='0' src='"+zcServletPrefix+"/custom/CSV/couponUpload.html?planId="+id+"' width='530px' style='border:0px solid red' height='395px'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

//This function will open Relator pop upo
//10/19/2010
/*function linkOpportunities(cont_id,actvt_id)
{	
	window.top.document.getElementById('listCaption').style.display="block";		
	window.top.document.getElementById('listCaption').innerHTML='Link Opportunities';		
	window.top.document.getElementById('listPopUp').style.display="block";	
	$('#addEntitytitlediv').dialog('open');
	$('#addEntitytitlediv').dialog({
		autoOpen:true,
		modal: true,
		minWidth:520,	
		width:520,	
		height: 'auto',
		title:'Link Opportunities',
		closeOnEscape:true
	});	

	mainUrl4list=zcServletPrefix+"/custom/mails/linkContAndActvtToOppty.htm?id="+cont_id+"&actvt_id="+actvt_id;
	$.ajax({
	type: "GET",
	url: mainUrl4list,
	success: function (datalist)
		{
		doclst = JSON.parse(datalist, function (key, value) 
			{
				var type;
				if (value && typeof value === 'object') 
					{
						type = value.type;
						if (typeof type === 'string' && typeof window[type] === 'function') 
						{
							return new (window[type])(value);
						}
					}
					return value;
			}); 
		
			handleJsonList(doclst,'listPopUp',500,$('#addEntitytitlediv').dialog.height,mainUrl4list);		
		}
	})
}

function linkOpptyToActvtAndCont(opptyCSV,contId,actvtId)
{
	var JSONURL=zcServletPrefix+"/custom/mails/linkOpptyToActvtAndCont.html?opptyIds="+opptyCSV+"&contId="+contId+"&actvtId="+actvtId;
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "html",
	success: function (data)
	   {  
		  
     }

	});
}*/


//This function will open Relator pop upo
//10/19/2010
function linkOpportunities(cont_id,actvt_id)
{	
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Link Email to Opportunities',
		minHeight:260,
		minWidth:420,	
		width:535,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var convertDivContent = "<table style='border:0px solid red;' cellpadding='3'>";
	convertDivContent+="<iframe id='uploadCoupon' frameborder='0' src='"+zcServletPrefix+"/custom/mails/linkContAndActvtToOppty.html?id="+cont_id+"&actvt_id="+actvt_id+"' width='530px' style='border:0px solid red' height='395px'></iframe>"
	convertDivContent += "</table></center>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

//This function will be for activity add appointment and task  




function PopulateLostReason(pk,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	var JSONURL=zcServletPrefix+"/custom/JSON/system/getOpptyLostReasons.htm";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		closeOnEscape:true,
		minHeight:120,
		minWidth:120,	
		width:280,		
		beforeclose: function() {putrowClass(rowId);}
	});
	if(rowId)
    document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
	document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Drop Lead";
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function(doc)
	{
		var reasnToDrop = doc.getOpptyLostReasons.reasons;
		var dropReason = reasnToDrop.split('~)');
		var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
		convertDivContent+= "<tr><td width='100px' class='flexigrid'>Drop :</td><td>"+rowName+"</td></tr>";
		var dropDwn = "<tr><td width='100px' class='flexigrid'>Select Reason</td><td><select name='toDropLead' id='toDropLead' class='default'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>"
		for(var i=0; i<dropReason.length;i++)
		{
			var id=dropReason[i].split("--")[0];
			var val=dropReason[i].split("--")[1];
			dropDwn += "<option value='"+id+"'>"+val+"</option>";
		}
		dropDwn += "</select>";
		convertDivContent+= dropDwn;
		convertDivContent += "</td></tr>";
		convertDivContent +="<tr><td colspan='2' style='text-align:right'><br/><input type=button value=Update align='center' style='margin-right:70px;width:55px' class='greenButton' onclick='javascript:updateReasonForDropingLead("+pk+",\"toDropLead\");'></td></tr>";
		convertDivContent += "</table></center><br/>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	}
	});
}

function updateReasonForDropingLead(pk,selBoxId)
{
	var reasnId = document.getElementById(selBoxId).value;
	var JSONURL=zcServletPrefix+"/custom/JSON/system/updateLostReas.xml?opptyId="+pk+"&reasonId="+reasnId;
	$.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "xml",
	success: function (doc)
	{
		var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Lead Dropped Successfully.</b><br/><br/></td></tr>"; 
		convertDivContent += "</table>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup(1)",1000);
	}
	});
}

function deactivateUser(id, name, rowId) 
{	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Deactivate User - '+name,
		minHeight:100,
		minWidth:200,	
		width:450,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});

	if(id==session_login)
	{
		document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You can't deactivate the user(<span style='font-weight:bold;'>"+name+"</span>) with which you are currently logged in.<span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><br /><br /><input class='greenButton' type='button' value='OK' onclick='closePopup()'/></span></div>";
	}
	else
	{
		document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to Deactivate <span style='font-weight:bold;'>"+name+"</span></div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;proceedDeactivateUser("+id+",\""+name+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
	}
}

function proceedDeactivateUser(id, name)
{
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/adminNew/deactivateUser.html?id="+id,
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have successfully deactivated <span style='font-weight:bold;'>"+name+"</span> login.</div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeCommonPopup(1)'/></span></div>";
}



function deleteFilter(id, rowName, rowId)
{
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Delete Filter - '+rowName,
		minHeight:100,
		minWidth:200,	
		width:350,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to delete Filter <span style='font-weight:bold;'>"+rowName+"</span></div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;deleteTheFilter("+id+",\""+rowName+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
}

function deleteTheFilter(id, rowName)
{
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/JSON/system/deleteFilter/deleteAction?0-1-2="+id,
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have deleted the Filter <span style='font-weight:bold;'>"+rowName+"</span></div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeCommonPopup(1)'/></span></div>";
}

function deactivateMenuItem(id, rowName, rowId, action)
{
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Delete Menu Item - '+rowName,
		minHeight:100,
		minWidth:200,	
		width:350,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});

	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to Deactivate <span style='font-weight:bold;'>"+rowName+"</span></div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;proceedDeactivateMenuItem("+id+",\""+rowName+"\",\""+action+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";

}

function proceedDeactivateMenuItem(id,name,action)
{
	
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/Activate_Deactivate/UserPrefs4Menus.html?id="+id+"&action="+action,
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have successfully deactivated <span style='font-weight:bold;'>"+name+"</span></div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeCommonPopup(1)'/></span></div>";
}
	

function deleteMenuItem(id, rowName, rowId)
{
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Delete Menu Item - '+rowName,
		minHeight:100,
		minWidth:200,	
		width:350,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});

	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to Deactivate <span style='font-weight:bold;'>"+rowName+"</span></div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;proceedDeleteMenuitems("+id+",\""+rowName+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
   
}

function proceedDeleteMenuitems(id,name)
{
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/adminNew/deleteMenuItem.xml?id="+id,
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have successfully deactivated <span style='font-weight:bold;'>"+name+"</span></div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeCommonPopup(1)'/></span></div>";
}

function deactivateMessage(id, rowName, rowId)
{
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Delete SMS - '+rowName,
		minHeight:100,
		minWidth:200,	
		width:350,
		closeOnEscape:true,
		beforeclose: function() {putrowClass(rowId);}
	});

	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Do you want to Deactivate <span style='font-weight:bold;'>"+rowName+"</span></div><span style='float:right; margin-right:50px; margin-top:20px;margin-bottom:20px;'><input style='width:60px;' class='greenButton' type='button' value='Yes' onclick='this.disable=true;proceedDeactivateMessage("+id+",\""+rowName+"\")' />&nbsp;<input class='greenButton' type='button' value='No' onclick='closePopup()'/></span></div>";
   
	
}

function proceedDeactivateMessage(id,name)
{
	
	$.ajax({
		type:"GET",
		async: true,
		url: zcServletPrefix+"/custom/SMSTemplate/setupSMSTemplate/editAction?0-1-2="+id+"&0-1-26=1",
		success: function(){}
	});
	document.getElementById('commonPopupDiv').innerHTML="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>You have successfully deactivated <span style='font-weight:bold;'>"+name+"</span></div><br /><span style='margin-right:50px; margin-top:20px;margin-bottom:20px;'><input class='greenButton' type='button' value='OK' onclick='closeCommonPopup(1)'/></span></div>";
}



function recieveTransitForInventory(pkVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:160,	
		width:380,
		closeOnEscape:true
	});
	
		var JSONURL = zcServletPrefix+"/custom/JSON/system/inventoryTransit.htm?header_Id="+pkVal;
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				var batchno = doc.inventoryTransit.getbatch_no;
				var srcBrch = doc.inventoryTransit.getfrombrch_id;
				var destBrch = doc.inventoryTransit.gettobrch_id;
				var srcBrchName = doc.inventoryTransit.getfrombrch_name;
				var destBrchName = doc.inventoryTransit.gettobrch_name;
				var flag = doc.inventoryTransit.gettransit_flg;
				document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Receive Inventory Goods";
				if(flag == 1)
				{
					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;'cellpadding='3'>";
					convertDivContent+="<tr><td colspan='2'><div align='center' style='margin-top:30px;'><center>Would you like to Receive all goods  From <b>"+srcBrchName+"</b> To <b>"+destBrchName+"</b> of batch number <b>'"+batchno+"'</b>.<br/><br/>Click <b>Yes</b> to Receive and <b>No</b> to cancel.</center></div><div align='center' style='margin-bottom:30px;'><tr><td align='center'><input style='width:70px;margin-bottom:10px;' class='greenButton' type='button' value='Yes' onclick='updateTransitForInventory("+pkVal+")'/>&nbsp;<input style='width:70px;margin-bottom:10px;' class='greenButton' type='button' value='No' onclick='javascript:closePopup("+pkVal+")'/></td></tr></div></td><tr>"
					convertDivContent +="</table></center>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				}
				else
				{
					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;'cellpadding='3'>";
					convertDivContent+="<tr><td colspan='2'><div align='center' style='margin-top:30px;'><center>All goods of Batch number <b>"+batchno+"</b> already have been received.</center></div></td></tr>"
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				}
			}
	});
}
function updateTransitForInventory(pkVal)
{
	var JSONURL = zcServletPrefix+"/custom/JSON/system/inventoryTransit/editAction?0-1-2="+pkVal;
	$.ajax({
		type: "GET",
		url: JSONURL,			
		success: function (doc)
	   {
			var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Transaction Completed.</b><br/><br/></td></tr>"; 
			convertDivContent += "</table>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			setTimeout("closeCommonPopup(1)",1000);
		},
		error: function() 
		{
			var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Transaction failed.Please try again.<br/><br/></td></tr>"; 
			convertDivContent += "</table></center><br/>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			setTimeout("closeCommonPopup()",1000);
		}
	});	
}


function addInvoiceOfOrder(orderHeaderId,cont_driven,responseURI)
{
	if(responseURI && responseURI!='')
	{
		var AjaxReqURL=zcServletPrefix+'/custom/JSON/system/getMnuItemId.htm?munItemIdForUrl='+responseURI+'?cont_driven='+cont_driven;
		$.ajax(
		{
			type: "GET",
			url:AjaxReqURL,
			dataType: "json",
			success: function (doc)
			{
				document.getElementById(mnuItmId+'-URL').value=responseURI;
				subMnuItmId=doc.getMnuItemId;
			}
		});
	}
	setUpPageParameters(zcServletPrefix+'/custom/JSON/add/invoices.json?orderHeaderId='+orderHeaderId+'&cont_driven='+cont_driven,entityDiv);
}

function IssueIndent(indentHeaderId)
{
	var url = zcServletPrefix+"/custom/JSON/add/tranx_header.htm?flag=betwnwhse&iid="+indentHeaderId;
	url = url.replace(/\?/g,"~");
	url = url.replace(/&/g,"@");
	url = url.replace(/=/g,"*");
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();	
}

function checkIndentForTransaction(pkVal,rowName,rowId)
{
	var JSONURL = zcServletPrefix+"/custom/JSON/system/getIssuedIndents.htm?id="+pkVal;
	$.ajax({ 
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				var getTranxHdrId = doc.getIssuedIndents.getTranxHdrId;
				if(getTranxHdrId==""||getTranxHdrId==null)
				{
					var url = zcServletPrefix+"/custom/JSON/add/indent_header.htm?id="+pkVal;
					url = url.replace(/\?/g,"~");
					url = url.replace(/&/g,"@");
					url = url.replace(/=/g,"*");
					window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+url+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();	
				}
				else
				{
					document.getElementById("commonPopupDiv").innerHTML = "";
					
					$('#commonPopupDiv').dialog({
						autoOpen:true,
						modal: true,
						minHeight:120,
						minWidth:160,	
						width:380,
						closeOnEscape:true
					});
						document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Indent";
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Sorry,Indent # "+ rowName +" has already been Issued.</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				}
			}
	});
}

function changeActivityStatus(pkVal,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:160,	
		width:380,
		closeOnEscape:true
	});
	
		var JSONURL = zcServletPrefix+"/custom/JSON/system/activityNoShow.htm?ai="+pkVal;
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="No Show Activity";
				var actvtId = doc.activityNoShow.getActvtId;
				var subject = doc.activityNoShow.getSubject;
				var createdBy = doc.activityNoShow.getCreatedBy;
				var createdFor = doc.activityNoShow.getCreatedFor;
				var actvtStatus = doc.activityNoShow.getActvtStatus;
				if(actvtId)
				{
					var convertDivContent = "<table style='margin-top:5px; border:0px solid red;'cellpadding='3'>";
					convertDivContent+="<tr><td colspan='2'><div align='center' style='margin-top:30px;'><center>This Activity <b>'"+subject+"'</b> will be marked as <b>'No Show'</b> and a new open Activity will be created for <b>'"+createdBy+"'</b> to work on, <br/><br/>Click <b>Yes</b> to do this and <b>No</b> to cancel.</center></div><div align='center' style='margin-bottom:30px;'><tr><td align='center'><input style='width:70px;margin-bottom:10px;' class='greenButton' type='button' value='Yes' onclick='updateActivityStatus("+pkVal+")'/>&nbsp;<input style='width:70px;margin-bottom:10px;' class='greenButton' type='button' value='No' onclick='javascript:closePopup("+pkVal+")'/></td></tr></div></td><tr>"
					convertDivContent +="</table></center>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				}
			}
	});
}

function updateActivityStatus(pkVal)
{
	var JSONURL = zcServletPrefix+"/custom/JSON/system/activityNoShow/editAction?0-1-2="+pkVal;
	$.ajax({
		type: "GET",
		url: JSONURL,			
		success: function (doc)
	   {
/*			var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Status Changed Successfully.</b><br/><br/></td></tr>"; 
			convertDivContent += "</table>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;*/
			setTimeout("closeCommonPopup(1)",1000);
		},
		error: function() 
		{
/*			var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Status failed.Please try again.<br/><br/></td></tr>"; 
			convertDivContent += "</table></center><br/>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;*/
			setTimeout("closeCommonPopup()",1000);
		}
	});	
}

function changeOrderStatus(pkVal,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:120,	
		width:280,
		closeOnEscape:true
	});
		var JSONURL = zcServletPrefix+"/custom/JSON/system/getOrderStatus.htm?Id="+pkVal;
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Change Order Status";
				var ord_num = doc.getOrderNum.Ord_num;
				var contact = doc.getOrderNum.Contact;
				var ord_status = doc.getOrderStatus.status;
				var all_status = ord_status.split('~)');
				var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
				convertDivContent+= "<tr><td width='100px' class='flexigrid'><center>change order status of order number : '"+ord_num+"' for contact '"+contact+"'</td></tr>";
				var dropDwn = "<tr><td width='250px' colspan='2' style='text-align:center' class='flexigrid'>Select Order Status</td></tr><tr><td colspan='2' style='text-align:center' class='flexigrid' width='250px'><select name='toChngStatus' id='toChngStatus' class='default'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>"
				for(var i=0; i<all_status.length;i++)
				{
					var id=all_status[i].split("--")[0];
					var val=all_status[i].split("--")[1];
					dropDwn += "<option value='"+id+"'>"+val+"</option>";
				}
				dropDwn += "</select>";
				convertDivContent+= dropDwn;
				convertDivContent += "</td></tr>";
				convertDivContent +="<tr><td colspan='2' style='text-align:right'><br/><input type=button value=Update align='center' style='margin-right:70px;width:55px' class='greenButton' onclick='javascript:updateOrderStatus("+pkVal+",\"toChngStatus\");'></td></tr>";
				convertDivContent += "</table></center><br/>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
	});
}

function updateOrderStatus(pkVal,selBoxId)
{
	var statusId = document.getElementById(selBoxId).value;
	var JSONURL=zcServletPrefix+"/custom/JSON/system/updateOrderStatus/editAction?0-1="+pkVal+"&0-101="+statusId;
	$.ajax({
	type: "GET",
	url: JSONURL,
	success: function (doc)
	{
		var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Status Changed Successfully.</b><br/><br/></td></tr>"; 
		convertDivContent += "</table>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup(1)",1000);
	}
	});
}


function experienceEdition()
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Experience Impel Configurations',
		minWidth:100,
		minHeight:500,
		width:500
	});						

	var convertDivContent="<iframe id='emailFrame' frameborder='0' src='"+zcServletPrefix+"/custom/system/listAllTemplateOrg.html' width='475' style='border:0px solid red' height='500'> </iframe>"

	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

 function confirmConfigurationChange(tempOrgId,templtOrgName)
 {
	var result = confirm('Are you sure you want to change the current configuration to '+templtOrgName+'?');
	if (result==true)
	{
		updateExperience(tempOrgId,templtOrgName);
	}

/*	 $.uiConfirm({
	  message => 'Would you like to continue?',
	  confirmed => function() { alert('hi'); },
	  cancelled => function() { do_something_on_cancel() },
	  complete => function() { do_something_on_ok_or_cancel() },
	});
	 
	   document.getElementById("commonPopupDiv").innerHTML = "";
		
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,	
			title:'Confirm Configuration chnage',
			minHeight:120,
		    minWidth:120,	
		    width:280,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
			
		});
		
		var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
	    convertDivContent+="<tr ><td colspan='2'><div align='center' style='margin-top:30px;'><center> Are you sure you want to change the current configuration to <b>"+templtOrgName+"?</b></center></div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:updateExperience('"+tempOrgId+"','"+templtOrgName+"')\"  class='greenButton' type='button' value='OK' id='commonPopupOK' name='commonPopupOK'/>&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('')\"  class='greenButton' type='button' value='Cancel'/></div></td><tr>"
		 

		convertDivContent += "</table></center>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent; 
		document.getElementById("commonPopupOK").focus(); */
 }



function updateExperience(tempOrgId,templtOrgName)
{
	
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Experience Impel Configurations',
		minWidth:100,
		minHeight:500,
		width:500
	});
	//alert(tempOrgId);
	document.getElementById("commonPopupDiv").innerHTML = "";
	var convertDivContent = "<table ><tr><td><br><br><br>You have selected <i>"+templtOrgName+"</i> to Experience. Please wait while we do the below mentioned changes...</td></tr><tr><td ><ul><li>Recreate your menu structure<span id='MenuItems' style='padding-left:52px'><img src='/atCRM/images/loading_small.gif'></span></li><li>Recreate Entity list<span id='Entitylist' style='padding-left:115px'>Pending</span></li><li>Recreate your layouts<span id='Layouts' style='padding-left:100px'>Pending</span></li><li>Reset organization level flags<span id='OrgFlag' style='padding-left:62px'>Pending</span></li><li>Reset Adhoc reports<span id='adHoc' style='padding-left:105px'>Pending</span></li></ul><br><br><br></td></tr></table>";

	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
	
	var enttURL = zcServletPrefix+"/custom/system/updateEntityList.html?templtOrgId="+tempOrgId;
	var orgURL = zcServletPrefix+"/custom/system/updateOrgFlags.html?templtOrgId="+tempOrgId;
	var menuURL = zcServletPrefix+"/custom/system/recreateMenuItems.html?templtOrgId="+tempOrgId;
	var layoutURL = zcServletPrefix+"/custom/system/recreateLayouts.html?templtOrgId="+tempOrgId;
	var adhocURL = zcServletPrefix+"/custom/system/recreateAdHocReports.html?templtOrgId="+tempOrgId;
	$.ajax({
		type: "GET",
		url: menuURL,			
		success: function (doc)
	   {	
			
			document.getElementById('MenuItems').innerHTML='<img src="/atCRM/images/tickmark.jpg"/>';
			document.getElementById('Entitylist').innerHTML='<img src="/atCRM/images/loading_small.gif">';
			$.ajax({
				type: "GET",
				url: enttURL,			
				success: function (doc)
			   {	
					
					document.getElementById('Entitylist').innerHTML='<img src="/atCRM/images/tickmark.jpg"/>';
					document.getElementById('Layouts').innerHTML='<img src="/atCRM/images/loading_small.gif">';
					$.ajax({
						type: "GET",
						url: layoutURL,			
						success: function (doc)
					   {	
							
							document.getElementById('Layouts').innerHTML='<img src="/atCRM/images/tickmark.jpg"/>';
							document.getElementById('OrgFlag').innerHTML='In progress';
							$.ajax({
								type: "GET",
								url: orgURL,			
								success: function (doc)
							   {	
									document.getElementById('OrgFlag').innerHTML='<img src="/atCRM/images/tickmark.jpg"/>';
									document.getElementById('adHoc').innerHTML='In progress';
									$.ajax({
										type: "GET",
										url: adhocURL,			
										success: function (doc)
									   {	
											document.getElementById('adHoc').innerHTML='<img src="/atCRM/images/tickmark.jpg"/>';
											setTimeout("closeCommonPopup(1)",1000);
											window.location.href=zcServletPrefix+'/custom/JSON/homePage.html'
										},
										error: function() 
										{
											setTimeout("closeCommonPopup()",1000);
										}
									});
								},
								error: function() 
								{
									setTimeout("closeCommonPopup()",1000);
								}
							});
						},
						error: function() 
						{
							setTimeout("closeCommonPopup()",1000);
						}
					});
				},
				error: function() 
				{
					setTimeout("closeCommonPopup()",1000);
				}
			});
			
		},
		error: function() 
		{
			setTimeout("closeCommonPopup()",1000);
		}
	});	

}

function popUpToEditUsrPrefsMenuItems(pkVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Edit user prefs menu item',
		//minWidth:250,
		minHeight:100,
		width:700,
		beforeclose: function() {}
	});	
	
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<iframe id='calendarFrame' frameborder='0' width='720' height='500' scrolling='no' src='"+zcServletPrefix+"/custom/edit/UsrPrefs4MnuItms.html?id="+pkVal+"'></iframe>"
		convertDivContent += "</table></center>";
	
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

function popUptoAddUsrPrefsMenuItems()
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Add user prefs menu item',
		//minWidth:250,
		minHeight:100,
		width:700,
		beforeclose: function() {}
	});	
	
		var convertDivContent = "<table style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
		convertDivContent+="<iframe id='calendarFrame' frameborder='0' width='720' height='400' scrolling='no' src='"+zcServletPrefix+"/custom/add/UsrPrefs4MnuItms.html></iframe>"
		convertDivContent += "</table></center>";
	
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
}

function timeZoneDiff(timeZoneOffset,timeDiffInMin)
{

	var userTimeZoneToDisp;
	switch (timeZoneOffset)
	{
	case -720:
		userTimeZoneToDisp = '(GMT -12:00)';
		break;
	case -660:
		userTimeZoneToDisp = '(GMT -11:00)';
		break;
	case -600:
		userTimeZoneToDisp = '(GMT -10:00)';
		break;
	case -540:
		userTimeZoneToDisp = '(GMT -09:00)';
		break;
	case -480:
		userTimeZoneToDisp = '(GMT -08:00)';
		break;
	case -420:
		userTimeZoneToDisp = '(GMT -07:00)';
		break;
	case -360:
		userTimeZoneToDisp = '(GMT -06:00)';
		break;
	case -300:
		userTimeZoneToDisp = '(GMT -05:00)';
		break;
	case -240:
		userTimeZoneToDisp = '(GMT -04:00)';
		break;
	case -210:
		userTimeZoneToDisp = '(GMT -03:30)';
		break;
	case -180:
		userTimeZoneToDisp = '(GMT -03:00)';
		break;
	case -120:
		userTimeZoneToDisp = '(GMT -02:00)';
		break;
	case -60:
		userTimeZoneToDisp = '(GMT -01:00)';
		break;
	case 0:
		userTimeZoneToDisp = '(GMT)';
		break;
	case 60:
		userTimeZoneToDisp = '(GMT +01:00)';
		break;
	case 120:
		userTimeZoneToDisp = '(GMT +02:30)';
		break;
	case 180:
		userTimeZoneToDisp = '(GMT +03:00)';
		break;
	case 210:
		userTimeZoneToDisp = '(GMT +03:30)';
		break;
	case 240:
		userTimeZoneToDisp = '(GMT +04:00)';
		break;
	case 270:
		userTimeZoneToDisp = '(GMT +04:30)';
		break;
	case 300:
		userTimeZoneToDisp = '(GMT +05:00)';
		break;
	case 330:
		userTimeZoneToDisp = '(GMT +05:30)';
		break;
	case 345:
		userTimeZoneToDisp = '(GMT +05:45)';
		break;
	case 360:
		userTimeZoneToDisp = '(GMT +06:00)';
		break;
	case 420:
		userTimeZoneToDisp = '(GMT +07:00)';
		break;
	case 480:
		userTimeZoneToDisp = '(GMT +08:00)';
		break;
	case 540:
		userTimeZoneToDisp = '(GMT +09:00)';
		break;
	case 570:
		userTimeZoneToDisp = '(GMT +09:30)';
		break;
	case 600:
		userTimeZoneToDisp = '(GMT +10:00)';
		break;
	case 420:
		userTimeZoneToDisp = '(GMT +11:00)';
		break;
	case 480:
		userTimeZoneToDisp = '(GMT +12:00)';
		break;
	case 540:
		userTimeZoneToDisp = '(GMT +13:00)';
		break;
	}

	var userTimeDiffToDisp;
	switch (timeDiffInMin)
	{
	case -720:
		userTimeDiffToDisp = '(GMT -12:00)';
		break;
	case -660:
		userTimeDiffToDisp = '(GMT -11:00)';
		break;
	case -600:
		userTimeDiffToDisp = '(GMT -10:00)';
		break;
	case -540:
		userTimeDiffToDisp = '(GMT -09:00)';
		break;
	case -480:
		userTimeDiffToDisp = '(GMT -08:00)';
		break;
	case -420:
		userTimeDiffToDisp = '(GMT -07:00)';
		break;
	case -360:
		userTimeDiffToDisp = '(GMT -06:00)';
		break;
	case -300:
		userTimeDiffToDisp = '(GMT -05:00)';
		break;
	case -240:
		userTimeDiffToDisp = '(GMT -04:00)';
		break;
	case -210:
		userTimeDiffToDisp = '(GMT -03:30)';
		break;
	case -180:
		userTimeDiffToDisp = '(GMT -03:00)';
		break;
	case -120:
		userTimeDiffToDisp = '(GMT -02:00)';
		break;
	case -60:
		userTimeDiffToDisp = '(GMT -01:00)';
		break;
	case 0:
		userTimeDiffToDisp = '(GMT)';
		break;
	case 60:
		userTimeDiffToDisp = '(GMT +01:00)';
		break;
	case 120:
		userTimeDiffToDisp = '(GMT +02:30)';
		break;
	case 180:
		userTimeDiffToDisp = '(GMT +03:00)';
		break;
	case 210:
		userTimeDiffToDisp = '(GMT +03:30)';
		break;
	case 240:
		userTimeDiffToDisp = '(GMT +04:00)';
		break;
	case 270:
		userTimeDiffToDisp = '(GMT +04:30)';
		break;
	case 300:
		userTimeDiffToDisp = '(GMT +05:00)';
		break;
	case 330:
		userTimeDiffToDisp = '(GMT +05:30)';
		break;
	case 345:
		userTimeDiffToDisp = '(GMT +05:45)';
		break;
	case 360:
		userTimeDiffToDisp = '(GMT +06:00)';
		break;
	case 420:
		userTimeDiffToDisp = '(GMT +07:00)';
		break;
	case 480:
		userTimeDiffToDisp = '(GMT +08:00)';
		break;
	case 540:
		userTimeDiffToDisp = '(GMT +09:00)';
		break;
	case 570:
		userTimeDiffToDisp = '(GMT +09:30)';
		break;
	case 600:
		userTimeDiffToDisp = '(GMT +10:00)';
		break;
	case 420:
		userTimeDiffToDisp = '(GMT +11:00)';
		break;
	case 480:
		userTimeDiffToDisp = '(GMT +12:00)';
		break;
	case 540:
		userTimeDiffToDisp = '(GMT +13:00)';
		break;
	}

var contentToWrite = "<table><tr><td><br>Your desktop timezone is "+userTimeZoneToDisp+" but your preferred timezone in Impel is "+userTimeDiffToDisp+". You can continue to use Impel, since it will use the timezone on your User record and ignore the one on your desktop. If you'd like to change your Impel timezone, please change it on your My Profile page from the banner above.</td></tr></table>";


	var $dialog = $('<div></div>')
		.html(contentToWrite)
		.dialog({
			autoOpen: false,
			title: 'Time zone alert!'
		});
	
	$dialog.dialog('open');
	 $dialog.dialog("option", "position", 'center');

}

 function ReassignServReq(pk,rowName,rowId)
 {
		var dt = new Date();
		var curDate = dt.getDate('dd/MM/yyyy');
		var curMnth = dt.getMonth()+1;
		var curYr = dt.getFullYear();
		if(curMnth<10)
			curMnth = '0'+curMnth;
		if(curDate<10)
			curDate = '0'+curDate;
		var currentDt = curDate + "/" + curMnth + "/" + curYr;
		var hh = dt.getHours();
		if(hh<10)
			hh = '0'+hh;
		var mm = dt.getMinutes();
		if(mm<10)
			mm = '0'+mm;
		var ss = dt.getSeconds();
		if(ss<10)
			ss = '0'+ss;
		var currentTime =  hh+":"+mm+":"+ss;

	   document.getElementById("commonPopupDiv").innerHTML = "";
		
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			minHeight:260,
		    minWidth:200,	
		    width:420,
			closeOnEscape:true,
			title:'Reassign/Reschedule Service request',
			beforeclose: function() {putrowClass(rowId);}
		});

 var JSONURL=zcServletPrefix+"/custom/JSON/system/serviceRequestDetails.htm?serviceReqId="+pk;
    $.ajax({
	type: "GET",
	url: JSONURL,
	dataType: "json",
	success: function (doc)
	{
		 var Account = doc.servReqInfo["Account"];
		 var Contact = doc.servReqInfo["Contact"];
		 var PriAssUser = doc.servReqInfo["PriAssUser"];
		 var SecAssUsr = doc.servReqInfo["SecAssUsr"];
		 var scheduledAt = doc.servReqInfo["scheduledAt"];
		 var CmpltStatus = doc.servReqInfo["CmpltStatus"];

		  $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/listSupportUsers.xml",
			dataType: "xml",
			success: function (doc)
			{	
				
				var joinall = doc.getElementsByTagName("joinall");	
				
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				
				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var allSupportUsers=document.createElement('select');
				allSupportUsers.setAttribute("id","primAssUsers");
				allSupportUsers.setAttribute("width","100");
 				allSupportUsers.className="inputFieldClass";
				document.getElementById('primAsUserDD').appendChild(allSupportUsers);					
				for(i=0; i<temp.length; i++)
				{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];  
						 if(relatedTempList)
						 {		
							
						   allSupportUsers[i]=new Option(relatedTempList,relatedId);
                           allSupportUsers[i].selected = true;
						 }
						 else    
						     allSupportUsers[i]=new Option(relatedTempList,relatedId);
				}
						     allSupportUsers[0].selected = true;	
			}
		});	

  $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/listSupportUsers.xml",
			dataType: "xml",
			success: function (doc)
			{	
				
				var joinall = doc.getElementsByTagName("joinall");	
				
				var allInfo=joinall[0]?joinall[0].getAttribute("join") : null;	
				
				var temp = new Array();		
				
				temp = allInfo.split('~)');	
				
				var allSupportUsersSec=document.createElement('select');
				allSupportUsersSec.setAttribute("id","secAssUsers");
				allSupportUsersSec.setAttribute("width","100");
 				allSupportUsersSec.className="inputFieldClass";
				document.getElementById('secAsUserDD').appendChild(allSupportUsersSec);					
				for(i=0; i<temp.length; i++)
						{						 
						 var relatedTemp = temp[i].split('--');	 						
						 var relatedId=relatedTemp[1];	 						
						 var relatedTempList=relatedTemp[0];  
						 if(relatedTempList)
						 {		
							
						   allSupportUsersSec[i]=new Option(relatedTempList,relatedId);
                           allSupportUsersSec[i].selected = true;
						 }
						 else    
						     allSupportUsersSec[i]=new Option(relatedTempList,relatedId);
					      }
						     allSupportUsersSec[0].selected = true;	
				 		  }
			});	 
		if(CmpltStatus == 'Closed' || CmpltStatus == 'closed')
		{
			var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>Sorry, you can not reassign/reschedule as this service request status is already 'Closed'.</b></center><br/><br/></td></tr>"; 
			convertDivContent += "</table>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			setTimeout("closeCommonPopup(1)",3000);
		}
		else
		{
			var convertDivContent = "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='100%' height='100%' align='center' style='vertical-align:middle;background-color:white;margin-top:5px; border:0px solid red;table-layout:relative;'>";
			convertDivContent += "<tr border='0'><td width='50%' valign='middle'>The service request with identifier &nbsp;<b>"+rowName+"</b>&nbsp; for contact &nbsp;<b>" +Contact+ "</b>&nbsp;<if Account> of Account &nbsp; <b>"+Account+"</b></if> &nbsp has following scheduled time and users assigned. Please 'Click to edit',to 'Reschedule' or to 'Reassign' the service request.</td></tr></table>";
			convertDivContent += "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='400' height='110px' align='center' style='vertical-align:middle;background-color:white;margin-top:5px; border:0px solid red;table-layout:relative;'>";
			convertDivContent += "<tr cellspacing='3'><td valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3' cellpadding='3'><b>Scheduled time of SR &nbsp;&nbsp;&nbsp;&nbsp;:</b></td><td valign='top' border='1' width='50%' class='TblBdy' style='border:0px solid red;padding-top:20px;spacing:0px;padding-bottom:0px;' align='left' cellspacing='0' cellpadding='0'><div id='scheduledAtDiv'>"+scheduledAt+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='editScheduledAt' name='editScheduledAt' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='showdateDiv(1)'>Edit</a></div><table width='100%' height='40%' style='table-layout:relative;vertical-align:middle;'><tr class='TblBdy' cellspacing='3'><td id='date_td' valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3' cellpadding='3'><div id='dateDiv' style='display:none;'><input type='hidden' id='dateHidden'/><input id='dateHidden_date_value' class='inputFieldClass' onblur=\"changeDate('dateHidden_date_value');\" size=12 maxlength=12 style='width:80px' value='"+currentDt+"'/><td id='img_td' width='50%' style='display:none;'><img src='/atCRM/images/calendar.gif' id='0-1401-1436_cal' alt='Pick Date' style='cursor:pointer;vertical-align:right;padding-left:1px;padding-right:1px;'/></td><td width='50%'><div id='combo' class='combo' style='display:none;'><input id='dateHidden_time_value' class='inputFieldClass' size=10 maxlength=8 style='width:70px' value='"+currentTime+"'/><ul><li>12:00 AM</li><li>12:30 AM</li><li>01:00 AM</li><li>01:30 AM</li><li>02:00 AM</li><li>02:30 AM</li><li>03:00 AM</li><li>03:30 AM</li><li>04:00 AM</li><li>04:30 AM</li><li>05:00 AM</li><li>05:30 AM</li><li>06:00 AM</li><li>06:30 AM</li><li>07:00 AM</li><li>07:30 AM</li><li>08:00 AM</li><li>08:30 AM</li><li>09:00 AM</li><li>09:30 AM</li><li>10:00 AM</li><li>10:30 AM</li><li>11:00 AM</li><li>11:30 AM</li><li>12:00 PM</li><li>12:30 PM</li><li>01:00 PM</li><li>01:30 PM</li><li>02:00 PM</li><li>02:30 PM</li><li>03:00 PM</li><li>03:30 PM</li><li>04:00 PM</li><li>04:30 PM</li><li>05:00 PM</li><li>05:30 PM</li><li>06:00 PM</li><li>06:30 PM</li><li>07:00 PM</li><li>07:30 PM</li><li>08:00 PM</li><li>08:30 PM</li><li>09:00 PM</li><li>09:30 PM</li><li>10:00 PM</li><li>10:30 PM</li><li>11:00 PM</li><li>11:30 PM</li></ul></div></td></br><tr class='TblBdy' cellspacing='3'><td valign='middle' width='50%' class='TblBdy' style='border:0px solid red' align='right' cellspacing='3' cellpadding='3'><span id='sp_id' style='display:none;'><a id='saveScheduleTime' name='saveScheduleTime' style='text-decoration:underline;color:blue;cursor: pointer;margin-right:0px' onclick=\"rescheduleSerReq("+pk+",'dateHidden_date_value','dateHidden_time_value');\">Save</a>&nbsp;&nbsp;<a id='cancelScheduleTime' name='cancelScheduleTime' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='showdateDiv(0)'>Cancel</a></span></td></tr></div></td></tr></table></td></tr>";
			convertDivContent += "<tr class='TblBdy' cellspacing='3'  border='1'><td valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3'  cellpadding='3'><b>Primary assigned user &nbsp;&nbsp;&nbsp;&nbsp;:</b></td><td valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3' cellpadding='3' nowrap><div id='primAsUserDD' style='display:none'>&nbsp;<span id='prim_span' style='margin-top:5px;float:right;margin-right:25px;display:block;'><a id='saveScheduleTime' name='savePAU' style='text-decoration:underline;color:blue;cursor: pointer;margin-right:0px' onclick='reassignSerReqUsr("+pk+",1)'>Save</a>&nbsp;&nbsp;<a onclick='editPAU(0)' id='cancelScheduleTime' name='cancelPAU' style='text-decoration:underline;color:blue;cursor: pointer;'>Cancel</a><span></div><div id='PriAssUserDiv' style='border:0px solid red;float:left;display:block;'>"+PriAssUser+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='editPriAsUsr' name='editPriAsUsr' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='editPAU(1)'>Edit</a></div>&nbsp;</td></tr>";
			convertDivContent += "<tr class='TblBdy' cellspacing='3'  border='1'><td></td></tr>"; 
			convertDivContent += "<tr class='TblBdy' cellspacing='3'  border='1'><td valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3'  cellpadding='3'><b>Secondary assigned user :</b></td><td valign='middle' border='1' width='50%' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3'  cellpadding='3' nowrap><div id='secAsUserDD' style='display:none'>&nbsp;<span style='margin-top:5px;float:right;margin-right:25px;'><a id='saveSAU' name='saveSAU' style='text-decoration:underline;color:blue;cursor: pointer;margin-right:0px' onclick='reassignSerReqUsr("+pk+",2)'>Save</a>&nbsp;&nbsp;<a id='cancelSAU' name='cancelPAU' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='editSAU(0)'>Cancel</a><span></div><div id='SecAssUsrDiv' style='border:0px solid red;float:left;'>"+SecAssUsr+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='editSecAsUsr' name='editSecAsUsr' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='editSAU(1)'>Edit</a></div>&nbsp;</td></tr>";
			convertDivContent += "</table></center>";
			convertDivContent += "<span style='float:right;margin-right:180px;'><input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+pk+"')\"  class='greenButton' type='button' value='OK'/></span>"
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;

	     new TimeCombo('dateHidden_time_value','#FFFFFF','#FFFFFF');
						changeTime('dateHidden_time_value');
						//fieldElemTd.style.fontFamily="Tahoma, Verdana";
						//fieldElemTd.style.fontSize="11px";
						new Calendar({
							  inputField: 'dateHidden_date_value',
							  dateFormat: "%d/%m/%Y", 
							  trigger:'0-1401-1436_cal',
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BR",
							  onSelect: function() {
							  var date = Calendar.intToDate(date);
							  var dateHidden_cal_val=this.inputField.id;
							  var dateHidden=dateHidden_cal_val.replace('_cal_value','');
							  document.getElementById(dateHidden).value=document.getElementById(dateHidden_cal_val).value;
							  this.hide();}
						});
		}//end of else part
      }

     });	
 }

 function showdateDiv(param)
 {
	   if(param=="1")
	 {
 	   document.getElementById("scheduledAtDiv").style.display="none";
 	   document.getElementById("dateDiv").style.display="block";
	    $("#combo").css("display","block");
		$("#edit_td").css("display","none");
		$("#sp_id").css("display","block");
		$("#img_td").css("display","block");
	 }
	 if(param=="0")
	 {
 	   document.getElementById("scheduledAtDiv").style.display="block";
 	   document.getElementById("dateDiv").style.display="none";
	    $("#combo").css("display","none");
		$("#sp_id").css("display","none");
		$("#edit_td").css("display","block");
		$("#img_td").css("display","none");
	 }
 }

 function  editPAU(param)
 {
	   if(param=="1")
	 {
 	   document.getElementById("PriAssUserDiv").style.display="none";
 	   document.getElementById("primAsUserDD").style.display="block";
	 }
	  if(param=="0")
	 {
 	   document.getElementById("PriAssUserDiv").style.display="block";
 	   document.getElementById("primAsUserDD").style.display="none";
	 }
 }

 function editSAU(param)
 {
	  if(param=="1")
	 {
 	    document.getElementById("SecAssUsrDiv").style.display="none";
 	    document.getElementById("secAsUserDD").style.display="block";
	 }
	  if(param=="0")
	 {
 	    document.getElementById("SecAssUsrDiv").style.display="block";
 	    document.getElementById("secAsUserDD").style.display="none";
	 }
 }


 function reassignSerReqUsr(pk,type)
 {
	 if(document.getElementById("primAssUsers"))
	 var priUser= document.getElementById("primAssUsers").value;
	 if(document.getElementById("secAssUsers")&&document.getElementById("secAssUsers").value!="")
	 var secUser= document.getElementById("secAssUsers").value;

	 if(type == "1")
		 var url = zcServletPrefix+"/custom/JSON/system/ReassignUser_ServReq/editAction?0-1="+pk+"&0-101="+priUser+"&0-201=";

	 if(type == "2")
		var url = zcServletPrefix+"/custom/JSON/system/ReassignUser_ServReq/editAction?0-1="+pk+"&0-201="+secUser+"&0-101=";

	  $.ajax({
			type: "GET",	
			url:url,
			dataType: "html",
			success: function (doc)
			{
				   var JSONURL=zcServletPrefix+"/custom/JSON/system/serviceRequestDetails.htm?serviceReqId="+pk;
					$.ajax({
					type: "GET",
					url: JSONURL,
					dataType: "json",
					success: function (doc)
					{
					   if(doc.servReqInfo["PriAssUser"])
						{
						   var PriAssUser = doc.servReqInfo["PriAssUser"];
						   document.getElementById("PriAssUserDiv").innerHTML=PriAssUser+"&nbsp;&nbsp;<a id='editPriAsUsr' name='editPriAsUsr' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='editPAU(1)'>Edit</a";
						   editPAU('0');
						}
					   if(doc.servReqInfo["SecAssUsr"])
						{
							var SecAssUser = doc.servReqInfo["SecAssUsr"];
						   document.getElementById("SecAssUsrDiv").innerHTML=SecAssUser+"&nbsp;&nbsp;<a id='editSecAsUsr' name='editSecAsUsr' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='editSAU(1)'>Edit</a>";
						   editSAU('0');
						}
					}
					})
			}
			});	
 }


 function rescheduleSerReq(pkVal,dateObj,timeObj)
 {
	
	var time_value = document.getElementById(timeObj).value;
	if(time_value != "")
	{					
			var ap = time_value.split(' ')[1];
			var hour = (time_value.split(' ')[0]).split(':')[0];
			var minute = (time_value.split(' ')[0]).split(':')[1];
			var second = "00";
			if(ap == "AM")
				{if (hour == 12)hour = "00";}
			else
				{hour=parseFloat(hour);if(hour < 12){hour = hour+12;};}
			time_value = hour +':' +minute +':' +second;
	}

	 var dateTime = document.getElementById(dateObj).value+" "+time_value;
	 $.ajax({
			type: "GET",		
			url:zcServletPrefix+"/custom/JSON/system/RescheduleServiceRequest/editAction?srqID="+pkVal+"&dt="+dateTime,
			dataType: "html",
			success: function (doc)
			{
				var JSONURL=zcServletPrefix+"/custom/JSON/system/serviceRequestDetails.htm?serviceReqId="+pkVal;
					$.ajax({
					type: "GET",
					url: JSONURL,
					dataType: "json",
					success: function (doc)
					{
						var scheduledDate = doc.servReqInfo["scheduledAt"];
						document.getElementById('scheduledAtDiv').innerHTML = scheduledDate+"&nbsp;&nbsp;<a id='editScheduledAt' name='editScheduledAt' style='text-decoration:underline;color:blue;cursor: pointer;' onclick='showdateDiv(1)'>Edit</a>";
						showdateDiv('0');
					}
					});
			}
	 });
 }

 function MarkCompleteServReq(pk,rowName,rowId)
 {
       document.getElementById("commonPopupDiv").innerHTML = "";
		
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Mark Complete - '+rowName,
			minHeight:120,
		    minWidth:120,	
		    width:300,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
 if(rowId)
document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
  var JSONURL=zcServletPrefix+"/custom/JSON/system/VerifySerReqStatus.htm?id="+pk;
     $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (data)
			   {  
			      var statusInfo = data["serv_req"];
				  var status= statusInfo["serv_reqStatus"];
				  if(status=='Closed')
					{
						var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>This Service request is already marked as 'Completed'</b></center><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
					  
					}
				    else
				    {				  
						var convertDivContent = "<table align='center' style='margin-top:5px; border:0px solid red;' cellpadding='3'>";
						convertDivContent+="<span align='center' style='float:right; border:0px solid blue'><div align='center' style='margin-top:30px;border:0px solid red'> Are you sure to Mark <b>"+rowName+"</b> as Complete? After marking it as completed the service request status will be closed.</div><div align='center' style='margin-bottom:30px;border:0px solid red'><input style='width:70px;margin-top:20px;' onclick=\"javascript:MarkCompleteOnConfirmSR('"+pk+"')\"  class='greenButton' type='button' value='OK'/>&nbsp;&nbsp;<input style='width:70px;margin-top:20px;' onclick=\"javascript:closePopup('"+pk+"')\"  class='greenButton' type='button' value='Cancel'/></div></span>"
						convertDivContent += "</table></center>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				    }
		       }
	 });
 }

 function MarkCompleteOnConfirmSR(pk)
	{
		  var JSONURL=zcServletPrefix+"/custom/JSON/system/MarkServReqStatus/editAction?0-1="+pk;
        $.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "html",
			success: function (doc)
			   {			
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Marked as Completed</b><br/><br/></td></tr>"; 
					convertDivContent += "</table>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				},
				error: function() 
				{
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/>Activity not marked as Completed. Please try again.<br/><br/></td></tr>"; 
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup()",1000);
				}
			});	
		 
	}

function serReqHistory(pkVal,rowName,rowId)
{
	 var JSONURL=zcServletPrefix+"/custom/JSON/system/srq_activity.htm?srqID="+pkVal;
   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'History of '+rowName,
			minHeight:120,
		    minWidth:550,	
		    width:580,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");

		$.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			{
				
				var allSerRequests = doc["allSerRequests"];
				var allSReqsLength = allSerRequests.length;		
				if(allSReqsLength>=1)
				{
				var convertDivContent = "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='500' align='center' style='vertical-align:middle;background-color:#dddddd;margin-top:5px; border:0px solid red;' >";
		
		          convertDivContent += "<tr valign='middle' class='TblBdy' cellspacing='3'  border='1'><th border='1' width='1' cellspacing='3'>#</th><th border='1' width='50' cellspacing='3' >Service request</th><th border='1' width='75' cellspacing='3' >Activity</th><th border='1' width='40' cellspacing='3' >Activity Status</th><th border='1' width='30' cellspacing='3'>Reschedule time</th><th border='1' width='30' cellspacing='3'>Action</th><th border='1' width='30' cellspacing='3'>If Reassigned</th></tr>"; 
				 
						for(k=0,l=0;k<allSReqsLength;k++,l++)
						{	
							sRId = allSerRequests[l]["sRId"];					
							sRName = allSerRequests[l]["sRName"];				
							sRActivity = allSerRequests[l]["sRActivity"];	
							sRActvtStatus = allSerRequests[l]["sRActvtStatus"];	
							sRschdTime = allSerRequests[l]["sRschdTime"];	
							if(sRschdTime)
								var Action_var = "Rescheduled";
							else 
								Action_var = "Reassign";
							sRasigndUsr = allSerRequests[l]["sRasigndUsr"];	
							var count = 1;
							count = count+k;
							
							if (sRName!=""){ convertDivContent += "<tr valign='middle' border='1' cellspacing='3' cellpadding='3'><td valign='middle' border='1' width='20' class='TblBdy' align='center' cellspacing='3'  cellpadding='3'>"+count+"</td><td valign='middle' border='1' width='50' class='TblBdy' style='border:0px solid red' align='left' cellspacing='3'  cellpadding='3'>"+ sRName +"</td><td valign='middle' border='1' cellspacing='3'  cellpadding='3' width='75'  class='TblBdy' style='border:0px solid red' align='left'>" + sRActivity + "</td><td valign='middle' border='1' width='40'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>" + sRActvtStatus + "</td><td valign='middle' border='1' width='50'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>" + sRschdTime + "</td><td valign='middle' border='1' width='30'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>"+Action_var+"</td><td valign='middle' border='1' width='40' cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>"+ sRasigndUsr +"</td></tr>"; }
						}
				convertDivContent += "</table></center><br/><span style='float:right;margin-right:240px;'><input style='width:70px;margin-top:10px;' onclick=\"javascript:closePopup()\" class='greenButton' type='button' value='OK'/></span>";
				}
				else
				{
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>There is no history for this service request.</b></center><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
				}
               document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
			});	
}

function uploadReport4ServReq(pkVal)
{
document.getElementById("commonPopupDiv").innerHTML = "";
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Upload report',
		minHeight:260,
		minWidth:600,	
		width:650,
		closeOnEscape:true,
		beforeclose: function() {}

	});
	var URL=zcServletPrefix+"/custom/JSON/system/serviceRequestDetails.htm?serviceReqId="+pkVal;
    $.ajax({
	type: "GET",
	url: URL,
	dataType: "json",
	success: function (doc)
	{
		 var CmpltStatus = doc.servReqInfo["CmpltStatus"];
		 
		 if(CmpltStatus == 'Closed' || CmpltStatus == 'closed')
		{
			var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
			convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>Sorry, you can not upload report as this service request status is already Closed.</b></center><br/><br/></td></tr>"; 
			convertDivContent += "</table>";
			document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			setTimeout("closeCommonPopup(1)",4000);
		}
		else
		{
			var JSONURL=zcServletPrefix+"/custom/JSON/system/serviceRequestDetails.htm?serviceReqId="+pkVal;
			var convertDivContent = "<table style='margin-top:5px; border:0px solid red;width:100' cellpadding='3'>";
			convertDivContent+="<iframe id='servReqFrame' frameborder='0' src='"+zcServletPrefix+"/custom/adminNew/add/attachWorkReport.html?srqId="+pkVal+"' width='640' style='border:0px solid red' height='300' scrolling='no'></iframe>"
			convertDivContent += "</table></center>";
		}
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;	
	}
	});
}

function changeInvoiceStatus(pkVal,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:120,	
		width:280,
		closeOnEscape:true
	});
		var JSONURL = zcServletPrefix+"/custom/JSON/system/getInvoiceStatus.htm?Id="+pkVal;
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Change Order Status";
				var inv_num = doc.getInvoiceNum.Inv_num;
				var contact = doc.getInvoiceNum.Contact;
				var inv_status = doc.getInvoiceStatus.status;
				var all_status = inv_status.split('~)');
				var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
				convertDivContent+= "<tr><td width='100px' class='flexigrid'><center>change invoice status of invoice number : '"+inv_num+"' for contact '"+contact+"'</td></tr>";
				var dropDwn = "<tr><td width='250px' colspan='2' style='text-align:center' class='flexigrid'>Select Invoice Status</td></tr><tr><td colspan='2' style='text-align:center' class='flexigrid' width='250px'><select name='toChngStatus' id='toChngStatus' class='default'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>"
				for(var i=0; i<all_status.length;i++)
				{
					var id=all_status[i].split("--")[0];
					var val=all_status[i].split("--")[1];
					dropDwn += "<option value='"+id+"'>"+val+"</option>";
				}
				dropDwn += "</select>";
				convertDivContent+= dropDwn;
				convertDivContent += "</td></tr>";
				convertDivContent +="<tr><td colspan='2' style='text-align:right'><br/><input type=button value=Update align='center' style='margin-right:70px;width:55px' class='greenButton' onclick='javascript:updateInvoiceStatus("+pkVal+",\"toChngStatus\");'></td></tr>";
				convertDivContent += "</table></center><br/>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
	});
}

function updateInvoiceStatus(pkVal,selBoxId)
{
	var statusId = document.getElementById(selBoxId).value;
	var JSONURL=zcServletPrefix+"/custom/JSON/system/updateInvoiceStatus/editAction?0-1="+pkVal+"&0-101="+statusId;
	$.ajax({
	type: "GET",
	url: JSONURL,
	success: function (doc)
	{
		var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Status Changed Successfully.</b><br/><br/></td></tr>"; 
		convertDivContent += "</table>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup(1)",1000);
	}
	});
}

function changeMassStatus(pkVal)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		minHeight:120,
		minWidth:120,	
		width:280,
		closeOnEscape:true
	});
		var JSONURL = zcServletPrefix+"/custom/JSON/system/getInvoiceStatus.htm";
	$.ajax({
			type: "GET",			
		    url: JSONURL,
			dataType: "json",
			success: function(doc)
			{
				document.getElementById('ui-dialog-title-commonPopupDiv').innerHTML="Change Invoice Status";
				//var inv_num = doc.getInvoiceNum.Inv_num;
				//var contact = doc.getInvoiceNum.Contact;
				var inv_status = doc.getInvoiceStatus.status;
				var all_status = inv_status.split('~)');
				var convertDivContent = "<table style='margin-top:5px' cellpadding='3'>";
				convertDivContent+= "<tr><td width='100px' class='flexigrid'><center>change invoice status'</td></tr>";
				var dropDwn = "<tr><td width='250px' colspan='2' style='text-align:center' class='flexigrid'>Select Invoice Status</td></tr><tr><td colspan='2' style='text-align:center' class='flexigrid' width='250px'><select name='toChngStatus' id='toChngStatus' class='default'><option value=''>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;</option>"
				for(var i=0; i<all_status.length;i++)
				{
					var id=all_status[i].split("--")[0];
					var val=all_status[i].split("--")[1];
					dropDwn += "<option value='"+id+"'>"+val+"</option>";
				}
				dropDwn += "</select>";
				convertDivContent+= dropDwn;
				convertDivContent += "</td></tr>";
				convertDivContent +="<tr><td colspan='2' style='text-align:right'><br/><input type=button value=Update align='center' style='margin-right:70px;width:55px' class='greenButton' onclick='javascript:updateInvoiceDetailStatus("+pkVal+",\"toChngStatus\");'></td></tr>";
				convertDivContent += "</table></center><br/>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
	});
}

function updateInvoiceDetailStatus(pkVal,selBoxId)
{
	var statusId = document.getElementById(selBoxId).value;
//	var JSONURL=zcServletPrefix+"/custom/JSON/system/updateInvDetailStatus/editAction?0-1="+parent.G_allIdsForMassStatus+"&0-101="+statusId;
	var JSONURL=zcServletPrefix+"/custom/JSON/system/updateInvDetailStatus/editAction?pkCsv="+parent.G_allIdsForMassStatus+"&statusId="+statusId;
	$.ajax({
	type: "GET",
	url: JSONURL,
	success: function (doc)
	{
		var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
		convertDivContent += "<tr><td class='flexigrid'><br/><br/><b>Status Changed Successfully.</b><br/><br/></td></tr>"; 
		convertDivContent += "</table>";
		document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
		setTimeout("closeCommonPopup(1)",1000);
	}
	});
}
/*****Assign batch and qty to invoice products*****/
var invoiceData;
var windowElem;
var moreRowsFlag=0;
function InvoiceDtlAssignBatch2Goods(headerId)
{
	 $.ajax({
			type: "GET",
			url:zcServletPrefix+"/custom/JSON/system/getInvoiceDtlInfo.htm?headerId="+headerId,
			dataType: "json",
			success: function (doc)
				{	
				    invoiceData = doc;
				    var invNumber=doc["invoice_number"];
					var branchId = doc["invoiced_branch"];
					var invoice_dtl_cnt = doc["invoice_dtl_count"];
				 if(invoice_dtl_cnt >0){
					var windowHeight = $(window).height();
					var reqFrameHt= windowHeight -86;
					var invoiceDiv_ht = reqFrameHt -100;invoiceDiv_ht +="px";
					var windowContent = "<div id='error_div' style='text-align:center;color:red;font-family:tahoma;font-size:12px;height:15px;'></div>";
					windowContent += "<div id='div_editInvoice' style='max-height:"+invoiceDiv_ht+";overflow-y:auto;margin-top:5px;'></div>";
					windowContent += "<div id='btn_div' style='text-align:right;padding-top:1%;'><input type='button' id='btn_save'";
					windowContent += "style='width:70px;height:30px;margin-right:2%;' value='Save'/>";
					windowContent += "<input type='button' id='btn_cancel'style='width:70px;height:30px;margin-right:5%;' value='Cancel'/></div>";//height:470px;
					$.window({
						showModal: false,
						title: "Assign goods - "+invNumber,
						content: windowContent,
						width: 950,
						//height: 570,
						maxWidth: 950,
						maxHeight: reqFrameHt,
						resizable: false,
						onShow: function(wnd) {
							       if(windowElem) windowElem.close();
							       windowElem  = wnd;
								   document.getElementsByClassName("minimizeImg window_icon_button no-draggable")[0].style.display="none";
								   document.getElementsByClassName("maximizeImg window_icon_button no-draggable")[0].style.display="none";
								  // document.getElementsByClassName("window_frame ui-widget-content no-draggable no-resizable ")[0].style.overflow="hidden";
								   var mainDiv= document.getElementById("div_editInvoice");
								   var divContent="<table id='invEdit_tbl' align='center' style='width:98%;border-collapse:collapse;'>";
								   divContent += "<tbody id='invEdit_tbody'><tr style='background-color:#555555;color:#FFFFFF;height:40px;'><th style='width:5%;vertical-align:middle;border-top-left-radius:5px;-moz-border-top-left-radius:5px;text-align:center;'>Sl.No.</th><th style='width:22%;text-align:center;vertical-align:middle;'>Product</th><th style='width:10%;text-align:center;vertical-align:middle;'>Total quantity</th><th style='width:21%;text-align:center;vertical-align:middle;'>Batch/Qty</th><th style='width:21%;text-align:center;vertical-align:middle;'>Batch/Qty</th><th style='width:21%;text-align:center;vertical-align:middle;border-top-right-radius:5px;-moz-border-top-right-radius:5px;'>Batch/Qty</th></tr></tbody></table>";
								   mainDiv.innerHTML=divContent;
								   var invDtTbody = document.getElementById("invEdit_tbody");
								   var invDtlData=doc["invoice_detail"];
								   for(var i=0;i<invDtlData.length;i++)
								   {
									  var colrIndex = i%2;
                                      var bgColor ="";
									  if(colrIndex == 0) bgColor = "#FFFFFF";
									  else bgColor="#E2E4FF";
									  var invDtl_id = invDtlData[i]["id"];
                                      var prodIdName = invDtlData[i]["product"];
									  var prodId = prodIdName.split("--")[0];
								      var prodName = prodIdName.split("--")[1];
									  var qnty = invDtlData[i]["quantity"];
									  var slNo = i+1;
                                      var invDtlRow=CreateTR(invDtTbody,"","tr_1_"+invDtl_id);
									  invDtlRow.className = "tr_"+invDtl_id;
									  invDtlRow.style.backgroundColor=bgColor;
                                      var slNo_td = CreateTD(invDtlRow,"","sl_td_"+invDtl_id);
									  slNo_td.innerHTML=slNo+"&nbsp;&nbsp;";
									  $(slNo_td).css({"text-align":"right","vertical-align":"middle"});
                                      var prod_td = CreateTD(invDtlRow,"","prod_td_"+invDtl_id);
									  prod_td.innerHTML="&nbsp;"+prodName;
									  $(prod_td).css({"text-align":"left","vertical-align":"middle"});
									  var qnty_td = CreateTD(invDtlRow,"","qty_td_"+invDtl_id);
									  qnty_td.innerHTML=qnty+"&nbsp;&nbsp;";
									  $(qnty_td).css({"text-align":"right","vertical-align":"middle"});
									  /*****First batch td******/
									  var batch1_td = CreateTD(invDtlRow,"","batch1_td_"+invDtl_id);
									  batch1_td.innerHTML="<input type='hidden'  name='bch_txt1_1_"+invDtl_id+"fillTbl' id='bch_txt1_1_"+invDtl_id+"fillTbl' value='branch' autocomplete=off><input type='hidden' name='bch_txt1_1_"+invDtl_id+"hdn' id='bch_txt1_1_"+invDtl_id+"hdn'/><input type='text' value='2 chars or **' id='bch_txt1_1_"+invDtl_id+"' style='width:120px;margin-top:3%;color:grey;' placeholder='' title='Batch' onkeyup=\"callAjax('smartFill',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=batch&prodId="+prodId+"&brchId="+branchId+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);validateBatch(this);'/>";
                                      batch1_td.innerHTML +="<input type='text' id='qty_1_1_"+invDtl_id+"' style='width:40px;margin-top:3%;margin-left:2%;' onblur='validateBatchNQty(this);'/>";
									  $(batch1_td).css({"text-align":"left"});
                                      /*****Second batch td******/
									  var batch2_td = CreateTD(invDtlRow,"","batch2_td_"+invDtl_id);
									  batch2_td.innerHTML="<input type='hidden'  name='bch_txt1_2_"+invDtl_id+"fillTbl' id='bch_txt1_2_"+invDtl_id+"fillTbl' value='branch' autocomplete=off><input type='hidden' name='bch_txt1_2_"+invDtl_id+"hdn' id='bch_txt1_2_"+invDtl_id+"hdn'/><input type='text' value='2 chars or **' id='bch_txt1_2_"+invDtl_id+"' style='width:120px;margin-top:3%;color:grey;' placeholder='' title='Batch' onkeyup=\"callAjax('smartFill',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=batch&prodId="+prodId+"&brchId="+branchId+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);validateBatch(this);'/>";
									  batch2_td.innerHTML +="<input type='text' id='qty_1_2_"+invDtl_id+"' style='width:40px;margin-top:3%;margin-left:2%;' onblur='validateBatchNQty(this);'/>";
									  $(batch2_td).css({"text-align":"left"});
                                      /*****Third batch td******/
									  var batch3_td = CreateTD(invDtlRow,"","batch3_td_"+invDtl_id);
									  batch3_td.innerHTML="<input type='hidden'  name='bch_txt1_3_"+invDtl_id+"fillTbl' id='bch_txt1_3_"+invDtl_id+"fillTbl' value='branch' autocomplete=off><input type='hidden' name='bch_txt1_3_"+invDtl_id+"hdn' id='bch_txt1_3_"+invDtl_id+"hdn'/><input type='text' value='2 chars or **' id='bch_txt1_3_"+invDtl_id+"' style='width:120px;margin-top:3%;color:grey;' placeholder='' title='Batch' onkeyup=\"callAjax('smartFill',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=batch&prodId="+prodId+"&brchId="+branchId+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);validateBatch(this);'/>";
									  batch3_td.innerHTML +="<input type='text' id='qty_1_3_"+invDtl_id+"' style='width:40px;margin-top:3%;margin-left:2%;' onblur='validateBatchNQty(this);'/>";
									  $(batch3_td).css({"text-align":"left"});

                                      var invDtlRow2=CreateTR(invDtTbody,"","tr_2_"+invDtl_id);
									  invDtlRow2.className = "tr_"+invDtl_id;
									  invDtlRow2.style.backgroundColor=bgColor;
                                      var second_tds = CreateTD(invDtlRow2,"","sl_td_"+invDtl_id);
									  second_tds.setAttribute("colspan","3");
									  second_tds.innerHTML="<input type='hidden' id='prod_id_"+invDtl_id+"' value='"+prodId+"'/><input type='hidden' id='bch_invtQty_"+invDtl_id+"' value='"+qnty+"'/>";
									  for(var j=1;j<4;j++)
									   {
										  var batch_td = CreateTD(invDtlRow2,"","batch2"+j+"_td_"+invDtl_id);
									     batch_td.innerHTML="<input type='hidden'  name='bch_txt2_"+j+"_"+invDtl_id+"fillTbl' id='bch_txt2_"+j+"_"+invDtl_id+"fillTbl' value='branch' autocomplete=off><input type='hidden' name='bch_txt2_"+j+"_"+invDtl_id+"hdn' id='bch_txt2_"+j+"_"+invDtl_id+"hdn'/><input type='text' value='2 chars or **' id='bch_txt2_"+j+"_"+invDtl_id+"' style='width:120px;margin-top:3%;color:grey;' placeholder='' title='Batch' onkeyup=\"callAjax('smartFill',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=batch&prodId="+prodId+"&brchId="+branchId+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);validateBatch(this);'/>";
									     $(batch_td).css({"text-align":"left","width":"20%"});
										 batch_td.innerHTML +="<input type='text' id='qty_2_"+j+"_"+invDtl_id+"' style='width:40px;margin-left:2%;margin-top:3%;' onblur='validateBatchNQty(this);'/>";
										 if(j == 3) batch_td.innerHTML +="<a id='lnk_2_"+invDtl_id+"' style='float: right;font-size: 10px;' href='#' onclick='javascript:moreRows(\""+invDtl_id+"\",\"tr_2_"+invDtl_id+"\",2,\""+prodId+"\","+qnty+",\""+branchId+"\","+i+");'>+ more lines</a>";
									   }
								   }
								   var mainDivHeight=document.getElementById("div_editInvoice").offsetHeight;
								   var windowFrame=document.getElementsByClassName("window_panel  ui-draggable")[0];
								   var windowFrameElem = document.getElementsByClassName("window_frame ui-widget-content no-draggable no-resizable ")[0];
								   var reqdHt = mainDivHeight + 110;
								   windowFrameElem.style.height = reqdHt +"px";
                                   windowFrame.style.height = reqdHt+"px";
								   windowFrame.style.top = "50px";
								   $("#btn_save").button();
								   $("#btn_cancel").button();
								   $("#btn_save").click(function(doc){
                                        saveAssignedGoods(doc,wnd);
								   });
								   $("#btn_cancel").click(function(){
                                        wnd.close();
								   });
								   moreRowsFlag =0;
							   }
					});
				  }
				 else {
					 var errorDiv = document.getElementById("viewErrorDiv");
					 errorDiv.innerHTML="All the line items have already been fully assigned with inventory.";
					 errorDiv.style.display ="block";
                     setTimeout("document.getElementById('viewErrorDiv').innerHTML='';document.getElementById('viewErrorDiv').style.display='none'",10000);
				 }
				},
				error:function()
				 {
					alert("Server Error");
				 }
		   });
}
function moreRows(invDtl_id,row_id,rowNum,prodId,qnty,branchId,blockNum)
{
	 if(rowNum<10){
	 var nextRow = rowNum+1;
	 var colrIndex = blockNum%2;
     var bgColor ="";
	 if(colrIndex == 0) bgColor = "#FFFFFF";
	 else bgColor="#E2E4FF";
	 $("#lnk_"+rowNum+"_"+invDtl_id).remove();
	 var trHTML = "<tr id='tr_"+nextRow+"_"+invDtl_id+"' class='tr_"+invDtl_id+"' style='background-color:"+bgColor+"'><td id='sl_td"+nextRow+"_"+invDtl_id+"' colspan='3'></td>";
	 /*<input type='hidden' id='prod_id_"+invDtl_id+"' value='"+prodId+"'/><input type='hidden' id='bch_invtQty_"+invDtl_id+"' value='"+qnty+"'/>*/
	 for(var j=1;j<4;j++)
	   {
		  trHTML +="<td id='batch"+nextRow+""+j+"_td_"+invDtl_id+"' style='text-align:left;width:20%;'>";
		  trHTML+="<input type='hidden'  name='bch_txt"+nextRow+"_"+j+"_"+invDtl_id+"fillTbl' id='bch_txt"+nextRow+"_"+j+"_"+invDtl_id+"fillTbl' value='branch' autocomplete=off><input type='hidden' name='bch_txt"+nextRow+"_"+j+"_"+invDtl_id+"hdn' id='bch_txt"+nextRow+"_"+j+"_"+invDtl_id+"hdn'/><input type='text' value='2 chars or **' id='bch_txt"+nextRow+"_"+j+"_"+invDtl_id+"' style='width:120px;margin-top:3%;color:grey;' placeholder='' title='Batch' onkeyup=\"callAjax('smartFill',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?pckListName=batch&prodId="+prodId+"&brchId="+branchId+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);validateBatch(this);'/>";
		  trHTML +="<input type='text' id='qty_"+nextRow+"_"+j+"_"+invDtl_id+"' style='width:40px;margin-left:2%;margin-top:3%;' onblur='validateBatchNQty(this);'/>";
		  if(j == 3) trHTML +="<a id='lnk_"+nextRow+"_"+invDtl_id+"' style='float: right;font-size: 10px;' href='#' onclick='javascript:moreRows(\""+invDtl_id+"\",\"tr_"+nextRow+"_"+invDtl_id+"\","+nextRow+",\""+prodId+"\","+qnty+",\""+branchId+"\","+blockNum+");'>+ more lines</a>";
          trHTML +="</td>";
	  }
	      trHTML +="</tr>";
          $("#"+row_id).after(trHTML);
		  if(moreRowsFlag == 0){
		  var windowId = windowElem.getWindowId();
          windowDiv = document.getElementById(windowId);
		  var windDivHt = windowDiv.style.height;windDivHt = windDivHt.replace("px","");
          windDivHt = parseInt(windDivHt)+32;windDivHt=windDivHt+"px";
		  windowDiv.style.height = windDivHt;
		  moreRowsFlag =1;
		  }
	}
    else {
		document.getElementById("error_div").innerHTML ="Maximum 10 rows can be added.";
		 setTimeout("document.getElementById('error_div').innerHTML=''",7000);
		 $("#lnk_"+rowNum+"_"+invDtl_id).remove();
		 return;
	}
}
function saveAssignedGoods(wnd)
{
	var inv_id = invoiceData["invoice_header"];
	var invDtlData=invoiceData["invoice_detail"];
	var postData="";
	for(var i=0;i<invDtlData.length;i++)
	 {
        var invDtl_id = invDtlData[i]["id"];
		var invtQty = document.getElementById("bch_invtQty_"+invDtl_id).value;
		var trElems = document.getElementsByClassName("tr_"+invDtl_id);
		var trsLen = trElems.length;
		var formTotQty = 0;
		if(postData =="") postData =invDtl_id+"#$#";//+invtQty+"#$#";
		else postData += "~)"+invDtl_id+"#$#";//+invtQty+"#$#";
		for(var j=1;j<parseInt(trsLen)+1;j++)
		 { 
			for(var k=1;k<4;k++)
			 {
                var batchTxtId= "bch_txt"+j+"_"+k+"_"+invDtl_id;
			    var qtyTxtId  ="qty_"+j+"_"+k+"_"+invDtl_id;
				if(document.getElementById(batchTxtId).value !="" && document.getElementById(batchTxtId).value !="2 chars or **"&& document.getElementById(qtyTxtId).value !="" && document.getElementById(batchTxtId).value)
				 {
					var batchNum = document.getElementById(batchTxtId).value;
					var qtyNum   = document.getElementById(qtyTxtId).value;
					formTotQty +=parseInt(qtyNum);
                    if(j==1 && k==1)  postData += batchNum+"--"+qtyNum;
					else postData += "$$"+batchNum+"--"+qtyNum;
				 }
				 if(j==parseInt(trsLen) && k== 3) {
					 if(formTotQty < invtQty)
					 {
						 var remQty = invtQty-formTotQty;
						 postData+= "$$--"+remQty;
					 }
				 }
			 }
		 }
	 }
	 //prompt("Data",postData);
	 var url2hit = zcServletPrefix+"/custom/JSON/system/assignGoodsBatch2Invoice.html";
	 var urlData = "header_id="+inv_id+"&paramStr="+postData;
	 $.ajax({
			type: "POST",
			url:url2hit,
			data:urlData,
			beforeSend: function() {
			  $('#loader_Img').show();
			},
			complete: function(){
				$('#loader_Img').hide();
			},
			success: function (doc)
			 {	
				windowElem.close();
				closeCommonPopup("1");
			 }
	       });
}
function validateBatchNQty(qtyElem)
{
	 var qtyTxtId = qtyElem.id;
	 var qtyVal = qtyElem.value;
	 var batchTxtId = qtyTxtId.replace("qty_","bch_txt");
	 var batchVal = document.getElementById(batchTxtId).value;
	 var invDtlId = qtyTxtId.split("_")[3];
	 var totalQty = document.getElementById('bch_invtQty_'+invDtlId).value;
	 var totQty=0;
	 var trElems = document.getElementsByClassName("tr_"+invDtlId);
	 var trsLen = trElems.length;
	 if(qtyVal !="" && (batchVal =="" || batchVal =="2 chars or **"))
	  {
		 document.getElementById("error_div").innerHTML ="Batch number can not be null.";
		 setTimeout("document.getElementById('error_div').innerHTML=''",7000);
         document.getElementById(batchTxtId).focus(); 
		 return false;
	  }
	 for(var j=1;j<parseInt(trsLen)+1;j++)
		 {
			for(var k=1;k<4;k++)
			 {
				var qtyId = "qty_"+j+"_"+k+"_"+invDtlId;
				var qtyNum =0;
				if(document.getElementById(qtyId) && document.getElementById(qtyId).value){ 
					qtyNum=document.getElementById(qtyId).value;
                    qtyNum = parseInt(qtyNum);totQty = totQty+qtyNum;
				}
                if(totQty>totalQty) {
					  document.getElementById("error_div").innerHTML ="Quantity can not be more than the total quantity";
		              setTimeout("document.getElementById('error_div').innerHTML=''",7000);
					  document.getElementById(qtyTxtId).focus();
					  return false;
				  }
			 }
		 }
	var invDtlData=invoiceData["invoice_detail"];
	for(var i=0;i<invDtlData.length;i++)
	{
		var prodNameId = invDtlData[i]["product"];
		var prodName = prodNameId.split("--")[1];
		var prodBrnchInvtDtl = invDtlData[i]["prod_branch_invt_detail"];
		var batchFnd="0";
		for(var m=0;m<prodBrnchInvtDtl.length;m++)
		{
           var batchNum = prodBrnchInvtDtl[m]["batchNumber"];
           var invtryQty = prodBrnchInvtDtl[m]["invtryQty"];
		   invtryQty = parseInt(invtryQty);qtyVal = parseInt(qtyVal);
		   if(batchNum == batchVal && parseInt(invtryQty)<parseInt(qtyVal)) {
			   document.getElementById("error_div").innerHTML ="Only <strong>"+invtryQty+"</strong> of <strong>"+prodName+"</strong> available for the batch "+batchVal+".";
		        setTimeout("document.getElementById('error_div').innerHTML=''",7000);
			   document.getElementById(qtyTxtId).focus();
			   return;
		   }
		}
	}
}
function validateBatch(batchElem)
{
	var batchTxtId = batchElem.id;
	var invDtlId =  batchTxtId.split("_")[3];
	var batchVal = batchElem.value;
	//var rowNum = batchTxtId.split("_")[1];rowNum = rowNum.replace("txt","");
	//var blockNum = batchTxtId.split("_")[2];
	////var qtyTxtId = "qty_"+rowNum+"_"+blockNum+"_"+invDtlId;
	var qtyTxtId = batchTxtId.replace("bch_txt","qty_");
	var invDtlData=invoiceData["invoice_detail"];
	for(var i=0;i<invDtlData.length;i++)
	{
	  var prodBrnchInvtDtl = invDtlData[i]["prod_branch_invt_detail"];
	  var prodBrchInvDtlId = invDtlData[i]["id"];
	  var batchFnd="0";
	  if(invDtlId == prodBrchInvDtlId){
		for(var m=0;m<prodBrnchInvtDtl.length;m++)
		{
           var batchNum = prodBrnchInvtDtl[m]["batchNumber"];
		   if(batchNum == batchVal){
			   if(document.getElementById(qtyTxtId).value!="")document.getElementById(qtyTxtId).value=1;
               document.getElementById(qtyTxtId).focus();
			   return;
		   }
		}
	  }
     }
	 if(batchFnd == "0") {
		       document.getElementById("error_div").innerHTML ="'"+batchVal+"' is not a valid batch number.";
		       setTimeout("document.getElementById('error_div').innerHTML=''",7000);
			   document.getElementById(batchTxtId).focus();
			   batchFnd = "0";
			   return;
		}
}
function billInvoice(contId)
{  
	var url2Hit=zcServletPrefix+"/custom/JSON/add/invoices.json?cont_driven=1&contactId="+contId;
	setUpPageParameters(url2Hit);
	if(windowContView) windowContView.minimize();
	if(parent.windowData) parent.windowData.minimize();
}
//for activity notes view :-govardhan
function notesView(pk,rowName,rowId)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
		
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'Notes View',
			minHeight:120,
		    minWidth:120,	
		    width:"90%",
			height:400,
			closeOnEscape:true,
			beforeclose: function() {putrowClass(rowId);}
		});
 if(rowId)
document.getElementById(rowId).setAttribute("class", "rowSelectedClass");
document.getElementById("commonPopupDiv").innerHTML = "<div align='center' valign='middle'>Loading...</div>";
  var JSONURL=zcServletPrefix+"/custom/mails/viewEmailContent.html?id="+pk;
     $.ajax({
		type: "GET",
			url: JSONURL,
			success: function (data)
			   {
				   document.getElementById("commonPopupDiv").innerHTML = "<table width='100%' align='center' border='0' style='margin-top:5px' cellpadding='3'><tr><td id='notesview'></td></tr></table>";
				    var emailBdyCntntTD=document.getElementById('notesview');
					if(data != "")
					{
						emailBdyCntntTD.innerHTML=data;	
					}
					else
					{
						emailBdyCntntTD.style.textAlign="center";
						emailBdyCntntTD.innerHTML="No data available in notes";
					}
		       }
	 });
		
}
function popupToEdit(pkId,colmToRetrieve,colmToUpdate,pkColm,entityName,menuDesc)
{
	document.getElementById("commonPopupDiv").innerHTML = "";
	var JSONURL=zcServletPrefix+"/custom/JSON/admin/popupToEdit.htm?pkId="+pkId+"&colmToRetrieve="+colmToRetrieve+"&colmToUpdate="+colmToUpdate+"&entityName="+entityName+"&pkColm="+pkColm;
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		closeOnEscape:true,
		title:menuDesc,
		minHeight:120,
		minWidth:120,	
		width:380	
	});
	$.ajax({
		type: "GET",
		async: false,		
		dataType: "json",
		url: JSONURL,
		success: function (doc)
		{
			 writeElemsForPopUp(doc,pkId,pkColm,entityName);			
		}
	});
}

function writeElemsForPopUp(doc,pkId,pkColm,entityName)
{
	var dispCols=doc.DisplayColumns;
	var dispData=doc.data.split("~)");
	var updtCols=doc.cols2Update;
	var mandFields="";

	var convertDivContent = "<div class='ui-widget' id='popUperrorDiv' style='display:none'><div id='popUperrorDivContent' class='ui-state-highlightLight ui-corner-all' style='padding: 5px'></div></div><table align='center' border='0' style='margin-top:5px' cellpadding='3' width='100%'>";
	for(i=0;i<dispCols.length;i++)
	{
		if(dispCols[i].RefersTo)
		{
			var urlForFk=zcServletPrefix+"/custom/JSON/admin/getValueForForeignKey.htm?entity="+dispCols[i].RefersTo+"&pkVal="+dispData[i];
				$.ajax({
				type: "GET",
				async: false,		
				dataType: "json",
				url: urlForFk,
				success: function (data)
				{	
					var actColValObj=data['getValues'];
					var actColVal=actColValObj[0].data;
					var actCol=actColVal.split('~)');
					convertDivContent += "<tr><td width='40%' class='flexigrid' align='right'><b>"+dispCols[i].Label+"</b></td><td class='flexigrid'>"+actCol[0]+"</td></tr>";
				}
				});
		}
		else
			convertDivContent += "<tr><td width='40%' class='flexigrid' align='right'><b>"+dispCols[i].Label+"</b></td><td class='flexigrid'>"+dispData[i]+"</td></tr>"; 
	}

	for(i=0;i<updtCols.length;i++)
	{
		var nullable=updtCols[i].Nullable;
		if(nullable=="0"){nullableFont="<font color='red'>*</font>";if(mandFields)mandFields+=",field"+i+"--"+updtCols[i].Label;else mandFields="field"+i+"--"+updtCols[i].Label;}else nullableFont="";		
		var DefaultValue=updtCols[i].DefaultValue != "" ? updtCols[i].DefaultValue: ""; 
		switch(updtCols[i].FieldType)
		{
			case "dropDownList":
				convertDivContent += "<tr><td width='40%' class='flexigrid' align='right'><b>"+updtCols[i].Label+"</b>"+nullableFont+"</td><td  class='flexigrid'><select id='field"+i+"'>";
				var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/dropDownDataForView.htm?entity="+updtCols[i].RefersTo;
				$.ajax(
				{
					type: "GET",
					url:url2Hit,
					dataType: "json",
					async:false,
					success: function (pckDoc)
					{
						var dataArray=pckDoc['PickListItems'].listData;		
						if(nullable!="0")
							convertDivContent += "<option value=''>&lt;None&gt;</option>";
						for(var i=0; i<dataArray.length; i++)
						{										
							val=dataArray[i].columnData.split('~)');
							if(val[0]==DefaultValue)
							convertDivContent += "<option value='"+val[0]+"' selected>"+val[1]+"</option>";
							else
							convertDivContent += "<option value='"+val[0]+"'>"+val[1]+"</option>";							
						}
					}
				});						
				convertDivContent += "</select></td></tr>";
			break;
			case "smartSuggest":
					var picklistURL=zcServletPrefix+updtCols[i].PickList;
					var smartSuggestURL=picklistURL.replace(".htm",".xml");
					var fldVal="2 chars or **";
					convertDivContent +="<tr><td width='40%' class='flexigrid' align='right'><b>"+updtCols[i].Label+"</b>"+nullableFont+"</td><td><input type='hidden'  name='field"+i+"' id='field"+i+"'><input type='text' id='field"+i+"txt' name='field"+i+"txt' value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='inputGrayTextClass' style=\"width:80%\"><a onclick=\"populatePicklist('"+updtCols[i].RefersTo+"','','field"+i+"txt','','','','"+picklistURL+"');\" id='field"+i+"pck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a></td></tr>";
			break;
			case "Date":
			case "dateOnly":
					var elemId='field'+i;
					convertDivContent +="<tr><td width='40%' class='flexigrid' align='right'><b>"+updtCols[i].Label+"</b>"+nullableFont+"</td><td><table cellpadding='0' cellspacing='0'><tr><td><input id='"+elemId+"' class='inputFieldClass' onblur=\"changeDate('"+elemId+"');\" size=12 maxlength=12 style='width:80px' value=''/></td><td><img src='/atCRM/images/calendar.gif' id='"+elemId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td></tr></table></td></tr>";				
					
			break;
			default:
				convertDivContent += "<tr><td width='40%' class='flexigrid' align='right'><b>"+updtCols[i].Label+"</b>"+nullableFont+"</td><td  class='flexigrid'><input id='field"+i+"' type="+updtCols[i].FieldType+" value="+DefaultValue+"></td></tr>"; 
			break;
		}
		convertDivContent += "<input id='field"+i+"-Column' type='hidden' value="+updtCols[i].Column+">"; 
		convertDivContent += "<input id='field"+i+"-type' type='hidden' value="+updtCols[i].FieldType+">"; 
	}
	convertDivContent += "<tr><td class='flexigrid' align='center' colspan='3'><input type=button value=Update style='width:55px' class='greenButton' onclick=\"updatePopupFields("+pkId+",'"+pkColm+"','"+entityName+"','"+updtCols.length+"','"+mandFields+"')\"></td></tr>";
	convertDivContent += "</table>";
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;

	for(i=0;i<updtCols.length;i++)
	{
		if(updtCols[i].FieldType=="Date"||updtCols[i].FieldType=="dateOnly")
			new Calendar({
				  inputField: 'field'+i,
				  dateFormat: "%d/%m/%Y", 
				  trigger: 'field'+i+'_cal',
				  bottomBar: true,
				  fdow:0,
				  min: 19000101,
				  max: 29991231,
				  align: "BL",
				  onSelect: function() {
					 this.hide();
				  }
			});	
	}
}
function updatePopupFields(pkId,pkColm,entityName,len,mandFields)
{	
	updateOrNot=true;
	if(mandFields)
	{
		var madatoryFlds=mandFields.split(',');
		var msg='';

		for(var x=0; x<madatoryFlds.length;x++)
		{
			fldName=madatoryFlds[x].split('--')[0];
			fldLabel=madatoryFlds[x].split('--')[1];
			if(document.getElementById(fldName).value=="")
			{
				if(document.getElementById(fldName+"txt"))
					if(msg)msg+='<br>Please select '+fldLabel;else msg+='Please select '+fldLabel;
				else
					if(msg)msg+='<br>Please enter '+fldLabel;else msg+='Please enter '+fldLabel;
				updateOrNot=false;
			}
		}
	}
	for(i=0;i<len;i++)
	{
		var fieldValue=document.getElementById("field"+i).value;
		var colName=document.getElementById("field"+i+"-Column").value;
		var type=document.getElementById("field"+i+"-type").value;

		if(updateOrNot==true)
		{
			var strVal="";
			if(colName.indexOf("udef_fkey")!='-1')strVal="&strcol=str_"+colName+"&txtFldVal="+document.getElementById("field"+i+"txt").value;

			var updateUrl=zcServletPrefix+"/custom/JSON/system/updateOnClick.html?colVal="+fieldValue+"&colName="+colName+"&tblName="+entityName+"&pkVal="+pkId+"&pkCol="+pkColm+"&type="+type+strVal;
			$.ajax({
			type: "POST",
			url: updateUrl
			});			
			closeCommonPopup(1);
		}
		else
		{
			document.getElementById('popUperrorDiv').style.display='block';
			document.getElementById('popUperrorDivContent').innerHTML='<table width="100%"><tr><td width="25px" valign="middle" align="center"><span class="ui-iconBlack ui-icon-alert" style="margin-right: 5px;float: left;"></span></td><td>'+msg+'</td></tr></table>';
		}
	}
}

function auditTransHistory(pkVal,rowName,rowId,entity)
{
	if(entity)
	var tableName =  entity;
	else
	var tableName = rowName.split('-')[0];
	
	 var JSONURL=zcServletPrefix+"/custom/JSON/system/auditTranscnDetails.htm?entity="+tableName+"&pk="+pkVal;
   document.getElementById("commonPopupDiv").innerHTML = "";
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,
			title:'History of '+rowName,
			minHeight:120,
			minWidth:550,	
			width:580,
			beforeclose: function() {putrowClass(rowId);}
		});
		if(rowId)
		document.getElementById(rowId).setAttribute("class", "rowSelectedClass");

		$.ajax({
		type: "GET",
			url: JSONURL,
			dataType: "json",
			success: function (doc)
			{
				var allAuditTranscns = doc["allAuditTranscns"];
				var allAuditTransLength = allAuditTranscns.length;		
				if(allAuditTransLength>=1)
				{
				var convertDivContent = "<table cellspacing='1'  cellpadding='2' border='0' class='TblBdy' width='500' align='center' style='vertical-align:middle;background-color:#dddddd;margin-top:5px; border:0px solid red;' >";
		
		          convertDivContent += "<tr valign='middle' class='TblBdy' cellspacing='3'  border='1'><th border='1' width='1' cellspacing='3'>#</th><th border='1' width='75' cellspacing='3' >Field Name</th><th border='1' width='40' cellspacing='3' >Change By User</th><th border='1' width='30' cellspacing='3'>Change Date</th><th border='1' width='30' cellspacing='3'>Past Value</th><th border='1' width='30' cellspacing='3'>Remarks</th></tr>"; 
				 
						for(k=0,l=0;k<allAuditTransLength;k++,l++)
						{	
							aTId = allAuditTranscns[l]["audTransId"];					
							auditMasterName = allAuditTranscns[l]["auditMaster"];				
							changeByUsr = allAuditTranscns[l]["changeByUsr"];	
							changeDate = allAuditTranscns[l]["changeDate"];	
							pastValue = allAuditTranscns[l]["pastValue"];	
							remarks = allAuditTranscns[l]["remarks"];	
							var count = 1;
							count = count+k;
							
							if (auditMasterName!=""){ convertDivContent += "<tr valign='middle' border='1' cellspacing='3' cellpadding='3'><td valign='middle' border='1' width='20' class='TblBdy' align='center' cellspacing='3'  cellpadding='3'>"+count+"</td><td valign='middle' border='1' cellspacing='3'  cellpadding='3' width='75'  class='TblBdy' style='border:0px solid red' align='left'>" + auditMasterName + "</td><td valign='middle' border='1' width='40'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>" + changeByUsr + "</td><td valign='middle' border='1' width='50'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>" + changeDate + "</td><td valign='middle' border='1' width='30'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>"+pastValue+"</td><td valign='middle' border='1' width='30'  cellpadding='3' class='TblBdy' style='border:0px solid red' align='left'>"+remarks+"</td></tr>"; }
						}
				convertDivContent += "</table></center><br/><span style='float:right;margin-right:240px;'><input style='width:70px;margin-top:10px;' onclick=\"javascript:closePopup()\" class='greenButton' type='button' value='OK'/></span>";
				}
				else
				{
					var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
						convertDivContent += "<tr><td class='flexigrid'><br/><br/><center><b>There is no audit transactions history for this entity.</b></center><br/><br/></td></tr>"; 
						convertDivContent += "</table>";
						document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
						setTimeout("closeCommonPopup(1)",3000);
				}
               document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
			});	
}

function printReportForLC(entt,contId,pk)
{
	if(entt)
		var tableName = entt;
	else
	var tableName = rowName.split('-')[0];
	url=zcServletPrefix+'/custom/LZ/Reports/NewRequirements/showReceipt.html?contId='+contId+'&ordId='+pk; //+'&prodId='+product;
	window.open(url,"PrintWindow",'top=50,left=50,height=500,width=600,resizable=yes,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes'); 
}

function printReportForLCPDC(pk,rowName,rowId,entity)
{
	 var urltxt=zcServletPrefix+'/custom/JSON/system/getContWithOrder.htm?ordId='+pk;
	 var contId='';
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{ 
				var contactId = doc["Contact_id"];
				if(contactId!='')
				{
					url=zcServletPrefix+'/custom/LZ/Reports/NewRequirements/showReceiptPDC.html?contId='+contactId+'&ordId='+pk;
					window.open(url,"PrintWindow",'top=50,left=50,height=500,width=600,resizable=yes,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes'); 
				}
			}
	});
}

function printReportForLCECS(pk,rowName,rowId,entity)
{
	 var urltxt=zcServletPrefix+'/custom/JSON/system/getContWithOrder.htm?ordId='+pk;
	 var contId='';
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{ 
				var contactId = doc["Contact_id"];
				if(contactId!='')
				{
					url=zcServletPrefix+'/custom/LZ/Reports/NewRequirements/showReceiptECS.html?contId='+contactId+'&ordId='+pk;
					window.open(url,"PrintWindow",'top=50,left=50,height=500,width=600,resizable=yes,location=no,menubar=no,status=no,toolbar=no,scrollbars=yes'); 
				}
			}
	});
}

function printCpns(pk,flg)
{
	 var urltxt="/atCRM/custom/coupons/getTemplatesForCoupons.htm";
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{  
				
				var allListItems = doc["templateLists"];	
				var allInfoListItems=allListItems["joinAllLists"];
				
				var temp = new Array();				
				temp = allInfoListItems.split('~');	
				temp.splice(0,0,"None--");    // This is to insert none option to the array
				var templateList=document.createElement('select');	
				templateList.setAttribute("id","templateList");
				templateList.setAttribute("width","120");
 				templateList.className="inputFieldClass";
				templateList.setAttribute("onchange","javascript:updateSelect("+flg+","+pk+")");
				document.getElementById('tempListTd').appendChild(templateList);
				var len=temp.length;
				for(i=0; i<temp.length; i++)
				{						 
					 var relatedTemp = temp[i].split('--');	 						
					 var relatedId=relatedTemp[1];						
					 var relatedTempList=relatedTemp[0];					 
					 if(relatedTempList)
					 {
					   templateList[i]=new Option(relatedTempList,relatedId);
					   templateList[i].selected = true
					 }
					 else                              
						 templateList[i]=new Option(relatedTempList,relatedId);
					 
				 }
				 templateList[0].selected = true;	
				}
			
		});
	document.getElementById("commonPopupDiv").innerHTML = "";
	
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Print Coupns',
		minHeight:110,
		minWidth:475,	
		width:475,
		closeOnEscape:true,
		draggable:true,
		beforeclose: function() {putrowClass();}
	});
	if(flg=='1')
	{
	$('#commonPopupDiv').dialog({ title:'Print Coupons'});
	}
	else if(flg=='0')
	{
		$('#commonPopupDiv').dialog({ title:'Reprint Coupons'});
	}
	
	convertDivContent="<table style='margin-top:18px; border:0px solid red;'  width='100%' align='center'><tr><td width='100%' colspan='3' align='center'><div id='errorDiv' style='color:red;display:none'>All the coupons already printed</div></td></tr><tr><td width='32%' align='left' style='font-size:14px;font-family:Tahoma'><b>Template Name</b>&nbsp;&nbsp;&nbsp;&nbsp;:</td><td width='40%' id='tempListTd' align='left'></td><td width='28%' align='center'><div id='printPreview' style='position:relative;left:15px;'><a id='linkPre' title='click here to see preview'><font size='2px' color='blue'><u>Print Preview</u></font></a></div></td></tr>";

    if(flg=='0')
	{
        convertDivContent+="<tr><td colspan='3' align='left' style='font-family:tahoma;'><label style='font-weight:bold;font-size:14px;'>Coupons Created</label> : From&nbsp;<input style='width:90px;' type='text'  id='date_from'/><img src='/atCRM/images/calendar.gif' id='cal_img1'/>&nbsp;&nbsp;To&nbsp;<input style='width:90px;' type='text'  id='date_to'/><img src='/atCRM/images/calendar.gif' id='cal_img2'/></td></tr>"
	}
	convertDivContent=convertDivContent+"<tr><td width='72%' colspan='2'></td><td width='28%' align='center'><input style='width:80px;margin-top:15px;height:28px' type='button'  id='printButton' name='printButton'></td></tr></table>";
	
	document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
	document.getElementById("tempListTd").focus();
	if(flg=='0')
	{
	               new Calendar({
							  inputField: 'date_from',
							  dateFormat: "%d/%m/%Y", 
							  trigger: "cal_img1",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();
							  }
						});
			      new Calendar({
							  inputField: 'date_to',
							  dateFormat: "%d/%m/%Y", 
							  trigger: "cal_img2",
							  bottomBar: true,
							  fdow:0,
							  min: 19000101,
							  max: 29991231,
							  align: "BL",
							  onSelect: function() {this.hide();
							  }
						});
	}
	$("#printButton").button({
			   label:'Print'
			});
    $("#printButton").attr("onclick","javascript:alert('Please select the template');");
	$("#linkPre").attr("href","javascript:alert('Please select the template');");
}

function updateSelect(flg,pk)
{
	var templateId=document.getElementById("templateList").value;
	if(flg=='1')
		{
		  $("#printButton").attr("onclick","javascript:printFrmList("+pk+","+templateId+")");
		  $("#linkPre").attr("href","javascript:showPreview("+pk+","+templateId+",0)");
		}
		else if(flg=='0')
		{
			$("#printButton").attr("onclick","javascript:rePrintAll("+pk+","+templateId+")");
			$("#linkPre").attr("href","javascript:showReprintPreview("+pk+","+templateId+",1)");
		}
}

function showPreview(planId,templId,reprint)
	{
	var urltxt="/atCRM/custom/coupons/getPrintDateNullCoupons.htm?planId="+planId;
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{
                var CountMain = doc["couponCount"];	
				var Count=CountMain["count"];
				if(Count!=0)
				{
				  if(templId!='')
					{
					document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog('open');
					$('#commonPopupDiv').dialog({
								closeOnEscape:true,
								autoOpen:true,
								modal: true,
								position:'top',
								title:'Print Preview',
								minHeight:500,
								minWidth:350,
								width:850,
								draggable:true,
								beforeclose: function() {putrowClass();}
							});
							var iframeSrc=zcServletPrefix+'/custom/coupons/couponTemplateXpander.html?planId='+planId+'&tempId='+templId+'&print=0&reprint='+reprint;
							var convertDivContent="<iframe name='template' id='template' valign='top' frameborder='0' src="+iframeSrc+" width='100%' height='500px'></iframe>";
							document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
							//setTimeout("closeAlertPrintPreview()",100000);
						}
						else
					{
					   alert("Please select template.");
					}
				}
					else
				{
					document.getElementById("errorDiv").style.display="block";
				}
			}
	});
}

function showReprintPreview(planId,templId,reprint)
	{
	    var fromDate=document.getElementById("date_from").value;
	    var toDate=document.getElementById("date_to").value;
			  if(templId!=''&fromDate!=''&toDate!='')
					{
					document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog('open');
					$('#commonPopupDiv').dialog({
								closeOnEscape:true,
								autoOpen:true,
								modal: true,
								position:'top',
								title:'Print Preview',
								minHeight:500,
								minWidth:350,
								width:850,
								draggable:true,
								beforeclose: function() {putrowClass();}
							});
							var iframeSrc=zcServletPrefix+'/custom/coupons/couponTemplateXpander.html?planId='+planId+'&tempId='+templId+'&print=0&reprint='+reprint+'&fromDate='+fromDate+'&toDate='+toDate;
							var convertDivContent="<iframe name='template' id='template' valign='top' frameborder='0' src="+iframeSrc+" width='100%' height='500px'></iframe>";
							document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
							//setTimeout("closeAlertPrintPreview()",100000);
						}
						else if(templId=='')
						{
						   alert("Please select template.");
						}
						else
						{
							alert("Please select the date.");
						}
}


function printFrmList(planId,templId)
{	
	 var urltxt="/atCRM/custom/coupons/getPrintDateNullCoupons.htm?planId="+planId;
	$.ajax({
			type: "GET",		
			url:urltxt,
			dataType: "json",
			success: function (doc)
			{
                var CountMain = doc["couponCount"];	
				var Count=CountMain["count"];
				if(Count!=0)
				{
				if(templId!='')
				{ 
					var printPage=zcServletPrefix+'/custom/coupons/couponTemplateXpander.html?planId='+planId+'&tempId='+templId+'&print=1&reprint=0';
					window.open(printPage);
					closePrintBox();
				}
				}
				else
				{
					document.getElementById("errorDiv").style.display="block";
				}
			}
	});
}

function rePrintAll(planId,templId)
{	
	var fromDate=document.getElementById("date_from").value;
	var toDate=document.getElementById("date_to").value;
	if(templId!=''&fromDate!=''&toDate!='')
	{
		var printPage=zcServletPrefix+'/custom/coupons/couponTemplateXpander.html?planId='+planId+'&tempId='+templId+'&print=1&reprint=1&fromDate='+fromDate+'&toDate='+toDate;
		window.open(printPage);
	    closePrintBox();
	}
	else if(templId=='')
	{
		alert("Please select the template");
	}
	else
	{
		alert("Please select the dates");
	}
}
function closePrintBox(){
	$("#commonPopupDiv").dialog('close');
}


function printQuote(quoteHeaderId)
{
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Templates',
		minHeight:100,
		minWidth:200,	
		width:450,
		closeOnEscape:true
	});
	var urlToHit=zcServletPrefix+'/custom/Quote/getQuoteTemplateList.htm?headerId='+quoteHeaderId+'&folder=Quotes';
	$.ajax({
		type: "GET",
		url:urlToHit,
		dataType: "json",
		success: function (doc)
		{
			var qutHeaderId=doc.quoteHeaderId;
			var printTmplts="<div align='center' style='margin-top: 10px;margin-bottom: 10px;'><div>Please select one of the templates from the dropdown to print your quote.<br /><br /></div><span style='margin-top:20px;margin-bottom:20px;'>Please select the print template: ";
			printTmplts+="<select name='template' id='template' onchange=\"getQuoteTemplateFile(this.value,'"+qutHeaderId+"')\">";
			printTmplts+="<option value=''>Select Template</option>";
			var quoteTemplts=doc.quoteFileNames;
			for (tmpltCntr=0;tmpltCntr<quoteTemplts.length;tmpltCntr++)
			{
				printTmplts+="<option value='"+quoteTemplts[tmpltCntr].value+"'>"+quoteTemplts[tmpltCntr].text+"</option>";
			}
			printTmplts+="</select></span></div>";
			document.getElementById('commonPopupDiv').innerHTML=printTmplts;
		}
	});
}

function getQuoteTemplateFile(tmpltId,quoteHeaderId)
{
	if(tmpltId)
	{
		$('#commonPopupDiv').dialog('close');
		var url = zcServletPrefix+'/custom/Quote/templateExpanderForQuote.html?tmpltId='+tmpltId+'&headerId='+quoteHeaderId+'&prefsName='+tmpltId;
		window.open(url,'welcome','width=850,height=650,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes');
	}
}


function reloadList()
{
	setUpPageParameters(zcServletPrefix+'/custom/JSON/list/leadView.htm?',entityDiv,'','','','true');
}




//** Mass Functionality related functions starts here*//// -- By Vinutha

//This Function lists the columns for a selected entity
function massUpdateData(entity)
{
	if(document.getElementById('filter-clipBoard').value)
	{
		
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			width: 350,			
			title:'Mass Update',	
			closeOnEscape:true
		});
		
		if(entityName4Filter=="Lead")var ent="Opportunity"; else ent=entityName4Filter;
		$.ajax({
		type: "GET",
		async: false,	
		url: zcServletPrefix+"/custom/JSON/admin/listEnttColumn4Entity.html?entity="+ent,
		success: function (data)
		{
			document.getElementById("commonPopupDiv").innerHTML = data; 
		}
		});	
	}
	else
		alert("Select at least one record");
}

//This function is to retrieve field display type for the selected column to update.
function writeFieldForMassUpdate(enttCol)
{
	if(enttCol.value)
	{
		var w = enttCol.selectedIndex;
		var selected_text = enttCol.options[w].text;
		if(entityName4Filter=="Lead")var ent="Opportunity"; else ent=entityName4Filter;

		$.ajax({
		type: "GET",
		async: false,		
		dataType: "json",
		url: zcServletPrefix+"/custom/JSON/admin/getEnttColumnDetails.htm?entity="+ent+"&column="+enttCol.value,
		success: function (doc)
		{
			var formField=createFormFieldonPopUp(doc.FieldType,doc.Label,doc.RefersTo,doc.PickList)
			document.getElementById("updationDiv").innerHTML = "<table style='margin-top:5px;width:100%' cellpadding='3'><tr><td width='50%'>Enter Value for "+selected_text+"</td>"+formField+"</tr><tr><td colspan='2' align='center' style='padding-top:10px'><input type='button' value='Mass Update' class='bigButton' onclick='doMassUpdate(\""+ent+"\",\""+document.getElementById('filter-clipBoard').value+"\",\""+enttCol.value+"\",\""+selected_text+"\",\""+doc.FieldType+"\")'/></td></tr></table>"; 
			if(doc.FieldType=="Date"||doc.FieldType=="dateOnly")
			{
				new Calendar({
					  inputField: 'massUpdateFld_Dat',
					  dateFormat: "%d/%m/%Y", 
					  trigger: 'massUpdateFld_cal',
					  bottomBar: true,
					  fdow:0,
					  min: 19000101,
					  max: 29991231,
					  align: "BL",
					  onSelect: function() {
						  document.getElementById('massUpdateFld').value=document.getElementById('massUpdateFld_Dat').value + " 00:00:00";
						 this.hide();
					  }
				});	
			}
		}
		});
	}
	else
	{
		document.getElementById("updationDiv").innerHTML = "&nbsp;";
	}
}

//This function is to create Form Field for the selected column to update.
function createFormFieldonPopUp(FieldType,Label,RefersTo,PickList)
{
//3/8/2013 Vadiraj - If a lookup custom field is created, value for field type will be Fkey:<Entity name>. If the field tpe is Fkey, I will treat it as dropDownList

	if (FieldType.index('Fkey')>-1)
	{
		FieldType = "dropDownList";
	}
//3/8/2013

	switch(FieldType)
	{
		case "dropDownList":
			var convertDivContent = "<td class='flexigrid'><select id='massUpdateFld' class='selectbox' width='50%'>";
			var url2Hit=zcServletPrefix+"/custom/JSON/smartSuggest/dropDownDataForView.htm?entity="+RefersTo;
			$.ajax(
			{
				type: "GET",
				url:url2Hit,
				dataType: "json",
				async:false,
				success: function (pckDoc)
				{
					var dataArray=pckDoc['PickListItems'].listData;		
					for(var i=0; i<dataArray.length; i++)
					{										
						val=dataArray[i].columnData.split('~)');
						convertDivContent += "<option value='"+val[0]+"'>"+val[1]+"</option>";							
					}
				}
			});						
			convertDivContent += "</select></td>";
		break;
		case "smartSuggest":
				var picklistURL=zcServletPrefix+PickList;
				var smartSuggestURL=picklistURL.replace(".htm",".xml");
				var fldVal="2 chars or **";
				var convertDivContent ="<td width='50%'><input type='hidden'  name='massUpdateFld' id='massUpdateFld'><input type='text' id='massUpdateFldtxt' name='massUpdateFldtxt' value='"+fldVal+"' onkeyup=\"callAjax('smartSuggestDiv',this,event,'"+smartSuggestURL+"',this.value,'','');\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='selectbox' style=\"width:80%\"><a onclick=\"populatePicklist('"+RefersTo+"','','massUpdateFldtxt','','','','"+picklistURL+"');\" id='massUpdateFldpck'><img style=\"cursor:pointer;margin-left:4px;\" src='/atCRM/images/JSON/picklist.png'></a></td>";
		break;
		case "Date":
		case "dateOnly":
				var convertDivContent ="<td width='50%'><table cellpadding='0' cellspacing='0'><tr><td><input type='hidden'  name='massUpdateFld' id='massUpdateFld'><input id='massUpdateFld_Dat' class='inputFieldClass' onblur=\"changeDate('massUpdateFld_Dat');\" size=12 maxlength=12 style='width:80px' class='selectbox'/></td><td><img src='/atCRM/images/calendar.gif' id='massUpdateFld_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/></td></tr></table></td>";	
				
				
		break;
		default:
			var convertDivContent = "<td class='flexigrid' width='50%'><input id='massUpdateFld' type='text' class='selectbox'></td>"; 
		break;
	}
	return convertDivContent;
}

//This function is to create Form Field for the selected column to update.
function doMassUpdate(entity,pkcsv,column,label,columnType)
{
	if(document.getElementById('massUpdateFld').value)
	{
		var lastComma=pkcsv.lastIndexOf(",");
		if(lastComma=(pkcsv.length-1))pkcsv=pkcsv.substring(0,lastComma);
		
		$.ajax({
		type: "GET",
		async: false,		
		url: zcServletPrefix+"/custom/JSON/admin/massUpdate.html?entity="+entity+"&pkcsv="+pkcsv+"&column="+column+"&value="+document.getElementById('massUpdateFld').value+"&columnType="+columnType
		});
		//alert("Completed mass update");
		closeCommonPopup(1);
		showListPage();
	}
	else
		alert('Please enter value for '+label);
}

//This function is to Mass insert selected data, based on the Saved Query passed
function massInsertData(query,pk)
{
	pkcsv=document.getElementById('filter-clipBoard').value;
	var lastComma=pkcsv.lastIndexOf(",");
	if(lastComma=(pkcsv.length-1))pkcsv=pkcsv.substring(0,lastComma);

	if(pkcsv)
	{
		var queryFnc=pageHeading.replace("Mass ","");
		queryFnc=queryFnc.replace("Send","");
		var templateId="";
		if(document.getElementById('massFncTmplId')){if(document.getElementById('massFncTmplId').value=="") {alert("Select template for "+queryFnc);return false;}else templateId="&templateId="+document.getElementById('massFncTmplId').value;}
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			width: 300,			
			title:pageHeading,	
			closeOnEscape:true
		});
		document.getElementById("commonPopupDiv").innerHTML = "<div class='HeadingVariable' style='text-align:center;padding-top:20px'><img src='/atCRM/images/JSON/loading.gif'></br>Processing...</div>";
		var pkArr=pkcsv.split(',');	
		$.ajax({
			type: "GET",
			async: false,	
			dataType: "json",
			url: zcServletPrefix+"/custom/JSON/admin/massInsert.html?queryName="+query+"&pk="+pk+"&pkCSV="+pkcsv+"&role="+pageHeading+templateId,
			success: function (data)
			{
				var totalCount=parseInt(pkArr.length);
				var countInserted=parseInt(data.countInserted);
				var rowRejected=totalCount-countInserted;
				
				if(document.getElementById('massFncTmplId'))
				{
					document.getElementById("commonPopupDiv").innerHTML = "<div class='HeadingVariable' style='text-align:center;padding-top:20px'>Your "+queryFnc+" has been sent out to "+countInserted+" people.</div>";
				}
				else
				{
					if(countInserted==0)var addText="No record(s) added";else var addText=countInserted+" record(s) added";
					if(rowRejected==0)var rejText="No duplicate record(s) found.";else var rejText=rowRejected+" duplicate record(s) rejected.";
					document.getElementById("commonPopupDiv").innerHTML = "<div class='HeadingVariable' style='text-align:center;padding-top:20px'>"+addText+", "+rejText+"</br></div>";
				}
				setTimeout("closeCommonPopup()",1000);
				showListPage();
			}
		});
	}
	else
		alert("Select at least one record");
}

//This function is to mass deactivate selected records for a given entity
function massDeactivate()
{
	if(document.getElementById('filter-clipBoard').value)
	{
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			width: 350,			
			title:'Mass Deactivate',	
			closeOnEscape:true
		});
		
		if(entityName4Filter=="Lead")var ent="Opportunity"; else ent=entityName4Filter;
		pkcsv=document.getElementById('filter-clipBoard').value;
		var lastComma=pkcsv.lastIndexOf(",");
		if(lastComma=(pkcsv.length-1))pkcsv=pkcsv.substring(0,lastComma);
		var countOfPk=pkcsv.split(',').length;

		document.getElementById("commonPopupDiv").innerHTML = "<div class='HeadingVariable' style='text-align:center;padding-top:20px'><img src='/atCRM/images/JSON/loading.gif'></br>Deactivating "+countOfPk+" "+entityName4Filter+"(s) ...</div>";

		$.ajax({
		type: "GET",
		async: false,	
		url: zcServletPrefix+"/custom/JSON/admin/massDeactivate.html?entity="+ent+"&pkCSV="+pkcsv,
		success: function ()
		{
			closeCommonPopup(1);
			showListPage();
			//document.getElementById("commonPopupDiv").innerHTML = data; 
		}
		});	
	}
	else
		alert("Select at least one record");
}

//This function is to retrieve complete data of selected records to show for merge.
function mergeRecords()
{
	if(document.getElementById('filter-clipBoard').value)
	{
		if(entityName4Filter=="Lead")var ent="Opportunity"; else ent=entityName4Filter;
		pkcsv=document.getElementById('filter-clipBoard').value;
		var lastComma=pkcsv.lastIndexOf(",");
		if(lastComma=(pkcsv.length-1))pkcsv=pkcsv.substring(0,lastComma);
		pkcsv=pkcsv.split(',');
		if(pkcsv.length>5||pkcsv.length<2){alert("Atleast 2 and a Maximum of 5 records can be merged");return false;}	

		var width2use=getScreenSize('width')-100;
		var height2use=getScreenSize('height')-100;
		$('#commonPopupDiv').dialog({
			autoOpen:true,
			modal: true,			
			width: width2use,			
			height: height2use,			
			title:'Merge Records',	
			closeOnEscape:false
		});
		var url2use=zcServletPrefix+"/custom/JSON/admin/records4merge.html?entity="+ent+"&pkCSV="+pkcsv;
		document.getElementById("commonPopupDiv").innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='"+url2use+"' style='overflow:hidden;' seamless='seamless' scrolling='no'></iframe>"; 
	}
	else
		alert("Select at least two records");
}

//This function is to merge multiple row data into one, which will update 1 row with selected values, Deactivate other rows.
function updateOnMerge(url2Call,params)
{
	$('#nonJsoncommonPopupDiv').html('Clicking on Merge will deactivate other records, Are you sure you want to Merge?').dialog({
			modal: true,			
			title:'Merge Records',	
			resizable: false,
			modal: true,
			buttons: {
				"Yes": function() {$( this ).dialog( "close" );
				$.ajax({
					type: "POST",
					url: url2Call,
					data:params,
					success: function (data)
					{
						closeCommonPopup(1);
						showListPage();
					}
				});},
				"No": function() {$( this ).dialog( "close" );}
			}
		});
}

//** Mass Functionality related functions ends here*////

//Function to diplay the popup when we clicked on Copy Layouts button...
function CopyFrmPopUp(){
	document.getElementById('commonPopupDiv').innerHTML = '';
	createCopyPrefsFrmPopUp();
	$("#commonPopupDiv").dialog
	({
		modal: true,
		closeOnEscape:true,
		align:"center",
		width:700,
		height:480,
		title:'Copy layouts from selected user to other users',
		resizable: false,
		open: function(event, ui){$('#commonPopupDiv').css('overflow','hidden'); },
		close: function(event, ui){$('#commonPopupDiv').css('overflow','auto'); } 
	});
}

//Function to enter the contents in the commonpopdiv for the Copy prefs...
function createCopyPrefsFrmPopUp(){
	var L_PrefsPopupDiv = document.getElementById('commonPopupDiv');
	L_PrefsPopupDiv.innerHTML += "<div align='center'><input type='hidden' id='StrPagesCheckBxIds' /><label style='display:inline'>Select user to copy layouts from</label>&nbsp;&nbsp;<input type='hidden'  name='copyLayout_fromUserId' id='copyLayout_fromUserId' value=''><input type='text'  name='copyLayout_fromUserIdtxt' id='copyLayout_fromUserIdtxt' value='2 chars or **' onkeyup=\"callAjax('smartSuggestDiv',this,event,'/atCRM/custom/JSON/smartSuggest/genericPicklist.xml?tblName=SBEUser&pckListName=SBEUser',this.value);\" onfocus='changeSmartSuggestTxt(this);' onblur='changeSmartSuggestTxt(this);' class='inputGrayTextClass' style=\"width:40%\"><input type='hidden' id='StrUsersCheckBxIds'/><span class='infoIcon' style='background:none'><img id='HelpIconFrCopyLayouts' onmouseover='ShowHelpDiv()' onmouseout='HideHelpDiv()' src='/atCRM/images/JSON/info2.png' style='float:right;cursor:help;' /><div id='HelpTextDiv' style='display:none;width:400px;margin-left:-410px;text-align:left'><label style='font-weight:bold;text-decoration:underline'>Copy layouts from selected user to other user</label><ul><li>As the first step, select the user that you want to copy the layouts from.</li><li>You will then see a list of that user's layouts in this box.</li><li>You can search for specific layouts in the box above.</li><li>You can then check the layouts that you want to copy over.</li><li>In the box alongside check the users that you want the layouts copied to.</li><li>Then click GO!</li></ul></div></span></div>";
	L_PrefsPopupDiv.innerHTML += "<table cellpadding='0' style='margin-top:3px;border-collapse:collapse;width:100%'><tr><td style='vertical-align:top;width:50%;'><div class='PageUserClass' style='height:38px;width:100%;border-radius:4px 0 0 4px;'><input type='text' id='TxtBxFrPages' class='inputGrayTextClass' value='Search for layouts' onkeyup='ajaxCallFrPages()' style='margin:4px;width:55%' onfocus='GetTxtinTxtBx(this.id)' onblur='GetTxtinTxtBx(this.id)'/><img src='/atCRM/images/JSON/chkBx_small.png' id='checkFrPages' onclick='CheckrUncheck(this.id)' style='cursor:pointer;margin:10px 5px 0px 40px;display:inline;'/><label id='LblCheckAllFrPages' title='Check all' onclick='CheckrUncheck(\"checkFrPages\")' style='display:inline;color:white;cursor:pointer;'>Check all</label><img src='/atCRM/images/JSON/chkBx_ch1_small.png' id='UncheckFrPages' style='cursor:pointer;display:none;margin:10px 5px 0px 40px' onclick='CheckrUncheck(this.id)'/><label id='LblUncheckAllFrPages' title='Uncheck all' style='display:none;color:white;cursor:pointer' onclick='CheckrUncheck(\"UncheckFrPages\")'>Uncheck all</label></div></td><td style='vertical-align:top;'><div class='PageUserClass' style='border-radius:0px 4px 4px 0px;height:38px;width:100%;'><input type='text' class='inputGrayTextClass' style='margin:4px;width:55%' id='TxtBxFrSearchUsers' value='Search for users' onfocus='GetTxtinTxtBx(this.id)' onblur='GetTxtinTxtBx(this.id)' onkeyup='ajaxCallFrUsers()'/><img src='/atCRM/images/JSON/chkBx_small.png' id='checkFrUsr' onclick='CheckrUncheck(this.id)' style='cursor:pointer;margin:10px 5px 0px 40px;display:inline;'/><label id='LblCheckAllFrUsers' onclick='CheckrUncheck(\"checkFrUsr\")' title='Check all' style='display:inline;color:white;cursor:pointer'>Check all</label><img src='/atCRM/images/JSON/chkBx_ch1_small.png' id='UncheckFrUsr' style='cursor:pointer;margin:10px 5px 0px 40px;display:none;' onclick='CheckrUncheck(this.id)'/><label onclick='CheckrUncheck(\"UncheckFrUsr\")' title='Uncheck all' id='LblUncheckAllFrUsers' style='cursor:pointer;display:none;color:white;'>Uncheck all</label></div></td></tr><tr><td id='TdFr2ListPages' colspan='2'><div id='Div2ListPages' class='Div2ListPagesCls' align='justify' style='height:280px;overflow:auto'><ul id='UlFrContxtualMenuPages' style='font-style:italics;font-size:13px;margin-right:15px;margin-top:15px;'><li>As the first step, select the user that you want to copy the layouts from.</li><li>You will then see a list of that user's layouts in this box.</li><li>You can search for specific layouts in the box above.</li><li>You can then check the layouts that you want to copy over.</li><li>In the box alongside check the users that you want the layouts copied to.</li><li>Then click GO!</li></ul></div></td><td id='TdFr2ListUsers'><div class='Div2ListUsersCls' id='Div2ListUsers' style='height:280px;overflow:auto;'></div></td></tr></table>";
	L_PrefsPopupDiv.innerHTML += "<div style='height:4px;margin-top:3px;' class='TblHead'></div>";
	L_PrefsPopupDiv.innerHTML += "<div style='margin-top:10px;' align='right'><input type='button' id='CPLcopyprefs' class='bigColorButton' value='GO!' onclick='CopyPrefs2Many()'/></div></div>";
}

//function to display the Help div...
function ShowHelpDiv(){
	document.getElementById('HelpTextDiv').style.display = 'inline';
}

//Funciton to hide the Help div...
function HideHelpDiv(){
	document.getElementById('HelpTextDiv').style.display = 'none';
}

//Function to get Layout's and User's based on the User that we select in the top of the input box...
function ToFillContextualPages(){
	document.getElementById('UlFrContxtualMenuPages').style.display = 'none';
	var Td2ListPages = document.getElementById('TdFr2ListPages');
		Td2ListPages.colSpan = '0';
		Td2ListPages.style.borderRight = '1px solid #4188C2';
	var Td2ListUsers = document.getElementById('TdFr2ListUsers');
		Td2ListUsers.style.borderLeft = '1px solid #4188C2';
	var Div2ListPages = document.getElementById('Div2ListPages');

//Ajax call for the Layouts...
	var UrlForAllPages = "/atCRM/custom/JSON/admin/allViewPrefs.htm?sid="+Math.random()+"&userId="+document.getElementById('copyLayout_fromUserId').value;
		$.ajax({
				type: "GET",				   
				url:UrlForAllPages,
				dataType: "json",
				async: false,
				success: function (data){
					for(var m=0;m<data.Pages.length;m++){
						Div2ListPages.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\" /><label style='margin-top:5px;background-position:4px;text-indent:25px;white-space:nowrap' for=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\">"+data.Pages[m].PrefsName+"</label></div>";
						document.getElementById("checkbxPgsFr_"+data.Pages[m].PrefsId).setAttribute("onclick","StrPAgsCheckBxId(this.id);");
					}
				}
		});

//Ajax call for the Users...
	var UrlForAllUsers = "/atCRM/custom/JSON/admin/allUsers.htm?sid="+Math.random()+"&UserLoginId="+document.getElementById('copyLayout_fromUserId').value;
		var L_prefsDivfrUser = document.getElementById('Div2ListUsers');
		$.ajax({
				type: "GET",				   
				url:UrlForAllUsers,
				dataType: "json",
				success: function (data){
					for(var k=0;k<data.Users.length;k++){
							L_prefsDivfrUser.innerHTML += "<div><input type='checkbox' class='styledChkBx' style='height:20px;margin-left:10px;' id=\"checkbxUsrFr_"+data.Users[k].id+"\" /><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxUsrFr_"+data.Users[k].id+"\">"+data.Users[k].UserName+"</label></div>";
							document.getElementById("checkbxUsrFr_"+data.Users[k].id).setAttribute("onclick","StrUsersCheckBxId(this.id);");
					}
				}
		});
}

//Function to store the User's checked Box Id's in the Hidden element by appending , in between them...
function StrUsersCheckBxId(CheckBxId){
	if(document.getElementById(CheckBxId).checked == true){
		var CheckBxId = CheckBxId.replace("checkbxUsrFr_","");
		var pushId = CheckBxId+',';
		document.getElementById('StrUsersCheckBxIds').value += pushId;
	}
	else{
		var CheckBxId = CheckBxId.replace("checkbxUsrFr_","");
		var popId = CheckBxId+',';
		var strdIds = document.getElementById('StrUsersCheckBxIds').value;
		document.getElementById('StrUsersCheckBxIds').value = strdIds.replace(popId,'');
	}
}

//Function to Store the Layouts Checked Box Id's in the Hidden element by appending , in between them...
function StrPAgsCheckBxId(CheckBxId){
	if(document.getElementById(CheckBxId).checked == true){
		var CheckBxId = CheckBxId.replace("checkbxPgsFr_","");
		var pushId = CheckBxId+',';
		document.getElementById('StrPagesCheckBxIds').value += pushId;
	}
	else{
		var CheckBxId = CheckBxId.replace("checkbxPgsFr_","");
		var popId = CheckBxId+',';
		var strdIds = document.getElementById('StrPagesCheckBxIds').value;
		document.getElementById('StrPagesCheckBxIds').value = strdIds.replace(popId,'');
	}
}

//Function to take changes based on the check boxes that we select / deselect, the Check box that is beside the Input box...
function CheckrUncheck(Id){
	if(Id == 'checkFrUsr' || Id == 'UncheckFrUsr'){
		var LableClassFrUsers = $('#Div2ListUsers').find('.styledChkBx');
		if(Id=='checkFrUsr'){
			document.getElementById('checkFrUsr').style.display = 'none';
			document.getElementById('LblCheckAllFrUsers').style.display = 'none';
			document.getElementById('UncheckFrUsr').style.display = 'inline';
			document.getElementById('LblUncheckAllFrUsers').style.display = 'inline';
			LableClassFrUsers.attr('checked',true);
			$('#Div2ListUsers input:checked').each(function (){ 
				StrUsersCheckBxId($(this).attr('id'));
			});
		}
		else{
			document.getElementById('checkFrUsr').style.display = 'inline';
			document.getElementById('LblCheckAllFrUsers').style.display = 'inline';
			document.getElementById('UncheckFrUsr').style.display = 'none';
			document.getElementById('LblUncheckAllFrUsers').style.display = 'none';
			LableClassFrUsers.attr('checked',false);
			$('#Div2ListUsers input:not(:checked)').each(function(){
				StrUsersCheckBxId($(this).attr('id'));
			});
		}
	}
	else if(Id == 'checkFrPages' || Id == 'UncheckFrPages'){
		var LableClassFrPAges = $('#Div2ListPages').find('.styledChkBx');
		if(Id == 'checkFrPages'){
			document.getElementById('checkFrPages').style.display = 'none';
			document.getElementById('LblCheckAllFrPages').style.display = 'none';
			document.getElementById('UncheckFrPages').style.display = 'inline';
			document.getElementById('LblUncheckAllFrPages').style.display = 'inline';
			LableClassFrPAges.attr('checked',true);
			$('#Div2ListPages input:checked').each(function(){
				StrPAgsCheckBxId($(this).attr('id'));
			});
		}
		else{
			document.getElementById('UncheckFrPages').style.display = 'none';
			document.getElementById('LblUncheckAllFrPages').style.display = 'none';
			document.getElementById('checkFrPages').style.display = 'inline';
			document.getElementById('LblCheckAllFrPages').style.display = 'inline';
			LableClassFrPAges.attr('checked',false);
			$('#Div2ListPages input:not(:checked)').each(function(){
					StrPAgsCheckBxId($(this).attr('id'));
			});
		}
	}
}

//Function to get changes of css from grey to black in the input box of User's and Layout's...
function GetTxtinTxtBx(TxtBxId){
	var Result = document.getElementById(TxtBxId).value;
	var Elem=document.getElementById(TxtBxId);
	if(TxtBxId == 'TxtBxFrSearchUsers' && Result == 'Search for users'){
		Elem.value="";
		Elem.className="inputFieldClass";
	}
	else if(TxtBxId == 'TxtBxFrSearchUsers' && Result == ''){
		Elem.value="Search for users";
		Elem.className="inputGrayTextClass";
	}
	else if(TxtBxId == 'TxtBxFrPages' && Result == 'Search for layouts'){
		Elem.value="";
		Elem.className="inputFieldClass";
	}
	else if(TxtBxId == 'TxtBxFrPages' && Result == ''){
		Elem.value="Search for layouts";
		Elem.className="inputGrayTextClass";
	}
	else{
		Elem.className="inputFieldClass";
		return;
	}
}

//Function to copy selected layouts to the selected users, when we clicked on GO! button...
function CopyPrefs2Many(){
var CheckedInputFrUsersLength;
var CheckedInputFrPagesLength;
	$('#Div2ListUsers').each(function (){
		var CheckedInputFrUser = $(this).find('.styledChkBx:checked');
		CheckedInputFrUsersLength = CheckedInputFrUser.length;	
	});
	
	$('#Div2ListPages').each(function (){
		var CheckedInputFrPages = $(this).find('.styledChkBx:checked');
		CheckedInputFrPagesLength = CheckedInputFrPages.length;
	});

	if(CheckedInputFrUsersLength != 0 && CheckedInputFrPagesLength != 0){
		var Url2CopyPrefs = "/atCRM/custom/JSON/admin/copyPrefsOne2Many.html?sourceUser="+document.getElementById('copyLayout_fromUserId').value+"&sourcePrefIds="+document.getElementById('StrPagesCheckBxIds').value+"&destUsers="+document.getElementById('StrUsersCheckBxIds').value;
		$.ajax({
				type: "GET",				   
				url:Url2CopyPrefs,
				dataType: "json",
				success: function(data){
					var userCount = data.userCount;
					var layoutCount = data.layoutCount;
					alert(layoutCount+" layout(s) have been copied over to "+userCount+" user(s)");
				},
				error: function(){
					alert("Layout doesn't seemed to be copied, please contact admin");
				}
		});
	}
	else
		alert('Please select layouts and users, then click GO');
}

//Function to get the Ajax call based on the text we enter into the User's input box...
function ajaxCallFrUsers(){
		var L_prefsDivfrUser = document.getElementById('Div2ListUsers');
		L_prefsDivfrUser.innerHTML = '';
		var UrlForAllUsers = "/atCRM/custom/JSON/admin/allUsers.htm?sid="+Math.random()+"&str="+document.getElementById('TxtBxFrSearchUsers').value+"&UserLoginId="+document.getElementById('copyLayout_fromUserId').value;
		$.ajax({
				type: "GET",				   
				url:UrlForAllUsers,
				dataType: "json",
				success: function (data){
					for(var k=0;k<data.Users.length;k++){
						if(document.getElementById('StrUsersCheckBxIds').value != ''){
							var CheckedIds = document.getElementById('StrUsersCheckBxIds').value;
							if(CheckedIds.indexOf(data.Users[k].id) != -1){
								L_prefsDivfrUser.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxUsrFr_"+data.Users[k].id+"\" style='height:20px;margin-left:10px;' checked/><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxUsrFr_"+data.Users[k].id+"\">"+data.Users[k].UserName+"</label></div>";
								document.getElementById("checkbxUsrFr_"+data.Users[k].id).setAttribute("onchange","StrUsersCheckBxId(this.id)");
							}
							else{
								L_prefsDivfrUser.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxUsrFr_"+data.Users[k].id+"\" style='height:20px;margin-left:10px;'/><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxUsrFr_"+data.Users[k].id+"\">"+data.Users[k].UserName+"</label></div>";
								document.getElementById("checkbxUsrFr_"+data.Users[k].id).setAttribute("onchange","StrUsersCheckBxId(this.id)");
							}
						}
						else{
							L_prefsDivfrUser.innerHTML += "<div><input type='checkbox' class='styledChkBx' style='height:20px;margin-left:10px;' id=\"checkbxUsrFr_"+data.Users[k].id+"\" /><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxUsrFr_"+data.Users[k].id+"\">"+data.Users[k].UserName+"</label></div>";
							document.getElementById("checkbxUsrFr_"+data.Users[k].id).setAttribute("onchange","StrUsersCheckBxId(this.id)");
						}
					}
				}
		});
}

//Function to get the Ajax call based on the text that we enter into Layout's input box...
function ajaxCallFrPages(){
		var L_prefsDivfrPgs = document.getElementById('Div2ListPages');
		L_prefsDivfrPgs.innerHTML = '';
		var UrlForAllPages = "/atCRM/custom/JSON/admin/allViewPrefs.htm?sid="+Math.random()+"&userId="+document.getElementById('copyLayout_fromUserId').value+"&str="+document.getElementById('TxtBxFrPages').value;
		$.ajax({
				type: "GET",				   
				url:UrlForAllPages,
				dataType: "json",
				success: function (data){
					for(var m=0;m<data.Pages.length;m++){
						if(document.getElementById('StrPagesCheckBxIds').value != ''){
							var CheckedIds = document.getElementById('StrPagesCheckBxIds').value;
							if(CheckedIds.indexOf(data.Pages[m].PrefsId) != -1){
								L_prefsDivfrPgs.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\" checked /><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\">"+data.Pages[m].PrefsName+"</label></div>";
								document.getElementById("checkbxPgsFr_"+data.Pages[m].PrefsId).setAttribute("onclick","StrPAgsCheckBxId(this.id);");
							}
							else{
								L_prefsDivfrPgs.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\" /><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\">"+data.Pages[m].PrefsName+"</label></div>";
								document.getElementById("checkbxPgsFr_"+data.Pages[m].PrefsId).setAttribute("onclick","StrPAgsCheckBxId(this.id);");
							}
						}
						else{
							L_prefsDivfrPgs.innerHTML += "<div><input type='checkbox' class='styledChkBx' id=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\" /><label style='margin-top:5px;background-position:4px;text-indent:25px;' for=\"checkbxPgsFr_"+data.Pages[m].PrefsId+"\">"+data.Pages[m].PrefsName+"</label></div>";
							document.getElementById("checkbxPgsFr_"+data.Pages[m].PrefsId).setAttribute("onclick","StrPAgsCheckBxId(this.id);");
						}
					}
				}
		});
}

//Vadiraj Below functions is written to update ticket Acknowledgement related fields for Mediassist. This function will update few custom fields like Details and who has acknowledged the ticket.
function acknowledge(pkVal){
	document.getElementById("commonPopupDiv").innerHTML = "";
	$('#commonPopupDiv').dialog('open');
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Acknowledge Ticket',
		minHeight:155,
		minWidth:400,	
		width:300,
		closeOnEscape:true			
	});

	var JSONURL=zcServletPrefix+"/custom/JSON/system/verifyTicketAcknowledged.json?tktId="+pkVal;
	$.ajax({
		type: "GET",
		url: JSONURL,
		dataType: "json",
		success: function (data)
		{  
			var status= data["acknowledgedBy"];
			if(status!='')
			{
				var convertDivContent = "<table align='center' border='0' style='margin-top:5px' cellpadding='3'>";
				convertDivContent += "<tr><td></td><td></td></tr>"; 
				convertDivContent += "<tr><td><br/><b>Ticket is already Acknowledged.</b><br/></td></tr>"; 
				convertDivContent += "</table>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
				setTimeout("closeCommonPopup()",3000);
			}
			else
			{
				document.getElementById("commonPopupDiv").innerHTML = "";
				$('#commonPopupDiv').dialog('open');
				$('#commonPopupDiv').dialog({
					autoOpen:true,
					modal: true,
					title:'Acknowledge ticket',
					minHeight:155,
					minWidth:400,	
					width:400,
					closeOnEscape:true			
				}); 
				var convertDivContent = "<table border='0' style='margin-top:3px' cellpadding='3' width='100%'>";
				convertDivContent +="<tr><td style='padding-left:10px'>Details:</td><td><textarea rows='5' cols='60' align='center' style='margin-top:4px;text-align:left' class='inputFieldClass' id='detailArea' maxlength='2000'></textarea></td></tr><tr><td nowrap>Acknowledged by:</td><td><input type='text' id='ackBy'></td></tr><tr><td colspan='2' align='center'><input type='button' align='center' style='width:90px' class='greenButton' value='Acknowledge' onclick='setValuesForAck(document.getElementById(\"detailArea\").value,document.getElementById(\"ackBy\").value,"+pkVal+");'></td></tr>";
				document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
			}
		}
	});
}
function setValuesForAck(detVal,ackBy,pkVal)
{
	if (detVal!='' && ackBy!='')
	{

		var url2Hit = zcServletPrefix+"/custom/JSON/add/ticket/editAction";
		var post_val = { "0-1-2": pkVal, "0-1-118": detVal.replaceAll("'","''"), "0-1-122": ackBy};

		$.ajax(
			{
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				url: url2Hit,
				data: post_val,
				async: false,
				success: function (doc)
				{
					document.getElementById("commonPopupDiv").innerHTML = "";
					$('#commonPopupDiv').dialog('open');
					$('#commonPopupDiv').dialog({
						autoOpen:true,
						modal: true,
						title:'Acknowledged',
						minWidth:250,
						minHeight:100,
						beforeclose: function() {}
					});	
					var convertDivContent = "<table align='center' style='margin-top:5px' cellpadding='3'>";
					convertDivContent += "<tr><td colspan='2' style='text-align:center'><br/><br/><b>You have acknowledged the Ticket.<b><br/><br/></td></tr>"; 
					convertDivContent += "</table></center><br/>";
					document.getElementById("commonPopupDiv").innerHTML = convertDivContent;
					setTimeout("closeCommonPopup(1)",1000);
				}
			});
	}
	else
	{
		alert('Please provide value for Details and Acknowledged by fields.');
	}
	
}
//End of Mediassist ticket Acknowledgement related fields

/********This function for filling MRP on select of the product in the Invetory add screen*******/
function showMRPForInvt(cnt)
{
	var prodId = document.getElementById("0-101:"+cnt+"-601-615").value;
	if (prodId!='')
	{
		var url2Hit = zcServletPrefix+"/custom/JSON/system/getMaxMRP4Product.json?prodId="+prodId;
		$.ajax({
			type: "GET",
			url: url2Hit,
			dataType: "json",
			success: function (doc)
			{
               var prodId= doc["prodId"];
			   var price = doc["default_price"];
			   var packType = doc["udef_02"];
			   if (document.getElementById("0-101:"+cnt+"-601-779"))  document.getElementById("0-101:"+cnt+"-601-779").value = price;
			   if (document.getElementById("0-101:"+cnt+"-601-655"))  document.getElementById("0-101:"+cnt+"-601-655").value = packType;
			}
		});
	}
	
}
/****Function ends here****/

// Vadiraj -- Below function is written for MediAssist. This function will prefill Policy related columns from the Contact selected by Agent.
function fillMAIDRelFlds(){
	var contId = document.getElementById("0-1-26").value;
	var MAID = document.getElementById("0-1-26txt").value;
	if (contId!='')
	{
		var url2Hit = zcServletPrefix+"/custom/JSON/system/getPolicyDetFromMAID.json?contId="+contId;
		$.ajax({
			type: "GET",
			url: url2Hit,
			dataType: "json",
			success: function (doc)
			{
               var policynum= doc["policynum"];
			   var policytype = doc["policytype"];
			   var insurer = doc["insurer"];
			   var corpId = doc["corpId"];
			   var corpstr = doc["corpstr"];
			   var mobile = doc["mobile"];
			   var email = doc["email"];
			   var policyDet = doc["policyDet"];
			   if (document.getElementById("0-1-113")) { document.getElementById("0-1-113").value = policytype; document.getElementById("0-1-113").disabled = "true"; }
			   if (document.getElementById("0-1-114")) { document.getElementById("0-1-114").value = insurer; document.getElementById("0-1-114").disabled = "true"; }
			   if (document.getElementById("0-1-32txt")) { document.getElementById("0-1-32txt").value = corpstr; document.getElementById("0-1-32txt").disabled = "true"; }
			   if (document.getElementById("0-1-32")) { document.getElementById("0-1-32").value = corpId; document.getElementById("0-1-32").disabled = "true"; }
			   if (document.getElementById("0-1-121")) { document.getElementById("0-1-121").value = policynum; document.getElementById("0-1-121").disabled = "true" ; }
			   if (document.getElementById("0-1-116")) document.getElementById("0-1-116").value = mobile;
			   if (document.getElementById("0-1-115")) document.getElementById("0-1-115").value = email;
			   if (document.getElementById("0-1-120")) { document.getElementById("0-1-120").value = policyDet; document.getElementById("0-1-120").disabled="true"; }
			   if (document.getElementById("0-1-123")) { document.getElementById("0-1-123").value = MAID; document.getElementById("0-1-123").disabled="true"; }
			}
		});
	}
}

function hideImage()
{
  for(var i=0;i<20;i++){
	  if(document.getElementById('0-101:'+i+'-601-615_add')){
	     var spanElem = document.getElementById('0-101:'+i+'-601-615_add');$(spanElem).css({'display':'none'});
      }
  }
}
function calcInvExtTotal(zcRank)
{
	if(!(document.getElementById("extdTot_div")))
	{
		var linkElem = document.getElementById("moreLinkDivId");
		$("#moreLinkDivId").append("<div id='extdTot_div'><span id='spn_extdTot' style='display:inline-table;font-size: 17px;font-family: tahoma;'>Extended Total (Rs)</span><input type='text' class='inputFieldBig' id='extdTot' style='display:inline-table;border: none;width: 150px;text-align:right;' disabled></div>");
	}
	var totAmt=0;
	var discAmt=0;
	for(var i=0;i<25;i++){
	  if(document.getElementById('0-1001:'+i+'-1101-1125')&&document.getElementById('0-1001:'+i+'-1101-1125').value!=''){
		  var extAmt = document.getElementById('0-1001:'+i+'-1101-1125').value;
	     totAmt =parseFloat(totAmt)+parseFloat(extAmt);
      }
    }
    //if(document.getElementById("totalPrice")&&document.getElementById("totalPrice").value!="") totAmt = document.getElementById("totalPrice").value;
	//if(document.getElementById("0-1-850")&&document.getElementById("0-1-850").value!="") discAmt = document.getElementById("0-1-850").value;
	//var extTotAmt = parseFloat(totAmt)-parseFloat(discAmt);extTotAmt=extTotAmt.toFixed(2);
	totAmt = parseFloat(totAmt);
	if(document.getElementById("extdTot")) document.getElementById("extdTot").value=totAmt.toFixed(2);
}

