var previousSortNode=new Array();
var previousSortName;
var contextualMenuLength=new Array();
var lastMnuItmId;
var lastSubMnuItmId;
var listPopup;
var popUpWidth;
var popUpHeight
var showLayout=false;
var bottomMnuCnt=0;
var showAdd;
var showJsonListDesc="block";
var lineLvlMnuPos="";
var lineLvlMnuPosTop="-9px";
var showRecentlyAdded=false;
var recetlyAddedValue=0;

function handleJsonList(data,popupdiv,popUp_Width,popUp_Height,popUpUrl,contMnuItemId) {

	//if(contMnuItemId && contMnuItemId !="") mnuItmId = contMnuItemId;
	console.log("mnuItmId-"+mnuItmId);
	closeLoadingDiv();	
	/*All the functions in this js are used to List records in
		1. List screen
		2. Popup div
	*/
	listPopup=false;
	bottomMnuCnt=0;
	showLayout=true;
	if(popupdiv){	
		mnuItmId=popupdiv;
		listPopup=true;
		var mainDataDiv=document.getElementById(popupdiv);
		popUpWidth=popUp_Width;
		popUpHeight=popUp_Height;
		if(document.getElementById(mnuItmId+'-URL')) document.getElementById(mnuItmId+'-URL').value=popUpUrl;
	}
	else{
		var mainDataDiv=document.getElementById(entityDiv);
	}

	//Delete list for different entities from Menu
	if((lastMnuItmId==mnuItmId)&&((document.getElementById('baseUrl_'+lastSubMnuItmId).value.split('?')[0])!=(document.getElementById('baseUrl_'+subMnuItmId).value.split('?')[0])))
	{
		var parentDiv = mainDataDiv;
		var olddiv = document.getElementById(mnuItmId+"-lstTbl");
		parentDiv.removeChild(olddiv);
	}

	//Delete list for different entities setUpPageParameters function
	if(document.getElementById(mnuItmId+"-lstTbl"))
	{
		var divName='divList-'+mnuItmId+'-'+data.EntityName;
		var currentDiv=document.getElementById(divName);
		if(!currentDiv)
		{
			var obj=document.getElementById(mnuItmId+'-lstTd');
			otherDiv = obj.childNodes[0];
			if(otherDiv)
			{
				//var listForm = document.getElementById(mnuItmId+"-LstForm");
				var listForm = mainDataDiv;
				var listDiv = document.getElementById(mnuItmId+"-lstTbl");
				listForm.removeChild(listDiv);		
			}
		}
	}
	var filterValue;
    if(document.getElementById(mnuItmId+'-URL')){
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	filterValue=getParameterValue(pagUrl,'filterName');
	}
	if(filterValue)var filterImg="/atCRM/images/JSON/filter_selected.png"; else var filterImg="/atCRM/images/JSON/no-filter.png";


	//Check for the main table of list before creating. If table found, rewrite .
	if(!document.getElementById(mnuItmId+"-lstTbl"))
	{
		var mainTable=CreateTable(mainDataDiv,'',mnuItmId+'-lstTbl','','0','0');
		mainTable.paddingLeft="2px";
		var mainBody=CreateBody(mainTable); 

		if(!popupdiv)
		{
			mainTable.width='100%';
			//Create area for page caption and help text
			var listTitleTr=CreateTR(mainBody);
			var listTitleTd=CreateTD(listTitleTr,'pageTitleTd');
			var listTitleDivContentRec='<table cellpadding="0" cellspacing="0"><tr><td><span id="'+mnuItmId+'-Title" class="pageTitle"></span><span style="padding:5px;font-size:11px;font-weight:normal">['+data.NItem+']</span></td><td><span id="'+mnuItmId+'-filterDiv" class="styled-select"><img src="'+filterImg+'" style="vertical-align:middle"><input type="hidden" name="'+mnuItmId+'-filter" id="'+mnuItmId+'-filter" ></span></td></tr></table>';
			//var listTitleDivContentRec='<div class="styled-select"><select id="'+mnuItmId+'-filter" onchange="filterChanged(this);"></select></div>';

			//show recently added record on top of the list-- Priya
			showRecentlyAdded=false;	
			if(recetlyAddedValue!=data.recentlyAddedRecId)
			showRecentlyAdded=true;
			if(data.recentlyAddedRecName&&showRecentlyAdded==true)
			{ 		
				var showAddedUrl=changeParameterValue (data.ViewUrl,'id',data.recentlyAddedRecId,true);
				showAddedUrl = showAddedUrl.replace(/\?/g,"~");
				showAddedUrl = showAddedUrl.replace(/&/g,"@");
				showAddedUrl = showAddedUrl.replace(/=/g,"*");

				listTitleDivContentRec+='<span class="RecentlyAddedRec" style="width:30%;display:block;text-align:center;margin-top: -16px; margin-left:210px; border:0px solid red;" id="RecentlyAddedRecSpan">Added '+data.EntityName+' <a style="border:0px solid red;" name="recAddedRec" id="recAddedRec" href=\"#setUpPageParameters?viewUrl='+showAddedUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9)+'\"><font class="RecentlyAddedRecName" style="text-decoration:underline;">'+data.recentlyAddedRecName+' </font></a></span>';
				setTimeout('hideRecAddedSpan()', 15000);
				recetlyAddedValue=data.recentlyAddedRecId;						
				showRecentlyAdded=false;
				var listTitleDiv=CreateDIV(listTitleTd,'jsonHeading',mnuItmId+"-lstHdr",listTitleDivContentRec,'100%'); 
	        }

			if(!data.recentlyAddedRecName){  		
				var listTitleDiv=CreateDIV(listTitleTd,'jsonHeading',mnuItmId+"-lstHdr",listTitleDivContentRec,'100%');
			}
			
			if(data.EntityName=="Lead")var tableForFilter="Lead"; else var tableForFilter=data.TableName;
			var fltrCom=document.getElementById(mnuItmId+'-filterDiv');
			populateFilterCombo(tableForFilter,fltrCom,data.PageCaption);

			//Create area for page top menu items
			if(data.PrefsId && data.ColumnHeaders.length>0)
			{	
				//var topMenuTr=CreateTR(mainBody);
				var topMenuTd=CreateTD(listTitleTr);
				var topMenuDv=CreateDIV(topMenuTd,'pageTitleTd',mnuItmId+'topMenuDiv','','100%');	
				createPageMenuItms(data);

				//Create area for listdata
				var dataTr=CreateTR(mainBody);
				var dataTd=CreateTD(dataTr,'',mnuItmId+'-lstTd');
				dataTd.colSpan="2";

				//Create area for pagination
				var bottomMenuTr=CreateTR(mainBody);
				var bottomMenuTd=CreateTD(bottomMenuTr);
				var LstPgnDiv=CreateDIV(bottomMenuTd,'pagination',mnuItmId+'LstPgnDiv','','100%');				
				bottomMenuTd.colSpan="2";
			}	
		}
		else 
		{
			mainTable.width='98%';
			if(data.PrefsId && data.ColumnHeaders.length>0)
			{
				//Create area for listdata
				var dataTr=CreateTR(mainBody);
				var dataTd=CreateTD(dataTr,'',mnuItmId+'-lstTd');
				dataTr.style.border="1px solid red";

				//Create area for pagination
				var bottomMenuTr=CreateTR(mainBody);
				var bottomMenuTd=CreateTD(bottomMenuTr);
				var LstPgnDiv=CreateDIV(bottomMenuTd,'pagination',mnuItmId+'LstPgnDiv','','100%');
			}	
		}

		CreateHIDDEN(mainDataDiv, '', mnuItmId+'-pagAmt', data.PagingAmount);
		CreateHIDDEN(mainDataDiv, '', mnuItmId+'-listOrderBy', data.OrderBy);
		CreateHIDDEN(mainDataDiv, '', mnuItmId+'-clipBoard');
	}
	else
	{
		if(!popupdiv)
		{
			//Rewrite page caption and help text
			var listTitleDivContentRecAdded='<table cellpadding="0" cellspacing="0"><tr><td><span id="'+mnuItmId+'-Title" class="pageTitle"></span><span style="padding:5px;font-size:11px;font-weight:normal">['+data.NItem+']</span></td><td><span id="'+mnuItmId+'-filterDiv" class="styled-select"><img src="'+filterImg+'" style="vertical-align:middle"><input type="hidden" name="'+mnuItmId+'-filter" id="'+mnuItmId+'-filter" ></span></td></tr></table>';

			//show recently added record on top of the list-- Priya
			showRecentlyAdded=false;
			if(recetlyAddedValue!=data.recentlyAddedRecId)
			showRecentlyAdded=true;	
			if(data.recentlyAddedRecName&&showRecentlyAdded==true)
			{		
				var showAddedUrl=changeParameterValue (data.ViewUrl,'id',data.recentlyAddedRecId,true);
				showAddedUrl = showAddedUrl.replace(/\?/g,"~");
				showAddedUrl = showAddedUrl.replace(/&/g,"@");
				showAddedUrl = showAddedUrl.replace(/=/g,"*");

			  listTitleDivContentRecAdded+='<span class="highlightRecentlyAdded" id="RecentlyAddedRecSpan">Added '+data.EntityName+' <a style="border:0px solid red;" name="recAddedRec" id="recAddedRec" href=\"#setUpPageParameters?viewUrl='+showAddedUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9)+'\"><font class="RecentlyAddedRecName" style="text-decoration:underline;">'+data.recentlyAddedRecName+' </font></a></span>';
				setTimeout('hideRecAddedSpan()', 15000);
			   recetlyAddedValue=data.recentlyAddedRecId;						   
			   showRecentlyAdded=false;
			 document.getElementById(mnuItmId+"-lstHdr").innerHTML=listTitleDivContentRecAdded;			 
			}

			if(!data.recentlyAddedRecName)
			{
			document.getElementById(mnuItmId+"-lstHdr").innerHTML=listTitleDivContentRecAdded
			}
			
			if(data.EntityName=="Lead")var tableForFilter="Lead"; else var tableForFilter=data.TableName;
			var fltrCom=document.getElementById(mnuItmId+'-filterDiv');
			populateFilterCombo(tableForFilter,fltrCom,data.PageCaption);

			var pageUrl=document.getElementById(mnuItmId+'-URL').value;
			document.getElementById(mnuItmId+'-pagAmt').value=data.PagingAmount;
			document.getElementById(mnuItmId+'-listOrderBy').value=data.OrderBy;

			//Fill in Search Text --- "Search for Entitiy" OR "Keyword"
			conditionIndex=pageUrl.indexOf('condition__1');
			if(conditionIndex<0){
				document.getElementById(mnuItmId+'searchTxt').value='Search for '+data.EntityName;
				document.getElementById(mnuItmId+'searchIndicator').innerHTML='';
			}
			else{	
				document.getElementById(mnuItmId+'searchIndicator').innerHTML='<a style="color:blue;text-decoration:underline" href="javascript:clearSearchResults();">Clear search</a>';
			}

			//Fill selected filter in the filter dropdown
			var filterName=getParameterValue (pageUrl,'filterName')
			//var filterBoxObj=document.getElementById(mnuItmId+"-filter");

			/*if(filterBoxObj)
			{
				if(filterName)var filterBoxValue = filterBoxObj.options [filterBoxObj.selectedIndex].value;
				else filterBoxObj.selectedIndex=0;
			}*/
			//Rewrite Add URL
			if(document.getElementById("tab_add"+mnuItmId)&&showAdd==true)
			{
				var addUrl = data.AddUrl.replace(/\?/g,"~");
				var addIsfunction=addUrl.indexOf('javascript');
				if(addIsfunction==0)
				{
					var addAncTxt=addUrl;
				}
				else
				{	
				addUrl = addUrl.replace(/&/g,"@");
				addUrl = addUrl.replace(/=/g,"*");
				//For type/stage based functionality. By Hamsa.
				if(data.EntityName=="Contact"||data.EntityName=="Account"||data.EntityName=="Opportunity")
				var addAncTxt="javascript:getAddDataFrmCache('"+data.AddUrl+"')";
				else
				var addAncTxt='#setUpPageParameters?viewUrl='+addUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9);
				document.getElementById("tab_add"+mnuItmId).href=addAncTxt;
				}
			}
        }
	}
	
	//Write the page content only if user has the view preferences set.
	if(data.PrefsId && data.ColumnHeaders.length>0)
	{
		createPageData(data,popupdiv,popUpWidth,popUpHeight);
		createLstPagination(data.PagingAmount,data.PageNumber,data.LinkCount,data.NItem,data.RowData.length,data.PrefsId,data.RowData);
		if(data.Reload=="true"){changeParameterValue (document.getElementById(mnuItmId+'-URL').value,'reload',true)}	
	}
	else
	{
		var LstPgnDiv=CreateDIV(mainDataDiv,'commonErrPopupDiv',mnuItmId+'LstPgnDiv','','100%');
		LstPgnDiv.style.display="block";
		LstPgnDiv.style.width="600px";			
		var leftPos=((window.document.body.clientWidth)-900)/2;
		LstPgnDiv.style.left=leftPos+"px";
		if(!popupdiv)
		{
			if(showLayout==true)LstPgnDiv.innerHTML="Oops! It seems you don't have a page layout set up for this page. Click<a href=\"javascript:SetPreferences ('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+data.PageCaption+"')\"> here</a> to set up this page's layout. Impel will remember your layout for future logins.";
			else LstPgnDiv.innerHTML="Oops! It seems you don't have a page layout set up for this page. Please contact your system admin to set up one.";
		}
	}
	lastMnuItmId=mnuItmId;
	lastSubMnuItmId=subMnuItmId;
	/*If xn_templateView ,load jquery window files, by Dony on 04 Oct 2012*/
	var udmName=data.UDMName;
	if(udmName.indexOf("xn_templateView")>-1) 
	{
	  parent.templateType=data.type;
	  //$("head").append('<link rel="stylesheet" type="text/css" href="/atCRM/stylesheets/JSON/jquery/jquery.window.css">');
	  //$("head").append('<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.window.js"></script>');
	  $("head").append('<script type="text/javascript" src="/atCRM/javascript/JSON/jquery/jquery.form.js"></script>');
	}
	/*Loading jquery files ends here*/
}
//Hide recently added record after 15 seconds- Priya
function hideRecAddedSpan()
{	
 document.getElementById("RecentlyAddedRecSpan").style.display="none";
}

//Clear the search results
function clearSearchResults()
{
	var url=document.getElementById(mnuItmId+'-URL').value;
	ifCondition=getParameterValue (url,'condition__1');
	if(ifCondition)
	{
		reloadUrl=deleteParameter (url,'condition__1',true);
		reloadUrl=deleteParameter (reloadUrl,'page__number__1',true);
		document.getElementById(mnuItmId+'-URL').value=reloadUrl;
		callAsync=false;
		setUpPageParameters(reloadUrl,entityDiv);	
	}
}

function createPageMenuItms(data)
{	
	//Create tabs at the top the list page
	var page_topMenu=data.page_topMenu;
	var topMenuDiv=document.getElementById(mnuItmId+'topMenuDiv');
	var topMenuTbl = CreateTable(topMenuDiv);
	topMenuTbl.setAttribute("cellSpacing",3);
	var topMenuTbdy = CreateBody(topMenuTbl); 
	topMenuTbl.align="right";
	topMenuTbl.style.paddingRight="5px";
	topMenuTbl.style.marginBottom="3px";
	var topMenuTr=CreateTR(topMenuTbdy);
	
	showAdd=data.ShowAdd =="NO"? false : true;

	//Create text box for search	
	var searchTd=CreateTD(topMenuTr);	
	searchTd.innerHTML='<span id="'+mnuItmId+'searchIndicator" style="font-size:11px;font-family:tahoma,verdana;margin-right:10px"></span>';
	var srchBoxDispTxt='Search for '+data.EntityName;
	searchTd.innerHTML+='<input type="text" class="searchBox" id="'+mnuItmId+'searchTxt"  name="'+mnuItmId+'searchTxt" style="margin: 0px;" value="'+srchBoxDispTxt+'" onfocus="if(this.value==\''+srchBoxDispTxt+'\')this.value=\'\'" onblur="if(this.value==\'\'){clearSearchResults();this.value=\''+srchBoxDispTxt+'\'}" onkeypress="{var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13) doJsonSearch(\''+data.TableName+'\',this);}">';

	//var searchTxtBox=CreateTEXTBOX(searchTd, 'searchBox', , srchBoxDispTxt);
	//searchTxtBox.style.margin="0px";
	//AddFocusEventListener(searchTxtBox,function (){if(searchTxtBox.value==srchBoxDispTxt)searchTxtBox.value='';});
	//AddBlurEventListener(searchTxtBox,function (){if(searchTxtBox.value==''){clearSearchResults();searchTxtBox.value='Search for '+data.EntityName;}});
	//AddOnKeyPressEventListener(searchTxtBox,function (event){var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)doJsonSearch(data.TableName,searchTxtBox);});

//	topMenuTr.innerHTML+="<td class=\"listButtons refresh\" onclick='reloadCurrentPage();' title='Reload'>&nbsp;</td>";
	if(data.PageCaption != 'Layout')
	topMenuTr.innerHTML+="<td class=\"listButtons refresh\" onclick='reloadCurrentPage();' title='Reload'>Reload</td>";

	//Create Third level menu items
	for(var topMenu=0; topMenu<page_topMenu.length; topMenu++)
	{
		var mnuName=page_topMenu[topMenu].menu[0];
		var mnuDesc=page_topMenu[topMenu].menu[1];
		var mnuLink=page_topMenu[topMenu].menu[2];
		var mnuOrder=page_topMenu[topMenu].menu[3];
		if(mnuName=="Add")showAdd=false;
		if(mnuName=="Layout")showLayout=true;
		else if(mnuLink)
		{
			//var topMnuTd=CreateTD(topMenuTr,'listButtons');	
			var linkIsfunction=mnuLink.indexOf('javascript');
			if(linkIsfunction==0)
			{
				var topMnuAncTxt=mnuLink;
			}
			else
			{
				var topMnuAncTxt="javascript:setUpPageParameters('"+zcServletPrefix+"/"+mnuLink+"')";
			}
			//var topMnuAnc=CreateA(topMnuTd, "", "", topMnuAncTxt, null, mnuName,mnuDesc);
			topMenuTr.innerHTML+="<td class=\"listButtons noIcon\" onclick=\""+topMnuAncTxt+"\" title=\""+mnuDesc+"\">"+mnuName+"</td>"
		}
	}

	//Create menu for "Add"
	if(showAdd==true)
	if(data.AddUrl)
	{
		var addUrl = data.AddUrl;
		/*var addUrl = data.AddUrl.replace(/\?/g,"~");
		addUrl = addUrl.replace(/&/g,"@");
		addUrl = addUrl.replace(/=/g,"*");*/

		//var addTd=CreateTD(topMenuTr,'listButtons addIcon');			
		//var addAncTxt="javascript:setUpPageParameters ('"+data.AddUrl+"','"+entityDiv+"')";
		
		var addIsfunction=addUrl.indexOf('javascript');
		if(addIsfunction==0)
			var addAncTxt=addUrl;
		else
		{
			if((data.EntityName=="Contact"||data.EntityName=="Account"||data.EntityName=="Opportunity") && L_frm_lz==false)
			var addAncTxt="javascript:getAddDataFrmCache('"+data.AddUrl+"','"+data.EntityName+"')";
			else{var addAncTxt="javascript:setUpPageParameters('"+addUrl+"','"+entityDiv+"');";}
			//else{var addAncTxt='#setUpPageParameters?viewUrl='+addUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9);}
		}
		//var addAnc=CreateA(addTd, "", "tab_add"+mnuItmId, addAncTxt, null, "Add","Add "+data.EntityName);
		topMenuTr.innerHTML+='<td class="listButtons addIcon" title="Add '+data.EntityName+'" onclick="'+addAncTxt+'">Add</td>'
	}

	//Create menu for "Layout"	
	if(showLayout==true)
	{
		//var prefsTd=CreateTD(topMenuTr,'listButtons layoutIcon');
		var caption=data.PageCaption;
		caption=caption.slice(0,caption.indexOf('-'))
		var prefsAncTxt="javascript:SetPreferences ('"+data.PrefsId+"','"+data.PrefsName+"','"+data.UDMName+"','"+entityDiv+"','"+data.PageType+"','"+caption+"')";
		if(data.PageCaption != 'Layout')
		topMenuTr.innerHTML+='<td class="listButtons layoutIcon" title="Change page layout" onclick="'+prefsAncTxt+'">Layout</td>'
		//var prefsAnc=CreateA(prefsTd, "", "tab_Prefs", prefsAncTxt, null, "Layout","Change page layout");
	}

	//Create menu for "Filters" based on "ShowFilter" attribute in the JSON data. 
	if(data.ShowFilter=="YES")
	{
		if(data.EntityName=="Lead")var tableForFilter="Lead"; else var tableForFilter=data.TableName;
		topMenuTr.innerHTML+='<td class="listButtons filterIcon" title="Filters" onclick="javascript:callFilterPage(\''+tableForFilter+'\');">Filter</td>';
		//var fltrTxtTd=CreateTD(topMenuTr,'listButtons filterIcon');	
		//var fltrAnc=CreateA(fltrTxtTd, "", "tab_Filters","javascript:callFilterPage('"+tableForFilter+"');", null, "Filter","Filters");

		/*var fltrComTd=CreateTD(topMenuTr);	
		var fltrCom=CreateSelectBox(fltrComTd,"smallFontElement",mnuItmId+"-filter");
		fltrCom.onchange=function(){filterChanged(fltrCom)};
		fltrCom.onfocus=function(){checkFilterCount(tableForFilter,fltrCom)};
		populateFilterCombo(tableForFilter,fltrCom,data.FilterName);*/
	}
	
		//added by govardhan for adHoc report List
	if(data.PageType=="List" && data.UDMName=="custom/adhocReports/reportView" && data.UserCanAddAdhoc == 1)
	{
			var adHocCreateReportTd=CreateTD(topMenuTr,'listButtons');
			var adHocReportMnuDiv = CreateDIV(adHocCreateReportTd, 'show-actions-list', "categories-menu","New Report..", "85px");
			adHocReportMnuDiv.style.position = "relative";
			adHocReportMnuDiv.style.display = "block";
			var adHocReportMnuUL = CreateDIV(adHocReportMnuDiv, 'actions-pop-up no-style', 'actions-pop-up');
			// adHocReportMnuUL.style.position = "absolute";
			adHocReportMnuUL.style.display = "none";
			var adHocReportMnuName;
			var adHocReportMnuUrl = zcServletPrefix+"/custom/adhocReports/editReport.html?entityName=";
			var adHocReportMnuNames = new Array("Accounts","Activities","Contacts","Finance Transactions","Inventory","Invoices","Leads","Loyalty Programs","Marketing Programs","Opportunities","Products","Purchase Orders","Tickets","Users"); 
			var adHocReportEnttName = new Array("accounts","activities","contacts","fin_transs","tranx_headers","invoice_headers","leads","loy_program","mktg_program","opportunities","product","purch_orders","tickets","sbeuser");
			var adHocReportEnttImg = new Array("/atCRM/images/Icon_Account.gif","/atCRM/images/Icon_activity.gif","/atCRM/images/Icon_Contact.gif","/atCRM/images/ico_fin_trans.png","/atCRM/images/ico_invt.png","/atCRM/images/ico_invc.png","/atCRM/images/icon_lead2.gif","/atCRM/images/icon_loyalty.PNG","/atCRM/images/Icon_marketing.gif","/atCRM/images/Icon_Opportunity.gif","/atCRM/images/Icon_Product.gif","/atCRM/images/ico_po.png","/atCRM/images/Icon_ticket.gif","/atCRM/images/icon_meeting.gif");
			
			var lim=3, tr='', tmpi=1, tmpTr;
			for(adHocRepi = 0;adHocRepi < adHocReportMnuNames.length;adHocRepi++){
				adHocReportMnuName = adHocReportMnuNames[adHocRepi];
				adHocReportEnttUrl = adHocReportMnuUrl+adHocReportEnttName[adHocRepi];
				// adHocReportMnuUL.innerHTML+= "<li onclick='createAdHocReport(\""+adHocReportEnttUrl+"\");' title='"+adHocReportMnuNames[adHocRepi]+"'><img border='0' style='vertical-align: middle;' width='16px' height='16px' src='"+adHocReportEnttImg[adHocRepi]+"'/>&nbsp;<a href='javascript:void(0)'>"+adHocReportMnuName+"</a></li>";
				tmpTr = "<td class='actLstTab' goto='createAdHocReport(\""+adHocReportEnttUrl+"\");' title='"+adHocReportMnuNames[adHocRepi]+"'><table><tr><th><img border='0' style='vertical-align: middle;width:25px;height:25px;' src='"+adHocReportEnttImg[adHocRepi]+"'/></th><th><p class='actions-tit'><a href='javascript:void(0)'>"+adHocReportMnuName+"</a></p></th></tr></table></td>";
				if(tmpi == 1) {
					tr += '<tr class="act-rows">';
					tr += tmpTr;
				} else if(tmpi ==4) {
					tr += tmpTr + '</tr>';
					tmpi = 0;
				} else {
					tr += tmpTr;
				}
				tmpi++;
			}
			tmpStr = '<div class="act-pop-up-instr">Please select the object that you want to base your report on. Related objects will be shown in the next step.</div>';
			tmpStr += '<table id="actions-pop-up-tbl">'+ tr +'</table>';
			adHocReportMnuUL.innerHTML += tmpStr;

			$(document).ready(function() {
			function show() {
				var menu = $(this);
				menu.children(".actions").slideDown();
			}
	
			function hide() { 
				var menu = $(this);
				menu.children(".actions").slideUp();
			}
			
			$(".hover-menu").hoverIntent({
				sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
				interval: 50,   // number = milliseconds for onMouseOver polling interval
				over: show,     // function = onMouseOver callback (required)
				timeout: 300,   // number = milliseconds delay before onMouseOut
				out: hide       // function = onMouseOut callback (required)
			});
		});	
	}
	createPageBottomMenus(data,topMenuTr);
}

function reloadCurrentPage()
{	
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	setUpPageParameters(pagUrl,entityDiv,'','','','true');
}

function callFilterPage(entt)
{
	document.getElementById(mnuItmId+'-URL').value='/atCRM/custom/JSON/list/filtersView.htm?forEntity='+entt;
	setUpPageParameters('/atCRM/custom/JSON/list/filtersView.htm?forEntity='+entt,entityDiv);
}

function createPageBottomMenus(data,topMenuTr)
{
	//Create page bottom menu items
	page_bottomMenu=data.page_bottomMenu;
	if(page_bottomMenu.length>0)
	{
		var bottomMenuTd=CreateTD(topMenuTr,'toolsMenu toolIcon');
		bottomMenuTd.innerHTML='Tools';
		var bottomMenuDiv=CreateDIV(bottomMenuTd);
		var bottomMenuUL = CreateUL(bottomMenuDiv,'toolsMenuUL');

		for(var btmMenu=0; btmMenu<page_bottomMenu.length; btmMenu++)
		{
			var bottomMenuLi=CreateLI(bottomMenuUL,'toolsMenuLi');	
			var mnuName=page_bottomMenu[btmMenu].menu[0];
			var mnuDesc=page_bottomMenu[btmMenu].menu[1];
			var mnuLink=page_bottomMenu[btmMenu].menu[2];
			var mnuOrder=page_bottomMenu[btmMenu].menu[3];
			if(mnuLink)
			{
				var btmMenuAnc=CreateA(bottomMenuLi, '', "tools_"+mnuName, mnuLink, null, mnuName,mnuDesc);
				bottomMnuCnt++;
			}
		}
	}
	if(data.helpText!="")
	{
		var helpMenuTd=CreateTD(topMenuTr);
		if(data.PageCaption != 'Layout')
		helpMenuTd.innerHTML='<span class="infoIcon">&nbsp;<div>'+data.helpText+'</div></span>';
	}
}

function createPageData(data,popupdiv,popUpWidth,popUpHeight)
{
	/*Added by Dony on 26-June-2012 for stage and type based //
	if(data.AddUrl)
	{
		var addUrl = data.AddUrl;	
		var addIsfunction=addUrl.indexOf('javascript');
		if(addIsfunction==0)
			var addAncTxt=addUrl;
		else
		{
			if((data.EntityName=="Contact"||data.EntityName=="Account"||data.EntityName=="Opportunity") && L_frm_lz==false)
			var addAncTxt="javascript:getAddDataFrmCache('"+data.AddUrl+"','"+data.EntityName+"')";
			else{var addAncTxt="javascript:setUpPageParameters('"+addUrl+"','"+entityDiv+"');";}
		}
    document.getElementsByClassName("listButtons addIcon")[0].setAttribute("onclick",addAncTxt);
    }
   // Ends here*/

	var listDataDiv=document.getElementById(mnuItmId+'-lstTd');
	if(!popupdiv)var divName='divList-'+mnuItmId+'-'+data.EntityName;
	else var divName='divListpopup-'+data.EntityName;

	var tblName='listTbl-'+data.EntityName;
	var ColumnHeaders=data.ColumnHeaders; 
	var ColumnHeaderLength=ColumnHeaders.length;
	var RowData=data.RowData; 
	var rowCnt=RowData.length;
	var currentDiv=document.getElementById(divName);
	if(currentDiv)
	{
		var parId=currentDiv.parentNode.id;
		if(mnuItmId+'-lstTd'!=parId)
		currentDiv="";
	}

	lastShownDiv=divName;
	var line_levelMenu=data.line_levelMenu;

	if(currentDiv)
	{
		currentDiv.style.display="block";
		var lsTbl=document.getElementById(tblName);	
		var trs = lsTbl.getElementsByTagName('tr');
		if(trs.length<RowData.length)
		{
			var tbBdy=lsTbl.getElementsByTagName('tbody');
			var rows2add=RowData.length-trs.length;
			
			addRowstoTable(rows2add,tbBdy[0],ColumnHeaderLength,tblName,popupdiv,popUpWidth,trs.length,data.page_bottomMenu.length);
			trs = lsTbl.getElementsByTagName('tr');
		}
		
		var columnWidthOfFirstRow=new Array();
		var firstRowNotExicuted=true;
		var rowNum=parseFloat((data.PageNumber)-1)*parseFloat(data.PagingAmount);
		for (var row=0; row<trs.length;row++) 
		{		
			rowNum++;
			var rowHdnFld=mnuItmId+'-row-hdn-'+row;
			var rowId=trs[row].id;	
			if(row<RowData.length)
			{
				var cels = trs[row].getElementsByTagName('div');
				var celsIdx=0;				
				var viewUrl='';

				var j=0;
				for(var colmnns=-1;colmnns<ColumnHeaderLength;colmnns++)
				{
					var column=cels[celsIdx];	
					if(column)
					column.innerHTML="";

					if(data.ViewUrl){
					var viewURL=data.ViewUrl;
					if(viewURL.indexOf("javascript:")==-1){
						var viewParam=(data.ViewUrl).indexOf('?');
						if(viewParam>0)var viewUrl=data.ViewUrl+"&id="+RowData[row].pkId;else var viewUrl=data.ViewUrl+"?id="+RowData[row].pkId;
					}
					else viewUrl=data.ViewUrl;
					}
					viewUrl=viewUrl.replace('userId',RowData[row].userId);

					var editURL= data.EditUrl ? data.EditUrl : data.AddUrl;	
					var editIsfunction="";
					if (editURL)
					{
						editIsfunction=editURL.indexOf('javascript');
					}
					if(editURL!=""&editIsfunction!=0){
					var editParam=editURL.indexOf('?');
				//	if(editParam>0) editURL=editURL+"&id="+RowData[row].pkId;else editURL=editURL+"?id="+RowData[row].pkId;}
					if(editParam>0) 
					{
						var urlPath = editURL.split('?')[0];
						var urlParam = editURL.split('?')[1];
						editURL=urlPath+"?id="+RowData[row].pkId+"&"+urlParam;
					}
					else editURL=editURL+"?id="+RowData[row].pkId;}
					editURL=editURL.replace('userId',RowData[row].userId);

					if(colmnns!=-1)
					{
						if(firstRowNotExicuted){if(column)columnWidthOfFirstRow[celsIdx]=column.style.width;}
						if(column)
						column.style.width=columnWidthOfFirstRow[celsIdx];
						var dataType=RowData[row].data[colmnns].colType;					
						var listDataTxt=RowData[row].data[colmnns].colTxt;
						
						if(listDataTxt)
						{
						switch(dataType)
						{	
							case "decimal": 
							case "double": 
							case "float": 
							case "money":
							case "Decimal":
											txtAlign='right';
											//listDataTxt=parseFloat(listDataTxt).toFixed(2);	//commented as the number was rounding. By Hamsa.
											listDataTxt=FormatNumber(listDataTxt,1,2);
											break;
							case "Integer":
							case "integer": 
											txtAlign='right';				
											listDataTxt=parseFloat(listDataTxt).toFixed(0);		                
											listDataTxt=FormatNumber(listDataTxt,1,0);
											break;

							case "strInteger": 
											txtAlign='center';				
											listDataTxt=parseFloat(listDataTxt).toFixed(0);		                
											listDataTxt=FormatNumber(listDataTxt,1,0);
											listDataTxt=listDataTxt.replace(/,/g,'');
											break;

							case "dateOnly":
							case "Date":
											txtAlign='center';
											listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy')
											listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy");
											break;

							case "timeOnly": 
							case "dateAndTime":						
							case "DateTime":
											txtAlign='center';
											listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy')
											listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy, hh:MM TT");
											break;

							case "Multi":
											listDataTxt=ReplaceAll(listDataTxt,"~)",", ");
                                            break;
							case "multiLevelDropdown":
								            var multiLevelData= listDataTxt.split(">>");
							                var dataLen=parseInt(multiLevelData.length); 
							                listDataTxt=multiLevelData[dataLen-1];
					    
							case "Check":
							case "checkBox":
                                        if(listDataTxt == "1" ||listDataTxt.toLowerCase() == "yes"|| listDataTxt.toLowerCase()== "on") listDataTxt="Yes";
						                else listDataTxt="No";
								           
							default:		
											txtAlign='left';break;
						}	

						column.innerHTML+=listDataTxt;
						column.style.textAlign=txtAlign;
						var moreLink=listDataTxt.indexOf('showFullContent');
						}
						if(moreLink<0 && data.ViewUrl)
						{
							if(column)
							column.style.cursor="pointer";	
						}
					}
					else
					{
						
						/*if(bottomMnuCnt>0)
						{
							allIds=document.getElementById(mnuItmId+'-clipBoard').value;
							var idExists=allIds.match(RowData[row].pkId);
							if(idExists)
							{
								column.innerHTML="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+RowData[row].pkId+"' name='"+mnuItmId+"-"+RowData[row].pkId+"' onclick=writeInClipBook(this); checked><label for="+mnuItmId+"-"+RowData[row].pkId+"></label>";
							}
							else
								column.innerHTML="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+RowData[row].pkId+"' name='"+mnuItmId+"-"+RowData[row].pkId+"' onclick=writeInClipBook(this);><label for="+mnuItmId+"-"+RowData[row].pkId+"></label>";

						}
						else*/
						{
							//column.innerHTML=rowNum;
							column.innerHTML="<img src='/atCRM/images/JSON/moreIcon.png'>";	
							column.style.textAlign='right';
						}
						if(!popupdiv)
						{
							var lineLevelMnu=CreateSPAN(column,'lineMnuSpan');
							lineLevelMnu.style.display='none';
							//var lineLevelMnuJoin=CreateSPAN(column,'lineLevelMnuJoin');
							var lineMenuUL = CreateUL(lineLevelMnu,'lineMnuUL');
							var showView=true;
							var showEdit=data.ShowEdit =="NO"? false : true;

							for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)
							{
								var lineMnuName=line_levelMenu[lineMenu].menu[0];
								if(lineMnuName=="View"||lineMnuName=="View/Edit")
								showView=false;
								if((lineMnuName=="Edit"||lineMnuName=="View/Edit")||(!editURL))
								showEdit=false;
							}
							if(showView==true && viewUrl)
							{	
								var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
								viewUrl = viewUrl.replace(/\?/g,"~");
								viewUrl = viewUrl.replace(/&/g,"@");
								viewUrl = viewUrl.replace(/=/g,"*");
								if(viewURL.indexOf("javascript:") == -1){
									//var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+viewUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "View","View "+data.EntityName);
									var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+viewUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "View","View "+data.EntityName);
								}
								else{
									var rowId=RowData[row].pkId;
									viewUrl=viewUrl.replace("PkVal",rowId);
									var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "",viewUrl, null, "View","View "+data.EntityName);
								}
								lineMnuAnc.setAttribute('style','display: block;');
								lineLevelMnu.style.display='';

							}						
							if(showEdit==true && editURL)
							{	
								var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
								if(editIsfunction==0)
								{
									var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", editURL.replace('PkVal',RowData[row].pkId), null, "Edit","Edit "+data.EntityName);	
								}
								else
								{
									editURL = editURL.replace(/\?/g,"~");
									editURL = editURL.replace(/&/g,"@");
									editURL = editURL.replace(/=/g,"*");
									var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+editURL+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "Edit","Edit "+data.EntityName);	
								}
								lineMnuAnc.setAttribute('style','display: block;');
								lineLevelMnu.style.display='';
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
								lineMnuLink=lineMnuLink.replace('enttName','"' + data.EntityName + '"');


								if(lineMnuName=="Call!")
								lineMnuLink=lineMnuLink.replace("savedQuery",RowData[row].savedQuery);
								
								if(lineMnuLink)
								{
									var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
									var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", "javascript:executeContextualMenu();"+lineMnuLink, null, lineMnuName,lineMnuDesc);
									lineMnuAnc.setAttribute('style','display: block;');
									lineLevelMnu.style.display='';
								}
							}
							document.getElementById(mnuItmId+'-row-hdn-'+row).value=viewUrl;						
							column.className='firstListColumn';
						}
					}
					celsIdx++;	
				}
				if(firstRowNotExicuted){
					firstRowNotExicuted=false;
				}
				if(!popupdiv)
				{
					contextualMenuLength[mnuItmId]=line_levelMenu.length+2;
					var tableRowTr=trs[row];
					AddOnMouseOverEventListener(tableRowTr,
						(function(tableRowTr){ 
							lineLevelMnu=tableRowTr.getElementsByTagName('span')[0];
							//lineLevelMnu.style.marginTop='-9px';
							var topPostionOfSpan=findPosForContextualMenu(lineLevelMnu);
							if(window.pageYOffset)
							{
								if(!popupdiv)var listPageHeight=window.pageYOffset+screen.availHeight;
								else var listPageHeight=popUpHeight;
							}
							else
							{   
								if(!popupdiv)var listPageHeight=screen.availHeight;
								else var listPageHeight=popUpHeight;
							}
							if(listPageHeight<topPostionOfSpan){
								lineLevelMnu.style.marginTop=((contextualMenuLength[mnuItmId]*17.90)-(contextualMenuLength[mnuItmId]*35))+'px';
							}
						})
					);
					var tds = trs[row].getElementsByTagName('td');
					var noOfTds=tds.length-1;
					tds[noOfTds].className='lastListColumn'; //for applying the right border to last column of hover row

					trs[row].style.display='block';									
					trs[row].style.display='';
				}
			}
			else
			{				
				trs[row].style.display='none';
			}
		}
	}
	else
	{
		var listDiv=CreateDIV(listDataDiv,'',divName,'','100%');
		var listDataTbl = CreateTable(listDiv,'flextab',tblName,'','0','0');
		listDataTbl.style.width="100%"
		if(popUpWidth)listDataTbl.style.width=popUpWidth;

		//document.getElementById('detailDataTd').style.width=window.document.body.clientWidth-215+"px";
		var detailDataTdWidth=window.document.body.clientWidth-215-(10*ColumnHeaderLength);

		//Create table headers
		var listDataTbhd = CreateThead(listDataTbl); 
		var listDataHdTr=CreateTR(listDataTbhd);
		if(document.getElementById(mnuItmId+'-URL')){
			var pagUrl=document.getElementById(mnuItmId+'-URL').value;
			var list__column__width=getParameterValue(pagUrl,'list__column__width');
		}
		var colWidth=new Array();
		if(list__column__width)colWidth=list__column__width.split(",");
		else
		{		
			if(!popupdiv)var colWidthValue=parseInt((detailDataTdWidth-25)/ColumnHeaderLength);
			else var colWidthValue=parseInt((popUpWidth-60)/ColumnHeaderLength);

			for(colWdtCnt=0;colWdtCnt<ColumnHeaderLength;colWdtCnt++)
			{
				colWidth[colWdtCnt]=colWidthValue;
			}
			if(popupdiv=='listPopUp'){
				var pagUrl=document.getElementById('listPopUp-URL').value;
				var list__column__width=getParameterValue(pagUrl,'list__column__width');
				if(list__column__width)colWidth=list__column__width.split(",");
			}
		}

		var maxWidthApp=0;
		var totWidthApp=0;
		for(var cw=0;cw<ColumnHeaderLength+1;cw++)totWidthApp+=parseInt(colWidth[cw])+15;
		maxWidthApp=(pageWidth1)-totWidthApp;
		if(maxWidthApp)maxWidthApp=Math.round(maxWidthApp/(ColumnHeaderLength));else maxWidthApp=0;
		
		if(colWidth.length<ColumnHeaderLength)
		{
			sameWidth=(pageWidth1-100)/ColumnHeaderLength;
			for (var clWd=0; clWd<colWidth.length; clWd++)colWidth[clWd]=sameWidth;		
		}

		for(var cols=-1;cols<ColumnHeaderLength;cols++)
		{
			if(cols==-1)
			{
				var listDataTh=CreateTH(listDataHdTr,'TblHead',mnuItmId+"-FC",'','center',"");
				/*if(bottomMnuCnt>0)
				{
					listDataTh.innerHTML="<span class='lstChkAll'><img src='/atCRM/images/JSON/chkAll.gif' id='"+mnuItmId+"-chkAll' name='"+mnuItmId+"-chkAll'><ul><li><a href='javascript:chkAllLst("+RowData.length+",this)'>All</a></li><li><a href='javascript:unChkAllLst("+RowData.length+",this)'>None</a></li></ul></span>";

					//listDataTh.innerHTML="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-chkAll' name='"+mnuItmId+"-chkAll' onclick=chkUnchkAll(this);><label for='"+mnuItmId+"-chkAll'></label>";

					listDataTh.width=20;
					listDataTh.style.textAlign="left";
					listDataTh.style.verticalAlign="middle";
				}
				else*/
				{
					listDataTh.innerHTML="&nbsp;";
					listDataTh.width=25;
				}
			}
			else
			{
				var colNodeId=mnuItmId+"-"+ColumnHeaders[cols].nodeId;
				var colHeadTxt=ColumnHeaders[cols].colmnDesc;

				var listDataTh=CreateTH(listDataHdTr,'TblHead',colNodeId,'','center',"Sort ascending, by " + colHeadTxt);
				var sortImg='&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/rt_arrow.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span>';
				listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+data.OrderBy+'",'+ColumnHeaders[cols].nodeId+',"'+colHeadTxt+'","'+colNodeId+'")\'>'+colHeadTxt+sortImg+'</span>';
				
				if(parseInt(colWidth[cols])){
					if(colWidth.length>ColumnHeaderLength&&parseInt(colWidth[cols+1]))listDataTh.width=parseInt(colWidth[cols+1])+maxWidthApp;else listDataTh.width=parseInt(colWidth[cols])+maxWidthApp;
				}else{
					listDataTh.width=30;
				}
				//Highlight sorted column on page load if URL contains order by
				if(pagUrl){
					var orderByIndex=pagUrl.indexOf('order__by__1');
					if(orderByIndex != "-1"){
						var order__by__1=getParameterValue(pagUrl,'order__by__1');
						if(order__by__1==ColumnHeaders[cols].nodeId){
							previousSortNode[mnuItmId]=ColumnHeaders[cols].nodeId;
							previousSortName=colHeadTxt;
							nowSort=ColumnHeaders[cols].nodeId;
							listDataTh.title ="Sort descending, by " + colHeadTxt;
							listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+nowSort+'",'+ColumnHeaders[cols].nodeId+',"'+colHeadTxt+'","'+colNodeId+'")\'>'+colHeadTxt+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-down.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
						}else if(order__by__1==('-'+ColumnHeaders[cols].nodeId)){
							previousSortNode[mnuItmId]=ColumnHeaders[cols].nodeId;
							previousSortName=colHeadTxt;
							nowSort='-'+ColumnHeaders[cols].nodeId;
							listDataTh.title ="Sort ascending, by " + colHeadTxt
							listDataTh.innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+nowSort+'",'+ColumnHeaders[cols].nodeId+',"'+colHeadTxt+'","'+colNodeId+'")\'>'+colHeadTxt+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-up.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
						}
					}
				}
			}
		}
		
		var eachColWidth=parseInt(colWidth[0])+maxWidthApp;
		for(var cols=1;cols<ColumnHeaderLength+1;cols++){
			eachColWidth+=","+parseInt(parseInt(colWidth[cols])+maxWidthApp);
		}
		CreateHIDDEN(document.getElementById(entityDiv),'',mnuItmId+'-eachColWidth',eachColWidth);

		//Create table content
		var listDataTbdy = CreateBody(listDataTbl);
		for(var rows=0;rows<RowData.length;rows++)
		{	
			var rowHdnFld=mnuItmId+'-row-hdn-'+rows;
			var rowId=mnuItmId+'-row-'+rows;
			CreateHIDDEN(document.getElementById(entityDiv),'',mnuItmId+'-row-hdn-'+rows);
			var listDataTr=CreateTR(listDataTbdy,'rowClass',rowId);
			var j=0;
			for(var cols=-1;cols<ColumnHeaderLength;cols++)
			{
				if(cols==-1){
					var listDataTd=CreateTD(listDataTr);	
				}
				else
				{
					if(RowData[rows].data[cols])
					{
					var listDataTxt=RowData[rows].data[cols].colTxt;
					var dataType=RowData[rows].data[cols].colType;
					}
					var txtAlign='';
					if(listDataTxt)
					switch(dataType)
					{
						case "decimal": 
						case "double": 
						case "float": 
						case "money":
						case "Decimal":
										txtAlign='right';	
										listDataTxt=ReplaceAll(listDataTxt,",","");
										listDataTxt=parseFloat(listDataTxt).toFixed(2);
										listDataTxt=FormatNumber(listDataTxt,1,2);
										break;
						
						case "Integer":
						case "integer": 
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

						case "dateOnly":
						case "Date":
										txtAlign='center';
//08/06/2011 6:10 PM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.	
//										
										fieldvaldateArr = listDataTxt.split('/');
										fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2];
										var d1 = new Date (fieldvaldatetIme);
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd/mm/yyyy");
//08/06/2011 6:10 PM By Vadiraj
										listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
										listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy");
										break;

						case "timeOnly": 
						case "dateAndTime":
						case "DateTime":
										txtAlign='center';
//08/06/2011 6:10 PM By Vadiraj
//Below mentioned code will add/subtract the minutes depending on the user's timezone from the date value stored in the database.

										var fieldvalArr = listDataTxt.split(' ');
										var fieldvaldate  = fieldvalArr[0];
										var fieldvaldateArr = fieldvaldate.split('/');
										var fieldvaldatetIme = fieldvaldateArr[1]+'/'+fieldvaldateArr[0]+'/'+fieldvaldateArr[2]+' '+fieldvalArr[1];
										var d1 = new Date (fieldvaldatetIme);
										d1.setMinutes ( d1.getMinutes() - srvrtimeDiffInMin + timeDiffInMin);
										listDataTxt=dateFormat(d1, "dd/mm/yyyy HH:MM:ss");
//08/06/2011 6:10 PM By Vadiraj
										listDataTxt=parseString_Date(listDataTxt,'dd/MM/yyyy');
										listDataTxt=dateFormat(listDataTxt, "dd-mmm-yyyy, hh:MM TT");
										break;

						case "Multi":
										listDataTxt=ReplaceAll(listDataTxt,"~)",", ");
						case "Check":
						case "checkBox":
                                        if(listDataTxt == "1" ||listDataTxt.toLowerCase() == "yes"|| listDataTxt.toLowerCase()== "on") listDataTxt="Yes";
						                else listDataTxt="No";
						default:
										txtAlign='left';break;
					}
					var listDataTd=CreateTD(listDataTr,'','','',txtAlign);		
				}
				if(cols!=-1)
				{
					listDataTd.innerHTML+=listDataTxt+"&nbsp;";
					var moreLink=listDataTxt.indexOf('showFullContent');
					if(moreLink<0 && data.ViewUrl)
					{
						listDataTd.style.cursor="pointer";
						AddClickEventListener(listDataTd, 
							(function(rowHdnFld) { 
								return function() { 
									click2View(rowHdnFld);
								}; 
							})(rowHdnFld) 
						);	
					}
				}
				else
				{	
					/*if(bottomMnuCnt>0)
					{
						allIds=document.getElementById(mnuItmId+'-clipBoard').value;
						var idExists=allIds.match(RowData[rows].pkId);
						if(idExists)
							listDataTd.innerHTML="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+RowData[rows].pkId+"' name='"+mnuItmId+"-"+RowData[rows].pkId+"' onclick=writeInClipBook(this); checked> <label for="+mnuItmId+"-"+RowData[rows].pkId+"></label>";
						else
							listDataTd.innerHTML="<input type='checkbox' class='styledChkBx' id='"+mnuItmId+"-"+RowData[rows].pkId+"' name='"+mnuItmId+"-"+RowData[rows].pkId+"' onclick=writeInClipBook(this);><label for="+mnuItmId+"-"+RowData[rows].pkId+"></label>";

						listDataTd.style.width="20px";
						listDataTd.style.textAlign="left";
					}
					else*/
					{
						listDataTd.style.width="25px";						
						listDataTd.align='right';
						//listDataTd.innerHTML=rows+1;					
						listDataTd.innerHTML="<img src='/atCRM/images/JSON/moreIcon.png'>";	
					}				
					if(!popupdiv)
					{
						var viewUrl='';
						var lineLevelMnu=CreateSPAN(listDataTd,'lineMnuSpan');
						lineLevelMnu.style.display='none';
						//var lineLevelMnuJoin=CreateSPAN(listDataTd,'lineLevelMnuJoin');
						var lineMenuUL = CreateUL(lineLevelMnu,'lineMnuUL');
						
						if(data.ViewUrl){
							var viewURL=data.ViewUrl;
						if(viewURL.indexOf("javascript:")==-1){
							var viewParam=(data.ViewUrl).indexOf('?');
							if(viewParam>0)var viewUrl=data.ViewUrl+"&id="+RowData[rows].pkId;else var viewUrl=data.ViewUrl+"?id="+RowData[rows].pkId;
						}
						else viewUrl=data.ViewUrl;
						}
						viewUrl=viewUrl.replace('userId',RowData[rows].userId);

						var editURL= data.EditUrl ? data.EditUrl : data.AddUrl;	
						var editIsfunction="";
						if (editURL)
						{
							editIsfunction=editURL.indexOf('javascript');
						}
						if(editURL!=""&editIsfunction!=0){
						var editParam=(editURL).indexOf('?');
						//if(editParam>0) editURL=editURL+"&id="+RowData[rows].pkId;else editURL=editURL+"?id="+RowData[rows].pkId;}
						if(editParam>0) 
						{
							var urlPath = editURL.split('?')[0];
							var urlParam = editURL.split('?')[1];
							editURL=urlPath+"?id="+RowData[rows].pkId+"&"+urlParam;
						}
						else editURL=editURL+"?id="+RowData[rows].pkId;}
						editURL=editURL.replace('userId',RowData[rows].userId);

						var showView=true;
						var showEdit=data.ShowEdit =="NO"? false : true;

						for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)
						{
							var lineMnuName=line_levelMenu[lineMenu].menu[0];
							if(lineMnuName=="View"||lineMnuName=="View/Edit")
							showView=false;
							if((lineMnuName=="Edit"||lineMnuName=="View/Edit")||(!editURL))
							showEdit=false;
						}
						if(!editURL)showEdit=false;
						if(showView==true && viewUrl)
						{
							var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
							viewUrl = viewUrl.replace(/\?/g,"~");
							viewUrl = viewUrl.replace(/&/g,"@");
							viewUrl = viewUrl.replace(/=/g,"*");
							if(viewURL.indexOf("javascript:") == -1){
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+viewUrl+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "View","View "+data.EntityName);
							}
							else{
								var rowId=RowData[rows].pkId;
                                viewUrl=viewUrl.replace("PkVal",rowId);
                                var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "",viewUrl, null, "View","View "+data.EntityName);
							}
							lineMnuAnc.setAttribute('style','display: block;');
							lineLevelMnu.style.display='';
						}					
						if(showEdit==true && editURL)
						{	
							var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
							if(editIsfunction==0){
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", editURL.replace('PkVal',RowData[rows].pkId), null, "Edit","Edit "+data.EntityName);	
							}
							else
							{
							editURL = editURL.replace(/\?/g,"~");
							editURL = editURL.replace(/&/g,"@");
							editURL = editURL.replace(/=/g,"*");
							var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc", "", '#setUpPageParameters?viewUrl='+editURL+'&entityDiv='+entityDiv+'&shownSubMenu='+shownSubMenu+'&sid='+(Math.random()*9), null, "Edit","Edit "+data.EntityName);	
							}
							lineMnuAnc.setAttribute('style','display: block;');
							lineLevelMnu.style.display='';
						}
						
						//Create Contextual menu items
						for(var lineMenu=0; lineMenu<line_levelMenu.length; lineMenu++)
						{
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
							lineMnuLink=lineMnuLink.replace('enttName','"' + data.EntityName + '"');


							if(lineMnuName=="Call!")
							lineMnuLink=lineMnuLink.replace("savedQuery",RowData[rows].savedQuery);

							if(lineMnuLink)
							{
								var lineMenuLi=CreateLI(lineMenuUL,'lineMnuLi');	
								var lineMnuAnc=CreateA(lineMenuLi, "lineMnuLiAnc","","javascript:executeContextualMenu();"+lineMnuLink, null, lineMnuName,lineMnuDesc);
								lineMnuAnc.setAttribute('style','display: block;');
								lineLevelMnu.style.display='';
							}
						}	
						document.getElementById(mnuItmId+'-row-hdn-'+rows).value=viewUrl;
						listDataTd.className='firstListColumn';
					}
				}
			}
			if(!popupdiv)
			{
				listDataTd.className='lastListColumn'; //for applying the right border to last column of hover row
				contextualMenuLength[mnuItmId]=line_levelMenu.length+2;
				AddOnMouseOverEventListener(listDataTr,
					(function(listDataTr){ 
						lineLevelMnu=listDataTr.getElementsByTagName('span')[0];
						lineLevelMnu.style.marginLeft=lineLvlMnuPos;
						//lineLevelMnu.style.marginTop=lineLvlMnuPosTop;
						var topPostionOfSpan=findPosForContextualMenu(lineLevelMnu);
						if(window.pageYOffset)
						{
							if(!popupdiv)var listPageHeight=window.pageYOffset+screen.availHeight;
							else var listPageHeight=popUpHeight;
						}
						else
						{   
							if(!popupdiv)var listPageHeight=screen.availHeight;
							else var listPageHeight=popUpHeight;
						}
						if(listPageHeight<topPostionOfSpan)				lineLevelMnu.style.marginTop=((contextualMenuLength[mnuItmId]*17.90)-(contextualMenuLength[mnuItmId]*35))+'px';
					})
				);
			}
		}
	}
	gridAddress= $('.flextab').flexigrid({height:'auto',striped:false});

	if(previousSortNode[mnuItmId]!=''){
		var prevTh=document.getElementById(mnuItmId+"-"+previousSortNode[mnuItmId]);
		if(prevTh)
		{
			var prevThDiv=prevTh.getElementsByTagName('div');
			prevThDiv[0].style.backgroundColor = "#DEE1E5";
		}
	}
}

function click2View(hdnFld)
{	
	var uri=document.getElementById(hdnFld).value;
	if(uri.indexOf("javascript:")==-1)
	window.location.href=zcServletPrefix+"/custom/JSON/homePage.html#setUpPageParameters?viewUrl="+uri+"&entityDiv="+entityDiv+"&shownSubMenu="+shownSubMenu+"&sid="+Math.random();
	else
	window.location.href = uri;
	
}

function findPosForContextualMenu(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return(curtop+(contextualMenuLength[mnuItmId]*35));
	}
}

function addRowstoTable(rows2add,tbdy,colmnCnt,tblName,popupdiv,popUpWidth,rowsCnt,bottomMenu)
{
	if(!popupdiv) var colWidth=parseInt((pageWidth-15)/colmnCnt);
	else var colWidth=parseInt((popUpWidth-15)/colmnCnt);

	for(var i=0; i<rows2add; i++)
	{
		var rowHdnFld=mnuItmId+'-row-hdn-'+rowsCnt;
		var rowId=mnuItmId+'-row-'+rowsCnt;
		CreateHIDDEN(document.getElementById(entityDiv), '', mnuItmId+'-row-hdn-'+rowsCnt);
		rowsCnt++;
		var listDataTr=CreateTR(tbdy,'rowClass',rowId);
		
		if(bottomMenu>0){var listDataTd=CreateTD(listDataTr);var listDataDiv=CreateDIV(listDataTd);}
		for(var j=-1; j<colmnCnt; j++)
		{
			var listDataTd=CreateTD(listDataTr);
			var listDataDiv=CreateDIV(listDataTd);
			if(j>=0 && parseInt(colWidth[j]))listDataDiv.style.width=colWidth[j]+'px';
			else listDataTd.style.width='25px';		
			
			AddClickEventListener(listDataTd,(function(rowHdnFld){return function(){click2View(rowHdnFld);};})(rowHdnFld) 
			);	
		}
	}
}

function createLstPagination(pagningAmt,currntPage,totalPages,noItems,itemsInPage,prefsId,dataRow)
{
	if(document.getElementById(mnuItmId+'-pagAmt').value!=pagningAmt)
	pagningAmt=document.getElementById(mnuItmId+'-pagAmt').value;

	var LstPgnDiv=document.getElementById(mnuItmId+'LstPgnDiv');
	if(parseInt(currntPage)<parseInt(totalPages))var nxtPage=parseInt(currntPage)+1;else var nxtPage=currntPage;
	if(parseInt(currntPage)>1)var prePage=parseInt(currntPage)-1;else prePage=currntPage;
	var recStNo=eval((currntPage - 1) * pagningAmt)+parseInt(1);
	var recEnNo=(parseInt(recStNo)+parseInt(itemsInPage))-1;
	var LstPgnDivContent='';
	var paginationContent='';
	var msg='';
	if(totalPages>1)
		paginationContent="<td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td><td><img  title='First Page'src='/atCRM/images/JSON/first.gif' onclick='paginateList(1,"+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:pointer'><img  title='Previous Page' src='/atCRM/images/JSON/Pprev.gif' style='cursor:pointer' onclick='paginateList("+prePage+","+totalPages+","+currntPage+","+itemsInPage+");'></td><td class='flexigrid' style='vertical-align:middle'>Page</td><td style='padding-left:2px;padding-right:2px'><input type='text' class='paginationBox' id='"+mnuItmId+"-pagBx' value='"+currntPage+"' title='Current page' onkeypress='return validCharsDOM(event,\"1234567890\")' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)paginateList(this.value,"+totalPages+","+currntPage+","+itemsInPage+")'/><td class='flexigrid' style='vertical-align:middle'>of "+totalPages+"</td><td><img title='Next Page' src='/atCRM/images/JSON/Nnext.gif' onclick='paginateList("+nxtPage+","+totalPages+","+currntPage+","+itemsInPage+");' style='cursor:pointer'><img title='Last Page' src='/atCRM/images/JSON/last.gif' onclick=paginateList("+totalPages+","+totalPages+","+currntPage+","+itemsInPage+") style='cursor:pointer'>";

	var pagUrlTmp=document.getElementById('baseUrl_'+subMnuItmId).value;
	var mainPagUrlTmp=document.getElementById(mnuItmId+'-URL').value;
	var baseURLTmp=pagUrlTmp.split("?")[0];
	if(mainPagUrlTmp.indexOf(baseURLTmp)>0)
		LstPgnDivContent= "<table cellpadding='0' cellspacing='0' style='height:25px' align='right'><tr valign='bottom'><td style='padding-right:2px'><input type='text' class='paginationBox' title='Items per page' maxlength='2' id='"+mnuItmId+"-pageSize' value='"+pagningAmt+"' onkeypress='return numbersonly(this,event,true);' onkeyup='var charCode = event.keyCode ? event.keyCode :event.which ? event.which : event.charCode; if (charCode==13)changePagingAmount("+recEnNo+")'/></td><td  class='flexigrid' onclick='changePagingAmount("+recEnNo+")' style='cursor:pointer;vertical-align:middle;padding-right:3px'>Go</td>"+paginationContent+"<td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td></td><td class='flexigrid' style='vertical-align:middle;padding-left:5px;padding-right:10px;'>Displaying "+recStNo+" to "+recEnNo+" of "+noItems+" items</td></tr></table>";
	else
		LstPgnDivContent= "<table cellpadding='0' cellspacing='0' style='height:25px' align='right'><tr valign='bottom'><td style='padding-right:2px'></td><td  class='flexigrid' style='cursor:pointer;vertical-align:middle;padding-right:3px'></td>"+paginationContent+"<td style='border-left:1px solid #CCCCCC;border-right:1px solid #FFFFFF;'></td></td><td class='flexigrid' style='vertical-align:middle;padding-left:5px;padding-right:10px;'>Displaying "+recStNo+" to "+recEnNo+" of "+noItems+" items</td></tr></table>";

	if(dataRow.length==0)
	{
		msg="<font color='red'>No matching data</font>";		
		LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='50%' align='center'><div id='"+mnuItmId+"-pageMsg' class='flexigrid'><b>"+msg+"</b></div></td></tr></table>";
	}
	else
	{
		LstPgnDiv.innerHTML="<table cellpadding='0' cellspacing='0' style='height:25px;width:100%'><tr><td width='10%'><div id='"+mnuItmId+"-pageMsg' class='flexigrid'><b>"+msg+"</b></div></td><td align='right' width='90%'>"+LstPgnDivContent+"</td></tr></table>";
	}
}


function paginateList(pgNo,max,current,noItms)
{
	if(pgNo==current)
		return;
	if(pgNo<=max&&pgNo>0)
	{	
		var pagUrl=document.getElementById(mnuItmId+'-URL').value
		var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
		var pagUrlPath=pagUrl.substring(0,quesIndex); 
		var pagUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length); 
		var pagUrlParms=changeParameterValue (pagUrlParms,'page__number__1',pgNo);
		var listOrderBy=document.getElementById(mnuItmId+'-listOrderBy').value;
		if(listOrderBy){
			var pagUrlParms=changeParameterValue (pagUrlParms,'order__by__1',listOrderBy);
		}
		
		try{
			/*var filterBoxObj=document.getElementById(mnuItmId+"-filter");
			var filterBoxValue = filterBoxObj.options [filterBoxObj.selectedIndex].value;*/
			var filterBoxValue=document.getElementById(mnuItmId+"-filter").value;
			if (filterBoxValue){
				var pagUrlParms=changeParameterValue (pagUrlParms,'filterName',filterBoxValue);
			}
		}catch(e){}

		pagUrl=pagUrlPath+"?"+pagUrlParms;
		document.getElementById(mnuItmId+'-URL').value=pagUrl;
		currListURL4View=pagUrl;
		viewNavIds="";
		setUpPageParameters(pagUrl,entityDiv,null,null,null,listPopup);
	}
	else
	{
		document.getElementById('commonErrPopupDiv').className="commonErrPopupDiv";
		var leftPos=((window.document.body.clientWidth)-450)/2;
		var topPos=findPosOfObj(document.getElementById(mnuItmId+'-pagBx'));
		var ttP=(topPos[1]-((noItms*30)/2));
		document.getElementById('commonErrPopupDiv').style.left=leftPos+"px";
		document.getElementById('commonErrPopupDiv').style.top=ttP+"px";
		document.getElementById('commonErrPopupDiv').style.display="block";
		document.getElementById('commonErrPopupDiv').innerHTML="Enter valid page number";
		document.getElementById(mnuItmId+'-pagBx').value=current;
		setTimeout(function(){document.getElementById('commonErrPopupDiv').className="commonErrPopupDivLight";},500)
		setTimeout(function(){document.getElementById('commonErrPopupDiv').style.display="none";},1000)
	}
}


function changePagingAmount(page)
{
	var pageSizeBox = document.getElementById (mnuItmId+"-pageSize");
	if (pageSizeBox && pageSizeBox.value && pageSizeBox.value > 0)
	{
		pagingAmount=pageSizeBox.value;

		var pagUrl=document.getElementById(mnuItmId+'-URL').value;			
		var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
		var mainUrlPath=pagUrl.substring(0,quesIndex); 
		var mainUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length); 
		var mainUrlParms=changeParameterValue (mainUrlParms,'page__size__1',pagingAmount);
		var filtered=pagUrl.indexOf('filterName=');
		var searched=pagUrl.indexOf('condition__1=');
		if((filtered>0)||(searched>0))
			mainUrlParms=deleteParameter (mainUrlParms,'page__number__1');

		pagUrl=mainUrlPath+"?"+mainUrlParms;
		document.getElementById(mnuItmId+'-URL').value=pagUrl;  
		setUpPageParameters(pagUrl,entityDiv,null,null,null,listPopup);	
		document.getElementById(mnuItmId+'-pagAmt').value=pagingAmount;
		updateUriParams();
    }
	else
	{
		document.getElementById('commonErrPopupDiv').className="commonErrPopupDiv";
		var leftPos=((window.document.body.clientWidth)-450)/2;
		var topPos=findPosOfObj(document.getElementById(mnuItmId+'-pagBx'));
		document.getElementById('commonErrPopupDiv').style.left=leftPos+"px";
		document.getElementById('commonErrPopupDiv').style.top=topPos+"px";
		document.getElementById('commonErrPopupDiv').style.display="block";
		document.getElementById('commonErrPopupDiv').innerHTML="Enter valid number.";
		document.getElementById(mnuItmId+'-pagAmt').value=page;
		setTimeout(function(){document.getElementById('commonErrPopupDiv').className="commonErrPopupDivLight";},500)
		setTimeout(function(){document.getElementById('commonErrPopupDiv').style.display="none";},1000)
	}
}


function populateFilterCombo(entityValue,selectObj,caption)
{
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	var filterValue=getParameterValue(pagUrl,'filterName');
	var filUl=CreateUL(selectObj);
	
	caption=caption.slice(0,30);
	if(filterValue)filUl.innerHTML="<li class='filterOpt' onclick='javascript:filterChanged()'>No Filter</li>"; else filUl.innerHTML="<li class='filterOpt selected' onclick='javascript:filterChanged()'>No Filter</li>";
	document.getElementById(mnuItmId+'-Title').innerHTML=caption;

	//get Available filters for the page.
	var JSONURL="/atCRM/custom/JSON/filterList.html?entityName="+entityValue;
	$.getJSON(JSONURL,'',function(json){
			var filterList = json;
			if(filterList.filterName.length==0)selectObj.style.display="none";
			for (i=0; i<filterList.filterName.length; i++)
			{
				if(filterList.filterEntityName == entityValue)
				{
					var optDtls=filterList.filterName[i];
					optDtls=optDtls.split("~)");
					optTxt=optDtls[1].slice(0,30);
					if(filterValue==optDtls[0]){document.getElementById(mnuItmId+'-Title').innerHTML=optTxt;document.getElementById(mnuItmId+"-filter").value=optDtls[0];filUl.innerHTML+="<li class='filterOpt selected'  onclick='javascript:filterChanged("+optDtls[0]+")'>"+optTxt+"</li>";}
					else filUl.innerHTML+="<li class='filterOpt'  onclick='javascript:filterChanged("+optDtls[0]+")'>"+optTxt+"</li>";
				}
			}
	});
}

function checkFilterCount(entityValue,selectObj)
{
	var dropCount=(selectObj.length)-1;
	var JSONURL="/atCRM/custom/JSON/filterList.html?entityName="+entityValue;
	$.getJSON(JSONURL,'',function(json)
	{
		var filterCount=json.filterCnt;
		if(filterCount!=dropCount)populateFilterCombo(entityValue,selectObj)
	});
}

function filterChanged(filterName)
{
	//var filterName = filterDropdown.options [filterDropdown.selectedIndex].value;
	if(filterName)document.getElementById(mnuItmId+"-filter").value=filterName;else document.getElementById(mnuItmId+"-filter").value="";
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
	var mainUrlPath=pagUrl.substring(0,quesIndex); 
	var mainUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length);
	if(filterName)
		var mainUrlParms=changeParameterValue (mainUrlParms,'filterName',filterName);
	else
		var mainUrlParms=changeParameterValue (mainUrlParms,'filterName','');	
	mainUrlParms=deleteParameter (mainUrlParms,'page__number__1');
	pagUrl=mainUrlPath+"?"+mainUrlParms;
	document.getElementById(mnuItmId+'-URL').value=pagUrl;
	setUpPageParameters(pagUrl,entityDiv);		
	updateUriParams();	
}

/*** updateUriParams function is used for saving the following list attributes in the database in uri_params column
	1. Order by
	2. Paging size
	3. Column width 
	4. Filter
***/
function updateUriParams()
{
	var pageUriParams='?0-1-2='+subMnuItmId+"&0-1-51=";
	var pagUrl=document.getElementById('baseUrl_'+subMnuItmId).value;
	var mainPagUrl=document.getElementById(mnuItmId+'-URL').value;
	var baseURL=pagUrl.split("?")[0];
	if(mainPagUrl.indexOf(baseURL)>0)
	{
/*		Commented by Venkatesh, updating this in the db was causing serious memory overhead when the ordered columns were FKs
		var listOrderBy=document.getElementById(mnuItmId+'-listOrderBy');
		if(pagUrl.indexOf('?')>0)
			pageUriParams+=escape('&')+'order__by__1='+listOrderBy.value;
		else
			pageUriParams+=escape('?')+'order__by__1='+listOrderBy.value;
*/
		var pageSizeBox = document.getElementById(mnuItmId+"-pageSize");
		if (pageSizeBox && pageSizeBox.value && pageSizeBox.value > 0)
		{
			if(pagUrl.indexOf('?')>0)
				pageUriParams+=escape('&')+'page__size__1='+pageSizeBox.value;
			else
				pageUriParams+=escape('?')+'page__size__1='+pageSizeBox.value;
		}
		else
		{
			if(pagUrl.indexOf('?')>0)
				pageUriParams+=escape('&')+'page__size__1=10';
			else
				pageUriParams+=escape('?')+'page__size__1=10';
		}
		var colWidthBox=document.getElementById(mnuItmId+'-eachColWidth');
		if (colWidthBox && colWidthBox.value)
		{
			pageUriParams+=escape('&')+'list__column__width='+ReplaceAll(colWidthBox.value,"undefined","30");
		}
		if(document.getElementById(mnuItmId+"-filter"))
		{
			/*var filterBoxObj=document.getElementById(mnuItmId+"-filter");
			var filterBoxValue = filterBoxObj.options [filterBoxObj.selectedIndex].value;*/
			var filterBoxValue=document.getElementById(mnuItmId+"-filter").value;
			if (filterBoxValue)pageUriParams+=escape('&')+'filterName='+filterBoxValue;
		}
		var urltoupdateUPMI=zcServletPrefix+"/custom/JSON/updateUsrPrefs4MenuItems/editAction"+pageUriParams;
		$.ajax({
			type: "GET",
			sync: true,
			url: urltoupdateUPMI,
			success: function (){
			}
		});
	}
}

function sortList(currentSort,nodeId,columnHdg,hdr)
{
	var nowSort;
	var thElem=document.getElementById(hdr);
	var thElemDiv=thElem.getElementsByTagName('div');

	if(previousSortNode[mnuItmId])
	{
		var prevTh=document.getElementById(mnuItmId+"-"+previousSortNode[mnuItmId]);
		var prevThDiv=prevTh.getElementsByTagName('div');
		prevThDiv[0].style.backgroundColor = "";
		prevThDiv[0].title ="Sort ascending, by " + previousSortName;
		prevThDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortList("",'+previousSortNode[mnuItmId]+',"'+previousSortName+'","'+mnuItmId+"-"+previousSortNode[mnuItmId]+'")\'>'+previousSortName+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/rt_arrow.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
	}

    if (currentSort == nodeId) 
	{
		nowSort='-'+nodeId;
		prevThDiv[0].title ="Sort ascending, by " + columnHdg;
		thElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+nowSort+'",'+nodeId+',"'+columnHdg+'","'+hdr+'")\'>'+columnHdg+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-up.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
    }
	else if (currentSort == ('-' + nodeId)) 
	{
		nowSort=nodeId;
		prevThDiv[0].title ="Sort descending, by " + columnHdg;
		thElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+nowSort+'",'+nodeId+',"'+columnHdg+'","'+hdr+'")\'>'+columnHdg+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-down.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
    }  
	else 
	{
		nowSort=nodeId;
		if(prevThDiv)prevThDiv[0].title ="Sort descending, by " + columnHdg;
		thElemDiv[0].innerHTML='<span style="cursor:pointer;" onclick=\'sortList("'+nowSort+'",'+nodeId+',"'+columnHdg+'","'+hdr+'")\'>'+columnHdg+'&nbsp;&nbsp;<span style="background-image: url(/atCRM/images/JSON/drop-down.gif);background-repeat:no-repeat;">&nbsp;&nbsp;</span></span>';
    }
	thElemDiv[0].style.backgroundColor = "#DEE1E5";
	document.getElementById(mnuItmId+'-listOrderBy').value=nowSort;
	updateUriParams();
	var pagUrl=document.getElementById(mnuItmId+'-URL').value;
	var quesIndex=pagUrl.indexOf('?') != "-1" ? pagUrl.indexOf('?'): pagUrl.length; 
	var mainUrlPath=pagUrl.substring(0,quesIndex); 
	var mainUrlParms=pagUrl.substring(quesIndex+1,pagUrl.length); 
	var mainUrlParms=changeParameterValue (mainUrlParms,'order__by__1',nowSort);
	if(document.getElementById(mnuItmId+'-pagBx')){
		var currentPageNumber=document.getElementById(mnuItmId+'-pagBx').value;
		var mainUrlParms=changeParameterValue (mainUrlParms,'page__number__1',currentPageNumber);	
	}
	pagUrl=mainUrlPath+"?"+mainUrlParms;

	var pagUrlTmp=document.getElementById('baseUrl_'+subMnuItmId).value;
	var mainPagUrlTmp=document.getElementById(mnuItmId+'-URL').value;
	var baseURLTmp=pagUrlTmp.split("?")[0];
	if(mainPagUrlTmp.indexOf(baseURLTmp)>0)
		document.getElementById(mnuItmId+'-URL').value=pagUrl;
	setUpPageParameters(pagUrl,entityDiv,null,null,null,listPopup);

	previousSortNode[mnuItmId]=nodeId;
	previousSortName=columnHdg;
}

// Display search help
function showSearchHelp(ev,cTitle,tableName){
	if(!cTitle || cTitle==""){
		var cTitle="Search Help";
	}else{
		cTitle="Tips for "+cTitle+" search.";
	}
	if(document.all)
	{
	var X = (event.clientX);
	var Y = event.clientY;
	}
	else
	{
	var X = (ev.clientX);
	var Y = ev.clientY;
	}

	var commonHoverDiv=document.getElementById('commonHoverDiv');
	document.getElementById("commonHoverDiv").innerHTML="<div id='commonHoverDivHead' class='commonHoverHead'>"+cTitle+"<div style='text-align: right;cursor:pointer;color:#CC0066;padding-top:0px;padding-right:4px;float:right;width:25px;font-size: 11px;line-height:1' onclick='hideFullContent()'>Close</div></div><div id='commonHoverDivContent' name='commonHoverDivContent' style='padding:5px;text-align:justify;word-wrap: break-word;'></div>";
	commonHoverDiv.style.width="500px";
	maxPos=document.documentElement.clientWidth-600;
	if(X>maxPos)X=maxPos;

	commonHoverDiv.style.display="block";
	commonHoverDiv.style.top=Y+20+"px";
	commonHoverDiv.style.left=X+"px";
	commonHoverDiv.style.borderWidth="5px";
	var commonHoverDivContent=document.getElementById('commonHoverDivContent');
	commonHoverDivContent.innerHTML="This is search help text";
}

function chkAllLst(rows,elem)
{
	for(var i=0; i<rows; i++)
	{
		val=document.getElementById(mnuItmId+'-row-hdn-'+i).value.split('~id*')[1];
		document.getElementById(mnuItmId+"-"+val).checked=true;

		allIds=document.getElementById(mnuItmId+'-clipBoard').value;
		var chkExists=allIds.match(val+',');
		if(!chkExists)
		document.getElementById(mnuItmId+'-clipBoard').value+=val+',';

	}
	imgs=document.getElementsByTagName('img');
	for(var j=0; j<imgs.length; j++)
	{
		if(imgs[j].id==mnuItmId+"-chkAll")
		imgs[j].src='/atCRM/images/JSON/chkedAll.gif';
	}
}

function unChkAllLst(rows,elem)
{
	for(var i=0; i<rows; i++)
	{
		val=document.getElementById(mnuItmId+'-row-hdn-'+i).value.split('~id*')[1];
		document.getElementById(mnuItmId+"-"+val).checked=false;

		allIds=document.getElementById(mnuItmId+'-clipBoard').value;
		document.getElementById(mnuItmId+'-clipBoard').value=allIds.replace(val+',','');

	}
	imgs=document.getElementsByTagName('img');
	for(var j=0; j<imgs.length; j++)
	{
		if(imgs[j].id==mnuItmId+"-chkAll")
		imgs[j].src='/atCRM/images/JSON/chkAll.gif';
	}
}

function writeInClipBook(chk)
{
	val=chk.id.split('-')[1];
	if(chk.checked==true)
	{
		document.getElementById(mnuItmId+'-clipBoard').value+=val+',';
	}
	else
	{
		allIds=document.getElementById(mnuItmId+'-clipBoard').value;
		document.getElementById(mnuItmId+'-clipBoard').value=allIds.replace(val+',','');
	}
}

function writeDTbl (daTblHdr, daTblData) {
	var json_str = JSON.stringify(daTblData);
	var oTable = $('#reportData').daTable({
		"aaData": daTblData,
		"aoColumns": daTblHdr,
		"bPaginate": false,
		"bLengthChange": false,
		"sScrollX": "100%",
		"bProcessing": true,
		"bStateSave": true,
		"sDom": "\"<clear>\"RlfrTtip",
		"oTableTools": {
			"sSwfPath": "/atCRM/javascript/jquery/swf/copy_csv_xls_pdf.swf"
		},
		"aoColumnDefs": [{
				"fnRender": function ( o, val ) {
					if (!isNaN(parseFloat(val)) && isFinite(val)) {
						var parts=val.toString().split(".");
						return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
					} else {
						return val;
					}
				},
				"sClass": "alignRight",
				"aTargets": aoColD_targets
		}]
	});
}

$(document).ready(function() {

	$('body').on('click', '.show-actions-list', function() {
		//get the width and height of screen
		var w = screen.width;
		var h = screen.height;
		var td = $('#actions-pop-up-tbl .act-rows .actLstTab:first-child');
		//get the rows length
		var rh = $('#actions-pop-up-tbl .act-rows').length * (10+ +td.css('height').replace('px',''));
		if(rh >= h) {
			sh = (h-50); //set to max screen height
		} else {
			sh = rh + 100; //set to rows height
		}
		//now set the width
		var cw = $('#actions-pop-up-tbl .act-rows:first-child td').length * (10+ +td.css('width').replace('px','')); //get he columns width
		if((cw > w)) {
			sw = w - 50; //set to screen size
		} else {
			sw = cw + 50;
		}

		$('#actions-pop-up').dialog({
			resizable: true,
			autoOpen:true,
			modal: false,
			title:'Select Base Object',
			width:sw,
			height: sh
		});
	});

	//go to actions
	$('body').on('click', '.actLstTab', function() {
		var func = $(this).attr('goto');
		$('#actions-pop-up').dialog('close');
		eval(func);
	});

	//end of document ready
});