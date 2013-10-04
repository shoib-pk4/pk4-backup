var currEntt;
var prevSortParams;
var xhr_request;
var container_json;
var data_json;
var reptId = 0;
var data_view_id_string;

function handleCommonList(data) {

	container_json = data;
	if (reptId == 0) reptId = container_json.report_id;
	closeLoadingDiv();	
	var adListDiv=document.getElementById(subMnuItmId+'-adList');

	//Create hidden fields to store report level values
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	var reportId = getParameterValue(pagUrl,'rept_id');
	if (!reportId) {
		reportId = container_json.report_id;
	}
	var field=getParameterValue(pagUrl,'field');
	var userEnt=getParameterValue(pagUrl,'userEnt');
	if(!document.getElementById(subMnuItmId+'-reportId'))CreateHIDDEN(adListDiv, '', subMnuItmId+'-reportId',reportId); 
	else document.getElementById(subMnuItmId+'-reportId').value = reportId;
	if(!document.getElementById(subMnuItmId+'-reportField'))CreateHIDDEN(adListDiv, '', subMnuItmId+'-reportField',field); 
	else if(field)document.getElementById(subMnuItmId+'-reportField').value = field;
	if(!document.getElementById(subMnuItmId+'-reportUserEnt'))CreateHIDDEN(adListDiv, '', subMnuItmId+'-reportUserEnt',userEnt); 
	else if(userEnt)document.getElementById(subMnuItmId+'-reportUserEnt').value = userEnt;
	if(!document.getElementById(subMnuItmId+'-reportUrl'))CreateHIDDEN(adListDiv, '', subMnuItmId+'-reportUrl');		
	if(!document.getElementById(subMnuItmId+'-sortVal'))CreateHIDDEN(adListDiv, '', subMnuItmId+'-sortVal');

	//Check for the main table of list before creating. If table found, rewrite only data.
	if(!document.getElementById(subMnuItmId+"-lstTbl")) {
		var mainTable=CreateTable(adListDiv,'',subMnuItmId+'-lstTbl','','0','0');
		mainTable.paddingLeft="2px";
		var mainBody=CreateBody(mainTable); 
		mainTable.width='100%';
		
		//Create area for page caption and help text
		var listTitleTr=CreateTR(mainBody);
		var listTitleTd=CreateTD(listTitleTr,'pageTitleTd');			
		var listTitleDiv=CreateDIV(listTitleTd,'title-div',subMnuItmId+"-lstHdr",'','100%');
		var listDescDiv=CreateDIV(listTitleTd,'grayTxt',subMnuItmId+'-desc');
		currEntt = data.EntityName;
		fillViewsInMenu("",data);

		//Create area for page top menu items
		var topMenuTableTD=CreateTD(listTitleTr);
		var topMenuTable=CreateTable(topMenuTableTD,'','','','0','0');
		topMenuTable.setAttribute('width','100%');
		var topMenuBody=CreateBody(topMenuTable); 
		var topMenuTr=CreateTR(topMenuBody);
		var topMenuTd=CreateTD(topMenuTr);
		var topMenuDv=CreateUL(topMenuTd,'menu-ul',subMnuItmId+'topMenuDiv','','100%');					
		var helpTr=CreateTR(topMenuBody);				
		var helpTd=CreateTD(helpTr,'',subMnuItmId+'-helpTd','','right');

		//Create area for listdata
		var dataTr=CreateTR(mainBody);
		var dataTd=CreateTD(dataTr,'',subMnuItmId+'-lstTd');
		dataTd.colSpan="2";

		//Create area for pagination
		var bottomMenuTr=CreateTR(mainBody);
		var bottomMenuTd=CreateTD(bottomMenuTr);
		var LstPgnDiv=CreateDIV(bottomMenuTd,'pagination',subMnuItmId+'LstPgnDiv','','100%');				
		bottomMenuTd.colSpan="2";
	
		listPageMenuItems(data);

		// Get the actual data
		if (data.addl_options == "anyList") {
			retrieveListData(data.addl_options,data.report_id);
		}

	} else {
		document.getElementById(subMnuItmId+"-adList").style.display="block";
		if(reportId!=document.getElementById(subMnuItmId+'-reportId') || document.getElementById(subMnuItmId+'-reportField') != field || document.getElementById(subMnuItmId+'-reportUserEnt') != userEnt) {
			retrieveListData();
		}
	}
}

function fillViewsInMenu(action,data) {
	if (typeof data == "undefined") {
		var reptId4MnuItm = 0;
	} else {
		var reptId4MnuItm = data.report_id;
	}
	var elem=document.getElementById(subMnuItmId+"-lstHdr");
	elem.innerHTML="";
	if (container_json.addl_options != 'anyList') {
		var url=zcServletPrefix+"/custom/JSON/list/viewsForEntity.htm?entityName="+currEntt;
		var optns="";
		$.getJSON(url, function(doc) {
				var viewsList=doc.views;
				var orgOpt=0;
				var nonorgOpt=0;
				var myOpt=0;
				for (var i=0; i<viewsList.length; i++) {
					var viewId=viewsList[i].viewId;
					var forOrg=viewsList[i].forOrg;
					var forUser=viewsList[i].forUser;
					var crtdUser=viewsList[i].crtdUser;
					var adQuery=viewsList[i].query;
					if(viewId == reptId) var sltd="selected";
					else var sltd="";
					if(forUser == session_login) {	
						if(myOpt==0) optns+='<optgroup label="My Data Views">';
						myOpt++;
						optns += "<option value='"+viewId+"--"+crtdUser+"--"+adQuery+"' "+sltd+">" + viewsList[i].viewName + "</option>";
					} else if(forOrg) {	
						if(nonorgOpt==0)optns+='<optgroup label="Shared Data Views">';nonorgOpt++;
						if(crtdUser==session_login)
							optns+="<option value='"+viewId+"--"+crtdUser+"--"+adQuery+"' "+sltd+" style='color:green'>"+viewsList[i].viewName+"</option>";
						else
							optns+="<option value='"+viewId+"--"+crtdUser+"--"+adQuery+"' "+sltd+" style='color:#4e4e4e'>"+viewsList[i].viewName+"</option>";
					} else {
						if(orgOpt==0)optns+='<optgroup label="Default Data Views">';orgOpt++;
						optns+="<option value='"+viewId+"--"+crtdUser+"--"+adQuery+"' "+sltd+">"+viewsList[i].viewName+"</option>";
					}
				}
				if(reptId4MnuItm){
					elem.innerHTML='<select id="'+subMnuItmId+'-Title" class="title-select_wtDfltCrs" style="padding-right:55px;display:none !important;">'+optns+'</select><label id="'+subMnuItmId+'-dataCount" class="descTxt"></label><label id="'+subMnuItmId+'-byTypeStage" class="altrTitleLabel"></label><div id="'+subMnuItmId+'-titleLinks" style="position:;margin-top:-10px"></div>';
					$('#'+subMnuItmId+'-Title').each(function() {
						var title = $(this).attr('title');
						var titleSpan=$('#'+subMnuItmId+'-TitleSpan');
						if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
						$(this).css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
							.after('<span class="title-select_woBgImg" style="padding-right:55px" id="'+subMnuItmId+'-TitleSpan">' + title + '</span>')
							.change(function(){
							val = $('option:selected',this).text();
							data_view_id_string = $('option:selected',this).val();
							$('#'+subMnuItmId+'-TitleSpan').text(val);
							retrieveListData('changeView');
							})
					});
				}else{
					elem.innerHTML='<select id="'+subMnuItmId+'-Title" class="title-select" style="padding-right:55px;">'+optns+'</select><label id="'+subMnuItmId+'-dataCount" class="descTxt"></label><label id="'+subMnuItmId+'-byTypeStage" class="altrTitleLabel"></label><div id="'+subMnuItmId+'-titleLinks" style="position:;margin-top:-10px"></div>';//display: block important;
					$('#'+subMnuItmId+'-Title').each(function() {
						var title = $(this).attr('title');
						var titleSpan=$('#'+subMnuItmId+'-TitleSpan');
						if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
						$(this).css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
							.after('<span class="title-select" style="padding-right:55px;" id="'+subMnuItmId+'-TitleSpan">' + title + '</span>')
							.change(function(){
							val = $('option:selected',this).text();
							data_view_id_string = $('option:selected',this).val();
							$('#'+subMnuItmId+'-TitleSpan').text(val);
							retrieveListData('changeView');
							populateTitleLinks();})
					});
				}
				retrieveListData(action);
				populateTitleLinks();
		})
		.fail(function() { 
			alert("Error getting list of Data Views" ); 
			})
		.always(function() {
			if(reptId4MnuItm && action!='changeView')
				document.getElementById(subMnuItmId+'-Title').disabled = true;
			});
	} else {
		elem.innerHTML='<label id="'+subMnuItmId+'-Title" style="padding-right:55px"></label><label id="' + subMnuItmId + '-dataCount" class="descTxt" style="vertical-align:bottom"></label><label id="'+subMnuItmId+'-byTypeStage" class="altrTitleLabel"></label><span style="padding-right:55px" id="' + subMnuItmId + '-TitleSpan">' + container_json.PageCaption + '</span>';
	}
}

function retrieveListData(action,paramVal,DispTxt, filterParm) {

	var url2call;
	if (xhr_request) xhr_request.abort();
	openLoadingDiv();
	var pageTitle = $('#'+subMnuItmId+'-Title option:selected').text()+' - Impel';
	document.title=pageTitle;

	if (container_json.addl_options == "anyList" || container_json.addl_options == "adhocList" || container_json.addl_options == "view") {
		reptId = container_json.report_id;
	} else {
		if (typeof data_view_id_string == "undefined") {
			reptId=document.getElementById(subMnuItmId+'-Title').value.split('--')[0];
			var adQuery=document.getElementById(subMnuItmId+'-Title').value.split('--')[2];
		} else {
			reptId = data_view_id_string.split('--')[0];
			var adQuery = data_view_id_string.split('--')[2];
		}
	}
	
	var url = zcServletPrefix+"/custom/JSON/list/adhocList.htm?rept_id=" + reptId;

	
	if (container_json.addl_options == 'anyList') {
		url += '&aL=1';
	}

	document.getElementById(subMnuItmId+'-reportId').value = reptId;
	if(adQuery == "") {
		document.getElementById('commonErrorDiv').innerHTML="Your Data View needs at least one column to be selected to work reliably.";
		closeLoadingDiv();
		document.getElementById('commonErrorDiv').style.display="block";
		return false;
	} else 
		hideErrorDiv();

/*  Hack: Fix to deal with report ID not being passed to data views  - Kishore, 5 Jun 2013 
	url2call = document.getElementById(subMnuItmId+'-reportUrl').value;                 */
	if (typeof url2call == "undefined" || url2call == "") {
				if (document.getElementById(subMnuItmId+'-reportUrl').value != "") {url2call = document.getElementById(subMnuItmId+'-reportUrl').value;}
				else {url2call = url;}
	}
	if (document.getElementById(subMnuItmId+'-reportUrl').value == "") {
		document.getElementById(subMnuItmId+'-reportUrl').value = url;
		url2call = url;
	} else
		document.getElementById(subMnuItmId+'-reportUrl').value = changeParameterValue(document.getElementById(subMnuItmId+'-reportUrl').value,'rept_id',reptId,true);

	document.getElementById(subMnuItmId+'searchTxt').style.borderColor="#DDDDDD #DDDDDD #BBBBBB"; 
	switch (action) {
		case "changeView":
						document.getElementById(subMnuItmId+'-lstTd').innerHTML="";
						document.getElementById(subMnuItmId+'-dataCount').innerHTML="";

						var searchParam=getParameterValue(url2call,'search_str');
						if(searchParam) {
							url2call=deleteParameter (url2call,'search_str',true);
							document.getElementById(subMnuItmId+'searchTxt').style.borderColor="#DDDDDD #DDDDDD #BBBBBB"; 
							document.getElementById(subMnuItmId+'searchImg').style.visibility="hidden"; 
							document.getElementById(subMnuItmId+'searchTxt').value="";
							document.getElementById(subMnuItmId+'searchTxt').focus();
							document.getElementById(subMnuItmId+'searchTxt').blur();
						}

						var orderParam=getParameterValue(url2call,'order_by');
						if(orderParam) {
							url2call=deleteParameter (url2call,'order_by',true);
							document.getElementById(subMnuItmId+'-sortVal').value="";
						}
						url2call = deleteParameter (url2call,'page_no',true);
						url2call = changeParameterValue(url2call,'rept_id',reptId,true);
						break;

		case "orderBy":
						url2call=changeParameterValue(url2call,'order_by',paramVal,true);
						break;	

		case "paginate":
						url2call=changeParameterValue(url2call,'page_no',paramVal,true);
						break;

		case "search":
						if(paramVal!='') {
							url2call=changeParameterValue(url2call,'search_str',paramVal,true);
							url2call = deleteParameter (url2call,'page_no',true);
							document.getElementById(subMnuItmId+'searchImg').style.visibility="visible"; 
						} else {
							url2call=deleteParameter (url2call,'search_str',true);
							document.getElementById(subMnuItmId+'searchTxt').style.borderColor="#DDDDDD #DDDDDD #BBBBBB"; 
							document.getElementById(subMnuItmId+'searchImg').style.visibility="hidden"; 
							document.getElementById(subMnuItmId+'searchTxt').value=DispTxt;
						}
						document.getElementById(subMnuItmId+'-dataCount').innerHTML="";
						break;
	}

	var widthOfSelect = document.getElementById(subMnuItmId+'-TitleSpan').offsetWidth;
	document.getElementById(subMnuItmId+'-desc').style.position='absolute';
	document.getElementById(subMnuItmId+'-desc').style.marginTop='-30px';
	document.getElementById(subMnuItmId+'-desc').style.marginLeft=widthOfSelect+10+'px';

	if(document.getElementById(subMnuItmId+'-reportField').value && document.getElementById(subMnuItmId+'-reportUserEnt').value) {
		url2call=changeParameterValue(url2call,'userEnt',document.getElementById(subMnuItmId+'-reportUserEnt').value,true);
		url2call=changeParameterValue(url2call,'field',document.getElementById(subMnuItmId+'-reportField').value,true);
		
		if(document.getElementById(subMnuItmId+'-reportField').value=="type")var typeOrStage="Type";else if(document.getElementById(subMnuItmId+'-reportField').value=="stage")var typeOrStage='Stage';else if(document.getElementById(subMnuItmId+'-reportField').value=="status")var typeOrStage='Status';
		
		if(typeOrStage) {
			var title="By "+typeOrStage+" - "+document.getElementById(subMnuItmId+'-reportUserEnt').value;
			document.getElementById(subMnuItmId+'-byTypeStage').innerHTML=title;				
			document.getElementById(subMnuItmId+'-desc').style.marginTop='-15px';
			var leftSpacing=widthOfSelect+10;
			document.getElementById(subMnuItmId+'-byTypeStage').style.left=leftSpacing+'px';
		}
	} else {
		url2call = deleteParameter (url2call,'userEnt',true);
		url2call = deleteParameter (url2call,'field',true);
		if (action != 'anyList') {
			document.getElementById(subMnuItmId+'-byTypeStage').innerHTML="";
		}
	}
	document.getElementById(subMnuItmId+'-reportUrl').value=url2call;

	if(filterParm !== undefined)
		 url2call += filterParm;

	xhr_request = $.ajax({
		type: "GET",
		url: url2call,
		success: function (data) {
			var loginPage = data.indexOf("<title>Impel login page</title>");
			var errorPage = data.indexOf("<title>Something wrong!</title>");
			
			if(loginPage>0) {
				window.location.href=zcServletPrefix+"/index.html?fromUdm=custom/JSON/homePage.html";
			} else if (errorPage>0) {
				errorInProcess("Getting list data failed. Syslog has been written. We'll fix this ASAP.");
				return;
			} else {
				data=ReplaceAll(data,"\t","");
				data=ReplaceAll(data,"\n"," ");
				data=ReplaceAll(data,"\r","");
				data=ReplaceAll(data,"\xa0"," ");
				doc = JSON.parse(data,function (key,value) {
					var type;
					if (value && typeof value === 'object') {
						type = value.type;
						if (typeof type === 'string' && typeof window[type] === 'function') {
							return new (window[type])(value);
						}
					}
					return value;
				});
				json_data_response = doc;
				listPageData(doc);
				listPagination(doc.PagingAmount,doc.PageNumber,doc.RowData.length,action,doc.AddUrl,doc.TableName,url2call);	
				closeLoadingDiv();
			}
		}
	});	
}

function populateTitleLinks() {
	var viewId = document.getElementById(subMnuItmId+'-Title').value.split('--')[0];
	var crtdUser = document.getElementById(subMnuItmId+'-Title').value.split('--')[1];
	if (container_json.addl_options != 'anyList' &&  !container_json.report_id) {
		if(crtdUser == session_login){
			document.getElementById(subMnuItmId+'-titleLinks').innerHTML="<a href='javascript:show_add_adhoc_view();' class='titleLinks' title='Add a new Data View'>Add New</a> | <a href='javascript:config_adhoc_view("+viewId+");' class='titleLinks' title='Edit this Data View'>Edit</a> | <a href='javascript:clone_adhoc_view("+viewId+");' class='titleLinks' title='Clone this system Data View'>Clone</a> | <a href='javascript:delete_confirm_adhoc_view("+viewId+");' class='titleLinks' title='Delete this Data View'>Delete</a> | <a href='javascript:add_as_menu_adhoc_view("+viewId+");' class='titleLinks' title='Add this data view as menu '>Add as menu</a>";
		}
		else
			document.getElementById(subMnuItmId+'-titleLinks').innerHTML="<a href='javascript:show_add_adhoc_view();' title='Add a new Data View' class='titleLinks'>Add New</a> | <a href='javascript:clone_adhoc_view("+viewId+");' class='titleLinks' title='Clone this system Data View'>Clone</a>";
	}
}

function show_add_adhoc_view() {
	document.getElementById("commonPopupDiv").innerHTML = "";
	$( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title:'Add a new Data View',
			width:500,
			height:350
	});
	document.getElementById("commonPopupDiv").innerHTML ='<div style="padding-bottom:5px"><label class="normal_font" style="width:100px;display:inline-table">Name</label><input type = "text" maxlength="40" class="normal_font dashb_txt_class" id = "add_adhoc_view_name" style="width:300px"></input></div><div style="padding-bottom:5px"><label class="normal_font" style="width:100px;display:inline-table">Description&nbsp;&nbsp;</label><textarea id="add_adhoc_view_desc" class="normal_font" rows = "6" cols = "45" style="width:300px"></textarea><div><div style="padding-bottom:5px"><input type="radio" id="add_adhoc_view_for_org" checked="checked" name="OrgUpdate"/><label class="normal_font" for="add_adhoc_view_for_org" style="padding-left:25px;display:inline-block">Show this Data View to all users</label></div><div style="padding-bottom:5px"><input type="radio" id="add_adhoc_view_for_user" name="OrgUpdate"/><label class="normal_font" for="add_adhoc_view_for_user" style="padding-left:25px;display:inline-block">Show this Data View only to me</label></div></div><div style="padding-right:15px;float:right"><input type="button" class="ui-widget" style="width:50px" onclick = "submit_adhoc_view()" value="Add"/></div>';
}

 function submit_adhoc_view()
 {
	document.getElementById('add_adhoc_view_name').value=document.getElementById('add_adhoc_view_name').value.trim();
	if(document.getElementById('add_adhoc_view_name').value)
	{
		if(document.getElementById('add_adhoc_view_for_user').checked==true)var url=zcServletPrefix+"/custom/JSON/add/adhocView/editAction?0-1-3="+document.getElementById('add_adhoc_view_name').value+"&0-1-4="+document.getElementById('add_adhoc_view_desc').value+"&0-1-5="+currEntt+"&0-1-57="+session_login;
		else var url=zcServletPrefix+"/custom/JSON/add/adhocView/editAction?0-1-3="+document.getElementById('add_adhoc_view_name').value+"&0-1-4="+document.getElementById('add_adhoc_view_desc').value+"&0-1-5="+currEntt;

		$.getJSON(url, function(doc)
		{
			config_adhoc_view(doc.addedId,document.getElementById('add_adhoc_view_name').value);
		});
	}
	else
	{
		alert('Please enter name for the Data View.');
		document.getElementById('add_adhoc_view_name').focus();
	}
 }

function config_adhoc_view(id,viewName)
{
	document.getElementById("commonPopupDiv").innerHTML = "<div id='load_config_adhoc_view' style='text-align: center; margin-top: 30px; display: block; width: 95%; position: absolute;'><img src='/atCRM/images/JSON/loading.gif'><br><br>Loading Data View definition..</div>";
	if(viewName)var dialogTitle=viewName;else var dialogTitle='Data View definition - '+$('#'+subMnuItmId+'-Title option:selected').text();
	if(document.getElementById(subMnuItmId+'-reportId'))document.getElementById(subMnuItmId+'-reportId').value=id;
	
	$( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title:dialogTitle,
			width:900,
			height:600,
			closeOnEscape: false,
			position: 'center'
	});
	var url=zcServletPrefix+'/custom/adhocReports/eView.html?id='+id;
	$('#commonPopupDiv').append($("<iframe />").attr({src:url,width:'100%',height:'99%',frameBorder:'0',style:'overflow:auto', id:'config_adhoc_view_frame'}));
 }

function resetAllOnadhocView()
{
	fillViewsInMenu('changeView');
}

function delete_confirm_adhoc_view(id)
{
	var dialogTitle='Delete - '+$('#'+subMnuItmId+'-Title option:selected').text();
	document.getElementById("commonPopupDiv").innerHTML='Are you sure you want to delete the data view "'+$('#'+subMnuItmId+'-Title option:selected').text()+'"<div style="padding:30px 15px 0 0;float:right"><input type="button" class="ui-widget" style="width:50px;margin:5px" onclick ="delete_adhoc_view('+id+');" value="Yes"/><input type="button" class="ui-widget" style="width:50px;margin:5px" onclick ="closeCommonPopup();" value="No"/></div>';
	$('#commonPopupDiv').dialog({
			resizable:false,
			autoOpen:true,
			modal: true,
			title:dialogTitle,
			width:350,
			height:150
	});
 }

function delete_adhoc_view(id) 
{
	 var url=zcServletPrefix+"/custom/JSON/admin/deleteReport.html?id="+id;
	 $.ajax({type: "GET",url: url,success: function (){fillViewsInMenu('changeView');closeCommonPopup();}});
}
 function clone_adhoc_view(id)
 {
	 var dialogTitle='Clone - '+$('#'+subMnuItmId+'-Title option:selected').text();
	 $( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title:dialogTitle,
			width:900,
			height:600
	});
	 var url=zcServletPrefix+"/custom/JSON/admin/cloneReport.html?id="+id;
	 $.getJSON(url, function(doc)
			{
				config_adhoc_view(doc.addedId);
			}
	);
 }

 function add_as_menu_adhoc_view(id)
 {		
	 var dataTitle =  $('#'+subMnuItmId+'-Title option:selected').text();
	 var descVal = $('div.grayTxt').text();
	 $( "#commonPopupDiv" ).html('');
	 var ViewdialogTitle = 'Add <span style=\'font-weight:bold;color:blue;\'>'+dataTitle+'</span> as menu item';
	 $( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title: ViewdialogTitle,
			width:600,
			height:450,
			close: function()
					{
						$( "#commonPopupDiv" ).html(''); 
						$("#smartSuggestDiv").html('').hide();
					}
	});
			
			var urltxtMenuItem=zcServletPrefix+"/custom/JSON/system/getParentMenuItems.htm?userId="+session_login;
	$.ajax({
			type: "GET",		
			url:urltxtMenuItem,
			dataType: "json",
			success: function (doc)
			{  
				$('#commonPopupDiv').append('<div><table cellpaddind=\'3\' cellspacing=\'3\' style=\'text-align:justify;\'><tr><td width=\'28\'><img src=\'/atCRM/images/JSON/info3.gif\' style=\'width:25px;\' /></td><td>Click on any of the items below to add current Data View as a submenu item.</td></tr><tr><td><img src=\'/atCRM/images/JSON/info3.gif\' style=\'width:25px;\' /></td><td>Click on the username below to choose a different user, if you want to give this Data View to someone else.</td></tr><tr><td colspan=\'2\' align=\'center\'><label id=\'click_to_change\' style=\'color:gray;padding:2px;border-bottom: 1px dotted gray;padding-bottom: 0px;display:inline-block;cursor:pointer;\'>'+G_userName+'</label><input type=\'hidden\' name=\'contctName\' id=\'contctName\' size=\'45\' value=\''+session_login+'\' data-prev=\'\'><input id=\'getMenu\' type=\'hidden\' style=\'margin-left:6px;margin-top:5px;display:inline;\' value=\'getMenus\' ></td></tr></table></div><div id=\'userMenus\'  style=\'height:285px;overflow-y: scroll;\'></div>'); 
					var menuLists=doc['menuLists'];
					var allMenuLists=menuLists["joinAllmenuLists"];
					var menuItemWithId = new Array();
					menuItemWithId = allMenuLists.split('~)');
					for( var mnuEle in menuItemWithId)
					{
						var mItem=menuItemWithId[mnuEle].split('--');
						if(mItem[0] != '' && mItem[1] != ''){
							$('#userMenus').append("<div class='dataViewMenuRow' style='cursor:pointer;margin: 3px 10px 0px;padding: 3px 3px 3px 15px;border-width: 1px;border-style:solid;border-color:rgb(189, 215, 223);border-radius: 5px;color: black;background-color: rgb(231, 240, 243);text-align: left;-webkit-transition: all 0.1s;transition: all 0.1s;' onclick=\"add_as_menu_item("+id+","+mItem[1]+",\'"+dataTitle+"\',\'"+session_login+"\',\'"+descVal+"\');\"><span>"+mItem[0]+"</span></div>");
						}
					}
												
				$('#click_to_change').click(function(e){
					$(e.target).replaceWith('<input type=\'text\' style=\'margin-left:16px;margin-top:5px;width:250px;display:inline;\' value=\'2 chars or **\' onfocus=\'javascript:clearMessageForUserSelect(this.id);\' onkeyup=\"javascript:showContactToAddMenu(\'smartSuggestDiv\',this.id,event,this.value);listenForTabout(this,event);\" onblur=\"javascript:checknReplaceCntctVal(this.value,this.id,event);\" class=\'inputFieldClass\' id=\'contctNametxt\' name=\'contctNametxt\' data-btncheck=\'0\' >');
				});
				
				$("#getMenu").click(function(){
					setTimeout(function(){
					$('#userMenus').html('');
					var btnCheck = $("#contctNametxt").data('btncheck');
					var usrName = $("#contctNametxt").val();
					if( usrName == '' || usrName == '2 chars or **' || $("#contctName").val() == '' )
					{
						$('#userMenus').html("<span style='color:red;'>No/incorrect contact is choosed, Please choose a valid contact to add View as Menu Item.</span><div style='color:gray;cursor:pointer;' onclick='selectDeafaultUserFor();'> or Click to select default user </div>");
					}else if( btnCheck == 0){
					$("#contctNametxt").data('btncheck',1);
					var contactIDforMenu = $("#contctName").val();
					var urltxtMenuItem2=zcServletPrefix+"/custom/JSON/system/getParentMenuItems.htm?userId="+contactIDforMenu;
					$.ajax({
						type: "GET",		
						url:urltxtMenuItem2,
						dataType: "json",
						success: function (doc2)
							{
							var menuLists=doc2['menuLists'];
							var allMenuLists=menuLists["joinAllmenuLists"];
							var menuItemWithId = new Array();
							menuItemWithId = allMenuLists.split('~)');
							for( var mnuEle in menuItemWithId)
								{
									var mItem=menuItemWithId[mnuEle].split('--');
									if(mItem[0] != '' && mItem[1] != ''){
									$('#userMenus').append("<div class='dataViewMenuRow' style='cursor:pointer;margin: 3px 10px 0px;padding: 3px 3px 3px 15px;border-width: 1px;border-style:solid;border-color:rgb(189, 215, 223);border-radius: 5px;color: black;background-color: rgb(231, 240, 243);text-align: left;-webkit-transition: all 0.1s;transition: all 0.1s;' onclick=\"add_as_menu_item("+id+","+mItem[1]+",\'"+dataTitle+"\',\'"+contactIDforMenu+"\',\'"+descVal+"\',\'"+usrName+"\');\"><span>"+mItem[0]+"</span></div>");
									}
								}
					
							$(".dataViewMenuRow").mouseenter(function(e){

							$(e.target).closest('.dataViewMenuRow').css({'margin':'3 auto','padding':' 3px 3px 3px 15px','border-width':' 1px','border-style':' solid','border-color':' rgb(189, 215, 223)','border-radius':' 5px','background-color':'rgb(18, 162, 162)','text-align':' left','-webkit-transition':'all 0.1s','-moz-transition':'all 0.1s','transition':'all 0.1s','color': 'whitesmoke','-webkit-box-shadow':'0px 5px 10px rgb(61, 59, 59)','-moz-box-shadow':'0px 5px 10px rgb(61, 59, 59)','box-shadow':'0px 5px 10px rgb(61, 59, 59)'});
							}).mouseleave(function(e){

							$(e.target).closest('.dataViewMenuRow').css({'margin':' 3px 10px 0px','padding':' 3px 3px 3px 15px','border-width':' 1px','border-style':' solid','border-color':' rgb(189, 215, 223)','border-radius':' 5px','background-color':' rgb(231, 240, 243)','color':'black','text-align':' left','-webkit-transition':' all 0.1s','transition':' all 0.1s','-webkit-box-shadow':'0px 0px 0px rgb(173, 224, 222)','-moz-box-shadow':'0px 0px 0px rgb(173, 224, 222)','box-shadow':'0px 0px 0px rgb(173, 224, 222)'});

							});
							},
						complete : function(response){
								if( response.responseText.indexOf('<title>Impel login page') > -1 ){checkForSessionValidity(response);}
							}			
						});
					}
					$("#smartSuggestDiv").hide();
					},155);
				});
				$(".dataViewMenuRow").mouseenter(function(e){

				$(e.target).closest('.dataViewMenuRow').css({'margin':'3 auto','padding':' 3px 3px 3px 15px','border-width':' 1px','border-style':' solid','border-color':' rgb(189, 215, 223)','border-radius':' 5px','background-color':'rgb(18, 162, 162)','text-align':' left','-webkit-transition':'all 0.1s','-moz-transition':'all 0.1s','transition':'all 0.1s','color': 'whitesmoke','-webkit-box-shadow':'0px 5px 10px rgb(61, 59, 59)','-moz-box-shadow':'0px 5px 10px rgb(61, 59, 59)','box-shadow':'0px 5px 10px rgb(61, 59, 59)'});
				}).mouseleave(function(e){

				$(e.target).closest('.dataViewMenuRow').css({'margin':' 3px 10px 0px','padding':' 3px 3px 3px 15px','border-width':' 1px','border-style':' solid','border-color':' rgb(189, 215, 223)','border-radius':' 5px','background-color':' rgb(231, 240, 243)','color':'black','text-align':' left','-webkit-transition':' all 0.1s','transition':' all 0.1s','-webkit-box-shadow':'0px 0px 0px rgb(173, 224, 222)','-moz-box-shadow':'0px 0px 0px rgb(173, 224, 222)','box-shadow':'0px 0px 0px rgb(173, 224, 222)'});

				});
			},
			complete : function(response){
						if( response.responseText.indexOf('<title>Impel login page') > -1 ){
						checkForSessionValidity(response);}
			}
		});
 }

function checkForSessionValidity(response)
{
		$("#commonPopupDiv").html('');
		$("#commonPopupDiv").dialog({height:175,title:'Login session expired'});
		$('#commonPopupDiv').html("<div align='center' style='margin:0px auto;padding:10px;padding-top:30px;'>Your login session has expired </div>");
		$('#commonPopupDiv').append("<div align='center' style='margin:0px auto;'><p>Please login</p><span class=\'refreshBtn\' style='margin-left:20px;margin-top:6px;cursor:pointer;margin-right:20px;padding:3px;border:1px solid rgb(150, 190, 194);box-shadow:0px 3px 8px rgb(85, 94, 81);background:rgb(146, 196, 178);border-radius:0px 10px 0px;' onclick='reLoadPage()'>Login</span></div>");
		
		$(".refreshBtn").mouseenter(function(e){
			$(this).css({'box-shadow':'0px 5px 10px rgb(85, 94, 81)','background':'rgb(164, 201, 202)'});
		}).mouseleave(function(e){
			$(this).css({'box-shadow':'0px 3px 8px rgb(85, 94, 81)','background':'rgb(146, 196, 178)'});
		});
} 

function selectDeafaultUserFor()
{
	$("#contctNametxt").focus();
	$("#contctNametxt").val(G_userName);
	$("#contctName").val(session_login);
	$("#contctNametxt").blur();
}

function clearMessageForUserSelect(id)
{	
	eleFromId = document.getElementById(id);
	$("#contctName").val('');
	$("#contctNametxt").data('btncheck',0);
	if(eleFromId.value == '2 chars or **')eleFromId.value = '';
}

function listenForTabout(ele,evt)
{
	var keyCodeVal = (evt.which)? evt.which : evt.keyCode;
	if(keyCodeVal == 13 || keyCodeVal == 9)$("#getMenu").click();
}

function showContactToAddMenu(divName,txtId,evnt,val)
{	
	setTimeout(function(){
	if( ( $("#"+txtId).is(':focus') ) && (val.length>=2) )
		{	
			var urlString=zcServletPrefix+"/custom/JSON/smartSuggest/users.json?str="+val;
		    $.ajax({
			type	: "GET",
			url		: urlString,
			dataType: "json",
			success: function (doc)
				{	
					var temp = new Array();
					usernames=doc['PickListItems'];
					temp = usernames.split('~)');
					new AutoSuggest(divName,document.getElementById(txtId),temp);
				},
			complete : function(response){
						if( response.responseText.indexOf('<title>Impel login page') > -1 ){
						checkForSessionValidity(response);}
				}
			});
		}
	},500);
}

function checknReplaceCntctVal(cntctName,id,evt)
{  
	var keyCodeVal = (evt.which)? evt.which : evt.keyCode;
	if(keyCodeVal != 13 && keyCodeVal != 9)$("#getMenu").click();
	setTimeout(function(){$("#smartSuggestDiv").hide();},1111);
	if(cntctName=='')
		{
		document.getElementById(id).value='2 chars or **';
		}
}
 
 function add_as_menu_item(view_Id,menu_Id,dataTitle,contactIDforMenu,descVal,usrName)
 {	
	var urlString=zcServletPrefix+"/custom/JSON/system/addDataViewAsMenuItem.json?viewId="+view_Id+"&menuId="+menu_Id+"&enttName="+currEntt+"&viewName="+dataTitle+"&viewDesc="+descVal+"&userId="+contactIDforMenu;
	$.ajax({
			type: "GET",		
			url:urlString,
			dataType: "json",
			success: function (doc)
			{  	
				var menuId=doc['menuId'];
				$('#commonPopupDiv').html('');
				if(menuId == ''){
					$("#commonPopupDiv").dialog({height:175});
					$('#commonPopupDiv').html("<div align='center' style='margin:0px auto;padding:30px;'>Could not add this view as menu item</div>");
					$('#commonPopupDiv').append("<div align='center' style='margin:0px auto;'><span class=\'OkayClose\' style='margin-left:20px;margin-top:cursor:pointer;6px;margin-right:20px;padding:3px;border:1px solid rgb(150, 190, 194);box-shadow:0px 3px 8px rgb(85, 94, 81);background:rgb(146, 196, 178);border-radius:0px 10px 0px;' >Close</span></div>");
					
					$(".OkayClose").mouseenter(function(e){
						$(this).css({'box-shadow':'0px 5px 10px rgb(85, 94, 81)','background':'rgb(164, 201, 202)'});
					}).mouseleave(function(e){
						$(this).css({'box-shadow':'0px 3px 8px rgb(85, 94, 81)','background':'rgb(146, 196, 178)'});
					}).click(function(e){
						$("#commonPopupDiv").dialog("close");
					});
				}
				else if ( contactIDforMenu == session_login ){
					$("#commonPopupDiv").dialog({height:175});
					$('#commonPopupDiv').html("<div align='center' style='margin:0px auto;padding:10px;padding-top:30px;'>This view is added as menu item</div>");
					$('#commonPopupDiv').append("<div align='center' style='margin:0px auto;'><p>Refresh to see added menu item</p><span class=\'refreshBtn\' style='margin-left:20px;margin-top:6px;cursor:pointer;margin-right:20px;padding:3px;border:1px solid rgb(150, 190, 194);box-shadow:0px 3px 8px rgb(85, 94, 81);background:rgb(146, 196, 178);border-radius:0px 10px 0px;' onclick='reLoadPage()'>Refresh</span></div>");
					
					$(".refreshBtn").mouseenter(function(e){
						$(this).css({'box-shadow':'0px 5px 10px rgb(85, 94, 81)','background':'rgb(164, 201, 202)'});
					}).mouseleave(function(e){
						$(this).css({'box-shadow':'0px 3px 8px rgb(85, 94, 81)','background':'rgb(146, 196, 178)'});
					});
				} else if  ( menuId != '' && contactIDforMenu != session_login ) {
					$("#commonPopupDiv").dialog({height:175});
					$('#commonPopupDiv').html("<div align='center' style='margin:0px auto;padding:10px;padding-top:30px;'>This view is added as menu item to "+usrName+"</div>");
					$('#commonPopupDiv').append("<div align='center' style='margin:0px auto;'><span class=\'OkayClose\' style='margin-left:20px;margin-top:6px;margin-right:20px;padding:3px;border:1px solid rgb(150, 190, 194);cursor:pointer;box-shadow:0px 3px 8px rgb(85, 94, 81);background:rgb(146, 196, 178);border-radius:0px 10px 0px;' >Okay</span></div>");
					
					$(".OkayClose").mouseenter(function(e){
						$(this).css({'box-shadow':'0px 5px 10px rgb(85, 94, 81)','background':'rgb(164, 201, 202)'});
					}).mouseleave(function(e){
						$(this).css({'box-shadow':'0px 3px 8px rgb(85, 94, 81)','background':'rgb(146, 196, 178)'});
					}).click(function(e){
						$("#commonPopupDiv").dialog('close');
					});
					
				}
			},
			complete : function(response){
						if( response.responseText.indexOf('<title>Impel login page') > -1 ){
						checkForSessionValidity(response);}
			}
		});
 }
 
function reLoadPage(){
	location.reload(true);
}

function listPageMenuItems(data) {
	//Create tabs at the top the list page
	var page_topMenu=data.page_topMenu;
	var topMenuDiv=document.getElementById(subMnuItmId+'topMenuDiv');

	//Text box for search	
	var srchBoxDispTxt='Search for '+data.EntityName;
	//entity id
	var entityListId = (data.EntityList_Id !== undefined)?data.EntityList_Id:0;

	topMenuDiv.innerHTML+='<li style="width:400px;"><div class="singleFilterCont" id="singleFilterCont"><table></table><input type="button" value="go" id="singleFilterSub" style="float:left;" entityListId="'+entityListId+'" /></div></li><li class="listPageButtons" id="filterTab" style="padding:4px 4px 4px 7px;" onclick="showFilterPopUp('+entityListId+')" title="filter">More</li><li style="width:140px;"><input type="text" class="searchBox" id="'+subMnuItmId+'searchTxt"  name="'+subMnuItmId+'searchTxt" style="margin: 0px;width:120px;" value="'+srchBoxDispTxt+'" onfocus="if(this.value==\''+srchBoxDispTxt+'\')this.value=\'\'" onblur="if(this.value==\'\'){this.value=\''+srchBoxDispTxt+'\'}" onkeypress="{var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13&&this.value!=\'\')retrieveListData(\'search\',this.value);}"><img  id="'+subMnuItmId+'searchImg" src="/atCRM/images/JSON/close_gray.png" style="z-index: 1; position: absolute; margin-left: -12px;padding: 7px 0 0 0;cursor:pointer;visibility:hidden" onclick="javascript:retrieveListData(\'search\',\'\',\''+srchBoxDispTxt+'\');" title="Clear Search"></li>';

	//Refresh button
	topMenuDiv.innerHTML+="<li class=\"listPageButtons refreshButton\" onclick='retrieveListData(\"reload\");' title='Reload'>&nbsp;</li>";

	//Create Third level menu items
	for(var topMenu=0; topMenu<page_topMenu.length; topMenu++)
	{
		var mnuName=page_topMenu[topMenu].menu[0];
		var mnuDesc=page_topMenu[topMenu].menu[1];
		var mnuLink=page_topMenu[topMenu].menu[2];
		
		if(mnuLink) {
			var linkIsfunction=mnuLink.indexOf('javascript');
			if(linkIsfunction==0)var topMnuAncTxt=mnuLink;
			else var topMnuAncTxt="javascript:setUpPageParameters('"+zcServletPrefix+"/"+mnuLink+"')";
			topMenuDiv.innerHTML+="<li class=\"listPageButtons noIcon\" onclick=\""+topMnuAncTxt+"\" title=\""+mnuDesc+"\">"+mnuName+"</li>"
		}
	}
	if(data.AddUrl) {
		var addUrl = data.AddUrl;
		var addIsfunction=addUrl.indexOf('javascript');
		if(addIsfunction==0)
			var addAncTxt=addUrl;
		else {
			if(data.EntityName=="contacts"||data.EntityName=="accounts"||data.EntityName=="opportunities")
			var addAncTxt="javascript:getAddDataFrmCache('"+data.AddUrl+"','"+data.EntityName+"')";
			else{var addAncTxt="javascript:setUpPageParameters('"+addUrl+"');";}
		}
		topMenuDiv.innerHTML+='<li class="listPageButtons addButton" title="Add '+data.EntityName+'" onclick="'+addAncTxt+'">Add</li>'
	}
	listPageToolsMenu(data,topMenuDiv);
}

function listPageToolsMenu(data,topMenuTr) {
	//Create 6th level menu items as Tools menu //
	page_bottomMenu=data.page_bottomMenu;
	if(page_bottomMenu.length>0)
	{
		var bottomMenuTd=CreateLI(topMenuTr,'listToolsMenu');
		bottomMenuTd.innerHTML='Tools';
		var bottomMenuDiv=CreateDIV(bottomMenuTd);
		var bottomMenuUL = CreateUL(bottomMenuDiv,'listToolsMenuUL');

		for(var btmMenu=0; btmMenu<page_bottomMenu.length; btmMenu++)
		{
			var bottomMenuLi=CreateLI(bottomMenuUL,'listToolsMenuLi');	
			var mnuName=page_bottomMenu[btmMenu].menu[0];
			var mnuDesc=page_bottomMenu[btmMenu].menu[1];
			var mnuLink=page_bottomMenu[btmMenu].menu[2];
			var mnuOrder=page_bottomMenu[btmMenu].menu[3];
			if(mnuLink)var btmMenuAnc=CreateA(bottomMenuLi, '', "tools_"+mnuName, mnuLink, null, mnuName,mnuDesc);
		}
	}
}

function listPageData(data,popupdiv,popUpWidth,popUpHeight) {
	var listDataDiv=document.getElementById(subMnuItmId+'-lstTd');
	document.getElementById(subMnuItmId+'-TitleSpan').innerHTML=data.ViewName;
	document.getElementById(subMnuItmId+'-desc').innerHTML=data.ViewDesc;
	document.getElementById(subMnuItmId+'-sortVal').value=data.OrderBy;
	//Headers of data table
	var ColumnHeaders=data.ColumnHeaders; var ColumnHeaderLength=ColumnHeaders.length;
	//Rows of data table
	var RowData=data.RowData; var rowCnt=RowData.length;
	//Same width for all columns because flexigrid doesn't have a default
	var colWidthValue=parseInt((detailDataTdWidth-75)/ColumnHeaderLength);
	//Name for the table
	var tblName=subMnuItmId+'-listDataTbl';

	if(!document.getElementById(tblName)) {
		var listDataTbl = CreateTable(listDataDiv,'flextab',tblName,'','0','0');
		listDataTbl.style.width="100%";	

		//Create table headers
		var listDataTbhd = CreateThead(listDataTbl); 
		var listDataHdTr=CreateTR(listDataTbhd);	
		listDataHdTr.innerHTML="<th align='center' class='TblHead' width='25'>&nbsp;</th>";
		for(var cols=0;cols<ColumnHeaderLength;cols++) {
			var colNodeId=subMnuItmId+"-"+ColumnHeaders[cols].nodeId;
			var colHeadTxt=ColumnHeaders[cols].colmnDesc;
			var currentSort=document.getElementById(subMnuItmId+'-sortVal').value;
			if(currentSort == ColumnHeaders[cols].nodeId) {
				var listDataTh = CreateTH(listDataHdTr,'TblHead',colNodeId,'','center','Sort descending, by ' + colHeadTxt);
				var sortImg='&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-down.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span>';
				listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+ColumnHeaders[cols].nodeId+'","'+colHeadTxt+'","'+colNodeId+'","'+ColumnHeaders[cols].colType+'")\'>'+colHeadTxt+sortImg+'</span>';
				listDataTh.width=colWidthValue;
			}
			else if(currentSort == '-'+ColumnHeaders[cols].nodeId)  {
				var listDataTh=CreateTH(listDataHdTr,'TblHead',colNodeId,'','center','Sort ascending, by ' + colHeadTxt);
				var sortImg='&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-up.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span>';
				listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+ColumnHeaders[cols].nodeId+'","'+colHeadTxt+'","'+colNodeId+'","'+ColumnHeaders[cols].colType+'")\'>'+colHeadTxt+sortImg+'</span>';
				listDataTh.width=colWidthValue;
			} else {
				var listDataTh=CreateTH(listDataHdTr,'TblHead',colNodeId,'','center','Sort ascending, by ' + colHeadTxt);
				var sortImg='&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/rt_arrow.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span>';
				listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+ColumnHeaders[cols].nodeId+'","'+colHeadTxt+'","'+colNodeId+'","'+ColumnHeaders[cols].colType+'")\'>'+colHeadTxt+sortImg+'</span>';
				listDataTh.width=colWidthValue;
			}
		}		

		//Create table content
		var listDataTbdy = CreateBody(listDataTbl,'',subMnuItmId+'-listTbdy'); 

		for(var rows=0; rows < RowData.length; rows++) {	
			var rowHdnFld=subMnuItmId+'-row-hdn-'+rows; var rowId=subMnuItmId+'-row-'+rows;
			CreateHIDDEN(document.getElementById(entityDiv), '', subMnuItmId+'-row-hdn-'+rows);
			var listDataTr=CreateTR(listDataTbdy,'rowClass',rowId);

			for(var cols=-1; cols<ColumnHeaderLength; cols++) {
				if(cols == -1) {
					
				} else {
					var listDataTxt=RowData[rows].data[cols].colTxt;						
					var dataType=ColumnHeaders[cols].colType;
					
					var txtAlign='';
					if(listDataTxt)
					switch(dataType) {
						case "decimal": case "double":	case "float": case "money":	case "Decimal":
										txtAlign='right';	
										listDataTxt=ReplaceAll(listDataTxt,",","");
										listDataTxt=parseFloat(listDataTxt).toFixed(2);
										listDataTxt=FormatNumber(listDataTxt,1,2);
										break;
						
						case "Integer":	case "integer": 
										txtAlign='right';	
										listDataTxt=ReplaceAll(listDataTxt,",","");
										listDataTxt=parseFloat(listDataTxt).toFixed(0);	
										listDataTxt=FormatNumber(listDataTxt,1,0);
										break;

						case "strInteger":
										txtAlign='center';	
										listDataTxt=ReplaceAll(listDataTxt,",","");
										listDataTxt=parseFloat(listDataTxt).toFixed(0);	
										listDataTxt=FormatNumber(listDataTxt,1,0);
										listDataTxt=listDataTxt.replace(/,/g,'');
										break;

						case "dateOnly": case "Date": case "dd/MM/yyyy":
										txtAlign='center';
										var d1 = parseString_Date(listDataTxt,'yyyy-MM-dd');
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd-mmm-yyyy");
										break;

						case "timeOnly": case "dateAndTime": case "DateTime": case "Datetime":
										txtAlign='center';
										var d1 = parseString_Date(listDataTxt,'yyyy-MM-dd');										
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd-mmm-yyyy, hh:MM TT");
										break;

						case "Multi":
										listDataTxt=ReplaceAll(listDataTxt,"~)",", ");break;
						default:
										txtAlign='left';break;
					}
					var listDataTd=CreateTD(listDataTr);	
					listDataTd.align=txtAlign;	
				}
				//Click 2 view
				if(cols!=-1) {
					listDataTd.innerHTML+=listDataTxt+"&nbsp;";
					listDataTd.style.cursor="pointer";
					var moreLink=listDataTxt.indexOf('showFullContent');
					if(moreLink<0 && data.ViewUrl)AddClickEventListener(listDataTd,(function(rowHdnFld){return function(){click2ViewAdhocList(rowHdnFld);};})(rowHdnFld));
				} else {	
					line_levelMenu=data.line_levelMenu;
					var listDataTd = CreateTD(listDataTr);
					//Div for Contextual menu
					listDataTd.innerHTML="<img src='/atCRM/images/JSON/moreIcon.png'>";
					var lineLevelMnu=CreateSPAN(listDataTd,'lineMnuSpan');
					//lineLevelMnu.style.display='none';
					var lineMenuUL = CreateUL(lineLevelMnu,'lineMnuUL');
					
					
					if (container_json.addl_options == 'anyList') {
						if (typeof RowData[rows].menus != "undefined") {
							for (ix = 0; ix < RowData[rows].menus.length; ix++) {
								var lineMenuLi = CreateLI (lineMenuUL,'lineMnuLi');
								var mnuUrl = RowData[rows].menus[ix].url;
								var mnuName = RowData[rows].menus[ix].name;
								if(mnuUrl.indexOf(":menuId:")>0){ mnuUrl=mnuUrl.replace(":menuId:",mnuItmId);}
								if(mnuUrl.indexOf(":subMnuId:")>0) mnuUrl=mnuUrl.replace(":subMnuId:",shownSubMenu);
								var lineMnuAnc = CreateA (lineMenuLi, "lineMnuLiAnc", "", mnuUrl, null, mnuName,mnuName);
							}
							if (ix > 0) {
								listDataTd.className='firstListColumn';							
								AddOnMouseOverEventListener(listDataTr,(function(column){return function() {
									var topPostionOfSpan=findObjPosition(column)[1]+((contextualMenuLength[subMnuItmId]+1)*40);
									var listPageHeight = findPos('lastDivOnPage')[1]; 						
									lineLevelMnu=column.getElementsByTagName('span')[0];
									var conMargin=((contextualMenuLength[subMnuItmId]*17.90)-((contextualMenuLength[subMnuItmId]+1)*40));
									if(listPageHeight<topPostionOfSpan)lineLevelMnu.style.marginTop=conMargin+'px';
								};})(listDataTd))
							}
						}
					}

					//URL for VIEW Contextual menu
					if(data.ViewUrl){var viewParam=(data.ViewUrl).indexOf('?');if(viewParam>0)var viewUrl=data.ViewUrl+"&id="+RowData[rows].pkId;else var viewUrl=data.ViewUrl+"?id="+RowData[rows].pkId;}

					//URL for EDIT Contextual menu 
					var editURL= data.EditUrl ? data.EditUrl : data.AddUrl;	
					var editIsfunction="";
					if (editURL)editIsfunction=editURL.indexOf('javascript');
					if(editURL!=""&editIsfunction!=0){var editParam=(editURL).indexOf('?');if(editParam>0){var urlPath = editURL.split('?')[0];var urlParam = editURL.split('?')[1];editURL=urlPath+"?id="+RowData[rows].pkId+"&"+urlParam;}
					else editURL=editURL+"?id="+RowData[rows].pkId;}

					//Add/Hide View/Edit Contextual menu
					var showView=true; var showEdit=data.ShowEdit =="NO"? false : true;
					for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++) {
						var lineMnuName=line_levelMenu[lineMenu].menu[0];
						if(lineMnuName=="View"||lineMnuName=="View/Edit")showView=false;
						if(lineMnuName=="Edit"||lineMnuName=="View/Edit")showEdit=false;
					}						
					//Contextual menu for View
					if(showView==true && viewUrl) {
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+buildEncodedUrl(viewUrl)+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "View","View "+data.EntityName);
					}						
					//Contextual menu for Edit
					if(showEdit==true && editURL) {
						var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
						if(editIsfunction==0)var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", editURL.replace('PkVal',RowData[rows].pkId), null, "Edit","Edit "+data.EntityName);else	var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+buildEncodedUrl(editURL)+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "Edit","Edit "+data.EntityName);	
					}
						
					//Create Contextual menu items
					for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)	{
						var lineMnuName=line_levelMenu[lineMenu].menu[0];
						var lineMnuDesc=line_levelMenu[lineMenu].menu[1];
						var lineMnuLink=line_levelMenu[lineMenu].menu[2];
						var lineMnuOrder=line_levelMenu[lineMenu].menu[3];

						lineMnuLink=lineMnuLink.replace('pk',RowData[rows].pkId);
						lineMnuLink=lineMnuLink.replace('rowName','"'+RowData[rows].rowName.replace('&quot;','')+'"');
						lineMnuLink=lineMnuLink.replace('rowId','"'+rowId+'"');
						lineMnuLink=lineMnuLink.replace('cont_driven','"'+RowData[rows].cont_driven+'"');
						lineMnuLink=lineMnuLink.replace('reportCreateddby','"'+RowData[rows].reportCreateddby+'"');
						lineMnuLink=lineMnuLink.replace('menuDesc','"'+lineMnuDesc+'"');


						if(lineMnuName=="Call!")
						lineMnuLink=lineMnuLink.replace("savedQuery",RowData[rows].savedQuery);

						if(lineMnuLink)
						{
							var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
							var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", "javascript:executeContextualMenu();"+lineMnuLink, null, lineMnuName,lineMnuDesc);
							//lineLevelMnu.style.display='';
						}
					}
					if (viewUrl) {
						document.getElementById(subMnuItmId+'-row-hdn-'+rows).value = buildEncodedUrl(viewUrl);
						listDataTd.className='firstListColumn';
						contextualMenuLength[subMnuItmId]=line_levelMenu.length+2;
						AddOnMouseOverEventListener(listDataTr,(function(listDataTd){return function() {
							var topPostionOfSpan=findObjPosition(listDataTd)[1]+((contextualMenuLength[subMnuItmId]+1)*40);
							var listPageHeight = findPos('lastDivOnPage')[1]; 						
							lineLevelMnu=listDataTd.getElementsByTagName('span')[0];
							var conMargin=((contextualMenuLength[subMnuItmId]*17.90)-((contextualMenuLength[subMnuItmId]+1)*35));
							if(listPageHeight<topPostionOfSpan)lineLevelMnu.style.marginTop=conMargin+'px';
						};})(listDataTd))
					}
				}
			}
		}
	} else {
		var listDataTbl = document.getElementById(tblName);
		var trs = listDataTbl.getElementsByTagName('tr');
		if(trs.length<RowData.length) {
			var tbBdy=listDataTbl.getElementsByTagName('tbody');
			var rows2add=RowData.length-trs.length;

			addRowstoListTable(rows2add,tbBdy[0],ColumnHeaderLength,tblName,trs.length);
			trs = listDataTbl.getElementsByTagName('tr');
		}
		for (var row=0; row <trs.length; row++) {		
			var rowHdnFld = subMnuItmId+'-row-hdn-'+row;
			var rowId = trs[row].id;	
			if(row < RowData.length) {
				var cels = trs[row].getElementsByTagName('div');
				var celsIdx=0;				
				var viewUrl='';

				for(var colmnns = -1; colmnns < ColumnHeaderLength; colmnns++) {
					var column=cels[celsIdx];	
					if(column)column.innerHTML="";

					if(colmnns != -1) {
						var dataType = ColumnHeaders[colmnns].colType;
						var listDataTxt = RowData[row].data[colmnns].colTxt;

						var txtAlign='';
						if(listDataTxt)
						switch(dataType)
						{
							case "decimal": case "double":	case "float": case "money":	case "Decimal":
											txtAlign='right';	
											listDataTxt=ReplaceAll(listDataTxt,",","");
											listDataTxt=parseFloat(listDataTxt).toFixed(2);
											listDataTxt=FormatNumber(listDataTxt,1,2);
											break;
							
							case "Integer":	case "integer": 
											txtAlign='right';	
											listDataTxt=ReplaceAll(listDataTxt,",","");
											listDataTxt=parseFloat(listDataTxt).toFixed(0);	
											listDataTxt=FormatNumber(listDataTxt,1,0);
											break;

							case "strInteger":
											txtAlign='center';	
											listDataTxt=ReplaceAll(listDataTxt,",","");
											listDataTxt=parseFloat(listDataTxt).toFixed(0);	
											listDataTxt=FormatNumber(listDataTxt,1,0);
											listDataTxt=listDataTxt.replace(/,/g,'');
											break;

							case "dateOnly": case "Date": case "dd/MM/yyyy":
											txtAlign='center';
											var d1 = parseString_Date(listDataTxt,'yyyy-MM-dd');
											d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
											listDataTxt=dateFormat(d1, "dd-mmm-yyyy");
											break;

							case "timeOnly": case "dateAndTime": case "DateTime": case "Datetime":
											txtAlign='center';
											var d1 = parseString_Date(listDataTxt,'yyyy-MM-dd');										
											d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
											listDataTxt=dateFormat(d1, "dd-mmm-yyyy, hh:MM TT");
											break;

							case "Multi":
											listDataTxt=ReplaceAll(listDataTxt,"~)",", ");break;
							default:
											txtAlign='left';break;
						}
						column.innerHTML+=listDataTxt;
						column.style.textAlign=txtAlign;
						var moreLink=listDataTxt.indexOf('showFullContent');
						if(moreLink<0 && data.ViewUrl){if(column)column.style.cursor="pointer";}
					} else {
						line_levelMenu=data.line_levelMenu;
						//Div for Contextual menu
						column.innerHTML="<img src='/atCRM/images/JSON/moreIcon.png'>";
						var lineLevelMnu=CreateSPAN(column,'lineMnuSpan');
						//lineLevelMnu.style.display='none';
						var lineMenuUL = CreateUL(lineLevelMnu,'lineMnuUL');
						
						//URL for VIEW Contextual menu
						if (data.ViewUrl){
							var viewParam=(data.ViewUrl).indexOf('?');
							if(viewParam>0)
								var viewUrl=data.ViewUrl+"&id="+RowData[row].pkId;
							else
								var viewUrl=data.ViewUrl+"?id="+RowData[row].pkId;
 						} 

						//URL for EDIT Contextual menu 
						var editURL= data.EditUrl ? data.EditUrl : data.AddUrl;	
						var editIsfunction="";
						if (editURL)editIsfunction=editURL.indexOf('javascript');
						if(editURL!=""&editIsfunction!=0){var editParam=(editURL).indexOf('?');if(editParam>0){var urlPath = editURL.split('?')[0];var urlParam = editURL.split('?')[1];editURL=urlPath+"?id="+RowData[row].pkId+"&"+urlParam;}
						else editURL=editURL+"?id="+RowData[row].pkId;}

						//Add/Hide View/Edit Contextual menu
						var showView=true; var showEdit=data.ShowEdit =="NO"? false : true;
						for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)
						{
							var lineMnuName=line_levelMenu[lineMenu].menu[0];
							if(lineMnuName=="View"||lineMnuName=="View/Edit")showView=false;
							if(lineMnuName=="Edit"||lineMnuName=="View/Edit")showEdit=false;
						}						
						//Contextual menu for View
						if(showView==true && viewUrl) {
							var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
							var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+buildEncodedUrl(viewUrl)+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "View","View "+data.EntityName);
						}						
						//Contextual menu for Edit
						if(showEdit==true && editURL) {
							var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
							if(editIsfunction == 0)
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", editURL.replace('PkVal',RowData[row].pkId), null, "Edit","Edit "+data.EntityName);
							else
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+buildEncodedUrl(editURL)+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "Edit","Edit "+data.EntityName);	
						}				
						//Create Contextual menu items
						for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)
						{
							var lineMnuName=line_levelMenu[lineMenu].menu[0];
							var lineMnuDesc=line_levelMenu[lineMenu].menu[1];
							var lineMnuLink=line_levelMenu[lineMenu].menu[2];
							var lineMnuOrder=line_levelMenu[lineMenu].menu[3];

							lineMnuLink=lineMnuLink.replace('pk',RowData[row].pkId);
							lineMnuLink=lineMnuLink.replace('rowName','"'+RowData[row].rowName.replace('&quot;','')+'"');
							lineMnuLink=lineMnuLink.replace('rowId','"'+rowId+'"');
							lineMnuLink=lineMnuLink.replace('cont_driven','"'+RowData[row].cont_driven+'"');
							lineMnuLink=lineMnuLink.replace('reportCreateddby','"'+RowData[row].reportCreateddby+'"');
							lineMnuLink=lineMnuLink.replace('menuDesc','"'+lineMnuDesc+'"');

							if(lineMnuName=="Call!")
							lineMnuLink=lineMnuLink.replace("savedQuery",RowData[row].savedQuery);
							if(lineMnuLink) {
								var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", "javascript:executeContextualMenu();"+lineMnuLink, null, lineMnuName,lineMnuDesc);
								//lineLevelMnu.style.display='';
							}
						}
						if (viewUrl) {
							document.getElementById(subMnuItmId+'-row-hdn-'+row).value = buildEncodedUrl(viewUrl);						
							column.className='firstListColumn';							
							contextualMenuLength[subMnuItmId]=line_levelMenu.length+2;
							AddOnMouseOverEventListener(trs[row],(function(column){return function() {
								var topPostionOfSpan=findObjPosition(column)[1]+((contextualMenuLength[subMnuItmId]+1)*40);
								var listPageHeight = findPos('lastDivOnPage')[1]; 						
								lineLevelMnu=column.getElementsByTagName('span')[0];
								var conMargin=((contextualMenuLength[subMnuItmId]*17.90)-((contextualMenuLength[subMnuItmId]+1)*40));
								if(listPageHeight<topPostionOfSpan)lineLevelMnu.style.marginTop=conMargin+'px';
							};})(column))
						}
					}
					celsIdx++;						
					trs[row].style.display='';
					if (colmnns == -1 && container_json.addl_options == 'anyList') {
						for (ix = 0; ix < RowData[row].menus.length; ix++) {
							var lineMenuLi = CreateLI (lineMenuUL,'lineMnuLi');
							var mnuUrl = RowData[row].menus[ix].url;
							var mnuName = RowData[row].menus[ix].name;
							if(mnuUrl.indexOf(":menuId:")>0){ mnuUrl=mnuUrl.replace(":menuId:",mnuItmId);}
							if(mnuUrl.indexOf(":subMnuId:")>0) mnuUrl=mnuUrl.replace(":subMnuId:",shownSubMenu);
							var lineMnuAnc = CreateA (lineMenuLi, "lineMnuLiAnc", "", mnuUrl, null, mnuName,mnuName);
						}
						if (ix > 0) {
							column.className='firstListColumn';							
							AddOnMouseOverEventListener(trs[row],(function(column){return function() {
								var topPostionOfSpan=findObjPosition(column)[1]+((contextualMenuLength[subMnuItmId]+1)*40);
								var listPageHeight = findPos('lastDivOnPage')[1]; 						
								lineLevelMnu=column.getElementsByTagName('span')[0];
								var conMargin=((contextualMenuLength[subMnuItmId]*17.90)-((contextualMenuLength[subMnuItmId]+1)*40));
								if(listPageHeight<topPostionOfSpan)lineLevelMnu.style.marginTop=conMargin+'px';
							};})(column))
						}
					}
				}
			} else 
				trs[row].style.display='none';
		}
	}

	gridAddress= $('.flextab').flexigrid({height:'auto',striped:false});
}

function addRowstoListTable(rows2add,tbdy,colmnCnt,tblName,rowsCnt) {
	var colWidth=parseInt((pageWidth-15)/colmnCnt);
	var div_id;
	for(var i=0; i<rows2add; i++) {
		var rowHdnFld=subMnuItmId+'-row-hdn-'+rowsCnt;
		var rowId=subMnuItmId+'-row-'+rowsCnt;
		CreateHIDDEN(document.getElementById(entityDiv), '', subMnuItmId+'-row-hdn-'+rowsCnt);
		rowsCnt++;
		var listDataTr=CreateTR(tbdy,'rowClass',rowId);
		
		for (var j=-1; j<colmnCnt; j++) {
			var listDataTd=CreateTD(listDataTr);
			div_id = 'list_div_' + i + '_' + j;
			var listDataDiv = CreateDIV(listDataTd,'',div_id);
			if (j>=0 && parseInt(colWidth[j])) listDataDiv.style.width=colWidth[j]+'px';
			else listDataTd.style.width = '25px';					
			AddClickEventListener(listDataTd,(function(rowHdnFld){return function(){click2View(rowHdnFld);};})(rowHdnFld));	
		}
	}
}

function sortAdHocList(nodeId,columnHdg,hdr,type) {
	var thElem=document.getElementById(hdr);
	var thElemDiv=thElem.getElementsByTagName('div');
	var currentSort=document.getElementById(subMnuItmId+'-sortVal').value;

	if(prevSortParams) {
		var sortParms=prevSortParams.split('--');
		var prevThElem=document.getElementById(sortParms[2]);
		var prevThElemDiv=prevThElem.getElementsByTagName('div');
		prevThElem.title ="Sort ascending, by " + sortParms[1];
		prevThElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+sortParms[0]+'","'+sortParms[1]+'","'+sortParms[2]+'","'+sortParms[3]+'")\'>'+sortParms[1]+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/rt_arrow.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
	}
	if(currentSort == nodeId) {
		var nowSort='-'+nodeId;
		thElemDiv[0].title ="Sort ascending, by " + columnHdg;
		thElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+nodeId+'","'+columnHdg+'","'+hdr+'","'+type+'")\'>'+columnHdg+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-up.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
    } else {
		var nowSort=nodeId;
		thElemDiv[0].title ="Sort descending, by " + columnHdg;
		thElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortAdHocList("'+nodeId+'","'+columnHdg+'","'+hdr+'","'+type+'")\'>'+columnHdg+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-down.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
	}
	
	prevSortParams=nodeId+'--'+columnHdg+'--'+hdr+'--'+type;
	document.getElementById(subMnuItmId+'-sortVal').value=nowSort;
	if(type=="dd/MM/yyyy"){if(nowSort=='-'+nodeId)var order_by=nodeId+'--asc'; else var order_by=nodeId+'--desc';}else {if(nowSort=='-'+nodeId)var order_by=nodeId+'--desc'; else var order_by=nodeId+'--asc';}
	retrieveListData('orderBy',order_by);
}

function click2ViewAdhocList(hdnFld) {
	var uri=document.getElementById(hdnFld).value;
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+uri+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
}

function listPagination(pagningAmt,currntPage,itemsInPage,retCount,addUrl,tableName,urlForList) {
	var LstPgnDiv=document.getElementById(subMnuItmId+'LstPgnDiv');
	if(itemsInPage==0) {		
		document.getElementById(subMnuItmId+'-dataCount').innerHTML='[0]';
		var widthOfSelect = document.getElementById(subMnuItmId+'-TitleSpan').offsetWidth;
		var leftSpacing=widthOfSelect-58;
		document.getElementById(subMnuItmId+'-dataCount').style.left=leftSpacing+'px';

		if(retCount=='search')document.getElementById(subMnuItmId+'searchTxt').style.borderColor="#FF0000"; 
		if(retCount=='search')
		LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='50%' align='center'><div id='"+subMnuItmId+"-pageMsg' class='flexigrid' style='font-style:bold;color:red'>No data found for you search criteria</div></td></tr></table>";
		else {
			if(addUrl) {
				var addIsfunction=addUrl.indexOf('javascript');
				if(addIsfunction==0)
					var addAncTxt=addUrl;
				else {
					if(tableName=="Contact"||tableName=="Account"||tableName=="Opportunity")
					var addAncTxt="javascript:getAddDataFrmCache('"+addUrl+"')";
					else{var addAncTxt="javascript:setUpPageParameters('"+addUrl+"');";}
				}
				LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='50%' align='center'><div id='"+subMnuItmId+"-pageMsg' class='flexigrid' style='font-style:bold;color:red'>No data found, be the first to <span onclick=\""+addAncTxt+"\" style='text-transform: capitalize; text-decoration: underline; font-weight: bold; font-size: 13px; color: blue;'>add</span> a "+tableName+"</div></td></tr></table>";
			}
			else
				LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='50%' align='center'><div id='"+subMnuItmId+"-pageMsg' class='flexigrid' style='font-style:bold;color:red'>No data found</div></td></tr></table>";
		}
	} else {
		LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='10%'><div id='"+subMnuItmId+"-pageMsg' class='flexigrid'></div></td><td align='right' width='90%'><div id='"+subMnuItmId+"-LstPgnCntDiv'></div></td></tr></table>";
	
		if(retCount !="paginate" && retCount != "orderBy") {
			/*  if (container_json.addl_options == 'anyList' || container_json.addl_options == "adhocList" || container_json.addl_options == "view") {
				reptId = container_json.report_id;
			} else {
				
			}  */
			
			var url2call=zcServletPrefix+"/custom/JSON/list/adhocListCount.htm?rept_id="+reptId;
			// var url2call = urlForList.replace('custom/JSON/list/adhocList.htm','custom/JSON/list/adhocListCount.htm');
			// var url2call = urlForList.replace('custom/JSON/list/adhocList.htm','custom/JSON/list/adhocListCount.htm');
			if(retCount=='search'||retCount=='reload') {
				var mainUrl=document.getElementById(subMnuItmId+'-reportUrl').value;
				var searchParam=getParameterValue(mainUrl,'search_str');
				if(searchParam){url2call=changeParameterValue(url2call,'search_str',searchParam,true);document.getElementById(subMnuItmId+'searchTxt').style.borderColor="#33CC00"; }
				else url2call=deleteParameter (url2call,'search_str',true);
				var prev_count = document.getElementById(subMnuItmId+'-dataCount').value;
			}
			$.ajax({
				type: "GET",
				sync: true,
				dataType: "json",
				url: url2call,
				success: function (doc)
				{				
					adListCount = doc.NItem;
					if (prev_count == adListCount) {
						errorInProcess ("Your search returned the same number of records as were shown earlier. Please talk to Impel Supoprt if this happens all the time.");
					} else if (adListCount == 0) {
						errorInProcess ("Your search returned no records.");
					}
					document.getElementById(subMnuItmId+'-dataCount').innerHTML='['+adListCount+']';
					var widthOfSelect = document.getElementById(subMnuItmId+'-TitleSpan').offsetWidth;
					var leftSpacing=widthOfSelect-58;
					document.getElementById(subMnuItmId+'-dataCount').style.left=leftSpacing+'px';

					totalPages=Math.ceil(parseInt(adListCount)/parseInt(pagningAmt));
					if(parseInt(currntPage)<parseInt(totalPages))var nxtPage=parseInt(currntPage)+1;else var nxtPage=currntPage;
					if(parseInt(currntPage)>1)var prePage=parseInt(currntPage)-1;else prePage=currntPage;
					var recStNo=eval((currntPage - 1) * pagningAmt)+parseInt(1);
					var recEnNo=(parseInt(recStNo)+parseInt(itemsInPage))-1;
					var pagingContent="";
					if(prePage==currntPage) {
						var prevPageImg="Pprev_gray.gif";
						var firstPageImg="first_gray.gif";
						var prevPagePointer="default";
					} else {
						var prevPageImg="Pprev.gif";
						var firstPageImg="first.gif";
						var prevPagePointer="pointer";
					}
					if(nxtPage==currntPage) {
						var nextPageImg="Nnext_gray.gif";
						var lastPageImg="last_gray.gif";
						var nextPagePointer="default";
					} else {
						var nextPageImg="Nnext.gif";
						var lastPageImg="last.gif";
						var nextPagePointer="pointer";
					}

					if(totalPages>1)pagingContent="<td><img  title='First Page'src='/atCRM/images/JSON/"+firstPageImg+"' onclick='paginateAdhocList(1,"+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:"+prevPagePointer+"'><img  title='Previous Page' src='/atCRM/images/JSON/"+prevPageImg+"' style='cursor:"+prevPagePointer+"' onclick='paginateAdhocList("+prePage+","+totalPages+","+currntPage+","+itemsInPage+");'></td><td class='flexigrid' style='vertical-align:middle'>Page</td><td style='padding-left:2px;padding-right:2px'><input type='text' class='paginationBox' id='"+mnuItmId+"-pagBx' value='"+currntPage+"' title='Current page' onkeypress='return validCharsDOM(event,\"1234567890\")' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)paginateAdhocList(this.value,"+totalPages+","+currntPage+","+itemsInPage+")'/><td class='flexigrid' style='vertical-align:middle'>of "+totalPages+"</td><td><img title='Next Page' src='/atCRM/images/JSON/"+nextPageImg+"' onclick='paginateAdhocList("+nxtPage+","+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:"+nextPagePointer+"'><img title='Last Page' src='/atCRM/images/JSON/"+lastPageImg+"' onclick=paginateAdhocList("+totalPages+","+totalPages+","+currntPage+","+itemsInPage+") style='cursor:"+nextPagePointer+"'><td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td></td>";

					document.getElementById(subMnuItmId+'-LstPgnCntDiv').innerHTML+="<table cellpadding='0' cellspacing='0' style='height:25px' align='right'><tr valign='bottom'><td><input type='text' class='paginationBox' title='Items per page' maxlength='2' id='"+subMnuItmId+"-pageSize' value='"+pagningAmt+"' onkeypress='return numbersonly(this,event,true);' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)updatePagingSize()'/></td><td class='flexigrid' onclick='updatePagingSize();' style='cursor:pointer;vertical-align:middle;padding-right:3px'>&nbsp;Go</td><td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td>"+pagingContent+"<td class='flexigrid' style='vertical-align:middle;padding-left:5px;padding-right:10px;'>Displaying "+recStNo+" to "+recEnNo+" of "+adListCount+" items</td></tr></table>";
				}
			});
		} else {
			totalPages=Math.ceil(parseInt(adListCount)/parseInt(pagningAmt));
			if(parseInt(currntPage)<parseInt(totalPages))var nxtPage=parseInt(currntPage)+1;else var nxtPage=currntPage;
			if(parseInt(currntPage)>1)var prePage=parseInt(currntPage)-1;else prePage=currntPage;
			var recStNo=eval((currntPage - 1) * pagningAmt)+parseInt(1);
			var recEnNo=(parseInt(recStNo)+parseInt(itemsInPage))-1;
			var pagingContent="";	
			if(prePage==currntPage) {
				var prevPageImg="Pprev_gray.gif";
				var firstPageImg="first_gray.gif";
				var prevPagePointer="default";
			} else {
				var prevPageImg="Pprev.gif";
				var firstPageImg="first.gif";
				var prevPagePointer="pointer";
			}
			if(nxtPage==currntPage) {
				var nextPageImg="Nnext_gray.gif";
				var lastPageImg="last_gray.gif";
				var nextPagePointer="default";
			} else {
				var nextPageImg="Nnext.gif";
				var lastPageImg="last.gif";
				var nextPagePointer="pointer";
			}

			if(totalPages>1)pagingContent="<td><img  title='First Page'src='/atCRM/images/JSON/"+firstPageImg+"' onclick='paginateAdhocList(1,"+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:"+prevPagePointer+"'><img  title='Previous Page' src='/atCRM/images/JSON/"+prevPageImg+"' style='cursor:"+prevPagePointer+"' onclick='paginateAdhocList("+prePage+","+totalPages+","+currntPage+","+itemsInPage+");'></td><td class='flexigrid' style='vertical-align:middle'>Page</td><td style='padding-left:2px;padding-right:2px'><input type='text' class='paginationBox' id='"+mnuItmId+"-pagBx' value='"+currntPage+"' title='Current page' onkeypress='return validCharsDOM(event,\"1234567890\")' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)paginateAdhocList(this.value,"+totalPages+","+currntPage+","+itemsInPage+")'/><td class='flexigrid' style='vertical-align:middle'>of "+totalPages+"</td><td><img title='Next Page' src='/atCRM/images/JSON/"+nextPageImg+"' onclick='paginateAdhocList("+nxtPage+","+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:"+nextPagePointer+"'><img title='Last Page' src='/atCRM/images/JSON/"+lastPageImg+"' onclick=paginateAdhocList("+totalPages+","+totalPages+","+currntPage+","+itemsInPage+") style='cursor:"+nextPagePointer+"'><td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td></td>";

			document.getElementById(subMnuItmId+'-LstPgnCntDiv').innerHTML+="<table cellpadding='0' cellspacing='0' style='height:25px' align='right'><tr valign='bottom'><td><input type='text' class='paginationBox' title='Items per page' maxlength='2' id='"+subMnuItmId+"-pageSize' value='"+pagningAmt+"' onkeypress='return numbersonly(this,event,true);' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)updatePagingSize()'/></td><td class='flexigrid' onclick='updatePagingSize();' style='cursor:pointer;vertical-align:middle;padding-right:3px'>&nbsp;Go</td><td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td>"+pagingContent+"<td class='flexigrid' style='vertical-align:middle;padding-left:5px;padding-right:10px;'>Displaying "+recStNo+" to "+recEnNo+" of "+adListCount+" items</td></tr></table>";
		}
	}
}

function paginateAdhocList(pgNo,max,current,noItms) {
	if(pgNo==current)
		return;
	if(pgNo<=max&&pgNo>0) {	
		retrieveListData('paginate',pgNo);
	} else {
		document.getElementById('commonErrPopupDiv').className="commonErrPopupDiv";
		var leftPos=((window.document.body.clientWidth)-450)/2;
		var topPos=findPosOfObj(document.getElementById(subMnuItmId+'-pagBx'));
		var ttP=(topPos[1]-((noItms*30)/2));
		document.getElementById('commonErrPopupDiv').style.left=leftPos+"px";
		document.getElementById('commonErrPopupDiv').style.top=ttP+"px";
		document.getElementById('commonErrPopupDiv').style.display="block";
		document.getElementById('commonErrPopupDiv').innerHTML="Enter valid page number";
		document.getElementById(subMnuItmId+'-pagBx').value=current;
		setTimeout(function(){document.getElementById('commonErrPopupDiv').className="commonErrPopupDivLight";},500)
		setTimeout(function(){document.getElementById('commonErrPopupDiv').style.display="none";},1000)
	}
}

function findObjPosition(targetObj) {
	var curleft = curtop = 0;
	if (targetObj.offsetParent) {
	do {
			curleft += targetObj.offsetLeft;
			curtop += targetObj.offsetTop;
		} while (targetObj = targetObj.offsetParent);
	}
	return [curleft,curtop];
}


function updatePagingSize(page) {
	var pageSizeBox = document.getElementById (subMnuItmId+"-pageSize");
	if (pageSizeBox && pageSizeBox.value && pageSizeBox.value > 0) {
		pagingAmount=pageSizeBox.value;
		reptId=document.getElementById(subMnuItmId+'-reportId').value;
		var url=zcServletPrefix+"/custom/JSON/add/updateReportInfo/editAction?0-1-37=" + pagingAmount + "&0-1-2=" + reptId;
		$.ajax({
			type: "GET",
			url: url,
			success: function ()
			{
				retrieveListData();
			}
		});
    }
}

function buildEncodedUrl(url) {
	if (url != "") {
		url = url.replace(/\?/g,"~");
		url = url.replace(/&/g,"@");
		url = url.replace(/=/g,"*");
	}
	return url;
}


function showFilterPopUp(entityId) {	
	//prepare html contents first
	var container = "<div><div id='filterShowLoading'><center><img src='/atCRM/images/JSON/loading.gif'><p>Loading filters..</p></center></div><div id='filterContainer'><form id='filterTblForm'><table id='filterTbl'></table><input type='button' value='Go' id='filterTblSubmit' style='float:right;' /></form></div></div>";
	$('#commonPopupDiv').html(container);

	//show pop up
	$( "#commonPopupDiv" ).dialog({
			resizable: false,
			autoOpen:true,
			modal: true,
			title:"Add Filter",
			width:800,
			height:350,
			closeOnEscape: false,
			position: 'center'
	});

	//hit the url and get columns for entity id
	// var udm = '/atCRM/custom/metadata/eC.html?e='+entityId;
	// //get  list of columns for particular entity
	// $.ajax({
	// 	url: udm,
	// 	dataType: 'JSON',
	// 	async: false,
	// 	success: function(data) {			
	// 		drawFilterTableOpt(data);
	// 	},
	// 	error: function(response) {
	// 		console.log('Error while getgin entity columns..');
	// 		console.log(response);
	// 	},
	// });
	drawFilterTableOpt();
	
}

/* 
	* this will draw filter conditions..
*/
var tblFilterIndx=0, entityColumns, filterRowStatus;
function drawFilterTableOpt() {	
	filterRowStatus=false;
	drawFilterRow(5, $('#filterTbl'), false);

	//hide loading 
	$('#filterShowLoading').remove();
}

//draw filter row
function drawFilterRow(cnt, toTbl, singleSelect) {
	var tr, col, opt, sel, n, inp, imgDiv;
	for(var i=1; i<=cnt; i++) {
		tr = $('<tr id="filterTblRow_'+tblFilterIndx+'"></tr>');

		if(singleSelect === false) {
			//this shows and condition text for each row
			col = $('<td style="width:40px;"></td>');		
			if(filterRowStatus == true)
				col.text('and');
			else 
				col.text('');
			
			tr.append(col);
		}

		//first column of row
		col = $('<td class="toPostCol"></td>');
		sel = $('<select class="filterEntityCols toPostVal" id="filterCol_'+tblFilterIndx+'"></select>');
		sel.append('<option value="" type="">---</option>');
		$.each(entityColumns,function(k,v) {
			n = v['name'];
			opt = "<option value="+v['id']+" type="+v['type']+">"+n+"</option>";
			sel.append(opt);
		});
		col.append(sel);
		tr.append(col);

		//second column of row
		col = $('<td class="toPostCol"></td>');
		sel = $('<select class="filterEntityOpr toPostVal" id="filterOpr_'+tblFilterIndx+'"></select>');
		sel.append('<option value="" type="">---</option>');
		col.append(sel);
		tr.append(col);

		//third  column
		col = $('<td class="toPostCol"></td>');
		inp = "<input class='toPostVal' type='text' value='' name='' id='filterEntTxt_"+tblFilterIndx+"' />";
		col.append(inp);
		tr.append(col);

		//fourth column, contains date list
		col = $('<td style="width:25px;display:none;" id="filterEntDate_'+tblFilterIndx+'"></td>');
		tr.append(col);

		if(singleSelect === false) {
			col = $('<td style="width:35px;"></td>');
			imgDiv = $('<div id="filterEntAddOrDel_'+tblFilterIndx+'"></div>');
			if(i == cnt) {			
				imgDiv.addClass('addNewCondForFilter');
			} else {			
				imgDiv.addClass('removeCondForFilter');
			}
			col.append(imgDiv);
			tr.append(col);
		}


		//now add the row to table
		toTbl.append(tr);

		filterRowStatus = true; //means atleast one rows exists
		tblFilterIndx++;
	}
}

//this will shows the filter columns for single select
function showColumnsForSingleSelect () {

	console.log('fetchin entity cols..');
	//hit the url and get columns for entity id
	var udm = '/atCRM/custom/metadata/eC.html?e='+$('#singleFilterSub').attr('entityListId');
	console.log(udm);
	//get  list of columns for particular entity
	$.ajax({
		url: udm,
		dataType: 'JSON',
		// async: false,
		success: function(data) {	
			console.log(data);		
			entityColumns = data['columns']; //colsForEntity is global var
			drawFilterRow(1, $('#singleFilterCont table'), true);			
		},
		error: function(response) {
			console.log('Error while getgin entity columns..');
			console.log(response);
		},
	});
}

//contains different operators, for different column types
//currently supporting, text, number, date
var rulesTriggerMappings = {
		"colMapName": {
			"Text": "text",
			"Decimal": "number",
			"Number": "number",
			"Date": "date",
			"DateTime": "date",
			"nu": "is null",
			"nn": "is not null"
		},
		"colProperties": {
           "number": {
                "eq": "Equal",
                "ne": "Not Equal",
                "lt": "Less Then",
                "gt": "Greate Then",
				"nu": "is null",
				"nn": "is not null"
           },
           "numberPk": {
                "eq": "Equal",
                "ne": "Not Equal",
				"nu": "is null",
				"nn": "is not null"
           },
           "date": {
               "eq": "Equal",
               "ne": "Not Equal" ,
                "lt": "Less Then",
                "gt": "Greate Then",
				"nu": "is null",
				"nn": "is not null"
           },
           "text": {
                "eq": "Equal",
                "ne": "Not Equal",
                "contains": "Contains",
                "does not contains": "Does Not Contains",
                "starts with": "Starts With",
                "does not starts with": "Does Not Starts With",
                "ends with": "Ends With",
                "does not ends with": "Does Not Ends With",
				"nu": "is null",
				"nn": "is not null"
           }
       }
   };


 //#shoib, document ready code here
 $(document).ready(function() {
 	//remove this row from table
 	$('body').on('click', '.removeCondForFilter', function() {
 		var id = $(this).attr('id').split('_').pop();
 		$('#filterTblRow_'+id).remove();
 	});

 	//add new row, and make this col has remove
 	$('body').on('click', '.addNewCondForFilter', function() {
 		$(this).addClass('removeCondForFilter').removeClass('addNewCondForFilter'); 	
 		drawFilterRow(1, $('#filterTbl'), false);	
 	});

 	//show specific operator
 	$('body').on('change', '.filterEntityCols', function() {
 		var t = $(this);
 		var type = $('option:selected', t).attr('type');
 		var id   = t.attr('id').split('_').pop();
 			
 		//get mapping key name...
 		var mapKey = rulesTriggerMappings['colMapName'][type];
 		var properties = rulesTriggerMappings['colProperties'][mapKey];
 		var opt, sel=$('#filterOpr_'+id);
 		sel.children().remove();
 		sel.append('<option value="" type="">---</option>')
 		$.each(properties,function(k, v) {
 			opt = '<option value="'+k+'">'+v+'</option>';
 			sel.append(opt);
 		});

 		var td = $('#filterEntDate_'+id);
 		if(mapKey == 'date') {
 			if(td.children('img').length == 0) {
	 			var img = $('<img src="/atCRM/images/calendar.gif" id="filterCalendar_'+id+'" />');
	 			td.html(img).css('display','block');
	 			new Calendar({
	                inputField: 'filterEntTxt_'+id,
	                dateFormat: "%d/%m/%Y", 
	                trigger: 'filterCalendar_'+id,
	                bottomBar: true,
	                fdow:0,
	                min: 19000101,
	                max: 29991231,
	                align: "BL",
	                onSelect: function() {
	                  this.hide();
	                }
	            });
 			} else { 			
 				img = td.children('img').css('display','block');	
 				img.css('visibility', 'visible');
 				$('#filterEntTxt_'+id).val(img.attr('alt'));
 			}
 		} else {
 			if(td.children('img').length > 0) {
 				var txtFld = $('#filterEntTxt_'+id);
 				td.children('img').css('visibility', 'hidden').attr('alt', txtFld.val());
 				td.css('display','none');
 				txtFld.val('');
 			}
 		}
 	});

	//submit the filters data
	$('body').on('click', '#filterTblSubmit', function() {
		//prepare url data
		var urlData = '', rowData, flag,val;
		$('#filterTblForm #filterTbl tr').each(function() {
			rowData = '';
			flag=true;
			$(this).children('td.toPostCol').each(function() {
				val = $(this).children('.toPostVal').val();
				rowData +=  val + '!!';
				if(val == '')
					flag = false;
			});
			if(flag !== false)
				urlData += rowData.substr(0, rowData.length - 2) + '!~~!';
		});		
		if(urlData.length > 0)
			urlData = '&aw='+ urlData.substr(0, urlData.length - 4);

		if(urlData.length > 0) {
			retrieveListData("reload",'', '', urlData);
		} else {
			alert('No "and" condtions selected. Please atleast 1 complete row.');
		}		
	});

	//submit the filters data
	$('body').on('click', '#singleFilterSub', function() {
		//prepare url data
		var urlData = '', rowData, flag,val;
		$('#singleFilterCont table tr').each(function() {
			rowData = '';
			flag=true;
			$(this).children('td.toPostCol').each(function() {
				val = $(this).children('.toPostVal').val();
				rowData +=  val + '!!';
				if(val == '')
					flag = false;
			});
			if(flag !== false)
				urlData += rowData.substr(0, rowData.length - 2) + '!~~!';
		});		
		if(urlData.length > 0)
			urlData = '&aw='+ urlData.substr(0, urlData.length - 4);

		if(urlData.length > 0) {
			retrieveListData("reload",'', '', urlData);
		} else {
			alert('No "and" condtions selected. Please atleast 1 complete row.');
		}		
	});

	
	//end of document ready
 });


