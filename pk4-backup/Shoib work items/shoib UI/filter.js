var srchFldCntr=1;
var entityName4Filter="";
var filterId4Filter = null;
var filterColData="";
var dataForEditFilter="";
var existingFilters="";
var srchFldCntrArray=new Array();
var filterListDiv="";
var list2Load="";
var insertQuery="";
var insertQueryPK="";
var pageHeading="";
var entityDiv;

function addEditFilter(forEntity,id,fnc,listurl,queryName,queryPK,queryLabel,templateName,divObjId)
{	
	// Assign values for all global variables
	entityName4Filter=forEntity;
	if(id)filterId4Filter=id; else filterId4Filter=null;
	srchFldCntr=1;
	dataForEditFilter="";
	existingFilters="";
	srchFldCntrArray.length=0;
	list2Load=listurl;
	insertQuery=queryName;
	insertQueryPK=queryPK;
	pageHeading=queryLabel;
	
	// Hide main list page
	if(entityDiv){
		document.getElementById(entityDiv).style.display="none";
		filterListDiv=entityDiv;
		entityDiv="addEditDiv";
	}

	// Div to write entire filter page
	var mainDiv=document.getElementById('detailDataDiv');
	if(document.getElementById("addEditDiv"))
		document.getElementById("addEditDiv").style.display='block';
	else CreateDIV(mainDiv,'',"addEditDiv",'','100%');

	hideLeftPannel(true);	
	if(fnc)
		callSearchResult(zcServletPrefix+listurl);
	initializeFilter(id,fnc,queryLabel,templateName);
}
	
function initializeFilter(filterId4Filter,fnc,queryLabel,templateName)
{	
	if(document.getElementById('addEditDiv'))
		var filterDiv=document.getElementById('addEditDiv');
	else
		var filterDiv = document.getElementById('FilterDiv');
	filterDiv.setAttribute("style","margin:0 auto;width:98%");
	filterDiv.style.textAlign="left";

	//Heading for the filter
	if(filterId4Filter&&filterId4Filter!=0)var filterHeading="Edit Filter for "+entityName4Filter;
	else if(queryLabel) var filterHeading=queryLabel; else var filterHeading="Create Filter for "+entityName4Filter;
		
	filterDiv.innerHTML = '<div id="overLayDiv" class="ui-widget-overlay overLayContent" style="width:100%;height:'+getScreenSize("height")+'px;">Loading...</div>';
	filterDiv.innerHTML+='<div class="jsonHeading">'+filterHeading+'</div>';

	if(templateName)
	{
		var queryFnc=(queryLabel.replace("Send ","")).replace("Mass ",""); 
		queryFnc=queryFnc.toLowerCase();
		var helpText='<div class="helpDiv"><img src="/atCRM/images/JSON/help.png" align="left" hspace="3px" vspace = "3px"/>You can use this feature to send out '+queryFnc+' to your customers. First, select the template that you want to send from the list of '+queryFnc+' templates. Second, click on "Filter your data" to choose exactly who you want to send the '+queryFnc+' to by selecting the criteria that you want and clicking on the "Search" button. On the list of customers that appears, you can also click on the exact users that you want to send the '+queryFnc+' out to by just clicking on the selection box next to the user\'s name. Clicking on the "Send!" button will send out a '+queryFnc+' to all the people that you have chosen.</div>';filterDiv.innerHTML+=helpText;
		filterDiv.innerHTML+="<div class='sectionDivHdr' style='margin-top:10px;padding:5px'>Select Template</div><div class='sectionDiv' style='padding:5px'><span  name='massFncTmpl' id='massFncTmpl' class='ItemLabel' style='text-decoration:underline;cursor:pointer;display:inline-block;' onclick=\"populatePicklist('"+templateName+"','"+templateName+"','massFncTmplIdtxt');\"><table cellpadding='0' cellspacing='0'><tr><td><img src='/atCRM/images/JSON/templateSmall.png' style='vertical-align:middle;padding:10px'></td><td><span id='massFncTmplIdAnc'><b>Click here to select a "+templateName+"</b></span></span><input type='hidden'  name='massFncTmplId' id='massFncTmplId'><input type='hidden'  name='massFncTmplIdtxt' id='massFncTmplIdtxt'></td></tr></table></div>";
	}

	//Error div for the filter
	filterDiv.innerHTML+='<div class="jsonErrorDiv" name="filterErrorDiv" id="filterErrorDiv"></div>';

	//Name for the filter
	if(fnc!='search')
		filterDiv.innerHTML+='<table style="margin:10px"><tr><td class="labelStyle">Filter Name<span style="color:red">*</span></td><td><input type="text" id="filterName" name="filterName" maxlength="50" style="width:250px" onblur="checkFilterName(this)" class="formText"></td></tr><tr><td class="labelStyle">Is public filter?</td><td><input type="checkbox" id="isPublic" name="isPublic"></td></tr></table>';
	
	//Div for filter Criteria
	if(fnc)filterDiv.innerHTML+='<div class="sectionDivHdr" id="filterCriteriaDiv" name="filterCriteriaDiv" style="margin-top:10px;">Filter your Data</div><div id="filterCriteriaBodyDiv" name="filterCriteriaBodyDiv" class="sectionDiv" style="padding:5px"></div>';
	else filterDiv.innerHTML+='<div class="sectionDivHdr" id="filterCriteriaDiv" name="filterCriteriaDiv" style="margin-top:10px;">Filter your Data</div><div id="filterCriteriaBodyDiv" name="filterCriteriaBodyDiv" class="sectionDiv" style="padding:5px"></div>';

	if(!filterId4Filter)filterId4Filter=0;
	//Buttons for Save, Cancel, Search
	if(fnc!='search')
		filterDiv.innerHTML+='<div style="text-align:center;margin-top:5px;background-position:center;" id="filterSubmitDiv" class="submit"><a href="javascript:createFilterCriteria(0);" class="linkButton">+ More Criteria</a>&nbsp;<input type="button" value="Save" class="bigButton" onclick="saveFilterCriteria('+filterId4Filter+',\''+fnc+'\')"/>&nbsp;<input type="button" value="Cancel" class="bigButton" onclick="cancelFilterCriteria()"/>';
	else
		filterDiv.innerHTML+='<div style="text-align:center;margin-top:5px;background-position:center;" id="filterSubmitDiv" class="submit"><a href="javascript:createFilterCriteria(0);" class="linkButton">+ More Criteria</a>&nbsp;&nbsp;<a href="javascript:clearFilterCriteria('+filterId4Filter+',\''+fnc+'\');" class="linkButton">Clear Search Criteria</a>&nbsp;&nbsp;<input type="button" value="Search" class="bigButton" onclick="saveFilterCriteria('+filterId4Filter+',\''+fnc+'\')" />';

	//Retrieve columns to filter data
	if(filterId4Filter){
		var url2Hit=zcServletPrefix+"/custom/JSON/system/filters.htm?entityName="+entityName4Filter+"&filter_id="+filterId4Filter;
	}
	else{
	/*	if(zcServletPrefix)
			var url2Hit=zcServletPrefix+"/custom/JSON/system/filters.htm?entityName="+entityName4Filter;
		else*/
			var url2Hit="/atCRM/custom/JSON/system/filters.htm?entityName="+entityName4Filter;
		        
	}
		$.ajax({
			type: "GET",
			url:url2Hit,
			dataType: "json",
			async: false,
			success: function (data){
				filterColData=data['entityBaseColumnList'];
				dataForEditFilter=data['dataForEditFilter'];
				document.getElementById('overLayDiv').style.display="none";
			}
		});

	//Prefill data in Edit Case	
	if(dataForEditFilter[0])
	{
		existingFilters=dataForEditFilter[0].existingFilters;
		document.getElementById('filterName').value=dataForEditFilter[0].filterName;
		document.getElementById('filterName').style.border="0px";
		
		if(dataForEditFilter[0].is_public==1)
		document.getElementById('isPublic').checked=true;
	}

	//Build filter Criteria
	if(existingFilters.length >=1 && dataForEditFilter[0].existingFilters)
		for (var i=1; i<=existingFilters.length; i++)
			createFilterCriteria(i,i);	
	else if(templateName)
		createFilterCriteria(1);
	else
		for (var i=1; i<=3; i++)
			createFilterCriteria(i);
}

//Function to build Columns for Filter Criteria 
function createFilterCriteria(isFirst,fltrNoForEdit)
{
	var container=document.getElementById('filterCriteriaBodyDiv');
	var containers=CreateDIV(container, "", "containerDev"+srchFldCntr);
	var content=""; var optns="";

	if(isFirst==1)
		content="<table><tr><td style='width:60px;'>&nbsp;</td>";
	else
		content="<table><tr><td style='width:60px;text-align:center'><img src='/atCRM/images/JSON/remove-icon.png' alt='Remove Criteria' onclick=\"removeFilterCriteria('"+srchFldCntr+"')\" style='cursor:pointer;height:20px;vertical-align:middle'/>&nbsp;and<input type='hidden' name='match"+srchFldCntr+"' id='match"+srchFldCntr+"' value='and'></td>";

	var columns=filterColData;

	for(colCntr=0;colCntr<columns.length;colCntr++)
		if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['attributeName']==columns[colCntr]['columnName'])
			optns+="<option value='"+columns[colCntr]['columnName']+"' selected>"+columns[colCntr]['desc_name']+"</option>";
		else
			optns+="<option value='"+columns[colCntr]['columnName']+"'>"+columns[colCntr]['desc_name']+"</option>";
	
	content+="<td style='width:300px;'><select name='searchfield"+srchFldCntr+"' id='searchfield"+srchFldCntr+"' onchange=\"showFilterCondSpan(this,'condDiv"+srchFldCntr+"','"+srchFldCntr+"')\" class='selectbox'><option value=''>- None -</option>"+optns+"</select></td><td style='width:500px;'><span id='condDiv"+srchFldCntr+"' name='condDiv"+srchFldCntr+"'></span></td></tr></table>";
	
	containers.innerHTML=content;

	var searchField=document.getElementById("searchfield"+srchFldCntr);

	srchFldCntrArray.push(srchFldCntr);
	if(fltrNoForEdit)
		showFilterCondSpan(searchField,"condDiv"+srchFldCntr,srchFldCntr, fltrNoForEdit);
	else
		showFilterCondSpan(searchField,"condDiv"+srchFldCntr,srchFldCntr);	
	srchFldCntr++;
}

//Function to build condition for Filter Criteria and to show form field based on type of column
function showFilterCondSpan(selBx, contDivId, fldCntr, fltrNoForEdit)
{
	var optBox="";
	var searchTxtFldVal="";
	var columnType="varchar";
	var columns=filterColData;
	var condSpan=document.getElementById(contDivId);
	
	//Opearators for string type
	var operatorsArray= new Array()
	operatorsArray["eq"]="Equal";
	operatorsArray["ne"]="Not Equal";
	operatorsArray["contains"]="Contains";
	operatorsArray["does not contain"]="Does not contain";
	operatorsArray["starts with"]="Starts with";
	operatorsArray["does not start with"]="Does not start with";
	operatorsArray["ends with"]="Ends with";
	operatorsArray["does not end with"]="Does not end with";

	//Opearators for number type
	var operatorsNumericArray= new Array()
	operatorsNumericArray["eq"]="Equal";
	operatorsNumericArray["ne"]="Not Equal";

	//Opearators for foreign key type
	var operatorsFKArray= new Array()
	operatorsFKArray["eq"]="Equal";
	operatorsFKArray["ne"]="Not Equal";

	//Opearators for date type
	var operatorsDateArray= new Array()
	operatorsDateArray["lt"]="Lesser than";
	operatorsDateArray["gt"]="Greater than";


	for(colCntr=0;colCntr<columns.length;colCntr++)
	{
		if(columns[colCntr]['columnName'] == selBx.value)
		{
			columnType=columns[colCntr]['columnType'];
			var isForeignKey=columns[colCntr]['isForeignKey'];
			var tableReferedTo=columns[colCntr]['tableReferedTo'];
			var columnReferedTo=columns[colCntr]['columnReferedTo'];
			var referColumnName=columns[colCntr]['referColumnName'];
			break;
		}
	}

	//If column is foreign key show picklist 
	if(isForeignKey==1)
	{		
		for (var condFld in operatorsFKArray)
			if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator']==condFld)
				optBox+="<option value='"+condFld+"' selected>"+operatorsFKArray[condFld]+"</option>";
			else
				optBox+="<option value='"+condFld+"'>"+operatorsFKArray[condFld]+"</option>";
		
		if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator'])
			searchTxtFldVal=existingFilters[fltrNoForEdit-1]['value'];

		var pckLstVal="";

		//Ajax to retrieve foreign key value for selected column in Edit Case
		if(searchTxtFldVal)
		{
			var //url=zcServletPrefix+"/custom/JSON/smartSuggest/smartFillData.htm?cols="+referColumnName+"&tblName="+tableReferedTo+"&pkCol="+columnReferedTo+"&pkVal="+searchTxtFldVal;
			url="/atCRM/custom/JSON/smartSuggest/smartFillData.htm?cols="+referColumnName+"&tblName="+tableReferedTo+"&pkCol="+columnReferedTo+"&pkVal="+searchTxtFldVal;
			$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			async: false,
			success: function (data)
			{
				var pckLstFillData=(data['enttInfo']['data']);
				pckLstVal=pckLstFillData.split('~)')[1];
			}
			});
		}

		condSpan.innerHTML="<table width='100%'><tr><td style='width:200px'><select class='selectbox' id='searchCondFld"+fldCntr+"'>"+optBox+"</select></td><td id='searchTxtFldTD"+fldCntr+"'><input type='hidden' id='searchTxtFld"+fldCntr+"' value='"+searchTxtFldVal+"'><input type='text' id='searchTxtFld"+fldCntr+"txt' value='"+pckLstVal+"' class='formText' maxLength='50'></td><td><a id='searchTxtFld"+fldCntr+"pck' onclick=\"populatePicklist('"+columnReferedTo+"','"+tableReferedTo+"','searchTxtFld"+fldCntr+"txt','','0','addEditForm','','"+selBx.value+"');\"><img src='/atCRM/images/JSON/picklist.png' style='cursor: pointer; margin-left: 4px;'></a></td>";

	}
	else
	{
		switch(columnType)
		{
			case "String":
			case "VARCHAR":
			case "varchar":
				{				
					if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator'])
						searchTxtFldVal=existingFilters[fltrNoForEdit-1]['value'];

					for (var condFld in operatorsArray)
						if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator']==condFld)
							optBox+="<option value='"+condFld+"' selected>"+operatorsArray[condFld]+"</option>";
						else
							optBox+="<option value='"+condFld+"'>"+operatorsArray[condFld]+"</option>";
			
						condSpan.innerHTML="<table width='100%'><tr><td style='width:200px'><select class='selectbox' id='searchCondFld"+fldCntr+"'>"+optBox+"</select></td><td id='searchTxtFldTD"+fldCntr+"'><input type='text' id='searchTxtFld"+fldCntr+"' value='"+searchTxtFldVal+"' class='formText' maxLength='50'></td>";
				}
				break;

			case "Number":
			case "DECIMAL":
			case "numeric":
				{
					if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator'])
						searchTxtFldVal=existingFilters[fltrNoForEdit-1]['value'];

					for (var condFld in operatorsNumericArray)
						if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator']==condFld)
							optBox+="<option value='"+condFld+"' selected>"+operatorsNumericArray[condFld]+"</option>";
						else
							optBox+="<option value='"+condFld+"'>"+operatorsNumericArray[condFld]+"</option>";

					condSpan.innerHTML="<table width='100%'><tr><td style='width:200px'><select class='selectbox' id='searchCondFld"+fldCntr+"'>"+optBox+"</select></td><td id='searchTxtFldTD"+fldCntr+"'><input type='text' id='searchTxtFld"+fldCntr+"' value='"+searchTxtFldVal+"' class='formText' maxLength='50' onkeypress='return numbersonly(this,event,true);'></td>";
				}
				break;

			case "Datetime":
			case "datetime":
			case "timestamp":
			case "TIMESTAMP":
				{
					
					var searchTxtFldDateVal="";
					var searchTxtFldTimeVal="";
					if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator'])
					{
						searchTxtFldVal=existingFilters[fltrNoForEdit-1]['value'];
						searchTxtFldDateVal=existingFilters[fltrNoForEdit-1]['value'];
						searchTxtFldDateVal1 = formatDate(parseDate(searchTxtFldDateVal),'MM/dd/yyyy');
						searchTxtFldDateVal = formatDate(parseDate(searchTxtFldDateVal1),'dd/MM/yyyy');
						searchTxtFldTimeVal="12:00 AM";
					}

					for (var condFld in operatorsDateArray)
						if(fltrNoForEdit && existingFilters[fltrNoForEdit-1]['operator']==condFld)
							optBox+="<option value='"+condFld+"' selected>"+operatorsDateArray[condFld]+"</option>";
						else
							optBox+="<option value='"+condFld+"'>"+operatorsDateArray[condFld]+"</option>";
					
					var dateFldId="searchTxtFld"+fldCntr;
					condSpan.innerHTML="<table width='100%'><tr><td style='width:200px'><select class='selectbox' id='searchCondFld"+fldCntr+"'>"+optBox+"</select></td><td id='searchTxtFldTD"+fldCntr+"'><input type='hidden' id='"+dateFldId+"' value='"+searchTxtFldVal+"'/><input id='"+dateFldId+"_date_value' class='inputFieldClass' onblur=\"changeDate('"+dateFldId+"_date_value'); assignToDateFld('"+dateFldId+"');\" size=12 maxlength=12 style='width:70px' value='"+searchTxtFldDateVal+"'/>&nbsp;<img src='/atCRM/images/calendar.gif' id='"+dateFldId+"_cal' alt='Pick Date' style='cursor:pointer;vertical-align:middle;padding-left:1px;'/><input id='"+dateFldId+"_time_value' class='inputFieldClass' value='00:00:00' type='hidden'/></td></tr></table>";

					new Calendar({
						  inputField: dateFldId+'_date_value',
						  dateFormat: "%d/%m/%Y", 
						  trigger: dateFldId+"_cal",
						  bottomBar: true,
						  fdow:0,
						  min: 19000101,
						  max: 29991231,
						  align: "BL",
						  onSelect: function() {
							 this.hide();
							 var obj=document.getElementById(dateFldId+'_date_value');
							 obj.focus();
						  }
					});
				}			
				break;
		}
	}
}

function assignToDateFld(dtElmId)
{
	var dateFldObj=document.getElementById(dtElmId+'_date_value');
	var timeFldObj=document.getElementById(dtElmId+'_time_value');
	if(dateFldObj.value!="" && timeFldObj.value!="")
	{
		var timeFldVal=timeFldObj.value;
		var ap = timeFldVal.split(' ')[1];
		var hour = (timeFldVal.split(' ')[0]).split(':')[0];
		var minute = (timeFldVal.split(' ')[0]).split(':')[1];
		var second = "00";
		if(ap == "AM")
			{if (hour == 12)hour = "00";}
		else
			{hour=parseFloat(hour);if(hour < 12){hour = hour+12;};}
		timeFldVal = hour +':' +minute +':' +second;
		var d = parseDate(dateFldObj.value);
		dateFldVal = formatDate(d,'MM/dd/yyyy');
		document.getElementById(dtElmId).value=dateFldVal;
	}
	else if(dateFldObj.value!="")
	{
		var d = parseDate(dateFldObj.value);
		dateFldVal = formatDate(d,'MM/dd/yyyy');
		document.getElementById(dtElmId).value=dateFldVal;
	}				
}

//Delete Filter Criteria Row
function removeFilterCriteria(divIdAppender)
{
	var removableCriteria=document.getElementById("containerDev"+divIdAppender);
	var container=document.getElementById('filterCriteriaBodyDiv');

	for(i=0; i<srchFldCntrArray.length; i++)
	{
		if(srchFldCntrArray[i]==divIdAppender)
			srchFldCntrArray.splice(i,1);
	}
	container.removeChild(removableCriteria);
}

//Clear Filter Criteria Row
function clearFilterCriteria(filterId4Filter,fnc)
{
	var arrLen=(srchFldCntrArray.length);
	for (srchFldCntrCnt=arrLen; srchFldCntrCnt>0; srchFldCntrCnt--)
	{
		document.getElementById("searchfield"+srchFldCntrCnt).value="";
		document.getElementById("searchCondFld"+srchFldCntrCnt).value="";
		document.getElementById("searchTxtFld"+srchFldCntrCnt).value="";		
		if(document.getElementById("searchTxtFld"+srchFldCntrCnt+"txt"))document.getElementById("searchTxtFld"+srchFldCntrCnt+"txt").value="";
		if(document.getElementById("searchTxtFld"+srchFldCntrCnt+"_date_value"))document.getElementById("searchTxtFld"+srchFldCntrCnt+"_date_value").value="";
		if(document.getElementById("searchTxtFld"+srchFldCntrCnt+"_time_value"))document.getElementById("searchTxtFld"+srchFldCntrCnt+"_time_value").value="";

		//Delete All but First row in Mass Insert case
		if(insertQuery&&srchFldCntrArray[srchFldCntrCnt]!=1)removeFilterCriteria(srchFldCntrArray[srchFldCntrCnt]);
	}	
	callSearchResult(zcServletPrefix+list2Load);
}

//Go back to Filters list in Add/Edit Filter Case
function cancelFilterCriteria()
{	
	if(document.getElementById('addEditDiv')){
		document.getElementById('addEditDiv').style.display="none";
		document.getElementById('addEditDiv').innerHTML="";
		entityDiv=filterListDiv;
		setUpPageParameters(zcServletPrefix+'/custom/JSON/list/filtersView.htm?forEntity='+entityName4Filter,filterListDiv);
	}
	else 
		$(document.getElementById('FilterDiv')).dialog('close');
}

//Ajax for Unique filter name
function checkFilterName(filterName)
{
	document.getElementById('filterErrorDiv').style.display="none";
	filterName.className='formText';
	
	var returnStatus=true;
	var isPublic="0";
	if(document.getElementById('isPublic').checked)
		isPublic="1";

	var //url2Hit=zcServletPrefix+"/custom/JSON/system/isFilterNameExists.htm?entityName="+entityName4Filter+"&filterName="+filterName.value+"&isPublic="+isPublic;
	url2Hit="/atCRM/custom/JSON/system/isFilterNameExists.htm?entityName="+entityName4Filter+"&filterName="+filterName.value+"&isPublic="+isPublic;
	$.ajax({
		type: "GET",
		url:url2Hit,
		dataType: "json",
		success: function (data)
		{
			if(data.filter_id!="0")
			{
				filterName.className='formTextError';				
				document.getElementById('filterErrorDiv').style.display="block";
				document.getElementById('filterErrorDiv').innerHTML='<table width="100%"><tr><td width="25px" valign="middle" align="center"><span class="ui-iconBlack ui-icon-alert" style="margin-right: 5px;float: left;"></span></td><td>This Filter Name is already existing.</td></tr></table>';
				returnStatus=false;
			}
		}
	});
	return returnStatus;
}

//Save filter in filter_string table
function saveFilterCriteria(filterId4Filter,fnc,fromOnLoad)
{
	var msg="";
	var allFieldMsg="";
	var getSearchfield="";
	var getSearchCondFld="";
	var getSearchTxtFld="";
	var getMatch="";
	
	if(fnc!='search')
	{
		//Mandatory filter name in Add/Edit Filter mode
		var filterName=$.trim(document.getElementById('filterName').value);
		filterType='user';
		if(filterId4Filter==""||filterId4Filter==0){
			if(!checkFilterName(document.getElementById('filterName')))
				return false;
		}
		var isPublic="0";
		if(document.getElementById('isPublic').checked==true)isPublic="1";

		if(filterName==""){
			document.getElementById('filterName').style.border="1px solid #CC0000";
			msg="<li>Filter name should not be empty</li>";
		}
		else
			document.getElementById('filterName').style.border="1px solid #AAAAAA";
	}
	else
	{
		//Filter name auto generated in Mass functions case
		var filterName="filter_"+entityName4Filter+parent.session_login;
		var isPublic="0";
		filterType='system';
		
		//Delete previous filter if any for the auto generated name
		$.ajax({
		type: "GET",
		//url: zcServletPrefix+"/custom/JSON/system/deleteFilterString.html?filterName="+filterName,
		url: "/atCRM/custom/JSON/system/deleteFilterString.html?filterName="+filterName,
		sync:true});
	}

	if(!fromOnLoad)	
	{
		//Validation Before saving filter
		var fltrCnd="<filter><description value=\""+filterName+"\"/><entityName value=\""+entityName4Filter+"\"/><orTerm>";
		for (srchFldCntrCnt=0; srchFldCntrCnt<srchFldCntrArray.length; srchFldCntrCnt++)
		{
			getSearchfield=document.getElementById("searchfield"+srchFldCntrArray[srchFldCntrCnt]).value;
			getSearchCondFld=document.getElementById("searchCondFld"+srchFldCntrArray[srchFldCntrCnt]).value;
			getSearchTxtFld=$.trim(document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]).value);		
			{
				if(srchFldCntrCnt==0 && (getSearchfield==""))
				{
					allFieldMsg="<li>Please select field and enter data for it.</li>";
					if(getSearchfield=="")
						document.getElementById("searchfield"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #CC0000";
					else
						document.getElementById("searchfield"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #AAAAAA";

					if(getSearchTxtFld=="")
						document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #CC0000";
					else
						document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #AAAAAA";

					fltrCnd+="<andTerm>";
					fltrCnd+="<attribute value=\""+getSearchfield+"\"/>";
					fltrCnd+="<operator value=\""+getSearchCondFld+"\"/>";
					fltrCnd+="<value value=\""+getSearchTxtFld+"\"/>";
					fltrCnd+="</andTerm>";
				}
				else if(getSearchfield!="" && getSearchTxtFld=="")
				{
					allFieldMsg="<li>Please enter data for the selected field.</li>";
					document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #CC0000";
					if(document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"txt"))
						document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"txt").style.border="1px solid #CC0000";
					if(document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"_date_value"))
						document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"_date_value").style.border="1px solid #CC0000";
					if(document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"_time_value"))
						document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]+"_time_value").style.border="1px solid #CC0000";
				}
				else if(getSearchfield!="" && getSearchTxtFld!="")
				{
					document.getElementById("searchTxtFld"+srchFldCntrArray[srchFldCntrCnt]).style.border="1px solid #AAAAAA";
					fltrCnd+="<andTerm>";
					fltrCnd+="<attribute value=\""+getSearchfield+"\"/>";
					fltrCnd+="<operator value=\""+getSearchCondFld+"\"/>";
					fltrCnd+="<value value=\""+getSearchTxtFld+"\"/>";
					fltrCnd+="</andTerm>";
				}
			}
		}
		fltrCnd+="</orTerm></filter>";
		msg+=allFieldMsg;
		if(msg)
		{
			document.getElementById('filterErrorDiv').innerHTML="Please correct these errors.<ul>"+msg+"</ul>";
			document.getElementById('filterErrorDiv').style.display="block";
			return false;
		}
		else
		{
			document.getElementById('filterErrorDiv').style.display="none";
			document.getElementById('filterSubmitDiv').className='submit working';

		}
	}

	if(filterId4Filter)
		var url2Hit = "/atCRM/custom/JSON/add/filters/editAction?0-1-2="+filterId4Filter+"&0-1-3="+filterName+"&0-1-4="+fltrCnd+"&0-1-5="+entityName4Filter+"&0-1-27="+isPublic;
		//var url2Hit = zcServletPrefix+"/custom/JSON/add/filters/editAction?0-1-2="+filterId4Filter+"&0-1-3="+filterName+"&0-1-4="+fltrCnd+"&0-1-5="+entityName4Filter+"&0-1-27="+isPublic;
	else 
		var url2Hit = "/atCRM/custom/JSON/add/filterString.htm?filterName="+filterName+"&fltrCnd="+fltrCnd+"&entityName4Filter="+entityName4Filter+"&filterType="+filterType+"&isPublic="+isPublic;
		//var url2Hit=zcServletPrefix+"/custom/JSON/add/filterString.htm?filterName="+filterName+"&fltrCnd="+fltrCnd+"&entityName4Filter="+entityName4Filter+"&filterType="+filterType+"&isPublic="+isPublic;

		$.ajax({
		type: "get",
		url:url2Hit,
		sync:true,
		dataType: "json",
		success: function (data)
		{
			if(fnc=='search')
			{
				var filterID= data.filterID;	
				if(list2Load)
					var pagUrl=zcServletPrefix+list2Load;
				else
					var pagUrl=parent.document.getElementById(parent.mnuItmId+'-URL').value;
				var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
				
				var mainUrlPath=pagUrl.substring(0,quesIndex); 
				
				var mainUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length);
				var mainUrlParms=changeParameterValue (mainUrlParms,'filterName',filterID);	
				
				mainUrlParms=deleteParameter (mainUrlParms,'page__number__1');
				mainUrlParms=deleteParameter (mainUrlParms,'page__size__1');
				mainUrlParms=deleteParameter (mainUrlParms,'list__column__width');
				pagUrl=mainUrlPath+"?"+mainUrlParms;		
				callSearchResult(pagUrl);
			}
		}
	});		
	if(fnc!='search'){setTimeout("cancelFilterCriteria();",500);}
}

//Show data that satisfies filter in the below section in mass functions case.
function callSearchResult(pagUrl)
{
	if(document.getElementById('simpleJSONList'))
		document.getElementById('simpleJSONList').value=pagUrl;
	else
		CreateHIDDEN(document.getElementById('detailDataDiv'),'','simpleJSONList',pagUrl);

	$.ajax({
	type: "GET",
	url: pagUrl,
	sync:true,
	cache: false,
	success: function (data)
	{
		data=ReplaceAll(ReplaceAll(ReplaceAll(data,"\r",""),"\n"," "),"\t","");
		doc = JSON.parse(data,function(key,value){
			var type;
			if (value && typeof value === 'object')
			{
				type = value.type;
				if (typeof type === 'string' && typeof window[type] === 'function'){
					return new (window[type])(value);
				}
			}
			return value;
		}); 		
		createListData(doc,'addEditDiv',pagUrl);
		document.getElementById('filterSubmitDiv').className='submit';
	}
	});	
}

function getScreenSize(width_or_height){
	var myWidth;
	var myHeight;
	if( typeof( window.innerWidth ) == 'number' ) { 	//Non-IE 
		myWidth = window.innerWidth;
		myHeight = window.innerHeight; 
	}
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {	//IE 6+ in 'standards compliant mode' 
		myWidth = document.documentElement.clientWidth; 
		myHeight = document.documentElement.clientHeight; 
	}
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 	//IE 4 compatible 
		myWidth = document.body.clientWidth; 
		myHeight = document.body.clientHeight; 
	} 
	if(width_or_height=='height'){
		return myHeight;
	}
	else if(width_or_height=='width'){
		return myWidth;
	}
}