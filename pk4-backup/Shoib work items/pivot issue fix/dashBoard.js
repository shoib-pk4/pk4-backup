//For Width..
var DashBSortblWidth = (screen.width)/3 - 35;
var DblDashBSortblWidth = 2*DashBSortblWidth+20;
var PrntDashBName;
var PrntDashBDesc;
var PrntDashBUsrUpdate;
var SelectedPrntDashBVal;
var countOfPivots=0;
var currentPivot="";
var dbItemsRequest = new Array();

//Function to create Title and links..
function setupDashBoard()
{	
	//document.getElementById(entityDiv).style.display="none";
	entityDiv="dashBoardMainDiv";
	document.getElementById('dashBoardMainDiv').style.display="block";
	//Table for Title, links, list of Dashboards
	var dashBoardContent = "<table width='100%'><tr><td style='height:50px' onmouseover='ShowModification()' onmouseout='HideModification()'><div id='dbLabelTD' style='position:relative'></div><div id='TdModification' style='visibility:hidden;text-indent:10px;z-index:4'><span class='titleLinks' id='DashBSpanEdit' onclick='open_dashboard_form(0)' title='Edit this Dashboard'>Edit</span><span id='1or'> | </span><span class='titleLinks' id='DashBSpanDelete' onclick='ConfirmDeleteDashBoard()' title='Delete this Dashboard'>Delete</span><span id='2or'> | </span><span class='titleLinks' id='DashBSpanAddNew' onclick='open_dashboard_form()' title='Add New Dashboard'>Add New</span></div></td><td style='width:80%;height:50px;vertical-align:top'><div style='margin-left:7px;' id= 'div_DashBItem_description'	class='jsonGrayTxt'></div></td><td style='width:10%;height:50px'><span id='Add_sec' class='ahover' title='Add a new Section' onclick='OpenDashBSectionForm()'>Add Section</span><input type='hidden' id='StoreSectionId'/></td></tr></table>";
	//UL for Dashboard Items
	dashBoardContent += "<ul id='dashBoardSortable'></ul>";
	//Div for error display
	dashBoardContent += "<div id='noDashBoardItems' style='display:none;margin-top:25%;margin-left:30%;'><p class='pageTitle'>There are no Sections in this Dashboard. Click <a style='vertical-align:top;color:blue;' onclick='OpenDashBSectionForm()'>here</a> to add one.</p></div>";
	//write all content in Main div for dashboard
	document.getElementById("dashBoardMainDiv").innerHTML = dashBoardContent;
		
	//Function to get Dashboards
	stopDbItemsCall();
	Get_Parnt_DashB_LI();
	$("#dashBoardSortable").sortable();
	$("#dashBoardSortable").disableSelection();
}

function stopDbItemsCall()
{
	for(var i=0; i<dbItemsRequest.length; i++)
	{
		dbItemsRequest[i].abort();
	}
}

//Function to Add New Section PopUP...
function OpenDashBSectionForm()
{	
	var FrmSection = 'section';
	document.getElementById('noDashBoardItems').style.display = 'none';
	var PopUpDivContent = "<form><table nowrap>";
	PopUpDivContent += "<tr><td width='5%'></td><td width='15%' align='left'><label class='normal_font'>Name</label></td><td width='55%'><input type = 'text' maxlength='50' class='normal_font' id = 'txt_section_name' style='width:300px'> </input><div id='DashBSectionErrDiv' style='display:none;color:red;font-family:Tahoma,Verdana;font-size:10px;'></div></td><td><select style='width:110px' id='DashBSelectSize'><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option></select></td></tr>";
	PopUpDivContent += "<tr><td width='3%'></td><td></td><td colspan='2'><font size=1>Give name to this section to identify the kind of information you will show here. E.g. 'Top 5 Customers'.</font></td></tr>";
	PopUpDivContent += "<tr><td width='5%'></td><td valign='top' align='left'><label class='normal_font' >Description</label></td><td colspan='2'><textarea id='txtarea_section_desc' width='300px' class='normal_font' style='width:300px' rows = '4'></textarea></td></tr>";
	PopUpDivContent += "<tr><td width='3%'></td><td></td><td colspan='2'><font size=1>Use a description that will help you to identify the manner in which the data will be retrieved. E.g. 'Top five customers in all my Territries, by order value in the last month'.</font></td></tr>";
	PopUpDivContent += "<tr><td width='5%'></td><td nowrap align='left'><label class='normal_font'>Based on Object&nbsp;&nbsp;&nbsp;&nbsp;</label></td><td><select class='normal_font' style='width:145px;' id='DashBSelectEntity'><option value='accounts'>Accounts</option><option value='activities'>Activities</option><option value='contacts'>Contacts</option><option value='leads'>Leads</option><option value='loy_program'>Loyalty Programs</option><option value='opportunities'>Opportunities</option><option value='product'>Products</option><option value='tickets'>Tickets</option><option value='sbeuser'>Users</option></select></td></tr>";
	PopUpDivContent += "<tr><td width='3%'></td><td></td><td colspan='2'><font size=1>Choose the primary object that you want this section to work with. You can choose related objects and calculations when you define the contents of this section, by clicking on the Settings button of the section later.</font></td></tr>";
	PopUpDivContent += "<tr><td width='3%'></td><td colspan='2' class='normal_font'><input type='radio' id='OrgUpdateFrSectionDashB' checked='checked' name='OrgUpdateFrChildDashB'></input>&nbsp;&nbsp;<label style='cursor:default;cursor:default;padding-left:25px;display:inline-block' for='OrgUpdateFrSectionDashB'>Show this Section to all users</label></td></tr>";
	PopUpDivContent += "<tr><td width='3%'></td><td colspan='2' class='normal_font'><input type='radio' id='UsrUpdateFrSectionDashB' name='OrgUpdateFrChildDashB'/>&nbsp;&nbsp;<label for='UsrUpdateFrSectionDashB' style='cursor:default;cursor:default;padding-left:25px;display:inline-block'>Show this Section only to me</label></td></tr>";
	PopUpDivContent += "<tr><td colspan='4'><br></td></tr>";
	PopUpDivContent += "<tr><td colspan='4' align='right'><input type = 'button' id='Butt_Crt_Section' class='ui-widget' value = 'Create Section' onclick = \"Add_New_Child_DashB('"+FrmSection+"')\"></input>&nbsp;<input type = 'button' class='ui-widget' value = 'Cancel' onclick='closeCommonPopup()'></input></td></tr>";
	PopUpDivContent += "</table></form>";
	
	document.getElementById('commonPopupDiv').innerHTML = PopUpDivContent;
	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:'Add New Section',
		height:550,
		width:690,
		position:'center',
		resizable:false
	});
	$('#commonPopupDiv input:text:visible:first').focus();

	if(PrntDashBUsrUpdate){
		document.getElementById('UsrUpdateFrSectionDashB').checked = 'true';
		document.getElementById('OrgUpdateFrSectionDashB').disabled = 'true';
	}
}

//Function for the Add New/Edit DashBoard PopUP...
function open_dashboard_form(dashBEdtFlg)
{	
	var FrmParent = 'parent';
	var DashBPopUpContnt = "<form><table nowrap>";
	DashBPopUpContnt += "<tr><td valign='top' align='left'><label class='normal_font'>Name</label></td><td><input type = 'text' maxlength='40' class='normal_font' id = 'txt_dashb_name' style='width:300px'></input><div id='DashBParentErrDiv' style='display:none;color:red;font-family:Tahoma,Verdana;font-size:10px;' class='normal_font'></div></td></tr>";
	DashBPopUpContnt += "<tr><td></td><td><font size=1>Give your dashboard name to identify a set of sections that you look at together. E.g. 'Sales Dashboard'.</font></td></tr>";
	DashBPopUpContnt += "<tr><td valign='top' align='left'><label class='normal_font'>Description&nbsp;&nbsp;</label></td><td><textarea id='txtarea_dashb_desc' class='normal_font' rows = '6' cols = '45' style='width:300px'></textarea></td></tr>";
	DashBPopUpContnt += "<tr><td></td><td><font size=1>Use description that will help you to identify the various sections that you want to add into this dashboard.</font></td></tr>";
	DashBPopUpContnt += "<tr><td class='normal_font' colspan='2'><input type='radio' id='OrgUpdatefrParentDashB' checked='checked' name='OrgUpdate'><label style='cursor:default;cursor:default;padding-left:25px;display:inline-block' for='OrgUpdatefrParentDashB'>Show this Dashboard to all users</label></td></tr>";
	DashBPopUpContnt += "<tr><td class='normal_font' colspan='2'><input type='radio' id='UsrUpdateFrParentDashB' name='OrgUpdate'/><label for='UsrUpdateFrParentDashB' style='cursor:default;cursor:default;padding-left:25px;display:inline-block'>Show this Dashboard only to me</label></td></tr>";
	DashBPopUpContnt += "<tr><td></td><td align='right'><input type = 'button' id='Butt_Crt_DashB' class='ui-widget' onclick = \"Add_New_DashB_Container('"+FrmParent+"')\"> </input><input type = 'button' id='ButtonClose' class='ui-widget' value = 'Cancel' onclick='closeCommonPopup();' ></input></td></tr>";
	DashBPopUpContnt += "</table></form>";	
	document.getElementById('commonPopupDiv').innerHTML = DashBPopUpContnt;

	if(dashBEdtFlg == 0){
		var PrevVal = document.getElementById('txt_dashb_name').value = PrntDashBName;
		PrevVal = escape(PrevVal);
		document.getElementById('txtarea_dashb_desc').value = PrntDashBDesc;
		document.getElementById('Butt_Crt_DashB').value = 'Edit Dashboard';
		var dbPopupTitle='Edit - '+PrntDashBName;
		document.getElementById('Butt_Crt_DashB').setAttribute("onclick","Add_New_DashB_Container('"+FrmParent+"',"+dashBEdtFlg+",'"+PrevVal+"')");
		if(PrntDashBUsrUpdate)
			document.getElementById('UsrUpdateFrParentDashB').checked = 'true';
		else
			document.getElementById('OrgUpdatefrParentDashB').checked = 'true';
	}
	else{
		document.getElementById('Butt_Crt_DashB').value = 'Create Dashboard';
		document.getElementById('txt_dashb_name').value = '';
		document.getElementById('txtarea_dashb_desc').value = '';
		var dbPopupTitle='Add New Dashboard';
	}

	$('#commonPopupDiv').dialog({
		autoOpen:true,
		modal: true,
		title:dbPopupTitle,
		height:450,
		width:550,
		position:'center',
		resizable:false
	});
	$('#commonPopupDiv input:text:visible:first').focus();
}

//Function to open the Setting Dialog Box...
function settingsForDashboard(dashBrdReportId,dashBrdName,id,Url2Render,dashBrdSize,reloadId,Chrt_Li_Id,Data_Li_Id,Pvt_Li_Id,SectionDashBCrtdBy) 
{
	document.getElementById('commonPopupDiv').innerHTML ="<div id='loadingDiv4Setting' align='center'><br/><br/><br/><br/><br/><img src='/atCRM/images/LoadImg/ajax-loader-1.gif' /><p>Loading...</p></div>";
	var url2SettingDialog = '/atCRM/custom/adhocReports/eDash.html?id='+dashBrdReportId;

	var EdashPassingId = id;
	EdashPassingId = EdashPassingId.replaceAll('Render_div_','');
	document.getElementById('StoreSectionId').value = EdashPassingId;

	$('#commonPopupDiv').append($("<iframe />").attr({src:url2SettingDialog,width:'100%',height:'99%',id:'settingFrame',frameBorder:'0',style:'overflow:auto'}));
	$("#commonPopupDiv").dialog({
		autoOpen:true,
		modal: true,
		title:'Edit - '+dashBrdName,
		position: 'center',
		height:700,
		width:1000,
		close:function(event,ui){
			Get_DashB_Child_Items();
		}
	});
}

//Function to give the Confirmation for to Delete the Section...
function deleteConfirmationSection(id)
{
	document.getElementById('commonPopupDiv').innerHTML = "<p class='normal_font'>Are you sure, you want to delete this Section Dashboard?</p><div style='margin-top:20px' align='right'><input style='width:50px' class='ui-widget' type='button' value='OK' onclick='deleteDashBoardSection(\""+id+"\")'/>&nbsp;<input style='width:50px' onclick='closeCommonPopup();' class='ui-widget' type='button' value='Cancel'/></div>";
	$("#commonPopupDiv").dialog({
			autoOpen:true,
			height:145,
			width:300,
			title:'Delete Confirmation',
			resizable: false,
			modal: true
		});
}

//Function to Delete the DashBoard from the Section Table...
function deleteDashBoardSection(id)
{	
	var Split_val = id.split('_');
	var Id = Split_val[3];
	var url2DltFrmSecTbl = '/atCRM/custom/JSON/system/deleteDashBoardItem/deleteAction?&0-1-2='+Id;
	$.ajax({
		type: 'POST',
		url: url2DltFrmSecTbl,
		success: function(doc){
			$("#"+id).remove();
			closeCommonPopup();
			Get_DashB_Child_Items();
		}
	});
}

//Function to Delete The ParentDashBoard / Container DashBoard, along with its Section / Child DashBoard...
function ConfirmDeleteDashBoard()
{
	var InnerUL = document.getElementById('dashBoardSortable');
	var ArrayLi = InnerUL.getElementsByClassName('ui-state-default');
	
	if(InnerUL.innerHTML != '')
	document.getElementById('commonPopupDiv').innerHTML = "<p class='normal_font'>This Dashboard has "+ArrayLi.length+" Section[s], Are you sure you want to delete it?</p><div style='margin-top:20px' align='right'><input id='DeleteConfirmBttn' style='width:50px' onclick='deleteDashBParent()' class='ui-widget' type='button' value='OK' />&nbsp;<input style='width:50px' id='DeleteCancelBttn' onclick='closeCommonPopup();' class='ui-widget' type='button' value='Cancel'/></div>";
	else
	document.getElementById('commonPopupDiv').innerHTML = "<p class='normal_font'>Are you sure you want to delete this Dashboard?</p><div style='margin-top:20px' align='right'><input  style='width:50px' onclick='deleteDashBParent()' class='ui-widget' type='button' value='OK' />&nbsp;<input style='width:50px' onclick='closeCommonPopup();' class='ui-widget' type='button' value='Cancel'/></div>";
		$("#commonPopupDiv").dialog({
			autoOpen:true,
			height:145,
			width:300,
			title:'Delete Confirmation',
			resizable: false,
			modal: true
		});
}

//Removing the Parent DashBoard / Container DashBoard...
function deleteDashBParent()
{
	var SelectedVal = document.getElementById('Select_dashB_Itms').value;
	var url2DltParentDB = '/atCRM/custom/JSON/system/deleteParentDashBoard.html?id='+SelectedVal;
	$.ajax({
		type: 'POST',
		url: url2DltParentDB,
		success: function(doc){
			Get_Parnt_DashB_LI();
			closeCommonPopup();
		}
	});
}

//Function to get the Dashboards/Containers for Dashboard Items
function Get_Parnt_DashB_LI()
{	
	var url2getDBItems="/atCRM/custom/JSON/list/dashBoard.htm";
	$.ajax({
	type: "GET",				   
	url:url2getDBItems,
	dataType: "json",
	async:false,
	success: function (data)
	{	
		var dashBoardItems = data.DashBoard;
		var dashBOpts="";
		var orgOpt=0;
		var nonorgOpt=0;
		var myOpt=0;
		for(var i=0; i<dashBoardItems.length; i++)
		{	
				var dashBrdOrg = dashBoardItems[i].dashBoardOrgName;
				var dashBoardUser = dashBoardItems[i].dashBoardUser;
			if(dashBoardUser==session_login)
			{	
				if(myOpt==0)dashBOpts+='<optgroup label="My Dashboards">';myOpt++;

				if(SelectedPrntDashBVal == dashBoardItems[i].dashBoardId)
					dashBOpts+="<option value="+dashBoardItems[i].dashBoardId+" selected>"+dashBoardItems[i].dashBoardName+"</option>";
				else
					dashBOpts+="<option value="+dashBoardItems[i].dashBoardId+">"+dashBoardItems[i].dashBoardName+"</option>";
			}
			else if(dashBrdOrg)
			{	
				if(nonorgOpt==0)dashBOpts+='<optgroup label="Shared Dashboards">';nonorgOpt++;

				if(SelectedPrntDashBVal == dashBoardItems[i].dashBoardId)
					dashBOpts+="<option value="+dashBoardItems[i].dashBoardId+" selected>"+dashBoardItems[i].dashBoardName+"</option>";
				else
					dashBOpts+="<option value="+dashBoardItems[i].dashBoardId+">"+dashBoardItems[i].dashBoardName+"</option>";
			}
			else
			{
				if(orgOpt==0)dashBOpts+='<optgroup label="Default Dashboards">';orgOpt++;
				dashBOpts+="<option value="+dashBoardItems[i].dashBoardId+">"+dashBoardItems[i].dashBoardName+"</option>";
			}
		}		
		document.getElementById('dbLabelTD').innerHTML="<select id='Select_dashB_Itms' class='title-select'style='margin:0px'>"+dashBOpts+"</select>";
		$('#Select_dashB_Itms').each(function()
			{
				var title = $(this).attr('title');
				var titleSpan=$('#'+subMnuItmId+'-TitleSpan');
				if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
				$(this).css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
					.after('<span class="title-select" id="'+subMnuItmId+'-TitleSpan">' + title + '</span>')
					.change(function(){val = $('option:selected',this).text();$(this).next().text(val);document.title = val+' - Impel';Get_DashB_Child_Items();})
					document.title = title+' - Impel';
			});
			Get_DashB_Child_Items();
	}
	});
}

//Function to Get Child DashBoard Items ( / Section's)for the Parent DashBoards ( / Container's) through the Event 'ONCHANGE'..
function Get_DashB_Child_Items()
{	
	stopDbItemsCall();document.getElementById('dashBoardSortable').innerHTML = '';

	countOfPivots = 0;
	var id=document.getElementById("Select_dashB_Itms").value;
	SelectedPrntDashBVal = id;
	var url2getDBchildItems = '/atCRM/custom/JSON/list/dashBoardItems.htm?id='+id;
	var dbItemCall=$.ajax({
		type: 'GET',
		url:url2getDBchildItems,
		async:false,
		dataType: 'json',
		success: function (data)
		{	
			PrntDashBName = data.DashBoardHeader;
			PrntDashBDesc = data.DashBoardDesc;
			PrntDashBUsrUpdate = data.DashBoardFrUsr;
			document.getElementById('div_DashBItem_description').innerHTML=data.DashBoardDesc;
			if(data.DashBoardCrtdBy != session_login && data.DashBoardOrg != ""){
				document.getElementById('Add_sec').style.display = 'inline-table';
				document.getElementById('DashBSpanEdit').style.display = 'none';
				document.getElementById('1or').style.display = 'none';
				document.getElementById('DashBSpanDelete').style.display = 'none';
				document.getElementById('2or').style.display = 'none';
			}
			else if(data.DashBoardOrg == ''){
				document.getElementById('Add_sec').style.display = 'none';
				document.getElementById('DashBSpanEdit').style.display = 'none';
				document.getElementById('1or').style.display = 'none';
				document.getElementById('DashBSpanDelete').style.display = 'none';
				document.getElementById('2or').style.display = 'none';
			}
			else{
				document.getElementById('Add_sec').style.display = 'inline-table';
				document.getElementById('DashBSpanEdit').style.display = 'inline';
				document.getElementById('1or').style.display = 'inline';
				document.getElementById('DashBSpanDelete').style.display = 'inline';
				document.getElementById('2or').style.display = 'inline';
			}
			var dashBoardChildItems = data.DashBoardItems;
			if(dashBoardChildItems.length==0)
			document.getElementById('noDashBoardItems').style.display = 'block';
			else
			document.getElementById('noDashBoardItems').style.display = 'none';

			var dashBoardAppendUL = document.getElementById('dashBoardSortable');
			dashBoardAppendUL.innerHTML = '';
			var delay=0;
			for(var i=0; i<dashBoardChildItems.length; i++)
			{		
				var dashBrdId = dashBoardChildItems[i].dashBoardItemsId;
				var dashBrdName = dashBoardChildItems[i].dashBoardItemsName;
				var dashBrdURI = dashBoardChildItems[i].dashBoardURI;
				var dashBrdSize = dashBoardChildItems[i].dashBoardSectionSize;
				var dashBrdDisplayTyp = dashBoardChildItems[i].dashBoardDisplayType;
				var dashBrdReportId = dashBoardChildItems[i].dashBrdReportId;
				var SectionDashBCrtdBy = dashBoardChildItems[i].dashBrdCrtdBy;
				var DashBoardOrg=data.DashBoardOrg;
				
				setTimeout("renderDashBoardItem('"+dashBrdId+"','"+dashBrdName+"','"+dashBrdURI+"','"+dashBrdSize+"','"+dashBrdDisplayTyp+"','"+dashBrdReportId+"','"+SectionDashBCrtdBy+"','"+DashBoardOrg+"')",delay);
				delay+=1000;
			}
		}
	});		
	dbItemsRequest.push(dbItemCall);
	GetCookie();		
}

function renderDashBoardItem(dashBrdId,dashBrdName,dashBrdURI,dashBrdSize,dashBrdDisplayTyp,dashBrdReportId,SectionDashBCrtdBy,DashBoardOrg)
{
	var dashBoardAppendUL = document.getElementById('dashBoardSortable');
	if(DashBoardOrg == ''){
		dashBoardAppendUL.innerHTML += "<li class='ui-state-default' id='New_Child_DashBoard_"+dashBrdId+"'><div class='portlet'><div class='portlet-header ui-widget-header'>"+dashBrdName+"<img id='reload_"+dashBrdId+"' src='/atCRM/images/rload.gif' style='right:3px;' alt='Reload Icon' title='Reload' class='delete_class' /></div><div class='div' class='portlet-content normal_font' id='Render_div_"+dashBrdId+"'></div></div></li>";

		if(dashBrdDisplayTyp == '1')
			Render_Chart_in_Div(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId);
		else if(dashBrdDisplayTyp == '2')
			Render_Data(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId);
		else if(dashBrdDisplayTyp == '3')
			Render_Pivot(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId);
	}
	else if (DashBoardOrg != '' && SectionDashBCrtdBy == session_login){
		document.getElementById('Add_sec').style.display = 'inline-table';
		dashBoardAppendUL.innerHTML += "<li class='ui-state-default' id='New_Child_DashBoard_"+dashBrdId+"'><div class='portlet'><div class='portlet-header ui-widget-header'>"+dashBrdName+"<img src = '/atCRM/images/setting2.png' alt = 'Setting Icon' id='settingIMGId_"+dashBrdId+"' title = 'Settings' style = 'right:15px;' class = 'img_class' /><img src = '/atCRM/images/dash_delete.png' style = 'right:-15px;' alt = 'Delete Icon' title = 'Delete' class = 'delete_class' onclick='deleteConfirmationSection(\"New_Child_DashBoard_"+dashBrdId+"\")'/><img id='reload_"+dashBrdId+"' src='/atCRM/images/rload.gif' style='right:3px;' alt='Reload Icon' title='Reload' class='delete_class' /><span class='img_class imghover' id='edit_span_"+dashBrdId+"'><ul id='Edit_UL_"+dashBrdId+"'><li id='Pivot_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif'/>Show Pivot</li><li id='Data_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif' />Show Data</li><li id='Chart_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif'/>Show Chart</li></ul></span></div><div class='div' class='portlet-content normal_font' id='Render_div_"+dashBrdId+"'></div></div></li>";

		document.getElementById('settingIMGId_'+dashBrdId).setAttribute("onclick","settingsForDashboard('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");

		if(dashBrdDisplayTyp == '1'){
			Render_Chart_in_Div(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Chart_LI_'+dashBrdId).style.color = 'mediumblue';
		}
		else if(dashBrdDisplayTyp == '2'){
			Render_Data(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Data_LI_'+dashBrdId).style.color = 'mediumblue';
		}
		else if(dashBrdDisplayTyp == '3'){
			Render_Pivot(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Pivot_LI_'+dashBrdId).style.color = 'mediumblue';
		}

		document.getElementById('Chart_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('1','Render_div_"+dashBrdId+"');Render_Chart_in_Div('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
		document.getElementById('Data_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('2','Render_div_"+dashBrdId+"');Render_Data('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
		document.getElementById('Pivot_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('3','Render_div_"+dashBrdId+"');Render_Pivot('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
	}
	else if(DashBoardOrg != '' && SectionDashBCrtdBy != session_login){
		dashBoardAppendUL.innerHTML += "<li class='ui-state-default' id='New_Child_DashBoard_"+dashBrdId+"'><div class='portlet'><div class='portlet-header ui-widget-header'>"+dashBrdName+"<img id='reload_"+dashBrdId+"' src='/atCRM/images/rload.gif' style='right:3px;' alt='Reload Icon' title='Reload' class='delete_class' /><span class='img_class imghover' id='edit_span_"+dashBrdId+"'><ul style='margin-left:-25px;' id='Edit_UL_"+dashBrdId+"'><li id='Pivot_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif'/>Show Pivot</li><li id='Data_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif' />Show Data</li><li id='Chart_LI_"+dashBrdId+"'><img src='/atCRM/images/DA.gif'/>Show Chart</li></ul></span></div><div class='div' class='portlet-content normal_font' id='Render_div_"+dashBrdId+"'></div></div></li>";	

		if(dashBrdDisplayTyp == '1'){
			Render_Chart_in_Div(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Chart_LI_'+dashBrdId).style.color = 'mediumblue';
		}
		else if(dashBrdDisplayTyp == '2'){
			Render_Data(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Data_LI_'+dashBrdId).style.color = 'mediumblue';
		}
		else if(dashBrdDisplayTyp == '3'){
			Render_Pivot(dashBrdReportId,dashBrdName,'Render_div_'+dashBrdId,dashBrdURI,dashBrdSize,'reload_'+dashBrdId,'Chart_LI_'+dashBrdId,'Data_LI_'+dashBrdId,'Pivot_LI_'+dashBrdId,SectionDashBCrtdBy);
		document.getElementById('Pivot_LI_'+dashBrdId).style.color = 'mediumblue';
		}

		document.getElementById('Chart_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('1','Render_div_"+dashBrdId+"');Render_Chart_in_Div('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
		document.getElementById('Data_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('2','Render_div_"+dashBrdId+"');Render_Data('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
		document.getElementById('Pivot_LI_'+dashBrdId).setAttribute("onclick","DashBUpdateIsChart('3','Render_div_"+dashBrdId+"');Render_Pivot('"+dashBrdReportId+"','"+dashBrdName+"','Render_div_"+dashBrdId+"','"+dashBrdURI+"','"+dashBrdSize+"','reload_"+dashBrdId+"','Chart_LI_"+dashBrdId+"','Data_LI_"+dashBrdId+"','Pivot_LI_"+dashBrdId+"','"+SectionDashBCrtdBy+"')");
	}
	
	if(dashBrdSize == 'Small'){
		document.getElementById('New_Child_DashBoard_'+dashBrdId).style.width = DashBSortblWidth+'px';
		document.getElementById('Render_div_'+dashBrdId).style.width = DashBSortblWidth+'px';
		}
	else if(dashBrdSize == 'Medium'){
		document.getElementById('New_Child_DashBoard_'+dashBrdId).style.width = DblDashBSortblWidth+'px';
		document.getElementById('Render_div_'+dashBrdId).style.width = DblDashBSortblWidth+'px';
	}
	else if(dashBrdSize == 'Large'){
		document.getElementById('New_Child_DashBoard_'+dashBrdId).style.width = DblDashBSortblWidth+'px';
		document.getElementById('New_Child_DashBoard_'+dashBrdId).style.height = '534px';
		document.getElementById('Render_div_'+dashBrdId).style.width = DblDashBSortblWidth+'px';
		document.getElementById('Render_div_'+dashBrdId).style.height = '485px';
	}

	$("#dashBoardSortable").sortable({
		start: function(event,ui){
			var old_position = $(this).sortable('toArray');
		},
		update: function(event,ui){
			var new_position = $(this).sortable('toArray');
			DashBStoringPosition(new_position);
		}
	});
	
	var edt_span1 = document.getElementById('edit_span_'+dashBrdId);
	var edt_UL1 = document.getElementById('Edit_UL_'+dashBrdId);
	if(edt_span1 && edt_UL1){
	document.getElementById('Render_div_'+dashBrdId).setAttribute("onmousemove","Sortbl_restrict('Render_div_"+dashBrdId+"')");
		var Nw_Edt_Spn_Size1 = edt_span1.offsetLeft + 320;
		if(Nw_Edt_Spn_Size1 > screen.width)
			edt_UL1.style.marginLeft = '-305px';
	}
}
//Function to Delete the Cookies...
function GetCookie(){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		if(c.indexOf("=")>-1){
			//SpryOlyVal it is variable where the Cookie name's started with Spry...
				var SpryOlyVal = c.substring(c.indexOf('SpryMedia_'),c.indexOf('='));
				if(SpryOlyVal.charAt(0) == 'S'){
					//This is used to Set Expiry date & by this way Cookie get's deleted..
					document.cookie = SpryOlyVal +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
				}
		}
	}
}

//Function to restrict the Draggable on some part of Dashboard...
function Sortbl_restrict(DashBId)
{
	document.getElementById(DashBId).style.cursor = 'default';
	$( '#dashBoardSortable' ).sortable({cancel:'.div'});
}

//Function to Store ID's(When position's of the Dashboard has been changed)...
function DashBStoringPosition(new_position)
{	
	var new_position=new_position.toString(); 
	var NwPositionId=ReplaceAll(new_position,"New_Child_DashBoard_","");
	var SplitVal = NwPositionId.split(',');
	for(i=0;i<SplitVal.length;i++){
		var EdtSpn = 'edit_span_';
		Edt1Spn = EdtSpn.concat(SplitVal[i]);
		var EdtUl = 'Edit_UL_';
		Edt1Ul = EdtUl.concat(SplitVal[i]);
		var edt_span = document.getElementById(Edt1Spn);
		var edt_UL = document.getElementById(Edt1Ul);
		var Nw_Edt_Spn_Size = edt_span.offsetLeft + 320;
					if(Nw_Edt_Spn_Size > screen.width)
						edt_UL.style.marginLeft = '-305px';
					else
						edt_UL.style.marginLeft = '0px';
	}
	
	var Url2StorePosition = '/atCRM/custom/JSON/add/DashBrdSequenceOrder.html?posId='+NwPositionId;
	$.ajax({
		url: Url2StorePosition
	});			
}

//Function to Update IsChart Value for the Particular Id and to Call the function Based on IsChartValue...
function DashBUpdateIsChart(IsCharVal,id)
{
	if(id==countOfPivots)countOfPivots=0;

	var Split_Val = id.split('_');
	var Id_oly = Split_Val[2];
	var Url2UpdtIsChart = "/atCRM/custom/JSON/add/AddSection/editAction?&0-1-7="+IsCharVal+"&0-1-2="+Id_oly;
	$.ajax({
		type: 'POST',
		url: Url2UpdtIsChart
	});
}

//Function to Render_Chart_In_Child_DashB_Div ( / Section's)...
function Render_Chart_in_Div(dashBrdReportId,dashBrdName,id,Url2Render,dashBrdSize,reloadId,Chrt_Li_Id,Data_Li_Id,Pvt_Li_Id,SectionDashBCrtdBy)
{	
	if(document.getElementById(Chrt_Li_Id))document.getElementById(Chrt_Li_Id).style.color='mediumblue';
	if(document.getElementById(Data_Li_Id))document.getElementById(Data_Li_Id).style.color='black';
	if(document.getElementById(Pvt_Li_Id))document.getElementById(Pvt_Li_Id).style.color='black';
	document.getElementById(id).innerHTML = '';
	
	document.getElementById(reloadId).setAttribute("onclick","Render_Chart_in_Div('"+dashBrdReportId+"','"+dashBrdName+"','"+id+"','"+Url2Render+"','"+dashBrdSize+"','"+reloadId+"','"+Chrt_Li_Id+"','"+Data_Li_Id+"','"+Pvt_Li_Id+"','"+SectionDashBCrtdBy+"')");

	if(dashBrdSize == 'Small')
		var myURL = Url2Render+'&t=c&retrieve=chart&chartWidth='+DashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Medium')
		var myURL = Url2Render+'&t=c&retrieve=chart&chartWidth='+DblDashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Large')
		var myURL = Url2Render+'&t=c&retrieve=chart&chartWidth='+DblDashBSortblWidth+'&chartHeight=480&divName='+id;
		
	var dbItemCall=$.getJSON(myURL, 'json', function(json1){
		chartSeries=json1.series;
		if(chartSeries=="")document.getElementById(id).innerHTML = "<div style='margin-top:50px'>No data found for the selected criteria.</div>";
		else if(!chartSeries)
		{
			if(SectionDashBCrtdBy){
				if(SectionDashBCrtdBy == session_login){
					 document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured. Please click <a style='vertical-align:top;color:blue;' class='ahover' onclick='settingsForDashboard(\""+dashBrdReportId+"\",\""+dashBrdName+"\",\""+id+"\",\""+Url2Render+"\",\""+dashBrdSize+"\",\""+reloadId+"\",\""+Chrt_Li_Id+"\",\""+Data_Li_Id+"\",\""+Pvt_Li_Id+"\")'>here</a> to change its settings.</div>";
				}
				else
					 document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured.</div>";
			}
		}
		else
		var chart = new Highcharts.Chart(json1);
	})
	.error(function() {
		var InsideDiv = document.getElementById(id);
		if(SectionDashBCrtdBy){
			if(SectionDashBCrtdBy == session_login){
				InsideDiv.innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured. Please click <a style='vertical-align:top;color:blue;' class='ahover' onclick='settingsForDashboard(\""+dashBrdReportId+"\",\""+dashBrdName+"\",\""+id+"\",\""+Url2Render+"\",\""+dashBrdSize+"\",\""+reloadId+"\",\""+Chrt_Li_Id+"\",\""+Data_Li_Id+"\",\""+Pvt_Li_Id+"\")'>here</a> to change its settings.</div>";
			}
			else
				InsideDiv.innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured.</div>";
		}
	});	
	dbItemsRequest.push(dbItemCall);
}

//Funciton to Render_Data_In_Child_DashB_Div ( / Section's)...
function Render_Data(dashBrdReportId,dashBrdName,id,Url2Render,dashBrdSize,reloadId,Chrt_Li_Id,Data_Li_Id,Pvt_Li_Id,SectionDashBCrtdBy)
{	
	if(document.getElementById(Data_Li_Id))document.getElementById(Data_Li_Id).style.color='mediumblue';
	if(document.getElementById(Chrt_Li_Id))document.getElementById(Chrt_Li_Id).style.color='black';
	if(document.getElementById(Pvt_Li_Id))document.getElementById(Pvt_Li_Id).style.color='black';
	document.getElementById(id).innerHTML = '';
	
	document.getElementById(reloadId).setAttribute("onclick","Render_Data('"+dashBrdReportId+"','"+dashBrdName+"','"+id+"','"+Url2Render+"','"+dashBrdSize+"','"+reloadId+"','"+Chrt_Li_Id+"','"+Data_Li_Id+"','"+Pvt_Li_Id+"','"+SectionDashBCrtdBy+"')");

	if(dashBrdSize == 'Small')
		var myURL = Url2Render+'&t=d&retrieve=data&chartWidth='+DashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Medium')
		var myURL = Url2Render+'&t=d&retrieve=data&chartWidth='+DblDashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Large')
		var myURL = Url2Render+'&t=d&retrieve=data&chartWidth='+DblDashBSortblWidth+'&chartHeight=480&divName='+id;

	if(dashBrdSize == 'Small')var width2use=DashBSortblWidth-20+'px'; else var width2use=DblDashBSortblWidth-20+'px';

	var tableId='reportData-'+id;
	document.getElementById(id).innerHTML="<table id='"+tableId+"' style='color:#333333;text-align:left;' cellspacing='1'></table>";
	document.getElementById(id).style.paddingTop="15px";

	var rederingDiv=document.getElementById(id);

		var dbItemCall=$.getJSON(myURL, 'json', function(json1){
			var myData = json1;
			dataTblData=json1.dataTblData;
			dataTblHdr=json1.dataTblHdr;
			var json_str = JSON.stringify(dataTblData);
			var prevRow;
			var currRowArr = new Array();
			var currRowClassName;		
			if(dataTblData=='')	
				document.getElementById(id).innerHTML = "<div style='margin-top:50px'>No data found for the selected criteria.</div>";
			else
				var oTable = $('#'+tableId).dataTable({
					"aaData": dataTblData,
					"aoColumns": dataTblHdr,
					"bPaginate": false,
					"bLengthChange": false,
					"sScrollX": width2use,
					"sScrollXInner": width2use,
					"bProcessing": true,
					"bStateSave": true,
					"sDom": "\"<clear>\"ti"
				});
		})
		.error(function() {
			if(SectionDashBCrtdBy){
			if(SectionDashBCrtdBy == session_login){
				document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured. Please click <a style='vertical-align:top;color:blue;' class='ahover' onclick='settingsForDashboard(\""+dashBrdReportId+"\",\""+dashBrdName+"\",\""+id+"\",\""+Url2Render+"\",\""+dashBrdSize+"\",\""+reloadId+"\",\""+Chrt_Li_Id+"\",\""+Data_Li_Id+"\",\""+Pvt_Li_Id+"\")'>here</a> to change its settings.</div>";
			}
			else
				document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured.</div>";
			}
		});
	dbItemsRequest.push(dbItemCall);
}

//Function to Render_Pivot_In_Child_DashB_Div ( / Section's)...
function Render_Pivot(dashBrdReportId,dashBrdName,id,Url2Render,dashBrdSize,reloadId,Chrt_Li_Id,Data_Li_Id,Pvt_Li_Id,SectionDashBCrtdBy)
{	
	if(document.getElementById(Pvt_Li_Id))document.getElementById(Pvt_Li_Id).style.color='mediumblue';
	if(document.getElementById(Chrt_Li_Id))document.getElementById(Chrt_Li_Id).style.color='black';
	if(document.getElementById(Data_Li_Id))document.getElementById(Data_Li_Id).style.color='black';
	document.getElementById(id).innerHTML = '';
	
	document.getElementById(reloadId).setAttribute("onclick","Render_Pivot('"+dashBrdReportId+"','"+dashBrdName+"','"+id+"','"+Url2Render+"','"+dashBrdSize+"','"+reloadId+"','"+Chrt_Li_Id+"','"+Data_Li_Id+"','"+Pvt_Li_Id+"','"+SectionDashBCrtdBy+"')");

	if(dashBrdSize == 'Small')
		var myURL = Url2Render+'&t=p&retrieve=pivot&chartWidth='+DashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Medium')
		var myURL = Url2Render+'&t=p&retrieve=pivot&chartWidth='+DblDashBSortblWidth+'&chartHeight=210&divName='+id;
	else if(dashBrdSize == 'Large')
		var myURL = Url2Render+'&t=p&retrieve=pivot&chartWidth='+DblDashBSortblWidth+'&chartHeight=480&divName='+id;
	

	var dbItemCall=$.getJSON(myURL, 'json', function(json1)
	{	
		rowLabels=json1.rowLabels;
		columnLabels=json1.columnLabels;
		summaries=json1.summaries;
		if(!rowLabels && !columnLabels && !summaries)
		{
			if(SectionDashBCrtdBy){
				if(SectionDashBCrtdBy == session_login){
					document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured. Please click <a style='vertical-align:top;color:blue;' class='ahover' onclick='settingsForDashboard(\""+dashBrdReportId+"\",\""+dashBrdName+"\",\""+id+"\",\""+Url2Render+"\",\""+dashBrdSize+"\",\""+reloadId+"\",\""+Chrt_Li_Id+"\",\""+Data_Li_Id+"\",\""+Pvt_Li_Id+"\")'>here</a> to change its settings.</div>";
				}
				else
					document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured.</div>";
			}
		}
		else if(rowLabels=='' && columnLabels=='' && summaries=='')
			document.getElementById(id).innerHTML += "<div style='margin-top:50px'>Please select the columns to show Pivot Report.</div>";
		else{
			//if(countOfPivots == 0||countOfPivots==id)
			{
				countOfPivots=id;
				var tableId='pivotResult-'+id;
				document.getElementById(id).innerHTML='<div id="pivot-menu-'+tableId+'"></div><div id="results-'+id+'" style="color:#333333;text-align:left;font-weight:normal"><table id="'+tableId+'"><tr><td></td></tr></table></div>';
				document.getElementById(id).style.paddingTop="15px";
				pivot_fields = json1.pivot_fields;
				for(var x=0; x<pivot_fields.length; x++)
				{
					if(pivot_fields[x].displayFunction=="fun")pivot_fields[x].displayFunction='function(value){return accounting.formatNumber(value);}';
					//alert(pivot_fields[x].displayFunction);
				}
				pivot_json = json1.pivot_json;
				filters=json1.filters;
				prefillData=filters+","+rowLabels+","+columnLabels+","+summaries;
				setupPivot({json:pivot_json, fields:pivot_fields,"filters":filters,"rowLabels":rowLabels,"columnLabels":columnLabels,"summaries":summaries},id,tableId);
			}
			//else
				//document.getElementById(id).innerHTML = "<div style='margin-top:50px'>Currently, we support one pivot report per Dashboard.</div>";
		}
	})
	.error(function() {
		if(SectionDashBCrtdBy){
			if(SectionDashBCrtdBy == session_login){
				document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured. Please click <a style='vertical-align:top;color:blue;' class='ahover' onclick='settingsForDashboard(\""+dashBrdReportId+"\",\""+dashBrdName+"\",\""+id+"\",\""+Url2Render+"\",\""+dashBrdSize+"\",\""+reloadId+"\",\""+Chrt_Li_Id+"\",\""+Data_Li_Id+"\",\""+Pvt_Li_Id+"\")'>here</a> to change its settings.</div>";
			}
			else
				document.getElementById(id).innerHTML = "<div style='margin-top:50px'>This Dashboard Section is either not yet configured or misconfigured.</div>";
		}
	});
	
	dbItemsRequest.push(dbItemCall);
}
function setupPivot(input,id,tableId)
{
	input.callbacks = {afterUpdateResults: function(){
		$('#'+tableId).dataTable({
		"iDisplayLength": 50,
		"aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
		"oLanguage": {
		"sLengthMenu": "_MENU_ records per page"
		}
		});
		}};
	$('.stop-propagation').click(function(event){event.stopPropagation();});
	currentPivot='results-'+id;
	$('#pivot-menu-'+id).pivot_display('setup', input);
}

//Function to Add the Parent DashBoard's( / Container's), onClick of the Add_New_DashBoard of Li's...
function Add_New_DashB_Container(PrntCrtFlg,IsDashBEdtFlg,PreVal)
{	
	var TxtBxVal = document.getElementById('txt_dashb_name').value;
	TxtBxVal = TxtBxVal.trim();
	if(TxtBxVal == '')
		alert('Please enter dashboard name to create.');
	else
	{	
		if(CmprSectionName(PrntCrtFlg,IsDashBEdtFlg,PreVal)){
		var url2DashBoard;
		if(document.getElementById('UsrUpdateFrParentDashB').checked && IsDashBEdtFlg == 0){
			var url2DashBoard = "/atCRM/custom/JSON/add/AddSection/editAction?0-1-2="+document.getElementById('Select_dashB_Itms').value+"&0-1-3="+document.getElementById('txt_dashb_name').value+"&0-1-4="+document.getElementById('txtarea_dashb_desc').value+"&0-1-6=0&0-301-303="+document.getElementById('txt_dashb_name').value+"&0-301-304="+document.getElementById('txtarea_dashb_desc').value+"&0-1-15="+session_login;
		}
		else if(document.getElementById('UsrUpdateFrParentDashB').checked){
			var url2DashBoard = "/atCRM/custom/JSON/add/AddSection/editAction?0-1-3="+document.getElementById('txt_dashb_name').value+"&0-1-4="+document.getElementById('txtarea_dashb_desc').value+"&0-1-6=0&0-301-303="+document.getElementById('txt_dashb_name').value+"&0-301-304="+document.getElementById('txtarea_dashb_desc').value+"&0-1-15="+session_login;
		}
		else if(IsDashBEdtFlg == 0){
			var url2DashBoard = "/atCRM/custom/JSON/add/AddSection/editAction?0-1-2="+document.getElementById('Select_dashB_Itms').value+"&0-1-3="+document.getElementById('txt_dashb_name').value+"&0-1-4="+document.getElementById('txtarea_dashb_desc').value+"&0-1-6=0&0-301-303="+document.getElementById('txt_dashb_name').value+"&0-301-304="+document.getElementById('txtarea_dashb_desc').value+"&0-1-15=";
		}
		else{
			var url2DashBoard = "/atCRM/custom/JSON/add/AddSection/editAction?0-1-3="+document.getElementById('txt_dashb_name').value+"&0-1-4="+document.getElementById('txtarea_dashb_desc').value+"&0-1-6=0&0-301-303="+document.getElementById('txt_dashb_name').value+"&0-301-304="+document.getElementById('txtarea_dashb_desc').value+"&0-1-15=";
		}
		$.ajax({
			type: 'POST',
			url: url2DashBoard,
			dataType: 'json',
			success: function(doc){
				SelectedPrntDashBVal = doc['addedId'];
				document.getElementById('txt_dashb_name').value = '';
				document.getElementById('txtarea_dashb_desc').value = '';
				closeCommonPopup();
				Get_Parnt_DashB_LI();
			}
		});

		}
	}
}

//Function to Add New Child DashBoard ( / Section's) to the Parent DashBoard ( / Container's)...
function Add_New_Child_DashB(SectCrtFlg)
{
	var TxtBxVal = document.getElementById('txt_section_name').value;
	TxtBxVal = TxtBxVal.trim();
	var SecDesc = document.getElementById('txtarea_section_desc').value;
	SecDesc = SecDesc.trim();
	if(TxtBxVal == '')
		alert('Please enter section name to create');
	else if(SecDesc == '')
		alert('Please enter section description to create');
	else
	{	
		var testVar=CmprSectionName(SectCrtFlg);
		if(testVar){
		var url2Section;
		PresentParentValue = document.getElementById('Select_dashB_Itms').value;
		if(document.getElementById('UsrUpdateFrSectionDashB').checked){
			var url2Section = "/atCRM/custom/JSON/add/AddSection/editAction?&0-1-3="+document.getElementById('txt_section_name').value+"&0-1-4="+document.getElementById('txtarea_section_desc').value+"&0-1-27="+document.getElementById('DashBSelectSize').value+"&0-1-9="+PresentParentValue+"&0-301-303="+document.getElementById('txt_section_name').value+"&0-301-304="+document.getElementById('txtarea_section_desc').value+"&0-301-305="+document.getElementById('DashBSelectEntity').value+"&0-1-6=0&0-1-7=1&0-1-15="+session_login+"&0-301-345="+session_login;
		}
		else {
			var url2Section = "/atCRM/custom/JSON/add/AddSection/editAction?&0-1-3="+document.getElementById('txt_section_name').value+"&0-1-4="+document.getElementById('txtarea_section_desc').value+"&0-1-27="+document.getElementById('DashBSelectSize').value+"&0-1-9="+PresentParentValue+"&0-301-303="+document.getElementById('txt_section_name').value+"&0-301-304="+document.getElementById('txtarea_section_desc').value+"&0-301-305="+document.getElementById('DashBSelectEntity').value+"&0-1-6=0&0-1-7=1&0-1-15=&0-301-345=";
		}
		
		$.ajax({
			type: 'POST',
			url: url2Section,
			dataType: 'json',
			success: function(doc){

				closeCommonPopup();
				Get_DashB_Child_Items();
				document.getElementById('txt_section_name').value = '';
				document.getElementById('txtarea_section_desc').value = '';
				document.getElementById('DashBSelectSize').value = 'Small';
				document.getElementById('DashBSelectEntity').value = 'accounts';
				document.getElementById('OrgUpdateFrSectionDashB').checked = 'true';
			}
		});
		}
	}
}

function CmprSectionName(IsPrntOrSectFlag,IsDashBEditFlg,PrevVal)
{	
	PrevVal = unescape(PrevVal);
	if(IsPrntOrSectFlag == 'parent'){
		var StrVal = document.getElementById('txt_dashb_name').value;
		if(PrevVal && StrVal==PrevVal){
			return true;
		}
		else if(document.getElementById('txt_dashb_name').value != '')
			var UrlFrCmprSection = "/atCRM/custom/JSON/system/CmprSectionName.htm?name="+document.getElementById('txt_dashb_name').value;
		else return true;
	}
	else{
		if(document.getElementById('txt_section_name').value != '')
			var UrlFrCmprSection = "/atCRM/custom/JSON/system/CmprSectionName.htm?name="+document.getElementById('txt_section_name').value;
		else return false;
	}
	var RetrnVal;
		$.ajax({
			type: 'POST',
			url: UrlFrCmprSection,
			dataType: 'json',
			async:false,
			success: function(doc){
				if(IsPrntOrSectFlag == 'parent'){
						if(doc.DashBSectionId){
							document.getElementById('txt_dashb_name').value='';
							document.getElementById('DashBParentErrDiv').style.display='block';
							document.getElementById('DashBParentErrDiv').innerHTML = "Dashboard with the name \""+StrVal+"\" exists, please enter a different name.";
							document.getElementById('txt_dashb_name').focus();
							RetrnVal=false;
						}
						else{
							document.getElementById('DashBParentErrDiv').style.display='none';
							RetrnVal=true;
						}
				}
				else{
					if(doc.DashBSectionId){
						var StrSectName = document.getElementById('txt_section_name').value;
						document.getElementById('txt_section_name').value='';
						document.getElementById('DashBSectionErrDiv').style.display='block';
						document.getElementById('DashBSectionErrDiv').innerHTML = "Dashboard with the name \""+StrSectName+"\" exists, please enter a different name.";
						document.getElementById('txt_section_name').focus();
						RetrnVal=false;
					}
					else{
						document.getElementById('DashBSectionErrDiv').style.display='none';
						RetrnVal=true;
					}
				}
			}
	});
	return RetrnVal;
}

function ShowModification(){document.getElementById('TdModification').style.visibility = 'visible';}

function HideModification(){document.getElementById('TdModification').style.visibility = 'hidden';}